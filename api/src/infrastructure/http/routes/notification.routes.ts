import { Router } from 'express';
import { notificationController } from '../../dependencies';
import { requireAuth } from '../middlewares/auth/requireAuth';
import { validateParams, validateQuery } from '../middlewares/validateBody';
import { notificationIdParamSchema } from '../schemas/common/notificationIdParamSchema';
import { listNotificationsQuerySchema } from '../schemas/notification/listNotificationsQuerySchema';

const router = Router();

router.get('/', requireAuth, validateQuery(listNotificationsQuerySchema), (req, res) =>
  notificationController.list(req, res)
);
router.patch('/read-all', requireAuth, (req, res) => notificationController.markAllRead(req, res));
router.patch('/:notificationId/read', requireAuth, validateParams(notificationIdParamSchema), (req, res) =>
  notificationController.markRead(req, res)
);

export default router;