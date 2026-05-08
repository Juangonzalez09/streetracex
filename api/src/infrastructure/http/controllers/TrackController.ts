import { Request, Response } from 'express';
import { CreateTrackUseCase } from '../../../application/track/CreateTrackUseCase';
import { DeactivateTrackUseCase } from '../../../application/track/DeactivateTrackUseCase';
import { GetTrackUseCase } from '../../../application/track/GetTrackUseCase';
import { ListTracksUseCase } from '../../../application/track/ListTracksUseCase';
import { UpdateTrackUseCase } from '../../../application/track/UpdateTrackUseCase';
import { TipoCarreraTrack } from '../../../domain/track/TrackRepository';

export class TrackController {
  constructor(
    private readonly listTracksUseCase: ListTracksUseCase,
    private readonly getTrackUseCase: GetTrackUseCase,
    private readonly createTrackUseCase: CreateTrackUseCase,
    private readonly updateTrackUseCase: UpdateTrackUseCase,
    private readonly deactivateTrackUseCase: DeactivateTrackUseCase,
  ) {}

  async list(req: Request, res: Response) {
    try {
      const tracks = await this.listTracksUseCase.execute({
        tipoCarrera: req.query.tipoCarrera as TipoCarreraTrack | undefined,
        soloActivas: req.query.soloActivas as unknown as boolean | undefined,
      });
      return res.status(200).json({ success: true, message: 'Pistas obtenidas', data: tracks });
    } catch {
      return res.status(500).json({ success: false, message: 'Error interno al listar pistas' });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const track = await this.getTrackUseCase.execute(req.params.trackId);
      return res.status(200).json({ success: true, message: 'Pista obtenida', data: track });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Pista no encontrada') {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Error interno al obtener la pista' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const track = await this.createTrackUseCase.execute(req.body);
      return res.status(201).json({ success: true, message: 'Pista creada', data: track });
    } catch {
      return res.status(500).json({ success: false, message: 'Error interno al crear la pista' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const track = await this.updateTrackUseCase.execute(req.params.trackId, req.body);
      return res.status(200).json({ success: true, message: 'Pista actualizada', data: track });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Pista no encontrada') {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Error interno al actualizar la pista' });
    }
  }

  async deactivate(req: Request, res: Response) {
    try {
      const track = await this.deactivateTrackUseCase.execute(req.params.trackId);
      return res.status(200).json({ success: true, message: 'Pista desactivada', data: track });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Pista no encontrada') return res.status(404).json({ success: false, message: error.message });
        if (error.message === 'La pista ya está desactivada') return res.status(409).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Error interno al desactivar la pista' });
    }
  }
}