import { HttpError } from "@/lib/errors/http-error";

export type FetchOptions = RequestInit & {
  queryParams?: Record<string, unknown>;
};

export class BaseApi {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(baseUrl: string, defaultHeaders: HeadersInit = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = defaultHeaders;
  }

  private buildUrl(
    endpoint: string,
    queryParams?: Record<string, unknown>
  ): string {
    const normalizedBaseUrl = this.baseUrl.replace(/\/+$/, "");
    const normalizedEndpoint = endpoint.replace(/^\/+/, "");
    const url = new URL(`${normalizedBaseUrl}/${normalizedEndpoint}`);

    if (normalizedEndpoint === "") {
      url.pathname = url.pathname.replace(/\/$/, "");
    }

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  protected async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { queryParams, ...fetchOptions } = options;

    const url = this.buildUrl(endpoint, queryParams);
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...this.defaultHeaders,
        ...(fetchOptions.headers || {}),
      },
    });

    const responseBody = await this.getResponseBody(response);
    if (!response.ok) {
      throw new HttpError(
        `HTTP error! status: ${response.status} - ${response.statusText}`,
        {
          status: response.status,
          statusText: response.statusText,
          url,
          body: responseBody,
        }
      );
    }

    return responseBody;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async getResponseBody(response: Response): Promise<any> {
    const contentType = response.headers.get("Content-Type");
    if (contentType?.includes("application/json")) {
      return response.json();
    }

    return response.text();
  }
}
