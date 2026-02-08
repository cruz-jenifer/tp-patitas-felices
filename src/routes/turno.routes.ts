import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as turnoController from '../controllers/turno.controller'; 

const router = Router();

// TODAS LAS RUTAS REQUIEREN AUTH
router.use(authMiddleware);

// RUTA DASHBOARD VETERINARIO
router.get('/agenda', turnoController.getAgenda); 

// RUTAS CRUD STANDARD
router.get('/', turnoController.getMisTurnos); 
router.post('/', turnoController.createTurno);
router.delete('/:id', turnoController.deleteTurno); 

export default router;