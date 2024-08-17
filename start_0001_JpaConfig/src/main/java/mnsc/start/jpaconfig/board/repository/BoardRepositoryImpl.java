package mnsc.start.jpaconfig.board.repository;

import java.util.List;
import com.querydsl.core.group.GroupBy;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import mnsc.start.jpaconfig.board.domain.dto.BoardRespDto;
import mnsc.start.jpaconfig.board.domain.dto.PostRespDto;

import static mnsc.start.jpaconfig.board.domain.QBoard.board;
import static mnsc.start.jpaconfig.board.domain.QPost.post;

@RequiredArgsConstructor
public class BoardRepositoryImpl implements BoardRepositoryCustom {
	
	private final JPAQueryFactory jpaQueryFactory;

	// 게시판 목록 조회
	@Override
	public List<BoardRespDto> findAllBoard() {

		List<BoardRespDto> result = jpaQueryFactory
										.selectFrom(board)
										.leftJoin(post)
										.on(board.id.eq(post.board.id))
										.transform(
											GroupBy.groupBy(board.id)
													.list(Projections.fields(BoardRespDto.class,
															board.id,
															board.name,
															GroupBy.list(Projections.fields(PostRespDto.class, 
																	post.id,
																	post.title,
																	post.content
																	)).as("posts"),
															board.createdBy,
															board.createdDate,
															board.lastModifiedBy,
															board.lastModifiedDate
										)));

		// BoardRespDto의 posts가 List<Post>인 경우
		/*
		List<BoardRespDto> result =  jpaQueryFactory
										.selectFrom(board)
										.leftJoin(post)
										.on(board.id.eq(post.board.id))
										.transform(GroupBy.groupBy(board.id)
														.list(Projections.fields(BoardRespDto.class,
																board.id, board.name,
																board.createdBy, board.createdDate, board.lastModifiedBy, board.lastModifiedDate,
																GroupBy.list(post).as("posts")
													)));
		*/
		return result;
	}
	
}