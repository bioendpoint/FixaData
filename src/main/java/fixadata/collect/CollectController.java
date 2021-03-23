package fixadata.collect;

import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.POST;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;

import fixadata.collect.service.CollectService;
import fixadata.collect.vo.baseDataVO;
import fixadata.collect.vo.collectVO;
import fixadata.collect.vo.dbInfoVO;
import fixadata.collect.vo.scheduleDataVO;
import fixadata.collect.vo.scheduleVO;
import fixadata.collect.vo.tbProjectDataVO;
import fixadata.collect.vo.tbProjectVO;
import fixadata.collect.vo.versionInfoVO;
import fixadata.common.schelduler.SchedulerService;
import fixadata.util.UtilCrawling;
import fixadata.util.UtilDb;
import fixadata.util.UtilFiles;
import fixadata.util.UtilJson;
import fixadata.util.UtilSession;
import lombok.extern.slf4j.Slf4j;

/**
 * @author Tom.DongHyuk
 * rule 관련
 */
@Slf4j
@RequestMapping("/collect")
@Controller
public class CollectController {

	/**
	 * 데이터 수집코드
	 */
	@Autowired
	CollectService CollectServiceImpl;

	@Resource(name = "schedulerService")
	SchedulerService schedulerServiceImpl;

	/**
	 * 파일 업로드(파일 선택 및 전송 화면) (TEST CODE)
	 * @param map
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@GET
	@RequestMapping(value = "/uploadFormFile.fd")
	public String uploadFormFile(@RequestParam Map<String ,Object> map, ModelMap model) throws Exception {
		return "collect/uploadForm";
	}

	/**
	 * 샘플 파일 업로드용(TEST CODE)
	 * @param map
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@GET
	@RequestMapping(value = "/uploadFormFile2.fd")
	public String uploadFormFile2(@RequestParam Map<String ,Object> map, ModelMap model) throws Exception {
		return "collect/uploadForm2";
	}

	/**
	 * test용
	 * @param map
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@GET @POST
	@RequestMapping(value = "/importForm.fd")
	public String importForm(@RequestParam Map<String ,Object> map, ModelMap model) throws Exception {
		return "collect/importForm";
	}

	/**
	 * test용
	 * @param map
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@GET @POST
	@RequestMapping(value = "/dbForm.fd")
	public String uploadFormDb(@RequestParam Map<String ,Object> map, ModelMap model) throws Exception {
		return "collect/dbForm";
	}

	/**
	 * 데이터 collect를 위한 페이지
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@GET
	@RequestMapping(value = "/datainput.fd")
	public String view( ModelMap model , String type ) throws Exception {
		int ver_cnt = 0;
		versionInfoVO vivo = new versionInfoVO();

		ver_cnt = CollectServiceImpl.selectVersionInfoCheck();
		if(ver_cnt == 0) {
			CollectServiceImpl.insertVersionDefault();
		}else {
			vivo = CollectServiceImpl.selectVersionInfo();
		}
		model.addAttribute("type", type);
		model.addAttribute("version_info",vivo.getVersion_nm());
		model.addAttribute("mac_address_info",UtilSession.getAttribute("SESSION_MAC_ADDRESS"));
		return "collect/datainput";
	}

	/**
	 * 데이터 수집 처리 로직
	 * @param uploadFile
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/collectUploadProcess.fd",method = RequestMethod.POST )
	public String collectUploadProcess(
			HttpServletRequest req
			, HttpServletResponse rep
			, ModelAndView mv
			, @ModelAttribute("collectVO") collectVO collectVO
			) throws Exception {

		// file or db 데이터 적제후 성공여부 반환
		int success = CollectServiceImpl.collectUploadProcess(collectVO);

		if(success>0)
		{
			rep.sendRedirect("/prep/prep.fd");
		}
		return null;
	}

	/**
	 * excelSheet리스트값 넘긴 후 로직
	 * @param req
	 * @param rep
	 * @param mv
	 * @param collectVO
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getExcelSheet.fd" )
	@ResponseBody
	public String getExcelSheet(
			HttpServletRequest req
			, HttpServletResponse rep
			, ModelAndView mv
			, @ModelAttribute("collectVO") collectVO collectVO
			) throws Exception {

		int cnt =  CollectServiceImpl.collectUploadProcess(collectVO);

		String result = "";
		if(cnt>0)
		{
			result = "success";
		}else {
			result = "fail";
		}
		return result;
	}

	/**
	 * excel(xls, xlsx) sheet parser
	 * @param req
	 * @param rep
	 * @param mv
	 * @param collectVO
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/excelSheetParser.fd",method = RequestMethod.POST,consumes="multipart/form-data", produces="application/json" )
	@ResponseBody
	public Map<String,Object> excelSheetParser(
			HttpServletRequest req
			, HttpServletResponse rep
			, ModelAndView mv
			, @ModelAttribute("collectVO") collectVO collectVO
			) throws Exception {

		List<HashMap> list = UtilFiles.uploadExcelSheetParse(collectVO.getUploadFile());

		Map<String,Object> resultMap = new HashMap<String,Object>();
		resultMap.put("sheetList",list);

		return resultMap;
	}

	/**
	 * 표준용어데이터 수집 처리 로직
	 * @param uploadFile
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/collectStandardVocaUploadProcess.fd" )
	@ResponseBody
	public String collectStandardVocaUploadProcess(
			HttpServletRequest req
			, HttpServletResponse rep
			, ModelAndView mv
			, @ModelAttribute("collectVO") collectVO collectVO
			) throws Exception {

		//file or db 데이터 적제후 성공여부 반환
		//int success = CollectServiceImpl.collectUploadProcess(collectVO);
		int cnt = CollectServiceImpl.collectStandardVocaUploadProcess(collectVO);

		//int success = CollectServiceImpl.collectUploadProcess(collectVO);

		String result = "";
		if(cnt>0)
		{
			result = "success";
			//rep.sendRedirect("/prep/prep.fd");
		}else {
			result = "fail";
		}
		//mv.setViewName("jsonView");

		return result;
	}

	/**
	 * 디비접속 테스트 코드(접속유무 확인을 위한 기능)
	 * @param uploadFile
	 * @return
	 * @throws Exception
	 */
	@POST
	@RequestMapping(value = "/dbConnectionCheck.fd")
	public ModelAndView dbConnectionCheck(
			HttpServletRequest req
			, HttpServletResponse rep
			, ModelAndView mv
			, @ModelAttribute("dbInfoVO") dbInfoVO dbInfoVO
			) throws Exception {

		UtilDb db = new UtilDb();

		db.ConnectionInfo(dbInfoVO.getDriver(), dbInfoVO.getUrl(), dbInfoVO.getId(), dbInfoVO.getPw());
		String result = db.connectionTest();
		db.closeDb();

		mv.setViewName("jsonView");
		mv.addObject("result",result);

		return mv;
	}

