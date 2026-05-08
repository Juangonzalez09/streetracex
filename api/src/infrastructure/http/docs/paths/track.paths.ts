export const trackPaths = {
  '/api/tracks': {
    get: {
      tags: ['Tracks'],
      summary: 'Listar pistas disponibles',
      description: 'Retorna las pistas activas (por defecto). El administrador puede ver todas con `soloActivas=false`. Se puede filtrar por tipo de carrera.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'tipoCarrera',
          in: 'query',
          schema: { type: 'string', enum: ['CUARTO_MILLA', 'VUELTAS', 'DERRAPE'] },
          description: 'Filtrar por tipo de carrera',
        },
        {
          name: 'soloActivas',
          in: 'query',
          schema: { type: 'string', enum: ['true', 'false'], default: 'true' },
          description: 'Si `false`, incluye pistas desactivadas (útil para administradores)',
        },
      ],
      responses: {
        200: {
          description: 'Lista de pistas',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/TrackListResponse' } } },
        },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
      },
    },
    post: {
      tags: ['Tracks'],
      summary: 'Crear pista (Admin)',
      description: 'Crea una nueva pista de carrera. Solo accesible para administradores.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTrackRequest' } } },
      },
      responses: {
        201: {
          description: 'Pista creada',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/TrackResponse' } } },
        },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        403: { description: 'Acceso denegado (no es administrador)', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        422: { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
      },
    },
  },

  '/api/tracks/{trackId}': {
    get: {
      tags: ['Tracks'],
      summary: 'Obtener detalle de una pista',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'trackId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' }, description: 'UUID de la pista' },
      ],
      responses: {
        200: {
          description: 'Pista encontrada',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/TrackResponse' } } },
        },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        404: { description: 'Pista no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
      },
    },
    patch: {
      tags: ['Tracks'],
      summary: 'Actualizar pista (Admin)',
      description: 'Actualiza los campos de una pista. Solo administradores. No permite cambiar el tipo de carrera.',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'trackId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' }, description: 'UUID de la pista' },
      ],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateTrackRequest' } } },
      },
      responses: {
        200: {
          description: 'Pista actualizada',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/TrackResponse' } } },
        },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        404: { description: 'Pista no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        422: { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
      },
    },
  },

  '/api/tracks/{trackId}/deactivate': {
    patch: {
      tags: ['Tracks'],
      summary: 'Desactivar pista (Admin)',
      description: 'Marca una pista como inactiva. No se elimina — los retos existentes con esa pista no se ven afectados.',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'trackId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' }, description: 'UUID de la pista' },
      ],
      responses: {
        200: {
          description: 'Pista desactivada',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/TrackResponse' } } },
        },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        403: { description: 'Acceso denegado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        404: { description: 'Pista no encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        409: { description: 'La pista ya está desactivada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
      },
    },
  },
} as const;