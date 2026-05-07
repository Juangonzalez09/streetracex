import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openApiDocument } from './openapi';

export const registerSwagger = (app: Express) => {
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiDocument, {
      explorer: true,
      customSiteTitle: 'StreetRaceX API Docs',
      swaggerOptions: {
        displayRequestDuration: true,
        filter: true,
        docExpansion: 'list',
        defaultModelsExpandDepth: 1,
      },
    })
  );
};
