import { STYLE } from "@/public/styles/theme/theme";
import { Box } from "@mui/material";
import { ReactNode } from "react";

/******************** style ********************/
const style: STYLE = {
  layoutContainer: {
    display: "flex",
    gap: 5,
    "& > div": {
      flexGrow: 1,
      width: "50%",
    },
  },
};

// props
type FileLayoutProps = {
  children: ReactNode;
  list: ReactNode;
  register: ReactNode;
};

export default function FileLayout({
  children,
  list,
  register,
}: FileLayoutProps) {
  return (
    <>
      {children}
      <Box sx={style.layoutContainer}>
        <Box>{list}</Box>
        <Box>{register}</Box>
      </Box>
    </>
  );
}
