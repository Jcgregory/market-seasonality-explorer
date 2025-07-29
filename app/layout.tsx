// app/layout.tsx
//import type { Metadata } from "next";
import './globals.css';
import { Geist, Geist_Mono } from "next/font/google";
import ClientProviders from "./Clientproviders"; // ✅ Importing from separate file

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

{/*export const metadata: Metadata = {
  title: "Market Seasonality Explorer",
  description: "Explore volatility, liquidity, and performance over time",
};*/}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
