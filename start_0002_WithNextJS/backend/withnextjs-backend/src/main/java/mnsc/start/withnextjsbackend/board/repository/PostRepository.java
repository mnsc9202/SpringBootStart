package mnsc.start.withnextjsbackend.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import mnsc.start.withnextjsbackend.board.domain.Post;

public interface PostRepository extends JpaRepository<Post, Long>, PostRepositoryCustom{

}
