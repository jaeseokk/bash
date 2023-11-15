"use client";

import * as React from "react";
import { SessionProvider as _SessionProvider } from "next-auth/react";

export interface SessionProviderProps {
  children: React.ReactNode;
}

const SessionProvider = ({ children }: SessionProviderProps) => {
  return <_SessionProvider>{children}</_SessionProvider>;
};

export default SessionProvider;
