import { z } from 'zod';

export const listNotificationsQuerySchema = z
  .object({
    soloNoLeidas: z
      .string()
      .optional()
      .transform((v) => v === 'true'),
  })
  .strict();