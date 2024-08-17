package mnsc.start.jpaconfig.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import mnsc.start.jpaconfig.board.domain.Post;

public interface PostRepository extends JpaRepository<Post, Long>, PostRepositoryCustom{

}
