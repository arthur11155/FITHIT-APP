import { useState } from 'react';
import { readJSON, writeJSON } from '../storage/localStorage';

export function useStoredState<T>(key: string, seed: T) {
  const [value, setValue] = useState<T>(() => readJSON(key, seed));

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
