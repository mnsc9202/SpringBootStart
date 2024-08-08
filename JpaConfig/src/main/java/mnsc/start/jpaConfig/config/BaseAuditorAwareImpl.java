package mnsc.start.jpaConfig.config;

import java.util.Optional;
import org.springframework.data.domain.AuditorAware;

public class BaseAuditorAwareImpl implements AuditorAware<String>{

	@Override
	public Optional<String> getCurrentAuditor() {
		return Optional.of("mnsc");
	}
}
