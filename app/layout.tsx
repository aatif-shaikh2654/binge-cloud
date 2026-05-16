import BravePrompt from "@/components/common/BravePrompt";
import DisableInspect from "@/components/common/DisableInspect";
import Footer from "@/components/common/Footer";
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
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  robots: {
    index: false,
    follow: false,
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
        <DisableInspect />
        <BravePrompt />
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
        <div className="flex-1 flex flex-col min-w-0 lg:pl-20">
          <main className="flex-1">
            <QueryProvider>{children}</QueryProvider>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
