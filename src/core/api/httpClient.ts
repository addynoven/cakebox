import { AppError, captureError, err, ok, Result } from '../errors';

export interface HttpRequestOptions extends RequestInit {
  timeoutMs?: number;
  params?: Record<string, string | number | boolean>;
}

export class HttpClient {
  private static generateRequestId(): string {
    return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  }

  static async request<T = unknown>(
    url: string,
    options: HttpRequestOptions = {}
  ): Promise<Result<T, AppError>> {
    const requestId = this.generateRequestId();
    const timeoutMs = options.timeoutMs ?? 10000;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let fullUrl = url;
    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([k, v]) => {
        searchParams.append(k, String(v));
      });
      fullUrl = `${url}${url.includes('?') ? '&' : '?'}${searchParams.toString()}`;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
      ...((options.headers as Record<string, string>) || {}),
    };

    console.log(
      JSON.stringify({
        level: 'INFO',
        requestId,
        action: 'HTTP_REQUEST',
        method: options.method || 'GET',
        url: fullUrl,
      })
    );

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers,
        signal: controller.signal as any,
      });

      clearTimeout(timer);

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { statusText: response.statusText };
        }

        const appError = new AppError(
          errorData?.message || `HTTP Request failed with status ${response.status}`,
          `HTTP_${response.status}`,
          response.status,
          {
            source: 'HttpClient',
            action: 'request',
            metadata: { requestId, status: response.status, url: fullUrl, errorData },
          }
        );
        captureError(appError);
        return err(appError);
      }

      const data = (await response.json()) as T;
      return ok(data);
    } catch (e: any) {
      clearTimeout(timer);
      const isTimeout = e?.name === 'AbortError';
      const appError = new AppError(
        isTimeout ? `Request timed out after ${timeoutMs}ms` : e?.message || 'Network request failed',
        isTimeout ? 'HTTP_TIMEOUT' : 'HTTP_NETWORK_ERROR',
        isTimeout ? 408 : 500,
        {
          source: 'HttpClient',
          action: 'request',
          metadata: { requestId, isTimeout, url: fullUrl },
        }
      );
      captureError(appError);
      return err(appError);
    }
  }

  static get<T = unknown>(url: string, options?: HttpRequestOptions) {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  static post<T = unknown>(url: string, body?: unknown, options?: HttpRequestOptions) {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}
