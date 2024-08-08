package mnsc.start.jpaConfig.board.repository;

import java.util.List;

import mnsc.start.jpaConfig.board.domain.dto.PostRespDto;

public interface PostRepositoryCustom {

	/**
	 * 게시글 목록 조회
	 * 
	 * @param boardId 게시판 id
	 * @param keyWord 검색어
	 * @return
	 */
	List<PostRespDto> findAllPost(Long boardId, String keyWord);
}
