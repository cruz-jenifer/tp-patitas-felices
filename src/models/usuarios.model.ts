import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';
import { UserRole } from '../types/auth';

export interface User {
  id: number;
  email: string;
  password: string;
  role: UserRole;
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM usuarios WHERE email = ?', // CAMBIO DE TABLA: USERS -> USUARIOS
    [email]
  );

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id: row.id,
    email: row.email,
    password: row.password,
    role: row.rol as UserRole // CAMBIO DE CAMPO: ROLE -> ROL
  };
};

export const createUser = async (user: Omit<User, 'id'>): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?)', // CAMBIO: USUARIOS Y ROL
    [user.email, user.password, user.role || UserRole.USER]
  );
  return result.insertId;
};