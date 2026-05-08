import { PrismaClient } from '@prisma/client';
import { LoginUserUseCase } from '../application/auth/LoginUserUseCase';
import { LogoutUserUseCase } from '../application/auth/LogoutUserUseCase';
import { RefreshSessionUseCase } from '../application/auth/RefreshSessionUseCase';
import { DeactivateMyProfileUseCase } from '../application/profile/DeactivateMyProfileUseCase';
import { GetMyProfileUseCase } from '../application/profile/GetMyProfileUseCase';
import { GetPublicProfileUseCase } from '../application/profile/GetPublicProfileUseCase';
import { UpdateMyProfileUseCase } from '../application/profile/UpdateMyProfileUseCase';
import { AcceptChallengeUseCase } from '../application/challenge/AcceptChallengeUseCase';
import { AdminResolveUseCase } from '../application/challenge/AdminResolveUseCase';
import { CancelChallengeUseCase } from '../application/challenge/CancelChallengeUseCase';
import { GetMyChallengesUseCase } from '../application/challenge/GetMyChallengesUseCase';
import { RejectChallengeUseCase } from '../application/challenge/RejectChallengeUseCase';
import { ReportResultUseCase } from '../application/challenge/ReportResultUseCase';
import { SendChallengeUseCase } from '../application/challenge/SendChallengeUseCase';
import { StartChallengeUseCase } from '../application/challenge/StartChallengeUseCase';
import { PrismaUserRepository } from './auth/PrismaUserRepository';
import { PrismaRefreshTokenRepository } from './auth/PrismaRefreshTokenRepository';
import { RegisterUserUseCase } from '../application/auth/RegisterUserUseCase';
import { AuthController } from './http/controllers/AuthController';
import { ChallengeController } from './http/controllers/ChallengeController';
import { ProfileController } from './http/controllers/ProfileController';
import { VehicleController } from './http/controllers/VehicleController';
import { PrismaProfileRepository } from './profile/PrismaProfileRepository';
import { PrismaVehicleRepository } from './vehicle/PrismaVehicleRepository';
import { PrismaChallengeRepository } from './challenge/PrismaChallengeRepository';
import { PrismaNotificationRepository } from './notification/PrismaNotificationRepository';
import { CreateVehicleUseCase } from '../application/vehicle/CreateVehicleUseCase';
import { ListMyVehiclesUseCase } from '../application/vehicle/ListMyVehiclesUseCase';
import { UpdateMyVehicleUseCase } from '../application/vehicle/UpdateMyVehicleUseCase';
import { DeleteMyVehicleUseCase } from '../application/vehicle/DeleteMyVehicleUseCase';
import { SetActiveVehicleUseCase } from '../application/vehicle/SetActiveVehicleUseCase';
import { PrismaMatchmakingRepository } from './matchmaking/PrismaMatchmakingRepository';
import { ListMatchmakingPilotsUseCase } from '../application/matchmaking/ListMatchmakingPilotsUseCase';
import { MatchmakingController } from './http/controllers/MatchmakingController';

const prisma = new PrismaClient();

const userRepository = new PrismaUserRepository(prisma);
const refreshTokenRepository = new PrismaRefreshTokenRepository(prisma);
const profileRepository = new PrismaProfileRepository(prisma);
const vehicleRepository = new PrismaVehicleRepository(prisma);
const matchmakingRepository = new PrismaMatchmakingRepository(prisma);
const challengeRepository = new PrismaChallengeRepository(prisma);
const notificationRepository = new PrismaNotificationRepository(prisma);
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
const listMatchmakingPilotsUseCase = new ListMatchmakingPilotsUseCase(matchmakingRepository);

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

export const matchmakingController = new MatchmakingController(listMatchmakingPilotsUseCase);

const sendChallengeUseCase = new SendChallengeUseCase(challengeRepository, userRepository, vehicleRepository, notificationRepository);
const acceptChallengeUseCase = new AcceptChallengeUseCase(challengeRepository, vehicleRepository, notificationRepository);
const rejectChallengeUseCase = new RejectChallengeUseCase(challengeRepository, notificationRepository);
const cancelChallengeUseCase = new CancelChallengeUseCase(challengeRepository);
const startChallengeUseCase = new StartChallengeUseCase(challengeRepository);
const reportResultUseCase = new ReportResultUseCase(challengeRepository, profileRepository, notificationRepository);
const adminResolveUseCase = new AdminResolveUseCase(challengeRepository, profileRepository, notificationRepository);
const getMyChallengesUseCase = new GetMyChallengesUseCase(challengeRepository);

export const challengeController = new ChallengeController(
  sendChallengeUseCase,
  acceptChallengeUseCase,
  rejectChallengeUseCase,
  cancelChallengeUseCase,
  startChallengeUseCase,
  reportResultUseCase,
  adminResolveUseCase,
  getMyChallengesUseCase,
);
