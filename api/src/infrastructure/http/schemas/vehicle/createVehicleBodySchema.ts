import { z } from 'zod';

const optionalNullableTrimmedString = z
  .union([z.string(), z.null()])
  .optional()
  .transform((value) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  });

const requiredTrimmedString = (message: string) =>
  z
    .string({ error: message })
    .trim()
    .min(1, message);

const currentYear = new Date().getFullYear();

export const createVehicleBodySchema = z
  .object({
    tipoVehiculo: z.enum(['AUTO', 'MOTO', 'MONOPATIN_ELECTRICO'], {
      error: 'tipoVehiculo debe ser AUTO, MOTO o MONOPATIN_ELECTRICO',
    }),
    marca: requiredTrimmedString('marca es obligatoria'),
    modelo: requiredTrimmedString('modelo es obligatorio'),
    anio: z
      .number({ error: 'anio es obligatorio y debe ser número' })
      .int('anio debe ser un número entero')
      .min(1900, 'anio debe ser mayor o igual a 1900')
      .max(currentYear + 1, `anio debe ser menor o igual a ${currentYear + 1}`),
    color: requiredTrimmedString('color es obligatorio'),
    placa: optionalNullableTrimmedString,
    foto: optionalNullableTrimmedString,
    modificaciones: optionalNullableTrimmedString,
  })
  .strict();
