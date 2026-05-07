import { RefreshTokenRepository } from '../../domain/auth/RefreshTokenRepository';
import { UserRepository } from '../../domain/auth/UserRepository';
import { User } from '../../domain/auth/User';
import {
  generateRefreshToken,
  getRefreshTokenExpiresAt,
  hashRefreshToken,
  issueAccessToken,
} from './tokenUtils';

// DTO: datos de entrada para refrescar sesión.
export interface RefreshSessionInput {
  refreshToken: string;
}

export interface RefreshSessionResult {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  user: {
    id: string;
    username: string;
    email: string;
    rol: string;
    rango: string;
  };
}

export class RefreshSessionUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

  async execute(input: RefreshSessionInput): Promise<RefreshSessionResult> {
    const rawRefreshToken = input.refreshToken.trim();
    if (!rawRefreshToken) {
      throw new Error('Refresh token requerido');
    }

    const currentTokenHash = hashRefreshToken(rawRefreshToken);
    const activeSession = await this.refreshTokenRepository.findActiveByHash(currentTokenHash);
    if (!activeSession) {
      throw new Error('Refresh token inválido o expirado');
    }

    const user = await this.userRepository.findById(activeSession.userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (user.estado !== 'ACTIVO') {
      throw new Error('Tu cuenta no está activa');
    }

    const newRefreshToken = generateRefreshToken();
    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);
    const newRefreshTokenExpiresAt = getRefreshTokenExpiresAt();

    const rotated = await this.refreshTokenRepository.rotate(
      currentTokenHash,
      newRefreshTokenHash,
      newRefreshTokenExpiresAt
    );

    if (!rotated) {
      throw new Error('Refresh token inválido o expirado');
    }

    const { accessToken, expiresIn } = issueAccessToken(user);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
      refreshToken: newRefreshToken,
      refreshTokenExpiresAt: newRefreshTokenExpiresAt,
      user: toSessionUser(user),
    };
  }
}

const toSessionUser = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    rol: user.rol,
    rango: user.rango,
  };
};
