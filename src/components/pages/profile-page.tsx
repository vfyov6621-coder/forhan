"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { enUS } from "date-fns/locale";
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
      <div className="max-w-xl mx-auto border-x border-[var(--border)] min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="max-w-xl mx-auto border-x border-[var(--border)] min-h-screen flex items-center justify-center">
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
    <div className="max-w-xl mx-auto border-x border-[var(--border)] min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)] px-4 py-3">
        <h1 className="text-xl font-bold text-[var(--fg)]">@{profileUser.username}</h1>
      </div>

      {/* Banner */}
      <div className="h-32 sm:h-48 bg-gradient-to-r from-[var(--accent)] to-purple-400 relative" />

      {/* Profile Info */}
      <div className="px-4 pb-4">
        <div className="-mt-12 mb-3 flex items-end gap-4">
          <UserAvatar
            username={profileUser.username}
            displayName={profileUser.displayName}
            avatarUrl={profileUser.avatarUrl}
            size="xl"
          />
          <div className="flex-1" />
          {isOwnProfile && (
            <button
              onClick={() => navigate("settings")}
              className="px-4 py-1.5 rounded-full border border-[var(--border)] text-sm font-semibold text-[var(--fg)] hover:bg-[var(--hover)] transition-colors"
            >
              {t(lang, "profile", "editProfile")}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-[var(--fg)]">{profileUser.displayName}</h2>
          {profileUser.subscribed && <SubscribedBadge size="md" />}
        </div>

        <p className="text-[var(--muted)] text-sm">@{profileUser.username}</p>

        {profileUser.bio && (
          <p className="text-[var(--fg)] mt-2 text-[15px]">{profileUser.bio}</p>
        )}

        <p className="text-[var(--muted)] text-sm mt-2">
          {t(lang, "profile", "joined")}{" "}
          {format(new Date(profileUser.createdAt), "MMMM yyyy", { locale })}
        </p>
      </div>

      {/* Posts */}
      <div className="border-t border-[var(--border)]">
        {posts.length === 0 ? (
          <div className="p-8 text-center text-[var(--muted)]">
            {t(lang, "profile", "noPosts")}
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
