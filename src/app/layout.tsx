import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "予定調整",
  description: "ログイン不要で回答できる予定調整アプリ"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

