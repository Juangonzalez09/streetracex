import { Request, Response, NextFunction } from 'express';

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const rol = req.auth?.rol;
    if (!rol || !roles.includes(rol)) {
      return res.status(403).json({ success: false, message: 'Acceso denegado' });
    }
    next();
  };
}