import { PrismaClient } from '@prisma/client';
import { CreateNotificationInput, NotificationRepository } from '../../domain/notification/NotificationRepository';

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
}
