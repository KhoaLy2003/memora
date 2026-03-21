import { useAuthStore } from "@/store/authStore";
import i18n from "@/i18n";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchWithAuth<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = useAuthStore.getState().token;

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Set Accept-Language based on current i18n language
  headers.set("Accept-Language", i18n.language);
  // Always accept JSON so Spring Security returns 401/4xx instead of 302 Redirect to /login
  headers.set("Accept", "application/json");

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });


  if (!response.ok) {
    if (response.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login?error=session_expired";
    }
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }

  return response.json();
}
