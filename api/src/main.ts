import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './infrastructure/http/routes/auth.routes';
import profileRoutes from './infrastructure/http/routes/profile.routes';
import vehicleRoutes from './infrastructure/http/routes/vehicle.routes';
import matchmakingRoutes from './infrastructure/http/routes/matchmaking.routes';
import challengeRoutes from './infrastructure/http/routes/challenge.routes';
import trackRoutes from './infrastructure/http/routes/track.routes';
import notificationRoutes from './infrastructure/http/routes/notification.routes';
import adminRoutes from './infrastructure/http/routes/admin.routes';
import { requireAuth } from './infrastructure/http/middlewares/auth/requireAuth';
import { requireRole } from './infrastructure/http/middlewares/auth/requireRole';
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
app.use(express.json());
registerSwagger(app);

// 3. Rutas Api v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/matchmaking', matchmakingRoutes);
app.use('/api/v1/challenges', challengeRoutes);
app.use('/api/v1/tracks', trackRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/admin', requireAuth, requireRole('ADMINISTRADOR'), adminRoutes);

// 4. Arranque del servidor
app.listen(PORT, () => {
  const mode = process.env.NODE_ENV || 'development';
  console.log(`->>>>>> 🏎️ Street Race X encendido!`);
  console.log(`->>>>>> Modo: ${mode}`);
  console.log(`->>>>>> Puerto: ${PORT}`);
});