package mnsc.start.jpaConfig.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import mnsc.start.jpaConfig.board.domain.Board;

public interface BoardRepository extends JpaRepository<Board, Long>, BoardRepositoryCustom{

}