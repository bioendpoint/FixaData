package fixadata.rule;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.ws.rs.GET;
import javax.ws.rs.POST;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import fixadata.rule.service.RuleService;
import fixadata.rule.vo.ruleManagerVO;
import fixadata.util.UtilSession;

/**
 * @author Tom.DongHyuk (bioendpoint@gmail.com)
 * rule 관련
 */
@Controller
public class RuleController {

	/** RuleService */
	@Resource(name = "ruleService")
	private RuleService ruleService;

	@RequestMapping(value = "/fixadata/ruleadmin.fd")
	public String view(@RequestParam Map<String, Object> map, ModelMap model ) throws Exception {

		List<?> list = ruleService.selectRuleList(map);
		model.addAttribute("list", list);
		return "/rule-admin";
	}


	@GET @POST
	@RequestMapping(value = "/ajax/ruleList.fd" )
	public ModelAndView list(@RequestParam Map<String ,Object> map, ModelMap model) throws Exception {
		List<?> list = ruleService.selectRuleList(map);
		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject("list" ,list);
		return mv;
	}


	@RequestMapping(value = "/ajax/save.fd")
	public ModelAndView insert(@RequestParam Map<String ,Object> map ) throws Exception {
		if ( map.get("state").toString().equals("1") ) {
			map.put("rule_member_id" ,UtilSession.getAttribute("SESSION_USER_ID"));
			map.put("rule_base_data_gb" ,"02");
		}

		int response = ruleService.save(map);
		String result = "sucess";

		map.remove("rule_sn");
		List<?> list = ruleService.selectRuleList(map);
		if ( response != 1 ) {
			result = "error";
		};

		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject("result" ,result);
		mv.addObject("list" ,list);
		return mv;
	}
	@RequestMapping(value = "/ajax/templateSave.fd")
	public ModelAndView templateSave(@RequestBody Map<String ,Object> jsonData,ruleManagerVO ruleManagerVO) throws Exception {
		ruleManagerVO.setRule_cont(String.valueOf(jsonData.get("rule_sn")));
		ruleManagerVO.setRule_name(String.valueOf(jsonData.get("rule_name")));
		ruleManagerVO.setRule_dc("사용자정의 템플릿");
		ruleManagerVO.setRule_gb("100");
		ruleManagerVO.setRule_base_data_gb("01");
		ruleManagerVO.setRule_opt("1");
		int response = ruleService.templateSave(ruleManagerVO);
		String result = "success";

		if ( response != 1 ) {
			result = "error";
		};

		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject("result" ,result);
		return mv;
	}
}