import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getPool, closePool } from '../config/database';

dotenv.config();

async function seedSchema() {
  const sqlPath = path.resolve(__dirname, '../../../database/schema_pg.sql');
  const script = fs.readFileSync(sqlPath, 'utf-8');

  const pool = await getPool();

  console.log('Creando esquema de base de datos PostgreSQL...');
  await pool.query(script);

  console.log('Esquema de base de datos PostgreSQL creado con éxito.');
  await closePool();
}

seedSchema().catch((err) => {
  console.error('Error al crear el esquema:', err);
  process.exit(1);
});
