import { Router } from 'express';
import { challengeController } from '../../dependencies';
import { requireAuth } from '../middlewares/auth/requireAuth';
import { requireRole } from '../middlewares/auth/requireRole';
import { validateBody, validateParams, validateQuery } from '../middlewares/validateBody';
import { adminResolveBodySchema } from '../schemas/challenge/adminResolveBodySchema';
import { challengeIdParamSchema } from '../schemas/challenge/challengeIdParamSchema';
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
router.patch('/:challengeId/accept', requireAuth, validateParams(challengeIdParamSchema), (req, res) =>
  challengeController.accept(req, res),
);
router.patch('/:challengeId/reject', requireAuth, validateParams(challengeIdParamSchema), (req, res) =>
  challengeController.reject(req, res),
);
router.patch('/:challengeId/cancel', requireAuth, validateParams(challengeIdParamSchema), (req, res) =>
  challengeController.cancel(req, res),
);
router.patch('/:challengeId/start', requireAuth, validateParams(challengeIdParamSchema), (req, res) =>
  challengeController.start(req, res),
);
router.patch(
  '/:challengeId/result',
  requireAuth,
  validateParams(challengeIdParamSchema),
  validateBody(reportResultBodySchema),
  (req, res) => challengeController.reportResult(req, res),
);
router.patch(
  '/:challengeId/admin-resolve',
  requireAuth,
  requireRole('ADMINISTRADOR'),
  validateParams(challengeIdParamSchema),
  validateBody(adminResolveBodySchema),
  (req, res) => challengeController.adminResolve(req, res),
);

export default router;