	/**
	 * 데이터베이스 접속후 테이블 쿼리 그후 총갯수 및 field정보 추출
	 * @param req
	 * @param rep
	 * @param dbInfoVO
	 * @return
	 * @throws Exception
	 */
	@POST
	@RequestMapping(value = "/checkTable.fd")
	public ModelAndView checkTable(
			HttpServletRequest req
			, ModelAndView mv
			, HttpServletResponse rep
			, @ModelAttribute("dbInfoVO") dbInfoVO dbInfoVO
			) throws Exception {

		Map<String,Object> resultMap = new HashMap<String,Object>();

		UtilDb db = new UtilDb();

		dbInfoVO dbInfo = CollectServiceImpl.selectDbInfoBySn(dbInfoVO);

		db.ConnectionInfo(dbInfo.getDriver(), dbInfo.getUrl(), dbInfo.getId(), dbInfo.getPw());

		//전체 갯수 추출
		List<Map<String,Object>> list = db.listQuery("select count(*) as total from "+dbInfoVO.getTable());

		//해당 컬럼의 field 정보 추출
		List<Map<String,Object>> field = db.fieldQuery(dbInfo, dbInfoVO.getTable());

		resultMap.put("totalCnt", list.get(0).get("total"));
		resultMap.put("fieldList", field);

		mv.setViewName("jsonView");
		mv.addObject("result",resultMap);

		return mv;
	}

	/**
	 * 데이터 접속 정보 insert
	 * @param driver
	 * @param url
	 * @param id
	 * @param pw
	 * @param sql
	 * @return
	 * @throws Exception
	 */
	@POST
	@RequestMapping(value = "/insertDbInfo.fd" )
	public ModelAndView insertDbInfo(
			HttpServletRequest req
			, HttpServletResponse rep
			, ModelAndView mv
			, @ModelAttribute("dbInfoVO") dbInfoVO dbInfoVO
			) throws Exception
	{
		Map<String,Object> resultMap = new HashMap<String,Object>();
		int result = CollectServiceImpl.insertDbInfo(dbInfoVO);
		String resultStr = "fail";
		if(result>0)
		{
			resultStr = "success";
		}

		mv.setViewName("jsonView");
		mv.addObject("result",resultStr);

		return mv;
	}

