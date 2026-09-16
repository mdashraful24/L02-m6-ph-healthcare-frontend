"use client";

import { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import GoogleAuthProvider from "./google-auth.provider";
import QueryProviders from "./query.provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleAuthProvider>
      <QueryProviders>
        <TooltipProvider>{children}</TooltipProvider>
      </QueryProviders>
    </GoogleAuthProvider>
  );
}
