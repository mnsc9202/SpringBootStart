"use client";

import { Box, TextField, Button } from "@mui/material";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback, useEffect } from "react";
import { BOARD } from "../board/page";
import { POST } from "../post/page";
import { STYLE } from "@/public/styles/theme/theme";

/******************** style ********************/
const style: STYLE = {
  rootContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  itemWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  itemTitle: {
    minWidth: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  btnWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 1,
    padding: 2,
  },
  contentWrapper: {
    marginTop: 5,
    padding: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 1,
  },
  commonBtn: {
    backgroundColor: "button.primary.main",
    "&:hover": {
      backgroundColor: "button.primary.main",
    },
  },
  registerBtn: {
    backgroundColor: "button.secondary.main",
  },
};

/******************** type ********************/
/** 등록 정보 */
type REGISTER_INFO = {
  description: string; // 설명
  value: string; // 값
  isView: boolean; // 표시여부
  isContainPayload: boolean; // payload에 포함여부
};
/** 게시판 등록 */
type BOARD_REGISTER = {
  name: REGISTER_INFO; // 게시판 이름
};
/** 게시글 등록 */
type POST_REGISTER = {
  title: REGISTER_INFO; // 제목
  content: REGISTER_INFO; // 내용
  boardId: REGISTER_INFO; // 게시판 id
};

/******************** init ********************/
/** 게시판 초기값 */
const initBoard: BOARD_REGISTER = {
  name: {
    description: "게시판 이름",
    value: "",
    isView: true,
    isContainPayload: true,
  },
};

/** 게시글 초기값 */
const initPost: POST_REGISTER = {
  title: {
    description: "제목",
    value: "",
    isView: true,
    isContainPayload: true,
  },
  content: {
    description: "내용",
    value: "",
    isView: true,
    isContainPayload: true,
  },
  boardId: {
    description: "게시판 id",
    value: "",
    isView: false,
    isContainPayload: true,
  },
};

// props
type RegisterFormProps = {
  boardId?: string;
  fectcher: (body: string) => Promise<BOARD | POST>;
};

export default function RegisterForm({ boardId, fectcher }: RegisterFormProps) {
  /******************** info ********************/
  const [registerData, setRegisterData] = useState<
    BOARD_REGISTER | POST_REGISTER
  >(boardId ? initPost : initBoard); // 등록 데이터
  const router = useRouter(); // router
  const pathName = usePathname(); // path
  // 원본 경로
  const originPath = useMemo<string>(() => {
    return `/${pathName.split("/")[1]}`;
  }, [pathName]);

  /******************** func ********************/
  // 입력값 변경시
  const onChangeInputValue = useCallback(
    (key: string) => (event: React.FocusEvent<HTMLInputElement>) => {
      const arrangeValue: string = event.currentTarget.value; // 변경값

      // 변경된 값만 수정
      setRegisterData((prev: BOARD_REGISTER | POST_REGISTER) => ({
        ...prev,
        [key]: {
          ...(prev[
            key as keyof (BOARD_REGISTER | POST_REGISTER)
          ] as REGISTER_INFO),
          value: arrangeValue,
        },
      }));
    },
    []
  );

  // 등록버튼 클릭시
  const onRegisterBtnClick = useCallback(() => {
    // 등록 요청 데이터
    const requestRegisterData = Object.keys(registerData).reduce(
      (prev: {}, current: string) => {
        const registerInfo: REGISTER_INFO =
          registerData[current as keyof (BOARD_REGISTER | POST_REGISTER)];

        // payload에 포함하지 않는 값 제외
        if (!registerInfo.isContainPayload) return prev;
        return Object.assign(prev, { [current]: registerInfo.value });
      },
      {}
    );

    // 등록
    fectcher(JSON.stringify(requestRegisterData)).then(() => {
      // 저장완료 후 페이지 이동
      router.push(originPath);
    });
  }, [fectcher, originPath, registerData, router]);

  // 목록버튼 클릭시
  const onMoveListBtnClick = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement>) => {
      router.push(originPath);
    },
    [router, originPath]
  );

  /******************** render ********************/
  // 초기 registerData 설정
  useEffect(() => {
    if (!boardId) return;
    setRegisterData((prev: BOARD_REGISTER | POST_REGISTER) => {
      const castingPrev: POST_REGISTER = prev as POST_REGISTER;
      return {
        ...castingPrev,
        boardId: { ...castingPrev.boardId, value: boardId },
      };
    });
  }, [boardId]);

  return (
    <Box sx={style.rootContainer}>
      {/* 내용 */}
      <Box sx={style.contentWrapper}>
        {Object.keys(registerData).map((key: string, index: number) => {
          const value: REGISTER_INFO =
            registerData[key as keyof (BOARD_REGISTER | POST_REGISTER)];
          if (!value.isView) return;
          return (
            <Box key={`${key}_${index}`} sx={style.itemWrapper}>
              {/* 구분 */}
              <Box sx={style.itemTitle}>{value.description}</Box>

              {/* 값 */}
              <TextField
                size="small"
                value={value.value}
                onChange={onChangeInputValue(key)}
              />
            </Box>
          );
        })}
      </Box>

      {/* 버튼 */}
      <Box sx={style.btnWrapper}>
        {/* 등록 버튼 */}
        <Button
          variant="contained"
          sx={style.registerBtn}
          onClick={onRegisterBtnClick}
        >
          등록
        </Button>

        {/* 목록 버튼 */}
        <Button
          variant="contained"
          sx={style.commonBtn}
          onClick={onMoveListBtnClick}
        >
          목록
        </Button>
      </Box>
    </Box>
  );
}
