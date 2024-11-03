"use client";

import { theme } from "@/public/styles/theme/theme";
import { ThemeProvider } from "@mui/material";
import { ReactNode } from "react";
import "@/public/styles/global.css";
import { Provider } from "react-redux";
import store from "../_store/store";

// props
type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
      <body>
        {/* Redux Tool Kit provider */}
        <Provider store={store}>
          {/* 테마 provider */}
          <ThemeProvider theme={theme}>
            {/* 내용 */}
            {children}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
