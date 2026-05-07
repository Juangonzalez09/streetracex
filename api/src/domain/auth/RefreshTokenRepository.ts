export interface RefreshTokenSession {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

export interface RefreshTokenRepository {
  create(userId: string, tokenHash: string, expiresAt: Date): Promise<void>;
  findActiveByHash(tokenHash: string): Promise<RefreshTokenSession | null>;
  rotate(currentTokenHash: string, newTokenHash: string, newExpiresAt: Date): Promise<boolean>;
  revoke(tokenHash: string): Promise<boolean>;
}
