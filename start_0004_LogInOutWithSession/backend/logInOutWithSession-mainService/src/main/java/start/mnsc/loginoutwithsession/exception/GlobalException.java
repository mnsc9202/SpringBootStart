package start.mnsc.loginoutwithsession.exception;

import lombok.Getter;

@Getter
public class GlobalException extends RuntimeException{
	private static final long serialVersionUID = 1L;
	
	private final String errorCode;

	public GlobalException(String errorCode, String message) {
		super(message);
		this.errorCode = errorCode;
	}
}
