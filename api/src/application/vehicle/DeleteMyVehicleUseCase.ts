import { VehicleRepository } from '../../domain/vehicle/VehicleRepository';

export class DeleteMyVehicleUseCase {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(userId: string, vehicleId: string): Promise<void> {
    const deleted = await this.vehicleRepository.delete(vehicleId, userId);
    if (!deleted) {
      throw new Error('Vehículo no encontrado');
    }
  }
}
