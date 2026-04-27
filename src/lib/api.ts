import axios from "axios";

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) ||
  "https://organicbackend-ysyu.onrender.com";

const TOKEN_KEY = "nisarg_token";

export const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
export const setToken = (t: string | null) => {
  if (typeof window === "undefined") return;
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // Surface API error message if present
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Something went wrong";
    return Promise.reject(new Error(msg));
  }
);

// Helper to unwrap { success, data } payloads
export const unwrap = <T,>(res: { data: any }): T => {
  const body = res.data;
  if (body && typeof body === "object" && "data" in body) return body.data as T;
  return body as T;
};
