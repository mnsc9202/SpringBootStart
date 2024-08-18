package mnsc.start.withnextjsbackend.board.repository;

import java.util.List;

import mnsc.start.withnextjsbackend.board.domain.dto.BoardRespDto;

public interface BoardRepositoryCustom {

	/**
	 * 게시판 목록 조회
	 * 
	 * @return
	 */
	List<BoardRespDto> findAllBoard();
	
}
