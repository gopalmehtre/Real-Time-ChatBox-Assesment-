import { Router } from "express";
import { Signup, Login } from '../controllers/AuthController.js';
import { checkAuthStatus } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/signup", Signup);
router.post('/login', Login);
router.get('/status', checkAuthStatus);

export default router;