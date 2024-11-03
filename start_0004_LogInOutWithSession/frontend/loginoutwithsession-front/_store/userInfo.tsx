import { createSlice } from "@reduxjs/toolkit";

/******************** type ********************/
/** 사용자 정보 */
export type USER_INFO = {
  userId: string; // 아이디
  name: string; // 이름
};

/******************** const ********************/
// 사용자 초기 정보
const initUserInfo: USER_INFO = {
  userId: "",
  name: "",
};

// slice 생성
export const userInfo = createSlice({
  name: "userInfo",
  initialState: initUserInfo,
  reducers: {
    // 사용자 정보 설정
    setUserInfo(_state, action) {
      return action.payload;
    },
    // 사용자 정보 초기화
    resetUserInfo() {
      return initUserInfo;
    },
  },
});

// action export
export const { setUserInfo, resetUserInfo } = userInfo.actions;

// selector export
export const selectUserInfo = (state: { userInfo: USER_INFO }) =>
  state.userInfo;
