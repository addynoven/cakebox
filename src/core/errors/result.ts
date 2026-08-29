import { AppError, captureError } from './error-handler';

export type Result<T, E = AppError> =
  | { ok: true; data: T; error?: never }
  | { ok: false; error: E; data?: never };

export function ok<T>(data: T): Result<T, never> {
  return { ok: true, data };
}

export function err<E = AppError>(error: E): Result<never, E> {
  return { ok: false, error };
}

export async function wrapResult<T>(
  promise: Promise<T>,
  context = {}
): Promise<Result<T, AppError>> {
  try {
    const data = await promise;
    return ok(data);
  } catch (e) {
    const appError = captureError(e, context);
    return err(appError);
  }
}
