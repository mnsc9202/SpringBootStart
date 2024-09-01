package start.mnsc.fileuploaddownload.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import org.hibernate.annotations.Comment;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor
@Table(name ="file_storage")
public class FileStorage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "file_id")
	@Comment("파일 id")
	private Long id;
	
	@Comment("설명")
	private String description;
	
	@Comment("원본 파일명")
	private String originFileName;
	
	@Comment("UUID")
	private String uuid;
	
	@Comment("확장자")
	private String extension;
	
	@Comment("MIME 타입")
	private String mimeType;

	@Builder
	public FileStorage(Long id, String description, String originFileName, String uuid, String extension,
			String mimeType) {
		this.id = id;
		this.description = description;
		this.originFileName = originFileName;
		this.uuid = uuid;
		this.extension = extension;
		this.mimeType = mimeType;
	}
	
	/********** 업데이트 **********/
	/**
	 * 파일 설명 수정
	 * 
	 * @param description 설명
	 */
	public void updateDescription(String description) {
		this.description = description; 
	}
	
	public void update(String description, String originFileName, String extension, String mimeType) {
		this.description = description;
		this.originFileName = originFileName;
		this.extension = extension;
		this.mimeType = mimeType; 
	}
}
