"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { SubscribedBadge } from "@/components/subscribed-badge";
import { PostCard } from "@/components/post-card";

interface ProfileUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  subscribed: boolean;
  createdAt: string;
}

interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    subscribed: boolean;
  };
  _count: {
    likes: number;
    comments: number;
  };
  isLiked: boolean;
}

export function ProfilePage() {
  const currentUser = useStore((s) => s.user);
  const navigate = useStore((s) => s.navigate);
  const viewParams = useStore((s) => s.viewParams);
  const lang = useStore((s) => s.language) as "ru" | "en";
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"posts" | "replies" | "likes">("posts");

  const username = viewParams.username || currentUser?.username || "";
  const isOwnProfile = currentUser?.username === username;
  const locale = lang === "ru" ? ru : enUS;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/users/${username}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setProfileUser(data.user);
          setPosts(data.posts || []);
        } else {
          setError(t(lang, "errors", "notFound"));
        }
      } catch {
        setError(t(lang, "errors", "networkError"));
      }
      setLoading(false);
    };
    if (username) fetchProfile();
  }, [username, lang]);

  const handleDelete = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4" style={{ color: "var(--muted)" }}>{error || t(lang, "errors", "notFound")}</p>
          <button
            onClick={() => navigate("home")}
            className="font-bold"
            style={{ color: "var(--accent)" }}
          >
            {t(lang, "postDetail", "back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20" style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-6 px-4 h-[53px]">
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
          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--fg)" }}>{profileUser.displayName}</h2>
            <p className="text-[13px]" style={{ color: "var(--muted)" }}>
              {posts.length} {t(lang, "profile", "posts").toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Banner - X.com style */}
      <div className="h-[200px] relative" style={{
        background: "linear-gradient(135deg, var(--accent), #657786)",
      }} />

      {/* Profile Info */}
      <div className="px-4 pb-3" style={{ borderBottom: `1px solid var(--border)` }}>
        <div className="-mt-16 mb-3 flex items-end justify-between">
          <div className="rounded-full" style={{ border: `4px solid var(--bg-primary)` }}>
            <UserAvatar
              username={profileUser.username}
              displayName={profileUser.displayName}
              avatarUrl={profileUser.avatarUrl}
              size="xl"
            />
          </div>
          {isOwnProfile ? (
            <button
              onClick={() => navigate("settings")}
              className="px-4 py-1.5 rounded-full text-[15px] font-bold transition-colors mt-2"
              style={{ border: `1px solid var(--border)`, color: "var(--fg)" }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--hover-secondary)"; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              {t(lang, "profile", "editProfile")}
            </button>
          ) : (
            <button
              className="px-5 py-1.5 rounded-full text-[15px] font-bold transition-colors mt-2"
              style={{ backgroundColor: "var(--fg)", color: "var(--bg-primary)" }}
              onMouseOver={(e) => { e.currentTarget.style.opacity = "0.9"; }}
              onMouseOut={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              Follow
            </button>
          )}
        </div>

        {/* Name + Badge */}
        <div className="flex items-center gap-1 mb-0.5">
          <h2 className="text-xl font-extrabold" style={{ color: "var(--fg)" }}>{profileUser.displayName}</h2>
          {profileUser.subscribed && <SubscribedBadge size="md" />}
        </div>

        <p className="text-[15px]" style={{ color: "var(--muted)" }}>@{profileUser.username}</p>

        {/* Bio */}
        {profileUser.bio && (
          <p className="text-[15px] mt-3 whitespace-pre-wrap" style={{ color: "var(--fg)" }}>
            {profileUser.bio}
          </p>
        )}

        {/* Meta info */}
        <div className="flex items-center gap-1 mt-3 text-[15px]" style={{ color: "var(--muted)" }}>
          <CalendarDays className="h-[18px] w-[18px]" />
          <span>
            {t(lang, "profile", "joined")}{" "}
            {format(new Date(profileUser.createdAt), "MMMM yyyy", { locale })}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[53px] z-10" style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
        <div className="flex" style={{ borderTop: `1px solid var(--border)` }}>
          <button
            onClick={() => setActiveTab("posts")}
            className={`x-tab ${activeTab === "posts" ? "x-tab-active" : ""}`}
          >
            {t(lang, "profile", "posts")}
          </button>
          <button
            onClick={() => setActiveTab("replies")}
            className={`x-tab ${activeTab === "replies" ? "x-tab-active" : ""}`}
          >
            {lang === "ru" ? "Ответы" : "Replies"}
          </button>
          <button
            onClick={() => setActiveTab("likes")}
            className={`x-tab ${activeTab === "likes" ? "x-tab-active" : ""}`}
          >
            {lang === "ru" ? "Нравится" : "Likes"}
          </button>
        </div>
      </div>

      {/* Posts */}
      <div>
        {posts.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--fg)" }}>
              {lang === "ru" ? "Пока ничего нет" : "Nothing yet"}
            </h3>
            <p className="text-[15px]" style={{ color: "var(--muted)" }}>
              {activeTab === "posts"
                ? t(lang, "profile", "noPosts")
                : lang === "ru"
                  ? "В этом разделе пока ничего нет."
                  : "Nothing in this section yet."}
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={isOwnProfile ? handleDelete : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
}
