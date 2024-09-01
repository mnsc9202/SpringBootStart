import { STYLE } from "@/public/styles/theme/theme";
import { Box } from "@mui/material";

/******************** style ********************/
const style: STYLE = {
  rootContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 3,
    padding: 1,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "primary.main",
    color: "primary.main",
    fontWeight: "bold",
    borderRadius: 5,
  },
};

export default function File() {
  return <Box sx={style.rootContainer}>파일</Box>;
}
