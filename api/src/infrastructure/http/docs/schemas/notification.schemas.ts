export const notificationSchemas = {
  NotificationItem: {
    type: 'object',
    description: 'Notificación interna de un piloto',
    required: ['id', 'userId', 'tipo', 'mensaje', 'leida', 'createdAt'],
    properties: {
      id: { type: 'string', format: 'uuid', example: 'n1a2b3c4-d5e6-7890-fghi-j01234567890' },
      userId: { type: 'string', format: 'uuid', example: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9' },
      tipo: {
        type: 'string',
        enum: ['RETO_RECIBIDO', 'RETO_ACEPTADO', 'RETO_RECHAZADO', 'RESULTADO', 'RANGO_SUBIDO', 'NUEVA_PISTA', 'CAMBIO_CATEGORIA'],
        example: 'RETO_RECIBIDO',
      },
      mensaje: { type: 'string', example: 'piloto_beta te ha enviado un reto de CUARTO MILLA' },
      leida: { type: 'boolean', example: false },
      referenciaId: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        description: 'UUID del reto o recurso relacionado',
        example: 'c1d2e3f4-a5b6-7890-cdef-123456789abc',
      },
      createdAt: { type: 'string', format: 'date-time', example: '2026-05-07T20:00:00.000Z' },
    },
  },

  NotificationListResponse: {
    type: 'object',
    description: 'Respuesta con lista de notificaciones',
    required: ['success', 'message', 'data'],
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Notificaciones obtenidas' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/NotificationItem' },
      },
    },
  },

  NotificationResponse: {
    type: 'object',
    description: 'Respuesta con una notificación',
    required: ['success', 'message', 'data'],
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Notificación marcada como leída' },
      data: { $ref: '#/components/schemas/NotificationItem' },
    },
  },
} as const;
