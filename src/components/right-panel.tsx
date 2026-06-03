"use client";

import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { Search as SearchIcon, Settings } from "lucide-react";

export function RightPanel() {
  const lang = useStore((s) => s.language) as "ru" | "en";
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const navigate = useStore((s) => s.navigate);

  if (!isAuthenticated) return null;

  const trendingTopics = [
    { category: lang === "ru" ? "Технологии" : "Technology", topic: lang === "ru" ? "Искусственный интеллект" : "Artificial Intelligence", posts: lang === "ru" ? "12.5K постов" : "12.5K posts" },
    { category: lang === "ru" ? "Тренды" : "Trending", topic: lang === "ru" ? "#Создание" : "#Creative", posts: lang === "ru" ? "8.2K постов" : "8.2K posts" },
    { category: lang === "ru" ? "Наука" : "Science", topic: lang === "ru" ? "Космические исследования" : "Space Exploration", posts: lang === "ru" ? "5.1K постов" : "5.1K posts" },
    { category: lang === "ru" ? "Спорт" : "Sports", topic: lang === "ru" ? "Чемпионат мира" : "World Championship", posts: lang === "ru" ? "3.8K постов" : "3.8K posts" },
    { category: lang === "ru" ? "Музыка" : "Music", topic: lang === "ru" ? "Новый альбом" : "New Album", posts: lang === "ru" ? "2.4K постов" : "2.4K posts" },
  ];

  const whoToFollow = [
    { name: lang === "ru" ? "Алексей Петров" : "Alex Peterson", username: "alex_p", bio: lang === "ru" ? "Разработчик | Rust & TypeScript" : "Developer | Rust & TypeScript" },
    { name: lang === "ru" ? "Мария Козлова" : "Maria Kozlova", username: "maria_k", bio: lang === "ru" ? "UX/UI дизайнер" : "UX/UI Designer" },
    { name: lang === "ru" ? "Дмитрий Сидоров" : "David Miller", username: "david_m", bio: lang === "ru" ? "Фотограф и путешественник" : "Photographer & Traveler" },
  ];

  const footerLinks = lang === "ru"
    ? ["Условия сервиса", "Политика конфиденциальности", "Политика cookie", "Специальные возможности", "Информация о рекламе"]
    : ["Terms of Service", "Privacy Policy", "Cookie Policy", "Accessibility", "Ads info"];

  return (
    <aside className="hidden xl:block w-[350px] p-4 h-full overflow-y-auto">
      {/* Search Bar */}
      <div className="relative mb-4">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[var(--muted)]" />
        <input
          type="text"
          placeholder={t(lang, "search", "placeholder")}
          className="w-full pl-12 pr-4 py-3 rounded-full bg-[var(--input-bg)] border border-transparent text-[var(--fg)] placeholder:text-[var(--muted)] text-[15px] focus:outline-none focus:border-[var(--accent)] focus:bg-white dark:focus:bg-black focus:ring-0 transition-all duration-200"
          style={{ boxShadow: "none" }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const q = (e.target as HTMLInputElement).value.trim();
              if (q) navigate("search", { q });
            }
          }}
        />
      </div>

      {/* For You / Following Tabs */}
      <div className="flex mb-4 rounded-xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
        <button className="flex-1 py-3 text-center font-bold text-[15px] text-[var(--fg)] hover:bg-[var(--hover)] transition-colors">
          {t(lang, "rightPanel", "welcome")}
        </button>
        <button className="flex-1 py-3 text-center font-medium text-[15px] text-[var(--muted)] hover:bg-[var(--hover)] transition-colors">
          Following
        </button>
      </div>

      {/* What's happening - Trending */}
      <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] overflow-hidden mb-4">
        <h2 className="text-xl font-extrabold text-[var(--fg)] px-4 pt-3 pb-2">
          {lang === "ru" ? "Что нового" : "What's happening"}
        </h2>
        {trendingTopics.map((item, i) => (
          <button
            key={i}
            className="w-full text-left px-4 py-3 hover:bg-[var(--hover)] transition-colors"
          >
            <p className="text-[13px] text-[var(--muted)]">{item.category}</p>
            <p className="font-bold text-[15px] text-[var(--fg)] mt-0.5">{item.topic}</p>
            <p className="text-[13px] text-[var(--muted)] mt-0.5">{item.posts}</p>
          </button>
        ))}
        <button className="w-full text-left px-4 py-3 text-[15px] text-[var(--accent)] hover:bg-[var(--hover)] transition-colors border-t border-[var(--border)]">
          {lang === "ru" ? "Показать больше" : "Show more"}
        </button>
      </div>

      {/* Who to follow */}
      <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] overflow-hidden mb-4">
        <h2 className="text-xl font-extrabold text-[var(--fg)] px-4 pt-3 pb-2">
          {lang === "ru" ? "Кого читать" : "Who to follow"}
        </h2>
        {whoToFollow.map((person, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--hover)] transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {person.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-bold text-[15px] text-[var(--fg)] truncate">{person.name}</span>
              </div>
              <span className="text-[13px] text-[var(--muted)] truncate block">@{person.username}</span>
            </div>
            <button className="px-4 py-1.5 rounded-full bg-[var(--fg)] text-[var(--bg-primary)] font-bold text-[14px] hover:opacity-90 transition-colors flex-shrink-0">
              {lang === "ru" ? "Читать" : "Follow"}
            </button>
          </div>
        ))}
        <button className="w-full text-left px-4 py-3 text-[15px] text-[var(--accent)] hover:bg-[var(--hover)] transition-colors border-t border-[var(--border)]">
          {lang === "ru" ? "Показать больше" : "Show more"}
        </button>
      </div>

      {/* Footer Links */}
      <div className="px-4 py-3">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {footerLinks.map((link, i) => (
            <a key={i} href="#" className="text-[13px] text-[var(--muted)] hover:underline">
              {link}
            </a>
          ))}
        </div>
        <p className="text-[13px] text-[var(--muted)] mt-2">© 2025 Forhan</p>
      </div>
    </aside>
  );
}
