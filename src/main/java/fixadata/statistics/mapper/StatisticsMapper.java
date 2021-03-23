package fixadata.statistics.mapper;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import fixadata.collect.vo.dbInfoVO;
import fixadata.collect.vo.tbProjectDataVO;
import fixadata.collect.vo.tbProjectVO;

@Mapper("statisticsMapper")
public interface StatisticsMapper {

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

	/**
	 * 프로젝트 리스트
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	List<tbProjectVO> selectProjectList(tbProjectVO vo) throws Exception;

	/**
	 * 프로젝트 데이터 리스트
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	List<tbProjectDataVO> selectProjectDataVersionList(tbProjectDataVO vo) throws Exception;

}
