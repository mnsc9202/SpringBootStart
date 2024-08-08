package mnsc.start.jpaConfig.board.domain.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PostSaveReqDto {

	private String title; // 제목
	private String content; // 내용
	private Long boardId; // 게시판 id
	
}
