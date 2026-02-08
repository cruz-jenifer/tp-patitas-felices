import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';
import * as turnoController from '../controllers/turno.controller'; 

const router = Router();

// APLICAR AUTH A TODO EL MODULO
router.use(authMiddleware);

// RUTA DASHBOARD VETERINARIO
// SOLO VETERINARIOS Y ADMIN PUEDEN VER LA AGENDA COMPLETA
router.get('/agenda', checkRole(['veterinario', 'admin']), turnoController.getAgenda); 

// RUTAS CRUD STANDARD
// CLIENTES Y ADMIN PUEDEN VER SUS TURNOS
router.get('/', checkRole(['cliente', 'admin']), turnoController.getMisTurnos); 

// CLIENTES Y ADMIN PUEDEN AGENDAR
router.post('/', checkRole(['cliente', 'admin']), turnoController.createTurno);

// CLIENTES Y ADMIN PUEDEN CANCELAR
router.delete('/:id', checkRole(['cliente', 'admin']), turnoController.deleteTurno); 

export default router;