	@POST
	@RequestMapping(value = "/insertCollectOpenApi.fd" )
	public ModelAndView insertCollectOpenApi(
			HttpServletRequest req
			, HttpServletResponse rep
			, ModelAndView mv
			, @RequestBody Map<String, Object> jsonData
			) throws Exception
	{

		if("1".equals(String.valueOf(jsonData.get("openapiType")))) {
			String api_name = String.valueOf(jsonData.get("api_name"));
			String keyId = String.valueOf(jsonData.get("keyId"));
			String total_count = "";
			String limit = "1000";
			String serviceid = String.valueOf(jsonData.get("serviceId"));
			int cur = 1;
			int end = 1000;
			int total_page = 0;
			ArrayList<Map<String, Object>> result = new ArrayList<Map<String,Object>>();
			ArrayList<String> headerList = new ArrayList<String>();
			String url = "http://openapi.foodsafetykorea.go.kr/api/{keyId}/{serviceid}/json/{cur}/{limit}";
			String furl =  url.replace("{keyId}", keyId).replace("{serviceid}", serviceid).replace("{cur}", "1").replace("{limit}", "1");

			HttpResponse<JsonNode> list = Unirest.post(furl).asJson();
			if(list!=null) {
				total_count = (String) list.getBody().getObject().getJSONObject(serviceid).get("total_count");
				total_page = (int) Math.ceil(Double.valueOf(total_count)/Integer.valueOf(limit));
			}
			if(Integer.valueOf(total_count)>0)
			{
				int idx =1;
				HttpResponse<JsonNode> listData;

				for(int i=0; i<total_page;i++)
				{
					cur = i*Integer.valueOf(limit)+1;
					end = (i+1)*Integer.valueOf(limit);
					furl = url.replace("{keyId}", keyId).replace("{serviceid}", serviceid).replace("{cur}", cur+"").replace("{limit}", end+"");

					listData = Unirest.post(furl).asJson();
					JSONArray jsonList = listData.getBody().getObject().getJSONObject(serviceid).getJSONArray("row");
					//header추출
					if(i==0)
					{
						JSONObject headerInfo = (JSONObject) jsonList.get(0);
						Iterator it = headerInfo.keys(); // key값들을 모두 얻어옴.
						headerList.add("idx");
						while(it.hasNext())
						{
							String header = it.next().toString();
							headerList.add(header);
						}
					}
					List tempList = UtilJson.toList(jsonList.toString());
					for(Object m:tempList)
					{
						Map<String,Object> tempmap = (Map<String, Object>) m;
						tempmap.put("idx",idx++);
						result.add(tempmap);
					}
				}
			}
			CollectServiceImpl.inserOpenApiProject(result,headerList,api_name);
			mv.setViewName("jsonView");
			mv.addObject("header",headerList);
			mv.addObject("result",result);
			mv.addObject("project_sn",String.valueOf(UtilSession.getAttribute("SESSION_PROJECT_SN")));
			mv.addObject("project_data_sn",String.valueOf(UtilSession.getAttribute("SESSION_PROJECT_DATA_SN")));
		}
		else if("2".equals(String.valueOf(jsonData.get("openapiType"))))
		{

		}else if("3".equals(String.valueOf(jsonData.get("openapiType")))) {
			String api_name = String.valueOf(jsonData.get("api_name"));
			String keyId = String.valueOf(jsonData.get("keyId"));
			String total_count = "";
			String limit = "1000";
			String serviceid = String.valueOf(jsonData.get("serviceId"));
			int cur = 1;
			int end = 1000;
			int total_page = 0;
			ArrayList<Map<String, Object>> result = new ArrayList<Map<String,Object>>();
			ArrayList<String> headerList = new ArrayList<String>();
			String url = "http://openapi.foodsafetykorea.go.kr/api/{keyId}/{serviceId}/json/{cur}/{limit}";

			System.out.println(url);
			String furl =  url.replace("{keyId}", keyId).replace("{serviceId}", serviceid).replace("{cur}", "1").replace("{limit}", "5");


			HttpResponse<JsonNode> list = Unirest.post(furl).asJson();
			if(list!=null) {
				total_count = (String) list.getBody().getObject().getJSONObject(serviceid).get("total_count");
				total_page = (int) Math.ceil(Double.valueOf(total_count)/Integer.valueOf(limit));
			}
			if(Integer.valueOf(total_count)>0)
			{
				int idx =1;
				HttpResponse<JsonNode> listData;

				for(int i=0; i<total_page;i++)
				{
					cur = i*Integer.valueOf(limit)+1;
					end = (i+1)*Integer.valueOf(limit);
					furl = url.replace("{keyId}", keyId).replace("{serviceId}", serviceid).replace("{cur}", cur+"").replace("{limit}", end+"");

					listData = Unirest.post(furl).asJson();
					JSONArray jsonList = listData.getBody().getObject().getJSONObject(serviceid).getJSONArray("row");
					//header추출
					if(i==0)
					{
						JSONObject headerInfo = (JSONObject) jsonList.get(0);
						Iterator it = headerInfo.keys(); // key값들을 모두 얻어옴.
						headerList.add("idx");
						while(it.hasNext())
						{
							String header = it.next().toString();
							headerList.add(header);
						}
					}
					List tempList = UtilJson.toList(jsonList.toString());
					for(Object m:tempList)
					{

						Map<String,Object> tempmap = (Map<String, Object>) m;
						tempmap.put("idx",idx++);
						result.add(tempmap);
					}
				}
			}
			CollectServiceImpl.inserOpenApiProject(result,headerList,api_name);
			mv.setViewName("jsonView");
			mv.addObject("header",headerList);
			mv.addObject("result",result);
			mv.addObject("project_sn",String.valueOf(UtilSession.getAttribute("SESSION_PROJECT_SN")));
			mv.addObject("project_data_sn",String.valueOf(UtilSession.getAttribute("SESSION_PROJECT_DATA_SN")));
		}
		return mv;
	}
	//http://openapi.foodsafetykorea.go.kr/api/963839e65a414c8995d0/I2715/json/1/1000

