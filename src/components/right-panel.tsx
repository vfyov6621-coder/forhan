"use client";

import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { Search as SearchIcon } from "lucide-react";
import { useEffect } from "react";

export function RightPanel() {
  const lang = useStore((s) => s.language) as "ru" | "en";
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const navigate = useStore((s) => s.navigate);

  if (!isAuthenticated) return null;

  return (
    <aside className="hidden xl:block w-80 border-l border-[var(--border)] bg-[var(--bg-secondary)] p-4 h-full overflow-y-auto">
      {/* Search */}
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
        <input
          type="text"
          placeholder={t(lang, "search", "placeholder")}
          className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[var(--input-bg)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--muted)] text-sm focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const q = (e.target as HTMLInputElement).value.trim();
              if (q) navigate("search", { q });
            }
          }}
        />
      </div>

      {/* Welcome Card */}
      <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-4">
        <h3 className="font-bold text-[var(--fg)] mb-1">{t(lang, "rightPanel", "welcome")}</h3>
        <p className="text-sm text-[var(--muted)]">{t(lang, "rightPanel", "welcomeDesc")}</p>
      </div>
    </aside>
  );
}
