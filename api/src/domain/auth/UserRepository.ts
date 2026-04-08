import { User } from './User';

// Puerto (Port): Interface que la infraestructura debe implementar
export interface UserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
}
