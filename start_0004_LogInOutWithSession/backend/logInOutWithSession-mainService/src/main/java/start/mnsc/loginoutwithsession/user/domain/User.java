package start.mnsc.loginoutwithsession.user.domain;

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
@Table(name = "user")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Comment("seqence")
	private Long id;
	
	@Comment("아이디")
	private String userId;
	
	@Comment("비밀번호")
	private String password;
	
	@Comment("이름")
	private String name;

	@Builder
	public User(Long id, String userId, String password, String name) {
		this.id = id;
		this.userId = userId;
		this.password = password;
		this.name = name;
	}
}
