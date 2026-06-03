"use client";

import { useState } from "react";
import { useStore } from "@/store";
import { t } from "@/lib/translations";

export function LoginPage() {
  const setUser = useStore((s) => s.setUser);
  const navigate = useStore((s) => s.navigate);
  const lang = useStore((s) => s.language) as "ru" | "en";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        navigate("home");
      } else {
        const data = await res.json();
        setError(data.error || t(lang, "auth", "loginError"));
      }
    } catch {
      setError(t(lang, "errors", "networkError"));
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-2xl">
            F
          </div>
          <h1 className="text-3xl font-bold text-[var(--fg)]">Forhan</h1>
        </div>

        <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-6">
          <h2 className="text-2xl font-bold text-[var(--fg)] mb-6 text-center">
            {t(lang, "auth", "loginTitle")}
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--fg)] mb-1.5">
                {t(lang, "auth", "username")}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                placeholder="F"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--fg)] mb-1.5">
                {t(lang, "auth", "password")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition-colors disabled:opacity-50"
            >
              {loading ? t(lang, "auth", "loading") : t(lang, "auth", "loginBtn")}
            </button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-sm text-[var(--muted)]">
              {t(lang, "auth", "noAccount")}{" "}
              <button
                onClick={() => navigate("register")}
                className="text-[var(--accent)] hover:underline font-medium"
              >
                {t(lang, "nav", "register")}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