	/**
	 * 테이블 정보 추출
	 * @param req
	 * @param rep
	 * @param mv
	 * @param dbInfoVO
	 * @return
	 * @throws Exception
	 */
	@POST
	@RequestMapping(value = "/showTableInfo.fd" )
	public ModelAndView showTableInfo(
			HttpServletRequest req
			, HttpServletResponse rep
			, ModelAndView mv
			, @ModelAttribute("dbInfoVO") dbInfoVO dbInfoVO
			) throws Exception
	{
		UtilDb db = new UtilDb();

		dbInfoVO dbInfo = CollectServiceImpl.selectDbInfoBySn(dbInfoVO);

		db.ConnectionInfo(dbInfo.getDriver(), dbInfo.getUrl(), dbInfo.getId(), dbInfo.getPw());
		List<Map<String, Object>> result  = UtilDb.databasesList(dbInfo.getDriver());

		mv.setViewName("jsonView");
		mv.addObject("tableList",result);

		return mv;
	}

	/**
	 * 해당 사용자의  전체 샘플 명을 리턴함
	 * @param mv
	 * @return
	 * @throws Exception
	 */
	@GET
	@RequestMapping(value = "/sampleList.fd" )
	public ModelAndView sampleList(@ModelAttribute("baseDataVO") baseDataVO searchVO
			, ModelAndView mv ) throws Exception {
		//샘플 리스트
		List<baseDataVO> sampleList = CollectServiceImpl.selectSampleList(searchVO);

		mv.setViewName("jsonView");
		mv.addObject("result",sampleList);

		return mv;
	}

	/**
	 * 해당 사용자의  전체 샘플 명을 리턴함
	 * @param mv
	 * @return
	 * @throws Exception
	 */
	@GET
	@RequestMapping(value = "/standardList.fd" )
	public ModelAndView standardList(@ModelAttribute("baseDataVO") baseDataVO searchVO
			, ModelAndView mv ) throws Exception {
		//샘플 리스트
		//List<baseDataVO> sampleList = CollectServiceImpl.selectSampleList(searchVO);
		List<baseDataVO> standardList = CollectServiceImpl.selectStandardList(searchVO);

		for(int i=0; i<standardList.size(); i++) {
			System.out.println(standardList.get(i).getHeader());
		}
		mv.setViewName("jsonView");
		mv.addObject("list",standardList);
		mv.addObject("listCnt",standardList.size());
		if(standardList.size() != 0) {
			mv.addObject("flag",standardList.get(0).getFlag());
		}
		return mv;
	}

