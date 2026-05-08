import { z } from 'zod';

export const adminListChallengesQuerySchema = z
  .object({
    estado: z
      .enum(['PENDIENTE', 'ACEPTADO', 'RECHAZADO', 'EN_CURSO', 'COMPLETADO', 'CANCELADO'], {
        message: 'estado debe ser PENDIENTE, ACEPTADO, RECHAZADO, EN_CURSO, COMPLETADO o CANCELADO',
      })
      .optional(),
    soloDisputas: z
      .enum(['true', 'false'])
      .transform((v) => v === 'true')
      .optional(),
  })
  .strict();