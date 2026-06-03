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
  const [focused, setFocused] = useState(false);

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
    <div className="flex gap-3 px-4 py-3" style={{ borderBottom: `1px solid var(--border)` }}>
      <div className="flex-shrink-0 pt-1">
        <UserAvatar username={user.username} displayName={user.displayName} size="md" />
      </div>
      <div className="flex-1 min-w-0">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t(lang, "composer", "placeholder")}
          className="w-full bg-transparent text-xl resize-none focus:outline-none min-h-[52px] py-1 leading-6"
          style={{
            color: "var(--fg)",
          }}
          rows={1}
          maxLength={500}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {(focused || content.length > 0) && (
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid var(--border)` }}>
            {/* Action icons */}
            <div className="flex items-center gap-0.5 -ml-2">
              <button className="p-2 rounded-full transition-colors"
                style={{ color: "var(--accent)" }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--accent-light)"; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <ImageIcon className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full transition-colors"
                style={{ color: "var(--accent)" }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--accent-light)"; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <Smile className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full transition-colors"
                style={{ color: "var(--accent)" }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--accent-light)"; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <ListTodo className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full transition-colors"
                style={{ color: "var(--accent)" }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--accent-light)"; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <CalendarDays className="h-5 w-5" />
              </button>
              <span className="text-[13px] ml-3" style={{ color: "var(--fg-secondary)" }}>
                {500 - content.length}
              </span>
            </div>
            <button
              onClick={handlePost}
              disabled={!content.trim() || posting}
              className="px-5 py-2 rounded-full text-[15px] font-bold transition-all duration-200"
              style={{
                backgroundColor: content.trim() && !posting ? "var(--fg)" : "transparent",
                color: content.trim() && !posting ? "var(--bg-primary)" : "var(--fg-secondary)",
                border: content.trim() && !posting ? "none" : "1px solid var(--border)",
                opacity: content.trim() && !posting ? 1 : 0.5,
              }}
              onMouseOver={(e) => {
                if (content.trim() && !posting) e.currentTarget.style.opacity = "0.9";
              }}
              onMouseOut={(e) => {
                if (content.trim() && !posting) e.currentTarget.style.opacity = "1";
              }}
            >
              {posting ? "..." : t(lang, "composer", "post")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
