import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const userId = await authService.register(email, password);
    res.status(201).json({ 
      message: 'USUARIO REGISTRADO EXITOSAMENTE', 
      userId 
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);
    res.status(200).json({ 
      message: 'AUTENTICACIÓN EXITOSA', 
      token,
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol // CAMBIO: ROLE -> ROL PARA CONSISTENCIA CON BD
      }
    });
  } catch (error) {
    next(error);
  }
};