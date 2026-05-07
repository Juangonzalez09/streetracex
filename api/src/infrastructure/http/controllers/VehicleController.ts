import { Request, Response } from 'express';
import { CreateVehicleUseCase } from '../../../application/vehicle/CreateVehicleUseCase';
import { DeleteMyVehicleUseCase } from '../../../application/vehicle/DeleteMyVehicleUseCase';
import { ListMyVehiclesUseCase } from '../../../application/vehicle/ListMyVehiclesUseCase';
import { SetActiveVehicleUseCase } from '../../../application/vehicle/SetActiveVehicleUseCase';
import { UpdateMyVehicleUseCase } from '../../../application/vehicle/UpdateMyVehicleUseCase';
import { CreateVehicleInput, UpdateVehicleInput } from '../../../domain/vehicle/VehicleRepository';

export class VehicleController {
  constructor(
    private readonly createVehicleUseCase: CreateVehicleUseCase,
    private readonly listMyVehiclesUseCase: ListMyVehiclesUseCase,
    private readonly updateMyVehicleUseCase: UpdateMyVehicleUseCase,
    private readonly deleteMyVehicleUseCase: DeleteMyVehicleUseCase,
    private readonly setActiveVehicleUseCase: SetActiveVehicleUseCase
  ) {}

  async createMyVehicle(req: Request, res: Response) {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
    }

    try {
      const payload = req.body as CreateVehicleInput;
      const vehicle = await this.createVehicleUseCase.execute(userId, payload);
      return res.status(201).json({
        success: true,
        message: 'Vehículo registrado',
        data: vehicle,
      });
    } catch (error: unknown) {
      return this.handleWriteError(error, res, 'Error interno al registrar vehículo');
    }
  }

  async listMyVehicles(req: Request, res: Response) {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
    }

    try {
      const vehicles = await this.listMyVehiclesUseCase.execute(userId);
      return res.status(200).json({
        success: true,
        message: 'Vehículos obtenidos',
        data: vehicles,
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: 'Error interno al listar vehículos',
      });
    }
  }

  async updateMyVehicle(req: Request, res: Response) {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
    }

    const vehicleId = req.params.vehicleId;

    try {
      const payload = req.body as UpdateVehicleInput;
      const vehicle = await this.updateMyVehicleUseCase.execute(userId, vehicleId, payload);
      return res.status(200).json({
        success: true,
        message: 'Vehículo actualizado',
        data: vehicle,
      });
    } catch (error: unknown) {
      return this.handleWriteError(error, res, 'Error interno al actualizar vehículo');
    }
  }

  async deleteMyVehicle(req: Request, res: Response) {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
    }

    const vehicleId = req.params.vehicleId;

    try {
      await this.deleteMyVehicleUseCase.execute(userId, vehicleId);
      return res.status(200).json({
        success: true,
        message: 'Vehículo eliminado',
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Vehículo no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Error interno al eliminar vehículo',
      });
    }
  }

  async activateMyVehicle(req: Request, res: Response) {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
    }

    const vehicleId = req.params.vehicleId;

    try {
      const vehicle = await this.setActiveVehicleUseCase.execute(userId, vehicleId);
      return res.status(200).json({
        success: true,
        message: 'Vehículo activo actualizado',
        data: vehicle,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Vehículo no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Error interno al activar vehículo',
      });
    }
  }

  private handleWriteError(error: unknown, res: Response, fallbackMessage: string) {
    if (!(error instanceof Error)) {
      return res.status(500).json({
        success: false,
        message: fallbackMessage,
      });
    }

    const badRequestMessages = [
      'No hay campos para actualizar',
      'No puedes registrar más de 3 vehículos',
      'La placa es obligatoria para autos y motos',
      'La placa no aplica para monopatín eléctrico',
    ];

    if (badRequestMessages.includes(error.message)) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === 'Vehículo no encontrado') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === 'La placa ya está en uso') {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: fallbackMessage,
    });
  }
}
