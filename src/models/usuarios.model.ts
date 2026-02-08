import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

// ENUMERACION DE ROLES SEGUN DB
export enum UserRole {
    ADMIN = 'admin',
    VETERINARIO = 'veterinario',
    CLIENTE = 'cliente'
}

// INTERFAZ DE USUARIO
export interface Usuario {
    id?: number;
    email: string;
    password?: string;
    rol: UserRole | string;
    creado_en?: Date;
}

// BUSCAR POR EMAIL
export const findByEmail = async (email: string): Promise<Usuario | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return rows.length ? (rows[0] as Usuario) : null;
};

// CREAR USUARIO
export const create = async (user: Usuario): Promise<Usuario> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO users (email, password, rol) VALUES (?, ?, ?)',
        [user.email, user.password, user.rol]
    );
    return { id: result.insertId, ...user };
};

// BUSCAR POR ID
export const findById = async (id: number): Promise<Usuario | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE id = ?',
        [id]
    );
    return rows.length ? (rows[0] as Usuario) : null;
};