package fixadata.outprocess.service;


import java.util.List;
import java.util.Map;

/**
 * @author Tom.DongHyuk (bioendpoint@gmail.com)
 */
public interface OutProcessService {
	/**
	 * rule 목록을 조회한다.
	 * @param  - 조회할 정보가 담긴 paramMap
	 * @return 글 목록
	 * @exception Exception
	 */
	List<?> list(Map<String ,Object> map) throws Exception;

	Map<String ,Object> selectOne(Map<String ,Object> map) throws Exception;
}