	@GET
	@RequestMapping(value = "/cordDomainList.fd" )
	public ModelAndView cordDomainList(@ModelAttribute("baseDataVO") baseDataVO searchVO
			, ModelAndView mv ) throws Exception {
		//샘플 리스트
		//List<baseDataVO> sampleList = CollectServiceImpl.selectSampleList(searchVO);
		List<baseDataVO> cordDomainList = CollectServiceImpl.selectCordDomainList(searchVO);

		for(int i=0; i<cordDomainList.size(); i++) {
			System.out.println(cordDomainList.get(i).getHeader());
		}
		mv.setViewName("jsonView");
		mv.addObject("listCnt",cordDomainList.size());
		if(cordDomainList.size() != 0) {
			mv.addObject("flag",cordDomainList.get(0).getFlag());
		}
		mv.addObject("list",cordDomainList);

		return mv;
	}

	@GET
	@RequestMapping(value = "/standardInsert.fd")
	public ModelAndView standardInsert(@ModelAttribute("baseDataVO") baseDataVO searchVO
			, ModelAndView mv) throws Exception {

		int response = CollectServiceImpl.standardInsert(searchVO);
		String result = "";
		if(response > 0 ) {
			result = "sucess";
		}
		List<baseDataVO> list = CollectServiceImpl.selectStandardList(searchVO);
		if ( response != 1 ) {
			result = "error";
		};

		//		jsonResultVO list2 = new jsonResultVO();

		//		Gson gson = new Gson();
		//		List<HashMap> dataList = gson.fromJson(((baseDataVO) list).getData(), new TypeToken<List<LinkedHashMap>>() {}.getType());
		//		ArrayList<String> headerList = gson.fromJson(((baseDataVO) list).getHeader(), new TypeToken<ArrayList<String>>() {}.getType());

		//		list2.setHeader(headerList);
		mv.setViewName("jsonView");
		mv.addObject("result" ,result);
		mv.addObject("list" ,list);
		mv.addObject("flag" ,list.get(0).getFlag());
		return mv;
	}

	@GET
	@RequestMapping(value = "/cordDomainInsert.fd")
	public ModelAndView cordDomainInsert(@ModelAttribute("baseDataVO") baseDataVO searchVO
			, ModelAndView mv) throws Exception {

		int response = CollectServiceImpl.standardInsert(searchVO);
		String result = "";
		if(response > 0 ) {
			result = "sucess";
		}
		List<?> list = CollectServiceImpl.selectStandardList(searchVO);
		if ( response != 1 ) {
			result = "error";
		};

		//		jsonResultVO list2 = new jsonResultVO();

		//		Gson gson = new Gson();
		//		List<HashMap> dataList = gson.fromJson(((baseDataVO) list).getData(), new TypeToken<List<LinkedHashMap>>() {}.getType());
		//		ArrayList<String> headerList = gson.fromJson(((baseDataVO) list).getHeader(), new TypeToken<ArrayList<String>>() {}.getType());

		//		list2.setHeader(headerList);
		mv.setViewName("jsonView");
		mv.addObject("result" ,result);
		mv.addObject("list" ,list);
		return mv;
	}

	/**
	 * 샘플 리스트에서 사용하고자 하는 기존 데이터를 선택하기 위한 기능
	 * @param searchVO
	 * @param mv
	 * @return
	 * @throws Exception
	 */
	/*	@POST
	@RequestMapping(value = "/setSampleAndDataSn.fd" )
	public ModelAndView setSampleAndDataSn(@ModelAttribute("baseDataVO") baseDataVO searchVO
									      ,ModelAndView mv ) throws Exception {
		Map<String,Object> resultMap = new HashMap<>();
		String result = "success";

		try {
			UtilSession.setAttribute("SESSION_PROJECT_SN", searchVO.getBase_data_sn());
		}
		catch(Exception e) {
			result = "fail";
		}
		mv.setViewName("jsonView");
		mv.addObject("result",result);

		return mv;
	}*/

	/**
	 * 해당 사용자의 전체 프로젝트 명을 리턴함
	 * @param mv
	 * @return
	 * @throws Exception
	 */
	@GET
	@RequestMapping(value = "/projectList.fd" )
	public ModelAndView projectList(
			@ModelAttribute("tbProjectVO") tbProjectVO searchVO
			, ModelAndView mv
			) throws Exception {

		Map<String,Object> resultMap = new HashMap<>();

		//세션 정보 등록
		searchVO.setMember_sn(Integer.valueOf(String.valueOf(UtilSession.getAttribute("SESSION_USER_SN"))));
		List<tbProjectVO> projectList = CollectServiceImpl.selectProjectList(searchVO);

		mv.setViewName("jsonView");
		mv.addObject("result",projectList);

		return mv;
	}

