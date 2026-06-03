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
import type { UserState } from "@/store";

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-[#8639d2] flex items-center justify-center text-white font-bold text-3xl animate-pulse">
          F
        </div>
        <div className="h-1 w-16 rounded-full bg-[#8639d2]/30 overflow-hidden">
          <div className="h-full bg-[#8639d2] animate-[loading_1s_ease-in-out_infinite]" />
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
      <div className="flex h-screen overflow-hidden">
        <LeftSidebar />
        <main className="flex-1 overflow-y-auto pb-14 lg:pb-0">
          {renderView()}
        </main>
        <RightPanel />
        <MobileNav />
      </div>
    </ThemeProvider>
  );
}
