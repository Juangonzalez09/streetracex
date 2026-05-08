import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  CreateVehicleInput,
  UpdateVehicleInput,
  Vehicle,
  VehicleRepository,
} from '../../domain/vehicle/VehicleRepository';

export class PrismaVehicleRepository implements VehicleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listByUserId(userId: string): Promise<Vehicle[]> {
    const rows = await this.prisma.vehicle.findMany({
      where: { user_id: userId },
      orderBy: [{ activo: 'desc' }, { created_at: 'desc' }],
    });

    return rows.map((row) => this.toVehicle(row));
  }

  async countByUserId(userId: string): Promise<number> {
    return this.prisma.vehicle.count({
      where: { user_id: userId },
    });
  }

  async findActiveByUserId(userId: string): Promise<Vehicle | null> {
    const row = await this.prisma.vehicle.findFirst({
      where: { user_id: userId, activo: true },
    });
    if (!row) return null;
    return this.toVehicle(row);
  }

  async create(userId: string, input: CreateVehicleInput): Promise<Vehicle> {
    try {
      const row = await this.prisma.vehicle.create({
        data: {
          user_id: userId,
          tipo_vehiculo: input.tipoVehiculo,
          marca: input.marca,
          modelo: input.modelo,
          anio: input.anio,
          color: input.color,
          placa: input.placa,
          foto: input.foto ?? null,
          modificaciones: input.modificaciones ?? null,
        },
      });

      return this.toVehicle(row);
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new Error('La placa ya está en uso');
      }

      throw error;
    }
  }

  async findByIdAndUserId(vehicleId: string, userId: string): Promise<Vehicle | null> {
    const row = await this.prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        user_id: userId,
      },
    });

    if (!row) return null;
    return this.toVehicle(row);
  }

  async update(vehicleId: string, userId: string, input: UpdateVehicleInput): Promise<Vehicle | null> {
    try {
      const row = await this.prisma.vehicle.updateMany({
        where: {
          id: vehicleId,
          user_id: userId,
        },
        data: {
          tipo_vehiculo: input.tipoVehiculo,
          marca: input.marca,
          modelo: input.modelo,
          anio: input.anio,
          color: input.color,
          placa: input.placa,
          foto: input.foto,
          modificaciones: input.modificaciones,
        },
      });

      if (row.count === 0) return null;
      return this.findByIdAndUserId(vehicleId, userId);
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new Error('La placa ya está en uso');
      }

      throw error;
    }
  }

  async delete(vehicleId: string, userId: string): Promise<boolean> {
    const result = await this.prisma.vehicle.deleteMany({
      where: {
        id: vehicleId,
        user_id: userId,
      },
    });

    return result.count > 0;
  }

  async setActive(vehicleId: string, userId: string): Promise<Vehicle | null> {
    return this.prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.findFirst({
        where: {
          id: vehicleId,
          user_id: userId,
        },
      });

      if (!vehicle) return null;

      await tx.vehicle.updateMany({
        where: { user_id: userId },
        data: { activo: false },
      });

      const updatedVehicle = await tx.vehicle.update({
        where: { id: vehicleId },
        data: { activo: true },
      });

      return this.toVehicle(updatedVehicle);
    });
  }

  private toVehicle(row: {
    id: string;
    user_id: string;
    tipo_vehiculo: 'AUTO' | 'MOTO' | 'MONOPATIN_ELECTRICO';
    marca: string;
    modelo: string;
    anio: number;
    color: string;
    placa: string | null;
    foto: string | null;
    modificaciones: string | null;
    activo: boolean;
    created_at: Date;
  }): Vehicle {
    return {
      id: row.id,
      userId: row.user_id,
      tipoVehiculo: row.tipo_vehiculo,
      marca: row.marca,
      modelo: row.modelo,
      anio: row.anio,
      color: row.color,
      placa: row.placa,
      foto: row.foto,
      modificaciones: row.modificaciones,
      activo: row.activo,
      createdAt: row.created_at,
    };
  }
}
