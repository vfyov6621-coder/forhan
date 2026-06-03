"use client";

import { useState, useEffect, useCallback } from "react";
import { useStore } from "@/store";
import { t } from "@/lib/translations";
import {
  Shield, Users, CreditCard, Activity, RefreshCw, Trash2,
  Crown, UserX, Search, ChevronLeft, ChevronRight, Link as LinkIcon,
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
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {}
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (searchQ) params.set("q", searchQ);
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotalUsers(data.total);
      }
    } catch {}
  }, [page, searchQ]);

  const fetchPaymentLink = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/payment-link");
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

  // Heartbeat — ping every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetch("/api/heartbeat", { method: "POST" });
        await fetchStats();
      } catch {}
    }, 30_000);
    // Initial ping
    fetch("/api/heartbeat", { method: "POST" }).catch(() => {});
    return () => clearInterval(interval);
  }, [fetchStats]);

  const handleSaveLink = async () => {
    setSavingLink(true);
    try {
      const res = await fetch("/api/admin/payment-link", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
      const res = await fetch(`/api/admin/users?userId=${userId}`, { method: "DELETE" });
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
        <div className="h-8 w-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[var(--accent)] flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--fg)]">{t(lang, "admin", "title")}</h1>
            <p className="text-sm text-[var(--muted)]">@{user?.username}</p>
          </div>
        </div>
        <button
          onClick={() => { fetchStats(); fetchUsers(); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--hover)] text-[var(--fg)] hover:bg-[var(--border)] transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          {t(lang, "admin", "refresh")}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <StatCard icon={Users} label={t(lang, "admin", "totalUsers")} value={stats?.totalUsers ?? 0} color="bg-blue-500/20 text-blue-400" />
        <StatCard icon={Activity} label={t(lang, "admin", "onlineNow")} value={stats?.onlineNow ?? 0} color="bg-green-500/20 text-green-400" pulse />
        <StatCard icon={Crown} label={t(lang, "admin", "subscribedUsers")} value={stats?.subscribedUsers ?? 0} color="bg-purple-500/20 text-purple-400" />
        <StatCard icon={Eye} label={t(lang, "admin", "totalPosts")} value={stats?.totalPosts ?? 0} color="bg-cyan-500/20 text-cyan-400" />
        <StatCard icon={CheckCircle} label={t(lang, "admin", "totalComments")} value={stats?.totalComments ?? 0} color="bg-amber-500/20 text-amber-400" />
        <StatCard icon={Clock} label={t(lang, "admin", "totalLikes")} value={stats?.totalLikes ?? 0} color="bg-pink-500/20 text-pink-400" />
      </div>

      {/* Payment Link Section */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5 text-[var(--accent)]" />
          <h2 className="text-lg font-bold text-[var(--fg)]">{t(lang, "admin", "paymentSection")}</h2>
        </div>
        <p className="text-sm text-[var(--muted)] mb-3">{t(lang, "admin", "paymentLinkHint")}</p>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
            <input
              type="url"
              value={paymentLink}
              onChange={(e) => setPaymentLink(e.target.value)}
              placeholder={t(lang, "admin", "paymentLinkPlaceholder")}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--input-bg)] text-[var(--fg)] border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none transition-colors text-sm"
            />
          </div>
          <button
            onClick={handleSaveLink}
            disabled={savingLink}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
              linkSaved
                ? "bg-green-500/20 text-green-400"
                : "bg-[var(--accent)] text-white hover:opacity-90"
            }`}
          >
            {linkSaved ? <CheckCircle className="h-4 w-4" /> : null}
            {linkSaved ? t(lang, "admin", "linkSaved") : t(lang, "admin", "saveLink")}
          </button>
        </div>
        {paymentLink && (
          <div className="mt-3 p-3 rounded-lg bg-[var(--hover)] border border-[var(--border)]">
            <p className="text-xs text-[var(--muted)] mb-1">Preview:</p>
            <a href={paymentLink} target="_blank" rel="noopener" className="text-sm text-[var(--accent)] break-all hover:underline">
              {paymentLink}
            </a>
          </div>
        )}
      </div>

      {/* Users Database Section */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[var(--accent)]" />
            <h2 className="text-lg font-bold text-[var(--fg)]">{t(lang, "admin", "usersSection")}</h2>
            <span className="text-sm text-[var(--muted)]">({totalUsers})</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
          <input
            type="text"
            value={searchQ}
            onChange={(e) => { setSearchQ(e.target.value); setPage(1); }}
            placeholder={t(lang, "admin", "searchUsers")}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--input-bg)] text-[var(--fg)] border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none transition-colors text-sm"
          />
        </div>

        {/* Users Table */}
        {users.length === 0 ? (
          <p className="text-center text-[var(--muted)] py-8">{t(lang, "admin", "noUsers")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
                  <th className="pb-2 font-medium">{t(lang, "admin", "username")}</th>
                  <th className="pb-2 font-medium hidden sm:table-cell">{t(lang, "admin", "status")}</th>
                  <th className="pb-2 font-medium hidden md:table-cell">{t(lang, "admin", "joined")}</th>
                  <th className="pb-2 font-medium text-right">{t(lang, "admin", "actions")}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-[var(--border)] hover:bg-[var(--hover)] transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => { navigate("profile", { username: u.username }); }}
                          className="flex items-center gap-2.5 hover:underline"
                        >
                          <div className="h-9 w-9 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {u.displayName[0]?.toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-[var(--fg)] truncate">{u.displayName}</span>
                              {u.isAdmin && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium">
                                  {t(lang, "admin", "adminRole")}
                                </span>
                              )}
                              {u.subscribed && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium">
                                  {t(lang, "admin", "subscribed")}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[var(--muted)]">@{u.username}</span>
                          </div>
                        </button>
                      </div>
                    </td>
                    <td className="py-3 hidden sm:table-cell">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        u.subscribed ? "bg-blue-500/20 text-blue-400" : "bg-[var(--hover)] text-[var(--muted)]"
                      }`}>
                        {u.subscribed ? t(lang, "admin", "subscribed") : t(lang, "admin", "notSubscribed")}
                      </span>
                    </td>
                    <td className="py-3 text-[var(--muted)] text-xs hidden md:table-cell">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => handleToggleSub(u.id)}
                          className="p-1.5 rounded-lg hover:bg-purple-500/20 text-purple-400 transition-colors"
                          title={t(lang, "admin", "toggleSub")}
                        >
                          <Crown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleAdmin(u.id)}
                          className="p-1.5 rounded-lg hover:bg-amber-500/20 text-amber-400 transition-colors"
                          title={t(lang, "admin", "toggleAdmin")}
                        >
                          <Shield className="h-4 w-4" />
                        </button>
                        {u.id !== user?.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.displayName)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                            title={t(lang, "admin", "deleteUser")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-lg bg-[var(--hover)] text-[var(--fg)] hover:bg-[var(--border)] disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-[var(--muted)]">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 rounded-lg bg-[var(--hover)] text-[var(--fg)] hover:bg-[var(--border)] disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
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
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
  pulse?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${color} ${pulse ? "animate-pulse" : ""}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--fg)]">{value.toLocaleString()}</p>
          <p className="text-xs text-[var(--muted)]">{label}</p>
        </div>
      </div>
    </div>
  );
}
