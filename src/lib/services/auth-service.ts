import { apiRequest } from "@/lib/api";
import type { LoginRequest, LoginResponse } from "@/types";

/** POST /api/Auth/login */
export async function login(payload: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/api/Auth/login", {
    method: "POST",
    body: payload,
  });
}

// Cookie helpers — token stored in cookie so Next.js middleware can read it
const COOKIE_TOKEN = "auth_token";
const COOKIE_ROLE  = "auth_role";
const COOKIE_NAME  = "auth_name";

function setCookie(name: string, value: string, days = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function saveSession(data: LoginResponse) {
  setCookie(COOKIE_TOKEN, data.token);
  setCookie(COOKIE_ROLE,  data.role);
  setCookie(COOKIE_NAME,  data.fullName);
}

export function clearSession() {
  deleteCookie(COOKIE_TOKEN);
  deleteCookie(COOKIE_ROLE);
  deleteCookie(COOKIE_NAME);
}

export function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_TOKEN}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getRole(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_ROLE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

