import { Router } from 'express';
import { deleteBook, getBookById } from '../controllers/bookController.js';
import { verifyAccessToken } from '../middleware/verifyAccessToken.js';

const router = Router();

router.get('/:id', verifyAccessToken, getBookById);
router.delete('/:id', verifyAccessToken, deleteBook);

export default router;
