package fixadata.process;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import fixadata.process.service.ProcessService;
import fixadata.rule.service.RuleService;
import fixadata.util.UtilSession;


@Controller
public class ProcessController {

	@Resource(name = "processService")
	private ProcessService processService;

	@Resource(name = "ruleService")
	private RuleService ruleService;


	/* Process 화면 : 전처리, 데이터 이상치 검출, 이상치 검출 결과 첫화면 */
	@RequestMapping(value = "/fixadata/process.fd")
	public String view( @RequestParam Map<String, Object> map ,ModelMap model ) throws Exception {

		if(UtilSession.getAttribute("SESSION_PROJECT_SN") != null && UtilSession.getAttribute("SESSION_PROJECT_SN") != ""){
			model.addAttribute("SESSION_PROJECT_SN" ,UtilSession.getAttribute("SESSION_PROJECT_SN"));
		}
		return "/process";
	}


	/* 프로젝트 데이터 호출 */
	@RequestMapping(value = "/ajax/listData.fd" ,method = RequestMethod.POST)
	public ModelAndView gridDataAjax( @RequestParam Map<String, Object> map ) throws Exception {

		Map<String ,Object> mapResponse = processService.tempDataList(map);

		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject( "Result"				,"true"									);
		mv.addObject( "PROJECT_SN"			,mapResponse.get( "PROJECT_SN")			);
		mv.addObject( "PROJECT_NAME"		,mapResponse.get( "PROJECT_NAME")		);
		mv.addObject( "TABLE_NAME"			,mapResponse.get( "TABLE_NAME")			);
		mv.addObject( "FILE_NAME"			,mapResponse.get( "FILE_NAME")			);
		mv.addObject( "TABLE_HEADER"		,mapResponse.get( "TABLE_HEADER")		);
		mv.addObject( "TABLE_HEADER_KEY"	,mapResponse.get( "TABLE_HEADER_KEY")	);
		mv.addObject( "TABLE_HEADER_COUNT"	,mapResponse.get( "TABLE_HEADER_COUNT")	);
		mv.addObject( "ListData"			,mapResponse.get( "listData")			);
		mv.addObject( "WORK_FLOW_DATA"		,mapResponse.get( "WORK_FLOW_DATA")		);
		mv.addObject( "HISTORY_GLOBAL"		,mapResponse.get( "HISTORY_GLOBAL")		);
		mv.addObject( "HISTORY_DIAGRAM" 	,mapResponse.get( "HISTORY_DIAGRAM")	);
		mv.addObject( "SCORE_DATA"			,mapResponse.get( "SCORE_DATA")			);

		return mv;
	}


	/* 프로젝트 저장 */
	@RequestMapping(value="/ajax/projectSave.fd", method = RequestMethod.POST)
	public ModelAndView insertData(@RequestParam Map<String, Object> map) throws Exception {

		List<Map<String,Object>> list = new ObjectMapper().readValue(map.get("DATA_LIST").toString() ,new TypeReference<List<Map<String, Object>>>() {});
		map.put("DATA_LIST", list);
		String result = processService.insertPrjInfo(map);

		// ### 프로젝트 정보
		List dataList = processService.selectProjectList(map);

		// ### BlockChain 단일Row 호출
		List<?> blockChainList = null;
		if ( map.get("BCHAIN_VERSION_MAX") != null ) {
			Map<String ,Object> requestMap = new HashMap<String ,Object>();
			requestMap.put("PRJCT_SN_FK"		,UtilSession.getAttribute("SESSION_PROJECT_SN").toString());
			requestMap.put("BCHAIN_VERSION_MAX"	,"true");
			blockChainList = processService.selectBlockchain(requestMap);
		};

		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject("msg"				,result);
		mv.addObject("PROJECT_SN"		,map.get("PRJCT_SN"));
		mv.addObject("PROJECT_NAME"		,map.get("PRJCT_NM"));
		mv.addObject("FILE_NAME"		,map.get("FILE_NAME"));
		mv.addObject("blockChainList"	,blockChainList);

		return mv;
	}


	/* 프로젝트 목록 */
	@RequestMapping(value="/ajax/projectList.fd", method = RequestMethod.POST)
	public ModelAndView listData(@RequestParam Map<String, Object> map) throws Exception {

		List listProject = processService.selectProjectList(map);

		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject("list", listProject);
		return mv;

	}


