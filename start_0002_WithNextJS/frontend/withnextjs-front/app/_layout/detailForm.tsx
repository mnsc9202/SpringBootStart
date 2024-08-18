"use client";

import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback, useEffect } from "react";
import { BOARD } from "../board/page";
import { BOARDDETAIL_INFO, BOARDDETAIL } from "../board/[boardId]/page";
import { POSTDETAIL_INFO, POSTDETAIL } from "../post/[boardId]/[postId]/page";
import { POST } from "../post/page";
import { STYLE } from "@/public/styles/theme/theme";
import LoadingCircular from "../components/loadingCircular";

// icons
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";

/******************** style ********************/
const style: STYLE = {
  rootContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  itemWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  itemTitle: {
    minWidth: 200,
  },
  btnWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 1,
    padding: 2,
  },
  contentWrapper: {
    padding: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 1,
  },
  commonBtn: {
    backgroundColor: "button.primary.main",
    "&:hover": {
      backgroundColor: "button.primary.main",
    },
  },
  modifyCompleteBtn: {
    backgroundColor: "button.secondary.main",
    "&:hover": {
      backgroundColor: "button.secondary.main",
    },
  },
  deleteBtn: {
    backgroundColor: "button.warning.main",
    "&:hover": {
      backgroundColor: "button.warning.main",
    },
  },
  deleteCancleBtn: {
    backgroundColor: "button.secondary.main",
    "&:hover": {
      backgroundColor: "button.secondary.main",
    },
  },
  dialogBtnWrapper: {
    display: "flex",
    marginTop: 2,
    "& > button": {
      flexGrow: 1,
      maxWidth: "50%",
    },
  },
};

// props
type DetailFormProps = {
  data: BOARD | POST | undefined;
  dataDetailInfo: (BOARDDETAIL_INFO | POSTDETAIL_INFO)[];
  boardId: string;
  postId?: string;
  modifyFectcher: (body: string) => Promise<BOARD | POST>;
  deleteFectcher: () => Promise<BOARD | POST>;
  isLoading: boolean;
};

