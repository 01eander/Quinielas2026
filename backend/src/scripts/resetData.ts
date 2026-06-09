import { getPool, closePool } from '../config/database';

async function resetData() {
  const pool = await getPool();

  console.log('--- Estado actual ---');

  const before = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM Partidos WHERE Fase = 'Final') AS finales,
      (SELECT COUNT(*) FROM Partidos WHERE Estado = 'Finalizado') AS finalizados,
      (SELECT COUNT(*) FROM Partidos WHERE Estado = 'En Progreso') AS enprogreso,
      (SELECT COUNT(*) FROM Usuarios WHERE Rol <> 'Admin') AS usuariosnoadmin,
      (SELECT COUNT(*) FROM Predicciones) AS predicciones
  `);
  console.table(before.recordset);

  const finalMatches = await pool.query(`
    SELECT Id, EquipoLocal, EquipoVisitante, Fase, Estado, GolesLocal, GolesVisitante
    FROM Partidos
    WHERE Fase = 'Final'
  `);
  if (finalMatches.recordset.length > 0) {
    console.log('Partidos de Final a eliminar:', finalMatches.recordset);
  }

  const finalized = await pool.query(`
    SELECT Id, EquipoLocal, EquipoVisitante, Fase, Estado, GolesLocal, GolesVisitante
    FROM Partidos
    WHERE Estado IN ('Finalizado', 'En Progreso')
  `);
  if (finalized.recordset.length > 0) {
    console.log('Partidos a restablecer:', finalized.recordset);
  }

  console.log('\n--- Aplicando reset ---');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Predicciones del partido de prueba (Final)
    await client.query(`
      DELETE FROM Predicciones
      WHERE PartidoId IN (SELECT Id FROM Partidos WHERE Fase = 'Final')
    `);

    const deletedFinal = await client.query(`
      DELETE FROM Partidos
      WHERE Fase = 'Final'
      RETURNING Id, EquipoLocal, EquipoVisitante
    `);
    console.log(`Partidos Final eliminados: ${deletedFinal.recordset.length}`);

    const resetMatches = await client.query(`
      UPDATE Partidos
      SET Estado = 'Pendiente',
          GolesLocal = NULL,
          GolesVisitante = NULL
      WHERE Estado IN ('Finalizado', 'En Progreso')
      RETURNING Id, EquipoLocal, EquipoVisitante, Estado
    `);
    console.log(`Partidos restablecidos a Pendiente: ${resetMatches.recordset.length}`);

    await client.query(`
      UPDATE Predicciones SET PuntosGanados = 0
    `);

    const deletedUsers = await client.query(`
      DELETE FROM Usuarios
      WHERE Rol <> 'Admin'
      RETURNING Id, Email, Nombre
    `);
    console.log(`Usuarios eliminados (no admin): ${deletedUsers.recordset.length}`);

    await client.query(`
      UPDATE Usuarios SET PuntosTotales = 0 WHERE Rol = 'Admin'
    `);

    await client.query('COMMIT');
    console.log('\nReset completado.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  const after = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM Partidos) AS totalpartidos,
      (SELECT COUNT(*) FROM Partidos WHERE Fase = 'Final') AS finales,
      (SELECT COUNT(*) FROM Partidos WHERE Estado = 'Finalizado') AS finalizados,
      (SELECT COUNT(*) FROM Usuarios) AS usuarios,
      (SELECT COUNT(*) FROM Predicciones) AS predicciones
  `);
  console.log('\n--- Estado final ---');
  console.table(after.recordset);

  await closePool();
}

resetData().catch((error) => {
  console.error('Error en reset:', error);
  process.exit(1);
});
