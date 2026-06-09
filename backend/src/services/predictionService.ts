import { getPool } from '../config/database';
import { Prediction, PredictionWithMatch } from '../types';

export async function getPredictionsByUser(userId: number): Promise<PredictionWithMatch[]> {
  const pool = await getPool();

  const result = await pool.query(
    `SELECT
       pr.*,
       p.EquipoLocal, p.EquipoVisitante, p.Grupo, p.Fase,
       p.FechaHora, p.GolesLocal, p.GolesVisitante, p.Estado
     FROM Predicciones pr
     INNER JOIN Partidos p ON pr.PartidoId = p.Id
     WHERE pr.UsuarioId = $1
     ORDER BY p.FechaHora ASC`,
    [userId]
  );

  return result.recordset;
}

export async function upsertPrediction(
  userId: number,
  partidoId: number,
  prediccionLocal: number,
  prediccionVisitante: number
): Promise<Prediction> {
  const pool = await getPool();

  const matchResult = await pool.query(
    'SELECT FechaHora, Estado FROM Partidos WHERE Id = $1',
    [partidoId]
  );

  if (matchResult.recordset.length === 0) {
    throw new Error('Partido no encontrado');
  }

  const match = matchResult.recordset[0];
  const now = new Date();
  const matchDate = new Date(match.FechaHora);

  if (match.Estado !== 'Pendiente' || now >= matchDate) {
    throw new Error('No se puede modificar la predicción: el partido ya comenzó o finalizó');
  }

  const result = await pool.query(
    `INSERT INTO Predicciones (UsuarioId, PartidoId, PrediccionLocal, PrediccionVisitante, FechaModificacion)
     VALUES ($1, $2, $3, $4, now())
     ON CONFLICT (UsuarioId, PartidoId)
     DO UPDATE SET
       PrediccionLocal = EXCLUDED.PrediccionLocal,
       PrediccionVisitante = EXCLUDED.PrediccionVisitante,
       FechaModificacion = now()
     RETURNING *`,
    [userId, partidoId, prediccionLocal, prediccionVisitante]
  );

  return result.recordset[0];
}

export async function getLeaderboard(): Promise<
  Array<{ Id: number; Nombre: string; PuntosTotales: number; Posicion: number }>
> {
  const pool = await getPool();

  const result = await pool.query(`
    SELECT
      Id, Nombre, PuntosTotales,
      ROW_NUMBER() OVER (ORDER BY PuntosTotales DESC, FechaRegistro ASC) AS Posicion
    FROM Usuarios
    WHERE Nombre <> 'Administrador'
    ORDER BY PuntosTotales DESC, FechaRegistro ASC
  `);

  return result.recordset;
}
