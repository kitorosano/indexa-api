import { Router } from "express";
import { deleteBook } from "../controllers/bookController.js";

const router = Router()

// DELETE /books/:id => Elimina un libro de la DB por su ID
router.delete('/:id', deleteBook);

export default router;