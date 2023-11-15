"use client";

import * as React from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface LogoutButtonProps {}

const LogoutButton = ({}: LogoutButtonProps) => {
  const { status } = useSession();

  if (status === "unauthenticated") {
    return (
      <Button variant="ghost" asChild>
        <Link href="/signin">Sign In</Link>
      </Button>
    );
  } else if (status === "authenticated") {
    return (
      <Button
        variant="ghost"
        onClick={() => {
          return signOut();
        }}
      >
        Sign Out
      </Button>
    );
  }

  return null;
};

export default LogoutButton;
