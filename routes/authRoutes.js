import { Router } from 'express';
import { login } from '../controllers/authController.js';

const router = Router();

// POST /auth/login => Iniciar sesión con las credenciales de un usuario
router.post('/login', login);

export default router;
