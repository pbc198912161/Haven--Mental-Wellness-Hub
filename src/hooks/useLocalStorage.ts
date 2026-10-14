import { useState, useEffect, useCallback } from 'react';
import { safeGetItem, safeSetItem } from '@/lib/storage';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => safeGetItem<T>(key, initialValue));

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((current) => {
        const valueToStore = value instanceof Function ? value(current) : value;
        safeSetItem<T>(key, valueToStore);
        return valueToStore;
      });
    },
    [key]
  );

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent<{ key?: string }>) => {
      const changedKey = 'key' in e ? e.key : e.detail?.key;
      if (!changedKey || changedKey === key) {
        setStoredValue(safeGetItem<T>(key, initialValue));
      }
    };

    window.addEventListener('storage', handleStorageChange as EventListener);
    window.addEventListener('haven:storage_updated', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
      window.removeEventListener('haven:storage_updated', handleStorageChange as EventListener);
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
}
