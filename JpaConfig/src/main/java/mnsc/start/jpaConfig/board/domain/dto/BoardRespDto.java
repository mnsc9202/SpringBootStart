package mnsc.start.jpaConfig.board.domain.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mnsc.start.jpaConfig.board.domain.Board;

@Getter
@Setter
@NoArgsConstructor
public class BoardRespDto {

	private Long id; // 게시판 id
	private String name; // 게시판 이름
	private List<PostRespDto> posts; // 게시글 목록
	
	// BaseEntity
	private String createdBy; // 생성자
	private LocalDateTime createdDate; // 생성일
	private String lastModifiedBy; // 수정자
	private LocalDateTime lastModifiedDate; // 수정일

	@Builder
	public BoardRespDto(Long id, String name, List<PostRespDto> posts, String createdBy, LocalDateTime createdDate,
			String lastModifiedBy, LocalDateTime lastModifiedDate) {
		this.id = id;
		this.name = name;
		this.posts = posts;
		this.createdBy = createdBy;
		this.createdDate = createdDate;
		this.lastModifiedBy = lastModifiedBy;
		this.lastModifiedDate = lastModifiedDate;
	}

	// entity 
	public BoardRespDto(Board entity) {
		this.id = entity.getId();
		this.name = entity.getName();
		this.posts = entity.getPosts() == null ? null : entity.getPosts().stream().map(i-> new PostRespDto(i)).collect(Collectors.toList());
		this.createdBy = entity.getCreatedBy();
		this.createdDate = entity.getCreatedDate();
		this.lastModifiedBy = entity.getLastModifiedBy();
		this.lastModifiedDate = entity.getLastModifiedDate();
	}

	
}
