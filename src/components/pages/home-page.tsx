"use client";

import { useState, useEffect, useCallback } from "react";
import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { PostComposer } from "@/components/post-composer";
import { PostCard } from "@/components/post-card";
import { Sparkles } from "lucide-react";

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
    <div className="min-h-screen">
      {/* Sticky Header - X.com style */}
      <div className="sticky top-0 z-10" style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
        <div className="flex items-center justify-between px-4 h-[53px]">
          <h1 className="text-xl font-bold" style={{ color: "var(--fg)" }}>{t(lang, "home", "title")}</h1>
          <button className="p-2 rounded-full transition-colors"
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--hover-secondary)"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <Sparkles className="h-5 w-5" style={{ color: "var(--fg)" }} />
          </button>
        </div>

        {/* For You / Following Tabs - X.com style with underline */}
        <div className="flex" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => setActiveTab("foryou")}
            className={`x-tab ${activeTab === "foryou" ? "x-tab-active" : ""}`}
          >
            {lang === "ru" ? "Для вас" : "For you"}
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`x-tab ${activeTab === "following" ? "x-tab-active" : ""}`}
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
            <div className="h-8 w-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--fg)" }}>
              {lang === "ru" ? "Пока ничего нет" : "Nothing yet"}
            </h2>
            <p className="text-[15px]" style={{ color: "var(--muted)" }}>{t(lang, "home", "empty")}</p>
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
