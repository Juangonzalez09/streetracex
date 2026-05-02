import { PrismaClient } from '@prisma/client';
import { LoginUserUseCase } from '../application/auth/LoginUserUseCase';
import { LogoutUserUseCase } from '../application/auth/LogoutUserUseCase';
import { RefreshSessionUseCase } from '../application/auth/RefreshSessionUseCase';
import { PrismaUserRepository } from './auth/PrismaUserRepository';
import { PrismaRefreshTokenRepository } from './auth/PrismaRefreshTokenRepository';
import { RegisterUserUseCase } from '../application/auth/RegisterUserUseCase';
import { AuthController } from './http/controllers/AuthController';

const prisma = new PrismaClient();

const userRepository = new PrismaUserRepository(prisma);
const refreshTokenRepository = new PrismaRefreshTokenRepository(prisma);
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository, refreshTokenRepository);
const refreshSessionUseCase = new RefreshSessionUseCase(userRepository, refreshTokenRepository);
const logoutUserUseCase = new LogoutUserUseCase(refreshTokenRepository);

export const authController = new AuthController(
  registerUserUseCase,
  loginUserUseCase,
  refreshSessionUseCase,
  logoutUserUseCase
);
