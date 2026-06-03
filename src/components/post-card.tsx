"use client";

import { useState } from "react";
import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { Heart, MessageCircle, Repeat2, Share, Trash2 } from "lucide-react";
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
    <article className="border-b border-[var(--border)] px-4 py-3 hover:bg-[var(--hover)] transition-colors cursor-pointer">
      <div className="flex gap-3">
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

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-1 mb-0.5 flex-wrap">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAuthorClick();
              }}
              className="font-bold text-[15px] text-[var(--fg)] hover:underline truncate"
            >
              {post.author.displayName}
            </button>
            {post.author.subscribed && <SubscribedBadge size="sm" />}
            <span className="text-[15px] text-[var(--muted)] truncate">
              @{post.author.username}
            </span>
            <span className="text-[15px] text-[var(--muted)]">·</span>
            <span className="text-[15px] text-[var(--muted)] whitespace-nowrap hover:underline">{timeAgo}</span>
          </div>

          {/* Content */}
          <div
            className="text-[15px] text-[var(--fg)] whitespace-pre-wrap break-words leading-5 mb-3"
            onClick={handlePostClick}
          >
            {post.content}
          </div>

          {/* Action Bar - X.com style */}
          <div className="flex items-center justify-between max-w-[425px] -ml-2">
            {/* Comment */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePostClick();
              }}
              className="flex items-center gap-0 group"
            >
              <div className="p-2 rounded-full text-[var(--muted)] group-hover:text-[#1d9bf0] group-hover:bg-[#1d9bf0]/10 transition-colors">
                <MessageCircle className="h-[18px] w-[18px]" />
              </div>
              <span className="text-[13px] text-[var(--muted)] group-hover:text-[#1d9bf0] transition-colors">
                {(post._count?.comments ?? 0) > 0 ? post._count!.comments : ""}
              </span>
            </button>

            {/* Repost */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-0 group"
            >
              <div className="p-2 rounded-full text-[var(--muted)] group-hover:text-[#00ba7c] group-hover:bg-[#00ba7c]/10 transition-colors">
                <Repeat2 className="h-[18px] w-[18px]" />
              </div>
              <span className="text-[13px] text-[var(--muted)] group-hover:text-[#00ba7c] transition-colors">
                0
              </span>
            </button>

            {/* Like */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className="flex items-center gap-0 group"
            >
              <div className={`p-2 rounded-full transition-colors ${
                liked
                  ? "text-[#f91880] bg-[#f91880]/10"
                  : "text-[var(--muted)] group-hover:text-[#f91880] group-hover:bg-[#f91880]/10"
              }`}>
                <Heart
                  className="h-[18px] w-[18px]"
                  fill={liked ? "currentColor" : "none"}
                />
              </div>
              <span className={`text-[13px] transition-colors ${
                liked ? "text-[#f91880]" : "text-[var(--muted)] group-hover:text-[#f91880]"
              }`}>
                {likeCount > 0 ? likeCount : ""}
              </span>
            </button>

            {/* Share */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-0 group"
            >
              <div className="p-2 rounded-full text-[var(--muted)] group-hover:text-[#1d9bf0] group-hover:bg-[#1d9bf0]/10 transition-colors">
                <Share className="h-[18px] w-[18px]" />
              </div>
            </button>

            {/* Delete (own posts) */}
            {user && user.id === post.author.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="flex items-center gap-0 group"
                disabled={deleting}
              >
                <div className="p-2 rounded-full text-[var(--muted)] group-hover:text-red-500 group-hover:bg-red-500/10 transition-colors">
                  <Trash2 className="h-[18px] w-[18px]" />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
