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
    <div className="flex min-h-screen">
      {/* Left - Branding Area (hidden on mobile) */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-[var(--accent)] p-12">
        <div className="max-w-md text-center">
          <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-[var(--accent)] font-bold text-4xl mx-auto mb-8">
            F
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4">Forhan</h1>
          <p className="text-xl text-white/80 leading-relaxed">
            {lang === "ru"
              ? "Место, где происходят настоящие разговоры. Делитесь мыслями, общайтесь с миром."
              : "Where real conversations happen. Share your thoughts, connect with the world."}
          </p>
          <div className="mt-12 flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">10M+</p>
              <p className="text-white/60 text-sm">{lang === "ru" ? "Пользователей" : "Users"}</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">50M+</p>
              <p className="text-white/60 text-sm">{lang === "ru" ? "Постов" : "Posts"}</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">1M+</p>
              <p className="text-white/60 text-sm">{lang === "ru" ? "Подписок" : "Subscribers"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form Area */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--bg-primary)]">
        <div className="w-full max-w-[400px]">
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center justify-center mb-8">
            <div className="h-12 w-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-2xl">
              F
            </div>
          </div>

          <h2 className="text-3xl font-bold text-[var(--fg)] mb-8">
            {t(lang, "auth", "loginTitle")}
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3.5 rounded-lg bg-transparent border border-[var(--border)] text-[17px] text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--fg)] focus:ring-0 transition-colors"
                placeholder={t(lang, "auth", "username")}
                autoFocus
                required
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-lg bg-transparent border border-[var(--border)] text-[17px] text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--fg)] focus:ring-0 transition-colors"
                placeholder={t(lang, "auth", "password")}
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[var(--fg)] text-[var(--bg-primary)] text-[17px] font-bold hover:opacity-90 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-[var(--bg-primary)] border-t-transparent rounded-full animate-spin" />
              ) : (
                t(lang, "auth", "loginBtn")
              )}
            </button>
          </form>

          <div className="mt-6">
            <span className="text-[15px] text-[var(--fg)]">
              {t(lang, "auth", "noAccount")}{" "}
              <button
                onClick={() => navigate("register")}
                className="text-[var(--accent)] hover:underline"
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
