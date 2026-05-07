import { UpdateVehicleInput, Vehicle, VehicleRepository } from '../../domain/vehicle/VehicleRepository';
import { validateVehiclePlateRules } from './vehicleRules';

export class UpdateMyVehicleUseCase {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(userId: string, vehicleId: string, input: UpdateVehicleInput): Promise<Vehicle> {
    if (Object.keys(input).length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    const existingVehicle = await this.vehicleRepository.findByIdAndUserId(vehicleId, userId);
    if (!existingVehicle) {
      throw new Error('Vehículo no encontrado');
    }

    const tipoVehiculo = input.tipoVehiculo ?? existingVehicle.tipoVehiculo;
    const placa = input.placa !== undefined ? input.placa : existingVehicle.placa;
    validateVehiclePlateRules(tipoVehiculo, placa);

    const updatedVehicle = await this.vehicleRepository.update(vehicleId, userId, input);
    if (!updatedVehicle) {
      throw new Error('Vehículo no encontrado');
    }

    return updatedVehicle;
  }
}
