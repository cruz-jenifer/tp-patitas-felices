import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';
import { Turno, TurnoRow } from '../types/turno';

// BUSCAR TURNO POR VETERINARIO Y FECHA (VALIDACIÓN DE DISPONIBILIDAD)
export const findByVetAndDate = async (veterinarioId: number, fechaHora: string): Promise<Turno | null> => {
    const [rows] = await pool.query<TurnoRow[]>(
        'SELECT * FROM turnos WHERE veterinario_id = ? AND fecha_hora = ?',
        [veterinarioId, fechaHora]
    );
    return rows.length > 0 ? rows[0] : null;
};

// CREAR NUEVO TURNO
export const create = async (turno: Turno): Promise<Turno> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO turnos (mascota_id, servicio_id, veterinario_id, fecha_hora, motivo, estado) VALUES (?, ?, ?, ?, ?, ?)',
        [
            turno.mascota_id,
            turno.servicio_id,
            turno.veterinario_id,
            turno.fecha_hora,
            turno.motivo,
            turno.estado || 'pendiente'
        ]
    );
    return { id: result.insertId, ...turno };
};

export function findByDuenoId(id: number) {
    throw new Error('Function not implemented.');
}
