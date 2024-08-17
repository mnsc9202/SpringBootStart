package mnsc.start.jpaconfig.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import mnsc.start.jpaconfig.board.domain.Board;

public interface BoardRepository extends JpaRepository<Board, Long>, BoardRepositoryCustom{

}