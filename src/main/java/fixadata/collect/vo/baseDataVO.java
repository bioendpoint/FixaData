package fixadata.collect.vo;

import java.io.Serializable;

import lombok.Data;

/**
 * TABLE base_data
 * @author Tom.DongHyuk
 *
 */
@Data
public class baseDataVO implements Serializable {
	/**
	 *
	 */
	private static final long serialVersionUID = 1L;
	/**
	 *
	 */
	private int base_data_sn;
	/**
	 *
	 */
	private String data_name;
	/**
	 *
	 */
	private String data ;
	/**
	 *
	 */
	private String header;

	private int flag;

	private String strd_header;

	private String use_yn;
}