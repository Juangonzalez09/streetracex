export interface VehicleSummary {
  id: string;
  tipoVehiculo: string;
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

export interface MyProfile {
  id: string;
  username: string;
  email: string;
  rol: string;
  rango: string;
  estado: string;
  fotoPerfil: string | null;
  zonaLocalidad: string | null;
  zonaCiudad: string | null;
  zonaEstado: string | null;
  zonaPais: string | null;
  victorias: number;
  derrotas: number;
  retosConsecutivos: number;
  createdAt: Date;
  updatedAt: Date;
  vehicles: VehicleSummary[];
}

export interface PublicProfile {
  id: string;
  username: string;
  rango: string;
  fotoPerfil: string | null;
  zonaLocalidad: string | null;
  zonaCiudad: string | null;
  zonaEstado: string | null;
  zonaPais: string | null;
  victorias: number;
  derrotas: number;
  retosConsecutivos: number;
  vehicles: VehicleSummary[];
}

export interface UpdateProfileInput {
  username?: string;
  fotoPerfil?: string | null;
  zonaLocalidad?: string | null;
  zonaCiudad?: string | null;
  zonaEstado?: string | null;
  zonaPais?: string | null;
}

export interface ProfileRepository {
  findMyProfileById(userId: string): Promise<MyProfile | null>;
  findPublicProfileById(userId: string): Promise<PublicProfile | null>;
  updateMyProfile(userId: string, input: UpdateProfileInput): Promise<MyProfile | null>;
  deactivateProfile(userId: string): Promise<boolean>;
}
