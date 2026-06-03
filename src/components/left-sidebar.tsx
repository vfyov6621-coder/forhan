"use client";

import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { Home, Search, User, Settings, LogOut, Menu, Shield, MoreHorizontal } from "lucide-react";
import { UserAvatar } from "./user-avatar";
import { SubscribedBadge } from "./subscribed-badge";

export function LeftSidebar() {
  const { currentView, navigate, user, isAuthenticated, logout, toggle } = useStore();
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
    navItems.push(
      { id: "more", icon: MoreHorizontal, label: "More" }
    );
  }

  return (
    <aside className="hidden lg:flex flex-col h-full w-[68px] xl:w-[260px] border-r border-[var(--border)] p-2 xl:p-4 overflow-y-auto">
      {/* Logo */}
      <div className="xl:p-1 mb-1">
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-0 xl:gap-3 p-2 rounded-full hover:bg-[var(--hover)] transition-colors"
        >
          <div className="h-8 w-8 xl:h-9 xl:w-9 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-lg xl:text-xl flex-shrink-0">
            F
          </div>
          <span className="hidden xl:block text-xl font-bold text-[var(--fg)]">Forhan</span>
        </button>
      </div>

      {/* Nav Items - X.com pill style */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex items-center gap-3 xl:gap-5 px-0 xl:px-4 py-3 rounded-full transition-all duration-200 group ${
                isActive
                  ? "font-bold"
                  : "text-[var(--fg)] hover:bg-[var(--hover)]"
              }`}
              style={isActive ? { color: "var(--fg)" } : {}}
            >
              <div className="flex justify-center w-8">
                <item.icon className="h-6 w-6 xl:h-7 xl:w-7" style={isActive ? { strokeWidth: 2.5 } : {}} />
              </div>
              <span className="hidden xl:block text-xl">{item.label}</span>
            </button>
          );
        })}

        {/* Big Post Button */}
        <button className="mt-4 w-full rounded-full bg-[var(--accent)] text-white font-bold py-3 px-4 transition-all duration-200 hover:bg-[#1a8cd8] active:scale-[0.98] flex items-center justify-center">
          <span className="hidden xl:block text-[17px]">{t(lang, "composer", "post")}</span>
          <svg className="xl:hidden h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20V4" />
            <path d="M18 10L12 4L6 10" />
          </svg>
        </button>
      </nav>

      {/* User Card at Bottom */}
      {isAuthenticated && user && (
        <div className="mt-auto">
          <button
            onClick={() => navigate("profile")}
            className="flex items-center gap-2 xl:gap-3 p-2 rounded-full hover:bg-[var(--hover)] transition-colors w-full"
          >
            <UserAvatar username={user.username} displayName={user.displayName} size="md" />
            <div className="hidden xl:block flex-1 min-w-0 text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-[var(--fg)] truncate leading-tight">
                  {user.displayName}
                </span>
                {user.subscribed && <SubscribedBadge size="sm" />}
              </div>
              <span className="text-sm text-[var(--muted)] truncate block leading-tight">@{user.username}</span>
            </div>
            <svg className="hidden xl:block h-5 w-5 text-[var(--muted)] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
            </svg>
          </button>
        </div>
      )}
    </aside>
  );
}
