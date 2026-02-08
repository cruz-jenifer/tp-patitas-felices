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

// OBTENER AGENDA DEL DIA
export const getAgenda = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Obtenemos la fecha del query param o usamos la fecha actual
        const fecha = req.query.fecha as string || new Date().toISOString().split('T')[0];
        
        const agenda = await turnoModel.getAgendaGlobal(fecha);
        res.json({ fecha, data: agenda });
    } catch (error) {
        next(error);
    }
};

// CREAR UN TURNO
export const createTurno = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('NO AUTORIZADO');

        const { fecha_hora, motivo, mascota_id, servicio_id, veterinario_id } = req.body;

        // VALIDACION BASICA DE CAMPOS
        if (!fecha_hora || !motivo || !mascota_id || !servicio_id) {
            return res.status(400).json({ message: 'FALTAN CAMPOS OBLIGATORIOS' });
        }

        // VALIDACION DE DISPONIBILIDAD VETERINARIO
        if (veterinario_id) {
            const turnoOcupado = await turnoModel.findByVetAndDate(veterinario_id, fecha_hora);
            if (turnoOcupado) {
                return res.status(409).json({ message: 'EL VETERINARIO YA TIENE UN TURNO EN ESE HORARIO' });
            }
        }

        const nuevoTurno = await turnoModel.create({
            fecha_hora, 
            motivo,
            mascota_id, 
            servicio_id, 
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

        const turno = await turnoModel.findById(turnoId);
        if (!turno) {
            return res.status(404).json({ message: 'TURNO NO ENCONTRADO' });
        }

        const turnosDelUsuario = await turnoModel.findByUserId(req.user.id);
        const turnoPerteneceAlUsuario = turnosDelUsuario.some(t => t.id === turnoId);
        
        if (!turnoPerteneceAlUsuario) {
            return res.status(403).json({ message: 'NO TIENES PERMISO PARA CANCELAR ESTE TURNO' });
        }

        await turnoModel.remove(turnoId);
        res.json({ message: 'TURNO CANCELADO CORRECTAMENTE' });

    } catch (error) {
        next(error);
    }
};