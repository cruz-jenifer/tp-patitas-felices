import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as mascotaController from '../controllers/mascota.controller';

const router = Router();

// PROTECCION DE TODAS LAS RUTAS
router.use(authMiddleware);

// RUTAS CRUD MASCOTAS
router.post('/', mascotaController.createMascota);
router.get('/', mascotaController.getMisMascotas);

export default router;