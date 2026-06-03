"use client";

interface UserAvatarProps {
  username: string;
  displayName?: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-20 w-20 text-xl",
};

export function UserAvatar({
  username,
  displayName,
  avatarUrl,
  size = "md",
  className = "",
  onClick,
}: UserAvatarProps) {
  const initials = (displayName || username || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`relative flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white ${sizeMap[size]} ${className}`}
      style={{ background: "var(--accent)" }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={displayName || username}
          className="rounded-full object-cover h-full w-full"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