export default function DetailForm({
  data,
  dataDetailInfo,
  boardId,
  postId,
  modifyFectcher,
  deleteFectcher,
  isLoading,
}: DetailFormProps) {
  /******************** info ********************/
  const [isModify, setIsModify] = useState<boolean>(false); // 수정 여부
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState<boolean>(false); // 삭제 dialog open여부
  const [detailData, setDetailData] = useState<(BOARDDETAIL | POSTDETAIL)[]>(
    []
  ); // 상세 데이터
  const router = useRouter(); // router
  const pathName = usePathname(); // path
  // 원본 경로
  const originPath = useMemo<string>(() => {
    return `/${pathName.split("/")[1]}`;
  }, [pathName]);

  /******************** func ********************/
  // 입력값 변경시
  const onChangeInputValue = useCallback(
    (item: BOARDDETAIL | POSTDETAIL) =>
      (event: React.FocusEvent<HTMLInputElement>) => {
        const arrangeValue: string = event.currentTarget.value; // 변경값

        // 변경된 값만 수정
        setDetailData((prev: (BOARDDETAIL | POSTDETAIL)[]) => {
          return prev.reduce(
            (
              preItem: (BOARDDETAIL | POSTDETAIL)[],
              currentItem: BOARDDETAIL | POSTDETAIL
            ) => {
              // 변경 대상 타입인 경우
              if (currentItem.type === item.type) {
                return preItem.concat({
                  ...currentItem,
                  value: arrangeValue,
                });
              } else {
                return preItem.concat(currentItem);
              }
            },
            [] as (BOARDDETAIL | POSTDETAIL)[]
          );
        });
      },
    []
  );

  // 수정버튼 클릭시
  const onModifyBtnClick = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement>) => setIsModify(true),
    []
  );

  // 수정 취소버튼 클릭시
  const onModifyCancleBtnClick = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement>) => setIsModify(false),
    []
  );

  // 수정 완료버튼 클릭시
  const onModifyCompleteBtnClick = useCallback(
    (detail: (BOARDDETAIL | POSTDETAIL)[]) =>
      (_event: React.MouseEvent<HTMLButtonElement>) => {
        // 수정 요청 데이터
        const requestData = postId
          ? // 게시글 수정인 경우
            {
              boardId: boardId,
              postId: postId,
              title: detail.find(
                (el: BOARDDETAIL | POSTDETAIL) => el.type === "title"
              )?.value,
              content: detail.find(
                (el: BOARDDETAIL | POSTDETAIL) => el.type === "content"
              )?.value,
            }
          : // 게시판 수정인 경우
            {
              id: boardId,
              name: detail.find(
                (el: BOARDDETAIL | POSTDETAIL) => el.type === "name"
              )?.value,
            };

        // 저장
        modifyFectcher(JSON.stringify(requestData)).then(() => {
          // 저장완료 후 페이지 이동
          router.push(originPath);
        });
      },
    [boardId, modifyFectcher, originPath, postId, router]
  );

  // 목록버튼 클릭시
  const onMoveListBtnClick = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement>) => {
      router.push(originPath);
    },
    [router, originPath]
  );

  // 삭제버튼 클릭시
  const onDeleteBtnClick = useCallback(() => {
    setIsOpenDeleteDialog(true);
  }, []);

  // 삭제 dialog의 아니오 버튼 클릭시
  const onDeleteDialogCancleBtnClick = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement>) => {
      setIsOpenDeleteDialog(false);
    },
    []
  );

  // 삭제 dialog의 예 버튼 클릭시
  const onDeleteDialogDeleteBtnClick = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement>) => {
      deleteFectcher().then(() => {
        router.push(originPath);
      });
    },
    [deleteFectcher, originPath, router]
  );

  /******************** render ********************/
  // 초기 detailData 설정
  useEffect(() => {
    if (!data) return;
    setDetailData(
      dataDetailInfo.reduce(
        (prev: BOARDDETAIL[], current: BOARDDETAIL_INFO) => {
          return prev.concat({
            type: current.type,
            value: data[current.type!],
            isImmutable: current.isImmutable,
            description: current.description,
          });
        },
        [] as BOARDDETAIL[]
      )
    );
  }, [data, dataDetailInfo]);

  return (
    <Box sx={style.rootContainer}>
      <Box sx={style.contentWrapper}>
        {isLoading && <LoadingCircular />}
        {detailData.map((item: BOARDDETAIL | POSTDETAIL, index: number) => {
          return (
            <Box key={`${item.type}_${index}`} sx={style.itemWrapper}>
              {/* 구분 */}
              <Box sx={style.itemTitle}>{item.description}</Box>

              {/* 값 */}
              <TextField
                size="small"
                value={item.value}
                disabled={isModify ? item.isImmutable : true}
                onChange={onChangeInputValue(item)}
              />
            </Box>
          );
        })}
      </Box>

      {/* 버튼 */}
      <Box sx={style.btnWrapper}>
        {/* 수정/완료 버튼 */}
        {isModify ? (
          <Button
            variant="contained"
            sx={style.modifyCompleteBtn}
            onClick={onModifyCompleteBtnClick(detailData)}
          >
            완료
          </Button>
        ) : (
          <Button
            variant="contained"
            sx={style.commonBtn}
            onClick={onModifyBtnClick}
            disabled={isLoading}
          >
            수정
          </Button>
        )}

        {/* 취소 버튼 */}
        {isModify && (
          <Button
            variant="contained"
            sx={style.commonBtn}
            onClick={onModifyCancleBtnClick}
          >
            취소
          </Button>
        )}

        {/* 목록 버튼 */}
        <Button
          variant="contained"
          sx={style.commonBtn}
          onClick={onMoveListBtnClick}
        >
          목록
        </Button>

        {/* 삭제 버튼 */}
        <Button
          variant="contained"
          sx={style.deleteBtn}
          disabled={isLoading || isModify}
          onClick={onDeleteBtnClick}
        >
          삭제
        </Button>
      </Box>

      {/* 삭제 dialog */}
      <Dialog
        open={isOpenDeleteDialog}
        disableRestoreFocus={true} // aria-hidden error 처리
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: 15,
            display: "flex",
            alignItems: "center",
          }}
        >
          <ReportGmailerrorredIcon />
          알림
        </DialogTitle>
        {/* 내용 */}
        <DialogContent sx={{ minWidth: 250 }}>
          <DialogContentText>정말 삭제하시겠습니까?</DialogContentText>
        </DialogContent>

        {/* 버튼 */}
        <DialogActions sx={style.dialogBtnWrapper}>
          <Button
            variant="contained"
            sx={style.deleteCancleBtn}
            onClick={onDeleteDialogCancleBtnClick}
          >
            아니오
          </Button>
          <Button
            variant="contained"
            sx={style.commonBtn}
            onClick={onDeleteDialogDeleteBtnClick}
          >
            예
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
