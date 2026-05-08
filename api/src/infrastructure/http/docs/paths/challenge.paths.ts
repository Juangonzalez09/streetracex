const challengeIdParam = {
  name: 'challengeId',
  in: 'path',
  required: true,
  description: 'UUID del reto',
  schema: { type: 'string', format: 'uuid' },
  example: 'c1d2e3f4-a5b6-7890-cdef-123456789abc',
};

export const challengePaths = {
  '/api/challenges': {
    post: {
      tags: ['Challenges'],
      summary: 'Envía un reto a otro piloto',
      description:
        'Crea un reto en estado PENDIENTE. El vehículo del retador se toma de su vehículo activo automáticamente. Reglas: mismo rango, mismo tipo de vehículo activo, sin reto activo duplicado entre los mismos pilotos.',
      operationId: 'sendChallenge',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/SendChallengeRequest' },
            examples: {
              cuartoMilla: {
                summary: 'Reto de cuarto de milla',
                value: {
                  retadoId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                  tipoCarrera: 'CUARTO_MILLA',
                  notas: 'Este fin de semana en la vía principal',
                  fechaAcordada: '2026-06-01T18:00:00.000Z',
                },
              },
              sinNotas: {
                summary: 'Reto mínimo sin notas',
                value: {
                  retadoId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                  tipoCarrera: 'DERRAPE',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Reto enviado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChallengeResponse' },
              examples: {
                ok: {
                  summary: 'Reto creado en estado PENDIENTE',
                  value: {
                    success: true,
                    message: 'Reto enviado',
                    data: {
                      id: 'c1d2e3f4-a5b6-7890-cdef-123456789abc',
                      retadorId: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9',
                      retadoId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                      tipoCarrera: 'CUARTO_MILLA',
                      vehiculoRetadorId: 'v1v2v3v4-e5f6-7890-abcd-ef1234567890',
                      vehiculoRetadoId: null,
                      estado: 'PENDIENTE',
                      ganadorId: null,
                      reporteRetadorId: null,
                      reporteRetadoId: null,
                      notas: 'Este fin de semana en la vía principal',
                      fechaAcordada: '2026-06-01T18:00:00.000Z',
                      createdAt: '2026-05-07T20:00:00.000Z',
                      updatedAt: '2026-05-07T20:00:00.000Z',
                      retador: { id: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9', username: 'piloto_alpha', rango: 'D' },
                      retado: { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', username: 'piloto_beta', rango: 'D' },
                      ganador: null,
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'No puedes retarte a ti mismo',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: { selfChallenge: { summary: 'Auto-reto', value: { success: false, message: 'No puedes retarte a ti mismo' } } },
            },
          },
        },
        404: {
          description: 'Piloto retado no encontrado o inactivo',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: { notFound: { summary: 'Piloto no existe', value: { success: false, message: 'El piloto retado no existe o no está activo' } } },
            },
          },
        },
        409: {
          description: 'Ya existe un reto activo entre estos pilotos',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: { duplicate: { summary: 'Reto duplicado', value: { success: false, message: 'Ya existe un reto activo entre estos pilotos' } } },
            },
          },
        },
        422: {
          description: 'Regla de negocio violada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                noVehicle: { summary: 'Sin vehículo activo', value: { success: false, message: 'Necesitas un vehículo activo para enviar un reto' } },
                differentRank: { summary: 'Rango diferente', value: { success: false, message: 'Solo puedes retar a pilotos del mismo rango' } },
                differentVehicle: { summary: 'Tipo de vehículo diferente', value: { success: false, message: 'El piloto retado no tiene un vehículo activo del mismo tipo' } },
              },
            },
          },
        },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        500: { description: 'Error interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
      },
    },

    get: {
      tags: ['Challenges'],
      summary: 'Lista mis retos',
      description: 'Retorna los retos del piloto autenticado (enviados, recibidos o todos). Ordenados por fecha de creación descendente.',
      operationId: 'getMyChallenges',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'tipo',
          in: 'query',
          required: false,
          description: 'Filtrar por dirección del reto',
          schema: { type: 'string', enum: ['enviados', 'recibidos', 'todos'], default: 'todos' },
        },
        {
          name: 'estado',
          in: 'query',
          required: false,
          description: 'Filtrar por estado del reto',
          schema: { type: 'string', enum: ['PENDIENTE', 'ACEPTADO', 'RECHAZADO', 'EN_CURSO', 'COMPLETADO', 'CANCELADO'] },
        },
      ],
      responses: {
        200: {
          description: 'Lista de retos',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChallengeListResponse' },
              examples: {
                ok: {
                  summary: 'Retos obtenidos',
                  value: { success: true, message: 'Retos obtenidos', data: [] },
                },
              },
            },
          },
        },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        500: { description: 'Error interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
      },
    },
  },

  '/api/challenges/{challengeId}/accept': {
    patch: {
      tags: ['Challenges'],
      summary: 'Acepta un reto recibido',
      description: 'Solo el retado puede aceptar. El reto debe estar en estado PENDIENTE. Se enlaza automáticamente el vehículo activo del retado.',
      operationId: 'acceptChallenge',
      security: [{ bearerAuth: [] }],
      parameters: [challengeIdParam],
      responses: {
        200: {
          description: 'Reto aceptado — estado: ACEPTADO, vehiculoRetadoId asignado',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ChallengeResponse' } } },
        },
        403: { description: 'No eres el retado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' }, examples: { forbidden: { value: { success: false, message: 'Solo el retado puede aceptar el reto' } } } } } },
        404: { description: 'Reto no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        409: { description: 'El reto no está en estado PENDIENTE', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        422: { description: 'Sin vehículo activo', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' }, examples: { noVehicle: { value: { success: false, message: 'Necesitas un vehículo activo para aceptar el reto' } } } } } },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
      },
    },
  },

  '/api/challenges/{challengeId}/reject': {
    patch: {
      tags: ['Challenges'],
      summary: 'Rechaza un reto recibido',
      description: 'Solo el retado puede rechazar. El reto debe estar en estado PENDIENTE.',
      operationId: 'rejectChallenge',
      security: [{ bearerAuth: [] }],
      parameters: [challengeIdParam],
      responses: {
        200: {
          description: 'Reto rechazado — estado: RECHAZADO',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ChallengeResponse' } } },
        },
        403: { description: 'No eres el retado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        404: { description: 'Reto no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        409: { description: 'El reto no está en estado PENDIENTE', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
      },
    },
  },

  '/api/challenges/{challengeId}/cancel': {
    patch: {
      tags: ['Challenges'],
      summary: 'Cancela un reto',
      description: 'Cualquier participante puede cancelar si el reto está en PENDIENTE o ACEPTADO. No se puede cancelar en EN_CURSO.',
      operationId: 'cancelChallenge',
      security: [{ bearerAuth: [] }],
      parameters: [challengeIdParam],
      responses: {
        200: {
          description: 'Reto cancelado — estado: CANCELADO',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ChallengeResponse' } } },
        },
        403: { description: 'No participas en este reto', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        404: { description: 'Reto no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        409: { description: 'El reto no puede cancelarse en su estado actual', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
      },
    },
  },

  '/api/challenges/{challengeId}/start': {
    patch: {
      tags: ['Challenges'],
      summary: 'Inicia el reto (marca como EN_CURSO)',
      description: 'Solo el retador puede iniciar. El reto debe estar en estado ACEPTADO.',
      operationId: 'startChallenge',
      security: [{ bearerAuth: [] }],
      parameters: [challengeIdParam],
      responses: {
        200: {
          description: 'Reto iniciado — estado: EN_CURSO',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ChallengeResponse' } } },
        },
        403: { description: 'Solo el retador puede iniciar', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        404: { description: 'Reto no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        409: { description: 'El reto debe estar ACEPTADO para iniciarse', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
      },
    },
  },

  '/api/challenges/{challengeId}/result': {
    patch: {
      tags: ['Challenges'],
      summary: 'Reporta el resultado del reto',
      description:
        'Cada participante declara quién ganó. Si ambos coinciden, el reto se completa automáticamente y se actualizan las estadísticas y el rango. Si hay desacuerdo, el reto queda EN_CURSO hasta que un administrador resuelva.',
      operationId: 'reportChallengeResult',
      security: [{ bearerAuth: [] }],
      parameters: [challengeIdParam],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ReportResultRequest' },
            examples: {
              declararGanador: {
                summary: 'Declarar ganador',
                value: { ganadorId: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Resultado reportado o confirmado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChallengeResponse' },
              examples: {
                esperando: { summary: 'Esperando al otro piloto', value: { success: true, message: 'Resultado reportado. Esperando confirmación del otro piloto', data: {} } },
                confirmado: { summary: 'Reto completado por consenso', value: { success: true, message: 'Resultado confirmado', data: {} } },
                rangoSubido: { summary: 'Reto completado y ganador subió de rango', value: { success: true, message: 'Resultado confirmado. ¡El ganador subió de rango!', data: {} } },
              },
            },
          },
        },
        403: { description: 'No participas en este reto', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        404: { description: 'Reto no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        409: {
          description: 'El reto no está EN_CURSO o ya reportaste',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              examples: {
                notInProgress: { value: { success: false, message: 'El reto debe estar EN_CURSO para reportar un resultado' } },
                alreadyReported: { value: { success: false, message: 'Ya reportaste el resultado de este reto' } },
              },
            },
          },
        },
        422: { description: 'ganadorId no es participante del reto', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
      },
    },
  },

  '/api/challenges/{challengeId}/admin-resolve': {
    patch: {
      tags: ['Challenges'],
      summary: 'Resuelve un reto en disputa (solo ADMINISTRADOR)',
      description: 'Fuerza el resultado de un reto EN_CURSO. Usado cuando los pilotos no coinciden en el resultado. Actualiza estadísticas y rango igual que la resolución normal.',
      operationId: 'adminResolveChallenge',
      security: [{ bearerAuth: [] }],
      parameters: [challengeIdParam],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AdminResolveRequest' },
            examples: {
              resolver: { summary: 'Forzar ganador', value: { ganadorId: 'f4f0e722-8aa9-4c7b-833f-56e378f79ef9' } },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Reto resuelto — estado: COMPLETADO',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ChallengeResponse' } } },
        },
        403: { description: 'Acceso denegado — solo ADMINISTRADOR', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' }, examples: { forbidden: { value: { success: false, message: 'Acceso denegado' } } } } } },
        404: { description: 'Reto no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        409: { description: 'El reto no está EN_CURSO', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        422: { description: 'ganadorId no es participante del reto', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
      },
    },
  },
} as const;