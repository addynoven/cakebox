import { useQuery } from '@tanstack/react-query';
import { CakeRepository } from '../repositories/cake.repository';
import { CakeItem } from '../models/cake.model';
import { cakeKeys } from '../keys';

export function useCakesQuery(category?: string) {
  return useQuery({
    queryKey: cakeKeys.list(category),
    queryFn: async (): Promise<CakeItem[]> => {
      const cakes = await CakeRepository.fetchCakes();
      if (category && category !== 'all') {
        return cakes.filter((c) => c.category === category);
      }
      return cakes;
    },
  });
}

export function useCakeDetailQuery(id: string) {
  return useQuery({
    queryKey: cakeKeys.detail(id),
    queryFn: async (): Promise<CakeItem | null> => {
      const cakes = await CakeRepository.fetchCakes();
      return cakes.find((c) => c.id === id) || null;
    },
    enabled: Boolean(id),
  });
}
