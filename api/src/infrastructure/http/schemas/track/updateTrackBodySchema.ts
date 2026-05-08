import { z } from 'zod';

export const updateTrackBodySchema = z
  .object({
    nombre: z.string().trim().min(1, 'nombre no puede estar vacío').max(100, 'nombre no puede exceder 100 caracteres').optional(),
    descripcion: z.string().trim().nullable().optional(),
    dificultad: z.string().trim().max(50, 'dificultad no puede exceder 50 caracteres').nullable().optional(),
    coordenadas: z.string().trim().max(100, 'coordenadas no pueden exceder 100 caracteres').nullable().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, { message: 'Debes enviar al menos un campo para actualizar' });
