import { config } from "./config";

type Method = "GET" | "POST" | "PUT" | "PATCH";

type RequestOptions = {
  method?: Method;
  token?: string;
  body?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${config.apiUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store"
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.error?.message ?? "API request failed");
  }

  return json.data as T;
}