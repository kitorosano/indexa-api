import { Router } from 'express';
import { getUserById, registerUser } from '../controllers/userController.js';
import { verifyAccessToken } from '../middleware/verifyAccessToken.js';

const router = Router();

// POST /users => Registra un nuevo usuario a la DB
router.post('/', registerUser);

// GET /users/:id => Obtiene un usuario por su ID
router.get('/:id', verifyAccessToken, getUserById);

export default router;
