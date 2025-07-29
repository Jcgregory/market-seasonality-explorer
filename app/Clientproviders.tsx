"use client";

import { ReactNode } from "react";
import { ColorModeProvider } from "./ColorModeContext";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ColorModeProvider>
      {children}
    </ColorModeProvider>
  );
}
