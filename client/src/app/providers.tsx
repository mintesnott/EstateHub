import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { queryClient } from "@/lib/query-client";
import { ThemeProvider, useTheme } from "./theme/ThemeProvider";

interface AppProvidersProps {
  children: ReactNode;
}

function ToasterWithTheme() {
  const { theme } = useTheme();
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme={theme}
    />
  );
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
        <ToasterWithTheme />
      </ThemeProvider>
    </QueryClientProvider>
  );
}