	/**
	 * 프로젝트 데이터 버전 리스트
	 * @param searchVO
	 * @param mv
	 * @return
	 * @throws Exception
	 */
	@GET
	@RequestMapping(value = "/projectDataVersionList.fd" )
	public ModelAndView projectDataVersionList(
			@ModelAttribute("tbProjectDataVO") tbProjectDataVO searchVO
			,ModelAndView mv
			) throws Exception {
		Map<String,Object> resultMap = new HashMap<>();
		//세션 정보 등록
		searchVO.setMember_sn(Integer.valueOf(String.valueOf(UtilSession.getAttribute("SESSION_USER_SN"))));
		List<tbProjectDataVO> projectDataVersionList = CollectServiceImpl.selectProjectDataVersionList(searchVO);
		mv.setViewName("jsonView");
		mv.addObject("result",projectDataVersionList);

		return mv;
	}

	/**
	 * 프로젝트 리스트에서 사용하고자 하는 기존 데이터를 선택하기 위한 기능
	 * @param searchVO
	 * @param mv
	 * @return
	 * @throws Exception
	 */
	@POST
	@RequestMapping(value = "/setProjectAndDataSn.fd" )
	public ModelAndView setProjectAndDataSn(
			@ModelAttribute("tbProjectDataVO") tbProjectDataVO searchVO
			,ModelAndView mv
			) throws Exception {

		Map<String,Object> resultMap = new HashMap<>();

		String result = "success";

		log.debug("###########################################################");
		log.debug(searchVO.getProject_sn()+"/"+searchVO.getProject_data_sn());
		log.debug("###########################################################");

		try {
			UtilSession.setAttribute("SESSION_PROJECT_SN", searchVO.getProject_sn());
			UtilSession.setAttribute("SESSION_PROJECT_DATA_SN", searchVO.getProject_data_sn());
		}
		catch(Exception e) {
			result = "fail";
		}

		mv.setViewName("jsonView");
		mv.addObject("result",result);

		return mv;
	}

	@POST
	@RequestMapping(value = "/setProjectAndDataSn2.fd" )
	public ModelAndView setProjectAndDataSn2(
			@ModelAttribute("tbProjectDataVO") tbProjectDataVO searchVO
			,ModelAndView mv
			) throws Exception {

		mv.setViewName("jsonView");
		String result = "success";

		tbProjectDataVO tbProjectDataVO = new tbProjectDataVO();
		tbProjectDataVO.setProject_sn(Integer.valueOf(String.valueOf(UtilSession.getAttribute("SESSION_PROJECT_SN"))));
		tbProjectDataVO.setProject_data_sn(Integer.valueOf(String.valueOf(UtilSession.getAttribute("SESSION_PROJECT_DATA_SN"))));

		long start = System.currentTimeMillis();
		int resultCnt = CollectServiceImpl.selectProjectDataInfoCnt(tbProjectDataVO);
		if(resultCnt>0) {
			tbProjectDataVO projectInfo = CollectServiceImpl.selectProjectDataInfo(tbProjectDataVO);

			String output = projectInfo.getDiagram_layout().toString();
			if(null==output || output.equals("")) {
				mv.addObject("workflow","");
				mv.addObject("headerOption","");
			}else {
				mv.addObject("workflow",output);
				if(projectInfo.getHeader_option() != null) {
					mv.addObject("headerOption",projectInfo.getHeader_option().toString());
				}else {
					mv.addObject("headerOption","");
				}
			}
		}else {
			mv.addObject("workflow","");
			mv.addObject("headerOption","");
		}
		long end = System.currentTimeMillis();
		System.out.println( "실행 시간 : " + ( end - start )/1000.0 );
		return mv;
	}

	@POST
	@RequestMapping(value = "/prepGridData.fd" )
	public ModelAndView prepGridData(
			@ModelAttribute("tbProjectDataVO") tbProjectDataVO searchVO
			,ModelAndView mv
			) throws Exception {
		mv.setViewName("jsonView");
		String result = "success";

		tbProjectDataVO tbProjectDataVO = new tbProjectDataVO();
		tbProjectDataVO.setProject_sn(Integer.valueOf(String.valueOf(UtilSession.getAttribute("SESSION_PROJECT_SN"))));
		tbProjectDataVO.setProject_data_sn(Integer.valueOf(String.valueOf(UtilSession.getAttribute("SESSION_PROJECT_DATA_SN"))));

		int resultCnt = CollectServiceImpl.selectProjectDataInfoCnt(tbProjectDataVO);
		if(resultCnt>0) {
			tbProjectDataVO projectInfo = CollectServiceImpl.selectProjectDataInfo(tbProjectDataVO);
			String output = projectInfo.getDiagram_layout().toString();
			if(null==output || output.equals("")) {
				mv.addObject("workflow","");
			}else {
				mv.addObject("workflow",output);
			}
			mv.addObject("headerOption",projectInfo.getHeader_option().toString());
		}else {
			mv.addObject("workflow","");
		}
		return mv;
	}

