import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

export interface Mascota {
    id?: number;
    nombre: string;
    especie: string;
    raza?: string;
    fecha_nacimiento?: string;
    advertencias?: string;
    dueno_id: number; // Relación obligatoria
}

// CREAR MASCOTA (CON DUEÑO ASIGNADO)
export const create = async (mascota: Mascota): Promise<Mascota> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO mascotas (nombre, especie, raza, fecha_nacimiento, advertencias, dueno_id) VALUES (?, ?, ?, ?, ?, ?)',
        [
            mascota.nombre, 
            mascota.especie, 
            mascota.raza || null, 
            mascota.fecha_nacimiento || null, 
            mascota.advertencias || null,
            mascota.dueno_id
        ]
    );
    return { id: result.insertId, ...mascota };
};

// BUSCAR MASCOTAS POR DUEÑO (FEAT 5 - FILTRO)
export const findByDuenoId = async (duenoId: number): Promise<Mascota[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM mascotas WHERE dueno_id = ?',
        [duenoId]
    );
    return rows as Mascota[];
};