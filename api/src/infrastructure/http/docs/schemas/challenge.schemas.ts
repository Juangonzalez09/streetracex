export const challengeSchemas = {
  ChallengeParticipant: {
    type: 'object',
    description: 'Datos básicos de un piloto participante en un reto',
    required: ['id', 'username', 'rango'],
    properties: {
      id: { type: 'string', format: 'uuid', example: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9' },
      username: { type: 'string', example: 'piloto_alpha' },
      rango: { type: 'string', enum: ['D', 'C', 'B', 'A', 'S'], example: 'D' },
    },
  },

  ChallengeItem: {
    type: 'object',
    description: 'Reto entre dos pilotos',
    required: ['id', 'retadorId', 'retadoId', 'tipoCarrera', 'estado', 'createdAt', 'updatedAt', 'retador', 'retado'],
    properties: {
      id: { type: 'string', format: 'uuid', example: 'c1d2e3f4-a5b6-7890-cdef-123456789abc' },
      retadorId: { type: 'string', format: 'uuid', example: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9' },
      retadoId: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
      tipoCarrera: {
        type: 'string',
        enum: ['CUARTO_MILLA', 'VUELTAS', 'DERRAPE'],
        example: 'CUARTO_MILLA',
      },
      vehiculoRetadorId: { type: 'string', format: 'uuid', nullable: true, example: 'v1v2v3v4-e5f6-7890-abcd-ef1234567890' },
      vehiculoRetadoId: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        description: 'Se asigna cuando el retado acepta el reto',
        example: 'v9v8v7v6-e5f6-7890-abcd-ef1234567890',
      },
      estado: {
        type: 'string',
        enum: ['PENDIENTE', 'ACEPTADO', 'RECHAZADO', 'EN_CURSO', 'COMPLETADO', 'CANCELADO'],
        example: 'PENDIENTE',
      },
      ganadorId: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        description: 'Se asigna al completarse el reto',
        example: null,
      },
      reporteRetadorId: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        description: 'UUID del ganador declarado por el retador',
        example: null,
      },
      reporteRetadoId: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        description: 'UUID del ganador declarado por el retado',
        example: null,
      },
      pistaId: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        description: 'UUID de la pista seleccionada por el retador (opcional)',
        example: 'b1c2d3e4-f5a6-7890-bcde-f01234567890',
      },
      notas: { type: 'string', nullable: true, example: 'Este fin de semana en la vía principal' },
      fechaAcordada: { type: 'string', format: 'date-time', nullable: true, example: '2026-06-01T18:00:00.000Z' },
      createdAt: { type: 'string', format: 'date-time', example: '2026-05-07T20:00:00.000Z' },
      updatedAt: { type: 'string', format: 'date-time', example: '2026-05-07T20:05:00.000Z' },
      retador: { $ref: '#/components/schemas/ChallengeParticipant' },
      retado: { $ref: '#/components/schemas/ChallengeParticipant' },
      ganador: {
        nullable: true,
        allOf: [{ $ref: '#/components/schemas/ChallengeParticipant' }],
        description: 'Presente solo cuando el reto está COMPLETADO',
      },
    },
  },

  ChallengeResponse: {
    type: 'object',
    description: 'Respuesta estándar con un reto',
    required: ['success', 'message', 'data'],
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Reto enviado' },
      data: { $ref: '#/components/schemas/ChallengeItem' },
    },
  },

  ChallengeListResponse: {
    type: 'object',
    description: 'Respuesta estándar con lista de retos',
    required: ['success', 'message', 'data'],
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Retos obtenidos' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/ChallengeItem' },
      },
    },
  },

  SendChallengeRequest: {
    type: 'object',
    description: 'Payload para enviar un reto. El vehículo del retador se toma del vehículo activo automáticamente.',
    required: ['retadoId', 'tipoCarrera'],
    properties: {
      retadoId: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
      tipoCarrera: {
        type: 'string',
        enum: ['CUARTO_MILLA', 'VUELTAS', 'DERRAPE'],
        example: 'CUARTO_MILLA',
      },
      pistaId: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        description: 'UUID de la pista (opcional). Debe estar activa y su tipoCarrera debe coincidir con el reto.',
        example: 'b1c2d3e4-f5a6-7890-bcde-f01234567890',
      },
      notas: {
        type: 'string',
        maxLength: 500,
        nullable: true,
        example: 'Este fin de semana en la vía principal',
      },
      fechaAcordada: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2026-06-01T18:00:00.000Z',
      },
    },
    example: {
      retadoId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      tipoCarrera: 'CUARTO_MILLA',
      notas: 'Este fin de semana en la vía principal',
      fechaAcordada: '2026-06-01T18:00:00.000Z',
    },
  },

  ReportResultRequest: {
    type: 'object',
    description: 'Declaración del ganador por parte de un participante. Ambos deben declarar el mismo ganador para auto-completar el reto.',
    required: ['ganadorId'],
    properties: {
      ganadorId: {
        type: 'string',
        format: 'uuid',
        description: 'UUID del piloto ganador. Debe ser el retadorId o retadoId del reto.',
        example: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9',
      },
    },
  },

  AdminResolveRequest: {
    type: 'object',
    description: 'Resolución de disputa por administrador. Fuerza el resultado del reto.',
    required: ['ganadorId'],
    properties: {
      ganadorId: {
        type: 'string',
        format: 'uuid',
        description: 'UUID del piloto ganador. Debe ser el retadorId o retadoId del reto.',
        example: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9',
      },
    },
  },
} as const;