export const vehicleSchemas = {
  VehicleItem: {
    type: 'object',
    description: 'Vehiculo registrado por un piloto',
    required: ['id', 'userId', 'tipoVehiculo', 'marca', 'modelo', 'anio', 'color', 'activo', 'createdAt'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      },
      userId: {
        type: 'string',
        format: 'uuid',
        example: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9',
      },
      tipoVehiculo: {
        type: 'string',
        enum: ['AUTO', 'MOTO', 'MONOPATIN_ELECTRICO'],
        example: 'AUTO',
      },
      marca: {
        type: 'string',
        example: 'Nissan',
      },
      modelo: {
        type: 'string',
        example: 'Silvia S15',
      },
      anio: {
        type: 'integer',
        example: 2000,
      },
      color: {
        type: 'string',
        example: 'Negro mate',
      },
      placa: {
        type: 'string',
        nullable: true,
        description: 'Nulo exclusivamente para MONOPATIN_ELECTRICO',
        example: 'ABC-123',
      },
      foto: {
        type: 'string',
        nullable: true,
        example: 'https://cdn.streetracex.dev/vehicles/silvia_s15.png',
      },
      modificaciones: {
        type: 'string',
        nullable: true,
        example: 'Turbo SR20DET, suspensión coilover, LSD Cusco',
      },
      activo: {
        type: 'boolean',
        example: true,
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2026-05-07T10:00:00.000Z',
      },
    },
  },

  VehicleResponse: {
    type: 'object',
    description: 'Respuesta estandar con un vehiculo',
    required: ['success', 'message', 'data'],
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Vehiculo creado con exito' },
      data: { $ref: '#/components/schemas/VehicleItem' },
    },
  },

  VehicleListResponse: {
    type: 'object',
    description: 'Respuesta estandar con lista de vehiculos',
    required: ['success', 'message', 'data'],
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Vehiculos obtenidos con exito' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/VehicleItem' },
      },
    },
  },

  CreateVehicleRequest: {
    type: 'object',
    description: 'Payload para registrar un vehiculo. AUTO y MOTO requieren placa; MONOPATIN_ELECTRICO no puede tenerla.',
    required: ['tipoVehiculo', 'marca', 'modelo', 'anio', 'color'],
    properties: {
      tipoVehiculo: {
        type: 'string',
        enum: ['AUTO', 'MOTO', 'MONOPATIN_ELECTRICO'],
        example: 'AUTO',
      },
      marca: {
        type: 'string',
        example: 'Nissan',
      },
      modelo: {
        type: 'string',
        example: 'Silvia S15',
      },
      anio: {
        type: 'integer',
        minimum: 1900,
        example: 2000,
      },
      color: {
        type: 'string',
        example: 'Negro mate',
      },
      placa: {
        type: 'string',
        nullable: true,
        example: 'ABC-123',
      },
      foto: {
        type: 'string',
        nullable: true,
        example: 'https://cdn.streetracex.dev/vehicles/silvia_s15.png',
      },
      modificaciones: {
        type: 'string',
        nullable: true,
        example: 'Turbo SR20DET, suspensión coilover, LSD Cusco',
      },
    },
    example: {
      tipoVehiculo: 'AUTO',
      marca: 'Nissan',
      modelo: 'Silvia S15',
      anio: 2000,
      color: 'Negro mate',
      placa: 'ABC-123',
      modificaciones: 'Turbo SR20DET, suspensión coilover, LSD Cusco',
    },
  },

  UpdateVehicleRequest: {
    type: 'object',
    description: 'Campos a actualizar del vehiculo. Todos opcionales.',
    properties: {
      tipoVehiculo: {
        type: 'string',
        enum: ['AUTO', 'MOTO', 'MONOPATIN_ELECTRICO'],
        example: 'AUTO',
      },
      marca: { type: 'string', example: 'Nissan' },
      modelo: { type: 'string', example: 'Silvia S15' },
      anio: { type: 'integer', minimum: 1900, example: 2000 },
      color: { type: 'string', example: 'Blanco perla' },
      placa: { type: 'string', nullable: true, example: 'XYZ-789' },
      foto: { type: 'string', nullable: true, example: 'https://cdn.streetracex.dev/vehicles/silvia_updated.png' },
      modificaciones: { type: 'string', nullable: true, example: 'Frenos Brembo añadidos' },
    },
    example: {
      color: 'Blanco perla',
      modificaciones: 'Frenos Brembo añadidos',
    },
  },
} as const;
