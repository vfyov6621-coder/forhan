"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { Save, Crown, ExternalLink } from "lucide-react";

const accentColors = [
  "#1d9bf0", "#e11d48", "#ea580c", "#d97706",
  "#16a34a", "#0891b2", "#6366f1", "#8639d2",
];

export function SettingsPage() {
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const navigate = useStore((s) => s.navigate);
  const lang = useStore((s) => s.language) as "ru" | "en";
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [theme, setTheme] = useState(user?.theme || "dark");
  const [accentColor, setAccentColor] = useState(user?.accentColor || "#1d9bf0");
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
    <div className="max-w-[600px] mx-auto border-x border-[var(--border)] min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("home")}
            className="p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors -ml-2"
          >
            <svg className="h-5 w-5 text-[var(--fg)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-[var(--fg)]">{t(lang, "settings", "title")}</h1>
        </div>
      </div>

      <div className="divide-y divide-[var(--border)]">
        {/* Profile Section */}
        <section className="p-4">
          <h2 className="text-xl font-bold text-[var(--fg)] mb-4">{t(lang, "settings", "displaySection")}</h2>

          <div className="flex flex-col gap-4">
            <div>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-[var(--border)] text-[17px] text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                placeholder={t(lang, "settings", "displayName")}
              />
            </div>

            <div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t(lang, "settings", "bioPlaceholder")}
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-[var(--border)] text-[15px] text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
                rows={3}
                maxLength={200}
              />
            </div>
          </div>
        </section>

        {/* Subscription Section */}
        <section className="p-4">
          <h2 className="text-xl font-bold text-[var(--fg)] mb-4">{t(lang, "settings", "subscriptionSection")}</h2>

          <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] hover:bg-[var(--hover)] transition-colors">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-[var(--accent)]" />
              <div>
                <p className="text-[15px] font-bold text-[var(--fg)]">
                  {t(lang, "settings", "subscribedLabel")}
                </p>
                <p className="text-[13px] text-[var(--muted)] mt-0.5">
                  {t(lang, "settings", "subscribedDesc")}
                </p>
              </div>
            </div>
            {user?.subscribed ? (
              <span className="px-4 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[15px] font-bold">
                {t(lang, "settings", "subscribedLabel")}
              </span>
            ) : paymentLink ? (
              <a
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--fg)] text-[var(--bg-primary)] text-[15px] font-bold hover:opacity-90 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                {lang === "ru" ? "Купить подписку" : "Get Subscription"}
              </a>
            ) : (
              <span className="text-[15px] text-[var(--muted)]">—</span>
            )}
          </div>
        </section>

        {/* Appearance Section */}
        <section className="p-4">
          <h2 className="text-xl font-bold text-[var(--fg)] mb-4">{t(lang, "settings", "appearanceSection")}</h2>

          {/* Theme */}
          <div className="mb-5">
            <p className="text-[15px] font-bold text-[var(--fg)] mb-2">
              {t(lang, "settings", "theme")}
            </p>
            <div className="flex gap-2">
              {["light", "dark"].map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => setTheme(themeOption)}
                  className={`px-5 py-2.5 rounded-full text-[15px] font-bold transition-colors ${
                    theme === themeOption
                      ? "bg-[var(--fg)] text-[var(--bg-primary)]"
                      : "border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--hover)]"
                  }`}
                >
                  {themeOption === "light" ? t(lang, "settings", "themeLight") : t(lang, "settings", "themeDark")}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <p className="text-[15px] font-bold text-[var(--fg)] mb-2">
              {t(lang, "settings", "accentColor")}
            </p>
            <div className="flex gap-2 flex-wrap">
              {accentColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setAccentColor(color)}
                  className={`w-10 h-10 rounded-full transition-transform ${
                    accentColor === color ? "scale-110 ring-4 ring-offset-2 ring-offset-[var(--bg-primary)]" : "hover:scale-105"
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
        <section className="p-4">
          <h2 className="text-xl font-bold text-[var(--fg)] mb-4">{t(lang, "settings", "languageSection")}</h2>

          <div className="flex gap-2">
            {["ru", "en"].map((langOption) => (
              <button
                key={langOption}
                onClick={() => setLanguage(langOption)}
                className={`px-5 py-2.5 rounded-full text-[15px] font-bold transition-colors ${
                  language === langOption
                    ? "bg-[var(--fg)] text-[var(--bg-primary)]"
                    : "border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--hover)]"
                }`}
              >
                {langOption === "ru" ? t(lang, "settings", "ru") : t(lang, "settings", "en")}
              </button>
            ))}
          </div>
        </section>

        {/* Save Button */}
        <section className="p-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-full bg-[var(--accent)] text-white text-[15px] font-bold hover:bg-[#1a8cd8] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="h-[18px] w-[18px]" />
            {saving ? "..." : saved ? t(lang, "settings", "saved") : t(lang, "settings", "save")}
          </button>
        </section>
      </div>
    </div>
  );
}
