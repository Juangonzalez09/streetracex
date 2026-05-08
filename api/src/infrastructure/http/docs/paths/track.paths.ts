export const trackPaths = {
  '/api/v1/tracks': {
    get: {
      tags: ['Tracks'],
      summary: 'Listar pistas disponibles',
      description: 'Retorna las pistas activas (por defecto). El administrador puede ver todas con `soloActivas=false`. Se puede filtrar por tipo de carrera.',
      operationId: 'listTracks',
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
  },

  '/api/v1/tracks/{trackId}': {
    get: {
      tags: ['Tracks'],
      summary: 'Obtener detalle de una pista',
      operationId: 'getTrackById',
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
  },
} as const;