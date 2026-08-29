import { createMMKV, type MMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

export interface StorageInterface {
  set(key: string, value: boolean | string | number | Uint8Array): void;
  getString(key: string): string | undefined;
  getNumber(key: string): number | undefined;
  getBoolean(key: string): boolean | undefined;
  remove(key: string): boolean | void;
  delete(key: string): boolean | void;
  clearAll(): void;
  getAllKeys(): string[];
}

class MemoryStorage implements StorageInterface {
  private store = new Map<string, string>();

  set(key: string, value: boolean | string | number | Uint8Array) {
    this.store.set(key, String(value));
  }

  getString(key: string): string | undefined {
    return this.store.get(key);
  }

  getNumber(key: string): number | undefined {
    const val = this.store.get(key);
    return val !== undefined ? Number(val) : undefined;
  }

  getBoolean(key: string): boolean | undefined {
    const val = this.store.get(key);
    return val !== undefined ? val === 'true' : undefined;
  }

  remove(key: string) {
    return this.store.delete(key);
  }

  delete(key: string) {
    return this.store.delete(key);
  }

  clearAll() {
    this.store.clear();
  }

  getAllKeys(): string[] {
    return Array.from(this.store.keys());
  }
}

class MMKVStorageWrapper implements StorageInterface {
  private mmkv: MMKV;

  constructor(mmkv: MMKV) {
    this.mmkv = mmkv;
  }

  set(key: string, value: boolean | string | number | Uint8Array) {
    this.mmkv.set(key, value as any);
  }

  getString(key: string): string | undefined {
    return this.mmkv.getString(key);
  }

  getNumber(key: string): number | undefined {
    return this.mmkv.getNumber(key);
  }

  getBoolean(key: string): boolean | undefined {
    return this.mmkv.getBoolean(key);
  }

  remove(key: string) {
    return this.mmkv.remove(key);
  }

  delete(key: string) {
    return this.mmkv.remove(key);
  }

  clearAll() {
    this.mmkv.clearAll();
  }

  getAllKeys(): string[] {
    return this.mmkv.getAllKeys();
  }
}

let storageInstance: StorageInterface;

try {
  const mmkv = createMMKV({
    id: 'cakebox-storage',
  });
  storageInstance = new MMKVStorageWrapper(mmkv);
} catch {
  storageInstance = new MemoryStorage();
}

export const storage = storageInstance;

export const mmkvStateStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },
  removeItem: (name: string): void => {
    storage.delete(name);
  },
};
