import { Router } from 'express';
import { createTag } from '../controllers/tagController.js';

const router = Router();

// POST /tags => Registra una nueva etiqueta a la DB
router.post('/', createTag);

export default router;
