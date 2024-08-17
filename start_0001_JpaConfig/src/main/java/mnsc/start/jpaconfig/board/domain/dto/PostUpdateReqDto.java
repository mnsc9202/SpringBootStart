package mnsc.start.jpaconfig.board.domain.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PostUpdateReqDto {

	private Long boardId; // 게시판 id
	private Long postId; // 게시글 id
	private String title; // 제목
	private String content; // 내용
	
}
