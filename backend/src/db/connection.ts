import fs from 'node:fs';
import path from 'node:path';
import { newDb } from 'pg-mem';
import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';
import { config } from '../config/index';

type PoolLike = {
  query: <T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]) => Promise<QueryResult<T>>;
  connect: () => Promise<PoolClient>;
};

const realPool = new Pool({
  connectionString: config.database.url,
});

realPool.on('error', (err: Error) => {
  console.error('Unexpected error on idle DB client', err);
});

let activePool: PoolLike | null = null;
let isInMemoryMode = false;
let switchingPromise: Promise<void> | null = null;

const isConnectionRefusedError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;
  const maybeError = error as { code?: string; errors?: Array<{ code?: string }> };
  if (maybeError.code === 'ECONNREFUSED') return true;
  if (Array.isArray(maybeError.errors)) {
    return maybeError.errors.some((entry) => entry?.code === 'ECONNREFUSED');
  }
  return false;
};

const resolveMigrationsDir = () => {
  const candidates = [
    path.join(process.cwd(), 'src', 'db', 'migrations'),
    path.join(process.cwd(), 'dist', 'db', 'migrations'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  throw new Error('Could not find migrations directory for database bootstrap');
};

const applyMigrationsToPool = async (pool: PoolLike) => {
  const migrationsDir = resolveMigrationsDir();
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of migrationFiles) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    await pool.query(sql);
  }
};

const switchToInMemoryPool = async () => {
  if (isInMemoryMode) return;
  if (switchingPromise) {
    await switchingPromise;
    return;
  }

  switchingPromise = (async () => {
    const db = newDb({
      autoCreateForeignKeyIndices: true,
    });
    const pgAdapter = db.adapters.createPg();
    const memoryPool = new pgAdapter.Pool();
    await applyMigrationsToPool(memoryPool as unknown as PoolLike);
    activePool = memoryPool as unknown as PoolLike;
    isInMemoryMode = true;
    console.warn('Primary PostgreSQL unavailable. Running in in-memory demo DB mode.');
  })();

  try {
    await switchingPromise;
  } finally {
    switchingPromise = null;
  }
};

const ensurePool = async () => {
  if (activePool) return activePool;

  try {
    await realPool.query('SELECT 1');
    activePool = realPool;
    return activePool;
  } catch (error) {
    if (isConnectionRefusedError(error)) {
      await switchToInMemoryPool();
      if (!activePool) {
        throw new Error('In-memory DB fallback initialization failed');
      }
      return activePool;
    }
    throw error;
  }
};

export const query = async <T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]) => {
  const start = Date.now();
  const pool = await ensurePool();

  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { duration, rows: res.rowCount, inMemory: isInMemoryMode });
    return res;
  } catch (error) {
    if (!isInMemoryMode && isConnectionRefusedError(error)) {
      await switchToInMemoryPool();
      if (!activePool) throw error;
      const res = await activePool.query<T>(text, params);
      const duration = Date.now() - start;
      console.log('Executed query (fallback)', { duration, rows: res.rowCount, inMemory: true });
      return res;
    }
    console.error('Database query error:', error);
    throw error;
  }
};

export const getClient = async () => {
  const pool = await ensurePool();
  return pool.connect();
};
