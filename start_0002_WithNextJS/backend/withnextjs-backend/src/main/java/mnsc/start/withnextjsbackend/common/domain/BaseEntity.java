package mnsc.start.withnextjsbackend.common.domain;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import org.hibernate.annotations.Comment;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import lombok.Getter;

@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
	
	@CreatedBy
	@Column(updatable = false)
	@Comment("생성자")
	private String createdBy;
		
	@CreatedDate
	@Column(updatable = false)
	@Comment("생성일")
	private LocalDateTime createdDate;
	
	@LastModifiedBy
	@Comment("수정자")
	private String lastModifiedBy;
	
	@LastModifiedDate
	@Comment("수정일")
	private LocalDateTime lastModifiedDate;
	
}
