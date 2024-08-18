import { Box, Button } from "@mui/material";
import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { STYLE } from "@/public/styles/theme/theme";

// icons
import HomeIcon from "@mui/icons-material/Home";
import FolderIcon from "@mui/icons-material/Folder";
import ArticleIcon from "@mui/icons-material/Article";

/******************** style ********************/
const style: STYLE = {
  headerWrapper: {
    height: "60px",
    backgroundColor: "primary.main",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    marginLeft: 5,
    color: "secondary.main",
    fontWeight: "bold",
  },
  naviItem: {
    marginRight: 1,
    backgroundColor: "secondary.main",
    color: "primary.main",
    fontWeight: "bold",
  },
};

/******************** type ********************/
/** Navi 아이템 */
type NAVIITEM = {
  type: string;
  href: string;
  icon?: ReactNode;
};

export default function Header() {
  /******************** info ********************/
  // navi 아이템 목록
  const naviItemList = useMemo<NAVIITEM[]>(
    () => [
      { type: "Home", href: "/", icon: <HomeIcon /> },
      { type: "Board", href: "/board", icon: <FolderIcon /> },
      { type: "Post", href: "/post", icon: <ArticleIcon /> },
    ],
    []
  );

  return (
    <Box sx={style.headerWrapper}>
      {/* 타이틀 */}
      <Box sx={style.headerTitle}>MNSC</Box>

      {/* navi 아이템 목록 */}
      <Box>
        {naviItemList.map((item: NAVIITEM, index: number) => (
          <Link href={item.href} key={`${item}_${index}`}>
            <Button
              variant="contained"
              sx={style.naviItem}
              startIcon={item.icon}
            >
              {item.type}
            </Button>
          </Link>
        ))}
      </Box>
    </Box>
  );
}
