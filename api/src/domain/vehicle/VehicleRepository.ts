export type VehicleType = 'AUTO' | 'MOTO' | 'MONOPATIN_ELECTRICO';

export interface Vehicle {
  id: string;
  userId: string;
  tipoVehiculo: VehicleType;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  placa: string | null;
  foto: string | null;
  modificaciones: string | null;
  activo: boolean;
  createdAt: Date;
}

export interface CreateVehicleInput {
  tipoVehiculo: VehicleType;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  placa: string | null;
  foto?: string | null;
  modificaciones?: string | null;
}

export interface UpdateVehicleInput {
  tipoVehiculo?: VehicleType;
  marca?: string;
  modelo?: string;
  anio?: number;
  color?: string;
  placa?: string | null;
  foto?: string | null;
  modificaciones?: string | null;
}

export interface VehicleRepository {
  listByUserId(userId: string): Promise<Vehicle[]>;
  countByUserId(userId: string): Promise<number>;
  create(userId: string, input: CreateVehicleInput): Promise<Vehicle>;
  findByIdAndUserId(vehicleId: string, userId: string): Promise<Vehicle | null>;
  update(vehicleId: string, userId: string, input: UpdateVehicleInput): Promise<Vehicle | null>;
  delete(vehicleId: string, userId: string): Promise<boolean>;
  setActive(vehicleId: string, userId: string): Promise<Vehicle | null>;
}
