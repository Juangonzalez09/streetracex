import { PrismaClient } from '@prisma/client';
import {
  CreateTrackData,
  TrackFilters,
  TrackItem,
  TrackRepository,
  UpdateTrackData,
} from '../../domain/track/TrackRepository';

export class PrismaTrackRepository implements TrackRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateTrackData): Promise<TrackItem> {
    const row = await this.prisma.pista.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion ?? null,
        tipo_carrera: data.tipoCarrera,
        dificultad: data.dificultad ?? null,
        coordenadas: data.coordenadas ?? null,
      },
    });
    return this.toItem(row);
  }

  async findById(id: string): Promise<TrackItem | null> {
    const row = await this.prisma.pista.findUnique({ where: { id } });
    if (!row) return null;
    return this.toItem(row);
  }

  async findAll(filters: TrackFilters): Promise<TrackItem[]> {
    const rows = await this.prisma.pista.findMany({
      where: {
        ...(filters.soloActivas ? { activo: true } : {}),
        ...(filters.tipoCarrera ? { tipo_carrera: filters.tipoCarrera } : {}),
      },
      orderBy: { created_at: 'asc' },
    });
    return rows.map((row) => this.toItem(row));
  }

  async update(id: string, data: UpdateTrackData): Promise<TrackItem> {
    const row = await this.prisma.pista.update({
      where: { id },
      data: {
        ...(data.nombre !== undefined ? { nombre: data.nombre } : {}),
        ...(data.descripcion !== undefined ? { descripcion: data.descripcion } : {}),
        ...(data.dificultad !== undefined ? { dificultad: data.dificultad } : {}),
        ...(data.coordenadas !== undefined ? { coordenadas: data.coordenadas } : {}),
      },
    });
    return this.toItem(row);
  }

  async deactivate(id: string): Promise<TrackItem> {
    const row = await this.prisma.pista.update({
      where: { id },
      data: { activo: false },
    });
    return this.toItem(row);
  }

  private toItem(row: {
    id: string;
    nombre: string;
    descripcion: string | null;
    tipo_carrera: string;
    dificultad: string | null;
    coordenadas: string | null;
    activo: boolean;
    created_at: Date;
  }): TrackItem {
    return {
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion,
      tipoCarrera: row.tipo_carrera as TrackItem['tipoCarrera'],
      dificultad: row.dificultad,
      coordenadas: row.coordenadas,
      activo: row.activo,
      createdAt: row.created_at,
    };
  }
}