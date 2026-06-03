"use client";

import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { Home, Search, User, Settings, X, Shield, Bell, MessageSquare } from "lucide-react";
import { UserAvatar } from "./user-avatar";
import { SubscribedBadge } from "./subscribed-badge";

export function MobileNav() {
  const { currentView, navigate, user, isAuthenticated, logout, isOpen, setOpen } = useStore();
  const lang = useStore((s) => s.language) as "ru" | "en";

  const bottomItems = [
    { id: "home", icon: Home, label: t(lang, "nav", "home") },
    { id: "search", icon: Search, label: t(lang, "nav", "search") },
    { id: "notifications", icon: Bell, label: lang === "ru" ? "Уведомления" : "Notifications" },
    { id: "messages", icon: MessageSquare, label: lang === "ru" ? "Сообщения" : "Messages" },
  ];

  if (isAuthenticated && user) {
    bottomItems.push({ id: "profile", icon: User, label: t(lang, "nav", "profile") });
    if (user.isAdmin) {
      bottomItems.push({ id: "admin", icon: Shield, label: t(lang, "nav", "admin") });
    }
  }

  // Drawer nav items (more complete, like left sidebar)
  const drawerItems = [
    { id: "home", icon: Home, label: t(lang, "nav", "home") },
    { id: "search", icon: Search, label: t(lang, "nav", "search") },
    { id: "notifications", icon: Bell, label: lang === "ru" ? "Уведомления" : "Notifications" },
    { id: "messages", icon: MessageSquare, label: lang === "ru" ? "Сообщения" : "Messages" },
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
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Slide-out Drawer - X.com style */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-[var(--bg-primary)] z-50 transform transition-transform duration-200 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-[var(--hover)] transition-colors">
            <X className="h-5 w-5 text-[var(--fg)]" />
          </button>
        </div>

        <nav className="px-2 flex flex-col gap-0.5">
          {drawerItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.id);
                  setOpen(false);
                }}
                className={`flex items-center gap-5 px-4 py-3 rounded-full transition-all duration-200 ${
                  isActive
                    ? "font-bold"
                    : "text-[var(--fg)] hover:bg-[var(--hover)]"
                }`}
              >
                <item.icon className="h-7 w-7" style={isActive ? { strokeWidth: 2.5 } : {}} />
                <span className="text-xl">{item.label}</span>
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
              className="w-full rounded-full bg-[var(--accent)] text-white font-bold py-3 text-[17px] hover:bg-[#1a8cd8] transition-all duration-200"
            >
              {t(lang, "composer", "post")}
            </button>
          </div>
        )}

        {isAuthenticated && user && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--border)] p-4">
            <button
              onClick={() => {
                navigate("profile");
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2 rounded-full hover:bg-[var(--hover)] transition-colors"
            >
              <UserAvatar username={user.username} displayName={user.displayName} size="md" />
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[15px] text-[var(--fg)] truncate">
                    {user.displayName}
                  </span>
                  {user.subscribed && <SubscribedBadge size="sm" />}
                </div>
                <span className="text-[15px] text-[var(--muted)] truncate block">@{user.username}</span>
              </div>
              <svg className="h-5 w-5 text-[var(--muted)] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Nav Bar - X.com style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--bg-primary)] border-t border-[var(--border)] z-30 lg:hidden safe-area-bottom">
        <div className="flex items-center justify-around h-[50px]">
          {bottomItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                currentView === item.id
                  ? "text-[var(--fg)]"
                  : "text-[var(--muted)]"
              }`}
            >
              <item.icon className="h-[26px] w-[26px]" style={currentView === item.id ? { strokeWidth: 2.5 } : {}} />
            </button>
          ))}
          {/* 6th item if exists (admin) */}
          {bottomItems.length > 5 && (() => {
            const extraItem = bottomItems[5];
            const ExtraIcon = extraItem.icon;
            return (
              <button
                key={extraItem.id}
                onClick={() => navigate(extraItem.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                  currentView === extraItem.id
                    ? "text-[var(--fg)]"
                    : "text-[var(--muted)]"
                }`}
              >
                <ExtraIcon className="h-[26px] w-[26px]" style={currentView === extraItem.id ? { strokeWidth: 2.5 } : {}} />
              </button>
            );
          })()}
        </div>
      </nav>
    </>
  );
}
