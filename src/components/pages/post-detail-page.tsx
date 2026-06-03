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
        fetch(`/api/posts/${postId}`),
        fetch(`/api/posts/${postId}/comments`),
      ]);
      if (postRes.ok) {
        const postData = await postRes.json();
        setPost(postData);
      }
      if (commentsRes.ok) {
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      }
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
        body: JSON.stringify({ content: newComment.trim() }),
      });
      if (res.ok) {
        setNewComment("");
        const commentsRes = await fetch(`/api/posts/${postId}/comments`);
        if (commentsRes.ok) {
          setComments(await commentsRes.json());
        }
      }
    } catch {}
    setPostingComment(false);
  };

  if (loading) {
    return (
      <div className="max-w-[600px] mx-auto border-x border-[var(--border)] min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-[600px] mx-auto border-x border-[var(--border)] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--muted)] mb-4">{t(lang, "errors", "notFound")}</p>
          <button onClick={() => navigate("home")} className="text-[var(--accent)] hover:underline">
            {t(lang, "postDetail", "back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto border-x border-[var(--border)] min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)] px-4">
        <div className="flex items-center gap-6 h-[53px]">
          <button
            onClick={() => navigate("home")}
            className="p-1.5 rounded-full hover:bg-[var(--hover)] transition-colors -ml-2"
          >
            <svg className="h-5 w-5 text-[var(--fg)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-[var(--fg)]">{lang === "ru" ? "Пост" : "Post"}</h1>
        </div>
      </div>

      {/* Full Post Display */}
      <PostCard post={post} />

      {/* Comments Section */}
      <div className="border-t border-[var(--border)]">
        {/* New Comment - X.com style reply box */}
        {user && (
          <div className="flex gap-3 px-4 py-3 border-b border-[var(--border)]">
            <UserAvatar
              username={user.username}
              displayName={user.displayName}
              size="md"
            />
            <div className="flex-1 flex items-start gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t(lang, "postDetail", "commentPlaceholder")}
                className="flex-1 bg-transparent text-[15px] text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none pt-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleComment();
                }}
              />
              <button
                onClick={handleComment}
                disabled={!newComment.trim() || postingComment}
                className={`px-4 py-1.5 rounded-full text-[15px] font-bold mt-1 transition-all duration-200 ${
                  newComment.trim()
                    ? "bg-[var(--accent)] text-white hover:bg-[#1a8cd8]"
                    : "bg-[var(--accent)]/50 text-white/50 cursor-not-allowed"
                }`}
              >
                {t(lang, "postDetail", "addComment")}
              </button>
            </div>
          </div>
        )}

        {/* Comments List */}
        <div>
          {comments.length === 0 ? (
            <div className="p-8 text-center text-[var(--muted)] text-[15px]">
              {t(lang, "postDetail", "noComments")}
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 px-4 py-3 border-b border-[var(--border)] hover:bg-[var(--hover)] transition-colors">
                <button
                  onClick={() => navigate("profile", { username: comment.author.username })}
                  className="flex-shrink-0"
                >
                  <UserAvatar
                    username={comment.author.username}
                    displayName={comment.author.displayName}
                    avatarUrl={comment.author.avatarUrl}
                    size="md"
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <button
                      onClick={() => navigate("profile", { username: comment.author.username })}
                      className="font-bold text-[15px] text-[var(--fg)] hover:underline"
                    >
                      {comment.author.displayName}
                    </button>
                    {comment.author.subscribed && <SubscribedBadge size="sm" />}
                    <span className="text-[15px] text-[var(--muted)]">·</span>
                    <span className="text-[15px] text-[var(--muted)] hover:underline">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                        locale,
                      })}
                    </span>
                  </div>
                  <p className="text-[15px] text-[var(--fg)] whitespace-pre-wrap break-words leading-5">
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
