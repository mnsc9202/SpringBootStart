package start.mnsc.loginoutwithsession.user.service;

import javax.persistence.EntityNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import start.mnsc.loginoutwithsession.exception.GlobalException;
import start.mnsc.loginoutwithsession.user.domain.User;
import start.mnsc.loginoutwithsession.user.domain.dto.UserLogInReqDto;
import start.mnsc.loginoutwithsession.user.domain.dto.UserRespDto;
import start.mnsc.loginoutwithsession.user.domain.dto.UserSaveReqDto;
import start.mnsc.loginoutwithsession.user.repository.UserRepository;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class UserService {

	private final UserRepository userRepository;
	private final BCryptPasswordEncoder bCryptPasswordEncoder;
	
	
	/**
	 * 사용자 저장
	 * 
	 * @param reqDto 사용자 저장 요청 DTO
	 * @return
	 */
	@Transactional(readOnly = false)
	public User saveUser(UserSaveReqDto reqDto) {
		
        // 1. 사용자 조회
 		User existedUser = userRepository.findByUserId(reqDto.getUserId()).orElse(null);
 		
 		// 기존 사용자가 있는 경우
 		if(existedUser != null) throw new GlobalException("userId", "id가 중복됩니다!");
				
		// 기존 사용자가 없는 경우
		// 2. 비밀번호 해싱
		String hashedPassword = bCryptPasswordEncoder.encode(reqDto.getPassword());
		
		// 3. User 생성
		User user = User.builder()
						.name(reqDto.getName())
						.userId(reqDto.getUserId())
						.password(hashedPassword)
						.build();

		// 4. User 저장
		User createdUser = userRepository.save(user);
		
		return createdUser;
	}
	
	
	/**
	 * 사용자 로그인
	 * 
	 * @param reqDto 사용자 로그인 요청 DTO
	 * @return
	 */
	public UserRespDto logInUser(UserLogInReqDto reqDto) {
		
		// 1. User 조회
		User user = userRepository.findByUserId(reqDto.getUserId())
								.orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다!"));
		
		// 2. 비밀번호 검증
		Boolean passwordVerificationResult = bCryptPasswordEncoder.matches(reqDto.getPassword(), user.getPassword());
		
		// 2.1 비밀번호가 다른 경우
		if(!passwordVerificationResult) throw new GlobalException("passwordError", "비밀번호를 확인해주세요!");
				
		// 3. UserRespDto 생성
		UserRespDto response = new UserRespDto(user);
		
		return response;		
	}
	
}
