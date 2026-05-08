import { authPaths } from './paths/auth.paths';
import { profilePaths } from './paths/profile.paths';
import { vehiclePaths } from './paths/vehicle.paths';
import { matchmakingPaths } from './paths/matchmaking.paths';
import { challengePaths } from './paths/challenge.paths';
import { authSchemas } from './schemas/auth.schemas';
import { profileSchemas } from './schemas/profile.schemas';
import { vehicleSchemas } from './schemas/vehicle.schemas';
import { matchmakingSchemas } from './schemas/matchmaking.schemas';
import { challengeSchemas } from './schemas/challenge.schemas';
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
    { name: 'Profile', description: 'Perfil del piloto: datos propios y vista publica' },
    { name: 'Vehicles', description: 'Gestion de vehiculos del piloto' },
    { name: 'Matchmaking', description: 'Emparejamiento de pilotos por reglas de negocio' },
    { name: 'Challenges', description: 'Retos entre pilotos: enviar, aceptar, iniciar, reportar resultado y resolucion de disputas' },
    { name: 'Ranking', description: 'Sistema de rangos D-S (proximamente)' },
    { name: 'Notifications', description: 'Eventos y alertas (proximamente)' },
  ],
  externalDocs: {
    description: 'Repositorio del proyecto',
    url: 'https://github.com/Juangonzalez09/streetracex',
  },
  paths: {
    ...authPaths,
    ...profilePaths,
    ...vehiclePaths,
    ...matchmakingPaths,
    ...challengePaths,
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Access token JWT obtenido en login o refresh',
      },
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
      ...profileSchemas,
      ...vehicleSchemas,
      ...matchmakingSchemas,
      ...challengeSchemas,
    },
  },
} as const;