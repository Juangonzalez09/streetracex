import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '../../domain/auth/User';
import { UserRepository } from '../../domain/auth/UserRepository';

export class PrismaUserRepository implements UserRepository {

  constructor(private readonly prisma: PrismaClient) {}

  async save(user: User): Promise<void> {
    try {
      await this.prisma.user.create({
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          password_hash: user.password_hash,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new Error('El email o username ya está registrado');
      }
      throw new Error('No se pudo guardar el usuario en la base de datos');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { email } });
    if (!row) return null;
    return new User(row.id, row.username, row.email, row.password_hash, row.rango, row.estado, row.created_at);
  }

  async findByUsername(username: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { username } });
    if (!row) return null;
    return new User(row.id, row.username, row.email, row.password_hash, row.rango, row.estado, row.created_at);
  }
}
