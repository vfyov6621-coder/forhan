"use client";

import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { Home, Search, User, Settings, X } from "lucide-react";
import { UserAvatar } from "./user-avatar";
import { SubscribedBadge } from "./subscribed-badge";

export function MobileNav() {
  const { currentView, navigate, user, isAuthenticated, logout, isOpen, setOpen } = useStore();
  const lang = useStore((s) => s.language) as "ru" | "en";

  const bottomItems = [
    { id: "home", icon: Home, label: t(lang, "nav", "home") },
    { id: "search", icon: Search, label: t(lang, "nav", "search") },
  ];

  if (isAuthenticated && user) {
    bottomItems.push(
      { id: "profile", icon: User, label: t(lang, "nav", "profile") },
      { id: "settings", icon: Settings, label: t(lang, "nav", "settings") }
    );
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-[var(--bg-secondary)] border-r border-[var(--border)] z-50 transform transition-transform lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold">
              F
            </div>
            <span className="font-bold text-[var(--fg)]">Forhan</span>
          </div>
          <button onClick={() => setOpen(false)} className="p-1 hover:bg-[var(--hover)] rounded">
            <X className="h-5 w-5 text-[var(--fg)]" />
          </button>
        </div>

        <nav className="p-4 flex flex-col gap-1">
          {bottomItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.id);
                setOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                currentView === item.id
                  ? "bg-[var(--accent)] text-white font-semibold"
                  : "text-[var(--fg)] hover:bg-[var(--hover)]"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {isAuthenticated && user && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--border)] p-4">
            <div className="flex items-center gap-3">
              <UserAvatar username={user.username} displayName={user.displayName} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-[var(--fg)] truncate">
                    {user.displayName}
                  </span>
                  {user.subscribed && <SubscribedBadge size="sm" />}
                </div>
                <span className="text-xs text-[var(--muted)] truncate">@{user.username}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="p-2 rounded-full hover:bg-[var(--hover)] text-[var(--muted)] hover:text-red-400 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)] border-t border-[var(--border)] z-30 lg:hidden">
        <div className="flex items-center justify-around h-14">
          {bottomItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center gap-0.5 p-2 transition-colors ${
                currentView === item.id
                  ? "text-[var(--accent)]"
                  : "text-[var(--muted)]"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
