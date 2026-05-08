import { Request, Response } from 'express';
import { ListNotificationsUseCase } from '../../../application/notification/ListNotificationsUseCase';
import { MarkAllNotificationsReadUseCase } from '../../../application/notification/MarkAllNotificationsReadUseCase';
import { MarkNotificationReadUseCase } from '../../../application/notification/MarkNotificationReadUseCase';

export class NotificationController {
  constructor(
    private readonly listNotificationsUseCase: ListNotificationsUseCase,
    private readonly markNotificationReadUseCase: MarkNotificationReadUseCase,
    private readonly markAllNotificationsReadUseCase: MarkAllNotificationsReadUseCase,
  ) {}

  async list(req: Request, res: Response) {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'No autenticado' });

    try {
      const soloNoLeidas = req.query.soloNoLeidas as unknown as boolean;
      const notifications = await this.listNotificationsUseCase.execute(userId, soloNoLeidas ?? false);
      return res.status(200).json({ success: true, message: 'Notificaciones obtenidas', data: notifications });
    } catch {
      return res.status(500).json({ success: false, message: 'Error interno al listar notificaciones' });
    }
  }

  async markRead(req: Request, res: Response) {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'No autenticado' });

    try {
      const notification = await this.markNotificationReadUseCase.execute(req.params.notificationId, userId);
      return res.status(200).json({ success: true, message: 'Notificación marcada como leída', data: notification });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Notificación no encontrada') return res.status(404).json({ success: false, message: error.message });
        if (error.message === 'No tienes acceso a esta notificación') return res.status(403).json({ success: false, message: error.message });
        if (error.message === 'La notificación ya está marcada como leída') return res.status(409).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Error interno al marcar notificación' });
    }
  }

  async markAllRead(req: Request, res: Response) {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'No autenticado' });

    try {
      await this.markAllNotificationsReadUseCase.execute(userId);
      return res.status(200).json({ success: true, message: 'Todas las notificaciones marcadas como leídas' });
    } catch {
      return res.status(500).json({ success: false, message: 'Error interno al marcar notificaciones' });
    }
  }
}