import * as mascotaModel from '../models/mascota.model';
import * as duenoModel from '../models/dueno.model';
import { IMascota } from '../models/interfaces/mascota.interface';

// REGISTRAR MASCOTA (Requiere que el usuario tenga perfil de Dueño)
export const registrarMascota = async (userId: number, datosMascota: any): Promise<IMascota> => {
    // Buscar el perfil de Dueño asociado al usuario
    const dueno = await duenoModel.findByUserId(userId);
    
    // Validación de negocio: Usuario debe tener perfil de Dueño
    if (!dueno || !dueno.id) {
        throw new Error('Debe completar su perfil de dueño antes de registrar mascotas.');
    }

    // Insertar mascota forzando el dueno_id del usuario autenticado
    return await mascotaModel.create({
        ...datosMascota,
        dueno_id: dueno.id // Asignación automática y segura
    });
};

// OBTENER MASCOTAS PROPIAS (Scope por Dueño)
export const misMascotas = async (userId: number): Promise<IMascota[]> => {
    // Resolver el ID de dueño del usuario autenticado
    const dueno = await duenoModel.findByUserId(userId);
    
    // Si no tiene perfil de Dueño, retornar array vacío
    if (!dueno || !dueno.id) {
        return [];
    }

    // Filtrar mascotas exclusivamente por ese dueño
    return await mascotaModel.findByDuenoId(dueno.id);
};