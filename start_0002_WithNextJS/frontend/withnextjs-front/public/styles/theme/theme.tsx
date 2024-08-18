import { createTheme } from "@mui/material";
import { CSSProperties } from "react";

/******************** style ********************/
export type STYLE = {
  [key in string]: CSSProperties | { [key in string]: CSSProperties };
};

/******************** theme ********************/
declare module "@mui/material/styles" {
  interface Palette {
    tableHeader: Palette["primary"];
    button: Palette;
  }

  interface PaletteOptions {
    tableHeader?: PaletteOptions["primary"];
    button?: PaletteOptions;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#674188",
    },
    secondary: {
      main: "#F7EFE5",
    },
    tableHeader: {
      main: "#B692C2",
    },
    button: {
      primary: {
        main: "#B692C2",
      },
      secondary: {
        main: "#FF8343",
      },
      warning: {
        main: "#EF5A6F",
      },
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});
