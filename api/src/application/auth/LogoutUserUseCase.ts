import { RefreshTokenRepository } from '../../domain/auth/RefreshTokenRepository';
import { hashRefreshToken } from './tokenUtils';

export class LogoutUserUseCase {
  constructor(private readonly refreshTokenRepository: RefreshTokenRepository) {}

  async execute(refreshToken: string): Promise<void> {
    if (!refreshToken.trim()) return;

    const tokenHash = hashRefreshToken(refreshToken.trim());
    await this.refreshTokenRepository.revoke(tokenHash);
  }
}
