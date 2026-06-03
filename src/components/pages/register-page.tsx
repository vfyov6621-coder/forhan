"use client";

import { useState } from "react";
import { useStore } from "@/store";
import { t } from "@/lib/translations";

export function RegisterPage() {
  const setUser = useStore((s) => s.setUser);
  const navigate = useStore((s) => s.navigate);
  const lang = useStore((s) => s.language) as "ru" | "en";
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot) return; // Bot detected
    if (password !== confirmPassword) {
      setError(t(lang, "auth", "passwordMismatch"));
      return;
    }
    if (!username.trim() || !displayName.trim() || !password) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          displayName: displayName.trim(),
          password,
          honeypot,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        navigate("home");
      } else {
        const data = await res.json();
        setError(data.error || t(lang, "errors", "somethingWentWrong"));
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
            {t(lang, "auth", "registerTitle")}
          </h2>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--fg)] mb-1.5">
                {t(lang, "auth", "username")}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--fg)] mb-1.5">
                {t(lang, "auth", "displayName")}
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
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

            <div>
              <label className="block text-sm font-medium text-[var(--fg)] mb-1.5">
                {t(lang, "auth", "confirmPassword")}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                required
              />
            </div>

            {/* Honeypot - hidden from real users */}
            <div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true">
              <input
                type="text"
                name={t(lang, "captcha", "honeypot")}
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
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
              {loading ? t(lang, "auth", "loading") : t(lang, "auth", "registerBtn")}
            </button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-sm text-[var(--muted)]">
              {t(lang, "auth", "hasAccount")}{" "}
              <button
                onClick={() => navigate("login")}
                className="text-[var(--accent)] hover:underline font-medium"
              >
                {t(lang, "nav", "login")}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
