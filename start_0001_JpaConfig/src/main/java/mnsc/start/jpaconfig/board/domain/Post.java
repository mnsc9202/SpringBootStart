package mnsc.start.jpaconfig.board.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import org.hibernate.annotations.Comment;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mnsc.start.jpaconfig.board.domain.dto.PostUpdateReqDto;
import mnsc.start.jpaconfig.common.domain.BaseEntity;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "board_posts")
public class Post extends BaseEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "post_id")
	@Comment("게시글 id")
	private Long id;
	
	@Column(length = 500, nullable = false)
	@Comment("제목")
	private String title;
	
	@Column(columnDefinition = "TEXT", nullable = false)
	@Comment("내용")
	private String content;
	
	@JsonIgnore 
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "board_id")
	@Comment("게시글과 관련된 게시판")
	private Board board;
	
	@Builder
	public Post(Long id, String title, String content, Board board) {
		this.id = id;
		this.title = title;
		this.content = content;
		this.board = board;
	}
	
	
	/********** 업데이트 **********/
	/**
	 * 게시글 필드 수정
	 * 
	 * @param reqDto
	 */
	public void updateToDto(PostUpdateReqDto reqDto) {
		this.title = reqDto.getTitle();
		this.content = reqDto.getContent();
	}
}
