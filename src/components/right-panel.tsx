"use client";

import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { Search as SearchIcon } from "lucide-react";

export function RightPanel() {
  const lang = useStore((s) => s.language) as "ru" | "en";
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const navigate = useStore((s) => s.navigate);
  const user = useStore((s) => s.user);

  if (!isAuthenticated) return null;

  const trendingTopics = [
    { category: lang === "ru" ? "Технологии · Тренд" : "Technology · Trending", topic: lang === "ru" ? "Искусственный интеллект" : "Artificial Intelligence", posts: lang === "ru" ? "12.5K" : "12.5K" },
    { category: lang === "ru" ? "В мире · Тренд" : "World · Trending", topic: lang === "ru" ? "#Создание" : "#Creative", posts: lang === "ru" ? "8.2K" : "8.2K" },
    { category: lang === "ru" ? "Наука · Тренд" : "Science · Trending", topic: lang === "ru" ? "Космические исследования" : "Space Exploration", posts: lang === "ru" ? "5.1K" : "5.1K" },
    { category: lang === "ru" ? "Спорт" : "Sports", topic: lang === "ru" ? "Чемпионат мира" : "World Championship", posts: lang === "ru" ? "3.8K" : "3.8K" },
    { category: lang === "ru" ? "Музыка" : "Entertainment", topic: lang === "ru" ? "Новый альбом" : "New Album", posts: lang === "ru" ? "2.4K" : "2.4K" },
  ];

  const whoToFollow = [
    { name: lang === "ru" ? "Алексей Петров" : "Alex Peterson", username: "alex_p", bio: lang === "ru" ? "Разработчик | Rust & TypeScript" : "Developer | Rust & TypeScript" },
    { name: lang === "ru" ? "Мария Козлова" : "Maria Kozlova", username: "maria_k", bio: lang === "ru" ? "UX/UI дизайнер" : "UX/UI Designer" },
    { name: lang === "ru" ? "Дмитрий Сидоров" : "David Miller", username: "david_m", bio: lang === "ru" ? "Фотограф и путешественник" : "Photographer & Traveler" },
  ];

  const footerLinks = lang === "ru"
    ? ["Условия сервиса", "Политика конфиденциальности", "Политика cookie", "Специальные возможности", "Информация о рекламе", "Ещё ···"]
    : ["Terms of Service", "Privacy Policy", "Cookie Policy", "Accessibility", "Ads info", "More ···"];

  return (
    <aside className="hidden xl:flex flex-col w-[350px] shrink-0 h-screen px-6 py-2 overflow-y-auto overflow-x-hidden">
      {/* Search Bar - X.com style */}
      <div className="relative mb-4 mt-1">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px]" style={{ color: "var(--fg-secondary)" }} />
        <input
          type="text"
          placeholder={t(lang, "search", "placeholder")}
          className="w-full pl-12 pr-4 py-3 rounded-full text-[15px] transition-all duration-200"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--fg)",
            border: "1px solid transparent",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.backgroundColor = "var(--bg-primary)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.backgroundColor = "var(--input-bg)";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const q = (e.target as HTMLInputElement).value.trim();
              if (q) navigate("search", { q });
            }
          }}
        />
      </div>

      {/* Subscribe Banner - X.com Premium style */}
      <div className="rounded-2xl mb-4 overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="p-4">
          <h2 className="text-xl font-extrabold" style={{ color: "var(--fg)" }}>
            {lang === "ru" ? "Подпишитесь на Premium" : "Subscribe to Premium"}
          </h2>
          <p className="text-[15px] mt-1" style={{ color: "var(--fg-secondary)" }}>
            {lang === "ru" 
              ? "Подпишитесь, чтобы разблокировать новые функции и поддержать независимую работу Forhan."
              : "Subscribe to unlock new features and support independent work on Forhan."}
          </p>
          <button
            className="mt-3 w-full py-2.5 rounded-full font-bold text-[15px] transition-colors"
            style={{ backgroundColor: "var(--fg)", color: "var(--bg-primary)" }}
            onMouseOver={(e) => { e.currentTarget.style.opacity = "0.9"; }}
            onMouseOut={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            {lang === "ru" ? "Подписаться" : "Subscribe"}
          </button>
        </div>
      </div>

      {/* What&apos;s happening - Trending */}
      <div className="rounded-2xl overflow-hidden mb-4" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <h2 className="text-xl font-extrabold px-4 pt-3 pb-2" style={{ color: "var(--fg)" }}>
          {lang === "ru" ? "Что нового" : "What&apos;s happening"}
        </h2>
        {trendingTopics.map((item, i) => (
          <button
            key={i}
            className="w-full text-left px-4 py-3 transition-colors"
            style={{ color: "var(--fg)" }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--hover-secondary)"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <p className="text-[13px]" style={{ color: "var(--fg-secondary)" }}>{item.category}</p>
            <p className="font-bold text-[15px] mt-0.5">{item.topic}</p>
            <p className="text-[13px] mt-0.5" style={{ color: "var(--fg-secondary)" }}>
              {lang === "ru" ? `${item.posts} постов` : `${item.posts} posts`}
            </p>
          </button>
        ))}
        <button
          className="w-full text-left px-4 py-3 text-[15px] transition-colors"
          style={{ color: "var(--accent)", borderTop: `1px solid var(--border)` }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--hover-secondary)"; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          {lang === "ru" ? "Показать больше" : "Show more"}
        </button>
      </div>

      {/* Who to follow */}
      <div className="rounded-2xl overflow-hidden mb-4" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <h2 className="text-xl font-extrabold px-4 pt-3 pb-2" style={{ color: "var(--fg)" }}>
          {lang === "ru" ? "Кого читать" : "Who to follow"}
        </h2>
        {whoToFollow.map((person, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 transition-colors"
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--hover-secondary)"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: "var(--accent)", color: "white" }}
            >
              {person.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-bold text-[15px] truncate" style={{ color: "var(--fg)" }}>{person.name}</span>
              </div>
              <span className="text-[13px] truncate block" style={{ color: "var(--fg-secondary)" }}>@{person.username}</span>
            </div>
            <button
              className="px-4 py-1.5 rounded-full font-bold text-[14px] flex-shrink-0 transition-colors"
              style={{ backgroundColor: "var(--fg)", color: "var(--bg-primary)" }}
              onMouseOver={(e) => { e.currentTarget.style.opacity = "0.9"; }}
              onMouseOut={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              {lang === "ru" ? "Читать" : "Follow"}
            </button>
          </div>
        ))}
        <button
          className="w-full text-left px-4 py-3 text-[15px] transition-colors"
          style={{ color: "var(--accent)", borderTop: `1px solid var(--border)` }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--hover-secondary)"; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          {lang === "ru" ? "Показать больше" : "Show more"}
        </button>
      </div>

      {/* Footer Links - X.com style */}
      <div className="px-1 py-3">
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          {footerLinks.map((link, i) => (
            <a key={i} href="#" className="text-[13px] transition-colors" style={{ color: "var(--fg-secondary)" }}
              onMouseOver={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
              onMouseOut={(e) => { e.currentTarget.style.textDecoration = "none"; }}
            >
              {link}
            </a>
          ))}
        </div>
        <p className="text-[13px] mt-1" style={{ color: "var(--fg-secondary)" }}>© 2025 Forhan, Inc.</p>
      </div>
    </aside>
  );
}
