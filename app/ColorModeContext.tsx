"use client";

import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline, createTheme, PaletteMode } from '@mui/material';

// Define the context type
interface ColorModeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

// Create the context
const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

// Custom hook to use the color mode context
export const useColorMode = (): ColorModeContextType => {
  const context = useContext(ColorModeContext);
  if (context === undefined) {
    throw new Error('useColorMode must be used within a ColorModeProvider');
  }
  return context;
};

// Provider component props
interface ColorModeProviderProps {
  children: React.ReactNode;
}

// Provider component
export const ColorModeProvider: React.FC<ColorModeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>('dark');

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
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
};

// Export the context for testing purposes
export { ColorModeContext }; 