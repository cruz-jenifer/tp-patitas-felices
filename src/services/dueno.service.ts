import * as duenoModel from '../models/dueno.model';

// CREAR PERFIL DE DUEÑO
export const registrarPerfil = async (userId: number, datos: { nombre: string, apellido: string, telefono: string }) => {
    //  Validar si el usuario ya tiene un perfil ( 1 a 1)
    const existente = await duenoModel.findByUserId(userId);
    
    if (existente) {
        throw new Error('El usuario ya tiene un perfil de dueño registrado.');
    }

    //  Crear el perfil vinculado
    return await duenoModel.create({
        usuario_id: userId,
        nombre: datos.nombre,
        apellido: datos.apellido,
        telefono: datos.telefono
    });
};

// OBTENER PERFIL
export const obtenerPerfil = async (userId: number) => {
    return await duenoModel.findByUserId(userId);
};