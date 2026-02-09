import { Request, Response, NextFunction } from 'express';
import * as mascotaService from '../services/mascota.service';

// LISTAR MIS MASCOTAS
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new Error('NO AUTORIZADO');
        } 
        
        const mascotas = await mascotaService.misMascotas(req.user.id);
        
        res.json({ data: mascotas });
    } catch (error) {
        next(error);
    }
};

// REGISTRAR MASCOTA
export const createMascota = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('NO AUTORIZADO');

        const { nombre, especie, raza, fecha_nacimiento, advertencias } = req.body;

        if (!nombre || !especie) {
            return res.status(400).json({ message: 'NOMBRE Y ESPECIE SON OBLIGATORIOS' });
        }

        const nuevaMascota = await mascotaService.registrarMascota(req.user.id, {
            nombre, especie, raza, fecha_nacimiento, advertencias
        });

        res.status(201).json({ message: 'MASCOTA REGISTRADA EXITOSAMENTE', data: nuevaMascota });
    } catch (error) {
        next(error);
    }
};