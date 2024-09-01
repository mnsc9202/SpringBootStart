import Image from "next/image";
import { useState, useEffect } from "react";

// props
type InputFilePreviewProps = {
  file: File;
};

export default function InputFilePreview({ file }: InputFilePreviewProps) {
  /******************** info ********************/
  const [imageSrc, setImageSrc] = useState<string | null>(null); // 이미지 경로

  /******************** render ********************/
  // 이미지 경로 설정
  useEffect(() => {
    const reader = new FileReader();

    // 변환: 파일 -> Base64 URL
    reader.readAsDataURL(file);

    // load가 완료된 경우
    reader.onload = (event: ProgressEvent<FileReader>) => {
      // 이미지 경로 설정
      setImageSrc(event.target?.result as string);
    };
  }, [file]);

  return (
    imageSrc && (
      <Image
        src={imageSrc}
        alt={file.name}
        width={200}
        height={200}
        style={{ objectFit: "contain" }}
      />
    )
  );
}
