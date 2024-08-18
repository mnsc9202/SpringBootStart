"use client";

import DetailForm from "@/app/_layout/detailForm";
import { postFetcher } from "@/app/api/postService";
import { useMemo } from "react";
import useSWR from "swr";
import { POST } from "../../page";

/******************** type ********************/
/** 게시글 상세 정보 */
export type POSTDETAIL_INFO = {
  type?: keyof POST; // 타입
} & {
  description: string; // 설명
  isImmutable: boolean; // 불변여부
};

/** 게시글 상세 */
export type POSTDETAIL = {
  value: POST[keyof POST];
} & POSTDETAIL_INFO;

// props
type PostDetailProps = {
  params: {
    boardId: string;
    postId: string;
  };
};

export default function PostDetail({ params }: PostDetailProps) {
  /******************** info ********************/
  // 게시글 상세 정보
  const postDetail_info = useMemo<POSTDETAIL_INFO[]>(
    () => [
      { type: "title", description: "제목", isImmutable: false },
      { type: "content", description: "내용", isImmutable: false },
    ],
    []
  );

  /******************** swr ********************/
  // 게시글 상세 조회
  const {
    data: postData,
    error,
    isLoading,
  } = useSWR<POST, Error>(
    `${process.env.NEXT_PUBLIC_API_HOST}/post/${params.boardId}/${params.postId}`,
    (url: string) => postFetcher(url, "GET")
  );

  return (
    <>
      <DetailForm
        data={postData}
        dataDetailInfo={postDetail_info}
        boardId={params.boardId}
        postId={params.postId}
        modifyFectcher={(body: string) =>
          postFetcher(`${process.env.NEXT_PUBLIC_API_HOST}/post`, "PUT", body)
        }
        deleteFectcher={() =>
          postFetcher(
            `${process.env.NEXT_PUBLIC_API_HOST}/post/${params.boardId}/${params.postId}`,
            "DELETE"
          )
        }
        isLoading={isLoading}
      />
    </>
  );
}
