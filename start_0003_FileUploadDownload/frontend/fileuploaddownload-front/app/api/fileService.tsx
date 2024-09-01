import { FileUtil } from "@/public/utils/FileUtil";
import axios, { AxiosResponseHeaders } from "axios";
import { Dispatch, SetStateAction } from "react";

/******************** type ********************/
/** 파일 */
export type FILE_DATA = {
  description: string; // 설명
  originFileName: string; // 원본 파일명
  uuid: string; // uuid
  extension: string; // 확장자
  mimeType: string; // MIME 타입
};

/** 파일 업로드 요청 */
export type FILE_UPLOAD_REQUEST_PAYLOAD = {
  description: string; // 설명
  files: FileList; // 파일
};

/** 파일 수정 요청 */
export type FILE_UPDATE_REQUEST_PAYLOAD = {
  uuid: string; // uuid
  description: string; // 설명
  file: File; // 파일
};

/******************** const ********************/
/** 파일 api */
const fileApi: string = process.env.NEXT_PUBLIC_FILE_HOST ?? "";

export const fileService = {
  // 파일 목록 조회
  findAllFile: async () => {
    return (await axios.get<FILE_DATA[]>(fileApi)).data;
  },

  // 파일 단건 조회
  findFile: async (uuid: string) => {
    return (await axios.get<FILE_DATA>(`${fileApi}/${uuid}`)).data;
  },

  // 파일 업로드
  uploadFile: (
    successCallback: Function,
    requestPayload: FILE_UPLOAD_REQUEST_PAYLOAD,
    setIsLoading: Dispatch<SetStateAction<boolean>>
  ) => {
    // 로딩
    setIsLoading(true);

    // 파일 업로드
    axios
      .post(fileApi, requestPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((result) => {
        successCallback(result.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  },

  // 파일 다운로드 (단건)
  downloadFile: async (uuid: string) => {
    await axios
      .get(`${fileApi}/${uuid}/download`, {
        responseType: "blob",
      })
      .then((response) => {
        // 파일 다운로드
        FileUtil.downloadFile(
          response.data,
          response.headers as AxiosResponseHeaders
        );
      });
  },

  // 파일 다운로드 (목록)
  downloadMultiFile: async (requestQueryParam: string) => {
    await axios
      .get<Blob>(`${fileApi}/compression?${requestQueryParam}`, {
        responseType: "blob",
      })
      .then((response) => {
        // 파일 다운로드
        FileUtil.downloadFile(
          response.data,
          response.headers as AxiosResponseHeaders
        );
      });
  },

  // 파일 수정
  updateFile: async (
    uuid: string,
    requestPayload: FILE_UPDATE_REQUEST_PAYLOAD,
    successCallback: Function
  ) => {
    await axios
      .put(`${fileApi}/${uuid}`, requestPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        successCallback(response.data);
      });
  },

  // 파일 삭제 (단건)
  deleteFile: async (uuid: string, successCallback: Function) => {
    await axios.delete(`${fileApi}/${uuid}`).then((response) => {
      // 삭제 실패시
      if (!response.data) return;

      // 파일 목록 동기화
      successCallback();
    });
  },

  // 파일 삭제 (목록)
  deleteMultiFile: async (
    checkItemList: string[],
    successCallback: Function
  ) => {
    await axios
      .delete(`${fileApi}`, { data: checkItemList })
      .then((response) => {
        // 삭제 실패시
        if (!response.data) return;

        // 파일 목록 동기화
        successCallback();
      });
  },

  // 미리보기 이미지 조회
  previewFile: (uuid: string, successCallback: Function) => {
    axios
      .get(`${fileApi}/${uuid}/preview`, {
        responseType: "blob",
      })
      .then((result) => {
        successCallback(result.data);
      });
  },
};
