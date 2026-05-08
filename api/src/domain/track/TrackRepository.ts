export type TipoCarreraTrack = 'CUARTO_MILLA' | 'VUELTAS' | 'DERRAPE';

export interface TrackItem {
  id: string;
  nombre: string;
  descripcion: string | null;
  tipoCarrera: TipoCarreraTrack;
  dificultad: string | null;
  coordenadas: string | null;
  activo: boolean;
  createdAt: Date;
}

export interface CreateTrackData {
  nombre: string;
  descripcion?: string | null;
  tipoCarrera: TipoCarreraTrack;
  dificultad?: string | null;
  coordenadas?: string | null;
}

export interface UpdateTrackData {
  nombre?: string;
  descripcion?: string | null;
  dificultad?: string | null;
  coordenadas?: string | null;
}

export interface TrackFilters {
  tipoCarrera?: TipoCarreraTrack;
  soloActivas?: boolean;
}

export interface TrackRepository {
  create(data: CreateTrackData): Promise<TrackItem>;
  findById(id: string): Promise<TrackItem | null>;
  findAll(filters: TrackFilters): Promise<TrackItem[]>;
  update(id: string, data: UpdateTrackData): Promise<TrackItem>;
  deactivate(id: string): Promise<TrackItem>;
}