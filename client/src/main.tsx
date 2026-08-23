import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { AppProviders } from "./app/providers";
import { AuthInitializer } from "@/features/auth/components/AuthInitializer";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <AuthInitializer>
        <App />
      </AuthInitializer>
    </AppProviders>
  </StrictMode>,
);