"use client";

import { selectUserInfo, USER_INFO, userInfo } from "@/_store/userInfo";
import { Avatar, Box, Menu, MenuItem, Theme, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, useCallback, useEffect, useState } from "react";
import { userService } from "@/_api/userService";
import { usePathname, useRouter } from "next/navigation";
import { STYLE } from "@/public/styles/theme/theme";
import Link from "next/link";
import { resetRouteCache } from "@/app/actions";
import { Action } from "redux";

// icons
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";

/******************** style ********************/
const style: STYLE = {
  container: {
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    gap: 1,
    padding: 1,
    backgroundColor: "secondary.main",
    height: 50,
  },
  userInfoWrapper: {
    minWidth: 300,
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    gap: 1,
  },
  userName: {
    color: "primary.main",
  },
  avatar: {
    backgroundColor: "primary.main",
    color: "white",
  },
  menuNavi: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    gap: 2,
    paddingLeft: 1,
    paddingRight: 1,

    "& > a": {
      minWidth: 70,
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontWeight: "bold",
      fontSize: 15,
    },
    "& > a:hover": {
      backgroundColor: "primary.main",
      color: "#fff",
    },
  },
};

export default function Header() {
  /******************** info ********************/
  const router = useRouter(); // router
  const pathName: string = usePathname(); // pathName
  const theme: Theme = useTheme(); // 테마

  /******************** store ********************/
  const user: USER_INFO = useSelector(selectUserInfo); // 사용자 정보
  const disPatch: Dispatch<Action> = useDispatch();

  /******************** store ********************/
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null); // 확장메뉴
  const open: boolean = Boolean(anchorEl); // 확장메뉴 open 여부

  /******************** func ********************/
  // 아바타버튼 클릭시
  const onAvatarBtnClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );

  // 닫기 handler
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // 로그아웃 버튼 클릭시
  const onLogoutBtnClick = useCallback(
    async (_event: React.MouseEvent<HTMLLIElement>) => {
      const isLogOut: boolean = await userService.logOutUser();
      if (!isLogOut) return;

      // 사용자 정보 초기화
      disPatch(userInfo.actions.resetUserInfo());

      // 페이지 이동
      router.push("/");

      // 캐시 초기화
      router.refresh();
    },
    [disPatch, router]
  );

  // 사용자 정보 조회
  const authentication = useCallback(async () => {
    // 1. 사용자 인증
    const result: USER_INFO = await userService.authentication();
    if (!result || !user) return;

    // 2. 사용자 정보 저장
    disPatch(userInfo.actions.setUserInfo(result));
  }, [disPatch, user]);

  /******************** render ********************/
  // 사용자 정보 초기화
  useEffect(() => {
    authentication();
  }, []);

  return (
    <Box sx={style.container}>
      {/* 메뉴 */}
      <Box sx={style.menuNavi}>
        <Link
          href={"/main"}
          onClick={() => {
            resetRouteCache();
          }}
          style={
            pathName.startsWith("/main")
              ? {
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }
              : undefined
          }
        >
          <HomeIcon />
          메인
        </Link>
        <Link
          href={"/sub"}
          onClick={() => {
            resetRouteCache();
          }}
          style={
            pathName.startsWith("/sub")
              ? {
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }
              : undefined
          }
        >
          <ArticleIcon />
          서브
        </Link>
      </Box>

      {/* 사용자 정보 옵션 */}
      <Box sx={style.userInfoWrapper}>
        <Box sx={style.userName}>{user.name}</Box>
        <Avatar onClick={onAvatarBtnClick} sx={style.avatar}></Avatar>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={onLogoutBtnClick}>로그아웃</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
