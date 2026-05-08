export const vehiclePaths = {
  '/api/vehicles': {
    get: {
      tags: ['Vehicles'],
      summary: 'Lista mis vehiculos',
      description: 'Retorna todos los vehiculos registrados por el piloto autenticado.',
      operationId: 'listMyVehicles',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Lista de vehiculos obtenida',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VehicleListResponse' },
              examples: {
                conVehiculos: {
                  summary: 'Piloto con vehiculos registrados',
                  value: {
                    success: true,
                    message: 'Vehiculos obtenidos con exito',
                    data: [
                      {
                        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                        userId: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9',
                        tipoVehiculo: 'AUTO',
                        marca: 'Nissan',
                        modelo: 'Silvia S15',
                        anio: 2000,
                        color: 'Negro mate',
                        placa: 'ABC-123',
                        foto: null,
                        modificaciones: 'Turbo SR20DET',
                        activo: true,
                        createdAt: '2026-05-07T10:00:00.000Z',
                      },
                    ],
                  },
                },
                sinVehiculos: {
                  summary: 'Piloto sin vehiculos aun',
                  value: {
                    success: true,
                    message: 'Vehiculos obtenidos con exito',
                    data: [],
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Token de acceso requerido',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                sinToken: {
                  summary: 'Sin token',
                  value: { success: false, message: 'Token requerido' },
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
                internalError: {
                  summary: 'Error inesperado',
                  value: { success: false, message: 'Error interno al obtener vehiculos' },
                },
              },
            },
          },
        },
      },
    },

    post: {
      tags: ['Vehicles'],
      summary: 'Registra un nuevo vehiculo',
      description:
        'Agrega un vehiculo al perfil del piloto. Maximo 3 vehiculos por piloto. AUTO y MOTO requieren placa; MONOPATIN_ELECTRICO no puede tenerla.',
      operationId: 'createMyVehicle',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        description: 'Datos del vehiculo a registrar',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateVehicleRequest' },
            examples: {
              auto: {
                summary: 'Registrar un auto',
                value: {
                  tipoVehiculo: 'AUTO',
                  marca: 'Nissan',
                  modelo: 'Silvia S15',
                  anio: 2000,
                  color: 'Negro mate',
                  placa: 'ABC-123',
                  modificaciones: 'Turbo SR20DET, suspensión coilover',
                },
              },
              monopatin: {
                summary: 'Registrar un monopatin electrico (sin placa)',
                value: {
                  tipoVehiculo: 'MONOPATIN_ELECTRICO',
                  marca: 'Xiaomi',
                  modelo: 'Pro 4',
                  anio: 2024,
                  color: 'Gris',
                  placa: null,
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Vehiculo registrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VehicleResponse' },
              examples: {
                ok: {
                  summary: 'Vehiculo creado exitosamente',
                  value: {
                    success: true,
                    message: 'Vehiculo creado con exito',
                    data: {
                      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                      userId: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9',
                      tipoVehiculo: 'AUTO',
                      marca: 'Nissan',
                      modelo: 'Silvia S15',
                      anio: 2000,
                      color: 'Negro mate',
                      placa: 'ABC-123',
                      foto: null,
                      modificaciones: 'Turbo SR20DET, suspensión coilover',
                      activo: false,
                      createdAt: '2026-05-07T10:00:00.000Z',
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Regla de placa violada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                autoSinPlaca: {
                  summary: 'AUTO sin placa',
                  value: { success: false, message: 'AUTO y MOTO requieren placa' },
                },
                monopatinConPlaca: {
                  summary: 'MONOPATIN con placa',
                  value: { success: false, message: 'MONOPATIN_ELECTRICO no puede tener placa' },
                },
                limiteAlcanzado: {
                  summary: 'Limite de 3 vehiculos alcanzado',
                  value: { success: false, message: 'No puedes tener mas de 3 vehiculos' },
                },
              },
            },
          },
        },
        401: {
          description: 'Token de acceso requerido',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                sinToken: {
                  summary: 'Sin token',
                  value: { success: false, message: 'Token requerido' },
                },
              },
            },
          },
        },
        409: {
          description: 'Placa ya registrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                placaDuplicada: {
                  summary: 'Placa existente',
                  value: { success: false, message: 'La placa ya está registrada' },
                },
              },
            },
          },
        },
        422: {
          description: 'Error de validacion de entrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                campoRequerido: {
                  summary: 'Campo obligatorio faltante',
                  value: { success: false, message: 'marca es obligatorio' },
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
                internalError: {
                  summary: 'Error inesperado',
                  value: { success: false, message: 'Error interno al crear vehiculo' },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/vehicles/{vehicleId}': {
    patch: {
      tags: ['Vehicles'],
      summary: 'Actualiza un vehiculo',
      description: 'Modifica campos del vehiculo. Solo el propietario puede editarlo. Todos los campos son opcionales.',
      operationId: 'updateMyVehicle',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'vehicleId',
          in: 'path',
          required: true,
          description: 'UUID del vehiculo a actualizar',
          schema: { type: 'string', format: 'uuid' },
          example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        },
      ],
      requestBody: {
        required: true,
        description: 'Campos a actualizar',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateVehicleRequest' },
            examples: {
              cambiarColor: {
                summary: 'Cambiar solo el color',
                value: { color: 'Blanco perla' },
              },
              cambiarVarios: {
                summary: 'Actualizar color y modificaciones',
                value: {
                  color: 'Blanco perla',
                  modificaciones: 'Frenos Brembo añadidos',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Vehiculo actualizado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VehicleResponse' },
              examples: {
                ok: {
                  summary: 'Actualizacion exitosa',
                  value: {
                    success: true,
                    message: 'Vehiculo actualizado con exito',
                    data: {
                      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                      userId: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9',
                      tipoVehiculo: 'AUTO',
                      marca: 'Nissan',
                      modelo: 'Silvia S15',
                      anio: 2000,
                      color: 'Blanco perla',
                      placa: 'ABC-123',
                      foto: null,
                      modificaciones: 'Frenos Brembo añadidos',
                      activo: true,
                      createdAt: '2026-05-07T10:00:00.000Z',
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Regla de placa violada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                reglaPlaca: {
                  summary: 'Violacion de regla de placa',
                  value: { success: false, message: 'AUTO y MOTO requieren placa' },
                },
              },
            },
          },
        },
        401: {
          description: 'Token de acceso requerido',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                sinToken: {
                  summary: 'Sin token',
                  value: { success: false, message: 'Token requerido' },
                },
              },
            },
          },
        },
        404: {
          description: 'Vehiculo no encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                noEncontrado: {
                  summary: 'Vehiculo inexistente o no pertenece al piloto',
                  value: { success: false, message: 'Vehiculo no encontrado' },
                },
              },
            },
          },
        },
        409: {
          description: 'Placa ya registrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                placaDuplicada: {
                  summary: 'Placa en uso por otro vehiculo',
                  value: { success: false, message: 'La placa ya está registrada' },
                },
              },
            },
          },
        },
        422: {
          description: 'Error de validacion de entrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                uuidInvalido: {
                  summary: 'vehicleId no es un UUID valido',
                  value: { success: false, message: 'vehicleId debe ser un UUID valido' },
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
                internalError: {
                  summary: 'Error inesperado',
                  value: { success: false, message: 'Error interno al actualizar vehiculo' },
                },
              },
            },
          },
        },
      },
    },

    delete: {
      tags: ['Vehicles'],
      summary: 'Elimina un vehiculo',
      description: 'Elimina permanentemente un vehiculo del piloto. Solo el propietario puede eliminarlo.',
      operationId: 'deleteMyVehicle',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'vehicleId',
          in: 'path',
          required: true,
          description: 'UUID del vehiculo a eliminar',
          schema: { type: 'string', format: 'uuid' },
          example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        },
      ],
      responses: {
        200: {
          description: 'Vehiculo eliminado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                ok: {
                  summary: 'Eliminacion exitosa',
                  value: { success: true, message: 'Vehiculo eliminado con exito' },
                },
              },
            },
          },
        },
        401: {
          description: 'Token de acceso requerido',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                sinToken: {
                  summary: 'Sin token',
                  value: { success: false, message: 'Token requerido' },
                },
              },
            },
          },
        },
        404: {
          description: 'Vehiculo no encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                noEncontrado: {
                  summary: 'Vehiculo inexistente o no pertenece al piloto',
                  value: { success: false, message: 'Vehiculo no encontrado' },
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
                internalError: {
                  summary: 'Error inesperado',
                  value: { success: false, message: 'Error interno al eliminar vehiculo' },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/vehicles/{vehicleId}/activate': {
    patch: {
      tags: ['Vehicles'],
      summary: 'Activa un vehiculo',
      description:
        'Marca el vehiculo como activo. Desactiva automaticamente cualquier otro vehiculo del piloto. Solo puede haber un vehiculo activo a la vez.',
      operationId: 'activateMyVehicle',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'vehicleId',
          in: 'path',
          required: true,
          description: 'UUID del vehiculo a activar',
          schema: { type: 'string', format: 'uuid' },
          example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        },
      ],
      responses: {
        200: {
          description: 'Vehiculo activado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VehicleResponse' },
              examples: {
                ok: {
                  summary: 'Vehiculo activado exitosamente',
                  value: {
                    success: true,
                    message: 'Vehiculo activado con exito',
                    data: {
                      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                      userId: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9',
                      tipoVehiculo: 'AUTO',
                      marca: 'Nissan',
                      modelo: 'Silvia S15',
                      anio: 2000,
                      color: 'Negro mate',
                      placa: 'ABC-123',
                      foto: null,
                      modificaciones: 'Turbo SR20DET',
                      activo: true,
                      createdAt: '2026-05-07T10:00:00.000Z',
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Token de acceso requerido',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                sinToken: {
                  summary: 'Sin token',
                  value: { success: false, message: 'Token requerido' },
                },
              },
            },
          },
        },
        404: {
          description: 'Vehiculo no encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                noEncontrado: {
                  summary: 'Vehiculo inexistente o no pertenece al piloto',
                  value: { success: false, message: 'Vehiculo no encontrado' },
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
                internalError: {
                  summary: 'Error inesperado',
                  value: { success: false, message: 'Error interno al activar vehiculo' },
                },
              },
            },
          },
        },
      },
    },
  },
} as const;
