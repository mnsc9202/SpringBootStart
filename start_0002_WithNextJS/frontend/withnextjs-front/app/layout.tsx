"use client";

import { ReactNode } from "react";
import Header from "./_layout/header";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/public/styles/theme/theme";
import "@/public/styles/global.css";

// props
type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
      <body>
        {/* 테마 provider */}
        <ThemeProvider theme={theme}>
          {/* 헤더 */}
          <Header />

          {/* 내용 */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
