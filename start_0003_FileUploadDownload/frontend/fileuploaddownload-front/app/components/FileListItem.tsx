import {
  FILE_DATA,
  FILE_UPDATE_REQUEST_PAYLOAD,
  fileService,
} from "../api/fileService";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  Box,
  CircularProgress,
  TextField,
  IconButton,
  Badge,
  Checkbox,
} from "@mui/material";
import useSWR from "swr";
import Image from "next/image";
import InputFile from "./InputFile";
import { STYLE } from "@/public/styles/theme/theme";
import { fileListItemStyle } from "@/public/styles/fileListItemStyle";

// icons
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AttachFileIcon from "@mui/icons-material/AttachFile";

/******************** style ********************/
const style: STYLE = fileListItemStyle;

// props
type FileListItemProps = {
  item: FILE_DATA;
  onChangeItemCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isChecked: boolean;
};

export default function FileListItem({
  item,
  onChangeItemCheckbox,
  isChecked,
}: FileListItemProps) {
  /******************** info ********************/
  const [itemState, setItemState] = useState<FILE_DATA>(item); // item
  const [isHover, setIsHover] = useState<boolean>(false); // hover 여부
  const [isEdit, setIsEdit] = useState<boolean>(false); // 수정 여부
  const [isLoading, setIsLoading] = useState<boolean>(false); // loading 여부
  const inputFileRef = useRef<HTMLInputElement>(null); // input(file) 참조
  const inputDescriptionRef = useRef<HTMLInputElement>(null); // input(text) 참조

  // 파일명 (확장자 제거)
  const fileName = useMemo<string>(
    () => itemState.originFileName.split(".")[0],
    [itemState.originFileName]
  );
  const [previewSrc, setPreviewSrc] = useState<string>(""); // 미리보기 경로

  /******************** swr ********************/
  const { mutate } = useSWR("fileList", fileService.findAllFile);

  /******************** func ********************/
  // 파일 다운로드 버튼 클릭시
  const onFileDownloadBtnClick = useCallback(
    async (_event: React.MouseEvent<HTMLButtonElement>) => {
      // 파일 다운로드 api 호출
      await fileService.downloadFile(itemState.uuid);
    },
    [itemState.uuid]
  );

  // 파일 삭제 버튼 클릭시
  const onFileDeleteBtnClick = useCallback(
    async (_event: React.MouseEvent<HTMLButtonElement>) => {
      // 파일 삭제 api 호출
      await fileService.deleteFile(itemState.uuid, mutate);
    },
    [itemState.uuid, mutate]
  );

  // 파일 수정 버튼 클릭시
  const onFileModifyBtnClick = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement>) => {
      setIsEdit((prev: boolean) => !prev);
    },
    []
  );

  // 파일 재업로드 버튼 클릭시
  const onFileReUploadBtnClick = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement>) => {
      // 참조 없는 경우 제외
      if (!inputFileRef.current) return;

      inputFileRef.current.click();
    },
    []
  );

  // 파일 수정 성공시
  const onSuccessFileModify = useCallback(
    async (result: boolean) => {
      // 실패한 경우 제외
      if (!result) return;

      // 성공한 경우
      setIsEdit(false);

      // item 변경
      const arragneItem: FILE_DATA = await fileService.findFile(itemState.uuid);
      setItemState(arragneItem);

      // 미리보기 초기화
      setPreviewSrc("");
    },
    [itemState.uuid]
  );

  // 파일 수정완료 버튼 클릭시
  const onFileModifyDoneBtnClick = useCallback(
    (uuid: string) => async (_event: React.MouseEvent<HTMLButtonElement>) => {
      // 해당 경우 제외
      if (
        !inputDescriptionRef.current ||
        !inputFileRef.current ||
        !inputFileRef.current.files
      )
        return;

      // request payload
      const requestPayload: FILE_UPDATE_REQUEST_PAYLOAD = {
        uuid: uuid,
        description: inputDescriptionRef.current.value,
        file: inputFileRef.current.files.item(0)!,
      };

      // 1. loading 설정
      setIsLoading(true);

      // 2. 파일 수정 api 호출
      await fileService.updateFile(uuid, requestPayload, onSuccessFileModify);

      // 3. loading 해제
      setIsLoading(false);
    },
    [onSuccessFileModify, inputDescriptionRef]
  );

  // 미리보기 이미지 조회 성공시
  const onSuccessPreviewFile = useCallback((data: Blob) => {
    const imageObjUrl: string = window.URL.createObjectURL(data);
    setPreviewSrc(imageObjUrl);
  }, []);

  /******************** render ********************/
  // 미리보기 이미지 조회
  useEffect(() => {
    // png 파일인 경우 미리보기
    if (!previewSrc && itemState.extension.toLocaleLowerCase() === "png") {
      fileService.previewFile(itemState.uuid, onSuccessPreviewFile);
    }
  }, [itemState.extension, itemState.uuid, onSuccessPreviewFile, previewSrc]);

  return (
    <Card
      sx={style.card}
      onMouseOver={(_event: React.MouseEvent<HTMLDivElement>) =>
        setIsHover(true)
      }
      onMouseLeave={(_event: React.MouseEvent<HTMLDivElement>) =>
        setIsHover(false)
      }
      elevation={3}
    >
      {/* hover, isEdit 인 경우 */}
      {(isHover || isEdit) && (
        <CardContent sx={style.cardContentOfActive}>
          {/* 로딩바 */}
          {isLoading && (
            <Box sx={style.loadingWrapper}>
              <CircularProgress />
            </Box>
          )}

          {/* 파일 설명 */}
          <Box sx={style.descriptionWrapper}>
            {/* 파일 설명 */}
            <TextField
              inputRef={inputDescriptionRef}
              size="small"
              multiline
              rows={3}
              disabled={!isEdit || isLoading}
              defaultValue={itemState.description}
              sx={style.descriptionTextField}
            />
          </Box>

          {/* 버튼 */}
          <Box sx={style.btnWrapper}>
            {isEdit ? (
              // 수정인 경우
              <>
                {/* 완료 버튼 */}
                <IconButton
                  size="small"
                  onClick={onFileModifyDoneBtnClick(itemState.uuid)}
                  disabled={isLoading}
                >
                  <CheckCircleIcon />
                </IconButton>

                {/* 파일첨부 버튼 */}
                <IconButton
                  size="small"
                  onClick={onFileReUploadBtnClick}
                  disabled={isLoading}
                >
                  <Badge
                    color="primary"
                    badgeContent={inputFileRef.current?.files?.length ?? 0}
                    variant="dot"
                  >
                    <AttachFileIcon />
                  </Badge>
                </IconButton>

                {/* 파일 선택 */}
                <InputFile
                  accept="image/*,.pdf,.txt" // 업로드 파일 형식
                  isMultiFile={false}
                  inputFileRef={inputFileRef}
                  onChangeFile={() => {}}
                  isFileUploadLoading={isLoading}
                  isVisible={false}
                />
              </>
            ) : (
              // 수정이 아닌 경우
              <>
                {/* 수정 버튼 */}
                <IconButton size="small" onClick={onFileModifyBtnClick}>
                  <EditIcon />
                </IconButton>

                {/* 삭제 버튼 */}
                <IconButton size="small" onClick={onFileDeleteBtnClick}>
                  <DeleteIcon />
                </IconButton>

                {/* 다운로드 버튼 */}
                <IconButton size="small" onClick={onFileDownloadBtnClick}>
                  <DownloadIcon />
                </IconButton>
              </>
            )}
          </Box>
        </CardContent>
      )}

      <CardContent sx={style.cardContent}>
        {/* 내용 상단 */}
        <Box sx={style.cardContentHeader}>
          {/* 체크 박스 */}
          <Checkbox
            size="small"
            sx={{ padding: 0, margin: 0 }}
            id={itemState.uuid}
            onChange={onChangeItemCheckbox}
            checked={isChecked}
            disabled={isLoading}
          />

          {/* 파일 확장자 */}
          <Box sx={style.extensionWrapper}>
            {itemState.extension.toLocaleLowerCase()}
          </Box>
        </Box>

        {/* 내용 */}
        {/* 미리보기 */}
        <Box sx={style.previewWrapper}>
          {previewSrc ? (
            <Image
              src={previewSrc}
              alt="file preview"
              width={200}
              height={90} // 150 - (20 + 8*2) - (20 + 4*1) = 150 - 36 - 24
            />
          ) : (
            <VisibilityOffIcon sx={style.previewVisibilityOff} />
          )}
        </Box>

        {/* 내용 하단 */}
        {/* 파일명 */}
        <Box sx={style.cardContentFooter}>
          <Box sx={style.fileNameWrapper}>{fileName}</Box>
        </Box>
      </CardContent>
    </Card>
  );
}
