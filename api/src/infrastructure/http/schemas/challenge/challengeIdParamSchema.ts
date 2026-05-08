import { z } from 'zod';

export const challengeIdParamSchema = z.object({
  challengeId: z.string().uuid('challengeId debe ser un UUID válido'),
});