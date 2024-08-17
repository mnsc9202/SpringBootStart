package mnsc.start.jpaconfig.board.domain;

import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import org.hibernate.annotations.Comment;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mnsc.start.jpaconfig.common.domain.BaseEntity;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "boards")
public class Board extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "board_id")
	@Comment("게시판 id")
	private Long id;
	
	@Column(nullable = false)
	@Comment("게시판 이름")
	private String name;
	
	@OneToMany(mappedBy = "board")
	@Comment("게시판 관련 게시글")
	private List<Post> posts;

	@Builder
	public Board(Long id, String name, List<Post> posts) {
		this.id = id;
		this.name = name;
		this.posts = posts;
	}
		
	
	/********** 업데이트 **********/
	/**
	 * 게시판 이름 수정
	 * 
	 * @param name
	 */
	public void updateName(String name) {
		this.name = name;
	}
}