	/**
	 * 데이터 베이스 리스트 조회
	 * @param req
	 * @param rep
	 * @param dbInfoVO
	 * @return
	 * @throws Exception
	 */

	@GET
	@RequestMapping(value = "/selectDbList.fd" )
	public ModelAndView selectDbList(
			HttpServletRequest req
			, HttpServletResponse rep
			, ModelAndView mv
			, @ModelAttribute("dbInfoVO") dbInfoVO dbInfoVO
			) throws Exception
	{
		Map<String,Object> resultMap = new HashMap<String,Object>();
		List<dbInfoVO> list = CollectServiceImpl.selectDbList(dbInfoVO);

		mv.setViewName("jsonView");
		mv.addObject("result",list);

		return mv;
	}

	/**
	 * 테스트 코드 (TEST CODE)
	 * @param driver
	 * @param url
	 * @param id
	 * @param pw
	 * @param sql
	 * @param mv
	 * @return
	 * @throws Exception
	 */
	@POST
	@RequestMapping(value = "/dbConnectionList.fd" )
	public ModelAndView dbConnectionList(
			@RequestParam(value="driver", required=false) String driver
			,@RequestParam(value="url", required=false) String url
			,@RequestParam(value="id", required=false) String id
			,@RequestParam(value="pw", required=false) String pw
			,@RequestParam(value="sql", required=false) String sql

			, ModelAndView mv
			) throws Exception {

		UtilDb db = new UtilDb();
		db.ConnectionInfo(driver, url, id, pw);
		List<Map<String, Object>> result  = UtilDb.listQuery(sql);

		mv.setViewName("jsonView");
		mv.addObject("result",result);

		return mv;
	}

	/**
	 * 데이터베이스 정보 추출(TEST CODE)
	 * @param driver
	 * @param url
	 * @param id
	 * @param pw
	 * @param sql
	 * @return
	 * @throws Exception
	 */
	@POST
	@RequestMapping(value = "/databasesList.fd" )
	public ModelAndView databasesList(
			@RequestParam(value="driver", required=false) String driver
			,@RequestParam(value="url", required=false) String url
			,@RequestParam(value="id", required=false) String id
			,@RequestParam(value="pw", required=false) String pw
			,@RequestParam(value="sql", required=false) String sql
			, ModelAndView mv

			) throws Exception {

		UtilDb db = new UtilDb();
		db.ConnectionInfo(driver, url, id, pw);
		List<Map<String, Object>> result  = UtilDb.databasesList(driver);

		mv.setViewName("jsonView");
		mv.addObject("result",result);

		return mv;
	}

	/**
	 * 해당 사용자의 전체 프로젝트 명을 리턴함
	 * @param mv
	 * @return
	 * @throws Exception
	 */
	@GET
	@RequestMapping(value = "/projectDataVersionCheck.fd" )
	public ModelAndView projectDataVersionCheck(
			@ModelAttribute("tbProjectVO") tbProjectVO searchVO
			, ModelAndView mv

			) throws Exception {
		//세션 정보 등록
		searchVO.setMember_sn(Integer.valueOf(String.valueOf(UtilSession.getAttribute("SESSION_USER_SN"))));
		//		List<tbProjectVO> projectList = CollectServiceImpl.selectProjectList(searchVO);
		int resultCnt = CollectServiceImpl.selectProjectDataListCnt(searchVO);

		mv.setViewName("jsonView");
		mv.addObject("resultCnt",resultCnt);

		return mv;
	}
	@GET
	@RequestMapping(value = "/getProjectDataSn.fd" )
	public ModelAndView getProjectDataSn(
			@ModelAttribute("tbProjectDataVO") tbProjectDataVO searchVO
			, ModelAndView mv

			) throws Exception {

		tbProjectDataVO tbProjectDataVO = new tbProjectDataVO();
		tbProjectDataVO.setProject_sn(Integer.valueOf(String.valueOf(UtilSession.getAttribute("SESSION_PROJECT_SN"))));
		int resultCnt = CollectServiceImpl.selectProjectDataSn(tbProjectDataVO);
		mv.setViewName("jsonView");
		mv.addObject("resultCnt",resultCnt);

		return mv;
	}

