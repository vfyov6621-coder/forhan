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
    fetch("/api/admin/payment-link", { credentials: "include" })
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
        body: JSON.stringify({ displayName, bio, theme, accentColor, language }),
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

  const sectionStyle: React.CSSProperties = { borderBottom: `1px solid var(--border)` };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-3" style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: `1px solid var(--border)` }}>
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("home")}
            className="p-1.5 rounded-full transition-colors -ml-2"
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--hover-secondary)"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--fg)" }}>
              <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold" style={{ color: "var(--fg)" }}>{t(lang, "settings", "title")}</h1>
        </div>
      </div>

      <div>
        {/* Profile Section */}
        <section className="p-4" style={sectionStyle}>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--fg)" }}>{t(lang, "settings", "displaySection")}</h2>
          <div className="flex flex-col gap-4">
            <div>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 text-[17px] transition-colors"
                style={{ backgroundColor: "transparent", color: "var(--fg)", border: `1px solid var(--border)` }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                placeholder={t(lang, "settings", "displayName")}
              />
            </div>
            <div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t(lang, "settings", "bioPlaceholder")}
                className="w-full px-4 py-3 text-[15px] resize-none transition-colors"
                style={{ backgroundColor: "transparent", color: "var(--fg)", border: `1px solid var(--border)` }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                rows={3}
                maxLength={200}
              />
            </div>
          </div>
        </section>

        {/* Subscription Section */}
        <section className="p-4" style={sectionStyle}>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--fg)" }}>{t(lang, "settings", "subscriptionSection")}</h2>
          <div className="flex items-center justify-between p-4 rounded-2xl transition-colors"
            style={{ border: `1px solid var(--border)` }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--hover-secondary)"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6" style={{ color: "var(--accent)" }} />
              <div>
                <p className="text-[15px] font-bold" style={{ color: "var(--fg)" }}>
                  {t(lang, "settings", "subscribedLabel")}
                </p>
                <p className="text-[13px] mt-0.5" style={{ color: "var(--muted)" }}>
                  {t(lang, "settings", "subscribedDesc")}
                </p>
              </div>
            </div>
            {user?.subscribed ? (
              <span className="px-4 py-1.5 rounded-full text-[15px] font-bold"
                style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}
              >
                {t(lang, "settings", "subscribedLabel")}
              </span>
            ) : paymentLink ? (
              <a
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2 rounded-full text-[15px] font-bold transition-colors"
                style={{ backgroundColor: "var(--fg)", color: "var(--bg-primary)" }}
              >
                <ExternalLink className="h-4 w-4" />
                {lang === "ru" ? "Купить подписку" : "Get Subscription"}
              </a>
            ) : (
              <span className="text-[15px]" style={{ color: "var(--muted)" }}>—</span>
            )}
          </div>
        </section>

        {/* Appearance Section */}
        <section className="p-4" style={sectionStyle}>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--fg)" }}>{t(lang, "settings", "appearanceSection")}</h2>

          <div className="mb-5">
            <p className="text-[15px] font-bold mb-2" style={{ color: "var(--fg)" }}>
              {t(lang, "settings", "theme")}
            </p>
            <div className="flex gap-2">
              {["light", "dark"].map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => setTheme(themeOption)}
                  className="px-5 py-2.5 rounded-full text-[15px] font-bold transition-colors"
                  style={
                    theme === themeOption
                      ? { backgroundColor: "var(--fg)", color: "var(--bg-primary)" }
                      : { border: `1px solid var(--border)`, color: "var(--fg)" }
                  }
                  onMouseOver={(e) => {
                    if (theme !== themeOption) e.currentTarget.style.backgroundColor = "var(--hover-secondary)";
                  }}
                  onMouseOut={(e) => {
                    if (theme !== themeOption) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {themeOption === "light" ? t(lang, "settings", "themeLight") : t(lang, "settings", "themeDark")}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[15px] font-bold mb-2" style={{ color: "var(--fg)" }}>
              {t(lang, "settings", "accentColor")}
            </p>
            <div className="flex gap-2 flex-wrap">
              {accentColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setAccentColor(color)}
                  className="w-10 h-10 rounded-full transition-transform"
                  style={{
                    backgroundColor: color,
                    transform: accentColor === color ? "scale(1.15)" : "scale(1)",
                    boxShadow: accentColor === color ? `0 0 0 3px var(--bg-primary), 0 0 0 5px ${color}` : "none",
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Language Section */}
        <section className="p-4" style={sectionStyle}>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--fg)" }}>{t(lang, "settings", "languageSection")}</h2>
          <div className="flex gap-2">
            {["ru", "en"].map((langOption) => (
              <button
                key={langOption}
                onClick={() => setLanguage(langOption)}
                className="px-5 py-2.5 rounded-full text-[15px] font-bold transition-colors"
                style={
                  language === langOption
                    ? { backgroundColor: "var(--fg)", color: "var(--bg-primary)" }
                    : { border: `1px solid var(--border)`, color: "var(--fg)" }
                }
                onMouseOver={(e) => {
                  if (language !== langOption) e.currentTarget.style.backgroundColor = "var(--hover-secondary)";
                }}
                onMouseOut={(e) => {
                  if (language !== langOption) e.currentTarget.style.backgroundColor = "transparent";
                }}
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
            className="w-full py-3 rounded-full text-white text-[15px] font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: saved ? "var(--success)" : "var(--accent)" }}
            onMouseOver={(e) => { if (!saved) e.currentTarget.style.backgroundColor = "var(--accent-hover)"; }}
            onMouseOut={(e) => { if (!saved) e.currentTarget.style.backgroundColor = saved ? "var(--success)" : "var(--accent)"; }}
          >
            <Save className="h-[18px] w-[18px]" />
            {saving ? "..." : saved ? t(lang, "settings", "saved") : t(lang, "settings", "save")}
          </button>
        </section>
      </div>
    </div>
  );
}
