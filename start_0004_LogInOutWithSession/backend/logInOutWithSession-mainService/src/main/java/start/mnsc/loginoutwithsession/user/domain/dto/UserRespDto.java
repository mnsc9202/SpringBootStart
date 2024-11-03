package start.mnsc.loginoutwithsession.user.domain.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import start.mnsc.loginoutwithsession.user.domain.User;

@Getter
@Setter
@NoArgsConstructor
public class UserRespDto {

	private String userId; // 아이디
	private String name; // 이름

	public UserRespDto(User user) {
		this.userId = user.getUserId();
		this.name = user.getName();
	}	
}
