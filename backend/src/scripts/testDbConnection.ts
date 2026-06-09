import dotenv from 'dotenv';
import { closePool, getPool } from '../config/database';
import { formatDbError, getDbConnectionSummary } from '../utils/dbError';

dotenv.config();

async function testConnection() {
  console.log('Probando conexión a PostgreSQL...');
  console.log(getDbConnectionSummary());

  try {
    const pool = await getPool();
    const result = await pool.query('SELECT current_database() AS db, version() AS version');
    const row = result.recordset[0] as { db: string; version: string };

    console.log('\nConexión OK');
    console.log(`Base de datos activa: ${row.db}`);
    console.log(`PostgreSQL: ${row.version.split(',')[0]}`);
  } catch (error) {
    console.error('\nConexión FALLIDA');
    console.error(formatDbError(error));
    console.error('\nRevisa en backend\\.env:');
    console.error('- DB_HOST (ej. localhost)');
    console.error('- DB_PORT (ej. 5433)');
    console.error('- DB_USER y DB_PASSWORD (ej. postgres / postgrespassword)');
    console.error('- DB_NAME=QuinielaMundial2026');
    console.error('- Que la BD exista (se inicia automáticamente con docker-compose)');
    process.exitCode = 1;
  } finally {
    await closePool();
  }
}

testConnection();
