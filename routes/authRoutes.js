import { Router } from 'express';
import { login, logout, refreshToken } from '../controllers/authController.js';

const router = Router();

// POST /auth/login => Iniciar sesión con las credenciales de un usuario
router.post('/login', login);

// GET /auth/token => Obtener un nuevo access token utilizando el refresh token
router.get('/token', refreshToken);

// GET /auth/logout => Cerrar sesión del usuario actual
router.delete('/logout', logout)

export default router;
