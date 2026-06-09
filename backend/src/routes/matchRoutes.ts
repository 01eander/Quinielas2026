import { Router } from 'express';
import * as matchController from '../controllers/matchController';
import { verifyToken, isAdmin } from '../middleware/auth';

const router = Router();

router.get('/', verifyToken, matchController.getMatches);
router.get('/filters', verifyToken, matchController.getFilters);
router.get('/:id', verifyToken, matchController.getMatch);
router.post('/', verifyToken, isAdmin, matchController.createMatch);
router.put('/:id/score', verifyToken, isAdmin, matchController.updateScore);

export default router;
