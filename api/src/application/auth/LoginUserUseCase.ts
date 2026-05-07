import bcrypt from 'bcryptjs';
import { UserRepository } from '../../domain/auth/UserRepository';
import { RefreshTokenRepository } from '../../domain/auth/RefreshTokenRepository';
import { User } from '../../domain/auth/User';
import {
  generateRefreshToken,
  getRefreshTokenExpiresAt,
  hashRefreshToken,
  issueAccessToken,
} from './tokenUtils';

// DTO: datos de entrada del caso de uso de login.
export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserResult {
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

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserResult> {
    const email = input.email.trim().toLowerCase();
    const password = input.password;

    if (!email || !password) {
      throw new Error('Email y password son obligatorios');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordIsValid) {
      throw new Error('Credenciales inválidas');
    }

    if (user.estado !== 'ACTIVO') {
      throw new Error('Tu cuenta no está activa');
    }

    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);
    const refreshTokenExpiresAt = getRefreshTokenExpiresAt();
    await this.refreshTokenRepository.create(user.id, refreshTokenHash, refreshTokenExpiresAt);

    const { accessToken, expiresIn } = issueAccessToken(user);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
      refreshToken,
      refreshTokenExpiresAt,
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
