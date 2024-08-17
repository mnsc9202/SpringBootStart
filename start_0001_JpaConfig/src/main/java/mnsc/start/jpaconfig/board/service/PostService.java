package mnsc.start.jpaconfig.board.service;

import java.util.List;
import javax.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import mnsc.start.jpaconfig.board.domain.Board;
import mnsc.start.jpaconfig.board.domain.Post;
import mnsc.start.jpaconfig.board.domain.dto.PostRespDto;
import mnsc.start.jpaconfig.board.domain.dto.PostSaveReqDto;
import mnsc.start.jpaconfig.board.domain.dto.PostUpdateReqDto;
import mnsc.start.jpaconfig.board.repository.BoardRepository;
import mnsc.start.jpaconfig.board.repository.PostRepository;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class PostService {
	
	private final PostRepository postRepository;
	private final BoardRepository boardRepository;
	
	
	/**
	 * 게시글 목록 조회
	 * 
	 * @param boardId 게시판 id
	 * @param keyWord 검색어
	 * @return
	 */
	public List<PostRespDto> findAllPost(Long boardId, String keyWord){
		
		return postRepository.findAllPost(boardId, keyWord);
	}
	
	
	/**
	 * 게시글 단건 조회
	 * 
	 * @param boardId 게시판 id
	 * @param postId 게시글 id
	 * @return
	 */
	public PostRespDto findPostById(Long boardId, Long postId) {
		
		// 1. Board 조회
		boardRepository.findById(boardId)
					.orElseThrow(() -> new EntityNotFoundException("board 엔티티를 조회할 수 없음!"));
		
		// 2. Post 조회
		Post post = postRepository.findById(postId)
								.orElseThrow(() -> new EntityNotFoundException("post 엔티티를 조회할 수 없음!"));
		
		// 3. Board와 Post관계 확인
		// 3.1 요청한 Board와 Post의 정보가 다른 경우
		if(!boardId.equals(post.getBoard().getId())) return null;
		
		// 4. response 생성
		return new PostRespDto(post);
	}
	
	
	/**
	 * 게시글 저장
	 * 
	 * @param reqDto 게시글 저장요청 DTO
	 * @return
	 */
	@Transactional(readOnly = false)
	public PostRespDto savePost(PostSaveReqDto reqDto) {
		
		// 1. Board 조회
		Board board = boardRepository.findById(reqDto.getBoardId())
									.orElseThrow( () ->	new EntityNotFoundException("board 엔티티를 찾을 수 없음!"));
		
		// 2. Post 생성
		Post post = new Post().builder()
							.title(reqDto.getTitle())
							.content(reqDto.getContent())
							.board(board)
							.build();
		
		// 3. Post 저장
		postRepository.save(post);
		
		// 4. response 생성
		return new PostRespDto(post);
	}
	
	
	/**
	 * 게시글 수정
	 * 
	 * @param reqDto 게시글 수정요청 DTO
	 * @return
	 */
	@Transactional(readOnly = false)
	public Boolean updatePost(PostUpdateReqDto reqDto) {
		
		// 1. Board 조회
		boardRepository.findById(reqDto.getBoardId())
					.orElseThrow(()-> new EntityNotFoundException("board 엔티티를 조회할 수 없음!"));
		
		// 2. Post 조회
		Post post = postRepository.findById(reqDto.getPostId())
								.orElseThrow(()-> new EntityNotFoundException("post 엔티티를 조회할 수 없음!"));
		
		// 3. Board와 Post관계 확인
		// 3.1 요청한 Board와 Post의 정보가 다른 경우
		if(!reqDto.getBoardId().equals(post.getBoard().getId())) return false;
		
		// 4. Post 수정
		post.updateToDto(reqDto);
		
		// 5. Post 저장
		postRepository.save(post);
		
		return true;
	}
	
	
	/**
	 * 게시글 삭제
	 * 
	 * @param boardId 게시판 id
	 * @param postId 게시글 id
	 * @return
	 */
	@Transactional(readOnly = false)
	public Boolean deletePost(Long boardId, Long postId) {
		
		// 1. Board 조회
		boardRepository.findById(boardId)
					.orElseThrow(()-> new EntityNotFoundException("board 엔티티를 조회할 수 없음!"));
		
		// 2. Post 조회
		Post post = postRepository.findById(postId)
								.orElseThrow(()-> new EntityNotFoundException("post 엔티티를 조회할 수 없음!"));
		
		// 3. Board와 Post관계 확인
		// 3.1 요청한 Board와 Post의 정보가 다른 경우
		if(!boardId.equals(post.getBoard().getId())) return false;
		
		// 4. Post 삭제
		postRepository.deleteById(postId);
		
		return true;
	}

}
