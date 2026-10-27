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
  const content = (
    <html lang="en" className="dark">
      <body className={`${geist.variable} antialiased bg-[#0a0a0a] text-white`}>
        {children}
      </body>
    </html>
  );

  // Preview builds do not receive the production Clerk key. Skip the provider
  // so static page generation can finish. Production still has the key.
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return content;
  }

  return <ClerkProvider>{content}</ClerkProvider>;
}
