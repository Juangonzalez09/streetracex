import { authPaths } from './paths/auth.paths';
import { authSchemas } from './schemas/auth.schemas';
import { commonSchemas } from './schemas/common.schemas';

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'StreetRaceX API',
    version: '1.0.0',
    description:
      'API REST de StreetRaceX. Esta especificacion documenta contratos HTTP de autenticacion con ejemplos y respuestas de error.',
    contact: {
      name: 'StreetRaceX Team',
      url: 'https://github.com/Juangonzalez09/streetracex',
    },
  },
  servers: [
    {
      url: process.env.API_URL || 'http://localhost:3000',
      description: process.env.API_URL ? 'Servidor de Producción' : 'Desarrollo Local',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Autenticacion y gestion de sesion' },
    { name: 'Vehicles', description: 'Gestion de vehiculos (proximamente)' },
    { name: 'Challenges', description: 'Retos y emparejamiento (proximamente)' },
    { name: 'Ranking', description: 'Sistema de rangos D-S (proximamente)' },
    { name: 'Notifications', description: 'Eventos y alertas (proximamente)' },
  ],
  externalDocs: {
    description: 'Repositorio del proyecto',
    url: 'https://github.com/Juangonzalez09/streetracex',
  },
  paths: {
    ...authPaths,
  },
  components: {
    securitySchemes: {
      refreshTokenCookie: {
        type: 'apiKey',
        in: 'cookie',
        name: 'refreshToken',
        description: 'Cookie httpOnly emitida en login y refresh',
      },
    },
    schemas: {
      ...commonSchemas,
      ...authSchemas,
    },
  },
} as const;
