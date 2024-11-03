package start.mnsc.loginoutwithsession.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public class GlobalExceptionResult {
	private String code;
	private String message;
}
