import { PrismaClient } from '@prisma/client';
import { LoginUserUseCase } from '../application/auth/LoginUserUseCase';
import { LogoutUserUseCase } from '../application/auth/LogoutUserUseCase';
import { RefreshSessionUseCase } from '../application/auth/RefreshSessionUseCase';
import { DeactivateMyProfileUseCase } from '../application/profile/DeactivateMyProfileUseCase';
import { GetMyProfileUseCase } from '../application/profile/GetMyProfileUseCase';
import { GetPublicProfileUseCase } from '../application/profile/GetPublicProfileUseCase';
import { UpdateMyProfileUseCase } from '../application/profile/UpdateMyProfileUseCase';
import { PrismaUserRepository } from './auth/PrismaUserRepository';
import { PrismaRefreshTokenRepository } from './auth/PrismaRefreshTokenRepository';
import { RegisterUserUseCase } from '../application/auth/RegisterUserUseCase';
import { AuthController } from './http/controllers/AuthController';
import { ProfileController } from './http/controllers/ProfileController';
import { VehicleController } from './http/controllers/VehicleController';
import { PrismaProfileRepository } from './profile/PrismaProfileRepository';
import { PrismaVehicleRepository } from './vehicle/PrismaVehicleRepository';
import { CreateVehicleUseCase } from '../application/vehicle/CreateVehicleUseCase';
import { ListMyVehiclesUseCase } from '../application/vehicle/ListMyVehiclesUseCase';
import { UpdateMyVehicleUseCase } from '../application/vehicle/UpdateMyVehicleUseCase';
import { DeleteMyVehicleUseCase } from '../application/vehicle/DeleteMyVehicleUseCase';
import { SetActiveVehicleUseCase } from '../application/vehicle/SetActiveVehicleUseCase';

const prisma = new PrismaClient();

const userRepository = new PrismaUserRepository(prisma);
const refreshTokenRepository = new PrismaRefreshTokenRepository(prisma);
const profileRepository = new PrismaProfileRepository(prisma);
const vehicleRepository = new PrismaVehicleRepository(prisma);
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository, refreshTokenRepository);
const refreshSessionUseCase = new RefreshSessionUseCase(userRepository, refreshTokenRepository);
const logoutUserUseCase = new LogoutUserUseCase(refreshTokenRepository);

//Dependencias para Get My Profile
const getMyProfileUseCase = new GetMyProfileUseCase(profileRepository);
const updateMyProfileUseCase = new UpdateMyProfileUseCase(profileRepository);
const deactivateMyProfileUseCase = new DeactivateMyProfileUseCase(profileRepository);
const getPublicProfileUseCase = new GetPublicProfileUseCase(profileRepository);
const createVehicleUseCase = new CreateVehicleUseCase(vehicleRepository);
const listMyVehiclesUseCase = new ListMyVehiclesUseCase(vehicleRepository);
const updateMyVehicleUseCase = new UpdateMyVehicleUseCase(vehicleRepository);
const deleteMyVehicleUseCase = new DeleteMyVehicleUseCase(vehicleRepository);
const setActiveVehicleUseCase = new SetActiveVehicleUseCase(vehicleRepository);

export const authController = new AuthController(
  registerUserUseCase,
  loginUserUseCase,
  refreshSessionUseCase,
  logoutUserUseCase
);

export const profileController = new ProfileController(
  getMyProfileUseCase,
  updateMyProfileUseCase,
  deactivateMyProfileUseCase,
  getPublicProfileUseCase
);

export const vehicleController = new VehicleController(
  createVehicleUseCase,
  listMyVehiclesUseCase,
  updateMyVehicleUseCase,
  deleteMyVehicleUseCase,
  setActiveVehicleUseCase
);
