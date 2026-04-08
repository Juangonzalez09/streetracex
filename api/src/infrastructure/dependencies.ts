// 1. Ya NO importamos el InMemory. Ahora traemos el de Postgres:
import { PostgresUserRepository } from './auth/PostgresUserRepository';
import { RegisterUserUseCase } from '../application/auth/RegisterUserUseCase';
import { AuthController } from './http/controllers/AuthController';

// 2. Instanciamos el NUEVO repositorio
const userRepository = new PostgresUserRepository();

// 3. Le pasamos el de Postgres al Caso de Uso. ¡Al Caso de Uso NO LE IMPORTA el cambio!
const registerUserUseCase = new RegisterUserUseCase(userRepository);

// 4. Exportamos el controlador
export const authController = new AuthController(registerUserUseCase);