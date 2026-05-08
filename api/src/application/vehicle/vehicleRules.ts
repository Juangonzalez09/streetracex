
import { VehicleType } from '../../domain/vehicle/VehicleRepository';

export const validateVehiclePlateRules = (tipoVehiculo: VehicleType, placa: string | null) => {
  if (tipoVehiculo === 'MONOPATIN_ELECTRICO' && placa) {
    throw new Error('La placa no aplica para monopatín eléctrico');
  }

  if (tipoVehiculo !== 'MONOPATIN_ELECTRICO' && !placa) {
    throw new Error('La placa es obligatoria para autos y motos');
  }
};
