"use client";

import { FILE_DATA, fileService } from "@/app/api/fileService";
import { Box, Button } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import useSWR from "swr";
import FileList from "@/app/components/FileList";
import { STYLE } from "@/public/styles/theme/theme";

// icons
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

/******************** style ********************/
const style: STYLE = {
  titleWrapper: {
    display: "flex",
    justifyContent: "center",
    fontWeight: "bold",
    padding: 1,
    marginBottom: 1,
    borderRadius: 10,
    backgroundColor: "primary.main",
    color: "secondary.main",
  },
  commonBtn: {
    minWidth: 40,
    margin: 0,
    padding: 0,
  },
};

export default function FileListPage() {
  /******************** info ********************/
  const [checkItemList, setCheckItemList] = useState<string[]>([]); // check 아이템 목록
  const [isAllCheck, setIsAllCheck] = useState<boolean>(false); // 전체 선택 여부

  /******************** swr ********************/
  // 업로드 파일 목록 조회
  const {
    data: fileList,
    isLoading,
    mutate,
  } = useSWR<FILE_DATA[]>("fileList", fileService.findAllFile);

  /******************** func ********************/
  // 전체선택 버튼 클릭시
  const onAllCheckBtnClick = useCallback(() => {
    // 업로드 파일 목록 없을 경우 제외
    if (!fileList) return;

    // 전체선택여부 설정
    setIsAllCheck((prevIsAllCheck: boolean) => {
      const currentIsAllCheck: boolean = !prevIsAllCheck; // 전체선택 여부

      // 체크 설정
      setCheckItemList(
        currentIsAllCheck ? fileList.map((el: FILE_DATA) => el.uuid) : []
      );
      return currentIsAllCheck;
    });
  }, [fileList]);

  // 다중 다운로드 버튼 클릭시 (zip파일로 다운로드)
  const onFileMultiDownloadBtnClick = useCallback(
    async (_event: React.MouseEvent<HTMLButtonElement>) => {
      // 1. 쿼리 파라미터 생성
      const requestQueryParam: string = `uuidList=${encodeURIComponent(
        checkItemList.toString()
      )}`;

      // 2. 다중 다운로드 api 호출
      await fileService.downloadMultiFile(requestQueryParam);
    },
    [checkItemList]
  );

  // 선택삭제 버튼 클릭시
  const onSelectDeleteBtnClick = useCallback(() => {
    // 선택삭제 api 호출
    fileService.deleteMultiFile(checkItemList, mutate);
  }, [checkItemList, mutate]);

  /******************** render ********************/
  // 전체 선택여부 설정
  useEffect(() => {
    if (!fileList) return;

    // 파일이 전체 선택된 경우
    if (checkItemList.length === fileList.length) setIsAllCheck(true);

    // 파일이 선택되지 않은 경우
    if (checkItemList.length === 0) setIsAllCheck(false);
  }, [checkItemList.length, fileList]);

  // 업로드 파일 목록이 변경된 경우 초기화
  useEffect(() => {
    setIsAllCheck(false); // 전체 선택여부 초기화
    setCheckItemList([]); // check 아이템 목록 초기화
  }, [fileList]);

  return (
    <>
      {/* 타이틀 */}
      <Box sx={style.titleWrapper}>파일 목록</Box>

      {/* 버튼 */}
      <Box>
        {/* 전체선택 버튼 */}
        <Button
          onClick={onAllCheckBtnClick}
          disabled={fileList?.length === 0}
          size="small"
          sx={style.commonBtn}
        >
          {isAllCheck ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
        </Button>

        {/* 다중 다운로드 버튼 */}
        <Button
          onClick={onFileMultiDownloadBtnClick}
          disabled={checkItemList.length === 0}
          size="small"
          sx={style.commonBtn}
        >
          <SaveAltIcon />
        </Button>

        {/* 선택삭제 버튼 */}
        <Button
          onClick={onSelectDeleteBtnClick}
          disabled={checkItemList.length === 0}
          size="small"
          sx={style.commonBtn}
        >
          <DeleteForeverIcon />
        </Button>
      </Box>

      {/* 파일 목록 */}
      <FileList
        isLoading={isLoading}
        fileList={fileList ?? []}
        setCheckItemList={setCheckItemList}
        checkItemList={checkItemList}
      />
    </>
  );
}
