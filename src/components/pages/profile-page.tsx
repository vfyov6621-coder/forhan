"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { CalendarDays, MapPin, Link as LinkIcon } from "lucide-react";
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
        const res = await fetch(`/api/users/${username}`);
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
      <div className="max-w-[600px] mx-auto border-x border-[var(--border)] min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="max-w-[600px] mx-auto border-x border-[var(--border)] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--muted)] mb-4">{error || t(lang, "errors", "notFound")}</p>
          <button
            onClick={() => navigate("home")}
            className="text-[var(--accent)] hover:underline"
          >
            {t(lang, "postDetail", "back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto border-x border-[var(--border)] min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-[var(--bg-primary)]/80 backdrop-blur-md">
        <div className="flex items-center gap-6 px-4 py-1 h-[53px]">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[var(--fg)]">{profileUser.displayName}</h2>
            <p className="text-[13px] text-[var(--muted)]">
              {posts.length} {t(lang, "profile", "posts").toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Banner - X.com style gradient */}
      <div className="h-48 sm:h-48 bg-gradient-to-br from-[var(--accent)] to-[#657786] relative" />

      {/* Profile Info Section */}
      <div className="px-4 pb-3 border-b border-[var(--border)]">
        <div className="-mt-16 mb-3 flex items-end justify-between">
          <div className="border-4 border-[var(--bg-primary)] rounded-full">
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
              className="px-4 py-1.5 rounded-full border border-[var(--border)] text-[15px] font-bold text-[var(--fg)] hover:bg-[var(--hover)] transition-colors mt-2"
            >
              {t(lang, "profile", "editProfile")}
            </button>
          ) : (
            <button className="px-5 py-1.5 rounded-full bg-[var(--fg)] text-[var(--bg-primary)] text-[15px] font-bold hover:opacity-90 transition-colors mt-2">
              Follow
            </button>
          )}
        </div>

        {/* Name + Badge */}
        <div className="flex items-center gap-1 mb-0.5">
          <h2 className="text-xl font-extrabold text-[var(--fg)]">{profileUser.displayName}</h2>
          {profileUser.subscribed && <SubscribedBadge size="md" />}
        </div>

        <p className="text-[15px] text-[var(--muted)]">@{profileUser.username}</p>

        {/* Bio */}
        {profileUser.bio && (
          <p className="text-[15px] text-[var(--fg)] mt-3 whitespace-pre-wrap">
            {profileUser.bio}
          </p>
        )}

        {/* Meta info */}
        <div className="flex items-center gap-1 mt-3 text-[15px] text-[var(--muted)]">
          <CalendarDays className="h-4 w-4" />
          <span>
            {t(lang, "profile", "joined")}{" "}
            {format(new Date(profileUser.createdAt), "MMMM yyyy", { locale })}
          </span>
        </div>
      </div>

      {/* Tabs - Posts / Replies / Likes */}
      <div className="sticky top-[53px] z-10 bg-[var(--bg-primary)]/80 backdrop-blur-md">
        <div className="flex">
          <button
            onClick={() => setActiveTab("posts")}
            className={`relative flex-1 py-4 text-[15px] text-center hover:bg-[var(--hover)] transition-colors ${
              activeTab === "posts" ? "x-tab-active" : "x-tab-inactive"
            }`}
          >
            {t(lang, "profile", "posts")}
          </button>
          <button
            onClick={() => setActiveTab("replies")}
            className={`relative flex-1 py-4 text-[15px] text-center hover:bg-[var(--hover)] transition-colors ${
              activeTab === "replies" ? "x-tab-active" : "x-tab-inactive"
            }`}
          >
            {lang === "ru" ? "Ответы" : "Replies"}
          </button>
          <button
            onClick={() => setActiveTab("likes")}
            className={`relative flex-1 py-4 text-[15px] text-center hover:bg-[var(--hover)] transition-colors ${
              activeTab === "likes" ? "x-tab-active" : "x-tab-inactive"
            }`}
          >
            {lang === "ru" ? "Нравится" : "Likes"}
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div>
        {posts.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-xl font-bold text-[var(--fg)] mb-2">
              {lang === "ru" ? "Пока ничего нет" : "Nothing yet"}
            </h3>
            <p className="text-[15px] text-[var(--muted)]">
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
