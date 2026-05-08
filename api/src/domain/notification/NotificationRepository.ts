export type TipoNotificacion =
  | 'RETO_RECIBIDO'
  | 'RETO_ACEPTADO'
  | 'RETO_RECHAZADO'
  | 'RESULTADO'
  | 'RANGO_SUBIDO'
  | 'NUEVA_PISTA'
  | 'CAMBIO_CATEGORIA';

export interface CreateNotificationInput {
  userId: string;
  tipo: TipoNotificacion;
  mensaje: string;
  referenciaId?: string | null;
}

export interface NotificationRepository {
  create(input: CreateNotificationInput): Promise<void>;
}