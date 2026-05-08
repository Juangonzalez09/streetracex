export type EstadoReto = 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO' | 'EN_CURSO' | 'COMPLETADO' | 'CANCELADO';
export type TipoCarrera = 'CUARTO_MILLA' | 'VUELTAS' | 'DERRAPE';

export interface ChallengeParticipant {
  id: string;
  username: string;
  rango: string;
}

export interface ChallengeItem {
  id: string;
  retadorId: string;
  retadoId: string;
  tipoCarrera: TipoCarrera;
  vehiculoRetadorId: string | null;
  vehiculoRetadoId: string | null;
  estado: EstadoReto;
  ganadorId: string | null;
  reporteRetadorId: string | null;
  reporteRetadoId: string | null;
  pistaId: string | null;
  notas: string | null;
  fechaAcordada: Date | null;
  createdAt: Date;
  updatedAt: Date;
  retador: ChallengeParticipant;
  retado: ChallengeParticipant;
  ganador: ChallengeParticipant | null;
}

export interface SendChallengeData {
  retadorId: string;
  retadoId: string;
  tipoCarrera: TipoCarrera;
  vehiculoRetadorId: string;
  pistaId?: string | null;
  notas?: string | null;
  fechaAcordada?: Date | null;
}

export interface ChallengeFilters {
  tipo?: 'enviados' | 'recibidos' | 'todos';
  estado?: EstadoReto;
}

export interface AdminChallengeFilters {
  estado?: EstadoReto;
  soloDisputas?: boolean;
}

export interface ChallengeRepository {
  create(data: SendChallengeData): Promise<ChallengeItem>;
  findById(id: string): Promise<ChallengeItem | null>;
  findMyChallenges(userId: string, filters: ChallengeFilters): Promise<ChallengeItem[]>;
  findAllChallenges(filters: AdminChallengeFilters): Promise<ChallengeItem[]>;
  hasActiveChallengeBetween(retadorId: string, retadoId: string): Promise<boolean>;
  acceptChallenge(id: string, vehiculoRetadoId: string): Promise<ChallengeItem>;
  updateEstado(id: string, estado: EstadoReto): Promise<ChallengeItem>;
  reportarResultadoRetador(id: string, ganadorId: string): Promise<ChallengeItem>;
  reportarResultadoRetado(id: string, ganadorId: string): Promise<ChallengeItem>;
  completeChallenge(id: string, ganadorId: string): Promise<ChallengeItem>;
}