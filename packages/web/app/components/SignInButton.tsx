"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import AvatarButton from "./AvatarButton";
import { useEffect, useRef } from "react";
import ky from "ky";

export interface SignInButtonProps {}

const SignInButton = ({}: SignInButtonProps) => {
  const updated = useRef(false);
  const session = useSession();
  const pathname = usePathname();

  // TEMP: update avatar fallback
  useEffect(() => {
    const updateAvatarFallback = async () => {
      if (
        session.status === "authenticated" &&
        !session.data?.user.avatarFallback &&
        !updated.current
      ) {
        const res = await ky.get(`/api/user`);
        const user = await res.json<{ avatarFallback?: string | null }>();

        if (!user.avatarFallback) {
          return;
        }

        await session.update({
          avatarFallback: user.avatarFallback,
        });
        updated.current = true;
      }
    };

    updateAvatarFallback();
  }, [session]);

  if (session.status === "loading") {
    return null;
  }

  if (session.status === "authenticated") {
    return <AvatarButton user={session.data.user} />;
  }

  return (
    <Button variant="outline" size="sm" asChild>
      <Link
        href={{
          pathname: "/signin",
          query: {
            callbackUrl: pathname,
          },
        }}
      >
        Login
      </Link>
    </Button>
  );
};

export default SignInButton;
