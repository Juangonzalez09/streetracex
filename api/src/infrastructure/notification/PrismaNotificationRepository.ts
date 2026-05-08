import { PrismaClient } from '@prisma/client';
import {
  CreateNotificationInput,
  NotificationItem,
  NotificationRepository,
} from '../../domain/notification/NotificationRepository';

type NotificationRow = {
  id: string;
  user_id: string;
  tipo: string;
  mensaje: string;
  leida: boolean;
  referencia_id: string | null;
  created_at: Date;
};

export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateNotificationInput): Promise<void> {
    await this.prisma.notification.create({
      data: {
        user_id: input.userId,
        tipo: input.tipo,
        mensaje: input.mensaje,
        referencia_id: input.referenciaId ?? null,
      },
    });
  }

  async findByUserId(userId: string, soloNoLeidas = false): Promise<NotificationItem[]> {
    const rows = await this.prisma.notification.findMany({
      where: {
        user_id: userId,
        ...(soloNoLeidas ? { leida: false } : {}),
      },
      orderBy: { created_at: 'desc' },
    });
    return (rows as NotificationRow[]).map((row) => this.toItem(row));
  }

  async findById(id: string): Promise<NotificationItem | null> {
    const row = await this.prisma.notification.findUnique({ where: { id } });
    if (!row) return null;
    return this.toItem(row);
  }

  async markAsRead(id: string): Promise<NotificationItem> {
    const row = await this.prisma.notification.update({
      where: { id },
      data: { leida: true },
    });
    return this.toItem(row);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { user_id: userId, leida: false },
      data: { leida: true },
    });
  }

  private toItem(row: NotificationRow): NotificationItem {
    return {
      id: row.id,
      userId: row.user_id,
      tipo: row.tipo as NotificationItem['tipo'],
      mensaje: row.mensaje,
      leida: row.leida,
      referenciaId: row.referencia_id,
      createdAt: row.created_at,
    };
  }
}