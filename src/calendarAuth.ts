const AUTH_STATE_KEY = 'nexus-calendar-auth';
const AUTH_SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

export type CalendarAuthState = {
  authenticatedAt: number;
  expiresAt: number;
};

export type CalendarEvent = {
  id: string;
  summary?: string;
  htmlLink?: string;
  start?: {
    date?: string;
    dateTime?: string;
  };
};

function getIdentity(): typeof chrome.identity {
  if (typeof chrome === 'undefined' || !chrome.identity) {
    throw new Error('O login do Google Calendar está disponível apenas na extensão instalada.');
  }

  return chrome.identity;
}

function hasChromeStorage(): boolean {
  return typeof chrome !== 'undefined' && Boolean(chrome.storage?.local);
}

async function readAuthState(): Promise<CalendarAuthState | undefined> {
  if (hasChromeStorage()) {
    const stored = await chrome.storage.local.get(AUTH_STATE_KEY);
    return stored[AUTH_STATE_KEY] as CalendarAuthState | undefined;
  }

  const stored = window.localStorage.getItem(AUTH_STATE_KEY);
  return stored ? (JSON.parse(stored) as CalendarAuthState) : undefined;
}

async function writeAuthState(state: CalendarAuthState | undefined): Promise<void> {
  if (hasChromeStorage()) {
    if (state) {
      await chrome.storage.local.set({ [AUTH_STATE_KEY]: state });
    } else {
      await chrome.storage.local.remove(AUTH_STATE_KEY);
    }
    return;
  }

  if (state) {
    window.localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(state));
  } else {
    window.localStorage.removeItem(AUTH_STATE_KEY);
  }
}

export async function getCalendarAuthState(): Promise<CalendarAuthState | undefined> {
  const state = await readAuthState();
  if (!state || state.expiresAt <= Date.now()) {
    if (state) await writeAuthState(undefined);
    return undefined;
  }

  return state;
}

export async function loginToCalendar(): Promise<CalendarAuthState> {
  const identity = getIdentity();
  await identity.clearAllCachedAuthTokens();
  const { token } = await identity.getAuthToken({ interactive: true });

  if (!token) {
    throw new Error('O Google não retornou um token de acesso.');
  }

  const now = Date.now();
  const state = {
    authenticatedAt: now,
    expiresAt: now + AUTH_SESSION_DURATION_MS,
  };
  await writeAuthState(state);
  return state;
}

export async function logoutFromCalendar(): Promise<void> {
  if (typeof chrome !== 'undefined' && chrome.identity) {
    await chrome.identity.clearAllCachedAuthTokens();
  }
  await writeAuthState(undefined);
}

async function getToken(): Promise<string> {
  const authState = await getCalendarAuthState();
  if (!authState) {
    throw new Error('Sua sessão do Google Calendar expirou. Clique em “Entrar novamente”.');
  }

  const { token } = await getIdentity().getAuthToken({ interactive: false });
  if (!token) {
    throw new Error('Não foi possível renovar o acesso ao Google Calendar.');
  }
  return token;
}

export async function listUpcomingCalendarEvents(): Promise<CalendarEvent[]> {
  let token = await getToken();
  const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
  url.searchParams.set('singleEvents', 'true');
  url.searchParams.set('orderBy', 'startTime');
  url.searchParams.set('timeMin', new Date().toISOString());
  url.searchParams.set('maxResults', '5');

  let response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401) {
    await getIdentity().removeCachedAuthToken({ token });
    token = await getToken();
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  if (!response.ok) {
    throw new Error(`Não foi possível carregar a agenda (HTTP ${response.status}).`);
  }

  const body = (await response.json()) as { items?: CalendarEvent[] };
  return body.items ?? [];
}
