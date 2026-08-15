import { Router } from 'express';
import { handleJanitorCleanup } from '../controllers/janitor.controller.js';

const router = Router();

router.post('/janitor-cleanup', handleJanitorCleanup);

export default router;
