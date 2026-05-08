import { VehicleType } from '../vehicle/VehicleRepository';

export type PilotRank = 'D' | 'C' | 'B' | 'A' | 'S';
export type UserStatus = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';

export interface MatchmakingRequesterContext {
  id: string;
  rango: PilotRank;
  estado: UserStatus;
  activeVehicleType: VehicleType | null;
}

export interface MatchmakingPilot {
  id: string;
  username: string;
  rango: PilotRank;
  zonaLocalidad: string | null;
  zonaCiudad: string | null;
  zonaEstado: string | null;
  zonaPais: string | null;
  victorias: number;
  derrotas: number;
  retosConsecutivos: number;
  activeVehicle: {
    id: string;
    tipoVehiculo: VehicleType;
    marca: string;
    modelo: string;
    anio: number;
    color: string;
  } | null;
}

export interface MatchmakingFilters {
  zonaLocalidad?: string;
  zonaCiudad?: string;
  zonaEstado?: string;
  zonaPais?: string;
}

export interface MatchmakingSearchInput {
  requesterId: string;
  rango: PilotRank;
  vehicleType: VehicleType;
  filters: MatchmakingFilters;
  page: number;
  limit: number;
}

export interface MatchmakingSearchResult {
  items: MatchmakingPilot[];
  total: number;
}

export interface MatchmakingRepository {
  findRequesterContext(userId: string): Promise<MatchmakingRequesterContext | null>;
  searchPilots(input: MatchmakingSearchInput): Promise<MatchmakingSearchResult>;
}
