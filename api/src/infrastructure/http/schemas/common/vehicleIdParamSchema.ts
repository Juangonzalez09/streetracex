import { z } from 'zod';

export const vehicleIdParamSchema = z.object({
  vehicleId: z.string().uuid('vehicleId debe ser un UUID válido'),
});
