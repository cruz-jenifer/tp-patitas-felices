import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as historialController from '../controllers/historial.controller';

const router = Router();

// APLICAR SEGURIDAD A TODO EL MODULO
router.use(authMiddleware);

// RUTAS
router.post('/', historialController.createHistorial);
router.get('/:id', historialController.getHistorialByMascota);

export default router;