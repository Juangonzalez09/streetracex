import { z } from 'zod';

const emailMessage = 'email es obligatorio y debe tener un formato básico válido';
const passwordMessage = 'password es obligatorio y debe ser texto';

const nonEmptyString = (message: string) =>
  z
    .unknown()
    .refine((value): value is string => typeof value === 'string' && value.trim().length > 0, { message })
    .transform((value) => value.trim());

export const loginUserBodySchema = z.object({
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
});
