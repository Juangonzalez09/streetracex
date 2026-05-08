import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RegisterUserInput, RegisterUserUseCase } from '../../../application/auth/RegisterUserUseCase';
import { LoginUserInput, LoginUserResult, LoginUserUseCase } from '../../../application/auth/LoginUserUseCase';
import {
  RefreshSessionInput,
  RefreshSessionResult,
  RefreshSessionUseCase,
} from '../../../application/auth/RefreshSessionUseCase';
import { LogoutUserUseCase } from '../../../application/auth/LogoutUserUseCase';

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshSessionUseCase: RefreshSessionUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase
  ) {}

  async registerUser(req: Request, res: Response) {
    try {
      const payload: RegisterUserInput = req.body;
      const newUser = await this.registerUserUseCase.execute(payload);

      return res.status(201).json({
        success: true,
        message: 'Usuario registrado con éxito',
        data: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          createdAt: newUser.createdAt,
        },
      });
    } catch (error: unknown) {
      return this.handleRegisterError(error, res);
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const payload: LoginUserInput = req.body;
      const loginResult = await this.loginUserUseCase.execute(payload);
      this.setRefreshTokenCookie(res, loginResult.refreshToken, loginResult.refreshTokenExpiresAt);
      const responseData = this.toClientAuthResponse(loginResult);

      return res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: responseData,
      });
    } catch (error: unknown) {
      return this.handleLoginError(error, res);
    }
  }

  async refreshSession(req: Request, res: Response) {
    try {
      const refreshToken = this.getRefreshTokenFromRequest(req);
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token requerido',
        });
      }

      const payload: RefreshSessionInput = { refreshToken };
      const refreshResult = await this.refreshSessionUseCase.execute(payload);
      this.setRefreshTokenCookie(res, refreshResult.refreshToken, refreshResult.refreshTokenExpiresAt);
      const responseData = this.toClientAuthResponse(refreshResult);

      return res.status(200).json({
        success: true,
        message: 'Sesión refrescada',
        data: responseData,
      });
    } catch (error: unknown) {
      return this.handleRefreshError(error, res);
    }
  }

  async logoutUser(req: Request, res: Response) {
    try {
      const refreshToken = this.getRefreshTokenFromRequest(req);
      if (refreshToken) {
        await this.logoutUserUseCase.execute(refreshToken);
      }

      this.clearRefreshTokenCookie(res);

      return res.status(200).json({
        success: true,
        message: 'Sesión cerrada',
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: 'Error interno al cerrar sesión',
      });
    }
  }

  private toClientAuthResponse(authResult: LoginUserResult | RefreshSessionResult) {
    return {
      accessToken: authResult.accessToken,
      tokenType: authResult.tokenType,
      expiresIn: authResult.expiresIn,
      user: authResult.user,
    };
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string, expiresAt: Date) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth',
      expires: expiresAt,
    });
  }

  private clearRefreshTokenCookie(res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth',
    });
  }

  private getRefreshTokenFromRequest(req: Request): string | null {
    const cookieHeader = req.headers.cookie;
    if (typeof cookieHeader === 'string') {
      const cookies = cookieHeader.split(';');
      for (const cookie of cookies) {
        const [name, ...valueParts] = cookie.trim().split('=');
        if (name === 'refreshToken') {
          const token = decodeURIComponent(valueParts.join('='));
          if (token) return token;
        }
      }
    }

    const body = req.body as { refreshToken?: unknown } | undefined;
    if (body && typeof body.refreshToken === 'string' && body.refreshToken.trim().length > 0) {
      return body.refreshToken.trim();
    }

    return null;
  }

  private handleRegisterError(error: unknown, res: Response) {
    if (error instanceof Error) {
      const badRequestMessages = [
        'El username debe tener entre 3 y 50 caracteres',
        'El username solo puede contener letras, números y guion bajo',
        'La contraseña debe tener entre 8 y 72 caracteres',
      ];

      if (badRequestMessages.includes(error.message)) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      if (
        error.message === 'El correo ya está registrado' ||
        error.message === 'El nombre de usuario ya está en uso' ||
        error.message === 'El email o username ya está registrado'
      ) {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno al registrar usuario',
    });
  }

  private handleLoginError(error: unknown, res: Response) {
    if (this.isServerConfigOrSchemaError(error)) {
      return res.status(500).json({
        success: false,
        message: 'Error de configuración del servidor',
      });
    }

    if (error instanceof Error) {
      if (error.message === 'Credenciales inválidas') {
        return res.status(401).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message === 'Tu cuenta no está activa') {
        return res.status(403).json({
          success: false,
          message: error.message,
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno al iniciar sesión',
    });
  }

  private handleRefreshError(error: unknown, res: Response) {
    if (this.isServerConfigOrSchemaError(error)) {
      return res.status(500).json({
        success: false,
        message: 'Error de configuración del servidor',
      });
    }

    if (error instanceof Error) {
      if (error.message === 'Refresh token requerido' || error.message === 'Refresh token inválido o expirado') {
        return res.status(401).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message === 'Tu cuenta no está activa') {
        return res.status(403).json({
          success: false,
          message: error.message,
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno al refrescar sesión',
    });
  }

  private isServerConfigOrSchemaError(error: unknown): boolean {
    if (error instanceof PrismaClientKnownRequestError) {
      return error.code === 'P2021' || error.code === 'P2022';
    }

    if (!(error instanceof Error)) return false;

    return (
      error.message === 'JWT_SECRET no está configurado' ||
      error.message === 'REFRESH_TOKEN_TTL_DAYS debe ser un número entero entre 1 y 30' ||
      error.message === 'ACCESS_TOKEN_EXPIRES_IN inválido'
    );
  }
}
