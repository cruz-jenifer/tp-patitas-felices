import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

export interface Turno {
    id?: number;
    fecha_hora: string; 
    motivo: string;
    estado?: string;
    mascota_id: number; 
    servicio_id: number; 
    veterinario_id?: number; 
}

// CREAR UN TURNO
export const create = async (turno: Turno): Promise<Turno> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO turnos (fecha_hora, motivo, mascota_id, servicio_id, veterinario_id) VALUES (?, ?, ?, ?, ?)', 
        [turno.fecha_hora, turno.motivo, turno.mascota_id, turno.servicio_id, turno.veterinario_id || null]
    );
    return { id: result.insertId, ...turno };
};

// VALIDAR DISPONIBILIDAD VETERINARIO
export const findByVetAndDate = async (veterinarioId: number, fechaHora: string): Promise<Turno | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM turnos WHERE veterinario_id = ? AND fecha_hora = ?',
        [veterinarioId, fechaHora]
    );
    return rows.length ? (rows[0] as Turno) : null;
};

// OBTENER AGENDA DEL DIA CON DETALLES
export const getAgendaGlobal = async (fecha: string): Promise<any[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT t.id, t.fecha_hora, t.motivo, t.estado, 
                m.nombre AS mascota, 
                s.nombre AS servicio, 
                v.nombre AS veterinario
         FROM turnos t
         INNER JOIN mascotas m ON t.mascota_id = m.id
         INNER JOIN servicios s ON t.servicio_id = s.id
         LEFT JOIN veterinarios v ON t.veterinario_id = v.id
         WHERE DATE(t.fecha_hora) = ?
         ORDER BY t.fecha_hora ASC`,
        [fecha]
    );
    return rows;
};

// OBTENER TURNOS DEL USUARIO
export const findByUserId = async (userId: number): Promise<Turno[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT t.* FROM turnos t
         INNER JOIN mascotas m ON t.mascota_id = m.id
         INNER JOIN duenos d ON m.dueno_id = d.id
         WHERE d.usuario_id = ? 
         ORDER BY t.fecha_hora DESC`,
        [userId]
    );
    return rows as Turno[];
};

// OBTENER TURNO POR ID
export const findById = async (id: number): Promise<Turno | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM turnos WHERE id = ?', 
        [id]
    );
    return rows.length ? (rows[0] as Turno) : null;
};

// ELIMINAR TURNO
export const remove = async (id: number): Promise<void> => {
    await pool.execute('DELETE FROM turnos WHERE id = ?', [id]); 
};