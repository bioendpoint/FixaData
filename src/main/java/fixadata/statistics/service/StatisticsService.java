package fixadata.statistics.service;


import java.util.List;

import fixadata.collect.vo.collectVO;
import fixadata.collect.vo.dbInfoVO;
import fixadata.collect.vo.tbProjectDataVO;
import fixadata.collect.vo.tbProjectVO;

public interface StatisticsService {

	/**
	 * 디비 등록
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	int insertDbInfo(dbInfoVO vo) throws Exception ;

	/**
	 * 디비정보 수정
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	int updateDbInfo(dbInfoVO vo) throws Exception ;


	/**
	 * 디비 정보 추출
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	List<dbInfoVO> selectDbList(dbInfoVO vo) throws Exception;


	/**
	 * DB_SN으로 데이터 정보 추출
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	dbInfoVO selectDbInfoBySn(dbInfoVO vo) throws Exception;


	/**
	 * 데이터 수집 처리 로직
	 * @param uploadFile
	 * @return
	 * @throws Exception
	 */
	int collectUploadProcess(collectVO collectVO)throws Exception;

	/**
	 * 프로젝트 리스트
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	List<tbProjectVO> selectProjectList(tbProjectVO vo) throws Exception;

	/**
	 * 프로젝트 버전 정보 리턴 리스트
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	List<tbProjectDataVO> selectProjectDataVersionList(tbProjectDataVO vo) throws Exception;

}