import { createHash, randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../../domain/auth/User';

export const getAccessTokenExpiresIn = (): NonNullable<jwt.SignOptions['expiresIn']> => {
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;
  return expiresIn && expiresIn.trim().length > 0
    ? (expiresIn as NonNullable<jwt.SignOptions['expiresIn']>)
    : '15m';
};

export const getRefreshTokenTtlDays = (): number => {
  const rawValue = process.env.REFRESH_TOKEN_TTL_DAYS || '7';
  const ttlDays = Number(rawValue);

  if (!Number.isInteger(ttlDays) || ttlDays < 1 || ttlDays > 30) {
    throw new Error('REFRESH_TOKEN_TTL_DAYS debe ser un número entero entre 1 y 30');
  }

  return ttlDays;
};

export const getRefreshTokenExpiresAt = (): Date => {
  const ttlDays = getRefreshTokenTtlDays();
  return new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
};

export const issueAccessToken = (user: User): { accessToken: string; expiresIn: string } => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET no está configurado');
  }

  const expiresIn = getAccessTokenExpiresIn();
  let accessToken: string;

  try {
    accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        rol: user.rol,
      },
      jwtSecret,
      { expiresIn }
    );
  } catch {
    throw new Error('ACCESS_TOKEN_EXPIRES_IN inválido');
  }

  return {
    accessToken,
    expiresIn: typeof expiresIn === 'number' ? `${expiresIn}s` : expiresIn,
  };
};

export const generateRefreshToken = (): string => {
  return randomBytes(64).toString('base64url');
};

export const hashRefreshToken = (token: string): string => {
  return createHash('sha256').update(token).digest('hex');
};
