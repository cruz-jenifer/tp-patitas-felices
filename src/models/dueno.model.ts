import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

// INTERFAZ DE DUEÑO
export interface Dueno {
    id?: number;
    usuario_id: number;
    nombre: string;
    apellido: string;
    telefono: string;
}

// CREAR NUEVO PERFIL DE DUEÑO
export const create = async (dueno: Dueno): Promise<Dueno> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO duenos (usuario_id, nombre, apellido, telefono) VALUES (?, ?, ?, ?)',
        [dueno.usuario_id, dueno.nombre, dueno.apellido, dueno.telefono]
    );
    return { id: result.insertId, ...dueno };
};

// BUSCAR DUEÑO POR ID DE USUARIO (CRUCIAL PARA VALIDAR)
export const findByUserId = async (userId: number): Promise<Dueno | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM duenos WHERE usuario_id = ?',
        [userId]
    );
    return rows.length ? (rows[0] as Dueno) : null;
};