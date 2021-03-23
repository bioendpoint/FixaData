package fixadata.collect.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import fixadata.collect.vo.baseDataVO;
import fixadata.collect.vo.collectVO;
import fixadata.collect.vo.dbInfoVO;
import fixadata.collect.vo.scheduleDataVO;
import fixadata.collect.vo.scheduleVO;
import fixadata.collect.vo.tbProjectDataVO;
import fixadata.collect.vo.tbProjectVO;
import fixadata.collect.vo.versionInfoVO;

public interface CollectService {

	/**
	 * 디비 등록
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	int insertDbInfo(dbInfoVO vo) throws Exception ;

	int standardInsert(baseDataVO searchVO) throws Exception;

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

	void collectimportProcess(tbProjectVO tbProjectVO,Map<String, Object> jsonData)throws Exception;

	/**
	 * 표준용어데이터 수집 처리 로직
	 * @param uploadFile
	 * @return
	 * @throws Exception
	 */
	int collectStandardVocaUploadProcess(collectVO collectVO)throws Exception;

	/**
	 * 프로젝트 리스트
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	List<tbProjectVO> selectProjectList(tbProjectVO vo) throws Exception;

	tbProjectDataVO selectProjectDataInfo(tbProjectDataVO vo) throws Exception;

	int selectProjectDataInfoCnt(tbProjectDataVO vo) throws Exception;

	/**
	 * 프로젝트 버전 정보 리턴 리스트
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	List<tbProjectDataVO> selectProjectDataVersionList(tbProjectDataVO vo) throws Exception;

	/**
	 * 임시 프로젝트 및 데이터 삭제 로직.
	 * @param globalDay
	 */
	void tmpProjectDataDelete(String globalDay) throws Exception;

	/**
	 * 샘플 리스트
	 * @param searchVO
	 * @return
	 * @throws Exception
	 */
	List<baseDataVO> selectSampleList(baseDataVO baseDataVO) throws Exception;

	/**
	 * 샘플 리스트
	 * @param searchVO
	 * @return
	 * @throws Exception
	 */
	List<baseDataVO> selectStandardList(baseDataVO baseDataVO) throws Exception;

	/**
	 * 샘플 리스트
	 * @param searchVO
	 * @return
	 * @throws Exception
	 */
	List<baseDataVO> selectCordDomainList(baseDataVO baseDataVO) throws Exception;

	/**
	 * 프로젝트 리스트 카운트
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	int selectProjectDataListCnt(tbProjectVO vo) throws Exception;

	int selectProjectDataSn(tbProjectDataVO vo) throws Exception;

	void inserOpenApiProject(ArrayList<Map<String, Object>> result,ArrayList<String> headerList,String name) throws Exception;

	//	String selectProjectSn() throws Exception;
	/**
	 * 스케줄링 스케줄러 관리 화면
	 * @param vo
	 * @return
	 */
	List<scheduleVO> selectScheduleProject(scheduleVO vo)throws Exception;

	/**
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	List<scheduleDataVO> selectScheduleData(scheduleDataVO vo)throws Exception;

	/**
	 * 스케줄러 추가 리스트
	 * @param vo
	 * @return
	 */
	int insertScheduleProject(scheduleVO vo)throws Exception;

	//int insertScheduleData(scheduleVO vo)throws Exception;

	/**
	 * 스케쥴러 active 수정
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	int updateScheduleActive(scheduleVO vo)throws Exception;

	/**
	 * 스케쥴러데이터 상세
	 */
	scheduleDataVO selectScheduleDataByScheduSn(scheduleDataVO vo)throws Exception;

	/**
	 * 스케쥴러 상세
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	//	int checkScheduleProject(scheduleVO vo)throws Exception;

	scheduleVO selectScheduleDetail(scheduleVO vo) throws Exception;

	int insertScheduleProjectData(Map<String, Object> jsonData,int schedule_sn)throws Exception;

	scheduleVO selectActiveProcess()throws Exception;

	int selectActiveProcessCnt()throws Exception;

	void initScheduleActive()throws Exception;

	/**
	 * 스케쥴러 리스트 삭제
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	int deleteScheduleList(scheduleVO vo)throws Exception;

	int selectVersionInfoCheck()throws Exception;

	versionInfoVO selectVersionInfo()throws Exception;

	void insertVersionDefault()throws Exception;
}