import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Lexend_Giga, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import type { ReactNode } from "react";
import { SITE_DESCRIPTION, SITE_NAME } from "@/config/site";
import { env } from "@/lib/env";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const lexendGiga = Lexend_Giga({
  variable: "--font-lexend-giga",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
});

// トピックの代表意見など、引用文を明朝体で表示するために使用
const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const isDev = process.env.NODE_ENV === "development";
const isStaging = process.env.VERCEL_TARGET_ENV === "staging";
const ogImage = {
  url: "/ogp.jpg",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME}のOGPイメージ`,
};

export const metadata: Metadata = {
  metadataBase: new URL(env.webUrl),
  // 各ページは自分の見出しだけを title に入れ、サービス名は template で付ける。
  // ページごとに "〜 | サービス名" を直書きすると、名称変更のとき取りこぼす。
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [SITE_NAME, "議案", "政治", "日本", "政策", "解説", "南魚沼市"],
  icons: {
    icon: isDev
      ? "/icons/pwa/icon_dev_192_v3.png"
      : isStaging
        ? "/icons/pwa/icon_staging_192.png"
        : "/icons/pwa/icon_android_192.png",
    apple: isStaging
      ? "/icons/pwa/icon_staging_ios.png"
      : "/icons/pwa/icon_ios.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [ogImage],
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [ogImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2aa693",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} ${lexendGiga.variable} ${notoSerifJP.variable} font-sans antialiased bg-mirai-surface-light`}
      >
        <NextTopLoader showSpinner={false} color="#2aa693" />
        {children}
      </body>
    </html>
  );
}
