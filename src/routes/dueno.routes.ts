import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as duenoController from '../controllers/dueno.controller';

const router = Router();

// MIDDLEWARE DE AUTENTICACION
router.use(authMiddleware);

// RUTAS DE PERFIL
router.post('/perfil', duenoController.createPerfil);
router.get('/perfil', duenoController.getMiPerfil);

export default router;