import { getPool } from '../config/database';
import { DashboardStats, UserPublic } from '../types';

export async function getDashboardStats(): Promise<DashboardStats> {
  const pool = await getPool();

  const [usuarios, partidosJugados, partidosPendientes, predicciones, efectividad, ranking, masPredichos, porEstado] =
    await Promise.all([
      pool.query('SELECT COUNT(*) AS total FROM Usuarios'),
      pool.query("SELECT COUNT(*) AS total FROM Partidos WHERE Estado = 'Finalizado'"),
      pool.query("SELECT COUNT(*) AS total FROM Partidos WHERE Estado = 'Pendiente'"),
      pool.query('SELECT COUNT(*) AS total FROM Predicciones'),
      pool.query(`
        SELECT
          CASE WHEN COUNT(*) = 0 THEN 0
          ELSE CAST(SUM(CASE WHEN PuntosGanados > 0 THEN 1 ELSE 0 END) AS FLOAT) / COUNT(*) * 100
          END AS efectividad
        FROM Predicciones pr
        INNER JOIN Partidos p ON pr.PartidoId = p.Id
        WHERE p.Estado = 'Finalizado'
      `),
      pool.query(`
        SELECT Id, Nombre, Email, Rol, PuntosTotales, FechaRegistro
        FROM Usuarios
        ORDER BY PuntosTotales DESC, FechaRegistro ASC
        LIMIT 10
      `),
      pool.query(`
        SELECT
          p.Id AS PartidoId,
          p.EquipoLocal,
          p.EquipoVisitante,
          COUNT(pr.Id) AS TotalPredicciones
        FROM Partidos p
        LEFT JOIN Predicciones pr ON p.Id = pr.PartidoId
        GROUP BY p.Id, p.EquipoLocal, p.EquipoVisitante
        ORDER BY TotalPredicciones DESC
        LIMIT 5
      `),
      pool.query(`
        SELECT Estado, COUNT(*) AS Total
        FROM Partidos
        GROUP BY Estado
      `),
    ]);

  return {
    totalUsuarios: parseInt(usuarios.recordset[0].total, 10),
    partidosJugados: parseInt(partidosJugados.recordset[0].total, 10),
    partidosPendientes: parseInt(partidosPendientes.recordset[0].total, 10),
    totalPredicciones: parseInt(predicciones.recordset[0].total, 10),
    efectividadGlobal: Math.round((parseFloat(efectividad.recordset[0].efectividad) || 0) * 100) / 100,
    ranking: ranking.recordset as UserPublic[],
    partidosMasPredichos: masPredichos.recordset,
    partidosPorEstado: porEstado.recordset,
  };
}

export async function getConfig() {
  const pool = await getPool();
  const result = await pool.query(
    'SELECT * FROM Configuracion ORDER BY Id DESC LIMIT 1'
  );
  return result.recordset[0];
}

export async function updateConfig(puntosExacto: number, puntosGanador: number) {
  const pool = await getPool();
  const result = await pool.query(
    `UPDATE Configuracion
     SET PuntosResultadoExacto = $1,
         PuntosGanadorEmpate = $2,
         FechaActualizacion = now()
     WHERE Id = (SELECT Id FROM Configuracion ORDER BY Id DESC LIMIT 1)
     RETURNING *`,
    [puntosExacto, puntosGanador]
  );
  return result.recordset[0];
}

export async function listAdmins(): Promise<UserPublic[]> {
  const pool = await getPool();
  const result = await pool.query(`
    SELECT Id, Nombre, Email, Rol, PuntosTotales, FechaRegistro
    FROM Usuarios
    WHERE Rol = 'Admin'
    ORDER BY FechaRegistro ASC
  `);
  return result.recordset as UserPublic[];
}

export async function listUsers(): Promise<UserPublic[]> {
  const pool = await getPool();
  const result = await pool.query(`
    SELECT Id, Nombre, Email, Rol, PuntosTotales, FechaRegistro
    FROM Usuarios
    WHERE Rol = 'User'
    ORDER BY Nombre ASC
  `);
  return result.recordset as UserPublic[];
}

export async function promoteUserToAdmin(userId: number): Promise<UserPublic> {
  const pool = await getPool();

  const result = await pool.query(
    `UPDATE Usuarios
     SET Rol = 'Admin'
     WHERE Id = $1 AND Rol = 'User'
     RETURNING Id, Nombre, Email, Rol, PuntosTotales, FechaRegistro`,
    [userId]
  );

  if (result.recordset.length === 0) {
    const existing = await pool.query(
      'SELECT Rol FROM Usuarios WHERE Id = $1',
      [userId]
    );

    if (existing.recordset.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    throw new Error('El usuario ya es administrador');
  }

  return result.recordset[0] as UserPublic;
}
