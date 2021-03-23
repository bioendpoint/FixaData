package fixadata.process.mapper;

import java.util.List;
import java.util.Map;

import egovframework.rte.psl.dataaccess.mapper.Mapper;


@Mapper("processMapper")
public interface ProcessMapper {
	List<?> selectTempColumnList(Object map) throws Exception; 
	 
	List selectTempDataList(Object map) throws Exception;
	 
	List selectProjectList(Object map) throws Exception;
	 
	String createTempTable(Object map) throws Exception;
	 
	String insertHistData(Object map) throws Exception;
	
	int insertPrjInfo(Object map) throws Exception;
	
	int insertPrjHistInfo(Object map) throws Exception;
	
	int insertScoreInfo(Object map) throws Exception;
	
	int updateScore(Object map) throws Exception;
	
	int selectScore(Object map) throws Exception;
	 
	int selectHistMaxSn(Object map) throws Exception;
	 
	int selectHistCnt(Object map) throws Exception;
	
	List<?> sql(Map<String ,Object> map) throws Exception;
	
	int deleteMinHistSn(Object map) throws Exception;

	void insertOutput(Map<String ,Object> requestMap) throws Exception;

	List<?> selectOutputList(Map<String ,Object> requestMap) throws Exception;
	
	Map<String ,Object> selectPrjHistInfo(Map<String ,Object> requestMap) throws Exception;

	void insertBlockchain(Map<String ,Object> requestMap) throws Exception;

	List<Object> selectBlockchain(Map<String ,Object> requestMap) throws Exception;
}