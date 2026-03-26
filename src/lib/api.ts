import type { ApiErrorResponse } from "@/types";

export type ApiErrorKind = "business" | "server" | "network" | "unknown";

export class ApiClientError extends Error {
  status: number;
  kind: ApiErrorKind;
  details?: string;

  constructor(message: string, status: number, kind: ApiErrorKind, details?: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.kind = kind;
    this.details = details;
  }
}

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: RequestMethod;
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

function inferErrorKind(status: number): ApiErrorKind {
  if (status === 400) return "business";
  if (status >= 500) return "server";
  return "unknown";
}

async function parseErrorBody(response: Response): Promise<ApiErrorResponse | null> {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;

  try {
    const body = (await response.json()) as ApiErrorResponse;
    return body;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers, signal } = options;

  try {
    const response = await fetch(path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal
    });

    if (!response.ok) {
      const errorBody = await parseErrorBody(response);
      const message = errorBody?.error || `Request failed with status ${response.status}`;
      const details = errorBody?.details;
      throw new ApiClientError(message, response.status, inferErrorKind(response.status), details);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new ApiClientError(error.message, 0, "network");
    }

    throw new ApiClientError("Unknown error occurred.", 0, "unknown");
  }
}
