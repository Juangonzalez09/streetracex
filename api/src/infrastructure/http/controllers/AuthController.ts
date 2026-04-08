import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../../application/auth/RegisterUserUseCase';

export class AuthController {
  constructor(private registerUserUseCase: RegisterUserUseCase) {}

  async registerUser(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      
      const password_hash = password; 

      const newUser = await this.registerUserUseCase.execute(username, email, password_hash);
      res.status(201).json({
        success: true,
        message: 'Usuario registrado con éxito',
        data: newUser, 
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error al registrar usuario',
      });
    }
  }
}
