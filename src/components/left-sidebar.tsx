"use client";

import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { UserAvatar } from "./user-avatar";
import { SubscribedBadge } from "./subscribed-badge";

/* X.com-style SVG icons */
const Icons = {
  home: (
    <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="currentColor">
      <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h5.404a.93.93 0 00.929-.913v-7.075h3.476v7.075a.93.93 0 00.929.913h5.404a.93.93 0 00.929-.913V7.903c0-.301-.15-.584-.41-.757z"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="10.5" cy="10.5" r="7.5" />
      <path d="M16 16l4.5 4.5" strokeLinecap="round" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13L2 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  bookmark: (
    <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="currentColor">
      <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"/>
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  more: (
    <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="currentColor">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  ),
  feath: (
    <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="currentColor">
      <path d="M23 3c-6.62-.1-10.75 1.58-12.97 3.97-1.74 1.88-2.57 4.23-2.79 6.4.48 2.01 1.59 3.82 3.27 5.07 1.17.88 2.61 1.46 4.19 1.56-.12-.29-.2-.6-.2-.93 0-2.49 2.47-4.51 5.51-4.51.26 0 .52.01.77.03.08-.65.12-1.32.12-2 0-4.08-1.47-7.4-3.22-9.59"/>
    </svg>
  ),
};

export function LeftSidebar() {
  const { currentView, navigate, user, isAuthenticated, logout, toggle } = useStore();
  const lang = useStore((s) => s.language) as "ru" | "en";

  const navItems = [
    { id: "home", icon: Icons.home, label: t(lang, "nav", "home") },
    { id: "search", icon: Icons.search, label: t(lang, "nav", "search") },
    { id: "notifications", icon: Icons.bell, label: lang === "ru" ? "Уведомления" : "Notifications" },
    { id: "messages", icon: Icons.mail, label: lang === "ru" ? "Сообщения" : "Messages" },
    { id: "bookmarks", icon: Icons.bookmark, label: lang === "ru" ? "Закладки" : "Bookmarks" },
  ];

  if (isAuthenticated && user) {
    navItems.push(
      { id: "profile", icon: Icons.user, label: t(lang, "nav", "profile") },
      { id: "settings", icon: Icons.settings, label: t(lang, "nav", "settings") }
    );
    if (user.isAdmin) {
      navItems.push({ id: "admin", icon: Icons.shield, label: t(lang, "nav", "admin") });
    }
    navItems.push({ id: "more", icon: Icons.more, label: "Ещё" });
  }

  return (
    <aside className="hidden lg:flex flex-col h-screen w-[68px] xl:w-[275px] shrink-0 p-2 xl:pl-4 overflow-y-auto overflow-x-hidden">
      {/* Logo - F like X.com X logo */}
      <div className="mb-1 mt-1">
        <button
          onClick={() => navigate("home")}
          className="flex items-center justify-center xl:justify-start gap-3 p-3 rounded-full hover:bg-[var(--hover-secondary)] transition-colors"
        >
          <div className="h-[30px] w-[30px] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-full w-full" fill="currentColor" style={{ color: "var(--fg)" }}>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
          <span className="hidden xl:block text-xl font-bold" style={{ color: "var(--fg)" }}>
            Forhan
          </span>
        </button>
      </div>

      {/* Nav Items - X.com style */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`x-nav-item ${isActive ? "x-nav-item-active" : ""}`}
            >
              <div className="flex justify-center w-[52px] flex-shrink-0">
                {item.icon}
              </div>
              <span className="hidden xl:block truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Big Post Button - X.com style */}
        <button className="mt-4 w-[52px] xl:w-full rounded-full transition-colors flex items-center justify-center xl:justify-center" 
          style={{ 
            backgroundColor: "var(--fg)", 
            color: "var(--bg-primary)", 
            height: "52px"
          }}
          onMouseOver={(e) => { e.currentTarget.style.opacity = "0.9"; }}
          onMouseOut={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          <span className="hidden xl:block text-[17px] font-bold">
            {t(lang, "composer", "post")}
          </span>
          <svg className="xl:hidden h-[26px] w-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20V4" />
            <path d="M18 10L12 4L6 10" />
          </svg>
        </button>
      </nav>

      {/* User Card at Bottom - X.com style */}
      {isAuthenticated && user && (
        <div className="mt-auto pb-3">
          <button
            onClick={() => navigate("profile")}
            className="flex items-center gap-3 p-3 rounded-full hover:bg-[var(--hover-secondary)] transition-colors w-full"
          >
            <UserAvatar username={user.username} displayName={user.displayName} size="sm" />
            <div className="hidden xl:block flex-1 min-w-0 text-left">
              <div className="flex items-center gap-1">
                <span className="font-bold text-[15px] truncate" style={{ color: "var(--fg)" }}>
                  {user.displayName}
                </span>
                {user.subscribed && <SubscribedBadge size="sm" />}
              </div>
              <span className="text-[15px] truncate block" style={{ color: "var(--muted)" }}>
                @{user.username}
              </span>
            </div>
            <svg className="hidden xl:block h-[18px] w-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--muted)" }}>
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
        </div>
      )}
    </aside>
  );
}
