export const profilePaths = {
  '/api/v1/profile/me': {
    get: {
      tags: ['Profile'],
      summary: 'Obtiene el perfil del piloto autenticado',
      description: 'Retorna el perfil completo con estadísticas y lista de vehículos. El vehículo activo aparece primero.',
      operationId: 'getMyProfile',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Perfil obtenido',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MyProfileResponse' },
              examples: {
                ok: {
                  summary: 'Perfil con vehículo activo',
                  value: {
                    success: true,
                    message: 'Perfil obtenido',
                    data: {
                      id: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9',
                      username: 'street_king',
                      email: 'street.king@sx.dev',
                      rol: 'PILOTO',
                      rango: 'D',
                      estado: 'ACTIVO',
                      fotoPerfil: null,
                      zonaLocalidad: 'Centro',
                      zonaCiudad: 'Bogota',
                      zonaEstado: 'Cundinamarca',
                      zonaPais: 'Colombia',
                      victorias: 0,
                      derrotas: 0,
                      retosConsecutivos: 0,
                      createdAt: '2026-05-01T10:00:00.000Z',
                      updatedAt: '2026-05-07T15:30:00.000Z',
                      vehicles: [
                        {
                          id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                          tipoVehiculo: 'AUTO',
                          marca: 'Nissan',
                          modelo: 'Silvia S15',
                          anio: 2000,
                          color: 'Negro mate',
                          placa: 'ABC-123',
                          foto: null,
                          modificaciones: null,
                          activo: true,
                          createdAt: '2026-05-07T10:00:00.000Z',
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'No autenticado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                unauthorized: { summary: 'Token ausente o inválido', value: { success: false, message: 'No autenticado' } },
              },
            },
          },
        },
        404: {
          description: 'Usuario no encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                notFound: { summary: 'Usuario eliminado o no existe', value: { success: false, message: 'Usuario no encontrado' } },
              },
            },
          },
        },
        500: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                internalError: { summary: 'Error inesperado', value: { success: false, message: 'Error interno al obtener perfil' } },
              },
            },
          },
        },
      },
    },
    patch: {
      tags: ['Profile'],
      summary: 'Actualiza el perfil del piloto autenticado',
      description: 'Permite editar username, foto de perfil y datos de zona. Todos los campos son opcionales. Enviar null limpia el campo.',
      operationId: 'updateMyProfile',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        description: 'Campos a actualizar. Al menos uno requerido.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateProfileRequest' },
            examples: {
              updateZone: {
                summary: 'Cambiar zona',
                value: { zonaCiudad: 'Medellin', zonaEstado: 'Antioquia' },
              },
              updateUsername: {
                summary: 'Cambiar username',
                value: { username: 'ghost_rider_x' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Perfil actualizado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MyProfileResponse' },
              examples: {
                ok: {
                  summary: 'Actualización exitosa',
                  value: {
                    success: true,
                    message: 'Perfil actualizado',
                    data: {
                      id: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9',
                      username: 'ghost_rider_x',
                      email: 'street.king@sx.dev',
                      rol: 'PILOTO',
                      rango: 'D',
                      estado: 'ACTIVO',
                      fotoPerfil: null,
                      zonaLocalidad: null,
                      zonaCiudad: 'Medellin',
                      zonaEstado: 'Antioquia',
                      zonaPais: 'Colombia',
                      victorias: 0,
                      derrotas: 0,
                      retosConsecutivos: 0,
                      createdAt: '2026-05-01T10:00:00.000Z',
                      updatedAt: '2026-05-07T16:00:00.000Z',
                      vehicles: [],
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'No hay campos para actualizar',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                noFields: { summary: 'Body vacío', value: { success: false, message: 'No hay campos para actualizar' } },
              },
            },
          },
        },
        401: {
          description: 'No autenticado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                unauthorized: { summary: 'Token ausente o inválido', value: { success: false, message: 'No autenticado' } },
              },
            },
          },
        },
        404: {
          description: 'Usuario no encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                notFound: { summary: 'No existe', value: { success: false, message: 'Usuario no encontrado' } },
              },
            },
          },
        },
        409: {
          description: 'Username ya en uso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                conflict: { summary: 'Conflicto de username', value: { success: false, message: 'El nombre de usuario ya está en uso' } },
              },
            },
          },
        },
        422: {
          description: 'Error de validación de entrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                invalidUsername: {
                  summary: 'Username inválido',
                  value: { success: false, message: 'El username solo puede contener letras, números y guion bajo' },
                },
              },
            },
          },
        },
        500: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                internalError: { summary: 'Error inesperado', value: { success: false, message: 'Error interno al actualizar perfil' } },
              },
            },
          },
        },
      },
    },
  },

  '/api/v1/profile/me/deactivate': {
    patch: {
      tags: ['Profile'],
      summary: 'Desactiva la cuenta del piloto autenticado',
      description: 'Marca la cuenta como INACTIVA y revoca todos los refresh tokens activos. La cuenta no se elimina de la base de datos.',
      operationId: 'deactivateMyProfile',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Cuenta desactivada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiSuccess' },
              examples: {
                ok: { summary: 'Desactivación exitosa', value: { success: true, message: 'Cuenta desactivada' } },
              },
            },
          },
        },
        401: {
          description: 'No autenticado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                unauthorized: { summary: 'Token ausente o inválido', value: { success: false, message: 'No autenticado' } },
              },
            },
          },
        },
        404: {
          description: 'Usuario no encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                notFound: { summary: 'No existe', value: { success: false, message: 'Usuario no encontrado' } },
              },
            },
          },
        },
        500: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                internalError: { summary: 'Error inesperado', value: { success: false, message: 'Error interno al desactivar cuenta' } },
              },
            },
          },
        },
      },
    },
  },

  '/api/v1/profile/{userId}': {
    get: {
      tags: ['Profile'],
      summary: 'Obtiene el perfil público de un piloto',
      description: 'Retorna datos públicos de un piloto activo: rango, estadísticas y vehículos. Solo disponible si el usuario está ACTIVO.',
      operationId: 'getPublicProfile',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'userId',
          in: 'path',
          required: true,
          description: 'UUID del piloto a consultar',
          schema: { type: 'string', format: 'uuid' },
          example: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9',
        },
      ],
      responses: {
        200: {
          description: 'Perfil público obtenido',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PublicProfileResponse' },
              examples: {
                ok: {
                  summary: 'Piloto con historial',
                  value: {
                    success: true,
                    message: 'Perfil público obtenido',
                    data: {
                      id: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9',
                      username: 'ghost_rider',
                      rango: 'C',
                      fotoPerfil: null,
                      zonaLocalidad: 'Usaquén',
                      zonaCiudad: 'Bogota',
                      zonaEstado: 'Cundinamarca',
                      zonaPais: 'Colombia',
                      victorias: 12,
                      derrotas: 3,
                      retosConsecutivos: 1,
                      vehicles: [
                        {
                          id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                          tipoVehiculo: 'AUTO',
                          marca: 'Toyota',
                          modelo: 'Supra MK4',
                          anio: 1998,
                          color: 'Blanco perla',
                          placa: 'XYZ-789',
                          foto: null,
                          modificaciones: '2JZ-GTE twin turbo',
                          activo: true,
                          createdAt: '2026-05-03T12:00:00.000Z',
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'No autenticado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                unauthorized: { summary: 'Token ausente o inválido', value: { success: false, message: 'No autenticado' } },
              },
            },
          },
        },
        404: {
          description: 'Piloto no encontrado o inactivo',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                notFound: { summary: 'No existe o está inactivo', value: { success: false, message: 'Perfil público no encontrado' } },
              },
            },
          },
        },
        422: {
          description: 'UUID inválido en path',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                invalidUuid: { summary: 'Formato de UUID incorrecto', value: { success: false, message: 'userId debe ser un UUID válido' } },
              },
            },
          },
        },
        500: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                internalError: { summary: 'Error inesperado', value: { success: false, message: 'Error interno al obtener perfil público' } },
              },
            },
          },
        },
      },
    },
  },
} as const;
