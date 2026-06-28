import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/app/components/AuthProvider";
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
  title: "Rifqi | Realtime Collaborative Notes",
  description:
    "Aplikasi catatan kolaboratif realtime dengan Next.js, TypeScript, MongoDB, dan Socket.IO.",
  icons: {
    icon: [{ url: "/icons/logoKibot.png", type: "image/png" }],
    shortcut: [{ url: "/icons/logoKibot.png", type: "image/png" }],
    apple: [{ url: "/icons/logoKibot.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-slate-50 font-sans text-slate-950 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
