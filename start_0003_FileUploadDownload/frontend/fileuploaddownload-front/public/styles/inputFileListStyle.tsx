import { STYLE } from "./theme/theme";

export const inputFileListStyle: STYLE = {
  rootContainer: {
    borderRadius: 1,
    border: "1px solid black",
    padding: 1,
  },
  titleWrapper: {
    fontSize: 12,
    fontWeight: "bold",
  },
  listWrapper: {
    height: 100,
    overflowY: "auto",
  },
  listEmpty: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 10,
  },
  listItemWrapper: {
    display: "flex",
    alignItems: "center",
    paddingTop: 1,
    gap: 0.5,
  },
  listItemName: {
    fontSize: 10,
  },
  listItemPreview: {
    color: "primary.main",
  },
};
