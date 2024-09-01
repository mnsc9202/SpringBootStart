package start.mnsc.fileuploaddownload.file.domain.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FileRespDto {

	private String description; // 설명
	private String originFileName; // 원본 파일명
	private String uuid; // uuid
	private String extension; // 확장자
	private String mimeType; // MIME 타입

	@Builder
	public FileRespDto(String description, String originFileName, String uuid, String extension, String mimeType) {
		this.description = description;
		this.originFileName = originFileName;
		this.uuid = uuid;
		this.extension = extension;
		this.mimeType = mimeType;
	}
}
