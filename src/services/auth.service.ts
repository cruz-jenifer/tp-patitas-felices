import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/usuarios.model';
import { Usuario } from '../models/usuarios.model';

// REGISTRO DE USUARIO
export const register = async (userData: Usuario) => {
    const existingUser = await userModel.findByEmail(userData.email);
    if (existingUser) {
        throw new Error('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    
    // GUARDAMOS CON ROL POR DEFECTO SI NO VIENE
    const newUser = await userModel.create({ 
        ...userData, 
        password: hashedPassword,
        rol: userData.rol || 'cliente' 
    });
    
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

// LOGIN DE USUARIO
export const login = async (credentials: { email: string, password: string }) => {
    const user = await userModel.findByEmail(credentials.email);
    
    if (!user || !user.password) {
        throw new Error('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) {
        throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
        { id: user.id, rol: user.rol }, 
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' }
    );

    return { token, user: { id: user.id, email: user.email, rol: user.rol } };
};