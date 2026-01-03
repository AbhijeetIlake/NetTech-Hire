import { loginController, registerController } from "../controllers/authControllers.js";
import express from "express";
const router = express.Router()

router.post('/login', loginController)
router.post('/register', registerController)

export default router;