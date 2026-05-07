export const commonSchemas = {
  ApiError: {
    type: 'object',
    description: 'Error estandar de la API',
    required: ['success', 'message'],
    properties: {
      success: {
        type: 'boolean',
        example: false,
      },
      message: {
        type: 'string',
        example: 'Credenciales invalidas',
      },
    },
    example: {
      success: false,
      message: 'Credenciales invalidas',
    },
  },
  LogoutResponse: {
    type: 'object',
    description: 'Respuesta de cierre de sesion',
    required: ['success', 'message'],
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      message: {
        type: 'string',
        example: 'Sesion cerrada',
      },
    },
    example: {
      success: true,
      message: 'Sesion cerrada',
    },
  },
} as const;
