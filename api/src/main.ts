import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

// 1. Inicialización de la aplicación
const app = express();
const PORT = process.env.PORT || 3000;

// 2. Middlewares globales
app.use(helmet());
app.use(cors());
app.use(express.json()); // Permite recibir JSON en el body

// 3. Endpoint de prueba (Health Check)
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Street Race X API funcionando correctamente",
    data: {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// 4. Arranque del servidor
app.listen(PORT, () => {
  console.log(`🏁 Motor encendido! Servidor de Street Race X corriendo en http://localhost:${PORT}`);
  console.log(`Prueba el endpoint en: http://localhost:${PORT}/api/health`);
});