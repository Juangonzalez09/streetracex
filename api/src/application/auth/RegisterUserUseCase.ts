import { User } from '../../domain/auth/User';
import { UserRepository } from '../../domain/auth/UserRepository';
import crypto from 'crypto'; 
import bcrypt from 'bcryptjs'; // 1. Importamos bcryptjs

export class RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(username: string, email: string, password: string): Promise<User> {
    
    // 1. Validar reglas de negocio
    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail) throw new Error('El correo ya está registrado');

    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) throw new Error('El nombre de usuario ya está en uso');
  
    // 2. Encriptar la contraseña usando bcryptjs

    
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Crear nueva entidad de usuario
    const newUser = new User(
      crypto.randomUUID(),  
      username,
      email,
      hashedPassword 
    );

    // 4. Persistencia
    await this.userRepository.save(newUser);

    return newUser;
  }
}