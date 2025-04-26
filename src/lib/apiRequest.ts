const BASE_URL = `${import.meta.env.VITE_EMAIL_SERVICE_URL}/api/email/graphql`;

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

