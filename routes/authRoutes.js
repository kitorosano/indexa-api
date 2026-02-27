import { Router } from 'express';
import { login, logout, refreshToken } from '../controllers/authController.js';

const router = Router();

// POST /auth => Iniciar sesión con las credenciales de un usuario
router.post('/', login);

// GET /auth => Obtener un nuevo access token utilizando el refresh token
router.get('/', refreshToken);

// GET /auth => Cerrar sesión del usuario actual
router.delete('/', logout);

export default router;
