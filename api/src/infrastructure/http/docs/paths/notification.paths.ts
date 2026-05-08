export const notificationPaths = {
  '/api/notifications': {
    get: {
      tags: ['Notifications'],
      summary: 'Listar mis notificaciones',
      description: 'Retorna todas las notificaciones del piloto autenticado, ordenadas por fecha descendente. Usa `soloNoLeidas=true` para ver solo las pendientes.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'soloNoLeidas',
          in: 'query',
          schema: { type: 'string', enum: ['true', 'false'] },
          description: 'Si `true`, retorna solo notificaciones no leídas',
        },
      ],
      responses: {
        200: {
          description: 'Lista de notificaciones',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/NotificationListResponse' } } },
        },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
      },
    },
  },

  '/api/notifications/read-all': {
    patch: {
      tags: ['Notifications'],
      summary: 'Marcar todas como leídas',
      description: 'Marca todas las notificaciones no leídas del piloto autenticado como leídas.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Todas marcadas como leídas',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiSuccess' } } },
        },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
      },
    },
  },

  '/api/notifications/{notificationId}/read': {
    patch: {
      tags: ['Notifications'],
      summary: 'Marcar una notificación como leída',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'notificationId',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
          description: 'UUID de la notificación',
        },
      ],
      responses: {
        200: {
          description: 'Notificación marcada como leída',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/NotificationResponse' } } },
        },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        403: { description: 'La notificación no te pertenece', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        404: { description: 'Notificación no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        409: { description: 'La notificación ya estaba leída', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
      },
    },
  },
} as const;
