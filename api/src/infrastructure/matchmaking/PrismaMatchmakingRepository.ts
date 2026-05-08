import { PrismaClient } from '@prisma/client';
import {
  MatchmakingRepository,
  MatchmakingRequesterContext,
  MatchmakingSearchInput,
  MatchmakingSearchResult,
} from '../../domain/matchmaking/MatchmakingRepository';

type MatchmakingUserRow = {
  id: string;
  username: string;
  rango: 'D' | 'C' | 'B' | 'A' | 'S';
  zona_localidad: string | null;
  zona_ciudad: string | null;
  zona_estado: string | null;
  zona_pais: string | null;
  victorias: number;
  derrotas: number;
  retos_consecutivos: number;
  vehicles: {
    id: string;
    tipo_vehiculo: 'AUTO' | 'MOTO' | 'MONOPATIN_ELECTRICO';
    marca: string;
    modelo: string;
    anio: number;
    color: string;
  }[];
};

export class PrismaMatchmakingRepository implements MatchmakingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findRequesterContext(userId: string): Promise<MatchmakingRequesterContext | null> {
    const row = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        vehicles: {
          where: { activo: true },
          orderBy: { created_at: 'desc' },
          take: 1,
        },
      },
    });

    if (!row) return null;

    await this.prisma.matchmakingProfile.upsert({
      where: { user_id: row.id },
      update: {},
      create: { user_id: row.id },
    });

    return {
      id: row.id,
      rango: row.rango,
      estado: row.estado,
      activeVehicleType: row.vehicles[0]?.tipo_vehiculo ?? null,
    };
  }

  async searchPilots(input: MatchmakingSearchInput): Promise<MatchmakingSearchResult> {
    const where = {
      id: { not: input.requesterId },
      rol: 'PILOTO' as const,
      estado: 'ACTIVO' as const,
      rango: input.rango,
      zona_localidad: input.filters.zonaLocalidad,
      zona_ciudad: input.filters.zonaCiudad,
      zona_estado: input.filters.zonaEstado,
      zona_pais: input.filters.zonaPais,
      OR: [
        { matchmakingProfile: { is: null } },
        { matchmakingProfile: { is: { discoverable: true } } },
      ],
      vehicles: {
        some: {
          activo: true,
          tipo_vehiculo: input.vehicleType,
        },
      },
    };

    const rows: MatchmakingUserRow[] = await this.prisma.user.findMany({
      where,
      include: {
        vehicles: {
          where: {
            activo: true,
            tipo_vehiculo: input.vehicleType,
          },
          orderBy: { created_at: 'desc' },
          take: 1,
        },
      },
      orderBy: [{ victorias: 'desc' }, { retos_consecutivos: 'desc' }, { created_at: 'desc' }],
      skip: (input.page - 1) * input.limit,
      take: input.limit,
    });

    const total = await this.prisma.user.count({ where });

    return {
      items: rows.map((row: MatchmakingUserRow) => ({
        id: row.id,
        username: row.username,
        rango: row.rango,
        zonaLocalidad: row.zona_localidad,
        zonaCiudad: row.zona_ciudad,
        zonaEstado: row.zona_estado,
        zonaPais: row.zona_pais,
        victorias: row.victorias,
        derrotas: row.derrotas,
        retosConsecutivos: row.retos_consecutivos,
        activeVehicle: row.vehicles[0]
          ? {
              id: row.vehicles[0].id,
              tipoVehiculo: row.vehicles[0].tipo_vehiculo,
              marca: row.vehicles[0].marca,
              modelo: row.vehicles[0].modelo,
              anio: row.vehicles[0].anio,
              color: row.vehicles[0].color,
            }
          : null,
      })),
      total,
    };
  }
}
