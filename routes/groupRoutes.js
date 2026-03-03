import { Router } from 'express';
import { createGroup } from '../controllers/groupController.js';
import { verifyAccessToken } from '../middleware/verifyAccessToken.js';

const router = Router();

// POST /groups => Registra un nuevo grupo de filtros a la DB
router.post('/', verifyAccessToken, createGroup);

export default router;
