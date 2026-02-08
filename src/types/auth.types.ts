
//  Definimos los roles permitidos exactamente como están en MySQL
export type RolUsuario = 'admin' | 'veterinario' | 'cliente';

//  Definimos la estructura del Token (Payload)

export interface UserPayload {
    id: number;
    email: string;
    rol: RolUsuario;
}

//  Extendemos la interfaz de Request de Express

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}