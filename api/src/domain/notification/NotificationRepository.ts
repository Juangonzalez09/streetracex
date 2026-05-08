export type TipoNotificacion =
  | 'RETO_RECIBIDO'
  | 'RETO_ACEPTADO'
  | 'RETO_RECHAZADO'
  | 'RESULTADO'
  | 'RANGO_SUBIDO'
  | 'NUEVA_PISTA'
  | 'CAMBIO_CATEGORIA';

export interface NotificationItem {
  id: string;
  userId: string;
  tipo: TipoNotificacion;
  mensaje: string;
  leida: boolean;
  referenciaId: string | null;
  createdAt: Date;
}

export interface CreateNotificationInput {
  userId: string;
  tipo: TipoNotificacion;
  mensaje: string;
  referenciaId?: string | null;
}

export interface NotificationRepository {
  create(input: CreateNotificationInput): Promise<void>;
  findByUserId(userId: string, soloNoLeidas?: boolean): Promise<NotificationItem[]>;
  findById(id: string): Promise<NotificationItem | null>;
  markAsRead(id: string): Promise<NotificationItem>;
  markAllAsRead(userId: string): Promise<void>;
}