import type { Metadata } from "next";
import { Inter, Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import { Nav } from "@/components/shared/nav";
import { TopBar } from "@/components/shared/top-bar";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "blogger",
  description:
    "AI-powered content management system for UPSC blog production. Write, review, and publish with intelligent agent assistance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <div className="flex min-h-screen">
            <Nav />
            <div className="flex-1 ml-[260px] flex flex-col">
              <TopBar />
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
