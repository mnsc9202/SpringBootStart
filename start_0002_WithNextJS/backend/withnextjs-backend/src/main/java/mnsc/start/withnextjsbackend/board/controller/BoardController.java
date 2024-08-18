package mnsc.start.withnextjsbackend.board.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import mnsc.start.withnextjsbackend.board.domain.dto.BoardRespDto;
import mnsc.start.withnextjsbackend.board.domain.dto.BoardSaveReqDto;
import mnsc.start.withnextjsbackend.board.domain.dto.BoardUpdateReqDto;
import mnsc.start.withnextjsbackend.board.service.BoardService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/board")
public class BoardController {

	private final BoardService boardService;
	
	
	/**
	 * 게시판 목록 조회
	 * 
	 * @return
	 */
	@GetMapping
	public List<BoardRespDto> findAllBoard(){
		
		return boardService.findAllBoard();
	}
	
	
	/**
	 * 게시판 단건 조회
	 * 
	 * @param boardId 게시판 id
	 * @return
	 */
	@GetMapping("/{boardId}")
	public BoardRespDto findBoardById(@PathVariable Long boardId) {
		
		return boardService.findBoardById(boardId);
	}
	
	
	/**
	 * 게시판 저장
	 * 
	 * @param reqDto 게시판 저장요청 DTO
	 * @return
	 */
	@PostMapping
	public BoardRespDto saveBoard(@RequestBody BoardSaveReqDto reqDto) {
		
		return boardService.saveBoard(reqDto);
	}
	
	
	/**
	 * 게시판 수정
	 * 
	 * @param reqDto 게시판 수정요청 DTO
	 * @return
	 */
	@PutMapping
	public ResponseEntity<Void> updateBoard(@RequestBody BoardUpdateReqDto reqDto){
		
		boardService.updateBoard(reqDto);
		
		return new ResponseEntity<>(HttpStatus.OK);
	}
		
	
	/**
	 * 게시판 삭제
	 * 
	 * @param boardId 게시판 id
	 * @return
	 */
	@DeleteMapping("/{boardId}")
	public ResponseEntity<Boolean> deleteBoard(@PathVariable Long boardId){
		Boolean result = boardService.deleteBoard(boardId);
		
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
}
