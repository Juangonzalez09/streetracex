export const profileSchemas = {
  VehicleSummary: {
    type: 'object',
    description: 'Vehiculo resumido embebido en un perfil (sin userId)',
    required: ['id', 'tipoVehiculo', 'marca', 'modelo', 'anio', 'color', 'activo', 'createdAt'],
    properties: {
      id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
      tipoVehiculo: {
        type: 'string',
        enum: ['AUTO', 'MOTO', 'MONOPATIN_ELECTRICO'],
        example: 'AUTO',
      },
      marca: { type: 'string', example: 'Nissan' },
      modelo: { type: 'string', example: 'Silvia S15' },
      anio: { type: 'integer', example: 2000 },
      color: { type: 'string', example: 'Negro mate' },
      placa: { type: 'string', nullable: true, example: 'ABC-123' },
      foto: { type: 'string', nullable: true, example: 'https://cdn.streetracex.dev/vehicles/silvia_s15.png' },
      modificaciones: { type: 'string', nullable: true, example: 'Turbo SR20DET, suspensión coilover' },
      activo: { type: 'boolean', example: true },
      createdAt: { type: 'string', format: 'date-time', example: '2026-05-07T10:00:00.000Z' },
    },
  },

  MyProfile: {
    type: 'object',
    description: 'Perfil completo del piloto autenticado',
    required: [
      'id', 'username', 'email', 'rol', 'rango', 'estado',
      'victorias', 'derrotas', 'retosConsecutivos', 'createdAt', 'updatedAt', 'vehicles',
    ],
    properties: {
      id: { type: 'string', format: 'uuid', example: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9' },
      username: { type: 'string', example: 'street_king' },
      email: { type: 'string', format: 'email', example: 'street.king@sx.dev' },
      rol: { type: 'string', enum: ['PILOTO', 'ADMINISTRADOR'], example: 'PILOTO' },
      rango: { type: 'string', enum: ['D', 'C', 'B', 'A', 'S'], example: 'D' },
      estado: { type: 'string', enum: ['ACTIVO', 'INACTIVO', 'SUSPENDIDO'], example: 'ACTIVO' },
      fotoPerfil: { type: 'string', nullable: true, example: 'https://cdn.streetracex.dev/profiles/street_king.png' },
      zonaLocalidad: { type: 'string', nullable: true, example: 'Centro' },
      zonaCiudad: { type: 'string', nullable: true, example: 'Bogota' },
      zonaEstado: { type: 'string', nullable: true, example: 'Cundinamarca' },
      zonaPais: { type: 'string', nullable: true, example: 'Colombia' },
      victorias: { type: 'integer', example: 5 },
      derrotas: { type: 'integer', example: 2 },
      retosConsecutivos: { type: 'integer', example: 1, description: 'Victorias consecutivas actuales. Al llegar a 2, sube de rango.' },
      createdAt: { type: 'string', format: 'date-time', example: '2026-05-01T10:00:00.000Z' },
      updatedAt: { type: 'string', format: 'date-time', example: '2026-05-07T15:30:00.000Z' },
      vehicles: {
        type: 'array',
        items: { $ref: '#/components/schemas/VehicleSummary' },
        description: 'Vehículos del piloto. El activo aparece primero.',
      },
    },
  },

  PublicProfile: {
    type: 'object',
    description: 'Perfil público de un piloto (sin datos sensibles)',
    required: ['id', 'username', 'rango', 'victorias', 'derrotas', 'retosConsecutivos', 'vehicles'],
    properties: {
      id: { type: 'string', format: 'uuid', example: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9' },
      username: { type: 'string', example: 'ghost_rider' },
      rango: { type: 'string', enum: ['D', 'C', 'B', 'A', 'S'], example: 'C' },
      fotoPerfil: { type: 'string', nullable: true, example: 'https://cdn.streetracex.dev/profiles/ghost_rider.png' },
      zonaLocalidad: { type: 'string', nullable: true, example: 'Usaquén' },
      zonaCiudad: { type: 'string', nullable: true, example: 'Bogota' },
      zonaEstado: { type: 'string', nullable: true, example: 'Cundinamarca' },
      zonaPais: { type: 'string', nullable: true, example: 'Colombia' },
      victorias: { type: 'integer', example: 12 },
      derrotas: { type: 'integer', example: 3 },
      retosConsecutivos: { type: 'integer', example: 1 },
      vehicles: {
        type: 'array',
        items: { $ref: '#/components/schemas/VehicleSummary' },
        description: 'Vehículos del piloto. El activo aparece primero.',
      },
    },
  },

  MyProfileResponse: {
    type: 'object',
    description: 'Respuesta estándar con perfil propio',
    required: ['success', 'message', 'data'],
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Perfil obtenido' },
      data: { $ref: '#/components/schemas/MyProfile' },
    },
  },

  PublicProfileResponse: {
    type: 'object',
    description: 'Respuesta estándar con perfil público',
    required: ['success', 'message', 'data'],
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Perfil público obtenido' },
      data: { $ref: '#/components/schemas/PublicProfile' },
    },
  },

  UpdateProfileRequest: {
    type: 'object',
    description: 'Campos editables del perfil. Todos opcionales. Enviar null para limpiar un campo.',
    properties: {
      username: {
        type: 'string',
        minLength: 3,
        maxLength: 50,
        pattern: '^[a-zA-Z0-9_]+$',
        example: 'street_king_v2',
      },
      fotoPerfil: { type: 'string', nullable: true, example: 'https://cdn.streetracex.dev/profiles/new.png' },
      zonaLocalidad: { type: 'string', nullable: true, example: 'Chapinero' },
      zonaCiudad: { type: 'string', nullable: true, example: 'Bogota' },
      zonaEstado: { type: 'string', nullable: true, example: 'Cundinamarca' },
      zonaPais: { type: 'string', nullable: true, example: 'Colombia' },
    },
    example: {
      username: 'street_king_v2',
      zonaCiudad: 'Medellin',
      zonaEstado: 'Antioquia',
    },
  },
} as const;
