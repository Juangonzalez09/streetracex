export const authPaths = {
  '/api/v1/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Registra un nuevo usuario',
      description: 'Crea una cuenta de piloto y retorna informacion minima del usuario creado.',
      operationId: 'registerUser',
      requestBody: {
        required: true,
        description: 'Datos base del usuario a registrar',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RegisterUserRequest',
            },
            examples: {
              pilotoBase: {
                summary: 'Registro inicial',
                value: {
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
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Usuario registrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterUserResponse',
              },
              examples: {
                ok: {
                  summary: 'Registro exitoso',
                  value: {
                    success: true,
                    message: 'Usuario registrado con éxito',
                    data: {
                      id: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9',
                      username: 'street_king',
                      email: 'street.king@sx.dev',
                      createdAt: '2026-05-06T21:40:33.221Z',
                    },
                  },
                },
              },
            },
          },
        },
        409: {
          description: 'Email o username ya registrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
              examples: {
                duplicatedEmail: {
                  summary: 'Correo duplicado',
                  value: {
                    success: false,
                    message: 'El correo ya está registrado',
                  },
                },
              },
            },
          },
        },
        422: {
          description: 'Error de validacion de entrada',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
              examples: {
                invalidInput: {
                  summary: 'Body invalido',
                  value: {
                    success: false,
                    message: 'email es obligatorio y debe tener un formato básico válido',
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
              examples: {
                internalError: {
                  summary: 'Error inesperado',
                  value: {
                    success: false,
                    message: 'Error interno al registrar usuario',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/v1/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Inicia sesion y retorna access token',
      description:
        'Valida credenciales, crea sesion y devuelve access token. El refresh token se envia en cookie httpOnly.',
      operationId: 'loginUser',
      requestBody: {
        required: true,
        description: 'Credenciales del usuario',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginRequest',
            },
            examples: {
              loginBase: {
                summary: 'Login con email y password',
                value: {
                  email: 'street.king@sx.dev',
                  password: 'StreetRaceX_2026!',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login exitoso',
          headers: {
            'Set-Cookie': {
              description: 'Cookie httpOnly con refresh token',
              schema: {
                type: 'string',
              },
            },
          },
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthSessionResponse',
              },
              examples: {
                ok: {
                  summary: 'Sesion iniciada',
                  value: {
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
              },
            },
          },
        },
        401: {
          description: 'Credenciales invalidas',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
              examples: {
                invalidCredentials: {
                  summary: 'Password o email invalidos',
                  value: {
                    success: false,
                    message: 'Credenciales inválidas',
                  },
                },
              },
            },
          },
        },
        403: {
          description: 'Cuenta no activa',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
              examples: {
                inactiveUser: {
                  summary: 'Cuenta no activa',
                  value: {
                    success: false,
                    message: 'Tu cuenta no está activa',
                  },
                },
              },
            },
          },
        },
        422: {
          description: 'Error de validacion de entrada',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
              examples: {
                invalidEmail: {
                  summary: 'Formato de email invalido',
                  value: {
                    success: false,
                    message: 'email es obligatorio y debe tener un formato básico válido',
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
              examples: {
                internalError: {
                  summary: 'Error inesperado',
                  value: {
                    success: false,
                    message: 'Error interno al iniciar sesión',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/v1/auth/refresh': {
    post: {
      tags: ['Auth'],
      summary: 'Refresca la sesion con refresh token',
      description:
        'Rota refresh token y emite un nuevo access token. Puede consumir refresh token desde cookie o body.',
      operationId: 'refreshSession',
      security: [{ refreshTokenCookie: [] }],
      requestBody: {
        required: false,
        description: 'Opcional: refreshToken cuando no se envia por cookie',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RefreshRequest',
            },
            examples: {
              bodyFallback: {
                summary: 'Refresh token en body',
                value: {
                  refreshToken: 'oaC8Yf4mSk2r9N2EHb9TZrUk...',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Sesion refrescada',
          headers: {
            'Set-Cookie': {
              description: 'Cookie httpOnly con refresh token rotado',
              schema: {
                type: 'string',
              },
            },
          },
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthSessionResponse',
              },
              examples: {
                ok: {
                  summary: 'Sesion renovada',
                  value: {
                    success: true,
                    message: 'Sesión refrescada',
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
              },
            },
          },
        },
        401: {
          description: 'Refresh token requerido o invalido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
              examples: {
                missingToken: {
                  summary: 'Token ausente',
                  value: {
                    success: false,
                    message: 'Refresh token requerido',
                  },
                },
                invalidToken: {
                  summary: 'Token expirado o invalido',
                  value: {
                    success: false,
                    message: 'Refresh token inválido o expirado',
                  },
                },
              },
            },
          },
        },
        403: {
          description: 'Cuenta no activa',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
              examples: {
                inactiveUser: {
                  summary: 'Cuenta no activa',
                  value: {
                    success: false,
                    message: 'Tu cuenta no está activa',
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
              examples: {
                internalError: {
                  summary: 'Error inesperado',
                  value: {
                    success: false,
                    message: 'Error interno al refrescar sesión',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/v1/auth/logout': {
    post: {
      tags: ['Auth'],
      summary: 'Cierra la sesion actual',
      description: 'Revoca refresh token activo (si existe) y limpia cookie de sesion.',
      operationId: 'logoutUser',
      security: [{ refreshTokenCookie: [] }],
      responses: {
        200: {
          description: 'Sesion cerrada',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LogoutResponse',
              },
              examples: {
                ok: {
                  summary: 'Logout exitoso',
                  value: {
                    success: true,
                    message: 'Sesión cerrada',
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
              examples: {
                internalError: {
                  summary: 'Error inesperado',
                  value: {
                    success: false,
                    message: 'Error interno al cerrar sesión',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
} as const;