	/* 프로젝트 열기 */
	@RequestMapping(value="/ajax/projectOpen.fd", method = RequestMethod.POST)
	public ModelAndView openProject(@RequestParam Map<String, Object> map) throws Exception {

		UtilSession.setProjectSessionDell();
		UtilSession.setProjectSession( map );

		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject("result" ,"true");
		return mv;

	}


	/* Rule(조건, 필터) 목록 */
	@RequestMapping(value="/ajax/ruleItemList.fd" ,method = RequestMethod.POST)
	public ModelAndView listRuleData(@RequestParam Map<String, Object> map) throws Exception {

		map.put("itemList" ,"true");



		List<Map<String ,Object>> list = ruleService.selectRuleList(map);

		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject("list", list);
		return mv;

	}


	/* 데이터 컬럼 목록 */
	@RequestMapping(value="/ajax/columnList.fd" ,method = RequestMethod.POST)
	public ModelAndView columnList() throws Exception {

		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject("result"			,"true");
		mv.addObject("TABLE_HEADER"		,UtilSession.getAttribute("SESSION_TABLE_HEADER"));
		mv.addObject("TABLE_HEADER_KEY"	,UtilSession.getAttribute("SESSION_TABLE_HEADER_KEY"));
		return mv;

	}


	/* 결과 데이터 */
	@RequestMapping(value="/ajax/output.fd", method = RequestMethod.POST)
	@ResponseBody
	public ModelAndView listRuleOutData(@RequestBody Map<String, Object> jsonData) throws Exception {

		LinkedHashMap<String ,Object> paramEvent	= (LinkedHashMap<String ,Object>) jsonData.get("Event");
		LinkedHashMap<String ,Object> paramGlobal	= (LinkedHashMap<String ,Object>) jsonData.get("Global");
		LinkedHashMap<String ,Object> paramDiagram	= (LinkedHashMap<String ,Object>) jsonData.get("Diagram");


		List<Object> returnData = processService.output(paramEvent ,paramGlobal, paramDiagram);

		String type = paramEvent.get("Type").toString().toLowerCase();

		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject("data" ,returnData);

		return mv;
	}


	/* 첨부파일 저장 */
	@RequestMapping(value = "/datainputExcelDownload.fd" ,method = RequestMethod.GET)
	public ModelAndView TempDownload( @RequestParam Map<String ,Object> map, ModelMap model, HttpServletResponse response, HttpServletRequest req  ) throws Exception {

		String sql  = " SELECT " + UtilSession.getAttribute("SESSION_TABLE_HEADER_KEY").toString();
		sql        += " FROM "   + UtilSession.getAttribute("SESSION_TABLE_NAME").toString();
		if(map.get("type").toString().equals("1")){
			sql    += " WHERE HIST_SN = (SELECT MIN(HIST_SN) FROM "   + UtilSession.getAttribute("SESSION_TABLE_NAME").toString()+" )";
		} else {
			sql    += " WHERE HIST_SN = (SELECT MAX(HIST_SN) FROM "   + UtilSession.getAttribute("SESSION_TABLE_NAME").toString()+" )";
		}

		map.put("sql", sql);
		List list = processService.sql(map);

		map.put("List", list);

		ModelAndView mv		= new ModelAndView("excelView","List",list);
		return mv;

	}


	/* BlockChain 프로젝트 목록 */
	@RequestMapping(value="/ajax/blockchainList.fd" ,method = RequestMethod.POST)
	public ModelAndView selectBlockchain(@RequestParam Map<String, Object> requestMap) throws Exception {
		requestMap.put("PRJCT_SN_FK" ,UtilSession.getAttribute("SESSION_PROJECT_SN").toString());
		List<Object> list = processService.selectBlockchain(requestMap);
		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject("list" ,list);
		return mv;
	}


	/*  */
	@RequestMapping(value="/ajax/playOutput.fd", method = RequestMethod.POST)
	@ResponseBody
	public ModelAndView palyOutput(@RequestBody String map) throws Exception {

		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		return mv;

	}

	/* 프로젝트 세션 초기화 */
	@RequestMapping(value="/ajax/projectSessionDellAjax.fd" ,method = RequestMethod.POST)
	public ModelAndView sessionDellAjax() throws Exception {

		UtilSession.setProjectSessionDell();
		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject("result" ,"true");
		return mv;
	}
}
