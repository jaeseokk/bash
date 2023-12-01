"use client";

import LoginForm from "./components/LoginForm";
import * as React from "react";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { redirect, useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

export default function LoginPage({
  searchParams: { callbackUrl },
}: {
  searchParams: {
    callbackUrl?: string;
  };
}) {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.replace(callbackUrl ?? "/");
    }
  }, [session.status]);

  return (
    <main className="flex flex-col items-center justify-center pt-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Sign In</h1>
      </div>
      <div className="mt-4">
        <LoginForm
          onSubmit={async (data) => {
            return signIn("credentials", {
              redirect: false,
              ...data,
            });
          }}
          onCallback={() => {
            router.replace(callbackUrl ?? "/");
          }}
        />
      </div>
    </main>
  );
}
