export function formatDbError(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return String(error);
  }

  const err = error as {
    message?: string;
    code?: string;
    detail?: string;
    hint?: string;
  };

  const parts: string[] = [];

  if (err.message) {
    parts.push(err.message);
  }

  if (err.code) {
    parts.push(`code=${err.code}`);
  }

  if (err.detail) {
    parts.push(`detail=${err.detail}`);
  }

  if (err.hint) {
    parts.push(`hint=${err.hint}`);
  }

  if (parts.length === 0) {
    try {
      return JSON.stringify(error, null, 2);
    } catch {
      return String(error);
    }
  }

  return parts.join(' | ');
}

export function getDbConnectionSummary(): string {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5433';
  const database = process.env.DB_NAME || 'QuinielaMundial2026';
  const user = process.env.DB_USER || 'postgres';

  return `host=${host}, port=${port}, database=${database}, user=${user}`;
}
