import { Pool } from 'pg';
import { User } from '../../domain/auth/User';
import { UserRepository } from '../../domain/auth/UserRepository';

// La palabra "implements" obliga a esta clase a cumplir con el contrato de la interfaz
export class PostgresUserRepository implements UserRepository {
  private pool: Pool;

  constructor() {
    // Inicializamos el Pool de conexiones usando la variable de entorno
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL, 
    });
  }

  // 1. Guardar el usuario (Usamos Promise<void> porque tu interfaz así lo definió)
  async save(user: User): Promise<void> {
    const query = `
      INSERT INTO users (id, username, email, password_hash)
      VALUES ($1, $2, $3, $4)
    `;
    
    // Extraemos los datos exactos de la entidad User de tu capa de Dominio
    const values = [user.id, user.username, user.email, user.password_hash];

    try {
      await this.pool.query(query, values);
    } catch (error) {
      console.error("Error guardando en Postgres:", error);
      // Lanzamos un error limpio que el Controlador atrapará en su bloque catch
      throw new Error("No se pudo guardar el usuario en la base de datos"); 
    }
  }

  // 2. Buscar por Email
  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    
    try {
      const result = await this.pool.query(query, [email]);
      
      // Si la base de datos no encuentra filas, devolvemos null
      if (result.rows.length === 0) return null;
      
      const row = result.rows[0];
      
      // MAPEO: Convertimos la "fila" de la BD en una Entidad de Dominio real
      return new User(row.id, row.username, row.email, row.password_hash);
    } catch (error) {
      console.error("Error buscando por email:", error);
      throw new Error("Error en la base de datos al buscar por correo");
    }
  }

  // 3. Buscar por Username
  async findByUsername(username: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE username = $1';
    
    try {
      const result = await this.pool.query(query, [username]);
      
      if (result.rows.length === 0) return null;
      
      const row = result.rows[0];
      
      // MAPEO: Al igual que arriba, devolvemos una instancia de User
      return new User(row.id, row.username, row.email, row.password_hash);
    } catch (error) {
      console.error("Error buscando por username:", error);
      throw new Error("Error en la base de datos al buscar por usuario");
    }
  }
}