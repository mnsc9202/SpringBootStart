"use client";

import useSWR from "swr";
import { Box, Button } from "@mui/material";
import ListTable, { ROWINFO } from "../components/listTable";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import PageContainer from "../_layout/pageContainer";
import { boardFetcher } from "../api/boardService";
import { POST } from "../post/page";
import { STYLE } from "@/public/styles/theme/theme";

/******************** type ********************/
/** Base (기본) */
type BASE = {
  createdBy: string; // 생성자
  createdDate: Date; // 생성일
  lastModifiedBy: string; // 수정자
  lastModifiedDate: Date; // 수정일
};

/** Board (게시판) */
export type BOARD = {
  [index: string]: number | string | POST[] | Date | boolean;
  id: number; // 게시판 id
  name: string; // 게시판 이름
  posts: POST[]; // 게시글 목록
} & BASE;

/******************** style ********************/
const style: STYLE = {
  btnWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 1,
    padding: 1,
  },
  registerBtn: {
    backgroundColor: "button.primary.main",
    "&:hover": {
      backgroundColor: "button.primary.main",
    },
  },
};
export default function Board() {
  /******************** info ********************/
  const pathname = usePathname(); // path
  const router = useRouter(); // router
  // 행 정보
  const rowInfo = useMemo<ROWINFO[]>(
    () =>
      [
        ["name", "게시판 이름", "100%"],
        ["posts", "게시글 수", 100],
        ["createdDate", "생성일", 200],
      ].map((el: (string | number)[]) => ({
        type: el[0] as string,
        description: el[1] as string,
        width: el[2],
      })),
    []
  );

  /******************** func ********************/
  // row 클릭시
  const onRowClick = useCallback(
    (data: BOARD | POST) => (_event: React.MouseEvent<HTMLTableRowElement>) => {
      router.push(`/board/${data.id}`);
    },
    [router]
  );

  /******************** swr ********************/
  const { data, error, isLoading } = useSWR<BOARD[], Error>(
    `${process.env.NEXT_PUBLIC_API_HOST}/board`,
    (url: string) => boardFetcher(url, "GET")
  );

  return (
    <PageContainer>
      {/* 목록 */}
      <ListTable
        rowData={data ?? []}
        rowInfo={rowInfo}
        onRowClick={onRowClick}
        isLoading={isLoading}
      />

      <Box sx={style.btnWrapper}>
        {/* 등록 버튼 */}
        <Link href={`${pathname}/register`}>
          <Button variant="contained" sx={style.registerBtn}>
            등록
          </Button>
        </Link>
      </Box>
    </PageContainer>
  );
}
