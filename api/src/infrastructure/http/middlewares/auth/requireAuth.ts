import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AuthContext } from '../../../../shared/http/AuthContext';

interface AccessTokenPayload {
  sub?: string;
  email?: string;
  rol?: string;
}

const getBearerToken = (headerValue?: string): string | null => {
  if (!headerValue) return null;
  const [scheme, token] = headerValue.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({
      success: false,
      message: 'Error de configuración del servidor',
    });
  }

  const token = getBearerToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de acceso requerido',
    });
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as AccessTokenPayload;
    if (!payload.sub || !payload.email || !payload.rol) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
      });
    }

    const rol = payload.rol === 'ADMINISTRADOR' ? 'ADMINISTRADOR' : payload.rol === 'PILOTO' ? 'PILOTO' : null;
    if (!rol) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
      });
    }

    const authContext: AuthContext = {
      userId: payload.sub,
      email: payload.email,
      rol,
    };

    req.auth = authContext;
    next();
  } catch (error: unknown) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
      });
    }

    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno al validar token',
    });
  }
};
