import { NotificationRepository } from '../../domain/notification/NotificationRepository';

export class MarkAllNotificationsReadUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(userId: string): Promise<void> {
    return this.notificationRepository.markAllAsRead(userId);
  }
}