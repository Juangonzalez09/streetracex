import { PrismaClient } from '@prisma/client';
import {
  AdminChallengeFilters,
  ChallengeFilters,
  ChallengeItem,
  ChallengeRepository,
  EstadoReto,
  SendChallengeData,
} from '../../domain/challenge/ChallengeRepository';

const challengeInclude = {
  retador: { select: { id: true, username: true, rango: true } },
  retado: { select: { id: true, username: true, rango: true } },
  ganador: { select: { id: true, username: true, rango: true } },
} as const;

type ChallengeRow = {
  id: string;
  retador_id: string;
  retado_id: string;
  tipo_carrera: string;
  vehiculo_retador_id: string | null;
  vehiculo_retado_id: string | null;
  estado: string;
  ganador_id: string | null;
  reporte_retador_id: string | null;
  reporte_retado_id: string | null;
  pista_id: string | null;
  notas: string | null;
  fecha_acordada: Date | null;
  created_at: Date;
  updated_at: Date;
  retador: { id: string; username: string; rango: string };
  retado: { id: string; username: string; rango: string };
  ganador: { id: string; username: string; rango: string } | null;
};

export class PrismaChallengeRepository implements ChallengeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: SendChallengeData): Promise<ChallengeItem> {
    const row = await this.prisma.challenge.create({
      data: {
        retador_id: data.retadorId,
        retado_id: data.retadoId,
        tipo_carrera: data.tipoCarrera,
        vehiculo_retador_id: data.vehiculoRetadorId,
        pista_id: data.pistaId ?? null,
        notas: data.notas ?? null,
        fecha_acordada: data.fechaAcordada ?? null,
      },
      include: challengeInclude,
    });
    return this.toItem(row);
  }

  async findById(id: string): Promise<ChallengeItem | null> {
    const row = await this.prisma.challenge.findUnique({
      where: { id },
      include: challengeInclude,
    });
    if (!row) return null;
    return this.toItem(row);
  }

  async findMyChallenges(userId: string, filters: ChallengeFilters): Promise<ChallengeItem[]> {
    const tipo = filters.tipo ?? 'todos';

    const participanteClause =
      tipo === 'enviados'
        ? { retador_id: userId }
        : tipo === 'recibidos'
          ? { retado_id: userId }
          : { OR: [{ retador_id: userId }, { retado_id: userId }] };

    const rows = await this.prisma.challenge.findMany({
      where: {
        AND: [participanteClause, ...(filters.estado ? [{ estado: filters.estado }] : [])],
      },
      include: challengeInclude,
      orderBy: { created_at: 'desc' },
    });

    return (rows as ChallengeRow[]).map((row) => this.toItem(row));
  }

  async hasActiveChallengeBetween(retadorId: string, retadoId: string): Promise<boolean> {
    const count = await this.prisma.challenge.count({
      where: {
        OR: [
          { retador_id: retadorId, retado_id: retadoId },
          { retador_id: retadoId, retado_id: retadorId },
        ],
        estado: { in: ['PENDIENTE', 'ACEPTADO', 'EN_CURSO'] },
      },
    });
    return count > 0;
  }

  async acceptChallenge(id: string, vehiculoRetadoId: string): Promise<ChallengeItem> {
    const row = await this.prisma.challenge.update({
      where: { id },
      data: { estado: 'ACEPTADO', vehiculo_retado_id: vehiculoRetadoId },
      include: challengeInclude,
    });
    return this.toItem(row);
  }

  async updateEstado(id: string, estado: EstadoReto): Promise<ChallengeItem> {
    const row = await this.prisma.challenge.update({
      where: { id },
      data: { estado },
      include: challengeInclude,
    });
    return this.toItem(row);
  }

  async reportarResultadoRetador(id: string, ganadorId: string): Promise<ChallengeItem> {
    const row = await this.prisma.challenge.update({
      where: { id },
      data: { reporte_retador_id: ganadorId },
      include: challengeInclude,
    });
    return this.toItem(row);
  }

  async reportarResultadoRetado(id: string, ganadorId: string): Promise<ChallengeItem> {
    const row = await this.prisma.challenge.update({
      where: { id },
      data: { reporte_retado_id: ganadorId },
      include: challengeInclude,
    });
    return this.toItem(row);
  }

  async completeChallenge(id: string, ganadorId: string): Promise<ChallengeItem> {
    const row = await this.prisma.challenge.update({
      where: { id },
      data: { estado: 'COMPLETADO', ganador_id: ganadorId },
      include: challengeInclude,
    });
    return this.toItem(row);
  }

  async findAllChallenges(filters: AdminChallengeFilters): Promise<ChallengeItem[]> {
    const where: Record<string, unknown> = {};

    if (filters.soloDisputas) {
      where.estado = 'EN_CURSO';
      where.reporte_retador_id = { not: null };
      where.reporte_retado_id = { not: null };
    } else if (filters.estado) {
      where.estado = filters.estado;
    }

    const rows = await this.prisma.challenge.findMany({
      where,
      include: challengeInclude,
      orderBy: { updated_at: 'desc' },
    });

    let items = (rows as ChallengeRow[]).map((row) => this.toItem(row));

    if (filters.soloDisputas) {
      items = items.filter(
        (item) =>
          item.reporteRetadorId !== null &&
          item.reporteRetadoId !== null &&
          item.reporteRetadorId !== item.reporteRetadoId,
      );
    }

    return items;
  }

  private toItem(row: ChallengeRow): ChallengeItem {
    return {
      id: row.id,
      retadorId: row.retador_id,
      retadoId: row.retado_id,
      tipoCarrera: row.tipo_carrera as ChallengeItem['tipoCarrera'],
      vehiculoRetadorId: row.vehiculo_retador_id,
      vehiculoRetadoId: row.vehiculo_retado_id,
      estado: row.estado as ChallengeItem['estado'],
      ganadorId: row.ganador_id,
      reporteRetadorId: row.reporte_retador_id,
      reporteRetadoId: row.reporte_retado_id,
      pistaId: row.pista_id,
      notas: row.notas,
      fechaAcordada: row.fecha_acordada,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      retador: row.retador,
      retado: row.retado,
      ganador: row.ganador,
    };
  }
}