package fixadata.prep;

import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.POST;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;

import fixadata.collect.service.CollectService;
import fixadata.collect.vo.tbProjectDataVO;
import fixadata.collect.vo.tbProjectVO;
import fixadata.collect.vo.versionInfoVO;
import fixadata.common.commonVO.jsonResultVO;
import fixadata.prep.service.PrepService;
import fixadata.util.UtilBufferStack;
import fixadata.util.UtilCommon;
import fixadata.util.UtilSession;
import lombok.extern.slf4j.Slf4j;

/**
 * @author Tom.DongHyuk (bioendpoint@gmail.com)
 * rule 관련
 */

@Slf4j
@RequestMapping("/prep")
@Controller
public class PrepController {

	static String rootPath = System.getProperty("user.dir");
	@Autowired
	CollectService CollectServiceImpl;


	@Autowired
	PrepService PrepServiceImpl;

	@Autowired
	UtilBufferStack bufferStack;

	/**
	 * 전처리 화면
	 * @param map
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@GET @POST
	@RequestMapping(value = "/prep.fd")
	public String prep(
			@ModelAttribute("searchVO") tbProjectDataVO searchVO
			, HttpServletRequest req
			, HttpServletResponse rsp
			, ModelMap model) throws Exception {


		versionInfoVO vivo = null;
		int ver_cnt = 0;
		if(searchVO.getProject_sn()<=0 && searchVO.getProject_data_sn()<=0)
		{
			try {
				searchVO.setProject_sn(Integer.valueOf(String.valueOf(UtilSession.getAttribute("SESSION_PROJECT_SN"))));
				searchVO.setProject_data_sn(Integer.valueOf(String.valueOf(UtilSession.getAttribute("SESSION_PROJECT_DATA_SN"))));

				ver_cnt = CollectServiceImpl.selectVersionInfoCheck();
				if(ver_cnt == 0) {
					CollectServiceImpl.insertVersionDefault();
				}else {
					vivo = CollectServiceImpl.selectVersionInfo();
				}
			}catch(Exception e)
			{

				return "redirect:/collect/datainput.fd";
			}
		}
		model.addAttribute("version_info",vivo.getVersion_nm());
		model.addAttribute("mac_address_info",UtilSession.getAttribute("SESSION_MAC_ADDRESS"));

		return "prep/prep";
	}


	@GET @POST
	@RequestMapping(value = "/c3test.fd")
	public String c3test(
			@ModelAttribute("searchVO") tbProjectDataVO searchVO
			, HttpServletRequest req
			, HttpServletResponse rsp
			, ModelMap model) throws Exception {

		return "prep/c3test";
	}


	/**
	 * 전처리 데이터 로드
	 * @param uploadFile
	 * @param mv
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/loadData.fd",method = RequestMethod.GET )
	public ModelAndView loadData(
			@RequestParam Map<String ,Object> map, ModelMap model
			, @ModelAttribute("searchVO") tbProjectDataVO searchVO
			, ModelAndView mv) throws Exception
	{

		mv.setViewName("jsonView");

		jsonResultVO result = new jsonResultVO();

		String project_name = "";
		tbProjectVO projectvo = new tbProjectVO();
		projectvo.setProject_sn(searchVO.getProject_sn());
		List<tbProjectVO> projectList = CollectServiceImpl.selectProjectList(projectvo);

		if(projectList.size()>0)
		{
			project_name = projectList.get(0).getProject_name();
		}

		tbProjectDataVO prepData = PrepServiceImpl.selectLoadData(searchVO);

		Gson gson = new Gson();
		ArrayList<HashMap> headerOptionList = null;
		List<HashMap> dataList = gson.fromJson(prepData.getData(), new TypeToken<List<LinkedHashMap>>() {}.getType());
		ArrayList<String> headerList = gson.fromJson(prepData.getHeader(), new TypeToken<ArrayList<String>>() {}.getType());
		//ArrayList<String> blockchainList = gson.fromJson(prepData.getBlockchain(), new TypeToken<ArrayList<String>>() {}.getType());
		ArrayList<HashMap> blockchainList = gson.fromJson(prepData.getBlockchain(), new TypeToken<List<LinkedHashMap>>() {}.getType());

		if(null!=prepData.getHeader_option() && !prepData.getHeader_option().equals("") && prepData.getHeader_option().length()>5)
		{
			headerOptionList = gson.fromJson(prepData.getHeader_option(), new TypeToken<ArrayList<HashMap>>() {}.getType());
		}


		String headerString = String.join(",", headerList);

		UtilSession.setAttribute("SESSION_TABLE_HEADER",headerString);
		UtilSession.setAttribute("SESSION_TABLE_HEADER_KEY",headerString);

		result.setData(dataList);
		result.setHeader(headerList);
		result.setHeader_option(headerOptionList);
		result.setBlockchain(blockchainList);

		mv.addObject("mac_address",UtilCommon.getMacAddress());
		mv.addObject("result",result);
		mv.addObject("projectName",project_name);

		return mv;
	}


	/**
	 * 전처리 데이터 저장
	 * @param map
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@POST
	@RequestMapping(value = "/savePrep.fd")
	public ModelAndView savePrep(@RequestBody Map<String, Object> jsonData, HttpServletRequest request, ModelAndView mv) throws Exception {

		mv.setViewName("jsonView");

		tbProjectVO tbProjectVO = new tbProjectVO();

		String issuccess = "fail";


		int result = PrepServiceImpl.savePrep(jsonData);

		if(result>0)
		{
			issuccess = "success";
			//	PrepServiceImpl.saveData(jsonData);
		}

		mv.addObject("result",issuccess);

		return mv;
	}


	@POST
	@RequestMapping(value = "/saveAsPrep.fd")
	public ModelAndView saveAsPrep(@RequestBody Map<String, Object> jsonData, HttpServletRequest request, ModelAndView mv) throws Exception {

		mv.setViewName("jsonView");

		tbProjectVO tbProjectVO = new tbProjectVO();

		String issuccess = "fail";

		int result = PrepServiceImpl.saveAsPrep(jsonData);

		if(result>0)
		{
			issuccess = "success";
			//	PrepServiceImpl.saveData(jsonData);
		}

		mv.addObject("result",issuccess);

		return mv;
	}


	@POST
	@RequestMapping(value = "/updatePrep.fd")
	public ModelAndView udpatePrep(@RequestBody Map<String, Object> jsonData, HttpServletRequest request, ModelAndView mv) throws Exception {

		mv.setViewName("jsonView");

		String issuccess = "fail";

		int result = PrepServiceImpl.udpatePrep(jsonData);

		if(result>0)
		{
			issuccess = "success";
		}

		mv.addObject("result",issuccess);

		return mv;
	}


	@POST
	@RequestMapping(value = "/diagramUpdatePrep.fd")
	public ModelAndView diagramUpdatePrep(@RequestBody Map<String, Object> jsonData, HttpServletRequest request, ModelAndView mv) throws Exception {

		mv.setViewName("jsonView");

		String issuccess = "fail";

		int result = PrepServiceImpl.diagramUpdatePrep(jsonData);

		if(result>0)
		{
			issuccess = "success";
		}

		mv.addObject("result",issuccess);

		return mv;
	}


	@POST
	@RequestMapping(value = "/writeJson.fd")
	public ModelAndView writeJson(@RequestBody Map<String, Object> jsonData, HttpServletRequest request, ModelAndView mv) throws Exception {
		mv.setViewName("jsonView");
		JSONObject obj = new JSONObject();
		FileWriter file = null;
		obj.put("history",jsonData);
		String jsonName = String.valueOf(jsonData.get("historyId"));

		bufferStack.setTempData(jsonName, obj.toJSONString());

		/**
		//폴더가 없다면 생성
		mkdir(rootPath +"\\PrepHistory\\");
		try {
			file = new FileWriter(rootPath+"\\PrepHistory\\"+jsonName+".json");
			file.write(obj.toJSONString());
			file.flush();
			file.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		 **/

