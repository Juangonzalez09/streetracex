import { Request, Response } from 'express';
import { DeactivateMyProfileUseCase } from '../../../application/profile/DeactivateMyProfileUseCase';
import { GetMyProfileUseCase } from '../../../application/profile/GetMyProfileUseCase';
import { GetPublicProfileUseCase } from '../../../application/profile/GetPublicProfileUseCase';
import { UpdateMyProfileUseCase } from '../../../application/profile/UpdateMyProfileUseCase';
import { UpdateProfileInput } from '../../../domain/profile/ProfileRepository';

export class ProfileController {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly updateMyProfileUseCase: UpdateMyProfileUseCase,
    private readonly deactivateMyProfileUseCase: DeactivateMyProfileUseCase,
    private readonly getPublicProfileUseCase: GetPublicProfileUseCase
  ) {}

  async getMyProfile(req: Request, res: Response) {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
    }

    try {
      const profile = await this.getMyProfileUseCase.execute(userId);
      return res.status(200).json({
        success: true,
        message: 'Perfil obtenido',
        data: profile,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Usuario no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Error interno al obtener perfil',
      });
    }
  }

  async updateMyProfile(req: Request, res: Response) {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
    }

    try {
      const payload = req.body as UpdateProfileInput;
      const profile = await this.updateMyProfileUseCase.execute(userId, payload);

      return res.status(200).json({
        success: true,
        message: 'Perfil actualizado',
        data: profile,
      });
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        return res.status(500).json({
          success: false,
          message: 'Error interno al actualizar perfil',
        });
      }

      if (error.message === 'No hay campos para actualizar') {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message === 'El nombre de usuario ya está en uso') {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Error interno al actualizar perfil',
      });
    }
  }

  async deactivateMyProfile(req: Request, res: Response) {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
    }

    try {
      await this.deactivateMyProfileUseCase.execute(userId);
      return res.status(200).json({
        success: true,
        message: 'Cuenta desactivada',
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Usuario no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Error interno al desactivar cuenta',
      });
    }
  }

  async getPublicProfile(req: Request, res: Response) {
    const userId = req.params.userId;

    try {
      const profile = await this.getPublicProfileUseCase.execute(userId);
      return res.status(200).json({
        success: true,
        message: 'Perfil público obtenido',
        data: profile,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Perfil público no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Error interno al obtener perfil público',
      });
    }
  }
}
