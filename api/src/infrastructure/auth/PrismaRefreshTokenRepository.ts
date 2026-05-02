import { PrismaClient } from '@prisma/client';
import { RefreshTokenRepository, RefreshTokenSession } from '../../domain/auth/RefreshTokenRepository';

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        user_id: userId,
        token_hash: tokenHash,
        expires_at: expiresAt,
      },
    });
  }

  async findActiveByHash(tokenHash: string): Promise<RefreshTokenSession | null> {
    const row = await this.prisma.refreshToken.findFirst({
      where: {
        token_hash: tokenHash,
        revoked_at: null,
        expires_at: { gt: new Date() },
      },
    });

    if (!row) return null;

    return {
      userId: row.user_id,
      tokenHash: row.token_hash,
      expiresAt: row.expires_at,
      revokedAt: row.revoked_at,
    };
  }

  async rotate(currentTokenHash: string, newTokenHash: string, newExpiresAt: Date): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      const currentToken = await tx.refreshToken.findFirst({
        where: {
          token_hash: currentTokenHash,
          revoked_at: null,
          expires_at: { gt: new Date() },
        },
      });

      if (!currentToken) return false;

      await tx.refreshToken.update({
        where: { token_hash: currentTokenHash },
        data: {
          revoked_at: new Date(),
          replaced_by_token_hash: newTokenHash,
        },
      });

      await tx.refreshToken.create({
        data: {
          user_id: currentToken.user_id,
          token_hash: newTokenHash,
          expires_at: newExpiresAt,
        },
      });

      return true;
    });
  }

  async revoke(tokenHash: string): Promise<boolean> {
    const token = await this.prisma.refreshToken.findUnique({
      where: { token_hash: tokenHash },
    });

    if (!token || token.revoked_at) return false;

    await this.prisma.refreshToken.update({
      where: { token_hash: tokenHash },
      data: { revoked_at: new Date() },
    });

    return true;
  }
}
