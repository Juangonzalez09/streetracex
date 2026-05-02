import { NextFunction, Request, Response } from 'express';

export const validateLoginUserBody = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body ?? {};
  const { email, password } = body;

  if (typeof email !== 'string' || email.trim().length === 0 || !email.includes('@')) {
    return res.status(422).json({
      success: false,
      message: 'email es obligatorio y debe tener un formato básico válido',
    });
  }

  if (typeof password !== 'string' || password.length === 0) {
    return res.status(422).json({
      success: false,
      message: 'password es obligatorio y debe ser texto',
    });
  }

  req.body = {
    email: email.trim().toLowerCase(),
    password,
  };

  next();
};
