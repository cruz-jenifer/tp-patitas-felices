import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/usuarios.model';
import { Usuario } from '../models/usuarios.model';

// REGISTRO DE USUARIO
export const register = async (userData: Usuario) => {
    const existingUser = await userModel.findByEmail(userData.email);
    if (existingUser) {
        throw new Error('EL USUARIO YA EXISTE');
    }

    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    
    // GUARDAMOS CON ROL POR DEFECTO SI NO VIENE
    const newUser = await userModel.create({ 
        ...userData, 
        password: hashedPassword,
        rol: userData.rol || 'cliente' 
    });
    
    // RETORNAMOS USUARIO SIN PASSWORD
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

// LOGIN DE USUARIO
export const login = async (credentials: { email: string, password: string }) => {
    const user = await userModel.findByEmail(credentials.email);
    
    if (!user || !user.password) {
        throw new Error('CREDENCIALES INVÁLIDAS');
    }

    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) {
        throw new Error('CREDENCIALES INVÁLIDAS');
    }
const token = jwt.sign(
    { id: user.id, rol: user.rol }, 
    'UTN_PATITAS_2024', 
    { expiresIn: '2h' }
);
    
   /* const token = jwt.sign(
        { id: user.id, rol: user.rol }, 
        process.env.JWT_SECRET || 'patitas_secreta_123',
        { expiresIn: '1h' }
    );*/

    return { token, user: { id: user.id, email: user.email, rol: user.rol } };
};