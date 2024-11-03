package start.mnsc.loginoutwithsession.exception;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import javax.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import lombok.extern.slf4j.Slf4j;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(GlobalException.class)
	public ResponseEntity<GlobalExceptionResult> globalExceptionHandler(GlobalException ex) {
		
		return new ResponseEntity<>(new GlobalExceptionResult(ex.getErrorCode(), ex.getMessage()), HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(EntityNotFoundException.class)
	public ResponseEntity<GlobalExceptionResult> entityNotFoundExceptionHandler(EntityNotFoundException ex) {
		
		return new ResponseEntity<>(new GlobalExceptionResult("entityNotFound", ex.getMessage()), HttpStatus.BAD_REQUEST);
	}	
	
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<GlobalExceptionResult> httpMessageNotReadableExceptionHandler(HttpMessageNotReadableException ex) {
	
		return new ResponseEntity<>(new GlobalExceptionResult("httpMessageNotReadable", "형식이 잘못 되었습니다"), HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<List<GlobalExceptionResult>> methodArgumentNotValidExceptionHandler(MethodArgumentNotValidException ex) {
		
		// 0. 준비사항
		List<GlobalExceptionResult> response = new ArrayList<>();
		
		// 1. Binding 결과 조회
		BindingResult bindingResult = ex.getBindingResult();
		
		// 2. 에러 조회
		List<ObjectError> objError = bindingResult.getAllErrors();

		// 3. response
		response = objError.stream()
						.map(error -> {
							String fieldName = ((FieldError) error).getField();
				            String errorMessage = error.getDefaultMessage();
				            return new GlobalExceptionResult(fieldName, errorMessage);
						})
						.collect(Collectors.toList());
		
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}
}
