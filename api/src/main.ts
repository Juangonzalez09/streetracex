import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './infrastructure/http/routes/auth.routes';
import profileRoutes from './infrastructure/http/routes/profile.routes';
import vehicleRoutes from './infrastructure/http/routes/vehicle.routes';
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
app.use('/api/profile', profileRoutes);
app.use('/api/vehicles', vehicleRoutes);

// 4. Arranque del servidor
app.listen(PORT, () => {
  const mode = process.env.NODE_ENV || 'development';
  console.log(`->>>>>> 🏎️ Street Race X encendido!`);
  console.log(`->>>>>> Modo: ${mode}`);
  console.log(`->>>>>> Puerto: ${PORT}`);
});