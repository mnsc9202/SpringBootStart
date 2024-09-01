package start.mnsc.fileuploaddownload.service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import javax.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;
import start.mnsc.fileuploaddownload.domain.FileStorage;
import start.mnsc.fileuploaddownload.domain.dto.FileRespDto;
import start.mnsc.fileuploaddownload.domain.dto.FileUpdateDto;
import start.mnsc.fileuploaddownload.domain.dto.FileUploadDto;
import start.mnsc.fileuploaddownload.repository.FileStorageRepository;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class FileService {
	
	private final FileStorageRepository fileStorageRepository;

	@Value("${start.mnsc.upload.path}")
	private String uploadPath;
	
	
	/**
	 * 파일 목록 조회
	 * 
	 * @return
	 */
	public List<FileRespDto> findAllFile() {
		
		// 1. FileStorage 목록 조회
		List<FileStorage> fileList = fileStorageRepository.findAll();
		
		// 2. FileRespDto 변환
		List<FileRespDto> fileRespDtoList = fileList.stream()
												.map(i-> new FileRespDto(i))
												.collect(Collectors.toList());
		
		return fileRespDtoList;
	}
	
	
	/**
	 * 파일 단건 조회
	 * 
	 * @param uuid 파일 uuid
	 * @return
	 */
	public FileRespDto findFile(String uuid) {
		
		// 1. FileStorage 조회
		FileStorage file = fileStorageRepository.findByUuid(uuid)
											.orElseThrow(()-> new EntityNotFoundException("File을 찾을 수 없음!"));
		
		// 2. FileRespDto 변환
		FileRespDto fileRespDto = new FileRespDto(file);
		
		return fileRespDto;
	}
	
	
	/**
	 * 파일 미리보기 (단건)
	 * 
	 * @param uuid 파일 uuid
	 * @return
	 */
	public byte[] previewFile(String uuid) {
		
		// 1. FileStorage 조회
		FileStorage fileStorage = fileStorageRepository.findByUuid(uuid)
													.orElseThrow(()-> new EntityNotFoundException("File을 찾을 수 없음!"));
		
		// 2. byte[] 조회
		Path filePath = Paths.get(uploadPath, fileStorage.getUuid() + "_" + fileStorage.getOriginFileName());
		try {
			InputStream inputStream = new FileInputStream(filePath.toFile());
			
			byte[] content = inputStream.readAllBytes();
			
			// 3. inputStream 종료
			inputStream.close();
			
			return content;
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	
	/**
	 * 파일 업로드
	 * 
	 * @param reqDto 파일 업로드요청 DTO
	 * @return
	 */
	@Transactional(readOnly = false)
	public Boolean uploadFile(FileUploadDto reqDto) {
		
		// 0. 준비사항
		Boolean isSaveSuccess = true;	// response
		
		// 1. 저장
		for(MultipartFile file : reqDto.getFiles()) {
			
			// 1.0 파일 저장 준비사항
			String originalFileName = file.getOriginalFilename(); // 원본 파일명
			String uuid = UUID.randomUUID().toString(); // uuid
			Path savePath = Paths.get(uploadPath, uuid + "_" + originalFileName); // 경로: 저장경로/uuid_originalFileName
			String mimeType = null; // MIME 타입
			String extension = StringUtils.getFilenameExtension(originalFileName); // 확장자
			
			// MIME 타입 조회
			try {
				mimeType = Files.probeContentType(savePath);
			} catch (IOException e) {
				isSaveSuccess = false;
				e.printStackTrace();
			}
			
			
			try {
				// 1.1 파일 저장 (디스크)
				file.transferTo(savePath);
				
				// 1.2 파일정보 저장 (DB)
				// 1.2.1 FileStorage 생성
				FileStorage fileStorage = new FileStorage().builder()
															.description(reqDto.getDescription())
															.originFileName(originalFileName)
															.uuid(uuid)
															.extension(extension)
															.mimeType(mimeType)
															.build();
						
				// 1.2.2 db 저장
				fileStorageRepository.save(fileStorage);
			} catch (IllegalStateException | IOException e) {
				isSaveSuccess = false;
				e.printStackTrace();
			}
		}		
		return isSaveSuccess;
	}
	
	
	/**
	 * 파일 다운로드 (단건)
	 * 
	 * @param uuid 파일 uuid
	 * @return
	 */
	public Resource downloadFile(String uuid) {
		
		// 1. FileStorage 조회
		FileStorage fileStorage = fileStorageRepository.findByUuid(uuid)
													.orElseThrow(()-> new EntityNotFoundException("File을 찾을 수 없음!"));
		
		// 2. Resource 생성
		Resource resource = new FileSystemResource(uploadPath + File.separator + fileStorage.getUuid() + "_" + fileStorage.getOriginFileName());
		
		return resource;
	}
	
	
	/**
	 * 파일 다운로드 (목록 - 압축 다운로드)
	 * 
	 * @param uuidList 파일 uuid 목록
	 * @return
	 */
	public ByteArrayResource downloadMultiFile(List<String> uuidList) {
		// 1. FileStorage 조회
		List<FileStorage> fileStorageList = fileStorageRepository.findAllByUuidIn(uuidList)
																.orElseThrow(()-> new EntityNotFoundException("File을 찾을 수 없음!"));
		
		// 2. zip압축
		// 2.0 zip 압축을 위한 준비사항
		ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream(); // 바이트배열 출력스트림
		ZipOutputStream zipOutputStream = new ZipOutputStream(byteArrayOutputStream); // zip 출력스트림

		try {
			// 2.1 zipEntry 추가
			for(String uuid: uuidList) {
				// 2.1.0 준비사항
				// 원본 파일명
				String originFileName = fileStorageList.stream().filter(i -> i.getUuid().equals(uuid))
																.findFirst()
																.get().getOriginFileName();

				Path path = Paths.get(uploadPath, uuid + "_" + originFileName); // 경로
				String fileName = path.getFileName().toString(); // 파일명
				byte[] bytes = Files.readAllBytes(path); // 바이트배열
				
				// 2.1.1 zipEntry 생성
				ZipEntry zipEntry = new ZipEntry(fileName);
				
				// 2.1.2 zip 출력스트림에 zipEntry에 추가
				zipOutputStream.putNextEntry(zipEntry);
				
				// 2.1.3 zip 출력스트림에 파일 작성
				zipOutputStream.write(bytes);
				
				// 2.1.4 zipEntry 종료
				zipOutputStream.closeEntry();
			}			
			
			// 2.2 zipOutputStream 종료
			zipOutputStream.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		// 3. 변환: zip -> ByteArrayResource
		byte[] zipBytes = byteArrayOutputStream.toByteArray();
		ByteArrayResource resource = new ByteArrayResource(zipBytes);
        
        return resource;
	}
	
	
	/**
	 * 파일 수정
	 * 
	 * @param updateDto 파일 수정요청 DTO
	 * @return
	 */
	@Transactional(readOnly = false)
	public Boolean updateFile(FileUpdateDto updateDto) {
		
		// 0. 준비사항 
		Boolean isUpdateSuccess = true; // response
		
		// 1. FileStorage 조회
		FileStorage fileStorage = fileStorageRepository.findByUuid(updateDto.getUuid())
													.orElseThrow(()-> new EntityNotFoundException("File을 찾을 수 없음!"));
		
		// 2. 수정
		// 2.1 파일 수정 (디스크)
		if(updateDto.getFile() != null && !updateDto.getFile().isEmpty()) {
			// 2.1.0 파일 준비사항
			// Resource 생성 (기존 파일)
			Resource resource = new FileSystemResource(uploadPath + File.separator + fileStorage.getUuid() + "_" + fileStorage.getOriginFileName());
			
			// MultipartFile (신규 파일)
			MultipartFile file = updateDto.getFile();
			
			String originalFileName = file.getOriginalFilename(); // 원본 파일명
			String uuid = updateDto.getUuid(); // uuid
			Path savePath = Paths.get(uploadPath, uuid + "_" + originalFileName); // 경로: 저장경로/uuid_originalFileName
			String mimeType = null; // MIME 타입
			String extension = StringUtils.getFilenameExtension(originalFileName); // 확장자
			
			// MIME 타입 설정
			try {
				mimeType = Files.probeContentType(savePath);
			} catch (IOException e) {
				isUpdateSuccess = false;
				e.printStackTrace();
			}
			
			// 파일 삭제 및 등록
			try {
				// 2.1.1 기존 파일 삭제
				resource.getFile().delete();
				
				// 2.1.2 수정 파일 등록
				file.transferTo(savePath);
				
				// 2.2 파일 수정 (DB)
				fileStorage.update(updateDto.getDescription(), originalFileName, extension, mimeType);
			} catch (IOException e) {
				isUpdateSuccess = false;
				e.printStackTrace();
			}
		}
		
		// 2.2 파일 수정 (DB)
		fileStorage.updateDescription(updateDto.getDescription());
		
		// 2.2.1 FileStorage 저장
		fileStorageRepository.save(fileStorage);
		
		return isUpdateSuccess;
	}
	
	
	/**
	 * 파일 삭제 (단건)
	 * 
	 * @param uuid 파일 uuid
	 * @return
	 */
	@Transactional(readOnly = false)
	public Boolean deleteFile(String uuid) {
		
		// 0. 준비사항 
		Boolean isDeleteSuccess = true; // response
		
		// 1. FileStorage 조회
		FileStorage fileStorage = fileStorageRepository.findByUuid(uuid)
													.orElseThrow(()-> new EntityNotFoundException("File을 찾을 수 없음!"));
		
		// 2. 삭제
		// 2.1 파일 삭제 (디스크)
		// 2.1.1 Resource 생성
		Resource resource = new FileSystemResource(uploadPath + File.separator + fileStorage.getUuid() + "_" + fileStorage.getOriginFileName());
		try {
			// 2.1.2 파일 삭제
			isDeleteSuccess = resource.getFile().delete();
			
			// 2.2 파일정보 삭제 (DB)
			fileStorageRepository.delete(fileStorage);
		} catch (IOException e) {
			isDeleteSuccess = false;
			e.printStackTrace();
		}		
		
		return isDeleteSuccess;		
	}
	
	
	/**
	 * 파일 삭제 (목록)
	 * 
	 * @param uuidList 파일 uuid 목록
	 * @return
	 */
	@Transactional(readOnly = false)
	public Boolean deleteAllFile(List<String> uuidList) {
		// 0. 준비사항
		Boolean isDeleteSuccess = true; // response 
		
		// 1. FileStorage 조회
		List<FileStorage> fileStorageList = fileStorageRepository.findAllByUuidIn(uuidList)
																.orElseThrow(()-> new EntityNotFoundException("File을 찾을 수 없음!"));
		
		// 2. 삭제
		for(String uuid : uuidList) {
			// 2.0 준비사항
			// 원본 파일명
			String originFileName = fileStorageList.stream().filter(i -> i.getUuid().equals(uuid))
															.findFirst()
															.get().getOriginFileName();
			
			// 2.1 파일 삭제 (디스크)
			// 2.1.1 Resource 생성
			Resource resource = new FileSystemResource(uploadPath + File.separator + uuid + "_" + originFileName);
			try {
				isDeleteSuccess = resource.getFile().delete();
				
			} catch (IOException e) {
				isDeleteSuccess = false;
				e.printStackTrace();
			}		
		}
		
		// 2.2 파일정보 삭제 (DB)
		fileStorageRepository.deleteAllByUuidIn(uuidList);
		
		return isDeleteSuccess;		
	}
}
