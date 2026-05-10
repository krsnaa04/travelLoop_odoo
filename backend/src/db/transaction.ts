import type { QueryResultRow } from 'pg';
import { getClient } from './connection';

type QueryFn = <T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]) => Promise<{ rows: T[]; rowCount: number | null }>;

export const withTransaction = async <T>(fn: (query: QueryFn) => Promise<T>) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await fn((text, params) => client.query(text, params));
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
