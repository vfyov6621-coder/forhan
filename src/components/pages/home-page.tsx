"use client";

import { useState, useEffect, useCallback } from "react";
import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { PostComposer } from "@/components/post-composer";
import { PostCard } from "@/components/post-card";
import { Star } from "lucide-react";

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

export function HomePage() {
  const user = useStore((s) => s.user);
  const lang = useStore((s) => s.language) as "ru" | "en";
  const navigate = useStore((s) => s.navigate);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div className="max-w-[600px] mx-auto border-x border-[var(--border)] min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-[var(--bg-primary)]/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 pt-2 pb-1">
          <h1 className="text-xl font-bold text-[var(--fg)]">{t(lang, "home", "title")}</h1>
          <button className="p-2 rounded-full hover:bg-[var(--hover)] transition-colors">
            <Star className="h-5 w-5 text-[var(--fg)]" />
          </button>
        </div>

        {/* For You / Following Tabs */}
        <div className="flex">
          <button
            onClick={() => setActiveTab("foryou")}
            className={`relative flex-1 py-3 text-[15px] text-center hover:bg-[var(--hover)] transition-colors ${
              activeTab === "foryou" ? "x-tab-active" : "x-tab-inactive"
            }`}
          >
            {lang === "ru" ? "Для вас" : "For you"}
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`relative flex-1 py-3 text-[15px] text-center hover:bg-[var(--hover)] transition-colors ${
              activeTab === "following" ? "x-tab-active" : "x-tab-inactive"
            }`}
          >
            Following
          </button>
        </div>
      </div>

      {/* Composer */}
      {user && <PostComposer onPost={fetchPosts} />}

      {/* Posts Feed */}
      <div>
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="h-8 w-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <h2 className="text-xl font-bold text-[var(--fg)] mb-2">
              {lang === "ru" ? "Пока ничего нет" : "Nothing yet"}
            </h2>
            <p className="text-[15px] text-[var(--muted)]">{t(lang, "home", "empty")}</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
