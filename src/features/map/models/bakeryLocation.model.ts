import { z } from 'zod';

export const BakeryLocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  hours: z.string(),
  specialty: z.string(),
  distance: z.string(),
});

export type BakeryLocation = z.infer<typeof BakeryLocationSchema>;
