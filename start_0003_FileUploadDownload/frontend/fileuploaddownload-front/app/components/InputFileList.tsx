import { Box, IconButton, Tooltip } from "@mui/material";
import { useCallback } from "react";
import InputFilePreview from "./InputFilePreview";
import { STYLE } from "@/public/styles/theme/theme";
import { inputFileListStyle } from "@/public/styles/inputFileListStyle";

// icons
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";

/******************** style ********************/
const style: STYLE = inputFileListStyle;

// props
type InputFileListProps = {
  inputFileList: File[];
  onRemoveFile: (index: number) => void;
  isFileUploadLoading: boolean;
};

export default function InputFileList({
  inputFileList,
  onRemoveFile,
  isFileUploadLoading,
}: InputFileListProps) {
  /******************** func ********************/
  // 미리보기 가능여부 확인
  const checkAbleFilePreview = useCallback((file: File) => {
    // 이미지 파일이 아닌 경우
    if (!file.type.startsWith("image/")) return false;

    return true;
  }, []);

  return (
    <Box sx={style.rootContainer}>
      {/* 타이틀 */}
      <Box sx={style.titleWrapper}>업로드 파일 목록</Box>

      {/* 목록 */}
      <Box sx={style.listWrapper}>
        {/* 업로드 파일 목록 */}
        {/* 업로드 파일이 없는 경우 */}
        {inputFileList.length === 0 && (
          <Box sx={style.listEmpty}>파일 없음</Box>
        )}

        {/* 업로드 파일이 있는 경우 */}
        {inputFileList.map((el: File, index: number) => {
          return (
            <Box key={`${el.type}_${index}`} sx={style.listItemWrapper}>
              {/* 삭제 버튼 */}
              <IconButton
                size="small"
                color="warning"
                onClick={() => onRemoveFile(index)}
                disabled={isFileUploadLoading}
                sx={{ margin: 0, padding: 0 }}
              >
                <RemoveCircleIcon />
              </IconButton>

              {/* 미리보기 */}
              {checkAbleFilePreview(el) && (
                <Tooltip title={<InputFilePreview file={el} />}>
                  <VisibilityIcon sx={style.listItemPreview} />
                </Tooltip>
              )}

              {/* 이름 */}
              <Box sx={style.listItemName}>{el.name}</Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
