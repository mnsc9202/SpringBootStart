"use client";

import {
  FILE_UPLOAD_REQUEST_PAYLOAD,
  fileService,
} from "@/app/api/fileService";
import InputFileList from "@/app/components/InputFileList";
import { FileUtil } from "@/public/utils/FileUtil";
import { LinearProgress, Box, TextField, Button } from "@mui/material";
import { useRef, useState, useCallback } from "react";
import useSWR from "swr";
import { STYLE } from "@/public/styles/theme/theme";
import InputFile from "@/app/components/InputFile";

// icons
import FileUploadIcon from "@mui/icons-material/FileUpload";

/******************** style ********************/
const style: STYLE = {
  rootContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
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
  descriptionWrapper: {
    display: "flex",
    alignItems: "center",
  },
  btnWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
};

export default function FileRegisterPage() {
  /******************** info ********************/
  const inputFileRef = useRef<HTMLInputElement>(null); // input(file) 참조
  const [description, setDescription] = useState<string>(""); // 설명
  const [isFileUploadLoading, setIsFileUploadLoading] =
    useState<boolean>(false); // 파일업로드 loadding 여부
  const [inputFileList, setInpuFileList] = useState<File[]>([]); // input file 목록

  /******************** swr ********************/
  const { mutate } = useSWR("fileList");

  /******************** func ********************/
  // 파일 변경시
  const onChangeFile = useCallback(
    (_event: React.ChangeEvent<HTMLInputElement>) => {
      // 해당 경우 제외
      if (!inputFileRef.current || !inputFileRef.current.files) return;

      const fileCnt: number = inputFileRef.current.files.length; // 파일 개수
      const files: FileList = inputFileRef.current.files; // 파일 목록

      // 파일 목록 생성 (생성개수: fileCnt)
      const fileList: File[] = Array.from(
        { length: fileCnt },
        (_value, index: number) => index
      ).reduce((prev: File[], current: number) => {
        const file: File = files[current];
        return prev.concat(file);
      }, [] as File[]);

      // 파일 목록 설정
      setInpuFileList(fileList);
    },
    []
  );

  // 파일 제거시
  const onRemoveFile = useCallback((index: number) => {
    // 해당 경우 제외
    if (!inputFileRef.current || !inputFileRef.current.files) return;

    const fileCnt: number = inputFileRef.current.files.length; // 파일 개수
    const files: FileList = inputFileRef.current.files; // 파일 목록

    // 파일 목록 생성 (생성개수: fileCnt - 1(제거대상))
    const filterFileList: File[] = Array.from(
      { length: fileCnt },
      (_value, index: number) => index
    ).reduce((prev: File[], _current: unknown, currentIndex: number) => {
      // 제거대상 제외
      if (currentIndex === index) {
        return prev;
      } else {
        const file: File = files[currentIndex];
        return prev.concat(file);
      }
    }, [] as File[]);

    // FilList 변환
    inputFileRef.current.files = FileUtil.convertFileToFileList(filterFileList);

    // 파일 목록 설정
    setInpuFileList(filterFileList);
  }, []);

  // 입력값(설명) 변경시
  const onChangeDescription = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(event.currentTarget.value);
    },
    []
  );

  // 파일 업로드가 성공한 경우 callback
  const onSuccessFileUpload = useCallback(
    (result: boolean) => {
      // 참조가 없는 경우 제외
      if (!inputFileRef.current) return;

      // 실패한 경우 제외
      if (!result) return;

      // 1. 파일 초기화
      inputFileRef.current.value = "";

      // 2. 파일 목록 초기화
      setInpuFileList([]);

      // 3. 설명 초기화
      setDescription("");

      // 4. 파일 목록 갱신
      mutate();
    },
    [mutate]
  );

  // 업로드버튼 클릭시
  const onUploadBtnClick = useCallback(() => {
    // 첨부파일 없는 경우 제외
    if (!inputFileList || inputFileList.length == 0) return;

    // 1. request payload 생성
    const requestPayload: FILE_UPLOAD_REQUEST_PAYLOAD = {
      description: description,
      files: FileUtil.convertFileToFileList(inputFileList),
    };

    // 2. 파일 업로드 api 호출
    fileService.uploadFile(
      onSuccessFileUpload,
      requestPayload,
      setIsFileUploadLoading
    );
  }, [description, inputFileList, onSuccessFileUpload]);

  return (
    <>
      {/* 업로드중인 경우 */}
      {isFileUploadLoading && <LinearProgress />}

      <Box sx={style.rootContainer}>
        {/* 타이틀 */}
        <Box sx={style.titleWrapper}>파일첨부 화면</Box>

        {/* 설명 */}
        <Box sx={style.descriptionWrapper}>
          <Box sx={{ marginRight: 1 }}>설명</Box>
          <TextField
            size="small"
            value={description}
            onChange={onChangeDescription}
            disabled={isFileUploadLoading}
          />
        </Box>

        {/* 버튼 */}
        <Box sx={style.btnWrapper}>
          {/* 파일 선택 버튼 */}
          <InputFile
            accept="image/*,.pdf,.txt" // 업로드 파일 형식
            isMultiFile={true}
            inputFileRef={inputFileRef}
            onChangeFile={onChangeFile}
            isFileUploadLoading={isFileUploadLoading}
            isVisible={true}
          />

          {/* 업로드 버튼 */}
          <Button
            variant="contained"
            onClick={onUploadBtnClick}
            startIcon={<FileUploadIcon />}
            disabled={isFileUploadLoading || inputFileList.length == 0}
          >
            업로드
          </Button>
        </Box>

        {/* 첨부파일 목록 */}
        <InputFileList
          inputFileList={inputFileList}
          onRemoveFile={onRemoveFile}
          isFileUploadLoading={isFileUploadLoading}
        />
      </Box>
    </>
  );
}
