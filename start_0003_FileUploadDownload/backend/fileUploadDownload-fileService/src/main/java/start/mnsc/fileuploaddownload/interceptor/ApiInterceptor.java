package start.mnsc.fileuploaddownload.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class ApiInterceptor implements HandlerInterceptor{

	private static final String ALLOW_IP = "127.0.0.1";

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		
		// 1. 요청한 정보 조회
		String remoteIp = request.getRemoteAddr();
				
		// 2. 요청정보 확인
		// 2.1 허용된 경우 컨트롤러로 요청 전달
		if(remoteIp != null && remoteIp.equals(ALLOW_IP)) return true;
		
		// 2.2 허용되지 경우 요청 차단
		response.sendError(HttpServletResponse.SC_FORBIDDEN, "접근 금지");
		return false;
	}
	
	
}
