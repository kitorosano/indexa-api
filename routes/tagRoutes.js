import { Router } from 'express';
import { createTag, deleteTag } from '../controllers/tagController.js';

const router = Router();

// POST /tags => Registra una nueva etiqueta a la DB
router.post('/', createTag);

// DELETE /tags/:id => Elimina una etiqueta de la DB
router.delete('/:id', deleteTag);

export default router;
