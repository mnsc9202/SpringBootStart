"use client";

import { Box, Button, TextField } from "@mui/material";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { GLOBAL_EXCEPTION, userService } from "../../_api/userService";
import { STYLE } from "@/public/styles/theme/theme";
import { useRouter } from "next/navigation";

/******************** style ********************/
const style: STYLE = {
  rootWrapper: {
    marginTop: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 1,
  },
  btnWrapper: {
    marginTop: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  error: {
    color: "error.main",
    fontWeight: "bold",
    fontSize: 12,
    whiteSpace: "nowrap",
  },
};

/******************** type ********************/
/** 회원가입 에러정보 */
type SIGNUPINFO_ERROR = {
  errMsg: string; // 에러 메시지
};
/** 회원가입 상세정보 */
type SIGNUPINFO_DETAIL = {
  value: string; // 값
  error?: SIGNUPINFO_ERROR; // 에러 정보
};
/** 회원가입 정보 */
type SIGNUPINFO = {
  userId: SIGNUPINFO_DETAIL; // 아이디
  password: SIGNUPINFO_DETAIL; // 비밀번호
  name: SIGNUPINFO_DETAIL; // 이름
};

/** 회원가입 입력 아이템 */
type SIGNUP_INPUT_ITEM = {
  errorKey: string; // error key
  title: string; // 타이틀
  type?: string; // 종류
  size: "medium" | "small"; // input size
  value: string; // 값
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>; // change event
};

/******************** const ********************/
/** 회원가입 정보 초기값 */
const initSignUpInfo: SIGNUPINFO = {
  userId: { value: "" },
  password: { value: "" },
  name: { value: "" },
};

export default function SignUpForm() {
  /******************** info ********************/
  const [signUpInfo, setSignUpInfo] = useState<SIGNUPINFO>(initSignUpInfo); // 회원가입 정보
  const router = useRouter(); // router

  /******************** func ********************/
  // 회원가입정보 수정시
  const onChangeSignUpInfo = useCallback(
    (key: keyof SIGNUPINFO) => (event: React.FocusEvent<HTMLInputElement>) => {
      const changeValue: string = event.currentTarget.value; // 변경값

      // 변경
      setSignUpInfo((prev: SIGNUPINFO) => {
        // 변경 대상
        const changeTarget: SIGNUPINFO_DETAIL = prev[key];

        return {
          ...prev,
          [key]: { ...changeTarget, value: changeValue },
        };
      });
    },
    []
  );

  // 회원가입 성공시
  const onSuccessSignUp = useCallback(() => {
    // 메인 페이지로 이동
    router.push("/");
  }, [router]);

  // 회원가입 실패시
  const onFailSignUp = useCallback(
    (response: GLOBAL_EXCEPTION[] | GLOBAL_EXCEPTION) => {
      // 에러 내용 초기화
      setSignUpInfo((prev: SIGNUPINFO) => {
        return Object.keys(prev).reduce(
          (prevItem: SIGNUPINFO, currentItem: string) => {
            const key: keyof SIGNUPINFO = currentItem as keyof SIGNUPINFO;
            const target: SIGNUPINFO_DETAIL = prevItem[key];
            return { ...prevItem, [key]: { ...target, error: { errMsg: "" } } };
          },
          prev
        );
      });

      // response 타입에 따른 분기처리
      if (response instanceof Array) {
        // 에러 내용 조회
        response.forEach((el: GLOBAL_EXCEPTION) => {
          const key: keyof SIGNUPINFO = el.code as keyof SIGNUPINFO;

          // 에러 정보 설정
          setSignUpInfo((prev: SIGNUPINFO) => {
            const target: SIGNUPINFO_DETAIL = prev[key];
            return {
              ...prev,
              [key]: {
                ...target,
                error: { ...target.error, errMsg: el.message },
              },
            };
          });
        });
      } else {
        const key: keyof SIGNUPINFO = response.code as keyof SIGNUPINFO;

        // 에러 정보 설정
        setSignUpInfo((prev: SIGNUPINFO) => {
          const target: SIGNUPINFO_DETAIL = prev[key];
          return {
            ...prev,
            [key]: {
              ...target,
              error: { ...target.error, errMsg: response.message },
            },
          };
        });
      }
    },
    []
  );

  // 회원가입버튼 클릭시
  const onSignUpBtnClick = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement>) => {
      // 1. 입력값 검증
      if (
        !signUpInfo.name.value.trim() ||
        !signUpInfo.userId.value.trim() ||
        !signUpInfo.password.value.trim()
      )
        return;

      // 2. 회원가입정보 저장
      userService.saveUser(
        {
          userId: signUpInfo.userId.value,
          password: signUpInfo.password.value,
          name: signUpInfo.name.value,
        },
        onSuccessSignUp,
        onFailSignUp
      );
    },
    [onFailSignUp, onSuccessSignUp, signUpInfo]
  );

  // 회원가입 입력 목록
  const signUpInputList = useMemo<SIGNUP_INPUT_ITEM[]>(
    () => [
      {
        errorKey: "userId",
        title: "아이디",
        size: "small",
        value: signUpInfo.userId.value,
        onChange: onChangeSignUpInfo("userId"),
      },
      {
        errorKey: "password",
        title: "비밀번호",
        type: "password",
        size: "small",
        value: signUpInfo.password.value,
        onChange: onChangeSignUpInfo("password"),
      },
      {
        errorKey: "name",
        title: "이름",
        size: "small",
        value: signUpInfo.name.value,
        onChange: onChangeSignUpInfo("name"),
      },
    ],
    [
      onChangeSignUpInfo,
      signUpInfo.name,
      signUpInfo.password,
      signUpInfo.userId,
    ]
  );

  return (
    <Box sx={style.rootWrapper}>
      {/* 입력 목록 */}
      {signUpInputList.map((item: SIGNUP_INPUT_ITEM, index: number) => {
        return (
          <Box
            key={`${item.title}_${index}`}
            sx={{ minWidth: 200, maxWidth: 200 }}
          >
            {/* 타이틀 */}
            <Box>{item.title}</Box>

            {/* 입력 */}
            <TextField
              size={item.size}
              type={item.type}
              value={item.value}
              onChange={item.onChange}
            />

            {/* 에러 정보 */}
            <Box sx={style.error}>
              {signUpInfo[item.errorKey as keyof SIGNUPINFO].error?.errMsg ??
                ""}
            </Box>
          </Box>
        );
      })}

      {/* 버튼 목록 */}
      <Box sx={style.btnWrapper}>
        <Button variant="contained" onClick={onSignUpBtnClick}>
          가입
        </Button>
        <Link href={"/"}>
          <Button variant="contained">취소</Button>
        </Link>
      </Box>
    </Box>
  );
}
