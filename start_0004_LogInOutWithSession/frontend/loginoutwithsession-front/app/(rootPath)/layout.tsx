import { ReactNode } from "react";
import Header from "../components/layout/Header";
import { STYLE } from "@/public/styles/theme/theme";
import { Box } from "@mui/material";

/******************** style ********************/
const style: STYLE = {
  rootContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "90%",
  },
};

// props
type MainLayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      <Box sx={style.rootContainer}>{children}</Box>
    </>
  );
}
