import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as turnoController from '../controllers/turno.controller'; 

const router = Router();

// TODAS LAS RUTAS DE TURNOS REQUIEREN AUTENTICACIÓN
router.use(authMiddleware);

router.get('/', turnoController.getMisTurnos); 
router.post('/', turnoController.createTurno);
router.delete('/:id', turnoController.deleteTurno); 

export default router;