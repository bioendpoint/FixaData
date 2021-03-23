package fixadata.collect.vo;

import java.io.Serializable;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class vocaManagerVO implements Serializable {
	/**
	 *
	 */
	private static final long serialVersionUID = 1L;
	private int voca_sn;
	private int voca_name;
	private int voca_dc;
	private int voca_type;
	private int insert_dt;
	private int update_dt;
	private MultipartFile uploadFile;
}