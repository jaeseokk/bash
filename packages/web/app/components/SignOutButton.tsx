"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export interface SignOutButtonProps {}

const SignOutButton = ({}: SignOutButtonProps) => {
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
};

export default SignOutButton;
