import { Router } from 'express';
import { profileController } from '../../dependencies';
import { requireAuth } from '../middlewares/auth/requireAuth';
import { validateBody, validateParams } from '../middlewares/validateBody';
import { userIdParamSchema } from '../schemas/common/userIdParamSchema';
import { updateMyProfileBodySchema } from '../schemas/profile/updateMyProfileBodySchema';

const router = Router();

router.get('/me', requireAuth, (req, res) => profileController.getMyProfile(req, res));
router.patch('/me', requireAuth, validateBody(updateMyProfileBodySchema), (req, res) =>
  profileController.updateMyProfile(req, res)
);
router.patch('/me/deactivate', requireAuth, (req, res) => profileController.deactivateMyProfile(req, res));
router.get('/:userId', requireAuth, validateParams(userIdParamSchema), (req, res) =>
  profileController.getPublicProfile(req, res)
);

export default router;
