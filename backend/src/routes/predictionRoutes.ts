import { Router } from 'express';
import * as predictionController from '../controllers/predictionController';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.get('/mine', verifyToken, predictionController.getMyPredictions);
router.post('/', verifyToken, predictionController.savePrediction);
router.get('/leaderboard', verifyToken, predictionController.getLeaderboard);

export default router;
