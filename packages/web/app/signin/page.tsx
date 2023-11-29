"use client";

import LoginForm from "./components/LoginForm";
import * as React from "react";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.replace("/");
    }
  }, [router, session.status]);

  return (
    <main className="flex flex-col items-center justify-center pt-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Sign In</h1>
      </div>
      <div className="mt-4">
        <LoginForm
          onSubmit={(data) => {
            return signIn("credentials", {
              redirect: false,
              ...data,
            });
          }}
        />
      </div>
    </main>
  );
}
