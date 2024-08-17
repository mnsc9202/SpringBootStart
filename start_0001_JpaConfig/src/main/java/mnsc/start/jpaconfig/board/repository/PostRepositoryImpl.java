package mnsc.start.jpaconfig.board.repository;

import java.util.List;
import org.springframework.util.StringUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import mnsc.start.jpaconfig.board.domain.dto.PostRespDto;

import static mnsc.start.jpaconfig.board.domain.QPost.post;

@RequiredArgsConstructor
public class PostRepositoryImpl implements PostRepositoryCustom{
	
	private final JPAQueryFactory jpaQueryFactory;

	
	// 게시글 목록 조회
	@Override
	public List<PostRespDto> findAllPost(Long boardId, String keyWord) {

		return jpaQueryFactory.select(Projections.fields(PostRespDto.class,
										post.id,
										post.title,
										post.content))
								.from(post)
								.where(searchKeyWord(keyWord),
										post.board.id.eq(boardId))
								.orderBy(post.createdDate.desc())
								.fetch();
	}
	
	/**
	 * 검색어 검색 조건 (동적쿼리)
	 * 
	 * @param keyWord 검색어
	 * @return
	 */
	private BooleanExpression searchKeyWord(String keyWord) {
		String addWildCard = "%" + keyWord + "%";
		if(!StringUtils.hasText(keyWord)) return null;
		return post.title.like(addWildCard);
	}	
	
}
