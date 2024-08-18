import { STYLE } from "@/public/styles/theme/theme";
import { Box } from "@mui/material";
import { ReactNode } from "react";

/******************** style ********************/
const style: STYLE = {
  pageContainer: {
    padding: 1,
    display: "flex",
    justifyContent: "center",
  },
  pageWrapper: {
    width: "80%",
  },
};

// props
type PageContainerProps = {
  children: ReactNode;
};
export default function PageContainer({ children }: PageContainerProps) {
  return (
    <Box sx={style.pageContainer}>
      <Box sx={style.pageWrapper}>{children}</Box>
    </Box>
  );
}
