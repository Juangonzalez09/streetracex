import { z } from 'zod';

const optionalTrimmedString = z
  .string()
  .trim()
  .min(1, 'Filtro inválido')
  .optional();

export const listMatchmakingQuerySchema = z
  .object({
    page: z.coerce.number().int('page debe ser entero').min(1, 'page debe ser mayor o igual a 1').default(1),
    limit: z.coerce
      .number()
      .int('limit debe ser entero')
      .min(1, 'limit debe ser mayor o igual a 1')
      .max(50, 'limit debe ser menor o igual a 50')
      .default(10),
    zonaLocalidad: optionalTrimmedString,
    zonaCiudad: optionalTrimmedString,
    zonaEstado: optionalTrimmedString,
    zonaPais: optionalTrimmedString,
  })
  .strict()
  .transform((value) => ({
    page: value.page,
    limit: value.limit,
    filters: {
      zonaLocalidad: value.zonaLocalidad,
      zonaCiudad: value.zonaCiudad,
      zonaEstado: value.zonaEstado,
      zonaPais: value.zonaPais,
    },
  }));
