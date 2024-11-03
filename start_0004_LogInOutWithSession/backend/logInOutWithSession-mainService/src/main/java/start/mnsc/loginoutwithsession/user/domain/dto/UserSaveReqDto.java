package start.mnsc.loginoutwithsession.user.domain.dto;

import javax.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserSaveReqDto {

	/**
	 * 정규식
	 * 영어 소문자, 숫자 사용가능 + 첫글자는 영어소문자만 가능
	 * 
	 * ^: 시작
	 * [a-z]: 첫글자는 영어 소문자
	 * [a-z0-9]*: 첫글자 이후 영어 소문자, 숫자가 0개 이상
	 * $: 끝
	 */
	@Pattern(regexp = "^[a-z][a-z0-9]*$",
			message = "id는 영어 소문자로 시작해야 하며 영어 소문자, 숫자만 사용가능합니다!")
	private String userId; // 아이디
	
	
	/**
     * 정규식
     * 최소 6글자 + 영어대문자, 소문자, 숫자, 특수문자(!@#$) 사용가능
     * 
	 * ^: 시작
	 * [a-zA-Z0-9!@#$]: 영어대문자, 소문자, 숫자, 특수문자(!@#$) 가능
	 * {6,}: 문자개수 6 ~ 
	 * $: 끝
     */
	@Pattern(regexp = "^[a-zA-Z0-9!@#$]{6,}$",
			message = "비밀번호는 6글자이상이어야 하며 영어, 숫자, 특수문자(!@#$)만 사용가능합니다!")
	private String password; // 비밀번호
	
	
	/**
	 * 정규식
	 * 한글만 가능 + 1~4 글자
	 * 
	 * ^: 시작
	 * [가-힣]: 한글 범위
	 * {1,4}: 문자개수 1 ~ 4
	 * $: 끝
	 */
	@Pattern(regexp = "^[가-힣]{1,4}$",
			message = "이름을 올바르게 입력하세요!")
	private String name; // 이름
	
}
