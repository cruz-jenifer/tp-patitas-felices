import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

export interface Turno {
    id?: number;
    fecha_hora: string; // CAMBIO: UN SOLO CAMPO DATETIME
    motivo: string;
    estado?: string;
    mascota_id: number; // OBLIGATORIO AHORA
    servicio_id: number; // NUEVO: OBLIGATORIO
    veterinario_id?: number; // OPCIONAL
}

// CREAR UN TURNO
export const create = async (turno: Turno): Promise<Turno> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO turnos (fecha_hora, motivo, mascota_id, servicio_id, veterinario_id) VALUES (?, ?, ?, ?, ?)', // CAMBIO DE TABLA Y CAMPOS
        [turno.fecha_hora, turno.motivo, turno.mascota_id, turno.servicio_id, turno.veterinario_id || null]
    );
    return { id: result.insertId, ...turno };
};

// OBTENER TURNOS DEL USUARIO - CONSULTA COMPLEJA AHORA
export const findByUserId = async (userId: number): Promise<Turno[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT t.* FROM turnos t
         INNER JOIN mascotas m ON t.mascota_id = m.id
         INNER JOIN duenos d ON m.dueno_id = d.id
         WHERE d.usuario_id = ? // JOIN TRIPLE PARA SEGURIDAD
         ORDER BY t.fecha_hora DESC`,
        [userId]
    );
    return rows as Turno[];
};

// OBTENER TURNO POR ID
export const findById = async (id: number): Promise<Turno | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM turnos WHERE id = ?', // CAMBIO DE TABLA
        [id]
    );
    return rows.length ? (rows[0] as Turno) : null;
};

// ELIMINAR TURNO
export const remove = async (id: number): Promise<void> => {
    await pool.execute('DELETE FROM turnos WHERE id = ?', [id]); // CAMBIO DE TABLA
};