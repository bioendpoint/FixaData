package fixadata.common.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import javax.annotation.Resource;
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
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import fixadata.collect.service.CollectService;
import fixadata.collect.vo.tbProjectDataVO;
import fixadata.collect.vo.tbProjectVO;
import fixadata.common.EgovProperties;
import fixadata.common.schelduler.SchedulerService;
import fixadata.prep.service.PrepService;
import fixadata.util.UtilASE256;
import fixadata.util.UtilCrawling;
import fixadata.util.UtilExcelDown;
import fixadata.util.UtilFiles;
import fixadata.util.UtilJson;
import fixadata.util.UtilSession;
import fixadata.util.UtilSingleThread;
import fixadata.util.UtilString;
import lombok.extern.slf4j.Slf4j;

/**
 * @author Tom.DongHyuk
 * rule 관련
 */
@Slf4j
@Controller
@RequestMapping("/common")
public class CommonController {

	@Autowired
	PrepService PrepServiceImpl;

	@Autowired
	CollectService CollectServiceImpl;
	/**
	 * import data by zip file
	 */
	@Resource(name = "schedulerService")
	SchedulerService schedulerServiceImpl;

	/**
	 * 샘플코드
	 * @param request
	 * @param response
	 * @param uploadFile
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@GET
	@RequestMapping(value = "/sctest.fd")
	public ModelAndView sctest(
			HttpServletRequest request
			, HttpServletResponse response
			, @RequestPart(required=false)MultipartFile uploadFile
			, ModelMap model) throws Exception {

		ModelAndView mv = new ModelAndView();

		schedulerServiceImpl.addTaskToScheduler(1, new Runnable() {

			@Override
			public void run() {
				// TODO Auto-generated method stub
				System.out.println("############################################");
				Calendar calendar = Calendar.getInstance();
				java.util.Date date = calendar.getTime();
				String today = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date));
				System.out.println(today);
				System.out.println("############################################");
				System.out.println("############################################");
				System.out.println("############################################");
				System.out.println("############################################");
				System.out.println("############################################");
				System.out.println("############################################");
				System.out.println("############################################");
				System.out.println("############################################");
				System.out.println("############################################");
			}

		},"0 7 17 * * *");

		mv.setViewName("jsonView");
		mv.addObject("result","success");
		return mv;
	}

	@POST
	@RequestMapping(value = "/importData.fd")
	public ModelAndView importData(
			HttpServletRequest request
			, HttpServletResponse response
			, @RequestPart(required=false)MultipartFile uploadFile
			, ModelMap model) throws Exception {

		String subpath = EgovProperties.getProperty("Globals.zip_temppath");
		String uploadPath = "database"+File.separator+subpath;// database/ziptemp
		String result_string = "false";
		FileInputStream fileInputStream = null;
		FileOutputStream fileOutputStream = null;
		BufferedOutputStream bufferedOutputStream = null;

		String temp_file = String.valueOf(System.nanoTime());
		String import_tempfile = uploadPath+File.separator+temp_file+".json";
		ZipInputStream zis = new ZipInputStream(new BufferedInputStream(uploadFile.getInputStream()));
		ZipEntry zipEntry = null;
		int result = 0 ;
		while ((zipEntry = zis.getNextEntry()) != null) {
			String filename = zipEntry.getName();
			if(filename.equals(EgovProperties.getProperty("Globals.export_inner_filename")))
			{
				result++;
				File fs = new File(import_tempfile);
				fileOutputStream = new FileOutputStream(fs);
				bufferedOutputStream = new BufferedOutputStream(fileOutputStream);
				int length = 0;
				while ((length = zis.read()) != -1) {
					bufferedOutputStream.write(length);
				}
				bufferedOutputStream.flush();
				bufferedOutputStream.close();
			}else {
				break;
			}
			zis.closeEntry();
		}
		zis.close();
		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		if(result > 0) {
			//압축한 파일을 다시 로드함
			//File zfs = new File(import_tempfile);
			JSONParser parser = new JSONParser();
			//Object obj = parser.parse(new FileReader(import_tempfile));

			FileReader fr = new FileReader(new File(import_tempfile));
			StringBuffer sb = new StringBuffer();
			int singleCh = 0;
			while((singleCh = fr.read()) != -1){
				sb.append((char)singleCh);
			}

			Object obj;
			JSONObject jsonObject = new JSONObject();
			boolean parse_check = true;

			try {
				UtilASE256 ase = new UtilASE256();
				//암호화 과정
				String decode = ase.aesDecode(sb.toString());

				obj= parser.parse( decode );
				jsonObject = (JSONObject) obj;
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				parse_check = false;
			}

			/**
			 * parsing error일때의 처리
			 */
			if(parse_check==false)
			{
				result_string = "parser error";
				mv.addObject("result",result_string);
				mv.setViewName("jsonView");

				return mv;
			}

