package start.mnsc.fileuploaddownload.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import start.mnsc.fileuploaddownload.domain.FileStorage;

public interface FileStorageRepository extends JpaRepository<FileStorage, Long> {

	public Optional<FileStorage> findByUuid(String uuid);
	public Optional<List<FileStorage>> findAllByUuidIn(List<String> uuid);
	public void deleteAllByUuidIn(List<String> uuid);
}
