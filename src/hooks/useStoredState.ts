import { useState } from 'react';
import { readJSON, writeJSON } from '../storage/localStorage';

export function useStoredState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = readJSON<T | null>(key, null);
    if (stored === null) {
      writeJSON(key, initialValue);
      return initialValue;
    }
    return stored;
  });

  const update = (next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved =
        typeof next === 'function' ? (next as (current: T) => T)(prev) : next;
      writeJSON(key, resolved);
      return resolved;
    });
  };

  return [value, update] as const;
}
