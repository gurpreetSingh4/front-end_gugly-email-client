import { QueryClient, QueryFunction } from "@tanstack/react-query";
import axios from "axios"

const BASE_URL = `${import.meta.env.VITE_EMAIL_SERVICE_URL}/api/email/graphql`
console.log(BASE_URL,'kkkk')

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}


export async function apiRequestAxios(
  method: string,
  url: string,
  data?: unknown
) {
  if(!url){
    return null;
  }
  const response = await axios({
    method,
    url,
    data,
  });
  return response;
}

export async function apiRequest(
  method: string = "GET",
  url: string,
  data?: any 
): Promise<Response> {
  const urlFull = `${BASE_URL}${url}`;
  console.log(urlFull)
  const res = await fetch(urlFull, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include"
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }
  return res;
}


type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
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
