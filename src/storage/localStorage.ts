type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

const memoryStore = new Map<string, string>();

function resolveStorage(): StorageLike {
  try {
    if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
      const ls = globalThis.localStorage;
      const probe = '@fithit/probe';
      ls.setItem(probe, '1');
      ls.removeItem(probe);
      return ls;
    }
  } catch {
    return memoryStorage();
  }
  return memoryStorage();
}

function memoryStorage(): StorageLike {
  return {
    getItem: (key) => (memoryStore.has(key) ? (memoryStore.get(key) as string) : null),
    setItem: (key, value) => {
      memoryStore.set(key, value);
    },
  };
}

const storage = resolveStorage();

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = storage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    memoryStore.set(key, JSON.stringify(value));
  }
}

export const STORAGE_KEYS = {
  glucoseReadings: '@fithit/glucose/readings',
  hospitals: '@fithit/hospitals',
  upcomingExams: '@fithit/exams/upcoming',
  examResults: '@fithit/exams/results',
  examInfo: '@fithit/exams/info',
  meals: '@fithit/nutrition/meals',
  nutritionTips: '@fithit/nutrition/tips',
  foodsToAvoid: '@fithit/nutrition/foods-to-avoid',
  recommendedFoods: '@fithit/nutrition/recommended-foods',
  user: '@fithit/user',
} as const;
