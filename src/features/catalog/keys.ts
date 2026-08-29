export const cakeKeys = {
  all: ['cakes'] as const,
  lists: () => [...cakeKeys.all, 'list'] as const,
  list: (category?: string) => [...cakeKeys.lists(), category || 'all'] as const,
  details: () => [...cakeKeys.all, 'detail'] as const,
  detail: (id: string) => [...cakeKeys.details(), id] as const,
};
