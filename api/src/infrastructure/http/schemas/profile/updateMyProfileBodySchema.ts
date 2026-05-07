import { z } from 'zod';

const optionalNullableTrimmedString = z
  .union([z.string(), z.null()])
  .optional()
  .transform((value) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  });

export const updateMyProfileBodySchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, 'El username debe tener entre 3 y 50 caracteres')
      .max(50, 'El username debe tener entre 3 y 50 caracteres')
      .regex(/^[a-zA-Z0-9_]+$/, 'El username solo puede contener letras, números y guion bajo')
      .optional(),
    fotoPerfil: optionalNullableTrimmedString,
    zonaLocalidad: optionalNullableTrimmedString,
    zonaCiudad: optionalNullableTrimmedString,
    zonaEstado: optionalNullableTrimmedString,
    zonaPais: optionalNullableTrimmedString,
  })
  .strict();
