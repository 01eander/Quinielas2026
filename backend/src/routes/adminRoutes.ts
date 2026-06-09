import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { verifyToken, isAdmin } from '../middleware/auth';

const router = Router();

router.get('/dashboard', verifyToken, isAdmin, adminController.getDashboard);
router.get('/config', verifyToken, isAdmin, adminController.getConfig);
router.put('/config', verifyToken, isAdmin, adminController.updateConfig);
router.get('/admins', verifyToken, isAdmin, adminController.listAdmins);
router.post('/admins', verifyToken, isAdmin, adminController.createAdmin);
router.get('/users', verifyToken, isAdmin, adminController.listUsers);
router.put('/users/:id/promote', verifyToken, isAdmin, adminController.promoteUser);
router.put('/users/:id/reset-password', verifyToken, isAdmin, adminController.resetUserPassword);
export default router;
