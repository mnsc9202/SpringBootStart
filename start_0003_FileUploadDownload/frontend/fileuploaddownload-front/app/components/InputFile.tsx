// icons
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

// props
type InputFileProps = {
  accept: string;
  isMultiFile: boolean;
  inputFileRef: React.RefObject<HTMLInputElement>;
  onChangeFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isFileUploadLoading: boolean;
  isVisible: boolean;
};

export default function InputFile({
  accept,
  isMultiFile,
  inputFileRef,
  onChangeFile,
  isFileUploadLoading,
  isVisible,
}: InputFileProps) {
  return (
    <>
      <label
        htmlFor="inputFile"
        style={{
          cursor: isFileUploadLoading ? "default" : "pointer",
          padding: "6px 10px",
          borderRadius: 4,
          backgroundColor: isFileUploadLoading ? "lightgray" : "#FF8225",
          color: "white",
          display: isVisible ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          gap: 5,
        }}
      >
        <InsertDriveFileIcon />
        파일 선택
      </label>
      <input
        id="inputFile"
        type="file"
        accept={accept} // 파일 유형지정자
        multiple={isMultiFile} // 다중파일선택
        ref={inputFileRef}
        style={{ display: "none" }}
        onChange={onChangeFile}
        disabled={isFileUploadLoading}
      />
    </>
  );
}
