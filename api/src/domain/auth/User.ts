export type RolUsuario = 'PILOTO' | 'ADMINISTRADOR';
export type RangoPiloto = 'D' | 'C' | 'B' | 'A' | 'S';
export type EstadoUsuario = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';

export class User {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public passwordHash: string,
    public rol: RolUsuario = 'PILOTO',
    public rango: RangoPiloto = 'D',
    public estado: EstadoUsuario = 'ACTIVO',
    public fotoPerfil: string | null = null,
    public zonaLocalidad: string | null = null,
    public zonaCiudad: string | null = null,
    public zonaEstado: string | null = null,
    public zonaPais: string | null = null,
    public categoriaId: string | null = null,
    public victorias: number = 0,
    public derrotas: number = 0,
    public retosConsecutivos: number = 0,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}
