package fixadata.rule.mapper;

import java.util.List;
import java.util.Map;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import fixadata.rule.vo.ruleManagerVO;


@Mapper("ruleMapper")
public interface RuleMapper {

	List<Map<String ,Object>> selectRuleList(Map<String ,Object> map) throws Exception;

	Map<String ,Object> ruleList(Map<String ,Object> paramMap) throws Exception;

	int save(Map<String ,Object> map) throws Exception;

	int templateSave(ruleManagerVO ruleManagerVO) throws Exception;

}
