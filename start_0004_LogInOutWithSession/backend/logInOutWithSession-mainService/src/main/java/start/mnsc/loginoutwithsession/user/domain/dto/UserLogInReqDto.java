package start.mnsc.loginoutwithsession.user.domain.dto;

import javax.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserLogInReqDto {
	
	@Pattern(regexp = "^[a-z][a-z0-9]*$", message = "아이디를 올바르게 입력하세요.")
	private String userId; // 아이디
	
	@Pattern(regexp = "^[a-zA-Z0-9!@#$]{6,}$", message = "비밀번호를 올바르게 입력하세요.")
	private String password; // 비밀번호
}
