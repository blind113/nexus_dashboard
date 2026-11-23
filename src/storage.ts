import type { Favorite, FavoriteGroup, NexusData } from './types';

const STORAGE_KEY = 'nexus-data';

const defaultData: NexusData = {
  groups: [
    { id: 'work', name: 'Trabalho', position: 0 },
    { id: 'development', name: 'Desenvolvimento', position: 1 },
    { id: 'personal', name: 'Pessoal', position: 2 },
  ],
  favorites: [],
};

function isChromeStorageAvailable(): boolean {
  return typeof chrome !== 'undefined' && Boolean(chrome.storage?.local);
}

export async function loadData(): Promise<NexusData> {
  if (isChromeStorageAvailable()) {
    const stored = await chrome.storage.local.get(STORAGE_KEY);
    return stored[STORAGE_KEY] ? normalizeData(stored[STORAGE_KEY]) : defaultData;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored ? normalizeData(JSON.parse(stored)) : defaultData;
}

export async function saveData(data: NexusData): Promise<void> {
  if (isChromeStorageAvailable()) {
    await chrome.storage.local.set({ [STORAGE_KEY]: data });
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function createFavorite(name: string, url: string, groupId?: string): Favorite {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name,
    url,
    groupId,
    pinned: false,
    position: Date.now(),
    createdAt: now,
    updatedAt: now,
  };
}

export function createGroup(name: string, position: number): FavoriteGroup {
  return {
    id: crypto.randomUUID(),
    name,
    position,
  };
}

function normalizeData(value: unknown): NexusData {
  if (!value || typeof value !== 'object') {
    return defaultData;
  }

  const candidate = value as Partial<NexusData>;
  return {
    groups: Array.isArray(candidate.groups) ? candidate.groups : defaultData.groups,
    favorites: Array.isArray(candidate.favorites) ? candidate.favorites : [],
  };
}
