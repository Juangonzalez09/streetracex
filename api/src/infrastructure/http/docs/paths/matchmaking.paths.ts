export const matchmakingPaths = {
  '/api/v1/matchmaking': {
    get: {
      tags: ['Matchmaking'],
      summary: 'Lista rivales compatibles',
      description:
        'Retorna pilotos activos del mismo rango y del mismo tipo de vehiculo activo que el usuario autenticado.',
      operationId: 'listMatchmakingPilots',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          required: false,
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: 'Pagina de resultados',
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: { type: 'integer', minimum: 1, maximum: 50, default: 10 },
          description: 'Cantidad de resultados por pagina',
        },
        { name: 'zonaLocalidad', in: 'query', required: false, schema: { type: 'string' } },
        { name: 'zonaCiudad', in: 'query', required: false, schema: { type: 'string' } },
        { name: 'zonaEstado', in: 'query', required: false, schema: { type: 'string' } },
        { name: 'zonaPais', in: 'query', required: false, schema: { type: 'string' } },
      ],
      responses: {
        200: {
          description: 'Lista de pilotos compatible',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MatchmakingListResponse' },
            },
          },
        },
        400: {
          description: 'Regla de negocio no cumplida',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                noActiveVehicle: {
                  value: { success: false, message: 'Necesitas un vehículo activo para usar matchmaking' },
                },
              },
            },
          },
        },
        401: {
          description: 'Token inválido o ausente',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
            },
          },
        },
        403: {
          description: 'Usuario inactivo',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
            },
          },
        },
        422: {
          description: 'Error de validación de query',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
            },
          },
        },
        500: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
            },
          },
        },
      },
    },
  },
} as const;
