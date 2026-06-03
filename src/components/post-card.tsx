"use client";

import { useState } from "react";
import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { Heart, MessageCircle, Repeat2, Trash2 } from "lucide-react";
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
      const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
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
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
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
    <article className="border-b border-[var(--border)] p-4 hover:bg-[var(--hover)] transition-colors cursor-pointer">
      <div className="flex gap-3">
        <div onClick={handleAuthorClick} className="flex-shrink-0">
          <UserAvatar
            username={post.author.username}
            displayName={post.author.displayName}
            avatarUrl={post.author.avatarUrl}
            size="md"
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <button
              onClick={handleAuthorClick}
              className="font-semibold text-sm text-[var(--fg)] hover:underline truncate"
            >
              {post.author.displayName}
            </button>
            {post.author.subscribed && <SubscribedBadge size="sm" />}
            <span className="text-sm text-[var(--muted)] truncate">
              @{post.author.username}
            </span>
            <span className="text-sm text-[var(--muted)]">·</span>
            <span className="text-sm text-[var(--muted)] whitespace-nowrap">{timeAgo}</span>
          </div>

          {/* Content */}
          <div
            className="text-[15px] text-[var(--fg)] whitespace-pre-wrap break-words leading-relaxed mb-2"
            onClick={handlePostClick}
          >
            {post.content}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 -ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className={`flex items-center gap-1.5 p-2 rounded-full transition-colors group ${
                liked
                  ? "text-red-500 hover:bg-red-500/10"
                  : "text-[var(--muted)] hover:text-red-500 hover:bg-red-500/10"
              }`}
            >
              <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
              <span className="text-xs">{likeCount > 0 ? likeCount : ""}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePostClick();
              }}
              className="flex items-center gap-1.5 p-2 rounded-full text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">
                {(post._count?.comments ?? 0) > 0 ? post._count!.comments : ""}
              </span>
            </button>

            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 p-2 rounded-full text-[var(--muted)] hover:text-green-500 hover:bg-green-500/10 transition-colors"
            >
              <Repeat2 className="h-4 w-4" />
            </button>

            {user && user.id === post.author.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="flex items-center gap-1.5 p-2 rounded-full text-[var(--muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
