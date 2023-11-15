import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import SignInButton from "./components/LogoutButton";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bash",
  description: "...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <div className="min-hscreen relative flex flex-col">
            <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center">
                  <Link href="/">
                    <div className="font-bold">BASH</div>
                  </Link>
                  <nav className="ml-4 flex items-center space-x-6 text-sm font-medium">
                    <Button variant="ghost" asChild>
                      <Link href="/events/new">Create Event</Link>
                    </Button>
                  </nav>
                </div>
                <div>
                  <SignInButton />
                </div>
              </div>
            </header>
            <div className="flex-1">{children}</div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
