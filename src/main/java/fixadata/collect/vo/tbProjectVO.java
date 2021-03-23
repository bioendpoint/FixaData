package fixadata.collect.vo;

import java.io.Serializable;

import lombok.Data;

/**
 * TB_PROJECT
 * @author Tom.DongHyuk *
 */
@Data
public class tbProjectVO implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;
	/**
	 *
	 */
	private int project_sn=-1;
	/**
	 *
	 */
	private int member_sn=-1;
	/**
	 *
	 */
	private String project_name;
	/**
	 *
	 */
	private int flag =-1;
	/**
	 *
	 */
	private String insert_dt;
	/**
	 *
	 */
	private String workflow;
}