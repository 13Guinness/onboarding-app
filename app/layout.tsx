import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Automation Audit | Discover Your Potential",
  description: "Free 10-minute audit reveals your top 10 AI automation opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${geist.variable} antialiased bg-[#0a0a0a] text-white`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
