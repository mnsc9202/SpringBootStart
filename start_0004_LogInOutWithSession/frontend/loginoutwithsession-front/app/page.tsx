import { Box } from "@mui/material";
import SignInForm from "./components/signInForm";
import { STYLE } from "@/public/styles/theme/theme";

/******************** style ********************/
const style: STYLE = {
  rootContainer: { display: "flex", width: "100%", height: "100%" },
  leftWrapper: { width: "75%", backgroundColor: "secondary.main" },
  rightWrapper: { width: "25%", backgroundColor: "primary.main" },
};

export default function Home() {
  return (
    <Box sx={style.rootContainer}>
      {/* 좌측 */}
      <Box sx={style.leftWrapper} />

      {/* 우측 */}
      <Box sx={style.rightWrapper}>
        {/* 로그인 폼 */}
        <SignInForm />
      </Box>
    </Box>
  );
}
