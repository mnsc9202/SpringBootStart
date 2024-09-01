package start.mnsc.fileuploaddownload.file.domain.dto;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FileUploadDto {

	private String description; // 설명
	private List<MultipartFile> files; // 업로드 파일
}
