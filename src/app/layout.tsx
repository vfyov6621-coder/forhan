import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forhan — Социальная сеть",
  description: "Forhan — место для общения и обмена мыслями.",
  keywords: ["Forhan", "social network", "социальная сеть"],
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
