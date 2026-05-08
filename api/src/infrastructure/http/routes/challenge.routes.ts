import { Router } from 'express';
import { challengeController } from '../../dependencies';
import { requireAuth } from '../middlewares/auth/requireAuth';
import { validateBody, validateParams, validateQuery } from '../middlewares/validateBody';
import { challengeIdParamSchema } from '../schemas/challenge/challengeIdParamSchema';
import { challengeStatusBodySchema } from '../schemas/challenge/challengeStatusBodySchema';
import { getChallengesQuerySchema } from '../schemas/challenge/getChallengesQuerySchema';
import { reportResultBodySchema } from '../schemas/challenge/reportResultBodySchema';
import { sendChallengeBodySchema } from '../schemas/challenge/sendChallengeBodySchema';

const router = Router();

router.post('/', requireAuth, validateBody(sendChallengeBodySchema), (req, res) =>
  challengeController.send(req, res),
);
router.get('/', requireAuth, validateQuery(getChallengesQuerySchema), (req, res) =>
  challengeController.list(req, res),
);
router.get('/:challengeId', requireAuth, validateParams(challengeIdParamSchema), (req, res) =>
  challengeController.getOne(req, res),
);
router.patch('/:challengeId/status', requireAuth, validateParams(challengeIdParamSchema), validateBody(challengeStatusBodySchema), (req, res) =>
  challengeController.updateStatus(req, res),
);
router.patch('/:challengeId/result', requireAuth, validateParams(challengeIdParamSchema), validateBody(reportResultBodySchema), (req, res) =>
  challengeController.reportResult(req, res),
);

export default router;