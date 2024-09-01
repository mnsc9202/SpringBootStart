import { AxiosResponseHeaders } from "axios";

export const FileUtil = {
  // File -> FileList 변환
  convertFileToFileList: (files: File[]) => {
    // DataTransfer 객체 생성
    const dataTransfer: DataTransfer = new DataTransfer();

    // DataTransfer에 추가
    files.forEach((el: File) => dataTransfer.items.add(el));

    return dataTransfer.files;
  },

  // 파일 다운로드
  downloadFile: (data: Blob, headers: AxiosResponseHeaders) => {
    // 다운로드 url
    const url: string = window.URL.createObjectURL(
      new Blob([data], {
        type: headers["content-type"],
      })
    );

    // 다운로드 파일명
    const downloadFileName = headers["content-disposition"]
      ? decodeURIComponent(
          headers["content-disposition"].replace("attachment; filename=", "")
        )
      : "";

    // a tag 생성 및 설정
    const aTag: HTMLAnchorElement = document.createElement("a");
    aTag.href = url;
    aTag.setAttribute("download", downloadFileName);

    // a tag 추가
    document.body.appendChild(aTag);

    // a tag 클릭 및 삭제
    aTag.click();
    aTag.remove();
  },
};
