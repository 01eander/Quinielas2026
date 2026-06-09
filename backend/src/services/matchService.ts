import { getPool } from '../config/database';
import { Match, MatchPhase } from '../types';

export async function getAllMatches(filters?: {
  grupo?: string;
  fase?: MatchPhase;
}): Promise<Match[]> {
  const pool = await getPool();
  let query = 'SELECT * FROM Partidos WHERE 1=1';
  const params: any[] = [];

  if (filters?.grupo) {
    params.push(filters.grupo);
    query += ` AND Grupo = $${params.length}`;
  }

  if (filters?.fase) {
    params.push(filters.fase);
    query += ` AND Fase = $${params.length}`;
  }

  query += ' ORDER BY FechaHora ASC';

  const result = await pool.query(query, params);
  return result.recordset;
}

export async function getMatchById(id: number): Promise<Match | null> {
  const pool = await getPool();
  const result = await pool.query('SELECT * FROM Partidos WHERE Id = $1', [id]);
  return result.recordset[0] || null;
}

export async function createMatch(data: {
  equipoLocal: string;
  equipoVisitante: string;
  grupo: string;
  fase: MatchPhase;
  fechaHora: string;
  estadioCiudad: string;
}): Promise<Match> {
  const pool = await getPool();

  const result = await pool.query(
    `INSERT INTO Partidos (EquipoLocal, EquipoVisitante, Grupo, Fase, FechaHora, EstadioCiudad)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.equipoLocal,
      data.equipoVisitante,
      data.grupo,
      data.fase,
      new Date(data.fechaHora),
      data.estadioCiudad
    ]
  );

  return result.recordset[0];
}

export async function updateMatchScore(
  id: number,
  golesLocal: number,
  golesVisitante: number
): Promise<Match> {
  const pool = await getPool();

  const result = await pool.query(
    `UPDATE Partidos
     SET GolesLocal = $1,
         GolesVisitante = $2,
         Estado = 'Finalizado'
     WHERE Id = $3
     RETURNING *`,
    [golesLocal, golesVisitante, id]
  );

  if (result.recordset.length === 0) {
    throw new Error('Partido no encontrado');
  }

  await pool.query('CALL sp_CalcularPuntosPartido($1)', [id]);

  return result.recordset[0];
}

export async function getDistinctGroups(): Promise<string[]> {
  const pool = await getPool();
  const result = await pool.query(
    'SELECT DISTINCT Grupo FROM Partidos ORDER BY Grupo'
  );
  return result.recordset.map((r: { Grupo: string }) => r.Grupo);
}

export async function getDistinctPhases(): Promise<string[]> {
  const pool = await getPool();
  const result = await pool.query(
    'SELECT DISTINCT Fase FROM Partidos ORDER BY Fase'
  );
  return result.recordset.map((r: { Fase: string }) => r.Fase);
}
