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
        credentials: "include",
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
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="w-full max-w-[600px]">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" style={{ color: "var(--fg)" }}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </div>

        <h2 className="text-[31px] font-extrabold mb-8 leading-tight" style={{ color: "var(--fg)" }}>
          {t(lang, "auth", "loginTitle")}
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3.5 rounded-sm text-[17px] transition-colors"
              style={{
                backgroundColor: "transparent",
                color: "var(--fg)",
                border: `1px solid var(--border)`,
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
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
              className="w-full px-4 py-3.5 rounded-sm text-[17px] transition-colors"
              style={{
                backgroundColor: "transparent",
                color: "var(--fg)",
                border: `1px solid var(--border)`,
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
              placeholder={t(lang, "auth", "password")}
              required
            />
          </div>

          {error && (
            <p className="text-[15px]" style={{ color: "var(--danger)" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full text-[17px] font-bold transition-all duration-200 flex items-center justify-center disabled:opacity-50"
            style={{ backgroundColor: "var(--fg)", color: "var(--bg-primary)" }}
            onMouseOver={(e) => { e.currentTarget.style.opacity = "0.9"; }}
            onMouseOut={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--bg-primary)", borderTopColor: "transparent" }} />
            ) : (
              t(lang, "auth", "loginBtn")
            )}
          </button>
        </form>

        <div className="mt-6">
          <span className="text-[15px]" style={{ color: "var(--fg)" }}>
            {t(lang, "auth", "noAccount")}{" "}
            <button
              onClick={() => navigate("register")}
              className="font-bold transition-colors"
              style={{ color: "var(--accent)" }}
              onMouseOver={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
              onMouseOut={(e) => { e.currentTarget.style.textDecoration = "none"; }}
            >
              {t(lang, "nav", "register")}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
