import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "오늘 할 일 - 할 일 관리 앱",
  description: "깔끔하고 세련된 디자인의 오늘 할 일 관리 서비스입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
