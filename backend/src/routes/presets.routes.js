import { Router } from 'express';
import * as presetsController from '../controllers/presets.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', presetsController.getPresets);
router.get('/:id', presetsController.getPresetById);
router.post('/', authMiddleware, presetsController.createPreset);
router.put('/:id', authMiddleware, presetsController.updatePreset);
router.delete('/:id', authMiddleware, presetsController.deletePreset);

export default router;
