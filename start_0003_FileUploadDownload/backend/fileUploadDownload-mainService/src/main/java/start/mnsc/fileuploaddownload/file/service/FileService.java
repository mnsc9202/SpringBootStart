package start.mnsc.fileuploaddownload.file.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;
import start.mnsc.fileuploaddownload.file.domain.dto.FileRespDto;
import start.mnsc.fileuploaddownload.file.domain.dto.FileUpdateDto;
import start.mnsc.fileuploaddownload.file.domain.dto.FileUploadDto;

@RequiredArgsConstructor
@Service
public class FileService {

	@Value("${start.mnsc.file-service.url}")
	private String fileServiceUrl;
	private final RestTemplate restTemplate;
	
		
	/**
	 * 파일 목록 조회
	 * 
	 * @return
	 */
	public List<FileRespDto> findAllFile() {
		        
		// 1. api 요청 및 response 반환
		String apiUrl = fileServiceUrl + "/file";
		ResponseEntity<List<FileRespDto>> response = restTemplate.exchange(
																		apiUrl,
																		HttpMethod.GET,
																		null,
																		new ParameterizedTypeReference<List<FileRespDto>>() {});
		
		// 2. responseBody 조회
		List<FileRespDto> responseBody = response.getBody();
				
		return responseBody;
	}
	
	
	/**
	 * 파일 단건 조회
	 * 
	 * @param uuid 파일 uuid
	 * @return
	 */
	public FileRespDto findFile(String uuid) {
		
		// 1. api 요청 및 response 반환
		String apiUrl = fileServiceUrl + "/file/" + uuid;
		ResponseEntity<FileRespDto> response = restTemplate.exchange(
																	apiUrl,
																	HttpMethod.GET,
																	null,
																	FileRespDto.class);
		
		// 2. responseBody 조회
		FileRespDto responseBody = response.getBody();
				
		return responseBody;		
	}
	
	
	/**
	 * 파일 미리보기 (단건)
	 * 
	 * @param uuid 파일 uuid
	 * @return
	 */
	public byte[] previewFile(String uuid) {
		
		// 1. api 요청 및 response 반환
		String apiUrl = fileServiceUrl + "/file" + "/" + uuid + "/preview";
		ResponseEntity<byte[]> response = restTemplate.exchange(
															apiUrl,
															HttpMethod.GET,
															null,
															byte[].class);
		
		// 2. responseBody 조회
		byte[] responseBody = response.getBody();
		
		return responseBody;
	}	
	

	/**
	 * 파일 업로드
	 * 
	 * @param reqDto 파일 업로드요청 DTO
	 * @return
	 */
	public Boolean uploadFile(FileUploadDto reqDto){
		
		// 1. HttpHeaders 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA); // multipart/form-data

        // 2. body 설정
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        
        body.add("description", reqDto.getDescription());
        for (MultipartFile file : reqDto.getFiles()) {
            body.add("files", file.getResource());
        }
        
        // 3. HttpEntity 생성
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        
		// 4. api 요청 및 response 반환
		String apiUrl = fileServiceUrl + "/file";
		ResponseEntity<Boolean> response = restTemplate.exchange(
													apiUrl,
													HttpMethod.POST,
													requestEntity,
													Boolean.class);
		
		// 5. responseBody 조회
		Boolean responseBody = response.getBody();
		
		return responseBody;
	}
	
	
	/**
	 * 파일 다운로드 (단건)
	 * 
	 * @param uuid 파일 uuid
	 * @return
	 */
	public ResponseEntity<Resource> downloadFile(String uuid) {
		
		// 1. api 요청 및 response 반환
		String apiUrl = fileServiceUrl + "/file/" + uuid + "/download";
		ResponseEntity<Resource> response = restTemplate.exchange(
													apiUrl,
													HttpMethod.GET,
													null,
													Resource.class);
		
		return response;
	}
	
	
	/**
	 * 파일 다운로드 (목록 - 압축 다운로드)
	 * 
	 * @param uuidList 파일 uuid 목록
	 * @return
	 */
	public ResponseEntity<ByteArrayResource> downloadMultiFile(List<String> uuidList) {
		
		// 1. api 요청 및 response 반환
		String apiUrl = fileServiceUrl + "/file/" + "compression?uuidList=" + String.join(",", uuidList);
		ResponseEntity<ByteArrayResource> response = restTemplate.exchange(
																apiUrl,
																HttpMethod.GET,
																null,
																ByteArrayResource.class);
		return response;
	}
	
	
	/**
	 * 파일 수정
	 * 
	 * @param updateDto 파일 수정요청 DTO
	 * @return
	 */
	public Boolean updateFile(FileUpdateDto updateDto) {
		// 1. HttpHeaders 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA); // multipart/form-data
        
        // 2. body 설정
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        
        body.add("uuid", updateDto.getUuid());
        body.add("description", updateDto.getDescription());
        if(updateDto.getFile() != null && !updateDto.getFile().isEmpty()) {        	
        	body.add("file", updateDto.getFile().getResource());
        }
        
        // 3. HttpEntity 생성
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        
        // 4. api 요청 및 response 반환
 		String apiUrl = fileServiceUrl + "/file/" + updateDto.getUuid();
 		ResponseEntity<Boolean> response = restTemplate.exchange(
 													apiUrl,
 													HttpMethod.PUT,
 													requestEntity,
 													Boolean.class);
 		
 		// 5. responseBody 조회
 		Boolean responseBody = response.getBody();
 		
 		return responseBody;    
	}
	
	
	/**
	 * 파일 삭제 (단건)
	 * 
	 * @param uuid 파일 uuid
	 * @return
	 */
	public Boolean deleteFile(String uuid) {
		
		// 1. api 요청 및 response 반환
		String apiUrl = fileServiceUrl + "/file/" + uuid;
		ResponseEntity<Boolean> response = restTemplate.exchange(
													apiUrl,
													HttpMethod.DELETE,
													null,
													Boolean.class);
		// 2. responseBody 조회
		Boolean responseBody = response.getBody();
		return responseBody;
	}
	
	
	/**
	 * 파일 삭제 (목록)
	 * 
	 * @param uuidList 파일 uuid 목록
	 * @return
	 */
	public Boolean deleteAllFile(List<String> uuidList) {
		
		// 1. HttpHeaders 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON); // application/json
        
        // 2. HttpEntity 생성
        HttpEntity<List<String>> requestEntity = new HttpEntity<>(uuidList, headers);
        
		// 3. api 요청 및 response 반환
		String apiUrl = fileServiceUrl + "/file";
		ResponseEntity<Boolean> response = restTemplate.exchange(
													apiUrl,
													HttpMethod.DELETE,
													requestEntity,
													Boolean.class);
		
		// 4. responseBody 조회
		Boolean responseBody = response.getBody();
		
		return responseBody;        
	}
}
