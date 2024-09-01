package start.mnsc.fileuploaddownload.file.domain.dto;

import org.springframework.web.multipart.MultipartFile;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FileUpdateDto {

	private String uuid; // uuid
	private String description; // 설명
	private MultipartFile file; // 파일
}
