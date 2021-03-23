package fixadata.collect.mapper;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import fixadata.collect.vo.baseDataVO;
import fixadata.collect.vo.dbInfoVO;
import fixadata.collect.vo.scheduleDataVO;
import fixadata.collect.vo.scheduleVO;
import fixadata.collect.vo.tbProjectDataVO;
import fixadata.collect.vo.tbProjectVO;
import fixadata.collect.vo.versionInfoVO;

@Mapper("collectMapper")
public interface CollectMapper {

	/**
	 * 테스트용 정보
	 * @param list
	 * @return
	 */
	int insertTestData(List list);
	int insertTestData2(HashMap h);

	List<HashMap> selectTestDb();

	int insertjson(HashMap h);

	List<HashMap> selectjson();

	int insertBaseData(baseDataVO baseDataVO);

	int updateBaseData(baseDataVO baseDataVO);

	int selectChkBaseData(baseDataVO baseDataVO);

	/**
	 * 디비 등록
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	int insertDbInfo(dbInfoVO vo) throws Exception;

	/**
	 * 디비정보 수정
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	int updateDbInfo(dbInfoVO vo) throws Exception;

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
	 * TN_PROJECT 데이터 등록
	 * @param uploadFile
	 * @return
	 * @throws Exception
	 */
	int insertTbProject(tbProjectVO tbProjectVO)throws Exception;

	/**
	 * TN_PROJECT_DATA 데이터 등록
	 * @param uploadFile
	 * @return
	 * @throws Exception
	 */
	int insertTbProjectData(tbProjectDataVO tbProjectDataVO)throws Exception;

	int updateTbProjectData(tbProjectDataVO tbProjectDataVO)throws Exception;

	int diagramUpdateTbProjectData(tbProjectDataVO tbProjectDataVO)throws Exception;

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
	 * 프로젝트 데이터 리스트
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	List<tbProjectDataVO> selectProjectDataVersionList(tbProjectDataVO vo) throws Exception;

	/**
	 * project 데이터 삭제
	 * @param tbProjectVO
	 */
	int deleteProject(tbProjectVO tbProjectVO);

	/**
	 * projectData 데이터 삭제
	 * @param tbProjectVO
	 */
	void deleteProjectData(tbProjectVO tbProjectVO);

	/**
	 * 샘플 리스트
	 * @param baseDataVO
	 * @return
	 */
	List<baseDataVO> selectSampleList(baseDataVO baseDataVO) throws Exception;

	/**
	 * 샘플 리스트
	 * @param baseDataVO
	 * @return
	 */
	List<baseDataVO> selectStandardList(baseDataVO baseDataVO) throws Exception;

	/**
	 * 샘플 리스트
	 * @param baseDataVO
	 * @return
	 */
	List<baseDataVO> selectCordDomainList(baseDataVO baseDataVO) throws Exception;

	/**
	 * 프로젝트 리스트 카운트
	 * @param baseDataVO
	 * @return
	 */
	int selectProjectDataListCnt(tbProjectVO vo) throws Exception;

	int selectProjectDataSn(tbProjectDataVO vo) throws Exception;

	int standardInsert(baseDataVO baseDataVO) throws Exception;

	int selectMaxProjectSn()throws Exception;

	int selectMaxProjectDataSn()throws Exception;
	/**
	 * 스케줄링 스케줄러 관리 화면
	 * @param scheduleVO
	 * @return
	 */
	List<scheduleVO> selectScheduleProject(scheduleVO vo)throws Exception;

	List<scheduleDataVO> selectScheduleData(scheduleDataVO vo)throws Exception;

	/**
	 *스케줄러데이테 가져오기
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	scheduleDataVO selectScheduleDataByScheduSn(scheduleDataVO vo)throws Exception;

	/**
	 * 스케줄러 추가 리스트
	 * @param scheduleVO
	 * @return
	 */
	int insertScheduleProject(scheduleVO vo)throws Exception;

	int insertScheduleData(scheduleDataVO vo)throws Exception;

	/**
	 * 스케쥴러 active 수정
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	int updateScheduleActive(scheduleVO vo)throws Exception;

	/**
	 * 스케쥴러 상세
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	scheduleVO selectScheduleDetail(scheduleVO vo) throws Exception;

	scheduleVO selectActiveProcess() throws Exception;

	int selectActiveProcessCnt() throws Exception;

	void initScheduleActive() throws Exception;

	int checkScheduleProject(scheduleVO vo) throws Exception;

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