			//JSONObject jsonObject = (JSONObject) obj;

			// MEMBERSN 변수
			int member_sn = Integer.parseInt((String) UtilSession.getAttribute("SESSION_USER_SN"));
			//파일 업로드 데이터 수집
			tbProjectVO tbProjectVO = new tbProjectVO();
			//프로젝트 정보 등록
			tbProjectVO.setMember_sn(member_sn);
			tbProjectVO.setFlag(1);
			tbProjectVO.setProject_name(request.getParameter("import_name"));
			CollectServiceImpl.collectimportProcess(tbProjectVO,jsonObject);

			result_string = "success";
		}
		mv.addObject("result",result_string);
		mv.setViewName("jsonView");
		return mv;
	}

	/**
	 * export data
	 * @param project_sn
	 * @param project_data_sn
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@POST @GET
	@RequestMapping(value = "/exportData.fd")
	public ModelAndView exportData(
			//@RequestParam String project_sn
			//, @RequestParam String project_data_sn
			//, @RequestParam String history
			//@RequestBody Map<String, Object> jsonData
			@RequestParam Map<String ,Object> jsonData
			, HttpServletRequest request
			, HttpServletResponse response
			, ModelMap model) throws Exception {

		tbProjectDataVO vo = new tbProjectDataVO();

		int BUFFER_SIZE = 1024;

		//데이터 추출
		vo.setProject_sn(Integer.valueOf(String.valueOf(jsonData.get("project_sn"))));
		vo.setProject_data_sn(Integer.valueOf(String.valueOf(jsonData.get("project_data_sn"))));
		tbProjectDataVO data = PrepServiceImpl.selectLoadData(vo);

		JsonObject result = new JsonObject();

		String filename = EgovProperties.getProperty("Globals.export_filename");

		filename = filename.split("\\.")[0] + "_"+UtilString.getYmdHis()+"."+filename.split("\\.")[1];

		//String filename = "export.zip";

		String pattern = EgovProperties.getProperty("Globals.export_pattern");

		String key = pattern.split(",")[0];
		String value = pattern.split(",")[1];

		Gson gson = new Gson();

		JSONArray header = gson.fromJson(data.getHeader(), JSONArray.class);
		JSONArray dataList = gson.fromJson(data.getData(), JSONArray.class);
		JSONArray headerOption = gson.fromJson(data.getHeader_option(), JSONArray.class);
		JSONArray diagramLayout = gson.fromJson(String.valueOf(jsonData.get("diagram_layout")), JSONArray.class);
		JSONArray blockchain = gson.fromJson(String.valueOf(jsonData.get("blockchain")), JSONArray.class);

		Map<String,Object> resultMap = new HashMap<String,Object>();
		resultMap.put(key,value);
		resultMap.put("header",header);
		resultMap.put("data",dataList);
		resultMap.put("header_option",headerOption);
		resultMap.put("diagram_layout",diagramLayout);
		resultMap.put("blockchain",blockchain);

		String resultJsonText =  gson.toJson(resultMap);

		UtilASE256 ase = new UtilASE256();
		//암호화 과정
		resultJsonText = ase.aesEncode(resultJsonText);

		String subpath = EgovProperties.getProperty("Globals.zip_temppath");
		String uploadPath = "database"+File.separator+subpath;

		File databasePath = new File("database");
		File desti = new File(uploadPath);
		if(!databasePath.exists()){
			databasePath.mkdir();
		}

		if(!desti.exists()){
			desti.mkdirs();

		}
		String outputson = EgovProperties.getProperty("Globals.export_inner_filename");
		//String outputson=  "export.json";
		String outFilename = uploadPath+File.separator+filename;

		File deleteFile = new File(outFilename);

		if(!deleteFile.exists())
		{
			deleteFile.delete();
		}


		ZipOutputStream zOS = new ZipOutputStream(new FileOutputStream(outFilename));

		InputStream is = new ByteArrayInputStream(resultJsonText.getBytes());

		zOS.putNextEntry(new ZipEntry(outputson));

		byte[] buf = new byte[BUFFER_SIZE];

		int cnt = 0;
		int len;
		while ((len = is.read(buf)) > 0) {
			if(cnt==0)
			{
				log.info(String.valueOf(len));
				cnt++;
			}
			zOS.write(buf, 0, len);
		}
		zOS.finish();

		zOS.closeEntry();
		is.close();
		zOS.close();

		//File down = new File(outFilename);

		downlaodZipFile(request, response, outFilename);

		return null;

	}

	/**
	 *
	 * @param request
	 * @param response
	 * @param uploadFile
	 * @param model
	 * @param mv
	 * @return
	 * @throws Exception
	 */
	@POST
	@RequestMapping(value="/releaseData.fd")
	public ModelAndView releaseData(
			MultipartHttpServletRequest request,
			HttpServletResponse response,
			@RequestPart(required = false)MultipartFile uploadFile,
			@RequestParam(value = "version", required = false) String version,
			ModelMap model, ModelAndView mv) throws Exception{

		int result = 1;
		//파일 외부 경로 설정 변수
		String update_root = EgovProperties.getProperty("Globals.update_root");
		String update_path = EgovProperties.getProperty("Globals.zip_update");
		String release_path = EgovProperties.getProperty("Globals.zip_release");
		String unzip_path = EgovProperties.getProperty("Globals.unzip_file");

		String before_version = version;
		UtilFiles.deletefiles(update_path);
		UtilFiles.deletefiles(release_path);
		UtilFiles.deletefiles(unzip_path);

		File f = new File(update_path);
		if(!f.exists())
		{
			f.mkdirs();
		}
		f = new File(release_path);
		if(!f.exists())
		{
			f.mkdirs();
		}
		f = new File(unzip_path);
		if(!f.exists())
		{
			f.mkdirs();
		}

		BufferedOutputStream outputStream = new BufferedOutputStream(new FileOutputStream(new File(update_path ,uploadFile.getOriginalFilename())));//파일 업로드를 위한 클래스
		outputStream.write(uploadFile.getBytes());//파일 쓰기
		outputStream.flush();
		outputStream.close();//객체 살아있기때문에 끝나면 close 실행해야함

		File fileBefore = new File(update_path+uploadFile.getOriginalFilename()); //업로드 파일 위치
		File fileAfter = new File(release_path+uploadFile.getOriginalFilename()); //배포 파일 위치

		fileBefore.renameTo(fileAfter); // 파일 위치 이동(zipupdate->ziprelease)
		boolean fileCheck = false;

		//unzip과정
		ZipInputStream zis = new ZipInputStream(new FileInputStream(release_path+uploadFile.getOriginalFilename())); //unzip 파일을 가져와서 넣기
		ZipEntry ze = zis.getNextEntry();
		String entryName = "";

		while(ze!=null) { //파일이 존재하면 실행함
			entryName = ze.getName();
			if(entryName.contains("release.json"))
			{
				fileCheck = true;
			}

			File unzipFile = new File(unzip_path+entryName); //파일해제 경로 설정
			unzipFile.getParentFile().mkdirs();
			FileOutputStream fos = new FileOutputStream(unzipFile);

			byte buffer[] = new byte[1024];
			int len =0;

			while((len =zis.read(buffer))>0) {
				fos.write(buffer, 0, len);
			}
			fos.close();
			ze =zis.getNextEntry();
		}
		zis.closeEntry();
		zis.close();

		if(fileCheck==true) {//확장자명 같은지 확인하기
			JSONParser parser = new JSONParser(); //파싱(다른 형태로 저장된 데이터를 변환)하기위해 형성
			try {
				System.out.println(unzip_path);
				Map<String, Object> obj = (Map<String, Object>)parser.parse(new FileReader(unzip_path+"release.json"));
				obj.put("before_version",before_version);
				obj.put("unzip_path",unzip_path);
				Gson gson = new Gson();
				String jsonString = obj.toString();

				UtilSingleThread ut = new UtilSingleThread(jsonString);
				Thread t = new Thread(ut);
				t.start();

				//			Thread.sleep(5000);
				//			sendREST("1111",jsonString);

				// 특정 문자열("update_version",ㅡ"update_items") 찾기
				//			if(null!=obj.get("update_version") && null!=obj.get("update_items"))
				//			{
				//
				//				File finish_path = new File(unzip_path+"finish");//성공하면 finish 만들기
				//				FileWriter finish_file = new FileWriter(finish_path, true) ;
				//
				//				finish_file.write("");
				//				finish_file.flush();
				//				finish_file.close();
				//			}
				//			else
				//			{
				//				result = 2;
				//			}
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			} catch (Exception e) {
				e.printStackTrace();
			}
			result = 1;
		}else {
			result = 0;
		}
		/**
		 * result 0 => .zip파일 확장자를 존재 하지 않음
		 *        1 => 모든 조건 갖추어있으므로 배포 성공
		 *        2 => release.json파일이 존재하나 key값을 가지고 있지 않음
		 */
		mv.addObject("result",result);

		//		if(fileCheck==true) {//확장자명 같은지 확인하기
		//			JSONParser parser = new JSONParser(); //파싱(다른 형태로 저장된 데이터를 변환)하기위해 형성
		//			try {
		//				Map<String, Object> obj = (Map<String, Object>)parser.parse(new FileReader(unzip_path+"release.json"));
		//
		//				// 특정 문자열("update_version",ㅡ"update_items") 찾기
		//				if(null!=obj.get("update_version") && null!=obj.get("update_items"))
		//				{
		//					File finish_path = new File(unzip_path+"finish");//성공하면 finish 만들기
		//					FileWriter finish_file = new FileWriter(finish_path, true) ;
		//
		//					finish_file.write("");
		//					finish_file.flush();
		//					finish_file.close();
		//				}
		//				else
		//				{
		//					result = 2;
		//				}
		//			} catch (FileNotFoundException e) {
		//				e.printStackTrace();
		//			} catch (IOException e) {
		//				e.printStackTrace();
		//			} catch (Exception e) {
		//				e.printStackTrace();
		//			}
		//			result = 1;
		//		}else {
		//			result = 0;
		//		}
		//		/**
		//		 * result 0 => .zip파일 확장자를 존재 하지 않음
		//		 *        1 => 모든 조건 갖추어있으므로 배포 성공
		//		 *        2 => release.json파일이 존재하나 key값을 가지고 있지 않음
		//		 */
		//		mv.addObject("result",result);
		mv.setViewName("jsonView");

		return mv;
	}
	/**
	 * 다운로드
	 * @param req
	 * @param res
	 * @param zipfile
	 */
	public static void downlaodZipFile(
			HttpServletRequest req
			, HttpServletResponse res,String zipfile)
	{
		File zipFile = new File(zipfile);
		res.setContentType("application/x-zip-compressed;");
		res.setHeader("Content-Disposition", "attachment; filename=\"" + zipFile.getName() + "\";");
		OutputStream out = null;
		InputStream in = null;
		try{
			out = res.getOutputStream();
			in = new FileInputStream(zipfile);
			byte[] buf = new byte[1024];
			int len;
			while( (len = in.read(buf)) > 0 ){
				out.write(buf, 0, len);
			}
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			if (out != null) {
				try { out.close(); } catch (Exception e) {} out = null;
			}
			if (in != null) {
				try { in.close(); } catch (Exception e) {} in = null;
			}
		}
	}

	/**
	 * 공통페이지 로드기능
	 * @param page
	 * @return
	 * @throws Exception
	 */
	@POST @GET
	@RequestMapping(value = "/page.fd")
	public String uploadFormDb(@RequestParam String page, ModelMap model) throws Exception {

		if(null!=UtilSession.getAttribute("SESSION_USER_ID") &&  !"".equals(UtilSession.getAttribute("SESSION_USER_ID")))
		{
			model.addAttribute("session", UtilSession.getAttribute("SESSION_USER_ID"));
			model.addAttribute("session_project_data_sn", UtilSession.getAttribute("SESSION_PROJECT_DATA_SN"));
		}
		else
		{
			model.addAttribute("session", "");
			model.addAttribute("session_project_data_sn", "");
		}

		StringBuffer sb = new StringBuffer();
		sb.append("inc/");
		sb.append(page);
		return sb.toString();
	}

	/**
	 * 엑셀다운로드 기능
	 * @param map
	 * @param model
	 * @param searchVO
	 * @param response
	 * @param req
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/excelDownload.fd" ,method = RequestMethod.POST)
	public ModelAndView excelDownload( @RequestParam Map<String ,Object> map,
			ModelMap model,
			@ModelAttribute("searchVO") tbProjectDataVO searchVO,
			HttpServletResponse response,
			HttpServletRequest req  ) throws Exception {

		tbProjectDataVO prepData = PrepServiceImpl.selectLoadData(searchVO);

		Gson gson = new Gson();
		List<HashMap<String,String>> dataList = gson.fromJson(prepData.getData(), new TypeToken<List<LinkedHashMap<String,String>>>() {}.getType());
		ArrayList<String> headerList = gson.fromJson(prepData.getHeader(), new TypeToken<ArrayList<String>>() {}.getType());

		ModelAndView mv = new ModelAndView("excelView","List",dataList);
		mv.addObject("headerList",headerList);
		mv.addObject("projectNm",map.get("project_nm"));

		return mv;
	}

	/* json엑셀 다운로드  */
	@POST
	@RequestMapping(value = "/jexcelDownload.fd")
	public ModelAndView jexcelDownload(@RequestBody Map<String, Object> jsonData,HttpServletRequest request,HttpServletResponse response) throws Exception {
		long startTime = System.currentTimeMillis();

		//fileName 셋팅 변수 세팅
		String jsonfileName= String.valueOf(jsonData.get("fileName"));

		//data 정보 리스트 변수 세팅
		ArrayList<Map<String, Object>> data = (ArrayList<Map<String, Object>>)(jsonData.get("data"));
		//header 리스트 변수 선언
		ArrayList<Map<String, Object>> header = null;
		//datalist 리스트 변수 선언
		JSONArray datalist = null;

		JSONArray tbData = null;
		//엑셀 생성 정보 리스트변수 선언
		ArrayList<Map<String,Object>> createExcelDataList = new ArrayList<Map<String,Object>>();
		//엑셀 생성 정보 map변수 선언
		Map<String,Object> createExcelData = null;
		//엑셀 다운 함수 선언
		UtilExcelDown createExcelfile = null;
		//시트명 변수 선언
		String sheetName = "";
		String dataType = "";
		System.out.println("데이터 생성전"+(System.currentTimeMillis()-startTime));
		//탭의 갯수만큼 엑셀시트에 저장될 정보를 생성
		for(int i=0; i<data.size(); i++) {
			//시트명 값 세팅
			sheetName = String.valueOf(data.get(i).get("sheetName"));
			dataType =  String.valueOf(data.get(i).get("dataType"));
			//header값 세팅
			if(data.get(i).get("header") != null) {
				header = (ArrayList<Map<String, Object>>)(data.get(i).get("header"));
			}

			//데이터값 세팅
			if(data.get(i).get("dataList") != null) {
				datalist = UtilJson.getJsonArrayFromList((List<?>) data.get(i).get("dataList"));
			}

			//엑셀 정보를 담을 map생성
			createExcelData =  new HashMap<String,Object>();

			//엑셀 정보를 map에 세팅
			createExcelData.put("fileName", jsonfileName);
			createExcelData.put("sheetName", sheetName);
			createExcelData.put("header", header);
			createExcelData.put("dataType", dataType);
			createExcelData.put("dataList", datalist);
			if(null != data.get(i).get("tbData")) {
				tbData = UtilJson.getJsonArrayFromList((List<?>) data.get(i).get("tbData"));
				createExcelData.put("tbData", tbData);
			}
			//엑셀 정보map을 리스트에 추가
			createExcelDataList.add(createExcelData);
		}
		System.out.println("데이터 생성후"+(System.currentTimeMillis()-startTime));
		//엑셀다운 함수를 초기화
		createExcelfile = new UtilExcelDown();
		//물리적 경로에 ExcelFile 생성
		createExcelfile.renderMergedOutputModel(createExcelDataList,request,response);

		//리턴 타입 초기화
		ModelAndView mv = new ModelAndView();

		//리턴값을 세팅
		mv.setViewName("jsonView");

		//이전 이벤트 호출 함수로 리턴
		return mv;
	}

	/**
	 * 브라우저 구분 얻기.
	 *
	 * @param request
	 * @return
	 */
	private String getBrowser(HttpServletRequest request) {
		String header = request.getHeader("User-Agent");
		if (header.indexOf("MSIE") > -1) {
			return "MSIE";
		} else if (header.indexOf("Trident") > -1) { //IE11 문자열 깨짐 방지
			return "Trident";
		} else if (header.indexOf("Chrome") > -1) {
			return "Chrome";
		} else if (header.indexOf("Opera") > -1) {
			return "Opera";
		}
		return "Firefox";
	}

	/**
	 * Disposition 지정하기
	 *
	 * @param filename
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	private void setDisposition(String filename, HttpServletRequest request, HttpServletResponse response) throws Exception {
		String browser = getBrowser(request);
		String dispositionPrefix = "attachment; filename=";
		String encodedFilename = null;

		if (browser.equals("MSIE")) {
			encodedFilename = URLEncoder.encode(filename, "UTF-8").replaceAll("\\+", "%20");
		} else if (browser.equals("Trident")) { // IE11 문자열 깨짐 방지
			encodedFilename = URLEncoder.encode(filename, "UTF-8").replaceAll("\\+", "%20");
		} else if (browser.equals("Firefox")) {
			encodedFilename = "\"" + new String(filename.getBytes("UTF-8"), "8859_1") + "\"";
		} else if (browser.equals("Opera")) {
			encodedFilename = "\"" + new String(filename.getBytes("UTF-8"), "8859_1") + "\"";
		} else if (browser.equals("Chrome")) {
			StringBuffer sb = new StringBuffer();
			for (int i = 0; i < filename.length(); i++) {
				char c = filename.charAt(i);
				if (c > '~') {
					sb.append(URLEncoder.encode("" + c, "UTF-8"));
				} else {
					sb.append(c);
				}
			}
			encodedFilename = sb.toString();
		} else {
			//throw new RuntimeException("Not supported browser");
			throw new IOException("Not supported browser");
		}

		response.setHeader("Content-Disposition", dispositionPrefix + encodedFilename);

		if ("Opera".equals(browser)) {
			response.setContentType("application/octet-stream;charset=UTF-8");
		}
	}

	/**
	 * 서버에 저장된 엑셀 파일에 대하여 다운로드를 제공한다.
	 *
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/excelFileDown.fd")
	public void excelFileDown(HttpServletRequest request, HttpServletResponse response) throws Exception {

		String fileUpload = EgovProperties.getProperty("Globals.upload");
		String fileName = request.getParameter("fileName");

		System.out.println("===>"+fileUpload+fileName);

		File uFile = new File(fileUpload+fileName);

		long fSize = uFile.length();

		if (fSize > 0) {
			String mimetype = "application/x-msdownload";
			response.setContentType(mimetype);
			setDisposition(fileName, request, response);
			BufferedInputStream in = null;
			BufferedOutputStream out = null;
			try {
				in = new BufferedInputStream(new FileInputStream(uFile));
				out = new BufferedOutputStream(response.getOutputStream());

				FileCopyUtils.copy(in, out);
				out.flush();
			} catch (Exception ex) {
				//다음 Exception 무시 처리
				//Connection reset by peer: socket write error
			} finally {
				if (in != null) {
					try {
						in.close();
					} catch (Exception ignore) {
					}
				}
				if (out != null) {
					try {
						out.close();
					} catch (Exception ignore) {
					}
				}

				//파일 다운로드가 끝나면 서버에 생성된 엑셀 파일을 삭제한다.
				File file = new File(fileUpload+fileName);

				if( file.exists() ){
					if(file.delete()){
						System.out.println("엑셀파일삭제 성공");
					}else{
						System.out.println("엑셀파일삭제 실패");
					}
				}else{
					System.out.println("엑셀파일이 존재하지 않습니다.");
				}
			}
		}
	}

	/**
	 * 서버에 저장된 엑셀 파일에 대하여 다운로드를 제공한다.
	 *
	 * @param response
	 * @throws Exception
	 */
	@POST
	@RequestMapping(value = "/reqCollectRest.fd")
	public ModelAndView reqCollectRest(@RequestBody Map<String, Object> jsonData,
			ModelMap model,
			HttpServletResponse response,
			HttpServletRequest req  ) throws Exception {

		String method = String.valueOf(jsonData.get("method"));
		String url = String.valueOf(jsonData.get("url"));

		ObjectMapper mapper = new ObjectMapper();

		List list = UtilCrawling.reqCollectRest(method, url, null);

		//string으로 변환시켜주는작업
		String jsonString = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(list);


		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject("result","success");
		mv.addObject("list", jsonString);

		return mv;
	}

	public void sendREST(String param1,String jsonData)throws Exception {

		//		BufferedReader in = null;
		//		try {
		//			URL obj = new URL("http://localhost:9997/exit"); // 호출할 url
		//			HttpURLConnection con = (HttpURLConnection)obj.openConnection();
		//			con.setRequestMethod("GET");
		//			in = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));
		//			String line;
		//			while((line = in.readLine()) != null) { // response를 차례대로 출력
		//				 System.out.println(line);
		//			}
		//		 } catch(Exception e) {
		//			  e.printStackTrace();
		//		 } finally {
		//			 if(in != null) try { in.close(); } catch(Exception e) { e.printStackTrace(); }
		//
		//		 }
		HttpURLConnection conn = null;
		JSONObject responseJson = null;
		String line = "";
		URL url = new URL("http://localhost:9997/exit");

		conn = (HttpURLConnection) url.openConnection();
		//Request 형식 설정
		conn.setDoOutput(true);
		conn.setRequestMethod("POST");
		conn.setRequestProperty("Content-Type", "application/json");
		conn.setRequestProperty("Accept-Charset", "UTF-8");
		//request에 JSON data 준비
		BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
		//commands라는 JSONArray를 담을 JSONObject 생성
		OutputStream os = conn.getOutputStream();
		os.write(jsonData.getBytes("UTF-8"));
		//request에 쓰기
		os.flush();
		BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
		StringBuilder sb = new StringBuilder();

		while ((line = br.readLine()) != null) {
			sb.append(line);
		}
		conn.disconnect();
	}
}