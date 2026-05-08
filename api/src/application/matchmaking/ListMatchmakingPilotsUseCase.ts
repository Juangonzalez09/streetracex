import {
  MatchmakingFilters,
  MatchmakingPilot,
  MatchmakingRepository,
} from '../../domain/matchmaking/MatchmakingRepository';

export interface ListMatchmakingPilotsInput {
  page: number;
  limit: number;
  filters: MatchmakingFilters;
}

export interface ListMatchmakingPilotsResult {
  items: MatchmakingPilot[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ListMatchmakingPilotsUseCase {
  constructor(private readonly matchmakingRepository: MatchmakingRepository) {}

  async execute(userId: string, input: ListMatchmakingPilotsInput): Promise<ListMatchmakingPilotsResult> {
    const requester = await this.matchmakingRepository.findRequesterContext(userId);
    if (!requester) {
      throw new Error('Usuario no encontrado');
    }

    if (requester.estado !== 'ACTIVO') {
      throw new Error('Tu cuenta no está activa');
    }

    if (!requester.activeVehicleType) {
      throw new Error('Necesitas un vehículo activo para usar matchmaking');
    }

    const result = await this.matchmakingRepository.searchPilots({
      requesterId: userId,
      rango: requester.rango,
      vehicleType: requester.activeVehicleType,
      filters: input.filters,
      page: input.page,
      limit: input.limit,
    });

    return {
      items: result.items,
      pagination: {
        page: input.page,
        limit: input.limit,
        total: result.total,
        totalPages: Math.max(1, Math.ceil(result.total / input.limit)),
      },
    };
  }
}
