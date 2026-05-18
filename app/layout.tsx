import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NBA速報 - Paint Area",
  description: "最新NBAニュースを日本語でお届け",
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
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}