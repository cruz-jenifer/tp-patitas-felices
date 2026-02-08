import { Request, Response, NextFunction } from 'express';
import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';
import * as historialModel from '../models/historial.model';

// CREAR NUEVA ENTRADA EN EL HISTORIAL
export const createHistorial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('NO AUTORIZADO');

        const { mascota_id, diagnostico, tratamiento, fecha } = req.body;

        // VALIDAR DATOS MINIMOS
        if (!mascota_id || !diagnostico || !fecha) {
            return res.status(400).json({ message: 'FALTAN DATOS OBLIGATORIOS' });
        }

        // BUSCAR ID DE VETERINARIO BASADO EN EL USUARIO LOGUEADO
        const [vetRows] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM veterinarios WHERE usuario_id = ?', 
            [req.user.id]
        );

        if (vetRows.length === 0) {
            return res.status(403).json({ message: 'SOLO LOS VETERINARIOS PUEDEN ESCRIBIR HISTORIAL' });
        }

        const veterinarioId = vetRows[0].id;

        // GUARDAR
        const nuevoRegistro = await historialModel.create({
            mascota_id,
            veterinario_id: veterinarioId,
            fecha,
            diagnostico,
            tratamiento
        });

        res.status(201).json({ message: 'HISTORIAL ACTUALIZADO', data: nuevoRegistro });

    } catch (error) {
        next(error);
    }
};

// OBTENER HISTORIAL DE UNA MASCOTA
export const getHistorialByMascota = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params; // ID DE LA MASCOTA
        const historial = await historialModel.findByMascotaId(Number(id));
        
        res.json({ data: historial });
    } catch (error) {
        next(error);
    }
};