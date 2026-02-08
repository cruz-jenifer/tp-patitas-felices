import * as mascotaModel from '../models/mascota.model';
import * as duenoModel from '../models/dueno.model';

// REGISTRAR MASCOTA (Requiere que el usuario sea Dueño)
export const registrarMascota = async (userId: number, datosMascota: any) => {
    //  Buscar la identidad de 'Dueño' del usuario logueado
    const dueno = await duenoModel.findByUserId(userId);
    
    // Validacion de negocio: No se puede tener mascota sin datos de contacto
    if (!dueno || !dueno.id) {
        throw new Error('Debe completar su perfil de dueño antes de registrar mascotas.');
    }

    //  Insertar mascota con el ID de dueño resuelto
    return await mascotaModel.create({
        ...datosMascota,
        dueno_id: dueno.id // Asignación automática segura
    });
};

// OBTENER MASCOTAS PROPIAS
export const obtenerMisMascotas = async (userId: number) => {
    //  Resolver ID de dueño
    const dueno = await duenoModel.findByUserId(userId);
    
    if (!dueno || !dueno.id) {
        return []; // Si no es dueño, no tiene mascotas
    }

    // Filtrar mascotas por ese dueño
    return await mascotaModel.findByDuenoId(dueno.id);
};