import { storage } from '../storage/mmkv';

export type BreadcrumbCategory =
  | 'navigation'
  | 'ui'
  | 'network'
  | 'state'
  | 'auth'
  | 'cart'
  | 'customizer';

export interface Breadcrumb {
  timestamp: string;
  category: BreadcrumbCategory;
  message: string;
  data?: Record<string, unknown>;
}

const MAX_BREADCRUMBS = 50;
const MMKV_KEY = '@cakebox_flight_recorder_breadcrumbs';

// In-memory cache for speed
let inMemoryBreadcrumbs: Breadcrumb[] = [];

function loadFromStorage(): Breadcrumb[] {
  try {
    const raw = storage.getString(MMKV_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore parse errors on corrupted local cache
  }
  return [];
}

// Initial hydration
inMemoryBreadcrumbs = loadFromStorage();

export function addBreadcrumb(
  category: BreadcrumbCategory,
  message: string,
  data?: Record<string, unknown>
): void {
  const newCrumb: Breadcrumb = {
    timestamp: new Date().toISOString(),
    category,
    message,
    data,
  };

  inMemoryBreadcrumbs.push(newCrumb);

  // Keep circular buffer capped at MAX_BREADCRUMBS
  if (inMemoryBreadcrumbs.length > MAX_BREADCRUMBS) {
    inMemoryBreadcrumbs.splice(0, inMemoryBreadcrumbs.length - MAX_BREADCRUMBS);
  }

  // Persist to MMKV
  try {
    storage.set(MMKV_KEY, JSON.stringify(inMemoryBreadcrumbs));
  } catch {
    // Failsafe
  }
}

export function getBreadcrumbs(): Breadcrumb[] {
  return [...inMemoryBreadcrumbs];
}

export function clearBreadcrumbs(): void {
  inMemoryBreadcrumbs = [];
  try {
    storage.remove(MMKV_KEY);
  } catch {
    // Failsafe
  }
}
