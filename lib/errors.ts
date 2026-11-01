/** Map any error thrown by the data layer to a safe JSON response. */
import { ConflictError, ValidationError } from './data';
import { DatabaseError, toDatabaseError } from './db';
import { jsonError } from './http';

export function routeError(error: unknown): Response {
  if (error instanceof ValidationError) return jsonError(error.message, 400, error.details);
  if (error instanceof ConflictError) return jsonError(error.message, 409);
  const db = error instanceof DatabaseError ? error : toDatabaseError(error);
  return jsonError(db.message, db.status);
}
