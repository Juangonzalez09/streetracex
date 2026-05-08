import { z } from 'zod';

export const getChallengesQuerySchema = z.object({
  tipo: z.enum(['enviados', 'recibidos', 'todos']).optional().default('todos'),
  estado: z
    .enum(['PENDIENTE', 'ACEPTADO', 'RECHAZADO', 'EN_CURSO', 'COMPLETADO', 'CANCELADO'])
    .optional(),
});