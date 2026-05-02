import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from './auth/PrismaUserRepository';
import { RegisterUserUseCase } from '../application/auth/RegisterUserUseCase';
import { AuthController } from './http/controllers/AuthController';

const prisma = new PrismaClient();

const userRepository = new PrismaUserRepository(prisma);
const registerUserUseCase = new RegisterUserUseCase(userRepository);

export const authController = new AuthController(registerUserUseCase);