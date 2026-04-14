"use client";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider
      // Explicit base path keeps client fetches aligned with the API route
      basePath="/api/auth"
      // Avoid hammering /api/auth/session on every window focus —
      // reduces spurious CLIENT_FETCH_ERROR noise during development.
      refetchOnWindowFocus={false}
    >
      {children}
    </NextAuthSessionProvider>
  );
}
