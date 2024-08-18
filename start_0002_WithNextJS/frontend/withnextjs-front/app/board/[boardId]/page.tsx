"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { BOARD } from "../page";
import DetailForm from "@/app/_layout/detailForm";
import { boardFetcher } from "@/app/api/boardService";

/******************** type ********************/
/** 게시판 상세 정보 */
export type BOARDDETAIL_INFO = {
  type?: keyof BOARD; // 타입
} & {
  description: string; // 설명
  isImmutable: boolean; // 불변여부
};

/** 게시판 상세 */
export type BOARDDETAIL = {
  value: BOARD[keyof BOARD];
} & BOARDDETAIL_INFO;

// props
type BoardDetailProps = {
  params: {
    boardId: string;
  };
};
export default function BoardDetail({ params }: BoardDetailProps) {
  /******************** info ********************/
  // 게시판 상세 정보
  const boardDetail_info = useMemo<BOARDDETAIL_INFO[]>(
    () => [
      { type: "name", description: "게시판이름", isImmutable: false },
      { type: "createdBy", description: "생성자", isImmutable: true },
      { type: "createdDate", description: "생성일", isImmutable: true },
      { type: "lastModifiedBy", description: "수정자", isImmutable: true },
      { type: "lastModifiedDate", description: "수정일", isImmutable: true },
    ],
    []
  );

  /******************** swr ********************/
  // 게시판 상세 조회
  const {
    data: boardData,
    error,
    isLoading,
  } = useSWR<BOARD, Error>(
    `${process.env.NEXT_PUBLIC_API_HOST}/board/${params.boardId}`,
    (url: string) => boardFetcher(url, "GET")
  );

  return (
    <>
      <DetailForm
        data={boardData}
        dataDetailInfo={boardDetail_info}
        boardId={params.boardId}
        modifyFectcher={(body: string) =>
          boardFetcher(`${process.env.NEXT_PUBLIC_API_HOST}/board`, "PUT", body)
        }
        deleteFectcher={() =>
          boardFetcher(
            `${process.env.NEXT_PUBLIC_API_HOST}/board/${params.boardId}`,
            "DELETE"
          )
        }
        isLoading={isLoading}
      />
    </>
  );
}
