// src/lib/api.js
// Use relative path /api for Vercel, or VITE_API_BASE_URL for local dev
const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export async function postJSON(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "POST Method Failed");
  return data;
}

export async function getJSON(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "GET Method Failed");
  return data;
}
