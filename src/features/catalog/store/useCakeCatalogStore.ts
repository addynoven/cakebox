import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CakeItem } from '../models/cake.model';
import { INITIAL_CAKES } from '../data/seedCakes';
import { mmkvStateStorage } from '../../../core/storage';
import { CakeRepository } from '../repositories/cake.repository';

interface CakeCatalogState {
  cakes: CakeItem[];
  selectedCake: CakeItem | null;
  catalogCategory: string;
  searchQuery: string;
  isLoading: boolean;
  setCakes: (cakes: CakeItem[]) => void;
  setSelectedCake: (cake: CakeItem | null) => void;
  setCatalogCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setIsLoading: (loading: boolean) => void;
  initLiveSubscription: () => () => void;
}

export const useCakeCatalogStore = create<CakeCatalogState>()(
  persist(
    (set, get) => ({
      cakes: INITIAL_CAKES,
      selectedCake: null,
      catalogCategory: 'all',
      searchQuery: '',
      isLoading: false,

      setCakes: (cakes) => set({ cakes }),
      setSelectedCake: (selectedCake) => set({ selectedCake }),
      setCatalogCategory: (catalogCategory) => set({ catalogCategory }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setIsLoading: (isLoading) => set({ isLoading }),

      initLiveSubscription: () => {
        // Initial fetch
        CakeRepository.fetchCakes().then((cakes) => {
          if (cakes && cakes.length > 0) {
            set({ cakes });
          }
        });

        // Live subscription
        return CakeRepository.subscribeCakes((liveCakes) => {
          if (liveCakes && liveCakes.length > 0) {
            set({ cakes: liveCakes });
          }
        });
      },
    }),
    {
      name: 'cakebox-cakes-storage',
      storage: createJSONStorage(() => mmkvStateStorage),
    }
  )
);
