"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import AvatarButton from "./AvatarButton";

export interface SignInButtonProps {}

const SignInButton = ({}: SignInButtonProps) => {
  const session = useSession();
  const pathname = usePathname();

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
