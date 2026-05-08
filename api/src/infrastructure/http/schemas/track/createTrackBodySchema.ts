import { z } from 'zod';

const optionalNullableTrimmedString = z
  .union([z.string(), z.null()])
  .optional()
  .transform((value) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  });

export const createTrackBodySchema = z
  .object({
    nombre: z.string({ error: 'nombre es obligatorio' }).trim().min(1, 'nombre es obligatorio').max(100, 'nombre no puede exceder 100 caracteres'),
    descripcion: optionalNullableTrimmedString,
    tipoCarrera: z.enum(['CUARTO_MILLA', 'VUELTAS', 'DERRAPE'], {
      message: 'tipoCarrera debe ser CUARTO_MILLA, VUELTAS o DERRAPE',
    }),
    dificultad: z.string().trim().max(50, 'dificultad no puede exceder 50 caracteres').nullable().optional(),
    coordenadas: z.string().trim().max(100, 'coordenadas no pueden exceder 100 caracteres').nullable().optional(),
  })
  .strict();