import { Vehicle, VehicleRepository } from '../../domain/vehicle/VehicleRepository';

export class ListMyVehiclesUseCase {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(userId: string): Promise<Vehicle[]> {
    return this.vehicleRepository.listByUserId(userId);
  }
}
