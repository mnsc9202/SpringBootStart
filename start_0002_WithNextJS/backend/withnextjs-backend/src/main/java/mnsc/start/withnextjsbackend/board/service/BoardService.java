package mnsc.start.withnextjsbackend.board.service;

import java.util.List;
import javax.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import mnsc.start.withnextjsbackend.board.domain.Board;
import mnsc.start.withnextjsbackend.board.domain.Post;
import mnsc.start.withnextjsbackend.board.domain.dto.BoardRespDto;
import mnsc.start.withnextjsbackend.board.domain.dto.BoardSaveReqDto;
import mnsc.start.withnextjsbackend.board.domain.dto.BoardUpdateReqDto;
import mnsc.start.withnextjsbackend.board.repository.BoardRepository;
import mnsc.start.withnextjsbackend.board.repository.PostRepository;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class BoardService {

	private final BoardRepository boardRepository;
	private final PostRepository postRepository;
	
	
	/**
	 * 게시판 목록 조회
	 * 
	 * @return
	 */
	public List<BoardRespDto> findAllBoard() {
		return boardRepository.findAllBoard();
	}

	
	/**
	 * 게시판 단건 조회
	 * 
	 * @param boardId 게시판 id
	 * @return
	 */
	public BoardRespDto findBoardById(Long boardId) {
		// 1. Board 조회 
		Board board = boardRepository.findById(boardId)
									.orElseThrow(() -> new EntityNotFoundException("board 엔티티를 조회할 수 없음!"));
		
		// 2. response 생성
		return new BoardRespDto(board);
	}
	
	
	/**
	 * 게시판 저장
	 * 
	 * @param reqDto 게시판 저장요청 DTO
	 * @return
	 */
	@Transactional(readOnly = false)
	public BoardRespDto saveBoard(BoardSaveReqDto reqDto) {
		// 1. Board 생성
		Board board = new Board().builder()
								.name(reqDto.getName())
								.build();
		
		// 2. Board 저장
		Board saveBoard = boardRepository.save(board);
		
		
		// 3. response 생성
		return new BoardRespDto(saveBoard);	
	}
	
	
	/**
	 * 게시판 수정
	 * 
	 * @param reqDto 게시판 수정요청 DTO
	 * @return
	 */
	@Transactional(readOnly = false)
	public Boolean updateBoard(BoardUpdateReqDto reqDto) {
		// 1. Board 조회
		Board board = boardRepository.findById(reqDto.getId())
									.orElseThrow(() -> new EntityNotFoundException("board 엔티티를 조회할 수 없음!"));
		
		// 2. Board 수정
		board.updateName(reqDto.getName());
		
		// 3. Board 저장
		boardRepository.save(board);
		
		return true; 
	}
	
	
	/**
	 * 게시판 삭제
	 * 
	 * @param boardId 게시판 id
	 * @return
	 */
	@Transactional(readOnly = false)
	public Boolean deleteBoard(Long boardId) {
		// 1. Board 조회 
		Board board = boardRepository.findById(boardId)
									.orElseThrow(() -> new EntityNotFoundException("board 엔티티를 조회할 수 없음!"));

		// 2. Post 조회
		List<Post> post = board.getPosts();
				
		// 3. 삭제
		// 3.1 Board에 속하는 Post가 있는 경우 Post 전체 삭제
		if(!post.isEmpty()) postRepository.deleteAllInBatch(post);

		// 3.2 Board 삭제
		boardRepository.deleteById(boardId);
		
		return true;
	}
	
}