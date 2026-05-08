import { NotificationItem, NotificationRepository } from '../../domain/notification/NotificationRepository';

export class ListNotificationsUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(userId: string, soloNoLeidas: boolean): Promise<NotificationItem[]> {
    return this.notificationRepository.findByUserId(userId, soloNoLeidas);
  }
}