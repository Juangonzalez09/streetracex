import { z } from 'zod';

export const trackIdParamSchema = z.object({
  trackId: z.string().uuid('trackId debe ser un UUID válido'),
});