"use client";

import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { Home, Search, User, Settings, X, Shield, Bell, MessageSquare } from "lucide-react";
import { UserAvatar } from "./user-avatar";
import { SubscribedBadge } from "./subscribed-badge";

export function MobileNav() {
  const { currentView, navigate, user, isAuthenticated, isOpen, setOpen } = useStore();
  const lang = useStore((s) => s.language) as "ru" | "en";

  const bottomItems = [
    { id: "home", icon: Home },
    { id: "search", icon: Search },
    { id: "notifications", icon: Bell },
    { id: "messages", icon: MessageSquare },
  ];

  if (isAuthenticated && user) {
    bottomItems.push({ id: "profile", icon: User });
  }

  // Drawer nav items
  const drawerItems = [
    { id: "home", icon: Home, label: t(lang, "nav", "home") },
    { id: "search", icon: Search, label: t(lang, "nav", "search") },
    { id: "notifications", icon: Bell, label: lang === "ru" ? "Уведомления" : "Notifications" },
    { id: "messages", icon: MessageSquare, label: lang === "ru" ? "Сообщения" : "Messages" },
    { id: "bookmarks", icon: null, label: lang === "ru" ? "Закладки" : "Bookmarks" },
  ];

  if (isAuthenticated && user) {
    drawerItems.push(
      { id: "profile", icon: User, label: t(lang, "nav", "profile") },
      { id: "settings", icon: Settings, label: t(lang, "nav", "settings") }
    );
    if (user.isAdmin) {
      drawerItems.push({ id: "admin", icon: Shield, label: t(lang, "nav", "admin") });
    }
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ backgroundColor: "rgba(91, 112, 131, 0.4)" }} onClick={() => setOpen(false)} />
      )}

      {/* Slide-out Drawer - X.com style */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] z-50 transform transition-transform duration-200 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        {/* Close button */}
        <div className="flex items-center justify-start p-2 mt-1">
          <button onClick={() => setOpen(false)} className="p-2.5 rounded-full transition-colors"
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--hover-secondary)"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <X className="h-5 w-5" style={{ color: "var(--fg)" }} />
          </button>
        </div>

        {/* Logo */}
        <div className="px-4 py-3">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" style={{ color: "var(--fg)" }}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </div>

        <nav className="px-2 flex flex-col gap-0.5">
          {drawerItems.map((item) => {
            const isActive = currentView === item.id;
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.id);
                  setOpen(false);
                }}
                className="flex items-center gap-5 px-4 py-3 rounded-full transition-all duration-200"
                style={{ fontWeight: isActive ? 700 : 400 }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--hover-secondary)"; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                {IconComponent ? (
                  <IconComponent className="h-[26px] w-[26px]" style={isActive ? { strokeWidth: 2.5 } : {}} />
                ) : (
                  <div className="w-[26px] h-[26px] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                <span className="text-xl" style={{ color: "var(--fg)" }}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Post button in drawer */}
        {isAuthenticated && (
          <div className="px-3 mt-4">
            <button
              onClick={() => {
                navigate("home");
                setOpen(false);
              }}
              className="w-full rounded-full text-white font-bold py-3 text-[17px] transition-all duration-200"
              style={{ backgroundColor: "var(--fg)" }}
              onMouseOver={(e) => { e.currentTarget.style.opacity = "0.9"; }}
              onMouseOut={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              {t(lang, "composer", "post")}
            </button>
          </div>
        )}

        {/* User card at bottom */}
        {isAuthenticated && user && (
          <div className="absolute bottom-0 left-0 right-0 p-4" style={{ borderTop: `1px solid var(--border)` }}>
            <button
              onClick={() => {
                navigate("profile");
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2 rounded-full transition-colors"
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--hover-secondary)"; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <UserAvatar username={user.username} displayName={user.displayName} size="sm" />
              <div className="flex-1 min-w-0 text-left">
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
            </button>
          </div>
        )}
      </div>

      {/* Bottom Nav Bar - X.com style */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden" style={{ backgroundColor: "var(--bg-primary)", borderTop: `1px solid var(--border)` }}>
        <div className="flex items-center justify-around h-[50px]">
          {bottomItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className="flex items-center justify-center flex-1 py-1 transition-colors"
                style={{ color: currentView === item.id ? "var(--fg)" : "var(--muted)" }}
              >
                <IconComponent className="h-[26px] w-[26px]" style={currentView === item.id ? { strokeWidth: 2.5 } : {}} />
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
