import { z } from 'zod';

const optionalNullableString = z.union([z.string(), z.null()]).optional();

const nonEmptyString = (message: string) =>
  z
    .unknown()
    .refine((value): value is string => typeof value === 'string' && value.trim().length > 0, { message })
    .transform((value) => value.trim());

const usernameMessage = 'username es obligatorio y debe ser texto';
const emailMessage = 'email es obligatorio y debe tener un formato básico válido';
const passwordMessage = 'password es obligatorio y debe ser texto';

export const registerUserBodySchema = z.object({
  username: nonEmptyString(usernameMessage),
  email: nonEmptyString(emailMessage)
    .refine((value) => value.includes('@'), {
      message: emailMessage,
    })
    .transform((value) => value.toLowerCase()),
  password: z
    .unknown()
    .refine((value): value is string => typeof value === 'string' && value.length > 0, {
      message: passwordMessage,
    }),
  fotoPerfil: optionalNullableString,
  zonaLocalidad: optionalNullableString,
  zonaCiudad: optionalNullableString,
  zonaEstado: optionalNullableString,
  zonaPais: optionalNullableString,
});
