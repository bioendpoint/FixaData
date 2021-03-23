package fixadata.rule.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import fixadata.rule.mapper.RuleMapper;
import fixadata.rule.service.RuleService;
import fixadata.rule.vo.ruleManagerVO;
import fixadata.util.UtilSession;

@Service("ruleService")
public class RuleServiceImpl extends EgovAbstractServiceImpl implements RuleService {

	@Resource(name="ruleMapper")
	private RuleMapper ruleMapper;


	/**
	 * 룰정보를 입력 수정 삭제 한다
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	@Override
	public int save(Map<String ,Object> param) throws Exception {
		int i =  ruleMapper.save(param);
		return i;
	}

	@Override
	public int templateSave(ruleManagerVO ruleManagerVO) throws Exception {
		int i =  ruleMapper.templateSave(ruleManagerVO);
		return i;
	}


	/**
	 * 글 목록을 조회한다.
	 * @param searchVO - 조회할 정보가 담긴 VO
	 * @return 글 목록
	 * @exception Exception
	 */
	@Override
	public List<Map<String ,Object>> selectRuleList(Map<String ,Object> map) throws Exception {
		if ( !map.containsKey("itemList") ) {
			String rule_base_data_gb = (UtilSession.getAttribute("SESSION_USER_AUTH").equals("11")) ? "02" : "";
			map.put("rule_base_data_gb" ,rule_base_data_gb);
		}

		map.put("member_sn",UtilSession.getAttribute("SESSION_USER_SN"));
		map.put("member_auth",UtilSession.getAttribute("SESSION_USER_AUTH"));
		map.put("member_id",UtilSession.getAttribute("SESSION_USER_ID"));

		return ruleMapper.selectRuleList(map);
	}
}
