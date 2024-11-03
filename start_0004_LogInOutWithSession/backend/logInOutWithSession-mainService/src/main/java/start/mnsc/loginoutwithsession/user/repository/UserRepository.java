package start.mnsc.loginoutwithsession.user.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import start.mnsc.loginoutwithsession.user.domain.User;

public interface UserRepository extends JpaRepository<User, Long>{

	Optional<User> findByUserId(String userId);
}
