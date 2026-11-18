import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { Brand, SessionBar } from "@/components/session-bar";
import { SiteFooter } from "@/components/site-footer";
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
  title: {
    default: "FaMed Zahnmedizin – Prüfungstraining",
    template: "%s – FaMed Zahnmedizin",
  },
  description:
    "Realistisches Training für die FaMed Zahnmedizin: Anamnesegespräch, Aufklärungsgespräch, Patientenvorstellung und Arztbrief mit KI-Gesprächspartnern und Auswertung.",
};

function HeaderFallback() {
  return (
    <header className="border-b border-border bg-card/80">
      <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-3">
        <Brand />
      </div>
    </header>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Suspense fallback={<HeaderFallback />}>
          <SessionBar />
        </Suspense>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
