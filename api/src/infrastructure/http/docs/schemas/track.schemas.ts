export const trackSchemas = {
  TrackItem: {
    type: 'object',
    description: 'Pista de carrera disponible en la plataforma',
    required: ['id', 'nombre', 'tipoCarrera', 'activo', 'createdAt'],
    properties: {
      id: { type: 'string', format: 'uuid', example: 'b1c2d3e4-f5a6-7890-bcde-f01234567890' },
      nombre: { type: 'string', example: 'Recta del Parque Norte' },
      descripcion: { type: 'string', nullable: true, example: 'Tramo recto de 400m en el parque industrial norte' },
      tipoCarrera: {
        type: 'string',
        enum: ['CUARTO_MILLA', 'VUELTAS', 'DERRAPE'],
        example: 'CUARTO_MILLA',
      },
      dificultad: { type: 'string', nullable: true, example: 'Media' },
      coordenadas: { type: 'string', nullable: true, example: '4.710989,-74.072092' },
      activo: { type: 'boolean', example: true },
      createdAt: { type: 'string', format: 'date-time', example: '2026-05-07T20:00:00.000Z' },
    },
  },

  TrackResponse: {
    type: 'object',
    description: 'Respuesta estándar con una pista',
    required: ['success', 'message', 'data'],
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Pista obtenida' },
      data: { $ref: '#/components/schemas/TrackItem' },
    },
  },

  TrackListResponse: {
    type: 'object',
    description: 'Respuesta estándar con lista de pistas',
    required: ['success', 'message', 'data'],
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Pistas obtenidas' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/TrackItem' },
      },
    },
  },

  CreateTrackRequest: {
    type: 'object',
    description: 'Payload para crear una nueva pista (solo administrador)',
    required: ['nombre', 'tipoCarrera'],
    properties: {
      nombre: { type: 'string', maxLength: 100, example: 'Recta del Parque Norte' },
      descripcion: { type: 'string', nullable: true, example: 'Tramo recto de 400m en el parque industrial norte' },
      tipoCarrera: {
        type: 'string',
        enum: ['CUARTO_MILLA', 'VUELTAS', 'DERRAPE'],
        example: 'CUARTO_MILLA',
      },
      dificultad: { type: 'string', maxLength: 50, nullable: true, example: 'Media' },
      coordenadas: { type: 'string', maxLength: 100, nullable: true, example: '4.710989,-74.072092' },
    },
    example: {
      nombre: 'Recta del Parque Norte',
      tipoCarrera: 'CUARTO_MILLA',
      descripcion: 'Tramo recto de 400m en el parque industrial norte',
      dificultad: 'Media',
      coordenadas: '4.710989,-74.072092',
    },
  },

  UpdateTrackRequest: {
    type: 'object',
    description: 'Payload para actualizar una pista (solo administrador). Al menos un campo requerido.',
    properties: {
      nombre: { type: 'string', maxLength: 100, example: 'Recta del Parque Norte (Actualizada)' },
      descripcion: { type: 'string', nullable: true, example: 'Descripción actualizada' },
      dificultad: { type: 'string', maxLength: 50, nullable: true, example: 'Alta' },
      coordenadas: { type: 'string', maxLength: 100, nullable: true, example: '4.710989,-74.072092' },
    },
  },
} as const;