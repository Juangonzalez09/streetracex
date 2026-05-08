import { z } from 'zod';

export const adminResolveBodySchema = z
  .object({
    ganadorId: z.string().uuid('ganadorId debe ser un UUID válido'),
  })
  .strict();