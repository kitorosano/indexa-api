import { Router } from "express";
import { deleteBook, getBookById } from "../controllers/bookController.js";

const router = Router();

router.get('/:id', getBookById);
router.delete('/:id', deleteBook);

export default router;