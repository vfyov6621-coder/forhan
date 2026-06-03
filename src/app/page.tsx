"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { ThemeProvider } from "@/components/theme-provider";
import { LeftSidebar } from "@/components/left-sidebar";
import { RightPanel } from "@/components/right-panel";
import { MobileNav } from "@/components/mobile-nav";
import { HomePage } from "@/components/pages/home-page";
import { LoginPage } from "@/components/pages/login-page";
import { RegisterPage } from "@/components/pages/register-page";
import { ProfilePage } from "@/components/pages/profile-page";
import { SettingsPage } from "@/components/pages/settings-page";
import { SearchPage } from "@/components/pages/search-page";
import { PostDetailPage } from "@/components/pages/post-detail-page";
import { AdminPage } from "@/components/pages/admin-page";

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 flex items-center justify-center" style={{ color: "var(--fg)" }}>
          <svg viewBox="0 0 24 24" className="h-full w-full" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const currentView = useStore((s) => s.currentView);
  const setUser = useStore((s) => s.setUser);
  const navigate = useStore((s) => s.navigate);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            navigate("home");
          } else {
            navigate("login");
          }
        } else {
          navigate("login");
        }
      } catch {
        navigate("login");
      }
      setChecked(true);
    };
    checkAuth();
  }, []);

  if (!checked) return <LoadingScreen />;

  const renderView = () => {
    switch (currentView) {
      case "home":
        return <HomePage />;
      case "login":
        return <LoginPage />;
      case "register":
        return <RegisterPage />;
      case "profile":
        return <ProfilePage />;
      case "settings":
        return <SettingsPage />;
      case "admin":
        return <AdminPage />;
      case "search":
        return <SearchPage />;
      case "post":
        return <PostDetailPage />;
      default:
        return <LoadingScreen />;
    }
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
        <LeftSidebar />
        <main className="flex-1 min-w-0 max-w-[600px] mx-auto lg:mx-0 xl:max-w-none overflow-y-auto pb-14 lg:pb-0" style={{ borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>
          {renderView()}
        </main>
        <RightPanel />
        <MobileNav />
      </div>
    </ThemeProvider>
  );
}
