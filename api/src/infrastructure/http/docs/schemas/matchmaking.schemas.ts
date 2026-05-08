export const matchmakingSchemas = {
  MatchmakingPilotItem: {
    type: 'object',
    required: ['id', 'username', 'rango', 'victorias', 'derrotas', 'retosConsecutivos', 'activeVehicle'],
    properties: {
      id: { type: 'string', format: 'uuid', example: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9' },
      username: { type: 'string', example: 'pilot_nightshift' },
      rango: { type: 'string', example: 'D' },
      zonaLocalidad: { type: 'string', nullable: true, example: 'Chapinero' },
      zonaCiudad: { type: 'string', nullable: true, example: 'Bogota' },
      zonaEstado: { type: 'string', nullable: true, example: 'Cundinamarca' },
      zonaPais: { type: 'string', nullable: true, example: 'Colombia' },
      victorias: { type: 'integer', example: 4 },
      derrotas: { type: 'integer', example: 2 },
      retosConsecutivos: { type: 'integer', example: 2 },
      activeVehicle: {
        type: 'object',
        nullable: true,
        required: ['id', 'tipoVehiculo', 'marca', 'modelo', 'anio', 'color'],
        properties: {
          id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
          tipoVehiculo: { type: 'string', enum: ['AUTO', 'MOTO', 'MONOPATIN_ELECTRICO'], example: 'AUTO' },
          marca: { type: 'string', example: 'Nissan' },
          modelo: { type: 'string', example: 'Silvia S15' },
          anio: { type: 'integer', example: 2000 },
          color: { type: 'string', example: 'Negro' },
        },
      },
    },
  },
  MatchmakingPagination: {
    type: 'object',
    required: ['page', 'limit', 'total', 'totalPages'],
    properties: {
      page: { type: 'integer', example: 1 },
      limit: { type: 'integer', example: 10 },
      total: { type: 'integer', example: 24 },
      totalPages: { type: 'integer', example: 3 },
    },
  },
  MatchmakingListResponse: {
    type: 'object',
    required: ['success', 'message', 'data', 'pagination'],
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Pilotos encontrados' },
      data: { type: 'array', items: { $ref: '#/components/schemas/MatchmakingPilotItem' } },
      pagination: { $ref: '#/components/schemas/MatchmakingPagination' },
    },
  },
} as const;