	/**
	 * 스케줄링 스케줄러 관리 화면
	 * @param mv
	 * @return
	 * @throws Exception
	 */
	@GET
	@RequestMapping(value = "/scheduleList.fd", method=RequestMethod.GET)
	public ModelAndView scheduleList(@ModelAttribute("scheduleVO") scheduleVO vo, ModelAndView mv)throws Exception{

		List<scheduleVO> projectList =CollectServiceImpl.selectScheduleProject(vo);

		mv.setViewName("jsonView");
		mv.addObject("list",projectList);

		return mv;
	}
	/**
	 * 스케줄링 스케줄러 관리 화면
	 * @param mv
	 * @return
	 * @throws Exception
	 */
	@POST
	@RequestMapping(value = "/scheduleDataList.fd")
	public ModelAndView scheduleDataList(@ModelAttribute("scheduleDataVO") scheduleDataVO vo,@RequestBody Map<String, Object> jsonData, ModelAndView mv)throws Exception{

		String sn = String.valueOf(jsonData.get("schedule_sn"));

		vo.setSchedule_sn(sn);
		List<scheduleDataVO> scheduleDataList =CollectServiceImpl.selectScheduleData(vo);

		System.out.println(scheduleDataList.size());

		mv.setViewName("jsonView");
		mv.addObject("list",scheduleDataList);

		return mv;
	}

	/**
	 * 스케줄링 스케줄러 추가 화면
	 * @param mv
	 * @return
	 * @throws Exception
	 */
	@GET
	@RequestMapping(value="/scheduleAdd.fd")
	public  ModelAndView scheduleAdd(HttpServletRequest req,HttpServletResponse rep, ModelAndView mv
			,@ModelAttribute("scheduleVO") scheduleVO vo
			,@RequestParam  Map<String ,Object> jsonData )
					throws Exception{

		//json형태로 가져오는건 따로 세팅 해줘야한다.
		String schedule_path = String.valueOf(jsonData.get("schedule_path"));
		String schedule_after = String.valueOf(jsonData.get("schedule_after"));

		vo.setSchedule_path(schedule_path);
		vo.setSchedule_after(schedule_after);

		vo.setSchedule_url(URLDecoder.decode(vo.getSchedule_url()));

		int result  = CollectServiceImpl.insertScheduleProject(vo);

		String message = "";
		if(result > 0) {
			message = "success";
		}else {
			message = "fail";
		}
		mv.setViewName("jsonView");
		mv.addObject("message",message);

		return mv;
	}

	/**
	 * 스케줄링 스케줄러 active
	 * @param mv
	 * @return
	 * @throws Exception
	 */
	@POST
	@RequestMapping(value = "/scheduleActive.fd" )
	public ModelAndView selectScheduleActive(
			ModelAndView mv
			,@RequestParam  Map<String ,Object> jsonData
			) throws Exception
	{
		//스케줄링 상태 0으로 초기화
		CollectServiceImpl.initScheduleActive();

		scheduleVO vo = new scheduleVO();
		int schedule_sn = Integer.valueOf(String.valueOf(jsonData.get("schedule_sn")));
		String active = String.valueOf(jsonData.get("schedule_active"));
		//스케줄링 상태 값이 stop이면
		if(active.equals("0")) {
			vo.setSchedule_active(active);
			vo.setSchedule_sn(schedule_sn);
			//상태값을
			int result2 = CollectServiceImpl.updateScheduleActive(vo);
			//스케줄링 상태 값이 start이면
		}else if(active.equals("1")) {
			//크롤링 수행
			UtilCrawling.CrawlingProcess(active,schedule_sn,schedulerServiceImpl,CollectServiceImpl);
			//스케줄링 상태 값이 delete면
		}else if(active.equals("2")) {
			//삭제 처리 프로세스
			vo.setSchedule_sn(schedule_sn);
			int result3=CollectServiceImpl.deleteScheduleList(vo);
		}
		scheduleVO scheduleVO = new scheduleVO();
		List<scheduleVO> projectList =CollectServiceImpl.selectScheduleProject(scheduleVO);

		mv.addObject("list",projectList);
		// TODO Auto-generated catch block
		mv.setViewName("jsonView");
		return mv;
	}
}