import fs from 'node:fs';
import path from 'node:path';
import { query } from './connection';

async function run() {
  const migrationsDir = path.join(process.cwd(), 'src', 'db', 'migrations');
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of migrationFiles) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    await query(sql);
    console.log(`Applied migration: ${file}`);
  }

  console.log(`Migrations completed (${migrationFiles.length} files)`);
}

run().catch((error) => {
  console.error('Migration failed', error);
  process.exit(1);
});
