import { createMMKV, type MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

export const storage: MMKV = createMMKV({
  id: 'cakebox-storage'
});

export const mmkvStateStorage: StateStorage = {
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },
  getItem: (name: string): string | null => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string): void => {
    storage.remove(name);
  }
};
