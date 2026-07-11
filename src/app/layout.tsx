import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EscapeWeb — 퍼즐 이스케이프",
  description: "이 웹사이트는 웹 기반 방탈출 게임 사이트 입니다.",
  verification: {
    google: "_ka7K3u96ptcwhTRzPDETboSR5yE68xzKIrBb4XCvNw",
  },
};

// 모바일 브라우저(특히 Android Chrome)의 "웹 콘텐츠 강제 다크 모드" 기능이
// 이 사이트를 다크모드 미지원 페이지로 오인해 라이트 모드 화면까지 회색조로
// 자동 반전시키는 걸 막는다. 사이트가 두 색상 스킴을 직접 지원/관리한다고
// 명시적으로 선언해야 브라우저가 자체 강제 다크 처리를 건너뛴다.
export const viewport: Viewport = {
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} light-mode h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
