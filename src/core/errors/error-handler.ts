export type AppErrorContext = {
  source?: string;
  action?: string;
  metadata?: Record<string, unknown>;
};

export class AppError extends Error {
  public context?: AppErrorContext;

  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500,
    context: AppErrorContext = {}
  ) {
    super(message);
    this.name = 'AppError';
    this.context = context;
  }
}

const errorLog: AppError[] = [];

export function captureError(error: unknown, context: AppErrorContext = {}): AppError {
  let appError: AppError;

  if (error instanceof AppError) {
    appError = error;
    if (context) {
      appError.context = { ...appError.context, ...context };
    }
  } else if (error instanceof Error) {
    appError = new AppError(error.message, 'INTERNAL_ERROR', 500, {
      ...context,
      metadata: { stack: error.stack, ...(context.metadata || {}) },
    });
  } else {
    appError = new AppError(String(error || 'An unexpected error occurred'), 'UNEXPECTED_ERROR', 500, context);
  }

  errorLog.push(appError);
  console.error('[CakeBox AppError]', {
    code: appError.code,
    message: appError.message,
    context: appError.context,
  });

  return appError;
}

export function handleError(error: unknown, context: AppErrorContext = {}): AppError {
  return captureError(error, context);
}

export function getErrorLog(): AppError[] {
  return [...errorLog];
}

export function withErrorCatch<T>(
  action: () => T,
  context: AppErrorContext = {},
  onError?: (error: AppError) => void
): T | undefined {
  try {
    return action();
  } catch (error) {
    const appError = captureError(error, context);
    onError?.(appError);
    return undefined;
  }
}

export async function withAsyncErrorCatch<T>(
  action: () => Promise<T>,
  context: AppErrorContext = {},
  onError?: (error: AppError) => void
): Promise<T | undefined> {
  try {
    return await action();
  } catch (error) {
    const appError = captureError(error, context);
    onError?.(appError);
    return undefined;
  }
}
