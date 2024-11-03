package start.mnsc.loginoutwithsession.user.controller;

import java.net.URI;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import lombok.RequiredArgsConstructor;
import start.mnsc.loginoutwithsession.user.domain.User;
import start.mnsc.loginoutwithsession.user.domain.dto.UserLogInReqDto;
import start.mnsc.loginoutwithsession.user.domain.dto.UserRespDto;
import start.mnsc.loginoutwithsession.user.domain.dto.UserSaveReqDto;
import start.mnsc.loginoutwithsession.user.service.UserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

	private final UserService userService;
	
	/**
	 * 사용자 저장
	 * 
	 * @param reqDto 사용자 저장 요청 DTO
	 * @return
	 */
	@PostMapping
	public ResponseEntity<Void> saveUser(@Validated @RequestBody UserSaveReqDto reqDto) {
		
		// 1. 사용자 저장
		User user = userService.saveUser(reqDto);
		
		// 2. URI 생성
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
								                .path("/{id}")
								                .buildAndExpand(user.getId())
								                .toUri();
		
		return ResponseEntity.created(location).build();
	}
	
	/**
	 * 사용자 확인
	 * 
	 * @param req HttpServletRequest
	 * @return
	 */
	@GetMapping("/authentication")
	public ResponseEntity<UserRespDto> findUserByJsessionId(HttpServletRequest req) {
		// 1. 세션 조회
		HttpSession session = req.getSession(false);
	
		// 2. 세션 확인
		// 2.1 JSESSION을 받은 경우
		if(session != null) {
			// 2.1.1 세션에서 사용자 조회
			Object sessionObj = session.getAttribute("user");
			
			// sessionObj이 null이 아닌 경우
			// 2.1.1.1 사용자가 조회된 경우
			if(sessionObj instanceof UserRespDto) {
				UserRespDto user = (UserRespDto) sessionObj;
				
				return new ResponseEntity<>(user, HttpStatus.OK);
			}else{
				// sessionObj이 null, sessionObj이 UserRespDto가 아닌 경우
				// 2.1.1.2 사용자가 조회되지 않은 경우
				// 2.1.1.2.1 header 생성
				HttpHeaders headers = new HttpHeaders();
				
				// 2.1.1.2.2 redirect url 설정
				headers.add("x-redirect-url", "http://localhost:3000");
				
				return new ResponseEntity<>(headers, HttpStatus.NOT_FOUND);
			}
		}
		
		// 2.2 JSESSION을 못받은 경우
		// 2.2.1 header 생성
		HttpHeaders headers = new HttpHeaders();
		
		// 2.2.2 redirect url 설정
		headers.add("x-redirect-url", "http://localhost:3000");
		
		return new ResponseEntity<>(headers, HttpStatus.BAD_REQUEST);
	}
	
	/**
	 * 사용자 로그인
	 * 
	 * @param reqDto 사용자 로그인 요청 DTO
	 * @param req
	 * @return
	 */
	@PostMapping("/login")
	public ResponseEntity<UserRespDto> logInUser(@Validated @RequestBody UserLogInReqDto reqDto, HttpServletRequest req) {
	
		// 1. 사용자 조회 및 검증
		UserRespDto result = userService.logInUser(reqDto);
		
		// 2. 세션 설정 (로그인에 성공한 경우)
		// 2.1 세션 생성
		HttpSession session = req.getSession();
		
		// 2.2 세션에 저장
		session.setAttribute("user", result);
				
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	/**
	 * 사용자 로그아웃
	 * 
	 * @param req HttpServletRequest
	 * @return
	 */
	@PostMapping("/logout")
	public ResponseEntity<Void> logout(HttpServletRequest req) {
		// 1. 세션 조회
		HttpSession session = req.getSession(false);
		
		// 2. 세션 삭제
		if(session != null) session.invalidate();
		
		// 3. 쿠키 생성
		ResponseCookie cookie = ResponseCookie.from("JSESSIONID", null)
											.httpOnly(true) // client 접근 불가
											.maxAge(0) // 쿠기 만료
											.path("/") // 쿠키 유효 범위
											.build();
		// 4. 헤더 설정
		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.SET_COOKIE, cookie.toString());
		
		return new ResponseEntity<>(null, headers, HttpStatus.OK);
	}
}
