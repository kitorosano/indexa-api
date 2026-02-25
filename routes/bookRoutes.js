import { Router } from "express";
import { deleteBook, getBookById } from "../controllers/bookController.js";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";

const router = Router();

router.post("/", verifyAccessToken, createBook);
router.get("/:id", verifyAccessToken, getBookById);
router.delete("/:id", verifyAccessToken, deleteBook);

export default router;
