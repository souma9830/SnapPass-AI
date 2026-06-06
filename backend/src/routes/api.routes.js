import express from 'express';
import authRoutes from './auth.routes.js';
import uploadRoutes from './upload.routes.js';
import imageRoutes from './image.routes.js';
import printRoutes from './print.routes.js';
import healthRoutes from './health.routes.js';

const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/upload', uploadRoutes);
apiRouter.use('/process', imageRoutes);
apiRouter.use('/print', printRoutes);
apiRouter.use('/health', healthRoutes);

export default apiRouter;
