export class User {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public password_hash: string,
    public rango: string = 'D', // Regla de negocio: todos inician en D
    public estado: string = 'activo',
    public createdAt: Date = new Date()
  ) {}
}
