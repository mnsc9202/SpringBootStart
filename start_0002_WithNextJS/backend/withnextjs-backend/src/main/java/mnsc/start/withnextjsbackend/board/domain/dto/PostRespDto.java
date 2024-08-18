package mnsc.start.withnextjsbackend.board.domain.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mnsc.start.withnextjsbackend.board.domain.Post;

@Getter
@Setter
@NoArgsConstructor
public class PostRespDto {
	
	private Long id; // 게시글 id
	private String title; // 제목
	private String content; // 내용
	
	@Builder
	public PostRespDto(Long id, String title, String content) {
		this.id = id;
		this.title = title;
		this.content = content;
	}

	// entity
	public PostRespDto(Post entity) {
		this.id = entity.getId();
		this.title = entity.getTitle();
		this.content = entity.getContent();
	}	
	
}
