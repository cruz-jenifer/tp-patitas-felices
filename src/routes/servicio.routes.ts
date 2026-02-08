import { Router } from 'express';
import { getServicios } from '../controllers/servicio.controller';

const router = Router();

// RUTAS PUBLICAS O PRIVADAS SEGUN REGLA DE NEGOCIO (ACCESIBLE PARA TODOS)
router.get('/', getServicios);

export default router;