import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny } from 'zod';

const buildValidator = (
  schema: ZodTypeAny,
  read: (req: Request) => unknown,
  write: (req: Request, parsed: unknown) => void
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(read(req));

    if (!result.success) {
      const message = result.error.issues[0]?.message ?? 'Body inválido';
      return res.status(422).json({
        success: false,
        message,
      });
    }

    write(req, result.data);
    next();
  };
};

export const validateBody = (schema: ZodTypeAny) => {
  return buildValidator(
    schema,
    (req) => req.body ?? {},
    (req, parsed) => {
      req.body = parsed;
    }
  );
};

export const validateParams = (schema: ZodTypeAny) => {
  return buildValidator(
    schema,
    (req) => req.params ?? {},
    (req, parsed) => {
      req.params = parsed as Request['params'];
    }
  );
};

export const validateQuery = (schema: ZodTypeAny) => {
  return buildValidator(
    schema,
    (req) => req.query ?? {},
    (req, parsed) => {
      req.query = parsed as Request['query'];
    }
  );
};
