
package fixadata.rule.service;


import java.util.List;
import java.util.Map;

import fixadata.rule.vo.ruleManagerVO;

/**
 * @author Tom.DongHyuk (bioendpoint@gmail.com)
 */
public interface RuleService {

	//	/**
	//	 * rule 등록한다.
	//	 * @param  - 등록할 정보가 담긴 paramMap
	//	 * @return 등록 결과
	//	 * @exception Exception
	//	 */
	//	int insertRule(ModelMap paramMap) throws Exception;
	//
	//	/**
	//	 * rule 수정한다.
	//	 * @param - 수정할 정보가 담긴 paramMap
	//	 * @return
	//	 * @exception Exception
	//	 */
	//	int updateRule(ModelMap paramMap) throws Exception;
	//
	//	/**
	//	 * rule 삭제한다.
	//	 * @param  - 삭제할 정보가 담긴 paramMap
	//	 * @return void형
	//	 * @exception Exception
	//	 */
	//	int deleteRule(ModelMap paramMap) throws Exception;
	//
	//	/**
	//	 * 글을 조회한다.
	//	 * @param vo - 조회할 정보가 담긴 SampleVO
	//	 * @return 조회한 글
	//	 * @exception Exception
	//	 */
	//	SampleVO selectSample(SampleVO vo) throws Exception;
	//


	List<Map<String ,Object>> selectRuleList(Map<String ,Object> map) throws Exception;


	/**
	 * 룰정보를 입력 수정 삭제 한다
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	int save(Map<String ,Object> map) throws Exception;

	int templateSave(ruleManagerVO ruleManagerVO) throws Exception;

}
