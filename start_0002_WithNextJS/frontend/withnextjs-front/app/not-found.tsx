"use client";

import { STYLE } from "@/public/styles/theme/theme";
import { Box, Button } from "@mui/material";
import Link from "next/link";

// icons
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

/******************** style ********************/
const style: STYLE = {
  rootWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "90vh",
  },
  notFoundTitle: {
    fontWeight: "bold",
    fontSize: 50,
    color: "primary.main",
  },
  moveHomeBtn: {
    backgroundColor: "button.warning.main",
    "&:hover": {
      backgroundColor: "button.warning.main",
    },
  },
};

export default function NotFoundPage() {
  return (
    <>
      <Box sx={style.rootWrapper}>
        <Box sx={style.notFoundTitle}>페이지를 찾을 수 없습니다.</Box>
        <Link href={"/"}>
          <Button
            variant="contained"
            sx={style.moveHomeBtn}
            endIcon={<OpenInNewIcon />}
          >
            홈으로 가기
          </Button>
        </Link>
      </Box>
    </>
  );
}
