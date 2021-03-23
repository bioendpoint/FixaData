package fixadata.collect.vo;

import java.io.Serializable;

import jxl.write.DateTime;
import lombok.Data;

/**
 * TABLE schedule
 * @author Tom.DongHyuk
 *
 */
@Data
public class scheduleVO implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	private int schedule_sn;
	/**
	 *
	 */
	private String member_sn;
	/**
	 *
	 */
	private String schedule_title;
	/**
	 * 스케줄링  title
	 */
	private String schedule_url ;
	/**
	 * 수집 url
	 */
	private String schedule_path;
	/**
	 * json_path
	 */
	private String schedule_type;
	/**
	 * 수집방법
	 */
	private String schedule_term_type;
	/**
	 * 수집 주기 (0:시간/1:주기)
	 */
	private String schedule_term;
	/**
	 * 수집주기 상제
	 */
	private String schedule_after;
	/**
	 * 후처리
	 */
	private String schedule_active;
	/**
	 * 동작여부 (0:돟작/1:비동작)
	 */
	private DateTime insert_dt;
	/**
	 *
	 */
	private String dataList;
}
