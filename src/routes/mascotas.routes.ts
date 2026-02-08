import { Router } from 'express';
import { getMisMascotas, createMascota } from '../controllers/mascotas.controller'; 
import { authMiddleware } from '../middlewares/auth.middleware'; // MIDDLEWARE DE AUTENTICACIÓN

const router = Router();

// TODAS LAS RUTAS PROTEGIDAS - SOLO USUARIOS AUTENTICADOS
router.use(authMiddleware);

router.get('/', getMisMascotas); // RUTA PARA OBTENER MASCOTAS DEL USUARIO
router.post('/', createMascota); // RUTA PARA CREAR MASCOTA

export default router;