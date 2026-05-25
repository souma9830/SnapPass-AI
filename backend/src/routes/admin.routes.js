import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import * as adminController from "../controllers/admin.controller.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/stats", adminController.getStats);
router.get("/uploads", adminController.getUploads);
router.delete("/uploads/:id", adminController.deleteUpload);
router.get("/settings", adminController.getSettings);
router.put("/settings", adminController.updateSettings);
router.get("/users", adminController.getUsers);

export default router;

