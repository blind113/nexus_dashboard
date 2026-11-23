import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  getCalendarAuthState,
  listUpcomingCalendarEvents,
  loginToCalendar,
  logoutFromCalendar,
  type CalendarAuthState,
  type CalendarEvent,
} from './calendarAuth';
import { createFavorite, loadData, saveData } from './storage';
import type { Favorite, FavoriteGroup, NexusData } from './types';

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function App() {
  const [data, setData] = useState<NexusData>();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [groupId, setGroupId] = useState('');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [now, setNow] = useState(new Date());
  const [calendarAuth, setCalendarAuth] = useState<CalendarAuthState>();
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [calendarError, setCalendarError] = useState('');
  const [calendarLoading, setCalendarLoading] = useState(false);

  useEffect(() => {
    loadData()
      .then(setData)
      .catch(() => setError('Não foi possível carregar os dados locais.'));
    getCalendarAuthState().then(setCalendarAuth).catch(() => setCalendarAuth(undefined));
    const interval = window.setInterval(() => {
      setNow(new Date());
      getCalendarAuthState().then(setCalendarAuth).catch(() => setCalendarAuth(undefined));
    }, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  async function handleCalendarLogin() {
    setCalendarError('');
    setCalendarLoading(true);
    try {
      const state = await loginToCalendar();
      setCalendarAuth(state);
      setCalendarEvents(await listUpcomingCalendarEvents());
    } catch (calendarLoginError) {
      setCalendarError(
        calendarLoginError instanceof Error
          ? calendarLoginError.message
          : 'Não foi possível conectar ao Google Calendar.',
      );
    } finally {
      setCalendarLoading(false);
    }
  }

  async function handleCalendarRefresh() {
    setCalendarError('');
    setCalendarLoading(true);
    try {
      setCalendarEvents(await listUpcomingCalendarEvents());
    } catch (calendarRefreshError) {
      setCalendarError(
        calendarRefreshError instanceof Error
          ? calendarRefreshError.message
          : 'Não foi possível atualizar a agenda.',
      );
    } finally {
      setCalendarLoading(false);
    }
  }

  async function handleCalendarLogout() {
    await logoutFromCalendar();
    setCalendarAuth(undefined);
    setCalendarEvents([]);
    setCalendarError('');
  }

  const visibleFavorites = useMemo(() => {
    if (!data) return [];
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return [...data.favorites]
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || a.position - b.position)
      .filter((favorite) => {
        if (!normalizedQuery) return true;
        return `${favorite.name} ${favorite.url}`.toLocaleLowerCase().includes(normalizedQuery);
      });
  }, [data, query]);

  async function persist(nextData: NexusData) {
    setData(nextData);
    await saveData(nextData);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const cleanName = name.trim();
    const cleanUrl = url.trim();

    if (!cleanName || !isValidUrl(cleanUrl)) {
      setError('Informe um nome e uma URL HTTP ou HTTPS válida.');
      return;
    }

    if (!data) return;
    const favorite = createFavorite(cleanName, cleanUrl, groupId || undefined);
    await persist({ ...data, favorites: [...data.favorites, favorite] });
    setName('');
    setUrl('');
    setGroupId('');
  }

  async function togglePinned(favorite: Favorite) {
    if (!data) return;
    await persist({
      ...data,
      favorites: data.favorites.map((item) =>
        item.id === favorite.id ? { ...item, pinned: !item.pinned, updatedAt: new Date().toISOString() } : item,
      ),
    });
  }

  async function removeFavorite(favorite: Favorite) {
    if (!data || !window.confirm(`Remover ${favorite.name}?`)) return;
    await persist({ ...data, favorites: data.favorites.filter((item) => item.id !== favorite.id) });
  }

  if (!data) {
    return <main className="app-shell loading-state">Carregando seu espaço...</main>;
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">N</span>
          <div>
            <p className="eyebrow">NEXUS / LOCAL COMMAND CENTER</p>
            <h1>Seu espaço de foco</h1>
          </div>
        </div>
        <div className="topbar-meta">
          <span className="status-dot" /> Dados locais
          <strong>{formatTime(now)}</strong>
        </div>
      </header>

      <section className="hero-grid">
        <article className="hero-card glow-card">
          <div>
            <p className="eyebrow">VISÃO DE HOJE</p>
            <h2>Olá, vamos avançar?</h2>
            <p className="muted">Sua base pessoal para acessar o que importa, sem ruído.</p>
          </div>
          <div className="hero-orbit" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </article>
        <article className="mini-card">
          <p className="eyebrow">AGENDA</p>
          <h3>Google Calendar</h3>
          {!calendarAuth ? (
            <>
              <p className="muted">Entre para ver os próximos eventos.</p>
              <button className="text-button" type="button" onClick={handleCalendarLogin} disabled={calendarLoading}>
                {calendarLoading ? 'Conectando...' : 'Entrar com Google →'}
              </button>
            </>
          ) : (
            <>
              <p className="muted">
                {calendarEvents.length ? `${calendarEvents.length} próximos eventos` : 'Nenhum evento próximo'}
              </p>
              <button className="text-button" type="button" onClick={handleCalendarRefresh} disabled={calendarLoading}>
                {calendarLoading ? 'Atualizando...' : 'Atualizar agenda →'}
              </button>
              <button className="text-button" type="button" onClick={handleCalendarLogout}>
                Desconectar
              </button>
              <small className="muted">
                Novo login necessário em{' '}
                {new Date(calendarAuth.expiresAt).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </small>
              {calendarEvents.length > 0 && (
                <ul className="calendar-event-list">
                  {calendarEvents.map((calendarEvent) => (
                    <li key={calendarEvent.id}>
                      {calendarEvent.htmlLink ? (
                        <a href={calendarEvent.htmlLink} target="_blank" rel="noreferrer">
                          {calendarEvent.summary || 'Evento sem título'}
                        </a>
                      ) : (
                        calendarEvent.summary || 'Evento sem título'
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
          {calendarError && <p className="form-error">{calendarError}</p>}
        </article>
        <article className="mini-card">
          <p className="eyebrow">NOTÍCIAS</p>
          <h3>Radar de interesses</h3>
          <p className="muted">Escolha temas para acompanhar novidades.</p>
          <button className="text-button" type="button" disabled>
            Configurar em breve →
          </button>
        </article>
      </section>

      <section className="content-grid">
        <div className="panel favorites-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">ACESSOS FAVORITOS</p>
              <h2>Seus sistemas</h2>
            </div>
            <span className="count-badge">{visibleFavorites.length}</span>
          </div>

          <form className="favorite-form" onSubmit={handleSubmit}>
            <input
              aria-label="Nome do acesso"
              placeholder="Nome do acesso"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <input
              aria-label="URL do acesso"
              placeholder="https://seu-sistema.com"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
            <select aria-label="Grupo do acesso" value={groupId} onChange={(event) => setGroupId(event.target.value)}>
              <option value="">Sem grupo</option>
              {data.groups
                .sort((a, b) => a.position - b.position)
                .map((group: FavoriteGroup) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
            </select>
            <button className="primary-button" type="submit">
              Adicionar
            </button>
          </form>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <div className="search-row">
            <label htmlFor="favorite-search">Buscar acessos</label>
            <input
              id="favorite-search"
              placeholder="Nome ou domínio..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          {visibleFavorites.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">✦</span>
              <h3>Nenhum acesso salvo</h3>
              <p>Adicione seu primeiro sistema acima para criar seu command center.</p>
            </div>
          ) : (
            <div className="favorite-list">
              {visibleFavorites.map((favorite) => (
                <article className="favorite-item" key={favorite.id}>
                  <button
                    className="favorite-main"
                    type="button"
                    onClick={() => window.open(favorite.url, '_blank', 'noopener,noreferrer')}
                  >
                    <span className="site-avatar">{favorite.name.slice(0, 1).toUpperCase()}</span>
                    <span>
                      <strong>{favorite.name}</strong>
                      <small>{new URL(favorite.url).hostname}</small>
                    </span>
                  </button>
                  <div className="item-actions">
                    <button
                      className={favorite.pinned ? 'icon-button active' : 'icon-button'}
                      type="button"
                      aria-label="Fixar acesso"
                      onClick={() => togglePinned(favorite)}
                    >
                      {favorite.pinned ? '★' : '☆'}
                    </button>
                    <button
                      className="icon-button danger"
                      type="button"
                      aria-label={`Remover ${favorite.name}`}
                      onClick={() => removeFavorite(favorite)}
                    >
                      ×
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="side-column">
          <div className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">INTEGRAÇÕES</p>
                <h2>Conexões</h2>
              </div>
            </div>
            <div className="integration-row">
              <span className="integration-icon">G</span>
              <span>
                <strong>Google Calendar</strong>
                <small>{calendarAuth ? 'Conectado nesta sessão' : 'Login necessário'}</small>
              </span>
              <span className="coming-soon">{calendarAuth ? 'Ativo' : 'Conectar acima'}</span>
            </div>
            <div className="integration-row">
              <span className="integration-icon jira">J</span>
              <span>
                <strong>Jira Cloud</strong>
                <small>Validação de segurança pendente</small>
              </span>
              <span className="coming-soon">Em breve</span>
            </div>
          </div>
          <div className="panel quick-panel">
            <p className="eyebrow">ATALHOS</p>
            <div className="shortcut">
              <kbd>⌘</kbd>
              <kbd>K</kbd>
              <span>Buscar rapidamente</span>
            </div>
            <div className="shortcut">
              <kbd>N</kbd>
              <span>Novo acesso</span>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
