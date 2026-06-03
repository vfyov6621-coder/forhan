"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { Search as SearchIcon } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { SubscribedBadge } from "@/components/subscribed-badge";

interface SearchResult {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  subscribed: boolean;
}

export function SearchPage() {
  const navigate = useStore((s) => s.navigate);
  const lang = useStore((s) => s.language) as "ru" | "en";
  const initialQuery = useStore((s) => s.viewParams.q) || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(!!initialQuery);

  const handleSearch = async (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/users?q=${encodeURIComponent(searchQuery.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.users || []);
      }
    } catch {}
    setSearching(false);
  };

  useEffect(() => {
    if (initialQuery) handleSearch(initialQuery);
  }, []);

  return (
    <div className="max-w-[600px] mx-auto border-x border-[var(--border)] min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)] px-4 py-3">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[var(--muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(lang, "search", "placeholder")}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-[var(--input-bg)] border border-transparent text-[15px] text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] focus:bg-white dark:focus:bg-black transition-all duration-200"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>
      </div>

      {/* Results */}
      <div>
        {searching ? (
          <div className="py-12 flex justify-center">
            <div className="h-6 w-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : searched && results.length === 0 ? (
          <div className="py-12 text-center">
            <h3 className="text-xl font-bold text-[var(--fg)] mb-2">
              {lang === "ru" ? "Ничего не найдено" : "No results found"}
            </h3>
            <p className="text-[15px] text-[var(--muted)]">{t(lang, "search", "noResults")}</p>
          </div>
        ) : (
          results.map((u) => (
            <button
              key={u.id}
              onClick={() => navigate("profile", { username: u.username })}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--hover)] transition-colors text-left border-b border-[var(--border)]"
            >
              <UserAvatar username={u.username} displayName={u.displayName} avatarUrl={u.avatarUrl} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-[15px] text-[var(--fg)] truncate">{u.displayName}</span>
                  {u.subscribed && <SubscribedBadge size="sm" />}
                </div>
                <span className="text-[15px] text-[var(--muted)]">@{u.username}</span>
              </div>
              <button
                className="px-4 py-1.5 rounded-full bg-[var(--fg)] text-[var(--bg-primary)] font-bold text-[14px] hover:opacity-90 transition-colors flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {lang === "ru" ? "Читать" : "Follow"}
              </button>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
