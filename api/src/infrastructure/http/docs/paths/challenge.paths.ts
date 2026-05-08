const challengeIdParam = {
  name: 'challengeId',
  in: 'path',
  required: true,
  description: 'UUID del reto',
  schema: { type: 'string', format: 'uuid' },
  example: 'c1d2e3f4-a5b6-7890-cdef-123456789abc',
};

export const challengePaths = {
  '/api/v1/challenges': {
    post: {
      tags: ['Challenges'],
      summary: 'Enviar reto a otro piloto',
      description: 'Crea un reto en estado PENDIENTE. El vehículo del retador se toma de su vehículo activo. Reglas: mismo rango, mismo tipo de vehículo, sin reto activo duplicado. El campo `pistaId` es opcional.',
      operationId: 'sendChallenge',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/SendChallengeRequest' } } },
      },
      responses: {
        201: { description: 'Reto enviado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ChallengeResponse' } } } },
        400: { description: 'No puedes retarte a ti mismo', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        404: { description: 'Piloto retado o pista no encontrados', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        409: { description: 'Ya existe un reto activo entre estos pilotos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        422: { description: 'Regla de negocio violada o datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
      },
    },
    get: {
      tags: ['Challenges'],
      summary: 'Listar mis retos',
      description: 'Retorna los retos en los que participa el piloto autenticado. Filtrable por tipo (enviados/recibidos/todos) y estado.',
      operationId: 'listChallenges',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'tipo', in: 'query', schema: { type: 'string', enum: ['enviados', 'recibidos', 'todos'] }, description: 'Filtrar por participación' },
        { name: 'estado', in: 'query', schema: { type: 'string', enum: ['PENDIENTE', 'ACEPTADO', 'RECHAZADO', 'EN_CURSO', 'COMPLETADO', 'CANCELADO'] }, description: 'Filtrar por estado' },
      ],
      responses: {
        200: { description: 'Lista de retos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ChallengeListResponse' } } } },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
      },
    },
  },

  '/api/v1/challenges/{challengeId}': {
    get: {
      tags: ['Challenges'],
      summary: 'Obtener reto por ID',
      description: 'Retorna el detalle de un reto. Solo accesible para los dos participantes.',
      operationId: 'getChallengeById',
      security: [{ bearerAuth: [] }],
      parameters: [challengeIdParam],
      responses: {
        200: { description: 'Reto encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ChallengeResponse' } } } },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        403: { description: 'No participas en este reto', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        404: { description: 'Reto no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
      },
    },
  },

  '/api/v1/challenges/{challengeId}/status': {
    patch: {
      tags: ['Challenges'],
      summary: 'Actualizar estado del reto',
      description: `Transiciones de estado permitidas según el rol del piloto:
- **ACEPTADO** — solo el retado, desde PENDIENTE
- **RECHAZADO** — solo el retado, desde PENDIENTE
- **CANCELADO** — cualquier participante, desde PENDIENTE o ACEPTADO
- **EN_CURSO** — solo el retador, desde ACEPTADO`,
      operationId: 'updateChallengeStatus',
      security: [{ bearerAuth: [] }],
      parameters: [challengeIdParam],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ChallengeStatusRequest' } } },
      },
      responses: {
        200: { description: 'Estado actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ChallengeResponse' } } } },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        403: { description: 'No tienes permiso para esta transición', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        404: { description: 'Reto no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        409: { description: 'Transición de estado no válida', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
      },
    },
  },

  '/api/v1/challenges/{challengeId}/result': {
    patch: {
      tags: ['Challenges'],
      summary: 'Reportar resultado',
      description: 'Cada participante declara al ganador. Si ambos coinciden, el reto se completa automáticamente. Si difieren, queda en disputa hasta resolución del administrador.',
      operationId: 'reportChallengeResult',
      security: [{ bearerAuth: [] }],
      parameters: [challengeIdParam],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ReportResultRequest' } } },
      },
      responses: {
        200: { description: 'Resultado reportado o confirmado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ChallengeResponse' } } } },
        401: { description: 'No autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        403: { description: 'No participas en este reto', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        404: { description: 'Reto no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        409: { description: 'El reto no está EN_CURSO o ya reportaste', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        422: { description: 'El ganador no es participante del reto', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
      },
    },
  },
} as const;