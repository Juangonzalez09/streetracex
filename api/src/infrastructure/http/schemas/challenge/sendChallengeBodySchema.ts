import { z } from 'zod';

export const sendChallengeBodySchema = z
  .object({
    retadoId: z.string().uuid('retadoId debe ser un UUID válido'),
    tipoCarrera: z.enum(['CUARTO_MILLA', 'VUELTAS', 'DERRAPE'], {
      message: 'tipoCarrera debe ser CUARTO_MILLA, VUELTAS o DERRAPE',
    }),
    notas: z.string().max(500, 'Las notas no pueden exceder 500 caracteres').nullable().optional(),
    fechaAcordada: z
      .string()
      .datetime({ message: 'fechaAcordada debe ser una fecha ISO válida' })
      .nullable()
      .optional()
      .transform((v) => (v ? new Date(v) : null)),
  })
  .strict();