import { createTheme } from "@mui/material";
import { CSSProperties } from "react";

/******************** style ********************/
export type STYLE = {
  [key in string]: CSSProperties | { [key in string]: CSSProperties | STYLE };
};

/******************** theme ********************/
export const theme = createTheme({
  palette: {
    primary: {
      main: "#708871",
    },
    secondary: {
      main: "#FEF3E2",
    },
  },
});
