package mnsc.start.jpaConfig.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import mnsc.start.jpaConfig.board.domain.Post;

public interface PostRepository extends JpaRepository<Post, Long>, PostRepositoryCustom{

}
