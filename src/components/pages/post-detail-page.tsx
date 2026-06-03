"use client";

import { useState, useEffect, useCallback } from "react";
import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { PostCard } from "@/components/post-card";
import { UserAvatar } from "@/components/user-avatar";
import { SubscribedBadge } from "@/components/subscribed-badge";

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

interface Comment {
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
}

export function PostDetailPage() {
  const user = useStore((s) => s.user);
  const navigate = useStore((s) => s.navigate);
  const lang = useStore((s) => s.language) as "ru" | "en";
  const viewParams = useStore((s) => s.viewParams);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [postingComment, setPostingComment] = useState(false);

  const postId = viewParams.id || "";
  const locale = lang === "ru" ? ru : enUS;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [postRes, commentsRes] = await Promise.all([
        fetch(`/api/posts/${postId}`, { credentials: "include" }),
        fetch(`/api/posts/${postId}/comments`, { credentials: "include" }),
      ]);
      if (postRes.ok) setPost(await postRes.json());
      if (commentsRes.ok) setComments(await commentsRes.json());
    } catch {}
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    if (postId) fetchData();
  }, [postId, fetchData]);

  const handleComment = async () => {
    if (!newComment.trim() || !user || postingComment) return;
    setPostingComment(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: newComment.trim() }),
      });
      if (res.ok) {
        setNewComment("");
        const commentsRes = await fetch(`/api/posts/${postId}/comments`, { credentials: "include" });
        if (commentsRes.ok) setComments(await commentsRes.json());
      }
    } catch {}
    setPostingComment(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4" style={{ color: "var(--muted)" }}>{t(lang, "errors", "notFound")}</p>
          <button onClick={() => navigate("home")} className="font-bold" style={{ color: "var(--accent)" }}>
            {t(lang, "postDetail", "back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 px-4" style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: `1px solid var(--border)` }}>
        <div className="flex items-center gap-6 h-[53px]">
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
          <h1 className="text-xl font-bold" style={{ color: "var(--fg)" }}>{lang === "ru" ? "Пост" : "Post"}</h1>
        </div>
      </div>

      {/* Full Post */}
      <PostCard post={post} />

      {/* Comments */}
      <div style={{ borderTop: `1px solid var(--border)` }}>
        {/* New Comment */}
        {user && (
          <div className="flex gap-3 px-4 py-3" style={{ borderBottom: `1px solid var(--border)` }}>
            <UserAvatar username={user.username} displayName={user.displayName} size="md" />
            <div className="flex-1 flex items-start gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t(lang, "postDetail", "commentPlaceholder")}
                className="flex-1 bg-transparent text-[15px] focus:outline-none pt-2"
                style={{ color: "var(--fg)" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleComment();
                }}
              />
              <button
                onClick={handleComment}
                disabled={!newComment.trim() || postingComment}
                className="px-4 py-1.5 rounded-full text-[15px] font-bold mt-1 transition-all duration-200"
                style={{
                  backgroundColor: newComment.trim() ? "var(--fg)" : "transparent",
                  color: newComment.trim() ? "var(--bg-primary)" : "var(--fg-secondary)",
                  border: newComment.trim() ? "none" : "1px solid var(--border)",
                  opacity: newComment.trim() ? 1 : 0.5,
                }}
              >
                {t(lang, "postDetail", "addComment")}
              </button>
            </div>
          </div>
        )}

        {/* Comments List */}
        <div>
          {comments.length === 0 ? (
            <div className="p-8 text-center text-[15px]" style={{ color: "var(--muted)" }}>
              {t(lang, "postDetail", "noComments")}
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 px-4 py-3 transition-colors"
                style={{ borderBottom: `1px solid var(--border)` }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--hover-secondary)"; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <button
                  onClick={() => navigate("profile", { username: comment.author.username })}
                  className="flex-shrink-0"
                >
                  <UserAvatar username={comment.author.username} displayName={comment.author.displayName} avatarUrl={comment.author.avatarUrl} size="md" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <button
                      onClick={() => navigate("profile", { username: comment.author.username })}
                      className="font-bold text-[15px] transition-colors"
                      style={{ color: "var(--fg)" }}
                      onMouseOver={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                      onMouseOut={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                    >
                      {comment.author.displayName}
                    </button>
                    {comment.author.subscribed && <SubscribedBadge size="sm" />}
                    <span className="text-[15px]" style={{ color: "var(--muted)" }}>·</span>
                    <span className="text-[15px] transition-colors" style={{ color: "var(--muted)" }}
                      onMouseOver={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                      onMouseOut={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                    >
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale })}
                    </span>
                  </div>
                  <p className="text-[15px] whitespace-pre-wrap break-words leading-5" style={{ color: "var(--fg)" }}>
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
