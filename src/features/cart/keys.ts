export const orderKeys = {
  all: ['orders'] as const,
  user: (userId: string) => [...orderKeys.all, 'user', userId] as const,
};
