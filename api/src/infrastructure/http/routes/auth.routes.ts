import { Router } from 'express';
import { authController } from '../../dependencies';
import { validateBody } from '../middlewares/validateBody';
import { registerUserBodySchema } from '../schemas/auth/registerUserBodySchema';
import { loginUserBodySchema } from '../schemas/auth/loginUserBodySchema';

const router = Router();

router.post('/register', validateBody(registerUserBodySchema), (req, res) =>
  authController.registerUser(req, res)
);
router.post('/login', validateBody(loginUserBodySchema), (req, res) =>
  authController.loginUser(req, res)
);
router.post('/refresh', (req, res) =>
  authController.refreshSession(req, res)
);
router.post('/logout', (req, res) =>
  authController.logoutUser(req, res)
);

export default router;
