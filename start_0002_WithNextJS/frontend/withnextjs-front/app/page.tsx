"use client";

import { STYLE } from "@/public/styles/theme/theme";
import { Box } from "@mui/material";

/******************** style ********************/
const style: STYLE = {
  rootWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "85vh",
  },
};

export default function Home() {
  return <Box sx={style.rootWrapper}>HOME</Box>;
}
