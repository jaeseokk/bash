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
    <main className="mx-auto flex max-w-[750px] flex-col items-center justify-center px-8 pt-10">
      <div className="w-full">
        <LoginForm
          onSubmit={async (data) => {
            return signIn("credentials", {
              redirect: false,
              ...data,
            });
          }}
          onCallback={() => {
            console.log("?");
            router.replace(callbackUrl ?? "/");
          }}
        />
      </div>
    </main>
  );
}
