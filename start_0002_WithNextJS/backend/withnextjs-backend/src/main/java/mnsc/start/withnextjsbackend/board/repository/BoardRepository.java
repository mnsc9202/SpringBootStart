package mnsc.start.withnextjsbackend.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import mnsc.start.withnextjsbackend.board.domain.Board;

public interface BoardRepository extends JpaRepository<Board, Long>, BoardRepositoryCustom{

}