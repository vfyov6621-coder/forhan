"use client";

import { useState } from "react";
import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { UserAvatar } from "./user-avatar";
import { SubscribedBadge } from "./subscribed-badge";

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
  _count?: {
    likes: number;
    comments: number;
  };
  isLiked?: boolean;
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  compact?: boolean;
}

export function PostCard({ post, onLike, onComment, onDelete, compact = false }: PostCardProps) {
  const user = useStore((s) => s.user);
  const lang = useStore((s) => s.language);
  const navigate = useStore((s) => s.navigate);
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0);
  const [deleting, setDeleting] = useState(false);

  const locale = lang === "ru" ? ru : enUS;

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST", credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
      }
    } catch {}
  };

  const handleDelete = async () => {
    if (deleting) return;
    if (!confirm(t(lang, "postCard", "confirmDelete"))) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE", credentials: "include" });
      if (res.ok && onDelete) onDelete(post.id);
    } catch {}
    setDeleting(false);
  };

  const handleAuthorClick = () => {
    navigate("profile", { username: post.author.username });
  };

  const handlePostClick = () => {
    if (!compact && onComment) {
      onComment(post.id);
    } else {
      navigate("post", { id: post.id });
    }
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale,
  });

  return (
    <article
      className="px-4 py-3 cursor-pointer transition-colors"
      style={{ borderBottom: `1px solid var(--border)` }}
      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--hover-secondary)"; }}
      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleAuthorClick();
          }}
          className="flex-shrink-0"
        >
          <UserAvatar
            username={post.author.username}
            displayName={post.author.displayName}
            avatarUrl={post.author.avatarUrl}
            size="md"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header - author name, username, time */}
          <div className="flex items-center gap-1 mb-0.5 flex-wrap">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAuthorClick();
              }}
              className="font-bold text-[15px] truncate transition-colors"
              style={{ color: "var(--fg)" }}
              onMouseOver={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
              onMouseOut={(e) => { e.currentTarget.style.textDecoration = "none"; }}
            >
              {post.author.displayName}
            </button>
            {post.author.subscribed && <SubscribedBadge size="sm" />}
            <span className="text-[15px] truncate" style={{ color: "var(--fg-secondary)" }}>
              @{post.author.username}
            </span>
            <span className="text-[15px]" style={{ color: "var(--border)" }}>·</span>
            <span className="text-[15px] whitespace-nowrap transition-colors" style={{ color: "var(--fg-secondary)" }}
              onMouseOver={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
              onMouseOut={(e) => { e.currentTarget.style.textDecoration = "none"; }}
            >
              {timeAgo}
            </span>
          </div>

          {/* Post Content */}
          <div
            className="text-[15px] whitespace-pre-wrap break-words leading-5 mb-3"
            style={{ color: "var(--fg)" }}
            onClick={handlePostClick}
          >
            {post.content}
          </div>

          {/* Action Bar - X.com icon buttons */}
          <div className="flex items-center justify-between max-w-[425px] -ml-2 mt-[-6px]">
            {/* Comment */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePostClick();
              }}
              className="post-action group"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
            </button>

            {/* Repost */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="post-action post-action-repost group"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 1l4 4-4 4" />
                <path d="M3 11V9a4 4 0 014-4h14" />
                <path d="M7 23l-4-4 4-4" />
                <path d="M21 13v2a4 4 0 01-4 4H3" />
              </svg>
            </button>

            {/* Like */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className="post-action group"
              style={{
                color: liked ? "var(--like-color)" : "var(--muted)",
                backgroundColor: liked ? "rgba(249, 24, 128, 0.1)" : "transparent",
              }}
              onMouseOver={(e) => {
                if (!liked) {
                  e.currentTarget.style.color = "var(--like-color)";
                  e.currentTarget.style.backgroundColor = "rgba(249, 24, 128, 0.1)";
                }
              }}
              onMouseOut={(e) => {
                if (!liked) {
                  e.currentTarget.style.color = "var(--muted)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>

            {/* Share */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="post-action group"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="16 6 12 2 8 6" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="2" x2="12" y2="15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Delete (own posts) */}
            {user && user.id === post.author.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="post-action group"
                disabled={deleting}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "var(--danger)";
                  e.currentTarget.style.backgroundColor = "rgba(244, 33, 46, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "var(--muted)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
