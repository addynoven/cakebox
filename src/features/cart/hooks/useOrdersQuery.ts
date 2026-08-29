import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrderRepository } from '../repositories/order.repository';
import { Order } from '../models/cart.model';
import { orderKeys } from '../keys';

export function useOrdersQuery(userId?: string) {
  return useQuery({
    queryKey: orderKeys.user(userId || 'anonymous'),
    queryFn: async (): Promise<Order[]> => {
      if (!userId) return [];
      return OrderRepository.fetchOrders(userId);
    },
    enabled: Boolean(userId),
  });
}

export function useSaveOrderMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: Order) => {
      return OrderRepository.saveOrder(order, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.user(userId) });
    },
  });
}
