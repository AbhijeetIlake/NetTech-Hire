import { loginController, registerController, logoutController } from "../controllers/authControllers.js";
import express from "express";
const router = express.Router()

router.post('/login', loginController)
router.post('/register', registerController)
router.post('/logout', logoutController)

export default router;