import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

async function handleResponse(res: Response, unauthorizedBehavior: UnauthorizedBehavior) {
  if (unauthorizedBehavior === "returnNull" && res.status === 401) {
    return null;
  }
  
  await throwIfResNotOk(res);
  return await res.json();
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Handle proxy API specifically to append URL parameter
    if (typeof queryKey[0] === 'string' && queryKey[0] === '/api/proxy' && queryKey[1]) {
      const encodedUrl = encodeURIComponent(queryKey[1] as string);
      const url = `${queryKey[0]}?url=${encodedUrl}`;
      const res = await fetch(url, {
        credentials: "include",
      });
      return handleResponse(res, unauthorizedBehavior);
    }
    
    // Handle other API calls normally
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
