package fixadata.collect.vo;

import java.io.Serializable;

import lombok.Data;

@Data
public class dbInfoVO implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;
	private int db_sn;
	private String driver;
	private String url;
	private String id;
	private String pw;
	private String insert_dt;
	private String member_sn;
	private String table;
}
