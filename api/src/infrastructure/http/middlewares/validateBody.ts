import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny } from 'zod';

export const validateBody = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body ?? {});

    if (!result.success) {
      const message = result.error.issues[0]?.message ?? 'Body inválido';
      return res.status(422).json({
        success: false,
        message,
      });
    }

    req.body = result.data;
    next();
  };
};
