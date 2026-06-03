"use client";

import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { Home, Search, User, Settings, LogOut, Menu, Shield } from "lucide-react";
import { UserAvatar } from "./user-avatar";
import { SubscribedBadge } from "./subscribed-badge";

export function LeftSidebar() {
  const { currentView, navigate, user, isAuthenticated, logout } = useStore();
  const lang = useStore((s) => s.language) as "ru" | "en";

  const navItems = [
    { id: "home", icon: Home, label: t(lang, "nav", "home") },
    { id: "search", icon: Search, label: t(lang, "nav", "search") },
  ];

  if (isAuthenticated && user) {
    navItems.push(
      { id: "profile", icon: User, label: t(lang, "nav", "profile") },
      { id: "settings", icon: Settings, label: t(lang, "nav", "settings") }
    );
    if (user.isAdmin) {
      navItems.push(
        { id: "admin", icon: Shield, label: t(lang, "nav", "admin") }
      );
    }
  }

  return (
    <aside className="hidden lg:flex flex-col h-full w-64 xl:w-72 border-r border-[var(--border)] bg-[var(--bg-secondary)] p-4">
      {/* Logo */}
      <button
        onClick={() => navigate("home")}
        className="flex items-center gap-3 mb-6 p-2 hover:bg-[var(--hover)] rounded-lg transition-colors"
      >
        <div className="h-10 w-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-xl">
          F
        </div>
        <span className="text-xl font-bold text-[var(--fg)]">Forhan</span>
      </button>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
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

      {/* User Card */}
      {isAuthenticated && user && (
        <div className="border-t border-[var(--border)] pt-4 mt-4">
          <div className="flex items-center gap-3 p-2 hover:bg-[var(--hover)] rounded-lg transition-colors">
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
              onClick={() => logout()}
              className="p-2 rounded-full hover:bg-[var(--hover)] text-[var(--muted)] hover:text-red-400 transition-colors"
              title={t(lang, "nav", "logout")}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
