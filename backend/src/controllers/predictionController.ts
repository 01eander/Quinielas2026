import { Request, Response } from 'express';
import * as predictionService from '../services/predictionService';

export async function getMyPredictions(req: Request, res: Response): Promise<void> {
  try {
    const predictions = await predictionService.getPredictionsByUser(req.user!.userId);
    res.json(predictions);
  } catch {
    res.status(500).json({ message: 'Error al obtener predicciones' });
  }
}

export async function savePrediction(req: Request, res: Response): Promise<void> {
  try {
    const { partidoId, prediccionLocal, prediccionVisitante } = req.body;

    if (partidoId === undefined || prediccionLocal === undefined || prediccionVisitante === undefined) {
      res.status(400).json({ message: 'partidoId, prediccionLocal y prediccionVisitante son requeridos' });
      return;
    }

    if (prediccionLocal < 0 || prediccionVisitante < 0) {
      res.status(400).json({ message: 'Los goles no pueden ser negativos' });
      return;
    }

    const prediction = await predictionService.upsertPrediction(
      req.user!.userId,
      partidoId,
      prediccionLocal,
      prediccionVisitante
    );

    res.json(prediction);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al guardar predicción';
    res.status(400).json({ message });
  }
}

export async function getLeaderboard(_req: Request, res: Response): Promise<void> {
  try {
    const leaderboard = await predictionService.getLeaderboard();
    res.json(leaderboard);
  } catch {
    res.status(500).json({ message: 'Error al obtener tabla de posiciones' });
  }
}