		return mv;
	}


	@POST
	@RequestMapping(value = "/readJson.fd")
	public ModelAndView readJson(@RequestBody Map<String, Object> jsonData, HttpServletRequest request, ModelAndView mv) throws Exception {

		mv.setViewName("jsonView");

		JSONParser parser = new JSONParser();
		jsonResultVO result = new jsonResultVO();
		String jsonName = String.valueOf(jsonData.get("historyId"));
		String josnData = bufferStack.getTempData(jsonName);

		JSONArray data = null;
		JSONArray header = null;
		JSONArray header_option = null;
		String mac_address = "";

		try {
			//Map<String, Object> obj = (Map<String, Object>)parser.parse(new BufferedReader(new FileReader(rootPath+"\\PrepHistory\\"+jsonName+".json")));
			Map<String, Object> obj = (Map<String, Object>)parser.parse(josnData);

			Map<String, Object> list = (Map<String, Object>)obj.get("history");
			data = (JSONArray) list.get("data");
			header = (JSONArray) list.get("header");
			header_option = (JSONArray) list.get("header_option");
			mac_address =  String.valueOf(list.get("mac_address"));
		} catch (Exception e) {
			e.printStackTrace();
		}

		result.setData(data);
		result.setHeader(header);
		result.setHeader_option(header_option);
		mv.addObject("result",result);
		mv.addObject("mac_address",mac_address);

		return mv;
	}

	public static void mkdir(String path) {
		File dir = new File(path);
		if(!dir.exists()) {    //디렉토리 없으면 생성.
			dir.mkdirs();
		}
	}

}