import { Router } from 'express';
import { createTag, deleteTag } from '../controllers/tagController.js';
import { verifyAccessToken } from '../middleware/verifyAccessToken.js';

const router = Router();

// POST /tags => Registra una nueva etiqueta a la DB
router.post('/', verifyAccessToken, createTag);

// DELETE /tags/:id => Elimina una etiqueta de la DB
router.delete('/:id', verifyAccessToken, deleteTag);

export default router;
