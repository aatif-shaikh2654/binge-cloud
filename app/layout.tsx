import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/common/Sidebar";
import QueryProvider from "@/components/providers/QueryProvider";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Binge Cloud - Experience the Speed of Cloud",
  description:
    "Binge Cloud offers ultra-fast cloud services with a focus on speed and reliability.",
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
        <Sidebar />
        <main className="flex-1 min-w-0 lg:pl-20 pb-16 lg:pb-0">
          <QueryProvider>{children}</QueryProvider>
        </main>
      </body>
    </html>
  );
}
