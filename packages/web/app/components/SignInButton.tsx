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

  if (session.status === "authenticated") {
    return <AvatarButton />;
  }

  return (
    <Button variant="ghost" size="no-horizontal-padding" asChild>
      <Link
        href={{
          pathname: "/signin",
          query: {
            callbackUrl: pathname,
          },
        }}
      >
        Sign In
      </Link>
    </Button>
  );
};

export default SignInButton;
