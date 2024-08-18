type ERROR_CAUSE = {
  timestamp: string;
  status: number;
  error: string;
  path: string;
};

export const boardFetcher = async (
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: string
) => {
  // api 요청 및 response 반환
  const res = await fetch(url, {
    method: method,
    headers:
      method === "GET"
        ? undefined
        : {
            "Content-Type": "application/json",
          },
    body: body,
  });

  // api 오류인 경우
  if (!res.ok) {
    const error: Error = new Error("board API 오류 발생");

    error.cause = await res.json();
    (error.cause as ERROR_CAUSE).status = res.status;
    throw error;
  }

  // response가 없는 경우
  if (method === "PUT") return;

  // response가 있는 경우
  const resData = await res.json();
  return resData;
};
