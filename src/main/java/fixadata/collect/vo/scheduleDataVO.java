package fixadata.collect.vo;

import java.io.Serializable;

import jxl.write.DateTime;
import lombok.Data;

/**
 * TABLE schedule_data
 * @author Tom.DongHyuk
 *
 */
@Data
public class scheduleDataVO implements Serializable {

	/**
	 *
	 */
	private String schedule_data_sn;
	/**
	 *
	 */
	private String schedule_sn;
	/**
	 *
	 */
	private String header;
	/**
	 *
	 */
	private String header_option ;
	/**
	 *
	 */
	private String data;
	/**
	 *
	 */
	private String word_info;
	/**
	 *
	 */
	private DateTime insert_dt;
	/**
	 *
	 */
}
