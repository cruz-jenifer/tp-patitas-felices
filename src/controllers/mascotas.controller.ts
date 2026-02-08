import { Request, Response, NextFunction } from 'express';
import * as mascotaModel from '../models/mascotas.model';

// OBTENER MIS MASCOTAS (SOLO LAS DEL USUARIO)
export const getMisMascotas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new Error('NO AUTORIZADO');
    
    // NECESITAMOS OBTENER EL DUENO_ID DEL USUARIO PRIMERO
    // ESTO DEPENDE DE CÓMO ESTÉ IMPLEMENTADO EL MODELO
    const duenoId = await obtenerDuenoIdPorUsuarioId(req.user.id); // FUNCIÓN A IMPLEMENTAR
    
    const mascotas = await mascotaModel.findByDuenoId(duenoId);
    res.json({ data: mascotas });
  } catch (error) {
    next(error);
  }
};

// CREAR MASCOTA
export const createMascota = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new Error('NO AUTORIZADO');

    const { nombre, especie, raza, fecha_nacimiento, advertencias } = req.body;

    // VALIDACIÓN BÁSICA
    if (!nombre || !especie) {
      return res.status(400).json({ message: 'FALTAN CAMPOS OBLIGATORIOS (NOMBRE, ESPECIE)' });
    }

    // OBTENER DUENO_ID DEL USUARIO ACTUAL
    const duenoId = await obtenerDuenoIdPorUsuarioId(req.user.id);
    if (!duenoId) {
      return res.status(400).json({ message: 'NO TIENES UN PERFIL DE DUEÑO REGISTRADO' });
    }

    const nuevaMascota = await mascotaModel.create({
      nombre,
      especie,
      raza,
      fecha_nacimiento,
      advertencias,
      dueno_id: duenoId // ASIGNAR AL DUEÑO CORRECTO
    });

    res.status(201).json({ message: 'MASCOTA CREADA CON ÉXITO', data: nuevaMascota });
  } catch (error) {
    next(error);
  }
};

// FUNCIÓN AUXILIAR - DEBE IMPLEMENTARSE EN EL MODELO
async function obtenerDuenoIdPorUsuarioId(usuarioId: number): Promise<number | null> {
  // ESTO DEPENDE DE LA IMPLEMENTACIÓN DEL MODELO DUENOS
  // EJEMPLO: const dueno = await duenoModel.findByUsuarioId(usuarioId);
  // return dueno ? dueno.id : null;
  return null; // IMPLEMENTAR
}