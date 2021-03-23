package fixadata.rule.vo;

import java.io.Serializable;

import lombok.Data;

@Data
public class ruleManagerVO implements Serializable {
	
	
	private static final long serialVersionUID = 1L;
	
	private String rule_sn;
	private String rule_name;
	private String rule_dc;
	private String rule_cont;
	private String rule_gb;
	private String rule_base_data_gb;
	private String insert_dt;
	private String update_dt;
	private String rule_icon_uri;
	private String rule_member_id;
	private String rule_opt;
	
}
