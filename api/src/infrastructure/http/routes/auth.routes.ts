import { Router } from 'express';
import { authController } from '../../dependencies'; 

const router = Router();

router.post('/register', (req, res) => authController.registerUser(req, res));

export default router;