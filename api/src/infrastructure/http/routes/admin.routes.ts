import { Router } from 'express';
import { challengeController, trackController } from '../../dependencies';
import { validateBody, validateParams } from '../middlewares/validateBody';
import { adminResolveBodySchema } from '../schemas/challenge/adminResolveBodySchema';
import { challengeIdParamSchema } from '../schemas/challenge/challengeIdParamSchema';
import { trackIdParamSchema } from '../schemas/common/trackIdParamSchema';
import { createTrackBodySchema } from '../schemas/track/createTrackBodySchema';
import { updateTrackBodySchema } from '../schemas/track/updateTrackBodySchema';

const router = Router();

// Challenges — resolución de disputas
router.patch('/challenges/:challengeId/resolve', validateParams(challengeIdParamSchema), validateBody(adminResolveBodySchema), (req, res) =>
  challengeController.adminResolve(req, res),
);

// Tracks — gestión de pistas
router.post('/tracks', validateBody(createTrackBodySchema), (req, res) => trackController.create(req, res));
router.patch('/tracks/:trackId', validateParams(trackIdParamSchema), validateBody(updateTrackBodySchema), (req, res) => trackController.update(req, res));
router.patch('/tracks/:trackId/deactivate', validateParams(trackIdParamSchema), (req, res) => trackController.deactivate(req, res));

export default router;