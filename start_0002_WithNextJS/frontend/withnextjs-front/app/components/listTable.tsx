import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { BOARD } from "../board/page";
import { POST } from "../post/page";
import { STYLE } from "@/public/styles/theme/theme";
import LoadingCircular from "./loadingCircular";
import { useCallback } from "react";

/******************** type ********************/
/** 테이블 행 데이터 */
export type ROWDATA = BOARD[] | POST[];

/** 테이블 행 정보 */
export type ROWINFO = {
  type: string;
  description: string;
  width: number | string;
};

/******************** style ********************/
const style: STYLE = {
  tableHeader: {
    "& .MuiTableCell-head": {
      color: "secondary.main",
      backgroundColor: "tableHeader.main",
      fontWeight: "bold",
    },
    "& > th": {
      color: "white",
    },
  },
  tableBodyRow: {
    cursor: "pointer",
    "&:last-child td, &:last-child th": { border: 0 },
    "&:hover": {
      backgroundColor: "secondary.main",
    },
  },
};

// props
type ListTableProps = {
  rowData: ROWDATA;
  rowInfo: ROWINFO[];
  onRowClick: (
    data: BOARD | POST
  ) => (_event: React.MouseEvent<HTMLTableRowElement>) => void;
  isLoading: boolean;
};

export default function ListTable({
  rowData,
  rowInfo,
  onRowClick,
  isLoading,
}: ListTableProps) {
  /******************** func ********************/
  // type에 따른 값 변환
  const convertValueToType = useCallback((type: string, data: BOARD | POST) => {
    switch (type) {
      case "posts": {
        return (data[type] as []).filter((el: POST) => !!el.id).length;
      }
      case "createdDate": {
        const createdDate: Date = new Date(data[type]);
        const createYear: number = createdDate.getFullYear();
        const createMonth: string = `0${createdDate.getMonth() + 1}`.slice(-2);
        const createDay: string = `0${createdDate.getDate()}`.slice(-2);
        return `${createYear}-${createMonth}-${createDay}`;
      }
      default: {
        return data[type].toString();
      }
    }
  }, []);

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
      <Table stickyHeader sx={{ minWidth: 650 }}>
        {/* 테이블 헤더 */}
        <TableHead sx={style.tableHeader}>
          <TableRow>
            {rowInfo.map((info: ROWINFO, index: number) => (
              <TableCell
                key={`${info.type}_${index}`}
                align="center"
                sx={{
                  width:
                    typeof info.width === "string" ? info.width : undefined,
                  minWidth:
                    typeof info.width === "string" ? undefined : info.width,
                }}
              >
                {info.description}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* 테이블 내용 */}
        <TableBody>
          {rowData.length == 0 ? (
            // 내용이 없는 경우
            <TableRow>
              <TableCell align="center" colSpan={rowInfo.length}>
                {isLoading ? <LoadingCircular /> : "내용없음"}
              </TableCell>
            </TableRow>
          ) : (
            // 내용이 있는 경우
            rowData.map((data: BOARD | POST, index: number) => {
              return (
                <TableRow
                  key={`${data.id}_${index}`}
                  sx={style.tableBodyRow}
                  onClick={isLoading ? undefined : onRowClick(data)}
                >
                  {rowInfo.map((info: ROWINFO, index: number) => (
                    <TableCell align="center" key={`${info.type}_${index}`}>
                      {convertValueToType(info.type, data)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
