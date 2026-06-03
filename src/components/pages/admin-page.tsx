"use client";

import { useState, useEffect, useCallback } from "react";
import { useStore } from "@/store";
import { t } from "@/lib/translations";
import {
  Shield, Users, Activity, RefreshCw, Trash2,
  Crown, Search, ChevronLeft, ChevronRight, Link as LinkIcon,
  Eye, CheckCircle, Clock
} from "lucide-react";

interface Stats {
  totalUsers: number;
  onlineNow: number;
  subscribedUsers: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
}

interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  subscribed: boolean;
  isAdmin: boolean;
  createdAt: string;
}

export function AdminPage() {
  const lang = useStore((s) => s.language) as "ru" | "en";
  const navigate = useStore((s) => s.navigate);
  const user = useStore((s) => s.user);

  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQ, setSearchQ] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [linkSaved, setLinkSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingLink, setSavingLink] = useState(false);
  const limit = 20;

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats", { credentials: "include" });
      if (res.ok) setStats(await res.json());
    } catch {}
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (searchQ) params.set("q", searchQ);
      const res = await fetch(`/api/admin/users?${params}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotalUsers(data.total);
      }
    } catch {}
  }, [page, searchQ]);

  const fetchPaymentLink = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/payment-link", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setPaymentLink(data.link || "");
      }
    } catch {}
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchUsers(), fetchPaymentLink()]);
      setLoading(false);
    };
    init();
  }, [fetchStats, fetchUsers, fetchPaymentLink]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetch("/api/heartbeat", { method: "POST", credentials: "include" });
        await fetchStats();
      } catch {}
    }, 30_000);
    fetch("/api/heartbeat", { method: "POST", credentials: "include" }).catch(() => {});
    return () => clearInterval(interval);
  }, [fetchStats]);

  const handleSaveLink = async () => {
    setSavingLink(true);
    try {
      const res = await fetch("/api/admin/payment-link", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ link: paymentLink }),
      });
      if (res.ok) {
        setLinkSaved(true);
        setTimeout(() => setLinkSaved(false), 3000);
      }
    } catch {}
    setSavingLink(false);
  };

  const handleToggleSub = async (userId: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, action: "toggleSub" }),
      });
      if (res.ok) {
        const data = await res.json();
        setUsers((prev) => prev.map((u) => (u.id === userId ? data.user : u)));
        fetchStats();
      }
    } catch {}
  };

  const handleToggleAdmin = async (userId: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, action: "toggleAdmin" }),
      });
      if (res.ok) {
        const data = await res.json();
        setUsers((prev) => prev.map((u) => (u.id === userId ? data.user : u)));
      }
    } catch {}
  };

  const handleDeleteUser = async (userId: string, displayName: string) => {
    if (!confirm(t(lang, "admin", "confirmDelete") + ` (${displayName})`)) return;
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, { method: "DELETE", credentials: "include" });
      if (res.ok) {
        fetchUsers();
        fetchStats();
      }
    } catch {}
  };

  const totalPages = Math.ceil(totalUsers / limit);
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-3" style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: `1px solid var(--border)` }}>
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("home")}
            className="p-1.5 rounded-full transition-colors -ml-2"
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--hover-secondary)"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--fg)" }}>
              <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold" style={{ color: "var(--fg)" }}>{t(lang, "admin", "title")}</h1>
        </div>
      </div>

      <div>
        {/* Stats */}
        <div className="p-4" style={{ borderBottom: `1px solid var(--border)` }}>
          <div className="grid grid-cols-3 gap-2">
            <StatCard icon={Users} label={t(lang, "admin", "totalUsers")} value={stats?.totalUsers ?? 0} color="var(--accent)" />
            <StatCard icon={Activity} label={t(lang, "admin", "onlineNow")} value={stats?.onlineNow ?? 0} color="#00ba7c" pulse />
            <StatCard icon={Crown} label={t(lang, "admin", "subscribedUsers")} value={stats?.subscribedUsers ?? 0} color="#d97706" />
            <StatCard icon={Eye} label={t(lang, "admin", "totalPosts")} value={stats?.totalPosts ?? 0} color="#0891b2" />
            <StatCard icon={CheckCircle} label={t(lang, "admin", "totalComments")} value={stats?.totalComments ?? 0} color="var(--accent)" />
            <StatCard icon={Clock} label={t(lang, "admin", "totalLikes")} value={stats?.totalLikes ?? 0} color="var(--like-color)" />
          </div>
        </div>

        {/* Payment Link */}
        <section className="p-4" style={{ borderBottom: `1px solid var(--border)` }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--fg)" }}>{t(lang, "admin", "paymentSection")}</h2>
          <p className="text-[15px] mb-3" style={{ color: "var(--muted)" }}>{t(lang, "admin", "paymentLinkHint")}</p>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--muted)" }} />
              <input
                type="url"
                value={paymentLink}
                onChange={(e) => setPaymentLink(e.target.value)}
                placeholder={t(lang, "admin", "paymentLinkPlaceholder")}
                className="w-full pl-10 pr-4 py-3 rounded-full text-[15px] transition-all duration-200"
                style={{ backgroundColor: "var(--input-bg)", color: "var(--fg)", border: "1px solid transparent" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "transparent"; }}
              />
            </div>
            <button
              onClick={handleSaveLink}
              disabled={savingLink}
              className="px-5 py-3 rounded-full font-bold text-[15px] text-white transition-all duration-200"
              style={{ backgroundColor: linkSaved ? "#00ba7c" : "var(--accent)" }}
            >
              {linkSaved ? <CheckCircle className="h-4 w-4" /> : null}
              {linkSaved ? t(lang, "admin", "linkSaved") : t(lang, "admin", "saveLink")}
            </button>
          </div>
          {paymentLink && (
            <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: "var(--hover-secondary)", border: "1px solid var(--border)" }}>
              <p className="text-[13px] mb-1" style={{ color: "var(--muted)" }}>Preview:</p>
              <a href={paymentLink} target="_blank" rel="noopener" className="text-[15px] break-all" style={{ color: "var(--accent)" }}>
                {paymentLink}
              </a>
            </div>
          )}
        </section>

        {/* Users Database */}
        <section className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: "var(--fg)" }}>{t(lang, "admin", "usersSection")}</h2>
            <div className="flex items-center gap-2">
              <span className="text-[15px]" style={{ color: "var(--muted)" }}>{totalUsers} {lang === "ru" ? "пользователей" : "users"}</span>
              <button
                onClick={() => { fetchStats(); fetchUsers(); }}
                className="p-2 rounded-full transition-colors"
                style={{ color: "var(--accent)" }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--accent-light)"; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px]" style={{ color: "var(--muted)" }} />
            <input
              type="text"
              value={searchQ}
              onChange={(e) => { setSearchQ(e.target.value); setPage(1); }}
              placeholder={t(lang, "admin", "searchUsers")}
              className="w-full pl-12 pr-4 py-3 rounded-full text-[15px] transition-all duration-200"
              style={{ backgroundColor: "var(--input-bg)", color: "var(--fg)", border: "1px solid transparent" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "transparent"; }}
            />
          </div>

          {/* Users List */}
          {users.length === 0 ? (
            <p className="text-center py-8 text-[15px]" style={{ color: "var(--muted)" }}>{t(lang, "admin", "noUsers")}</p>
          ) : (
            <div>
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 py-3 px-1 transition-colors"
                  style={{ borderBottom: `1px solid var(--border)` }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--hover-secondary)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <button
                    onClick={() => { navigate("profile", { username: u.username }); }}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                  >
                    <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: "var(--accent)", color: "white" }}
                    >
                      {u.displayName[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-[15px] truncate" style={{ color: "var(--fg)" }}>{u.displayName}</span>
                        {u.isAdmin && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: "rgba(217, 119, 6, 0.15)", color: "#d97706" }}>
                            {t(lang, "admin", "adminRole")}
                          </span>
                        )}
                        {u.subscribed && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}>
                            {t(lang, "admin", "subscribed")}
                          </span>
                        )}
                      </div>
                      <span className="text-[13px]" style={{ color: "var(--muted)" }}>@{u.username} · {formatDate(u.createdAt)}</span>
                    </div>
                  </button>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button
                      onClick={() => handleToggleSub(u.id)}
                      className="p-2 rounded-full transition-colors"
                      style={{ color: "#d97706" }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(217, 119, 6, 0.1)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                      title={t(lang, "admin", "toggleSub")}
                    >
                      <Crown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleToggleAdmin(u.id)}
                      className="p-2 rounded-full transition-colors"
                      style={{ color: "var(--accent)" }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--accent-light)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                      title={t(lang, "admin", "toggleAdmin")}
                    >
                      <Shield className="h-4 w-4" />
                    </button>
                    {u.id !== user?.id && (
                      <button
                        onClick={() => handleDeleteUser(u.id, u.displayName)}
                        className="p-2 rounded-full transition-colors"
                        style={{ color: "var(--danger)" }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(244, 33, 46, 0.1)"; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                        title={t(lang, "admin", "deleteUser")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-4 py-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-full transition-colors disabled:opacity-30"
                style={{ color: "var(--fg)" }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--hover-secondary)"; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-[15px] font-medium" style={{ color: "var(--muted)" }}>
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-full transition-colors disabled:opacity-30"
                style={{ color: "var(--fg)" }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--hover-secondary)"; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  pulse,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: number;
  color: string;
  pulse?: boolean;
}) {
  return (
    <div className="rounded-2xl p-3 text-center transition-colors"
      style={{ border: "1px solid var(--border)" }}
      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--hover-secondary)"; }}
      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
    >
      <Icon className={`h-5 w-5 mx-auto mb-1 ${pulse ? "animate-pulse" : ""}`} style={{ color }} />
      <p className="text-xl font-bold" style={{ color: "var(--fg)" }}>{value.toLocaleString()}</p>
      <p className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>{label}</p>
    </div>
  );
}
