package fixadata.collect.vo;

import java.io.Serializable;

import lombok.Data;

@Data
public class versionInfoVO implements Serializable {

	private static final long serialVersionUID = 1L;
	private int version_sn;
	private String version_nm;
	private String insert_dt;
	private String update_dt;
}