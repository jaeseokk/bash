import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SignInButton from "./components/SignInButton";

const Pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "system-ui",
    "Roboto",
    "Helvetica Neue",
    "Segoe UI",
    "Apple SD Gothic Neo",
    "Noto Sans KR",
    "Malgun Gothic",
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "sans-serif",
  ],
  adjustFontFallback: false,
  display: "optional",
});

export const metadata: Metadata = {
  title: "Bash",
  description: "...",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={Pretendard.className}>
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
