package fixadata.outlier.service;

import java.util.HashMap;

import fixadata.outlier.vo.outlierVO;

public interface OutlierService {

	/**
	 * 프로젝트 버전 정보 리턴 리스트
	 * 
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	HashMap runWorkFlow(outlierVO vo) throws Exception;

}
