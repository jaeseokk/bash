import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import SessionProvider from "../components/SessionProvider";
import Link from "next/link";
import SignInButton from "../components/SignInButton";
import LetsLogo from "@/assets/lets_logo.svg";
import AppProviders from "../components/AppProviders";
import { cn } from "@/utils";
import AlertDialogProvider from "@/components/AlertDialogProvider/AlertDialogProvider";
import { Toaster } from "@/components/ui/toaster";
import GoogleAnalytics from "@/components/GloogleAnalytics";

export const metadata: Metadata = {
  title: "렛츠 LET'S",
  description: "파티 누구나 쉽게, 누구나 멋지게",
  openGraph: {
    images: "https://lets.fyi/default_og2.png",
  },
};

const Pretendard = localFont({
  src: [
    {
      path: "../../public/fonts/Pretendard-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          Pretendard.className,
          "bg-[url('/images/main_background.png')] bg-cover bg-top bg-no-repeat",
        )}
      >
        <GoogleAnalytics />
        <AppProviders>
          <SessionProvider>
            <AlertDialogProvider>
              <div className="min-h-screen-ios relative flex flex-col">
                <header className="w-full bg-transparent">
                  <div className="container flex h-[5.25rem] items-center justify-between">
                    {/*<nav className="flex w-1/4 items-center space-x-6 text-sm font-medium">*/}
                    {/*  <Button*/}
                    {/*    variant="ghost"*/}
                    {/*    size="no-horizontal-padding"*/}
                    {/*    asChild*/}
                    {/*  >*/}
                    {/*    <Link href="/events/new">Create Event</Link>*/}
                    {/*  </Button>*/}
                    {/*</nav>*/}
                    <div className="w-1/4" />
                    <div className="flex w-1/2 items-center justify-center">
                      <Link href="/">
                        <LetsLogo />
                      </Link>
                    </div>
                    <div className="flex w-1/4 items-center justify-end">
                      <SignInButton />
                    </div>
                  </div>
                </header>
                <div className="flex-1">{children}</div>
              </div>
            </AlertDialogProvider>
            <Toaster />
          </SessionProvider>
        </AppProviders>
      </body>
    </html>
  );
}
