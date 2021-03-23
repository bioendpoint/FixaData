package fixadata.process.service;


import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public interface ProcessService {

	/* 프로젝트 데이터 컬럼 목록 */
	List selectTempColumnList(Object map) throws Exception;

	/* 프로젝트 목록 */
	List selectProjectList(Object map) throws Exception;

	/* 프로젝트 데이터 목록 */
	Map<String ,Object> tempDataList( Map<String, Object> map ) throws Exception;

	/* 프로젝트 정보 저장 */
	String insertPrjInfo(Map map) throws Exception;

	/* 프로젝트 데이터 템프 테이블 생성 */
	String createTempTable(Map map) throws Exception;

	/* 프로젝트 데이터 템프테이블 데이터 저장 */
	String insertTempData(Map map) throws Exception;

	/* 프로젝트 데이터 최신 버전 가져오기 */
	int selectHistMaxSn(Object map) throws Exception;

	/* 프로젝트 이력 데이터 목록 */
	List tempHistDataList(Object map) throws Exception;

	/* SQL Query Parameter 실행 */
	List<?> sql(Map<String ,Object> map) throws Exception;

	/* 프로세스 결과 실행 */
	List<Object> output( LinkedHashMap<String ,Object> paramEvent ,LinkedHashMap<String ,Object> paramGlobal, LinkedHashMap<String ,Object> paramDiagram ) throws Exception;

	/* BlockChain 목록 호출 */
	List<Object> selectBlockchain(Map<String ,Object> requestMap) throws Exception;


	/* 룰 처리 및 데이터 */

	/*
	Map<String ,Object> play(Map<String ,Object> param) throws Exception;
	Map<String ,Object> playRule(Map<String ,Object> param) throws Exception;
	Map<String ,Object> playFilter(Map<String ,Object> param) throws Exception;
	Map<String ,Object> playOutput(Map<String ,Object> param) throws Exception;


	//choi
	void ruleSqlInfo(Map<String ,Object> map,String beId) throws Exception;
	void filterSqlInfo(Map<String ,Object> map,String beId) throws Exception;

	Map<String ,Object> ruleCntSqlInfo(Map<String ,Object> map)throws Exception ;
	Map<String ,Object> filterCntSqlInfo(Map<String ,Object> map)throws Exception;

	Map<String ,Object> ruleAllSqlInfo(Map<String ,Object> map) throws Exception;
	void filterAllSqlInfo(Map<String ,Object> map) throws Exception;
	 */
}