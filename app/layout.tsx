import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mi-blog-three-lilac.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mi Blog",
    template: "%s | Mi Blog",
  },
  description: "Un blog sobre desarrollo web, tecnología y aprendizaje.",
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: siteUrl,
    siteName: "Mi Blog",
    title: "Mi Blog",
    description: "Un blog sobre desarrollo web, tecnología y aprendizaje.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mi Blog",
    description: "Un blog sobre desarrollo web, tecnología y aprendizaje.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}