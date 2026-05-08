import { PrismaClient, User as PrismaUser } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '../../domain/auth/User';
import { UserRepository } from '../../domain/auth/UserRepository';

export class PrismaUserRepository implements UserRepository {

  constructor(private readonly prisma: PrismaClient) {}

  async save(user: User): Promise<User> {
    try {
      const row = await this.prisma.user.create({
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          password_hash: user.passwordHash,
          rol: user.rol,
          rango: user.rango,
          estado: user.estado,
          foto_perfil: user.fotoPerfil,
          zona_localidad: user.zonaLocalidad,
          zona_ciudad: user.zonaCiudad,
          zona_estado: user.zonaEstado,
          zona_pais: user.zonaPais,
          categoria_id: user.categoriaId,
          victorias: user.victorias,
          derrotas: user.derrotas,
          retos_consecutivos: user.retosConsecutivos,
          matchmakingProfile: {
            create: {},
          },
        },
      });

      return this.toDomain(row);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new Error('El email o username ya está registrado');
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { email } });
    if (!row) return null;
    return this.toDomain(row);
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    if (!row) return null;
    return this.toDomain(row);
  }

  async findByUsername(username: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { username } });
    if (!row) return null;
    return this.toDomain(row);
  }

  private toDomain(row: PrismaUser): User {
    return new User(
      row.id,
      row.username,
      row.email,
      row.password_hash,
      row.rol,
      row.rango,
      row.estado,
      row.foto_perfil,
      row.zona_localidad,
      row.zona_ciudad,
      row.zona_estado,
      row.zona_pais,
      row.categoria_id,
      row.victorias,
      row.derrotas,
      row.retos_consecutivos,
      row.created_at,
      row.updated_at
    );
  }
}
