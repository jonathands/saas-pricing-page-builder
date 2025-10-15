"use client";

import { ReactNode, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      const message = args[0];
      if (
        typeof message === "string" &&
        (message.includes("defaultProps will be removed from function components") ||
          message.includes(
            "Support for defaultProps will be removed from function components"
          ) ||
          (message.includes("defaultProps") &&
            (message.includes("XAxis") || message.includes("YAxis"))))
      ) {
        return;
      }
      originalWarn.apply(console, args as []);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
