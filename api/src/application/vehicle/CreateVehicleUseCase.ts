import { CreateVehicleInput, Vehicle, VehicleRepository } from '../../domain/vehicle/VehicleRepository';
import { validateVehiclePlateRules } from './vehicleRules';

export class CreateVehicleUseCase {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(userId: string, input: CreateVehicleInput): Promise<Vehicle> {
    const totalVehicles = await this.vehicleRepository.countByUserId(userId);
    if (totalVehicles >= 3) {
      throw new Error('No puedes registrar más de 3 vehículos');
    }

    validateVehiclePlateRules(input.tipoVehiculo, input.placa);
    return this.vehicleRepository.create(userId, input);
  }
}
