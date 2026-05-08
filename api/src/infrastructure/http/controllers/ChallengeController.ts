import { Request, Response } from 'express';
import { AcceptChallengeUseCase } from '../../../application/challenge/AcceptChallengeUseCase';
import { AdminResolveUseCase } from '../../../application/challenge/AdminResolveUseCase';
import { CancelChallengeUseCase } from '../../../application/challenge/CancelChallengeUseCase';
import { GetMyChallengesUseCase } from '../../../application/challenge/GetMyChallengesUseCase';
import { RejectChallengeUseCase } from '../../../application/challenge/RejectChallengeUseCase';
import { ReportResultUseCase } from '../../../application/challenge/ReportResultUseCase';
import { SendChallengeUseCase } from '../../../application/challenge/SendChallengeUseCase';
import { StartChallengeUseCase } from '../../../application/challenge/StartChallengeUseCase';
import { ChallengeFilters, EstadoReto } from '../../../domain/challenge/ChallengeRepository';

export class ChallengeController {
  constructor(
    private readonly sendChallengeUseCase: SendChallengeUseCase,
    private readonly acceptChallengeUseCase: AcceptChallengeUseCase,
    private readonly rejectChallengeUseCase: RejectChallengeUseCase,
    private readonly cancelChallengeUseCase: CancelChallengeUseCase,
    private readonly startChallengeUseCase: StartChallengeUseCase,
    private readonly reportResultUseCase: ReportResultUseCase,
    private readonly adminResolveUseCase: AdminResolveUseCase,
    private readonly getMyChallengesUseCase: GetMyChallengesUseCase,
  ) {}

  async send(req: Request, res: Response) {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'No autenticado' });

    try {
      const { retadoId, tipoCarrera, notas, fechaAcordada } = req.body;
      const challenge = await this.sendChallengeUseCase.execute({
        retadorId: userId,
        retadoId,
        tipoCarrera,
        notas,
        fechaAcordada,
      });
      return res.status(201).json({ success: true, message: 'Reto enviado', data: challenge });
    } catch (error: unknown) {
      if (!(error instanceof Error)) return res.status(500).json({ success: false, message: 'Error interno' });

      const clientErrors: Record<string, number> = {
        'No puedes retarte a ti mismo': 400,
        'Necesitas un vehículo activo para enviar un reto': 422,
        'El piloto retado no existe o no está activo': 404,
        'Solo puedes retar a pilotos del mismo rango': 422,
        'El piloto retado no tiene un vehículo activo': 422,
        'El piloto retado no tiene un vehículo activo del mismo tipo': 422,
        'Ya existe un reto activo entre estos pilotos': 409,
      };
      const status = clientErrors[error.message];
      if (status) return res.status(status).json({ success: false, message: error.message });

      return res.status(500).json({ success: false, message: 'Error interno al enviar el reto' });
    }
  }

  async list(req: Request, res: Response) {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'No autenticado' });

    try {
      const filters: ChallengeFilters = {
        tipo: req.query.tipo as ChallengeFilters['tipo'],
        estado: req.query.estado as EstadoReto | undefined,
      };
      const challenges = await this.getMyChallengesUseCase.execute(userId, filters);
      return res.status(200).json({ success: true, message: 'Retos obtenidos', data: challenges });
    } catch {
      return res.status(500).json({ success: false, message: 'Error interno al listar retos' });
    }
  }

  async accept(req: Request, res: Response) {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'No autenticado' });

    try {
      const challenge = await this.acceptChallengeUseCase.execute(req.params.challengeId, userId);
      return res.status(200).json({ success: true, message: 'Reto aceptado', data: challenge });
    } catch (error: unknown) {
      return this.handleChallengeError(error, res, 'aceptar');
    }
  }

  async reject(req: Request, res: Response) {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'No autenticado' });

    try {
      const challenge = await this.rejectChallengeUseCase.execute(req.params.challengeId, userId);
      return res.status(200).json({ success: true, message: 'Reto rechazado', data: challenge });
    } catch (error: unknown) {
      return this.handleChallengeError(error, res, 'rechazar');
    }
  }

  async cancel(req: Request, res: Response) {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'No autenticado' });

    try {
      const challenge = await this.cancelChallengeUseCase.execute(req.params.challengeId, userId);
      return res.status(200).json({ success: true, message: 'Reto cancelado', data: challenge });
    } catch (error: unknown) {
      return this.handleChallengeError(error, res, 'cancelar');
    }
  }

  async start(req: Request, res: Response) {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'No autenticado' });

    try {
      const challenge = await this.startChallengeUseCase.execute(req.params.challengeId, userId);
      return res.status(200).json({ success: true, message: 'Reto iniciado', data: challenge });
    } catch (error: unknown) {
      return this.handleChallengeError(error, res, 'iniciar');
    }
  }

  async reportResult(req: Request, res: Response) {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'No autenticado' });

    try {
      const { ganadorId } = req.body;
      const result = await this.reportResultUseCase.execute(req.params.challengeId, userId, ganadorId);

      const message = result.completado
        ? result.rangoSubidoGanador
          ? 'Resultado confirmado. ¡El ganador subió de rango!'
          : 'Resultado confirmado'
        : 'Resultado reportado. Esperando confirmación del otro piloto';

      return res.status(200).json({ success: true, message, data: result.challenge });
    } catch (error: unknown) {
      return this.handleChallengeError(error, res, 'reportar resultado');
    }
  }

  async adminResolve(req: Request, res: Response) {
    try {
      const { ganadorId } = req.body;
      const challenge = await this.adminResolveUseCase.execute(req.params.challengeId, ganadorId);
      return res.status(200).json({ success: true, message: 'Reto resuelto por administrador', data: challenge });
    } catch (error: unknown) {
      return this.handleChallengeError(error, res, 'resolver');
    }
  }

  private handleChallengeError(error: unknown, res: Response, accion: string) {
    if (!(error instanceof Error)) {
      return res.status(500).json({ success: false, message: 'Error interno' });
    }

    const clientErrors: Record<string, number> = {
      'Reto no encontrado': 404,
      'Solo el retado puede aceptar el reto': 403,
      'Solo el retado puede rechazar el reto': 403,
      'Solo el retador puede iniciar el reto': 403,
      'No participas en este reto': 403,
      'El reto no está en estado PENDIENTE': 409,
      'El reto debe estar ACEPTADO para iniciarse': 409,
      'El reto no puede cancelarse en su estado actual': 409,
      'El reto debe estar EN_CURSO para reportar un resultado': 409,
      'El reto debe estar EN_CURSO para ser resuelto': 409,
      'Ya reportaste el resultado de este reto': 409,
      'El ganador declarado debe ser uno de los participantes': 422,
      'El ganador debe ser uno de los participantes': 422,
    };

    const status = clientErrors[error.message];
    if (status) return res.status(status).json({ success: false, message: error.message });

    return res.status(500).json({ success: false, message: `Error interno al ${accion} el reto` });
  }
}