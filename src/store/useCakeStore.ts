import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CakeItem } from '../types';
import { INITIAL_CAKES } from '../data/cakes';
import { mmkvStateStorage } from './mmkvStorage';

interface CakeState {
  cakes: CakeItem[];
  selectedCake: CakeItem | null;
  catalogCategory: string;
  isLoading: boolean;
  setCakes: (cakes: CakeItem[]) => void;
  setSelectedCake: (cake: CakeItem | null) => void;
  setCatalogCategory: (category: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useCakeStore = create<CakeState>()(
  persist(
    (set) => ({
      cakes: INITIAL_CAKES,
      selectedCake: null,
      catalogCategory: 'all',
      isLoading: false,
      setCakes: (cakes) => set({ cakes }),
      setSelectedCake: (selectedCake) => set({ selectedCake }),
      setCatalogCategory: (catalogCategory) => set({ catalogCategory }),
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'cakebox-cakes-storage',
      storage: createJSONStorage(() => mmkvStateStorage),
    }
  )
);
