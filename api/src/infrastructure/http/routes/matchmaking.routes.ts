import { Router } from 'express';
import { matchmakingController } from '../../dependencies';
import { requireAuth } from '../middlewares/auth/requireAuth';
import { validateQuery } from '../middlewares/validateBody';
import { listMatchmakingQuerySchema } from '../schemas/matchmaking/listMatchmakingQuerySchema';

const router = Router();

router.get('/', requireAuth, validateQuery(listMatchmakingQuerySchema), (req, res) =>
  matchmakingController.listPilots(req, res)
);

export default router;
