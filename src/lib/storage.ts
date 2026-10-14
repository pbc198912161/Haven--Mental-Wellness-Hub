import { CheckIn, GratitudeEntry, BreathingSession, Prefs, TrustedContact } from '@/types';

const STORAGE_PREFIX = 'haven:v1:';

export const STORAGE_KEYS = {
  checkins: `${STORAGE_PREFIX}checkins`,
  gratitude: `${STORAGE_PREFIX}gratitude`,
  breathing: `${STORAGE_PREFIX}breathing`,
  prefs: `${STORAGE_PREFIX}prefs`,
  contact: `${STORAGE_PREFIX}contact`,
  nudgeDismissedFor: `${STORAGE_PREFIX}nudgeDismissedFor`,
  reminderDismissedDate: `${STORAGE_PREFIX}reminderDismissedDate`,
} as const;

export const DEFAULT_PREFS: Prefs = {
  theme: 'system',
  reminderOn: false,
  reminderTime: '20:00',
  blurJournal: false,
  soundVolume: 0.5,
};

// In-memory fallback if localStorage is unavailable
const memoryFallback: Record<string, string> = {};
let isStorageAvailableCache: boolean | null = null;

export function isLocalStorageAvailable(): boolean {
  if (isStorageAvailableCache !== null) return isStorageAvailableCache;
  try {
    const testKey = `${STORAGE_PREFIX}__test__`;
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    isStorageAvailableCache = true;
    return true;
  } catch {
    isStorageAvailableCache = false;
    return false;
  }
}

export function safeGetItem<T>(key: string, fallback: T): T {
  try {
    let item: string | null = null;
    if (isLocalStorageAvailable()) {
      item = window.localStorage.getItem(key);
    } else {
      item = memoryFallback[key] ?? null;
    }
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`[Haven] Failed to read key "${key}" from storage:`, err);
    return fallback;
  }
}

export function safeSetItem<T>(key: string, value: T): boolean {
  try {
    const serialized = JSON.stringify(value);
    if (isLocalStorageAvailable()) {
      window.localStorage.setItem(key, serialized);
    } else {
      memoryFallback[key] = serialized;
    }
    // Dispatch storage event to notify other components/tabs
    window.dispatchEvent(new CustomEvent('haven:storage_updated', { detail: { key } }));
    return true;
  } catch (err) {
    console.warn(`[Haven] Failed to write key "${key}" to storage:`, err);
    memoryFallback[key] = JSON.stringify(value);
    return false;
  }
}

export function safeRemoveItem(key: string): void {
  try {
    if (isLocalStorageAvailable()) {
      window.localStorage.removeItem(key);
    }
    delete memoryFallback[key];
    window.dispatchEvent(new CustomEvent('haven:storage_updated', { detail: { key } }));
  } catch (err) {
    console.warn(`[Haven] Failed to remove key "${key}":`, err);
  }
}

// Higher level helpers

export function loadCheckIns(): CheckIn[] {
  return safeGetItem<CheckIn[]>(STORAGE_KEYS.checkins, []);
}

export function saveCheckIn(checkIn: CheckIn): { isUpdate: boolean; checkIns: CheckIn[] } {
  const current = loadCheckIns();
  const existingIndex = current.findIndex((c) => c.date === checkIn.date);
  let updatedList: CheckIn[];
  let isUpdate = false;

  if (existingIndex >= 0) {
    isUpdate = true;
    updatedList = [...current];
    updatedList[existingIndex] = { ...checkIn, updatedAt: Date.now() };
  } else {
    updatedList = [checkIn, ...current];
  }

  // Sort newest date first
  updatedList.sort((a, b) => b.date.localeCompare(a.date));
  safeSetItem(STORAGE_KEYS.checkins, updatedList);
  return { isUpdate, checkIns: updatedList };
}

export function deleteCheckIn(date: string): CheckIn[] {
  const current = loadCheckIns();
  const updated = current.filter((c) => c.date !== date);
  safeSetItem(STORAGE_KEYS.checkins, updated);
  return updated;
}

export function loadGratitudeEntries(): GratitudeEntry[] {
  const entries = safeGetItem<GratitudeEntry[]>(STORAGE_KEYS.gratitude, []);
  return entries.sort((a, b) => b.createdAt - a.createdAt);
}

export function saveGratitudeEntry(entry: GratitudeEntry): GratitudeEntry[] {
  const current = loadGratitudeEntries();
  const existingIdx = current.findIndex((e) => e.id === entry.id);
  let updated: GratitudeEntry[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = entry;
  } else {
    updated = [entry, ...current];
  }
  updated.sort((a, b) => b.createdAt - a.createdAt);
  safeSetItem(STORAGE_KEYS.gratitude, updated);
  return updated;
}

export function deleteGratitudeEntry(id: string): GratitudeEntry[] {
  const current = loadGratitudeEntries();
  const updated = current.filter((e) => e.id !== id);
  safeSetItem(STORAGE_KEYS.gratitude, updated);
  return updated;
}

export function loadBreathingSessions(): BreathingSession[] {
  const sessions = safeGetItem<BreathingSession[]>(STORAGE_KEYS.breathing, []);
  return sessions.sort((a, b) => b.createdAt - a.createdAt);
}

export function saveBreathingSession(session: BreathingSession): BreathingSession[] {
  const current = loadBreathingSessions();
  const updated = [session, ...current];
  safeSetItem(STORAGE_KEYS.breathing, updated);
  return updated;
}

export function loadPrefs(): Prefs {
  const saved = safeGetItem<Partial<Prefs>>(STORAGE_KEYS.prefs, {});
  return { ...DEFAULT_PREFS, ...saved };
}

export function savePrefs(prefs: Partial<Prefs>): Prefs {
  const current = loadPrefs();
  const updated = { ...current, ...prefs };
  safeSetItem(STORAGE_KEYS.prefs, updated);
  return updated;
}

export function loadTrustedContact(): TrustedContact | null {
  return safeGetItem<TrustedContact | null>(STORAGE_KEYS.contact, null);
}

export function saveTrustedContact(contact: TrustedContact | null): void {
  if (contact === null) {
    safeRemoveItem(STORAGE_KEYS.contact);
  } else {
    safeSetItem(STORAGE_KEYS.contact, contact);
  }
}

export function hasActiveDemoData(): boolean {
  const checkins = loadCheckIns();
  const gratitude = loadGratitudeEntries();
  const breathing = loadBreathingSessions();
  return (
    checkins.some((c) => c.demo) ||
    gratitude.some((g) => g.demo) ||
    breathing.some((b) => b.demo)
  );
}

export function clearDemoData(): void {
  const checkins = loadCheckIns().filter((c) => !c.demo);
  safeSetItem(STORAGE_KEYS.checkins, checkins);

  const gratitude = loadGratitudeEntries().filter((g) => !g.demo);
  safeSetItem(STORAGE_KEYS.gratitude, gratitude);

  const breathing = loadBreathingSessions().filter((b) => !b.demo);
  safeSetItem(STORAGE_KEYS.breathing, breathing);
}

export function eraseAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    safeRemoveItem(key);
  });
  window.localStorage.clear();
}

export function exportAllDataAsJSON(): string {
  const data = {
    exportedAt: new Date().toISOString(),
    havenVersion: 'v1',
    checkins: loadCheckIns(),
    gratitude: loadGratitudeEntries(),
    breathing: loadBreathingSessions(),
    prefs: loadPrefs(),
    contact: loadTrustedContact(),
  };
  return JSON.stringify(data, null, 2);
}
