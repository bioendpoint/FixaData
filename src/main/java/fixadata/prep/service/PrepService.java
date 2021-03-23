package fixadata.prep.service;


import java.util.List;
import java.util.Map;

import fixadata.collect.vo.tbProjectDataVO;
import fixadata.collect.vo.tbProjectVO;



public interface PrepService {
	/**
	 * 등록된 prep데이터 로드
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public List<tbProjectDataVO> selectPrepDataList(tbProjectDataVO vo) throws Exception;

	/**
	 * 전처리 데이터 로드
	 * @param uploadFile
	 * @param mv
	 * @return
	 * @throws Exception
	 */
	public tbProjectDataVO selectLoadData(tbProjectDataVO vo) throws Exception;
	/**
	 * 전처리 데이터 저장
	 * @param map
	 * @param model
	 * @return
	 * @throws Exception
	 */
	public int savePrep(Map<String, Object> jsonData)throws Exception;

	public int saveAsPrep(Map<String, Object> jsonData)throws Exception;


	public int udpatePrep(Map<String, Object> jsonData)throws Exception;

	public int diagramUpdatePrep(Map<String, Object> jsonData)throws Exception;

	/**
	 * 전처리 FLAG 체크
	 * @return
	 * @throws Exception
	 */
	public tbProjectVO selectTbProjectCheck(tbProjectVO vo)throws Exception;

}
