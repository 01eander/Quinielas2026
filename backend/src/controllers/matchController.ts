import { Request, Response } from 'express';
import * as matchService from '../services/matchService';
import { MatchPhase } from '../types';
import { parseRouteParamId } from '../utils/routeParams';

export async function getMatches(req: Request, res: Response): Promise<void> {
  try {
    const { grupo, fase } = req.query;
    const matches = await matchService.getAllMatches({
      grupo: grupo as string | undefined,
      fase: fase as MatchPhase | undefined,
    });
    res.json(matches);
  } catch {
    res.status(500).json({ message: 'Error al obtener partidos' });
  }
}

export async function getMatch(req: Request, res: Response): Promise<void> {
  try {
    const match = await matchService.getMatchById(parseRouteParamId(req.params.id));
    if (!match) {
      res.status(404).json({ message: 'Partido no encontrado' });
      return;
    }
    res.json(match);
  } catch {
    res.status(500).json({ message: 'Error al obtener partido' });
  }
}

export async function getFilters(_req: Request, res: Response): Promise<void> {
  try {
    const [grupos, fases] = await Promise.all([
      matchService.getDistinctGroups(),
      matchService.getDistinctPhases(),
    ]);
    res.json({ grupos, fases });
  } catch {
    res.status(500).json({ message: 'Error al obtener filtros' });
  }
}

export async function createMatch(req: Request, res: Response): Promise<void> {
  try {
    const { equipoLocal, equipoVisitante, grupo, fase, fechaHora, estadioCiudad } = req.body;

    if (!equipoLocal || !equipoVisitante || !grupo || !fase || !fechaHora || !estadioCiudad) {
      res.status(400).json({ message: 'Todos los campos son requeridos' });
      return;
    }

    const match = await matchService.createMatch({
      equipoLocal,
      equipoVisitante,
      grupo,
      fase,
      fechaHora,
      estadioCiudad,
    });

    res.status(201).json(match);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear partido';
    res.status(400).json({ message });
  }
}

export async function updateScore(req: Request, res: Response): Promise<void> {
  try {
    const id = parseRouteParamId(req.params.id);
    const { golesLocal, golesVisitante } = req.body;

    if (golesLocal === undefined || golesVisitante === undefined) {
      res.status(400).json({ message: 'Goles local y visitante son requeridos' });
      return;
    }

    const match = await matchService.updateMatchScore(id, golesLocal, golesVisitante);
    res.json(match);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar marcador';
    res.status(400).json({ message });
  }
}
