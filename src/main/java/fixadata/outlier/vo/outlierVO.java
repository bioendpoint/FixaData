package fixadata.outlier.vo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;

import lombok.Data;

/**
 * 데이터 수집 데이터
 * @author Tom.DongHyuk (bioendpoint@gmail.com)
 *
 */
@Data
public class outlierVO implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 프로젝트 코드
	 */
	private int project_sn=-1;

	/**
	 * 프로젝트 데이터 코드
	 */
	private int project_data_sn = -1;

	/**
	 * 처리할 룰셋 리스트
	 */
	private ArrayList<HashMap> ruleSet;

}
