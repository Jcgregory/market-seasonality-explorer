"use client";

import { createContext, useMemo, useState, ReactNode } from "react";
import { ThemeProvider, CssBaseline, createTheme, PaletteMode } from "@mui/material";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function ClientProviders({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
