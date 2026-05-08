import { NotificationItem, NotificationRepository } from '../../domain/notification/NotificationRepository';

export class MarkNotificationReadUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(notificationId: string, userId: string): Promise<NotificationItem> {
    const notification = await this.notificationRepository.findById(notificationId);
    if (!notification) throw new Error('Notificación no encontrada');
    if (notification.userId !== userId) throw new Error('No tienes acceso a esta notificación');
    if (notification.leida) throw new Error('La notificación ya está marcada como leída');
    return this.notificationRepository.markAsRead(notificationId);
  }
}