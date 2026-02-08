import { Request, Response, NextFunction } from 'express';
import * as mascotaService from '../services/mascota.service';

// REGISTRAR MASCOTA
export const createMascota = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // VERIFICACION DE AUTENTICACION
        if (!req.user) throw new Error('No autorizado');

        const { nombre, especie, raza, fecha_nacimiento, advertencias } = req.body;

        // VALIDACION DE CAMPOS BASICOS
        if (!nombre || !especie) {
            return res.status(400).json({ message: 'Nombre y especie son obligatorios' });
        }

        // LLAMADA AL SERVICIO
        const nuevaMascota = await mascotaService.registrarMascota(req.user.id, {
            nombre, especie, raza, fecha_nacimiento, advertencias
        });

        res.status(201).json({ message: 'Mascota registrada exitosamente', data: nuevaMascota });
    } catch (error) {
        next(error);
    }
};

// OBTENER MIS MASCOTAS
export const getMisMascotas = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // VERIFICACION DE AUTENTICACION
        if (!req.user) throw new Error('No autorizado');
        
        // LLAMADA AL SERVICIO
        const mascotas = await mascotaService.obtenerMisMascotas(req.user.id);
        
        res.json({ data: mascotas });
    } catch (error) {
        next(error);
    }
};