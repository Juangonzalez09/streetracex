import { Router } from 'express';
import { vehicleController } from '../../dependencies';
import { requireAuth } from '../middlewares/auth/requireAuth';
import { validateBody, validateParams } from '../middlewares/validateBody';
import { vehicleIdParamSchema } from '../schemas/common/vehicleIdParamSchema';
import { createVehicleBodySchema } from '../schemas/vehicle/createVehicleBodySchema';
import { updateMyVehicleBodySchema } from '../schemas/vehicle/updateMyVehicleBodySchema';

const router = Router();

router.get('/', requireAuth, (req, res) => vehicleController.listMyVehicles(req, res));
router.post('/', requireAuth, validateBody(createVehicleBodySchema), (req, res) =>
  vehicleController.createMyVehicle(req, res)
);
router.patch(
  '/:vehicleId',
  requireAuth,
  validateParams(vehicleIdParamSchema),
  validateBody(updateMyVehicleBodySchema),
  (req, res) => vehicleController.updateMyVehicle(req, res)
);
router.delete('/:vehicleId', requireAuth, validateParams(vehicleIdParamSchema), (req, res) =>
  vehicleController.deleteMyVehicle(req, res)
);
router.patch('/:vehicleId/activate', requireAuth, validateParams(vehicleIdParamSchema), (req, res) =>
  vehicleController.activateMyVehicle(req, res)
);

export default router;
