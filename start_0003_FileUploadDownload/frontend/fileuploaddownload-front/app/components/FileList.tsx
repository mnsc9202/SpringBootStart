import { Dispatch, SetStateAction, useCallback } from "react";
import { FILE_DATA } from "../api/fileService";
import { Box, CircularProgress, Grid } from "@mui/material";
import FileListItem from "./FileListItem";
import { STYLE } from "@/public/styles/theme/theme";
import { fileListStyle } from "@/public/styles/fileListStyle";

/******************** style ********************/
const style: STYLE = fileListStyle;

// props
type FileListProps = {
  isLoading: boolean;
  fileList: FILE_DATA[] | null;
  setCheckItemList: Dispatch<SetStateAction<string[]>>;
  checkItemList: string[];
};

export default function FileList({
  isLoading,
  fileList,
  setCheckItemList,
  checkItemList,
}: FileListProps) {
  /******************** func ********************/
  // 체크 변경시
  const onChangeItemCheckbox = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isCheck: boolean = event.currentTarget.checked; // 체크 여부
      const targetId: string = event.currentTarget.id; // 대상 id

      // check 아이템 목록 설정
      setCheckItemList((prev: string[]) => {
        // 1. 체크한 경우
        if (isCheck) {
          prev.push(targetId);
          return [...prev];
        }
        // 2. 체크해제한 경우
        else {
          return prev.reduce((prevValue: string[], currentValue: string) => {
            // 2.1 해당 아이템 제외
            if (currentValue === targetId) {
              return prevValue;
            } else {
              // 2.2 해당 아이템이 아닌 경우 추가
              prevValue.push(currentValue);
            }
            return prevValue;
          }, [] as string[]);
        }
      });
    },
    [setCheckItemList]
  );

  return (
    <Grid
      container
      spacing={1}
      justifyContent={"flex-start"}
      alignContent={"flex-start"}
      sx={style.gridContainer}
    >
      {/* 로딩중인 경우 */}
      {isLoading && (
        <Box sx={style.loadingWrapper}>
          <CircularProgress />
        </Box>
      )}

      {/* 파일 목록 */}
      {fileList?.map((item: FILE_DATA, index: number) => (
        <Grid item key={`${item.description}_${index}`}>
          <FileListItem
            item={item}
            onChangeItemCheckbox={onChangeItemCheckbox}
            isChecked={
              checkItemList.find((uuid: string) => uuid === item.uuid)
                ? true
                : false
            }
          />
        </Grid>
      ))}
    </Grid>
  );
}
