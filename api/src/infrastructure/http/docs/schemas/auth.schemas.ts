export const authSchemas = {
  AuthUser: {
    type: 'object',
    description: 'Usuario autenticado expuesto al cliente',
    required: ['id', 'username', 'email', 'rol', 'rango'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        example: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9',
      },
      username: {
        type: 'string',
        example: 'street_king',
      },
      email: {
        type: 'string',
        format: 'email',
        example: 'street.king@sx.dev',
      },
      rol: {
        type: 'string',
        example: 'PILOTO',
      },
      rango: {
        type: 'string',
        example: 'D',
      },
    },
  },
  AuthSessionData: {
    type: 'object',
    description: 'Datos de sesion que consume el frontend',
    required: ['accessToken', 'tokenType', 'expiresIn', 'user'],
    properties: {
      accessToken: {
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
      tokenType: {
        type: 'string',
        example: 'Bearer',
      },
      expiresIn: {
        type: 'string',
        example: '15m',
      },
      user: {
        $ref: '#/components/schemas/AuthUser',
      },
    },
  },
  AuthSessionResponse: {
    type: 'object',
    description: 'Respuesta estandar para login y refresh',
    required: ['success', 'message', 'data'],
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      message: {
        type: 'string',
      },
      data: {
        $ref: '#/components/schemas/AuthSessionData',
      },
    },
    example: {
      success: true,
      message: 'Login exitoso',
      data: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        tokenType: 'Bearer',
        expiresIn: '15m',
        user: {
          id: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9',
          username: 'street_king',
          email: 'street.king@sx.dev',
          rol: 'PILOTO',
          rango: 'D',
        },
      },
    },
  },
  RegisterUserRequest: {
    type: 'object',
    description: 'Payload para crear un usuario',
    required: ['username', 'email', 'password'],
    properties: {
      username: {
        type: 'string',
        minLength: 3,
        maxLength: 50,
        example: 'street_king',
      },
      email: {
        type: 'string',
        format: 'email',
        example: 'street.king@sx.dev',
      },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 72,
        example: 'StreetRaceX_2026!',
      },
      fotoPerfil: {
        type: 'string',
        nullable: true,
        example: 'https://cdn.streetracex.dev/profiles/street_king.png',
      },
      zonaLocalidad: {
        type: 'string',
        nullable: true,
        example: 'Centro',
      },
      zonaCiudad: {
        type: 'string',
        nullable: true,
        example: 'Bogota',
      },
      zonaEstado: {
        type: 'string',
        nullable: true,
        example: 'Cundinamarca',
      },
      zonaPais: {
        type: 'string',
        nullable: true,
        example: 'Colombia',
      },
    },
    example: {
      username: 'street_king',
      email: 'street.king@sx.dev',
      password: 'StreetRaceX_2026!',
      fotoPerfil: 'https://cdn.streetracex.dev/profiles/street_king.png',
      zonaLocalidad: 'Centro',
      zonaCiudad: 'Bogota',
      zonaEstado: 'Cundinamarca',
      zonaPais: 'Colombia',
    },
  },
  RegisterUserData: {
    type: 'object',
    description: 'Datos minimos expuestos tras el registro',
    required: ['id', 'username', 'email', 'createdAt'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        example: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9',
      },
      username: {
        type: 'string',
        example: 'street_king',
      },
      email: {
        type: 'string',
        format: 'email',
        example: 'street.king@sx.dev',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2026-05-06T21:40:33.221Z',
      },
    },
  },
  RegisterUserResponse: {
    type: 'object',
    description: 'Respuesta de registro exitoso',
    required: ['success', 'message', 'data'],
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      message: {
        type: 'string',
        example: 'Usuario registrado con exito',
      },
      data: {
        $ref: '#/components/schemas/RegisterUserData',
      },
    },
    example: {
      success: true,
      message: 'Usuario registrado con exito',
      data: {
        id: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9',
        username: 'street_king',
        email: 'street.king@sx.dev',
        createdAt: '2026-05-06T21:40:33.221Z',
      },
    },
  },
  LoginRequest: {
    type: 'object',
    description: 'Credenciales para iniciar sesion',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'street.king@sx.dev',
      },
      password: {
        type: 'string',
        example: 'StreetRaceX_2026!',
      },
    },
    example: {
      email: 'street.king@sx.dev',
      password: 'StreetRaceX_2026!',
    },
  },
  RefreshRequest: {
    type: 'object',
    description: 'Refresh token opcional cuando no se envia cookie',
    properties: {
      refreshToken: {
        type: 'string',
        example: 'oaC8Yf4mSk2r9N2EHb9TZrUk...',
      },
    },
    example: {
      refreshToken: 'oaC8Yf4mSk2r9N2EHb9TZrUk...',
    },
  },
} as const;
