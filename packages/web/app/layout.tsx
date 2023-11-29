import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import SignOutButton from "./components/SignOutButton";
import Link from "next/link";
import { getServerSession } from "@/server/auth";
import Avatar from "@/assets/avatar.svg";
import AvatarButton from "./components/AvatarButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bash",
  description: "...",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <SessionProvider>
          <div className="relative flex min-h-screen flex-col">
            <header className="w-full bg-transparent">
              <div className="container flex h-14 items-center justify-between">
                <nav className="flex w-1/4 items-center space-x-6 text-sm font-medium">
                  <Button variant="ghost" size="no-horizontal-padding" asChild>
                    <Link href="/events/new">Create Event</Link>
                  </Button>
                </nav>
                <div className="flex w-1/2 items-center justify-center">
                  <Link href="/">
                    <div className="font-bold">BASH</div>
                  </Link>
                </div>
                <div className="flex w-1/4 items-center justify-end">
                  {session ? (
                    <AvatarButton />
                  ) : (
                    <Button
                      variant="ghost"
                      size="no-horizontal-padding"
                      asChild
                    >
                      <Link href="/signin">Sign In</Link>
                    </Button>
                  )}
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
