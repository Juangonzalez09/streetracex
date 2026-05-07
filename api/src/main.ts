import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './infrastructure/http/routes/auth.routes';
import { registerSwagger } from './infrastructure/http/docs/swagger';

// 1. Inicialización de la aplicación
const app = express();
const PORT = process.env.PORT || 3000;
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : true;

// 2. Middlewares globales
app.use(helmet());
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json()); // Permite recibir JSON en el body
registerSwagger(app);

// 3. Rutas Api y Dominio
app.use('/api/auth', authRoutes);

// 4. Arranque del servidor
app.listen(PORT, () => {
  console.log(`->>>>>> Motor encendido! Servidor de Street Race X corriendo en http://localhost:${PORT}/api/docs/`);
});
