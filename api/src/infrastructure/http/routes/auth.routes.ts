import { Router } from 'express';
import { authController } from '../../dependencies'; 
import { validateRegisterUserBody } from '../middlewares/auth/validateRegisterUserBody';
import { validateLoginUserBody } from '../middlewares/auth/validateLoginUserBody';

const router = Router();

router.post('/register', validateRegisterUserBody, (req, res) =>
  authController.registerUser(req, res)
);
router.post('/login', validateLoginUserBody, (req, res) =>
  authController.loginUser(req, res)
);
router.post('/refresh', (req, res) =>
  authController.refreshSession(req, res)
);
router.post('/logout', (req, res) =>
  authController.logoutUser(req, res)
);

export default router;
