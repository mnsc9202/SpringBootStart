package start.mnsc.fileuploaddownload.file.controller;

import java.util.List;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import start.mnsc.fileuploaddownload.file.domain.dto.FileRespDto;
import start.mnsc.fileuploaddownload.file.domain.dto.FileUpdateDto;
import start.mnsc.fileuploaddownload.file.domain.dto.FileUploadDto;
import start.mnsc.fileuploaddownload.file.service.FileService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/file")
public class FileController {

	private final FileService fileService;
	
	
	/**
	 * 파일 목록 조회
	 * 
	 * @return
	 */
	@GetMapping
	public ResponseEntity<List<FileRespDto>> findAllFile() {
		
		// 파일 목록 조회
		List<FileRespDto> fileRespDtoList = fileService.findAllFile();
		
		return new ResponseEntity<>(fileRespDtoList, HttpStatus.OK);
	}
	
	
	/**
	 * 파일 단건 조회
	 * 
	 * @param uuid 파일 uuid
	 * @return
	 */
	@GetMapping("/{uuid}")
	public ResponseEntity<FileRespDto> findFile(@PathVariable String uuid) {
		
		// 파일 단건 조회
		FileRespDto fileRespDto = fileService.findFile(uuid);
		
		return new ResponseEntity<>(fileRespDto, HttpStatus.OK);
	}
	
	
	/**
	 * 파일 미리보기 (단건)
	 * 
	 * @param uuid 파일 uuid
	 * @return
	 */
	@GetMapping("/{uuid}/preview")
	public ResponseEntity<byte[]> previewFile(@PathVariable String uuid){
	
		// 파일 미리보기 조회
		byte[] result = fileService.previewFile(uuid);
		
		return ResponseEntity.ok()
							.contentType(MediaType.APPLICATION_OCTET_STREAM)
							.body(result);
	}
	
	
	/**
	 * 파일 업로드
	 * 
	 * @param reqDto 파일 업로드요청 DTO
	 * @return
	 */
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Boolean> uploadFile(@ModelAttribute FileUploadDto reqDto) {
		
		// 1. 첨부파일 확인
		if(reqDto.getFiles() == null || reqDto.getFiles().isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		
		// 2. 첨부파일 저장
		Boolean result = fileService.uploadFile(reqDto);
		
		return new ResponseEntity<>(result, HttpStatus.OK);		
	}
	
	
	/**
	 * 파일 다운로드 (단건)
	 * 
	 * @param uuid 파일 uuid
	 * @return
	 */
	@GetMapping("/{uuid}/download")
	public ResponseEntity<Resource> downloadFile(@PathVariable String uuid) {
		
		// 파일 다운로드
		ResponseEntity<Resource> result = fileService.downloadFile(uuid);
		
		return result;	
	}
	
	
	/**
	 * 파일 다운로드 (목록 - 압축 다운로드)
	 * 
	 * @param uuidList 파일 uuid 목록
	 * @return
	 */
	@GetMapping("/compression")
	public ResponseEntity<ByteArrayResource> downloadMultiFile(@RequestParam List<String> uuidList) {
		
		// 파일 다운로드
		ResponseEntity<ByteArrayResource> result = fileService.downloadMultiFile(uuidList);
		
		return result;
	}
	
	
	/**
	 * 파일 수정
	 * 
	 * @param uuid 파일 uuid
	 * @param updateDto 파일 수정요청 DTO
	 * @return
	 */
	@PutMapping(value = "/{uuid}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Boolean> updateFile(@PathVariable String uuid, @ModelAttribute FileUpdateDto updateDto) {
		
		// 1. 검증
		// 1.1 uuid 검증
		if(!uuid.equals(updateDto.getUuid())) return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		
		// 2. 파일 수정
		Boolean result = fileService.updateFile(updateDto);
		
		return ResponseEntity.ok().body(result);
	}
	
	
	/**
	 * 파일 삭제 (단건)
	 * 
	 * @param uuid 파일 uuid
	 * @return
	 */
	@DeleteMapping("/{uuid}")
	public ResponseEntity<Boolean> deleteFile(@PathVariable String uuid) {
		
		// 파일 삭제
		Boolean result = fileService.deleteFile(uuid);
		
		return ResponseEntity.ok().body(result);
	}
	
	
	/**
	 * 파일 삭제 (목록)
	 * 
	 * @param uuidList 파일 uuid 목록
	 * @return
	 */
	@DeleteMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Boolean> deleteAllFile(@RequestBody List<String> uuidList) {
		
		// 파일 삭제
		Boolean result = fileService.deleteAllFile(uuidList);
	
		return ResponseEntity.ok().body(result);
	}
}
