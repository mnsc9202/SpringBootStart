"use client";

import { Box, Button, TextField } from "@mui/material";
import Link from "next/link";
import { useCallback, useState } from "react";
import { GLOBAL_EXCEPTION, userService } from "../../_api/userService";
import { useDispatch } from "react-redux";
import { Action, Dispatch } from "redux";
import { USER_INFO, userInfo } from "../../_store/userInfo";
import { useRouter } from "next/navigation";
import { STYLE } from "@/public/styles/theme/theme";

/******************** style ********************/
const style: STYLE = {
  rootWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    marginTop: 10,
    width: "100%",
  },
  itemWrapper: {
    width: "80%",
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
  itemTitle: {
    minWidth: 70,
    display: "flex",
    justifyContent: "center",
    fontWeight: "bold",
    color: "secondary.main",
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "secondary.main",
    color: "primary.main",
    fontWeight: "bold",
  },
  linkWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    fontSize: 12,
    color: "secondary.main",
  },
  textFieldWrapper: {
    width: "100%",
  },
  textField: {
    width: "100%",
    "& .MuiInputBase-root": {
      color: "secondary.main",
    },
  },
  errorMsg: {
    color: "red",
  },
};

/******************** type ********************/
/** 로그인 정보 */
type SIGNININFO = {
  userId: string; // 아이디
  password: string; // 비밀번호
  errorMsg: string; // 에러 메시지
};

/******************** const ********************/
/** 로그인 정보 초기값 */
const initSignInInfo: SIGNININFO = {
  userId: "",
  password: "",
  errorMsg: "",
};

export default function SignInForm() {
  /******************** info ********************/
  const [signInInfo, setSignInInfo] = useState<SIGNININFO>(initSignInInfo); // 로그인 정보
  const router = useRouter(); // router

  /******************** store ********************/
  const disPatch: Dispatch<Action> = useDispatch();

  /******************** func ********************/
  // 로그인 입력정보 수정시
  const onChangeSignInInfo = useCallback(
    (key: keyof SIGNININFO) => (event: React.FocusEvent<HTMLInputElement>) => {
      const changeValue: string = event.currentTarget.value; // 변경값

      // 변경
      setSignInInfo((prev: SIGNININFO) => ({
        ...prev,
        [key]: changeValue,
        errorMsg: "",
      }));
    },
    []
  );

  // 로그인 성공시
  const onSuccessSignIn = useCallback(
    (data: USER_INFO) => {
      // 로그인 정보 저장
      disPatch(userInfo.actions.setUserInfo(data));

      // 이동
      router.replace("/main");
    },
    [disPatch, router]
  );

  // 로그인 실패시
  const onFailSignIn = useCallback(
    (exception?: GLOBAL_EXCEPTION | GLOBAL_EXCEPTION[]) => {
      if (!exception) return;

      // 입력폼 관련 오류인 경우
      if (exception instanceof Array) {
        // 첫번째 메시지만 표시
        setSignInInfo((prev: SIGNININFO) => ({
          ...prev,
          errorMsg: exception[0].message,
        }));
      } else {
        // 사용자 정보 관련 오류인 경우
        setSignInInfo((prev: SIGNININFO) => ({
          ...prev,
          errorMsg: exception.message,
        }));
      }
    },
    []
  );

  // 로그인 버튼 클릭시
  const onSignInBtnClick = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement>) => {
      // 1. 입력값 검증
      if (!signInInfo.userId || !signInInfo.password) return;

      // 2. 로그인
      userService.logInUser(signInInfo, onSuccessSignIn, onFailSignIn);
    },
    [onFailSignIn, onSuccessSignIn, signInInfo]
  );

  return (
    <Box sx={style.rootWrapper}>
      <Box sx={style.itemWrapper}>
        <Box sx={style.itemTitle}>아이디</Box>
        <Box sx={style.textFieldWrapper}>
          <TextField
            size="small"
            value={signInInfo.userId}
            onChange={onChangeSignInInfo("userId")}
            sx={style.textField}
            color="secondary"
            variant="standard"
          />
        </Box>
      </Box>

      <Box sx={style.itemWrapper}>
        <Box sx={style.itemTitle}>비밀번호</Box>
        <Box sx={style.textFieldWrapper}>
          <TextField
            size="small"
            type="password"
            value={signInInfo.password}
            onChange={onChangeSignInInfo("password")}
            sx={style.textField}
            color="secondary"
            variant="standard"
          />
        </Box>
      </Box>

      {/* 에러 문구 */}
      <Box sx={style.errorMsg}>{signInInfo.errorMsg}</Box>

      {/* 로그인 버튼 */}
      <Button
        variant="contained"
        sx={style.loginBtn}
        onClick={onSignInBtnClick}
      >
        로그인
      </Button>

      {/* 링크 모음 */}
      <Box sx={style.linkWrapper}>
        <Link href={"/signup"}>회원가입</Link>
      </Box>
    </Box>
  );
}
