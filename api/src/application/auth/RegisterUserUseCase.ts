import { User } from '../../domain/auth/User';
import { UserRepository } from '../../domain/auth/UserRepository';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

// DTO: datos de entrada del caso de uso de registro.
export interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
  fotoPerfil?: string | null;
  zonaLocalidad?: string | null;
  zonaCiudad?: string | null;
  zonaEstado?: string | null;
  zonaPais?: string | null;
}

export class RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const username = input.username.trim();
    const email = input.email.trim().toLowerCase();
    const password = input.password;

    if (username.length < 3 || username.length > 50) {
      throw new Error('El username debe tener entre 3 y 50 caracteres');
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new Error('El username solo puede contener letras, números y guion bajo');
    }

    if (password.length < 8 || password.length > 72) {
      throw new Error('La contraseña debe tener entre 8 y 72 caracteres');
    }

    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail) throw new Error('El correo ya está registrado');

    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) throw new Error('El nombre de usuario ya está en uso');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User(
      randomUUID(),
      username,
      email,
      hashedPassword,
      'PILOTO',
      'D',
      'ACTIVO',
      input.fotoPerfil ?? null,
      input.zonaLocalidad ?? null,
      input.zonaCiudad ?? null,
      input.zonaEstado ?? null,
      input.zonaPais ?? null
    );

    return this.userRepository.save(newUser);
  }
}
