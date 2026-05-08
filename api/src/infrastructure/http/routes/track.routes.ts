import { Router } from 'express';
import { trackController } from '../../dependencies';
import { requireAuth } from '../middlewares/auth/requireAuth';
import { validateParams, validateQuery } from '../middlewares/validateBody';
import { trackIdParamSchema } from '../schemas/common/trackIdParamSchema';
import { listTracksQuerySchema } from '../schemas/track/listTracksQuerySchema';

const router = Router();

router.get('/', requireAuth, validateQuery(listTracksQuerySchema), (req, res) => trackController.list(req, res));
router.get('/:trackId', requireAuth, validateParams(trackIdParamSchema), (req, res) => trackController.getOne(req, res));

export default router;