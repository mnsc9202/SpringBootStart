import { Box } from "@mui/material";
import SignUpForm from "../components/signUpForm";
import { STYLE } from "@/public/styles/theme/theme";

/******************** style ********************/
const style: STYLE = {
  titleWrapper: {
    marginTop: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "cneter",
  },
  title: {
    color: "primary.main",
    fontSize: 30,
    fontWeight: "bold",
    padding: 1,
    margin: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "cneter",
  },
};

export default function SignUp() {
  return (
    <>
      {/* 타이틀 */}
      <Box sx={style.titleWrapper}>
        <Box sx={style.title}>회원가입</Box>
      </Box>

      {/* 회원가입 폼 */}
      <SignUpForm />
    </>
  );
}
