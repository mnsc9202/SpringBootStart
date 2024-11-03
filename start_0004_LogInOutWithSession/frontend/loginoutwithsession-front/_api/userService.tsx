import axios from "axios";

/******************** type ********************/
/** 사용자 요청 */
type USER_REQUEST_PAYLOAD = {
  userId: string; // 아이디
  password: string; // 비밀번호
};
/** 사용자 저장 요청 */
export type USER_SAVE_REQUEST_PAYLOAD = {
  name: string; // 이름
} & USER_REQUEST_PAYLOAD;

/** 사용자 로그인 요청 */
export type USER_LOGIN_REQUEST_PAYLOAD = USER_REQUEST_PAYLOAD;

/** 글로벌 예외 */
export type GLOBAL_EXCEPTION = {
  code: string;
  message: string;
};
/******************** const ********************/
/** 사용자 api */
const userApi: string = process.env.NEXT_PUBLIC_USER_HOST ?? "";

export const userService = {
  // 사용자 저장
  saveUser: async (
    requestPayload: USER_SAVE_REQUEST_PAYLOAD,
    successCallback: Function,
    failCallback: Function
  ) => {
    await axios
      .post(userApi, requestPayload)
      .then((result) => {
        // 저장에 실패한 경우
        if (result.status != 201) return;

        successCallback();
      })
      .catch((reason) => {
        const response = reason.response.data;
        failCallback(response);
      });
  },

  // 사용자 로그인
  logInUser: async (
    requestPayload: USER_LOGIN_REQUEST_PAYLOAD,
    successCallback: Function,
    failCallback: Function
  ) => {
    await axios
      .post(`${userApi}/login`, requestPayload, {
        withCredentials: true,
      })
      .then((result) => {
        // 로그인 실패한 경우
        if (!result.data) {
          failCallback();
          return;
        }

        // 로그인 성공한 경우
        successCallback(result.data);
      })
      .catch((error) => {
        // 서버가 응답하지 못한 경우
        if (!error.response) {
          failCallback({ code: "serverError", message: "서버 오류입니다!" });
          return;
        }

        // 서버가 응답한 경우
        failCallback(error.response.data);
      });
  },

  // 사용자 로그아웃
  logOutUser: async () => {
    let isLogOut: boolean = false;
    await axios
      .post(`${userApi}/logout`, undefined, { withCredentials: true })
      .then((result) => {
        if (result.status === 200) isLogOut = true;
      });
    return isLogOut;
  },

  // 사용자 인증 확인
  authentication: async () => {
    return await axios
      .get(`${userApi}/authentication`, {
        withCredentials: true,
      })
      .then((response) => {
        if (!response.data) return;
        return response.data;
      });
  },
};
