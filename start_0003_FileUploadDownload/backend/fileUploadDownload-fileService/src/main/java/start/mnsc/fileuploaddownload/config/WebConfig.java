package start.mnsc.fileuploaddownload.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import lombok.RequiredArgsConstructor;
import start.mnsc.fileuploaddownload.interceptor.ApiInterceptor;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {
	
	private final ApiInterceptor apiInterceptor;

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		
		registry.addInterceptor(apiInterceptor)
				.addPathPatterns("/**"); // 모든 요청에 대해 Interceptor 적용
	}
	
}
