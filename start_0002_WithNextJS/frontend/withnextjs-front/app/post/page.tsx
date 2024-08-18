"use client";

import {
  Select,
  SelectChangeEvent,
  MenuItem,
  Box,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useCallback, useMemo, useRef } from "react";
import useSWR, { mutate } from "swr";
import PageContainer from "../_layout/pageContainer";
import { boardFetcher } from "../api/boardService";
import { postFetcher } from "../api/postService";
import { BOARD } from "../board/page";
import ListTable, { ROWINFO } from "../components/listTable";
import { STYLE } from "@/public/styles/theme/theme";

// icons
import SearchIcon from "@mui/icons-material/Search";

/******************** type ********************/
/** Post (게시글) */
export type POST = {
  [index: string]: number | string;
  id: number; // 게시글 id
  title: string; // 제목
  content: string; // 내용
};

/** 게시판 정보 */
export type BOARD_INFO = {
  name: string;
  id: number;
};

/******************** style ********************/
const style: STYLE = {
  btnWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 1,
  },
  registerBtn: {
    backgroundColor: "button.primary.main",
    "&:hover": {
      backgroundColor: "button.primary.main",
    },
  },
  optionWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 1,
    marginBottom: 1,
  },
};

export default function Post() {
  /******************** info ********************/
  const pathname = usePathname(); // path
  const router = useRouter(); // router
  const [selectBoardId, setSelectBoardId] = useState<string>(""); // 선택한 게시판 id
  const searchKeywordRef = useRef<HTMLInputElement>(null); // 검색어 ref
  // 행 정보
  const rowInfo = useMemo<ROWINFO[]>(
    () =>
      [
        ["title", "제목", 300],
        ["content", "내용", "100%"],
      ].map((el: (string | number)[]) => ({
        type: el[0] as string,
        description: el[1] as string,
        width: el[2],
      })),
    []
  );

  /******************** swr ********************/
  // 게시글 목록 조회
  const {
    data: postData,
    error: postError,
    isLoading: isLoadingPost,
  } = useSWR<POST[], Error>(
    selectBoardId
      ? `${process.env.NEXT_PUBLIC_API_HOST}/post/${selectBoardId}`
      : null,
    (url: string) => postFetcher(url, "GET"),
    {
      revalidateIfStale: !!selectBoardId, // 선택한 게시판 id가 없을 경우 조회x
    }
  );

  // 게시판 목록 조회
  const {
    data: boardData,
    error: boardError,
    isLoading: isLoadingBoard,
  } = useSWR<BOARD[], Error>(
    `${process.env.NEXT_PUBLIC_API_HOST}/board`,
    (url: string) => boardFetcher(url, "GET")
  );

  /******************** func ********************/
  // 게시판 변경시
  const onChangeSelectBoard = useCallback((event: SelectChangeEvent) => {
    // 검색어 초기화
    if (searchKeywordRef.current) searchKeywordRef.current.value = "";

    // 선택한 게시판 id 변경
    setSelectBoardId(event.target.value);
  }, []);

  // row 클릭시
  const onRowClick = useCallback(
    (data: BOARD | POST) => (_event: React.MouseEvent<HTMLTableRowElement>) => {
      router.push(`/post/${selectBoardId}/${data.id}`);
    },
    [router, selectBoardId]
  );

  // 검색버튼 클릭시
  const onSearchBtnClick = useCallback(() => {
    const searchKeyword: string = searchKeywordRef.current?.value ?? "";

    // 검색어가 없는 경우 제외
    if (!searchKeyword) return;

    // 검색어로 검색
    mutate(
      `${process.env.NEXT_PUBLIC_API_HOST}/post/${selectBoardId}`,
      postFetcher(
        `${
          process.env.NEXT_PUBLIC_API_HOST
        }/post/${selectBoardId}?keyWord=${encodeURI(searchKeyword)}`,
        "GET"
      ),
      false
    );
  }, [selectBoardId]);

  /******************** info ********************/
  // 게시판 정보 목록
  const boardNameList = useMemo<BOARD_INFO[]>(() => {
    if (!boardData) return [];
    return boardData.reduce((prev: BOARD_INFO[], current: BOARD) => {
      return prev.concat({ id: current.id, name: current.name });
    }, [] as BOARD_INFO[]);
  }, [boardData]);

  return (
    <PageContainer>
      <Box sx={style.optionWrapper}>
        {/* 게시판 정보 목록 */}
        <Select
          value={selectBoardId}
          onChange={onChangeSelectBoard}
          size="small"
          displayEmpty
        >
          {/* Placeholder */}
          <MenuItem disabled value="">
            <em>게시판을 선택하세요</em>
          </MenuItem>

          {/* 선택 아이템 */}
          {boardNameList.map((item: BOARD_INFO, index: number) => {
            return (
              <MenuItem value={item.id} key={`${item.id}_${index}`}>
                {item.name}
              </MenuItem>
            );
          })}
        </Select>

        {/* 검색어 입력 */}
        <TextField size="small" inputRef={searchKeywordRef} />

        {/* 검색 버튼 */}
        <IconButton
          size="small"
          disabled={!selectBoardId}
          onClick={onSearchBtnClick}
        >
          <SearchIcon />
        </IconButton>
      </Box>

      {/* 목록 */}
      <ListTable
        rowData={postData ?? []}
        rowInfo={rowInfo}
        onRowClick={onRowClick}
        isLoading={isLoadingPost}
      />

      <Box sx={style.btnWrapper}>
        {/* 등록 버튼 */}
        {selectBoardId && (
          <Link
            href={{
              pathname: `${pathname}/register`,
              query: { boardId: selectBoardId },
            }}
          >
            <Button variant="contained" sx={style.registerBtn}>
              등록
            </Button>
          </Link>
        )}
      </Box>
    </PageContainer>
  );
}
