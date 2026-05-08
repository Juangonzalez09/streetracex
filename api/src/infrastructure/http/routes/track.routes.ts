import { Router } from 'express';
import { trackController } from '../../dependencies';
import { requireAuth } from '../middlewares/auth/requireAuth';
import { requireRole } from '../middlewares/auth/requireRole';
import { validateBody, validateParams, validateQuery } from '../middlewares/validateBody';
import { trackIdParamSchema } from '../schemas/common/trackIdParamSchema';
import { createTrackBodySchema } from '../schemas/track/createTrackBodySchema';
import { listTracksQuerySchema } from '../schemas/track/listTracksQuerySchema';
import { updateTrackBodySchema } from '../schemas/track/updateTrackBodySchema';

const router = Router();

// Pilotos: listar y ver detalle
router.get('/', requireAuth, validateQuery(listTracksQuerySchema), (req, res) => trackController.list(req, res));
router.get('/:trackId', requireAuth, validateParams(trackIdParamSchema), (req, res) => trackController.getOne(req, res));

// Administrador: crear, editar, desactivar
router.post('/', requireAuth, requireRole('ADMINISTRADOR'), validateBody(createTrackBodySchema), (req, res) =>
  trackController.create(req, res)
);
router.patch('/:trackId', requireAuth, requireRole('ADMINISTRADOR'), validateParams(trackIdParamSchema), validateBody(updateTrackBodySchema), (req, res) =>
  trackController.update(req, res)
);
router.patch('/:trackId/deactivate', requireAuth, requireRole('ADMINISTRADOR'), validateParams(trackIdParamSchema), (req, res) =>
  trackController.deactivate(req, res)
);

export default router;