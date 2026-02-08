import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

export interface HistorialMedico {
    id?: number;
    mascota_id: number;
    veterinario_id: number;
    fecha: string; // DATETIME
    diagnostico: string;
    tratamiento?: string;
}

// CREAR REGISTRO MEDICO
export const create = async (historial: HistorialMedico): Promise<HistorialMedico> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO historial_medico (mascota_id, veterinario_id, fecha, diagnostico, tratamiento) VALUES (?, ?, ?, ?, ?)',
        [
            historial.mascota_id, 
            historial.veterinario_id, 
            historial.fecha, 
            historial.diagnostico, 
            historial.tratamiento || null
        ]
    );
    return { id: result.insertId, ...historial };
};

// OBTENER HISTORIAL POR MASCOTA
export const findByMascotaId = async (mascotaId: number): Promise<any[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT h.*, v.nombre as vet_nombre, v.apellido as vet_apellido, v.matricula 
         FROM historial_medico h
         INNER JOIN veterinarios v ON h.veterinario_id = v.id
         WHERE h.mascota_id = ?
         ORDER BY h.fecha DESC`,
        [mascotaId]
    );
    return rows;
};