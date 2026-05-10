import Sidebar from "@/components/common/Sidebar";
import QueryProvider from "@/components/providers/QueryProvider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Binge Cloud — Your Ultimate Cinematic Streaming Hub",
    template: "%s | Binge Cloud",
  },
  description:
    "Experience ultra-fast streaming and a curated library of trending movies and TV shows. Binge Cloud combines speed, reliability, and a premium cinematic interface for the modern viewer.",
  keywords: [
    "Binge Cloud",
    "Streaming",
    "Movies",
    "TV Shows",
    "Online Movies",
    "Cinematic Experience",
    "Ultra-fast Streaming",
  ],
  authors: [{ name: "Binge Cloud Team" }],
  openGraph: {
    title: "Binge Cloud — Your Ultimate Cinematic Streaming Hub",
    description:
      "Experience ultra-fast streaming and a curated library of trending movies and TV shows.",
    url: "",
    siteName: "Binge Cloud",
    images: [
      {
        url: "/bing-cloud.png",
        width: 1200,
        height: 630,
        alt: "Binge Cloud Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Binge Cloud — Your Ultimate Cinematic Streaming Hub",
    description:
      "Experience ultra-fast streaming and a curated library of trending movies and TV shows.",
    images: ["/bing-cloud.png"],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "dark", manrope.variable)}
    >
      <body
        className={cn(
          "min-h-full bg-background text-white flex flex-row overflow-x-hidden",
          manrope.className,
        )}
      >
        <NextTopLoader
          color="#2563eb"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2563eb,0 0 5px #2563eb"
        />
        <Sidebar />
        <main className="flex-1 min-w-0 lg:pl-20 pb-16 lg:pb-0">
          <QueryProvider>{children}</QueryProvider>
        </main>
      </body>
    </html>
  );
}
