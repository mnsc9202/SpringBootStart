import { STYLE } from "./theme/theme";

export const fileListItemStyle: STYLE = {
  card: {
    width: 200,
    height: 150,
    position: "relative",
  },
  cardContent: {
    padding: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  cardContentHeader: {
    display: "flex",
    justifyContent: "space-between",
    height: 20,
    padding: 1,
    zIndex: 3,
  },
  cardContentFooter: {
    fontSize: 10,
    fontWeight: "bold",
    width: "100%",
    height: 20,
    backgroundColor: "primary.main",
    color: "secondary.main",
    paddingLeft: 1,
    display: "flex",
    alignItems: "center",
  },
  cardContentOfActive: {
    padding: 0,
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    opacity: 0.8,
    backgroundColor: "secondary.main",
    zIndex: 2,
  },
  loadingWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  descriptionWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  descriptionTextField: {
    "& .MuiInputBase-root": {
      padding: 0,
      paddingLeft: 1,
      paddingTop: 1,
      height: "auto", // auto로 설정하여 자동 높이 조정
    },
    "& .MuiInputBase-input": {
      minHeight: "70px", // 텍스트 영역의 최소 높이 설정
      maxHeight: "80px", // 텍스트 영역의 최대 높이 설정
      overflowY: "auto",
      "&::-webkit-scrollbar": {
        width: "8px", // 스크롤바 너비 조정
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "primary.main", // 스크롤바 색상 조정
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "secondary.main", // 스크롤바의 트랙 색상 조정
      },
    },
  },
  btnWrapper: {
    position: "absolute",
    bottom: 1,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  extensionWrapper: {
    borderRadius: "50%",
    backgroundColor: "primary.main",
    color: "white",
    fontSize: 9,
    fontWeight: "bold",
    width: 20,
    height: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  previewWrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  previewVisibilityOff: {
    color: "primary.main",
  },
  fileNameWrapper: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};
