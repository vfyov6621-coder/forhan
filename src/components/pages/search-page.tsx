"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { Search as SearchIcon, ArrowLeft } from "lucide-react";
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
    <div className="max-w-xl mx-auto border-x border-[var(--border)] min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate("home")}
          className="p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-[var(--fg)]" />
        </button>
        <h1 className="text-xl font-bold text-[var(--fg)]">{t(lang, "search", "title")}</h1>
      </div>

      {/* Search Input */}
      <div className="p-4">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(lang, "search", "placeholder")}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-[var(--input-bg)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>
      </div>

      {/* Results */}
      <div className="px-4">
        {searching ? (
          <div className="py-8 flex justify-center">
            <div className="h-6 w-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : searched && results.length === 0 ? (
          <div className="py-8 text-center text-[var(--muted)]">
            {t(lang, "search", "noResults")}
          </div>
        ) : (
          results.map((u) => (
            <button
              key={u.id}
              onClick={() => navigate("profile", { username: u.username })}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--hover)] transition-colors text-left mb-1"
            >
              <UserAvatar username={u.username} displayName={u.displayName} avatarUrl={u.avatarUrl} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[var(--fg)] truncate">{u.displayName}</span>
                  {u.subscribed && <SubscribedBadge size="sm" />}
                </div>
                <span className="text-sm text-[var(--muted)]">@{u.username}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
