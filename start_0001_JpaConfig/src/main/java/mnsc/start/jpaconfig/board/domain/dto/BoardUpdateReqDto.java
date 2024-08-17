package mnsc.start.jpaconfig.board.domain.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BoardUpdateReqDto {

	private Long id; // 게시판 id
	private String name; // 게시판 이름
	
}
