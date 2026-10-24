import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "../features/auth";

export function AppProviders({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          duration={4000}
          toastOptions={{
            className:
              "rounded-md border border-border bg-surface text-ink font-sans text-body-sm shadow-overlay",
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
