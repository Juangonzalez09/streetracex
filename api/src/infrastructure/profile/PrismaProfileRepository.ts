import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  MyProfile,
  ProfileRepository,
  PublicProfile,
  RankUpdateResult,
  UpdateProfileInput,
  VehicleSummary,
} from '../../domain/profile/ProfileRepository';

export class PrismaProfileRepository implements ProfileRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMyProfileById(userId: string): Promise<MyProfile | null> {
    const row = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        vehicles: {
          orderBy: [{ activo: 'desc' }, { created_at: 'desc' }],
        },
      },
    });

    if (!row) return null;
    return this.toMyProfile(row);
  }

  async findPublicProfileById(userId: string): Promise<PublicProfile | null> {
    const row = await this.prisma.user.findFirst({
      where: {
        id: userId,
        estado: 'ACTIVO',
      },
      include: {
        vehicles: {
          orderBy: [{ activo: 'desc' }, { created_at: 'desc' }],
        },
      },
    });

    if (!row) return null;
    return {
      id: row.id,
      username: row.username,
      rango: row.rango,
      fotoPerfil: row.foto_perfil,
      zonaLocalidad: row.zona_localidad,
      zonaCiudad: row.zona_ciudad,
      zonaEstado: row.zona_estado,
      zonaPais: row.zona_pais,
      victorias: row.victorias,
      derrotas: row.derrotas,
      retosConsecutivos: row.retos_consecutivos,
      vehicles: row.vehicles.map(this.toVehicleSummary),
    };
  }

  async updateMyProfile(userId: string, input: UpdateProfileInput): Promise<MyProfile | null> {
    try {
      const row = await this.prisma.user.update({
        where: { id: userId },
        data: {
          username: input.username,
          foto_perfil: input.fotoPerfil,
          zona_localidad: input.zonaLocalidad,
          zona_ciudad: input.zonaCiudad,
          zona_estado: input.zonaEstado,
          zona_pais: input.zonaPais,
        },
        include: {
          vehicles: {
            orderBy: [{ activo: 'desc' }, { created_at: 'desc' }],
          },
        },
      });

      return this.toMyProfile(row);
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') return null;
        if (error.code === 'P2002') throw new Error('El nombre de usuario ya está en uso');
      }
      throw error;
    }
  }

  async deactivateProfile(userId: string): Promise<boolean> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          estado: 'INACTIVO',
        },
      });

      await this.prisma.refreshToken.updateMany({
        where: {
          user_id: userId,
          revoked_at: null,
        },
        data: {
          revoked_at: new Date(),
        },
      });

      return true;
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  }

  async updateStatsAfterChallenge(userId: string, won: boolean): Promise<RankUpdateResult> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Usuario no encontrado');

    const rangos = ['D', 'C', 'B', 'A', 'S'];
    let nuevoRango: string = user.rango;
    let rangoSubido = false;

    if (won) {
      const nuevosConsecutivos = user.retos_consecutivos + 1;
      let consecutivosFinal = nuevosConsecutivos;

      if (nuevosConsecutivos >= 2) {
        const idx = rangos.indexOf(user.rango);
        if (idx < rangos.length - 1) {
          nuevoRango = rangos[idx + 1];
          rangoSubido = true;
          consecutivosFinal = 0;
        }
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          victorias: { increment: 1 },
          retos_consecutivos: consecutivosFinal,
          rango: nuevoRango as 'D' | 'C' | 'B' | 'A' | 'S',
        },
      });
    } else {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          derrotas: { increment: 1 },
          retos_consecutivos: 0,
        },
      });
    }

    return { nuevoRango, rangoSubido };
  }

  private toMyProfile(row: {
    id: string;
    username: string;
    email: string;
    rol: string;
    rango: string;
    estado: string;
    foto_perfil: string | null;
    zona_localidad: string | null;
    zona_ciudad: string | null;
    zona_estado: string | null;
    zona_pais: string | null;
    victorias: number;
    derrotas: number;
    retos_consecutivos: number;
    created_at: Date;
    updated_at: Date;
    vehicles: {
      id: string;
      tipo_vehiculo: string;
      marca: string;
      modelo: string;
      anio: number;
      color: string;
      placa: string | null;
      foto: string | null;
      modificaciones: string | null;
      activo: boolean;
      created_at: Date;
    }[];
  }): MyProfile {
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      rol: row.rol,
      rango: row.rango,
      estado: row.estado,
      fotoPerfil: row.foto_perfil,
      zonaLocalidad: row.zona_localidad,
      zonaCiudad: row.zona_ciudad,
      zonaEstado: row.zona_estado,
      zonaPais: row.zona_pais,
      victorias: row.victorias,
      derrotas: row.derrotas,
      retosConsecutivos: row.retos_consecutivos,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      vehicles: row.vehicles.map(this.toVehicleSummary),
    };
  }

  private toVehicleSummary(vehicle: {
    id: string;
    tipo_vehiculo: string;
    marca: string;
    modelo: string;
    anio: number;
    color: string;
    placa: string | null;
    foto: string | null;
    modificaciones: string | null;
    activo: boolean;
    created_at: Date;
  }): VehicleSummary {
    return {
      id: vehicle.id,
      tipoVehiculo: vehicle.tipo_vehiculo,
      marca: vehicle.marca,
      modelo: vehicle.modelo,
      anio: vehicle.anio,
      color: vehicle.color,
      placa: vehicle.placa,
      foto: vehicle.foto,
      modificaciones: vehicle.modificaciones,
      activo: vehicle.activo,
      createdAt: vehicle.created_at,
    };
  }
}
