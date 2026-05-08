import { z } from 'zod';

export const challengeStatusBodySchema = z
  .object({
    estado: z.enum(['ACEPTADO', 'RECHAZADO', 'CANCELADO', 'EN_CURSO'], {
      message: 'estado debe ser ACEPTADO, RECHAZADO, CANCELADO o EN_CURSO',
    }),
  })
  .strict();