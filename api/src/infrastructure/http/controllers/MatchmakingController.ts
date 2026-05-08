import { Request, Response } from 'express';
import {
  ListMatchmakingPilotsInput,
  ListMatchmakingPilotsUseCase,
} from '../../../application/matchmaking/ListMatchmakingPilotsUseCase';

export class MatchmakingController {
  constructor(private readonly listMatchmakingPilotsUseCase: ListMatchmakingPilotsUseCase) {}

  async listPilots(req: Request, res: Response) {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
    }

    try {
      const payload = req.query as unknown as ListMatchmakingPilotsInput;
      const result = await this.listMatchmakingPilotsUseCase.execute(userId, payload);

      return res.status(200).json({
        success: true,
        message: 'Pilotos encontrados',
        data: result.items,
        pagination: result.pagination,
      });
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        return res.status(500).json({
          success: false,
          message: 'Error interno al obtener matchmaking',
        });
      }

      if (error.message === 'Necesitas un vehículo activo para usar matchmaking') {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message === 'Tu cuenta no está activa') {
        return res.status(403).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Error interno al obtener matchmaking',
      });
    }
  }
}
