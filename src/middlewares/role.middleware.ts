import { Request, Response, NextFunction } from 'express';
import { RolUsuario } from '../types/auth.types';

// DEFINICION DEL MIDDLEWARE DE ROLES
export const checkRole = (rolesPermitidos: RolUsuario[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        
        // VERIFICACION DE AUTENTICACION PREVIA
        if (!req.user) {
            return res.status(401).json({ message: 'Token de autenticación no encontrado.' });
        }

        // VALIDACION DE PERMISOS DE ROL
        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ 
                message: 'Acceso denegado. No tienes los permisos necesarios.' 
            });
        }

        // CONTINUACION AL CONTROLADOR
        next();
    };
};