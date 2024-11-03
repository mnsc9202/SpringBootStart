import { NextURL } from "next/dist/server/web/next-url";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

/******************** type ********************/
/** 사용자 인증 결과 상태 */
type AUTHENTICATION_STATUS = "success" | "fail" | "redirect" | "serverError";

/** 사용자 인증 결과 */
type AUTHENTICATION_RESULT = {
  status: AUTHENTICATION_STATUS;
  redirectUrl: string | null;
};

/******************** const ********************/
/** 사용자 api */
const userApi: string = process.env.NEXT_PUBLIC_USER_HOST ?? "";

/** middleware 설정 */
export const config = {
  matcher: [
    /*
     * 다음으로 시작하는 경로를 제외
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (metadata files)
     * - signup (회원가입 페이지)
     */
    {
      source: "/((?!_next/static|_next/image|favicon.ico|signup).*)",
    },
  ],
};

export async function middleware(request: NextRequest) {
  /******************** info ********************/
  const url: NextURL = request.nextUrl.clone(); // 요청 url
  const pathName: string = url.pathname; // path name
  const homePathName: string = "/"; // 홈 path
  const isHome: boolean = pathName === homePathName; // 홈 여부

  // 1. 쿠키 조회
  const cookieStore = cookies();
  const jSessionId: string | undefined = cookieStore.get("JSESSIONID")?.value;

  // 2. path 분기 처리
  // 쿠키가 있는 경우
  if (jSessionId) {
    // 2.1.1 사용자 인증 확인
    const authenticationResult: AUTHENTICATION_RESULT = await authentication(
      jSessionId
    );

    // 2.1.2 인증 결과 처리
    if (authenticationResult.status === "success") {
      return isHome
        ? NextResponse.redirect(
            new URL(authenticationResult.redirectUrl!, request.url)
          )
        : NextResponse.next();
    } else {
      return isHome
        ? NextResponse.next()
        : NextResponse.redirect(
            new URL(authenticationResult.redirectUrl!, request.url)
          );
    }
  } else {
    // 쿠키가 없는 경우
    return isHome
      ? NextResponse.next()
      : NextResponse.redirect(new URL(homePathName, request.url));
  }
}

// 사용자 인증 확인
const authentication = async (jSessionId: string) => {
  const result: AUTHENTICATION_RESULT = await axios
    .get(`${userApi}/authentication`, {
      headers: {
        Cookie: `JSESSIONID=${jSessionId}`,
      },
      withCredentials: true,
    })
    .then((_response) => {
      return {
        status: "success" as AUTHENTICATION_STATUS,
        redirectUrl: "/main",
      };
    })
    .catch((error) => {
      // 서버가 응답한 경우
      if (error.response) {
        return {
          status: "redirect",
          redirectUrl: error.response.headers["x-redirect-url"],
        };
      } else if (error.request) {
        // 요청o + 응답x
        return {
          status: "serverError",
          redirectUrl: "/",
        };
      } else {
        // 요청x
        return {
          status: "fail",
          redirectUrl: "/",
        };
      }
    });

  return result;
};
