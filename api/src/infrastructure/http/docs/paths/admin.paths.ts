export const adminPaths = {
  '/api/v1/admin/challenges': {
    get: {
      tags: ['Admin'],
      summary: 'Listar retos (Admin)',
      description: 'Retorna todos los retos del sistema. Usar `soloDisputas=true` para ver únicamente los retos EN_CURSO con reportes contradictorios que requieren resolución del administrador.',
      operationId: 'adminListChallenges',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'estado',
          in: 'query',
          required: false,
          schema: { type: 'string', enum: ['PENDIENTE', 'ACEPTADO', 'RECHAZADO', 'EN_CURSO', 'COMPLETADO', 'CANCELADO'] },
          description: 'Filtrar por estado',
        },
        {
          name: 'soloDisputas',
          in: 'query',
          required: false,
          schema: { type: 'string', enum: ['true', 'false'] },
          description: 'Si `true`, retorna solo retos EN_CURSO con reportes contradictorios pendientes de resolución',
        },
      ],
      responses: {
        200: { description: 'Lista de retos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ChallengeListResponse' } } } },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
      },
    },
  },

  '/api/v1/admin/challenges/{challengeId}/resolve': {
    patch: {
      tags: ['Admin'],
      summary: 'Resolver disputa (Admin)',
      description: 'Fuerza el resultado de un reto en disputa declarando al ganador. Solo accesible para administradores. Completa el reto y actualiza estadísticas de ambos pilotos.',
      operationId: 'adminResolveChallenge',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'challengeId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' }, description: 'UUID del reto' },
      ],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminResolveRequest' } } },
      },
      responses: {
        200: { description: 'Reto resuelto', content: { 'application/json': { schema: { $ref: '#/components/schemas/ChallengeResponse' } } } },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        403: { description: 'Acceso denegado (no es administrador)', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        404: { description: 'Reto no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        409: { description: 'El reto no está EN_CURSO', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
      },
    },
  },

  '/api/v1/admin/tracks': {
    post: {
      tags: ['Admin'],
      summary: 'Crear pista (Admin)',
      description: 'Crea una nueva pista de carrera. Solo administradores.',
      operationId: 'adminCreateTrack',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTrackRequest' } } },
      },
      responses: {
        201: { description: 'Pista creada', content: { 'application/json': { schema: { $ref: '#/components/schemas/TrackResponse' } } } },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        422: { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
      },
    },
  },

  '/api/v1/admin/tracks/{trackId}': {
    patch: {
      tags: ['Admin'],
      summary: 'Actualizar pista (Admin)',
      description: 'Actualiza los datos de una pista. No permite cambiar el tipo de carrera.',
      operationId: 'adminUpdateTrack',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'trackId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' }, description: 'UUID de la pista' },
      ],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateTrackRequest' } } },
      },
      responses: {
        200: { description: 'Pista actualizada', content: { 'application/json': { schema: { $ref: '#/components/schemas/TrackResponse' } } } },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        404: { description: 'Pista no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        422: { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
      },
    },
  },

  '/api/v1/admin/tracks/{trackId}/deactivate': {
    patch: {
      tags: ['Admin'],
      summary: 'Desactivar pista (Admin)',
      operationId: 'adminDeactivateTrack',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'trackId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' }, description: 'UUID de la pista' },
      ],
      responses: {
        200: { description: 'Pista desactivada', content: { 'application/json': { schema: { $ref: '#/components/schemas/TrackResponse' } } } },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        404: { description: 'Pista no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        409: { description: 'La pista ya está desactivada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
      },
    },
  },
} as const;