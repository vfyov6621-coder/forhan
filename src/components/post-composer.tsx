"use client";

import { useState } from "react";
import { useStore } from "@/store";
import { t } from "@/lib/translations";
import { Send } from "lucide-react";

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
    <div className="border-b border-[var(--border)] p-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {user.displayName[0]?.toUpperCase() || "?"}
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t(lang, "composer", "placeholder")}
            className="w-full bg-transparent text-[15px] text-[var(--fg)] placeholder:text-[var(--muted)] resize-none focus:outline-none min-h-[60px] py-2"
            rows={2}
            maxLength={500}
          />
          <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 mt-1">
            <span className="text-xs text-[var(--muted)]">{content.length}/500</span>
            <button
              onClick={handlePost}
              disabled={!content.trim() || posting}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                content.trim() && !posting
                  ? "bg-[var(--accent)] text-white hover:opacity-90"
                  : "bg-[var(--accent)]/30 text-white/50 cursor-not-allowed"
              }`}
            >
              {posting ? "..." : t(lang, "composer", "post")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
