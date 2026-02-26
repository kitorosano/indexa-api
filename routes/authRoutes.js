import { Router } from 'express';
import { login, logout } from '../controllers/authController.js';

const router = Router();

// POST /auth/login => Iniciar sesión con las credenciales de un usuario
router.post('/login', login);

// GET /auth/logout => Cerrar sesión del usuario actual
router.delete('/logout', logout)

export default router;
