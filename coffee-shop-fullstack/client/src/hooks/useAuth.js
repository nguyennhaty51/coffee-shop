import { useState, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const TOKEN_KEY = "coffee_shop_token";

// Hook xác thực: đăng nhập, đăng xuất, tự khôi phục phiên khi tải lại trang
// (dựa vào token lưu ở localStorage — đây là dự án thật chạy trên máy người
// dùng, không phải artifact trong khung chat, nên dùng localStorage bình thường).
export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const restoreSession = useCallback(async (tk) => {
    if (!tk) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${tk}` } });
      if (!res.ok) throw new Error("Phiên đăng nhập đã hết hạn");
      const body = await res.json();
      setUser(body.user);
    } catch (e) {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(username, password) {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Đăng nhập thất bại");
      localStorage.setItem(TOKEN_KEY, body.token);
      setToken(body.token);
      setUser(body.user);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  function handleUnauthorized() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setError("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
  }

  return { token, user, loading, error, login, logout, handleUnauthorized, setError };
}
