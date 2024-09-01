package start.mnsc.fileuploaddownload.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
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
import start.mnsc.fileuploaddownload.domain.dto.FileRespDto;
import start.mnsc.fileuploaddownload.domain.dto.FileUpdateDto;
import start.mnsc.fileuploaddownload.domain.dto.FileUploadDto;
import start.mnsc.fileuploaddownload.service.FileService;

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
	public ResponseEntity<List<FileRespDto>> findAllFile(){
		
		// 파일 목록 조회
		List<FileRespDto> fileRespDtoList = fileService.findAllFile();
		
		return ResponseEntity.ok()
							.contentType(MediaType.APPLICATION_JSON)
				            .body(fileRespDtoList);
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
		
		return ResponseEntity.ok()
				.contentType(MediaType.APPLICATION_JSON)
	            .body(fileRespDto);
	}
	
	/**
	 * 파일 미리보기 (단건)
	 * 
	 * @param uuid 파일 uuid
	 * @return
	 */
	@GetMapping("/{uuid}/preview")
	public ResponseEntity<byte[]> previewFile(@PathVariable String uuid) {
		
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
	public ResponseEntity<Boolean> uploadFile(@ModelAttribute FileUploadDto reqDto){
		
		// 첨부파일 저장
		Boolean result = fileService.uploadFile(reqDto);
		
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	
	/**
	 * 파일 다운로드 (단건)
	 * 
	 * @param uuid 파일 uuid
	 * @return
	 * @throws IOException
	 */
	@GetMapping("/{uuid}/download")
	public ResponseEntity<Resource> downloadFile(@PathVariable String uuid) throws IOException {
		
		// 파일 다운로드
		Resource resource = fileService.downloadFile(uuid);

		return ResponseEntity.ok()
							.header("Content-Type", Files.probeContentType(resource.getFile().toPath()))
							.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
							.body(resource);
	}
	
	
	/**
	 * 파일 다운로드 (목록 - 압축 다운로드)
	 * 
	 * @param uuidList 파일 uuid 목록
	 * @return
	 * @throws IOException
	 */
	@GetMapping("/compression")
	public ResponseEntity<ByteArrayResource> downloadMultiFile(@RequestParam List<String> uuidList) throws IOException {
		
		// 파일 다운로드
		ByteArrayResource resource = fileService.downloadMultiFile(uuidList);
		
		return ResponseEntity.ok()
							.header("Content-Type", "application/zip")
							.header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Content-Disposition")
							.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=files.zip")
							.contentLength(resource.getByteArray().length)
							.body(resource);
	}
	
	
	/**
	 * 파일 수정
	 * 
	 * @param uuid 파일 uuid
	 * @param updateDto 파일 수정요청 DTO
	 * @return
	 */
	@PutMapping("/{uuid}")
	public ResponseEntity<Boolean> updateFile(@PathVariable String uuid, @ModelAttribute FileUpdateDto updateDto) {
		
		// 파일 수정
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
	@DeleteMapping
	public ResponseEntity<Boolean> deleteAllFile(@RequestBody List<String> uuidList) {
		
		// 파일 삭제
		Boolean result = fileService.deleteAllFile(uuidList);
		
		return ResponseEntity.ok().body(result);
	}
}
