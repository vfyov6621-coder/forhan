"use client";

interface SubscribedBadgeProps {
  size?: "sm" | "md";
  className?: string;
}

export function SubscribedBadge({ size = "md", className = "" }: SubscribedBadgeProps) {
  const sizeClasses = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full ${sizeClasses} ${className}`}
      style={{
        background: "linear-gradient(90deg, #1d9bf0, #ffffff, #1d9bf0, #ffffff, #1d9bf0)",
        backgroundSize: "200% 100%",
        animation: "shimmer-sub 2s linear infinite",
        boxShadow: "0 0 8px rgba(29, 155, 240, 0.4)",
      }}
      title="Подписка"
    >
      <svg
        viewBox="0 0 24 24"
        className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"}
        fill="none"
        stroke="#000"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z" />
      </svg>
    </span>
  );
}
