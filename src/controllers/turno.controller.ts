import { Request, Response, NextFunction } from 'express';
import * as turnoModel from '../models/turno.model';

// OBTENER MIS TURNOS
export const getMisTurnos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('NO AUTORIZADO');
        
        const turnos = await turnoModel.findByUserId(req.user.id);
        res.json({ data: turnos });
    } catch (error) {
        next(error);
    }
};

// CREAR UN TURNO
export const createTurno = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('NO AUTORIZADO');

        const { fecha_hora, motivo, mascota_id, servicio_id, veterinario_id } = req.body;

        // VALIDACIÓN BÁSICA
        if (!fecha_hora || !motivo || !mascota_id || !servicio_id) {
            return res.status(400).json({ message: 'FALTAN CAMPOS OBLIGATORIOS (fecha_hora, motivo, mascota_id, servicio_id)' });
        }

        const nuevoTurno = await turnoModel.create({
            fecha_hora, // CAMBIO: UN SOLO CAMPO DATETIME
            motivo,
            mascota_id, // OBLIGATORIO AHORA
            servicio_id, // NUEVO: OBLIGATORIO
            veterinario_id
        });

        res.status(201).json({ message: 'TURNO RESERVADO CON ÉXITO', data: nuevoTurno });
    } catch (error) {
        next(error);
    }
};

// ELIMINAR MI TURNO
export const deleteTurno = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('NO AUTORIZADO');

        const { id } = req.params;
        const turnoId = Number(id);

        // VERIFICAR QUE EL TURNO EXISTA
        const turno = await turnoModel.findById(turnoId);
        if (!turno) {
            return res.status(404).json({ message: 'TURNO NO ENCONTRADO' });
        }

        // VERIFICAR QUE EL TURNO PERTENEZCA AL USUARIO - CONSULTA COMPLEJA
        const turnosDelUsuario = await turnoModel.findByUserId(req.user.id);
        const turnoPerteneceAlUsuario = turnosDelUsuario.some(t => t.id === turnoId);
        
        if (!turnoPerteneceAlUsuario) {
            return res.status(403).json({ message: 'NO TIENES PERMISO PARA CANCELAR ESTE TURNO' });
        }

        // ELIMINAR
        await turnoModel.remove(turnoId);
        res.json({ message: 'TURNO CANCELADO CORRECTAMENTE' });

    } catch (error) {
        next(error);
    }
};