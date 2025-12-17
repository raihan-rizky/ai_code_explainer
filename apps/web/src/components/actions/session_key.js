// src/lib/sessionKey.js
export function getSessionKey() {
  let key = localStorage.getItem("session_key");
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem("session_key", key);
  }
  return key;
}
