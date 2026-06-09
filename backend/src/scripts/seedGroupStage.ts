import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getPool, closePool } from '../config/database';

dotenv.config();

async function seedGroupStage() {
  const sqlPath = path.resolve(__dirname, '../../../database/seed_group_stage_2026_pg.sql');
  const script = fs.readFileSync(sqlPath, 'utf-8');

  const pool = await getPool();

  console.log('Insertando partidos de la fase de grupos...');
  await pool.query(script);

  const count = await pool.query(
    "SELECT COUNT(*) AS total FROM Partidos WHERE Fase = 'Fase de Grupos'"
  );

  console.log(`Fase de grupos actualizada: ${count.recordset[0].total} partidos`);
  await closePool();
}

seedGroupStage().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
