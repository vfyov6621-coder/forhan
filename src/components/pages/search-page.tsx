"use client";

import { useState, useEffect, useCallback } from "react";
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
      const res = await fetch(`/api/users?q=${encodeURIComponent(searchQuery.trim())}`, { credentials: "include" });
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
    <div className="min-h-screen">
      {/* Header with search */}
      <div className="sticky top-0 z-10 px-4 py-3" style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px]" style={{ color: "var(--fg-secondary)" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(lang, "search", "placeholder")}
            className="w-full pl-12 pr-4 py-3 rounded-full text-[15px] transition-all duration-200"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--fg)",
              border: "1px solid transparent",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "transparent"; }}
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
            <div className="h-6 w-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
          </div>
        ) : searched && results.length === 0 ? (
          <div className="py-12 text-center">
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--fg)" }}>
              {lang === "ru" ? "Ничего не найдено" : "No results found"}
            </h3>
            <p className="text-[15px]" style={{ color: "var(--muted)" }}>{t(lang, "search", "noResults")}</p>
          </div>
        ) : (
          results.map((u) => (
            <button
              key={u.id}
              onClick={() => navigate("profile", { username: u.username })}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
              style={{ borderBottom: `1px solid var(--border)` }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--hover-secondary)"; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <UserAvatar username={u.username} displayName={u.displayName} avatarUrl={u.avatarUrl} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-[15px] truncate" style={{ color: "var(--fg)" }}>{u.displayName}</span>
                  {u.subscribed && <SubscribedBadge size="sm" />}
                </div>
                <span className="text-[15px]" style={{ color: "var(--muted)" }}>@{u.username}</span>
              </div>
              <button
                className="px-4 py-1.5 rounded-full font-bold text-[14px] flex-shrink-0 transition-colors"
                style={{ backgroundColor: "var(--fg)", color: "var(--bg-primary)" }}
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
