import { Vehicle, VehicleRepository } from '../../domain/vehicle/VehicleRepository';

export class SetActiveVehicleUseCase {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(userId: string, vehicleId: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.setActive(vehicleId, userId);
    if (!vehicle) {
      throw new Error('Vehículo no encontrado');
    }

    return vehicle;
  }
}
