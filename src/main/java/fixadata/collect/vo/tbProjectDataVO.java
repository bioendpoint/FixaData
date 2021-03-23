package fixadata.collect.vo;

import java.io.Serializable;

import lombok.Data;

/**
 * 데이터 수집 데이터
 * @author Tom.DongHyuk
 *
 */
@Data
public class tbProjectDataVO implements Serializable {

	/**
	 *
	 */
	//private static final long serialVersionUID = 1L;
	/**
	 *
	 */
	private int project_data_sn;
	/**
	 *
	 */
	private int project_sn=-1;
	/**
	 *
	 */
	private String data;

	/**
	 * HEADER 정보
	 */
	private String header;
	/**
	 *
	 */
	private int data_version=-1;
	/**
	 *
	 */
	private String insert_dt;
	/**
	 *
	 */
	private String step;

	/**
	 * 회원코드
	 */
	private int member_sn;

	/**
	 * 수집 정보
	 */
	private String collect_info;

	/**
	 * 데이터 타입 및 명칭
	 */
	private String header_option;

	/**
	 * 다이어그램정보
	 */
	private String diagram_layout;

	/**
	 * mac_address 정보
	 */
	private String mac_address;

	/**
	 * blockchain 정보
	 */
	private String blockchain;
}