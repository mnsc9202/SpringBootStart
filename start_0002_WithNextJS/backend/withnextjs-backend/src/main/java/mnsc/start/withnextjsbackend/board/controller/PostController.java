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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import mnsc.start.withnextjsbackend.board.domain.dto.PostRespDto;
import mnsc.start.withnextjsbackend.board.domain.dto.PostSaveReqDto;
import mnsc.start.withnextjsbackend.board.domain.dto.PostUpdateReqDto;
import mnsc.start.withnextjsbackend.board.service.PostService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/post")
public class PostController {

	private final PostService postService;
		
	
	/**
	 * 게시글 목록 조회
	 * 
	 * @param boardId 게시판 id
	 * @param keyWord 검색어
	 * @return
	 */
	@GetMapping("/{boardId}")
	public List<PostRespDto> findAllPost(@PathVariable Long boardId,
										@RequestParam(required = false) String keyWord){
		
		return postService.findAllPost(boardId, keyWord);
	}
	
	
	/**
	 * 게시글 단건 조회
	 * 
	 * @param boardId 게시판 id
	 * @param postId 게시글 id
	 * @return
	 */
	@GetMapping("/{boardId}/{postId}")
	public PostRespDto findPostById(@PathVariable Long boardId, @PathVariable Long postId) {
		
		return postService.findPostById(boardId, postId);
	}
	
	
	/**
	 * 게시글 저장
	 * 
	 * @param reqDto 게시글 저장요청 DTO
	 * @return
	 */
	@PostMapping
	public PostRespDto savePost(@RequestBody PostSaveReqDto reqDto) {
		
		return postService.savePost(reqDto);
	}
	
	
	/**
	 * 게시글 수정
	 * 
	 * @param reqDto 게시글 수정요청 DTO
	 * @return
	 */
	@PutMapping
	public ResponseEntity<Void> updatePost(@RequestBody PostUpdateReqDto reqDto){
		
		postService.updatePost(reqDto);
		
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	
	/**
	 * 게시글 삭제
	 * 
	 * @param boardId 게시판 id
	 * @param postId 게시글 id
	 * @return
	 */
	@DeleteMapping("/{boardId}/{postId}")
	public ResponseEntity<Boolean> deletePost(@PathVariable Long boardId, @PathVariable Long postId){
		
		Boolean result = postService.deletePost(boardId, postId);
		
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
}
