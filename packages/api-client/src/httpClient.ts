const BASE_URL = "http://localhost:3000";

export const httpClient = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(BASE_URL + url, options);

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error(`HTTP request failed: ${error}`);
  }
};

export const get = async (url: string) => {
  return httpClient(url);
};

export const post = async (url: string, body: unknown) => {
  return httpClient(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
};
