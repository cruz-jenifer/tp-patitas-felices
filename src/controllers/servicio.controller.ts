import { Request, Response, NextFunction } from 'express';
import { ServicioModel } from '../models/servicio.model';

// OBTENER LISTA DE SERVICIOS
export const getServicios = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const servicios = await ServicioModel.findAll();
        res.json(servicios);
    } catch (error) {
        next(error);
    }
};