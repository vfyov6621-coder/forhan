"use client";

import { useState } from "react";
import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { Smile, ImageIcon, ListTodo, CalendarDays } from "lucide-react";
import { UserAvatar } from "./user-avatar";

interface PostComposerProps {
  onPost?: () => void;
}

export function PostComposer({ onPost }: PostComposerProps) {
  const user = useStore((s) => s.user);
  const lang = useStore((s) => s.language);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim() || posting) return;
    setPosting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      if (res.ok) {
        setContent("");
        if (onPost) onPost();
      }
    } catch {}
    setPosting(false);
  };

  if (!user) return null;

  return (
    <div className="flex gap-3 px-4 py-3 border-b border-[var(--border)]">
      <div className="flex-shrink-0">
        <UserAvatar username={user.username} displayName={user.displayName} size="md" />
      </div>
      <div className="flex-1 min-w-0">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t(lang, "composer", "placeholder")}
          className="w-full bg-transparent text-xl text-[var(--fg)] placeholder:text-[var(--muted)] resize-none focus:outline-none min-h-[56px] py-1 leading-6"
          rows={1}
          maxLength={500}
          style={{ wordBreak: "break-word" }}
        />
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
          {/* Action icons */}
          <div className="flex items-center gap-1 -ml-2">
            <button className="p-2 rounded-full text-[var(--accent)] hover:bg-[#1d9bf0]/10 transition-colors">
              <ImageIcon className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full text-[var(--accent)] hover:bg-[#1d9bf0]/10 transition-colors">
              <Smile className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full text-[var(--accent)] hover:bg-[#1d9bf0]/10 transition-colors">
              <ListTodo className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full text-[var(--accent)] hover:bg-[#1d9bf0]/10 transition-colors">
              <CalendarDays className="h-5 w-5" />
            </button>
            <span className="text-xs text-[var(--muted)] ml-2">
              {500 - content.length}
            </span>
          </div>
          <button
            onClick={handlePost}
            disabled={!content.trim() || posting}
            className={`px-5 py-2 rounded-full text-[15px] font-bold transition-all duration-200 ${
              content.trim() && !posting
                ? "bg-[var(--accent)] text-white hover:bg-[#1a8cd8]"
                : "bg-[var(--accent)]/50 text-white/50 cursor-not-allowed"
            }`}
          >
            {posting ? "..." : t(lang, "composer", "post")}
          </button>
        </div>
      </div>
    </div>
  );
}
