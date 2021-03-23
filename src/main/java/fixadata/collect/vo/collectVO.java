package fixadata.collect.vo;

import java.io.Serializable;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

/**
 * 데이터 수집 데이터
 * @author air82
 *
 */
@Data
public class collectVO implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 등록한 디비 정보
	 */
	private int db_sn;
	/**
	 * 추출 테이블
	 */
	private String table;
	/**
	 * 추출 기준
	 */
	private int limit;
	/**
	 * 기준
	 */
	private String asof;

	/**
	 * 업로드 파일
	 */
	private MultipartFile uploadFile;

	/**
	 * collect 수집 타입 (file, db, basic_data)
	 * file : xls, xlsx, csv 파일을 통한 수집
	 * db : 데이터베이스를 통한 수집
	 * basic_data : 기본 데이터를 통한 수집
	 */
	private String collect_flag="file";

	private String ord = "desc";

	/**
	 * 샘플 테이블 sn
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

	/**
	 * 스케줄링 테이블
	 */
	private String schedule_data_sn;
	/**
	 * excel(xls,xlsx) sheet번호
	 */
	int sheetIndex = 0;
}