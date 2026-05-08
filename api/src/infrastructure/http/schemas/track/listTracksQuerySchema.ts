import { z } from 'zod';

export const listTracksQuerySchema = z
  .object({
    tipoCarrera: z.enum(['CUARTO_MILLA', 'VUELTAS', 'DERRAPE']).optional(),
    soloActivas: z
      .string()
      .optional()
      .transform((v) => v !== 'false'),
  })
  .strict();