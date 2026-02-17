import { Router } from "express";
import { registerUser } from "../controllers/userController.js";

const router = Router()

// POST /users => Registra un nuevo usuario a la DB
router.post('/', registerUser);

export default router;