import { addBreadcrumb, getBreadcrumbs, Breadcrumb } from './breadcrumbs';

export type AppErrorContext = {
  source?: string;
  action?: string;
  metadata?: Record<string, unknown>;
  breadcrumbs?: Breadcrumb[];
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
    this.context = {
      ...context,
      breadcrumbs: context.breadcrumbs || getBreadcrumbs().slice(-10), // Last 10 crumbs attached
    };
  }
}

const errorLog: AppError[] = [];

export function captureError(error: unknown, context: AppErrorContext = {}): AppError {
  let appError: AppError;

  const currentBreadcrumbs = getBreadcrumbs().slice(-15);

  if (error instanceof AppError) {
    appError = error;
    if (context) {
      appError.context = { ...appError.context, ...context, breadcrumbs: currentBreadcrumbs };
    }
  } else if (error instanceof Error) {
    appError = new AppError(error.message, 'INTERNAL_ERROR', 500, {
      ...context,
      breadcrumbs: currentBreadcrumbs,
      metadata: { stack: error.stack, ...(context.metadata || {}) },
    });
  } else {
    appError = new AppError(
      String(error || 'An unexpected error occurred'),
      'UNEXPECTED_ERROR',
      500,
      { ...context, breadcrumbs: currentBreadcrumbs }
    );
  }

  errorLog.push(appError);

  // Automatically record this error event into the breadcrumb flight recorder
  addBreadcrumb('state', `🚨 Error Captured [${appError.code}]: ${appError.message}`, {
    source: appError.context?.source,
    action: appError.context?.action,
  });

  console.error('[CakeBox AppError with FlightRecorder]', {
    code: appError.code,
    message: appError.message,
    source: appError.context?.source,
    action: appError.context?.action,
    recentBreadcrumbs: appError.context?.breadcrumbs?.map(
      (b) => `[${b.timestamp.slice(11, 19)}] (${b.category}) ${b.message}`
    ),
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
