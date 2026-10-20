import type { z } from "zod";

/** An API error, parsed from ASP.NET ProblemDetails. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly fieldErrors: Record<string, string[]> = {},
  ) {
    super(message);
  }
}

type Options = { method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; body?: unknown };

/**
 * Calls the C# API through the Next rewrite (same origin, so the auth cookie is sent automatically).
 * Parses the response with `schema`; without one, the body is ignored.
 */
export async function apiFetch<S extends z.ZodType>(path: string, schema: S, options?: Options): Promise<z.infer<S>>;
export async function apiFetch(path: string, schema?: undefined, options?: Options): Promise<void>;
export async function apiFetch(path: string, schema?: z.ZodType, { method = "GET", body }: Options = {}) {
  const response = await fetch(path, {
    method,
    headers: {
      // The API rejects writes without this header (CSRF protection).
      "X-Requested-With": "fetch",
      ...(body !== undefined && { "Content-Type": "application/json" }),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    throw new ApiError(response.status, problem?.title ?? response.statusText, problem?.errors ?? {});
  }

  if (!schema || response.status === 204) return undefined;
  return schema.parse(await response.json());
}
