import { z } from 'zod';

const optionalNullableTrimmedString = z
  .union([z.string(), z.null()])
  .optional()
  .transform((value) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  });

const optionalTrimmedString = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .optional();

const currentYear = new Date().getFullYear();

export const updateMyVehicleBodySchema = z
  .object({
    tipoVehiculo: z
      .enum(['AUTO', 'MOTO', 'MONOPATIN_ELECTRICO'], {
        error: 'tipoVehiculo debe ser AUTO, MOTO o MONOPATIN_ELECTRICO',
      })
      .optional(),
    marca: optionalTrimmedString('marca no puede ser vacía'),
    modelo: optionalTrimmedString('modelo no puede ser vacío'),
    anio: z
      .number()
      .int('anio debe ser un número entero')
      .min(1900, 'anio debe ser mayor o igual a 1900')
      .max(currentYear + 1, `anio debe ser menor o igual a ${currentYear + 1}`)
      .optional(),
    color: optionalTrimmedString('color no puede ser vacío'),
    placa: optionalNullableTrimmedString,
    foto: optionalNullableTrimmedString,
    modificaciones: optionalNullableTrimmedString,
  })
  .strict();
