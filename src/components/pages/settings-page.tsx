"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { Save, Crown, ExternalLink } from "lucide-react";

const accentColors = [
  "#8639d2", "#e11d48", "#ea580c", "#d97706",
  "#16a34a", "#0891b2", "#1d9bf0", "#6366f1",
];

export function SettingsPage() {
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const navigate = useStore((s) => s.navigate);
  const lang = useStore((s) => s.language) as "ru" | "en";
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [theme, setTheme] = useState(user?.theme || "dark");
  const [accentColor, setAccentColor] = useState(user?.accentColor || "#8639d2");
  const [language, setLanguage] = useState(user?.language || "ru");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");

  useEffect(() => {
    fetch("/api/admin/payment-link")
      .then((r) => r.json())
      .then((d) => setPaymentLink(d.link || ""))
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          displayName,
          bio,
          theme,
          accentColor,
          language,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {}
    setSaving(false);
  };

  return (
    <div className="max-w-xl mx-auto border-x border-[var(--border)] min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)] px-4 py-3">
        <h1 className="text-xl font-bold text-[var(--fg)]">{t(lang, "settings", "title")}</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <section className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-4 space-y-4">
          <h2 className="font-semibold text-[var(--fg)]">{t(lang, "settings", "displaySection")}</h2>

          <div>
            <label className="block text-sm text-[var(--muted)] mb-1.5">
              {t(lang, "settings", "displayName")}
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--border)] text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--muted)] mb-1.5">
              {t(lang, "settings", "bio")}
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t(lang, "settings", "bioPlaceholder")}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--border)] text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
              rows={3}
              maxLength={200}
            />
          </div>
        </section>

        {/* Subscription Section */}
        <section className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-4 space-y-4">
          <h2 className="font-semibold text-[var(--fg)]">{t(lang, "settings", "subscriptionSection")}</h2>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-[var(--accent)]" />
              <div>
                <p className="text-sm font-medium text-[var(--fg)]">
                  {t(lang, "settings", "subscribedLabel")}
                </p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  {t(lang, "settings", "subscribedDesc")}
                </p>
              </div>
            </div>
            {user?.subscribed ? (
              <span className="px-3 py-1.5 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] text-sm font-medium">
                {t(lang, "settings", "subscribedLabel")}
              </span>
            ) : paymentLink ? (
              <a
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                {lang === "ru" ? "Купить подписку" : "Get Subscription"}
              </a>
            ) : (
              <span className="text-sm text-[var(--muted)]">—</span>
            )}
          </div>
        </section>

        {/* Appearance Section */}
        <section className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-4 space-y-4">
          <h2 className="font-semibold text-[var(--fg)]">{t(lang, "settings", "appearanceSection")}</h2>

          {/* Theme */}
          <div>
            <label className="block text-sm text-[var(--muted)] mb-2">
              {t(lang, "settings", "theme")}
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  theme === "light"
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "border-[var(--border)] text-[var(--fg)] hover:bg-[var(--hover)]"
                }`}
              >
                {t(lang, "settings", "themeLight")}
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  theme === "dark"
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "border-[var(--border)] text-[var(--fg)] hover:bg-[var(--hover)]"
                }`}
              >
                {t(lang, "settings", "themeDark")}
              </button>
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-sm text-[var(--muted)] mb-2">
              {t(lang, "settings", "accentColor")}
            </label>
            <div className="flex gap-2 flex-wrap">
              {accentColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setAccentColor(color)}
                  className={`w-10 h-10 rounded-full transition-transform ${
                    accentColor === color ? "scale-110 ring-2 ring-offset-2 ring-offset-[var(--card)]" : "hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: color,
                    ringColor: accentColor === color ? color : undefined,
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Language Section */}
        <section className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-4 space-y-4">
          <h2 className="font-semibold text-[var(--fg)]">{t(lang, "settings", "languageSection")}</h2>

          <div className="flex gap-3">
            <button
              onClick={() => setLanguage("ru")}
              className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                language === "ru"
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--fg)] hover:bg-[var(--hover)]"
              }`}
            >
              {t(lang, "settings", "ru")}
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                language === "en"
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--fg)] hover:bg-[var(--hover)]"
              }`}
            >
              {t(lang, "settings", "en")}
            </button>
          </div>
        </section>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-lg bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "..." : saved ? t(lang, "settings", "saved") : t(lang, "settings", "save")}
        </button>
      </div>
    </div>
  );
}
