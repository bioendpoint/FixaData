package fixadata.outlier;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.POST;

import org.apache.commons.compress.utils.IOUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Drawing;
import org.apache.poi.ss.usermodel.Picture;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.univocity.parsers.common.record.Record;
import com.univocity.parsers.csv.CsvParser;
import com.univocity.parsers.csv.CsvParserSettings;

import fixadata.collect.mapper.CollectMapper;
import fixadata.collect.service.CollectService;
import fixadata.collect.vo.baseDataVO;
import fixadata.collect.vo.tbProjectDataVO;
import fixadata.common.EgovProperties;
import fixadata.common.commonVO.jsonResultVO;
import fixadata.prep.service.PrepService;
import fixadata.util.UtilExecute;
import fixadata.util.UtilFiles;
import fixadata.util.UtilImage;
import fixadata.util.UtilRun;
import fixadata.util.UtilSession;
import fixadata.util.UtilString;
import lombok.extern.slf4j.Slf4j;

/**
 * @author Tom.DongHyuk (bioendpoint@gmail.com)
 * rule 관련
 */
@Slf4j
@RequestMapping("/outlier")
@Controller
public class OutlierController {


	@Resource(name="collectMapper")
	private CollectMapper CollectMapper;

	@Autowired
	CollectService CollectServiceImpl;


	@Autowired
	PrepService PrepServiceImpl;

	private boolean csvreading_check;

	/**
	 * 워크블로우 설정 및 기동화면
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@GET
	@RequestMapping(value = "/workflow.fd")
	public String workflow(
			ModelMap model
			, @ModelAttribute("searchVO") tbProjectDataVO searchVO
			, HttpServletRequest req
			, HttpServletResponse rsp

			) throws Exception {

		// 데이터 준비를 위한 PROJECT_SN 및 PROJECT_DATA_SN 준비
		if(searchVO.getProject_data_sn()<=0 && searchVO.getProject_sn()<=0)
		{
			searchVO.setProject_sn(Integer.valueOf(String.valueOf(UtilSession.getAttribute("SESSION_PROJECT_SN"))));
			searchVO.setProject_data_sn(Integer.valueOf(String.valueOf(UtilSession.getAttribute("SESSION_PROJECT_DATA_SN"))));
		}

		return "outlier/workflow";
	}

	/**
	 * workflow 초기 데이터 로드 기능
	 * @param model
	 * @param searchVO
	 * @param req
	 * @param rsp
	 * @param mv
	 * @return
	 * @throws Exception
	 */
	@GET
	@RequestMapping(value = "/loadData.fd")
	public ModelAndView loadData(
			ModelMap model
			, @ModelAttribute("searchVO") tbProjectDataVO searchVO
			, HttpServletRequest req
			, HttpServletResponse rsp
			, ModelAndView mv
			) throws Exception {

		// 데이터 준비를 위한 PROJECT_SN 및 PROJECT_DATA_SN 준비
		if(searchVO.getProject_data_sn()<=0 && searchVO.getProject_sn()<=0)
		{
			searchVO.setProject_sn(Integer.valueOf(String.valueOf(UtilSession.getAttribute("SESSION_PROJECT_SN"))));
			searchVO.setProject_data_sn(Integer.valueOf(String.valueOf(UtilSession.getAttribute("SESSION_PROJECT_DATA_SN"))));
		}

		tbProjectDataVO dataDetail = PrepServiceImpl.selectLoadData(searchVO);

		jsonResultVO result = new jsonResultVO();

		Gson gson = new Gson();
		List<HashMap> dataList = gson.fromJson(dataDetail.getData(), new TypeToken<List<LinkedHashMap>>() {}.getType());
		ArrayList<String> headerList = gson.fromJson(dataDetail.getHeader(), new TypeToken<ArrayList<String>>() {}.getType());

		result.setData(dataList);
		result.setHeader(headerList);

		mv.setViewName("jsonView");
		mv.addObject("result",result);

		return mv;

	}

	/**
	 * work플로우 기동
	 * @param model
	 * @param searchVO
	 * @param req
	 * @param rsp
	 * @param mv
	 * @return
	 * @throws Exception
	 */
	@POST
	@RequestMapping(value = "/run.fd")
	public ModelAndView run(
			ModelMap model
			, @RequestBody Map<String, Object> jsonData
			, HttpServletRequest req
			, HttpServletResponse rsp
			, ModelAndView mv
			) throws Exception {

		long startTime = System.currentTimeMillis();
		int project_sn = Integer.valueOf(String.valueOf(jsonData.get("project_sn")));
		int project_data_sn = Integer.valueOf(String.valueOf(jsonData.get("project_data_sn")));
		int dbsave = Integer.valueOf(String.valueOf(jsonData.get("dbsave")));
		String callback = String.valueOf(jsonData.get("callback"));
		String userAuth = (String) UtilSession.getAttribute("SESSION_USER_AUTH");

		//rule set 에서 알존재 여부 체크
		boolean rcheck = false;
		Map rMap = new HashMap();

		List<Map<String,Object>> dataList = (List<Map<String, Object>>) jsonData.get("dataList");
		ArrayList<HashMap> ruleList = (ArrayList<HashMap>) jsonData.get("ruleSet");

		List<Map<String,Object>> resultArray = new ArrayList<Map<String,Object>>();
		ArrayList<Map<String, Object>> list = new ArrayList<Map<String,Object>>();
		ArrayList<Map<String, Object>> cleanArrayList = new ArrayList<Map<String, Object>>();
		ArrayList<Map<String, Object>> eraserArrayList = new ArrayList<Map<String, Object>>();
		ArrayList<Map<String, Object>> reasonDataArrayList = new ArrayList<Map<String, Object>>();


		baseDataVO basevo = new baseDataVO();
		basevo.setFlag(2);
		List<baseDataVO> codeCompareList = null;


		log.debug("파싱완료");
		log.debug(String.valueOf(startTime-System.currentTimeMillis()));
		for(HashMap h:ruleList)
		{
			String type = String.valueOf(h.get("type"));

			if(!"03".equals(type) && !"05".equals(type))
			{

				ArrayList<String> fieldsTemp 	= (ArrayList<String>) h.get("field");
				int rule_sn 					= Integer.valueOf(String.valueOf(h.get("rule_sn")));
				String rule_string 				= String.valueOf(h.get("rule_string"));
				String rule_name 				= String.valueOf(h.get("rule_name"));
				String rule_opt 				= String.valueOf(h.get("rule_opt"));
				String[] fieldsArray 			= fieldsTemp.stream().toArray(String[]::new);

				Map<String,Object> resultMap = new HashMap<String,Object>();
				List<HashMap> rule_array = null;
				if("40".equals(type) || "50".equals(type))
				{
					rule_array 		= (List<HashMap>) h.get("rule_string");
				}

				Map<String, Object> result = null;
				if("20".equals(type)) //유무 체크
				{
					result = UtilString.whether(rule_string, fieldsArray, dataList,rule_opt);
				}
				else if("30".equals(type)) //범위 체크
				{
					result = UtilString.range(rule_string, fieldsArray, dataList,rule_opt);
				}
				else if("40".equals(type))
				{
					result = UtilString.LogicalSyntax(rule_array, fieldsArray, dataList,rule_opt);
				}
				else if("50".equals(type))
				{
					result = UtilString.CustomSyntax(rule_array, fieldsArray, dataList,rule_opt);
				}
				else if("60".equals(type))
				{
					//최초 한번만 실행
					if(codeCompareList==null)
					{
						codeCompareList= CollectServiceImpl.selectStandardList(basevo);
					}
					result = UtilString.CodeCompare(codeCompareList, fieldsArray, dataList,"1");
				}
				else if("70".equals(type))
				{
					result = UtilString.DateValidation(rule_string, fieldsArray, dataList,rule_opt);

				}
				else if("80".equals(type))
				{

					result = UtilString.cloudword(rule_string, fieldsArray, dataList,rule_opt);

				}

				else
				{
					//^[a-zA-Z]*$
					result = UtilString.regexp(rule_string, fieldsArray, dataList,rule_opt);

				}


				if(null!=result.get("cleanData"))
				{
					cleanArrayList = (ArrayList<Map<String, Object>>) result.get("cleanData");
				}

				if(null!=result.get("eraserData"))
				{
					eraserArrayList = (ArrayList<Map<String, Object>>) result.get("eraserData");
				}
				if(null!=result.get("reasonData"))
				{
					reasonDataArrayList = (ArrayList<Map<String, Object>>) result.get("reasonData");
				}


				log.info("cleanArrayList size = "+ cleanArrayList.size());
				log.info("eraserArrayList size = "+ eraserArrayList.size());
				log.info("reasonDataArrayList size = "+ reasonDataArrayList.size());


				dataList = cleanArrayList;

				resultMap.put("type",type);
				resultMap.put("rule_string",rule_string);
				resultMap.put("rule_opt",rule_opt);
				resultMap.put("rule_sn",rule_sn);
				resultMap.put("rule_name", rule_name);
				resultMap.put("field", fieldsTemp);
				resultMap.put("result", result);

				resultArray.add(resultMap);
			}
			else if("03".equals(type))
			{
				rMap  = h;
				rcheck = true;
			}
		}

		//R에 대한 처리 수행
		if(rcheck==true)
		{
			if(callback == "false") {

				Map<String, Object> saveJson = new HashMap<String,Object>();
				ArrayList<String> fieldsTempGet = null ;
				String fieldVal = String.valueOf(rMap.get("field")).split(",")[0].substring(1);

				//R 정보 셋팅
				for(HashMap h:ruleList){

					if("03".equals(h.get("type"))) {

						String type = String.valueOf(h.get("type"));
						ArrayList<String> fieldsTemp 	= (ArrayList<String>) h.get("field");
						int rule_sn 					= Integer.valueOf(String.valueOf(h.get("rule_sn")));
						String rule_string 				= String.valueOf(h.get("rule_string"));
						String rule_name 				= String.valueOf(h.get("rule_name"));
						int rule_opt 					= Integer.valueOf(String.valueOf(h.get("rule_opt")));
						String[] fieldsArray 			= fieldsTemp.stream().toArray(String[]::new);
						//csv 파일 생성
						String fileName = UtilExecute.file (fieldsTemp, dataList , fieldVal);

						//파이썬 실행
						//HashMap<String,String> execuiteMap = UtilExecute.py(fieldsArray ,fileName);

						Runnable processPy = new UtilRun(fieldsArray, fileName);


						Thread th = new Thread(processPy);
						th.start();


						//resultMap.put("result",msg);
						//resultMap.put("detailMsg", sb.toString());

						Map<String,Object> resultMap = new HashMap<String,Object>();

						resultMap.put("type",type);
						resultMap.put("rule_string",rule_string);
						resultMap.put("rule_opt",rule_opt);
						resultMap.put("rule_sn",rule_sn);
						resultMap.put("rule_name", rule_name);
						resultMap.put("field", fieldsTemp);
						resultMap.put("fieldVal", fieldVal);
						resultMap.put("fileName", fileName);
						resultMap.put("execuite", "ing");
						resultMap.put("execuiteDetail", "");

						resultMap.put("result", dataList);
						fieldsTempGet = fieldsTemp;

						resultArray.add(resultMap);

						saveJson.put("Rdata", resultArray);

					}
				}
			}
		}

		//0 관리자 , 2 기업 일경우 이상치 검출 결과 통계 TAB 기능
		if(!"1".equals(userAuth)) {

			Map<String,Object> resultMap = new HashMap<String,Object>();

			baseDataVO searchVO = new baseDataVO();

			searchVO.setFlag(0);

			List<baseDataVO> standardList = CollectServiceImpl.selectStandardList(searchVO);

			HashMap stastisMap = new HashMap();

			stastisMap.put("standardList", standardList);
			stastisMap.put("eraserData", dataList);

			String[] s_array = {"통계"};
			//엑셀 오류 나는거  체크
			resultMap.put("type","04");
			resultMap.put("rule_string","statistics");
			resultMap.put("rule_opt",0);
			resultMap.put("rule_sn",0);
			resultMap.put("rule_name", "통계");
			resultMap.put("field", s_array);
			resultMap.put("result", stastisMap);

			resultArray.add(resultMap);
		}

		log.debug("프로세스 완료 시간");
		log.debug(String.valueOf(System.currentTimeMillis()-startTime));

		mv.setViewName("jsonView");
		mv.addObject("result",resultArray);

		return mv;
	}


	@POST
	@RequestMapping(value="/getStatisFile.fd")
	public ModelAndView getStatisFile(HttpServletRequest req , HttpServletResponse res ,@RequestParam("fileNm") String fileNm ,
			@RequestParam("fieldVal") String fieldVal ,Map<String, Object> model)throws IOException {

		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		if("".equals(fileNm) && fileNm == null) {

			mv.addObject("result","fail");

		}else {

			String pyResult_path = EgovProperties.getProperty("Globals.pyResult.path");

			String realFile = pyResult_path+fileNm+".csv";
			String realImgFile = pyResult_path+fileNm+".png";
			String fileName = fileNm+".xlsx";

			BufferedOutputStream out = null;
			InputStream in = null;


			File file = new File(realFile);


			jsonResultVO result = new jsonResultVO();

			List<HashMap> list = new ArrayList();
			ArrayList<String> header = new ArrayList();
			ArrayList<String> header2 = new ArrayList();

			CsvParserSettings csvSettings;
			csvSettings = new CsvParserSettings();
			csvSettings.setMaxCharsPerColumn(1024 * 128);
			csvSettings.setHeaderExtractionEnabled(true);
			csvSettings.setLineSeparatorDetectionEnabled(true);

			CsvParser parser = new CsvParser(csvSettings);

			String[] headers;
			String[] headers_temp;


			BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(file),"EUC-KR"));


			parser.beginParsing(br);
			headers = parser.getRecordMetadata().headers();
			int chk = 0;


			for(int i=0; i<headers.length; i++) {
				if(null==headers[i] || "".equals(headers[i]) || "null".equals(headers[i]))
				{
					header.add("num_idx");

				}
				else
				{
					header.add(headers[i]);
				}
			}

			//System.out.println(header);

			Record record = null;
			ArrayList arr = new ArrayList<>();
			HashMap<String, Object> map = null;
			int rowNum = 0;
			int recore_cnt = 0;
			int null_cnt =0;
			int cnt = 0;


			while ((record = parser.parseNextRecord()) != null) {

				map = new HashMap<>();
				int idx = 0;
				for(String field:header)
				{

					if(null==field || "null".equals(field))
					{
						String v2	 = record.getValue(idx, "");
						map.put("num_idx", v2);
						idx++;
					}
					else
					{
						String v2	 = record.getValue(idx, "");
						map.put(field, v2);
						idx++;
					}

				}

				list.add(map);
			}

			//System.out.println(list.get(0));
			//System.out.println(list);


			for(String str:header)
			{
				if(null!=str)
				{
					header2.add(str);
				}
			}



			FileOutputStream fileoutputStream = null;

			try {
				Workbook xlsxWb = new XSSFWorkbook();
				Sheet sheet  ;

				for(int i=0; i<1; i++) {

					// *** Sheet-------------------------------------------------
					sheet = xlsxWb.createSheet( String.valueOf(fileNm));
					// Sheet 생성

					Row row = null;
					Cell cell = null;
					int rowNo = 0;
					//----------------------------------------------------------
					if(null != header2) {
						// 첫 번째 줄
						row = sheet.createRow(rowNo++);

						//헤더 리스트
						for(int j= 0 ; j < header2.size(); j++) {
							cell = row.createCell(j);
							cell.setCellValue(String.valueOf(header2.get(j)));
						}
					}

					//데이터 리스트
					int count = 1;
					int cellCnt = 0;
					int count2 = 0 ;


					//데이터 수 만큼 반복 수행
					for(int k=0;k<list.size();k++){
						//순차적 시트 row생성
						row = sheet.createRow(count);
						//데이터값 맵형태로 초기화
						Map<String ,Object> maps = list.get(k);

						//엑셀 헤더라인을 생성
						for(int l= 0 ; l < header2.size(); l++) {
							cell = row.createCell(cellCnt++);
							cell.setCellValue(""+maps.get(String.valueOf(header2.get(l))).toString());
						}

						cellCnt = 0;
						count2 = count++;
					}
				}


				File f = new File(realImgFile);

				//이미지가 존재할때
				if(f.exists()) {

					InputStream inputStream = new FileInputStream(realImgFile);

					UtilImage.saveImage(inputStream,1024,f,"png");

					Thread.sleep(100);
					inputStream = new FileInputStream(realImgFile);

					byte[] bytes = IOUtils.toByteArray(inputStream);
					int pictureIdx = xlsxWb.addPicture(bytes, Workbook.PICTURE_TYPE_PNG);
					inputStream.close();

					CreationHelper helper = xlsxWb.getCreationHelper();
					sheet = xlsxWb.createSheet("image_sheet");
					Drawing drawing = sheet.createDrawingPatriarch();

					ClientAnchor anchor = helper.createClientAnchor();

					// 이미지를 출력할 CELL 위치 선정
					anchor.setCol1(1);
					anchor.setRow1(2);

					// 이미지 그리기
					Picture pict = drawing.createPicture(anchor, pictureIdx);

					// 이미지 사이즈 비율 설정
					pict.resize();
				}
				res.setContentType("application/vnd.ms-excel");

				//실서버 적용시 globals.properties에서 파일 업로드 위치 경로를 변경해줘야 한다.
				String fileUpload = EgovProperties.getProperty("Globals.upload");
				File derectory = new File(fileUpload);

				//해당 결로에 폴더가 없다면 생성
				if(!derectory.isDirectory()) {
					derectory.mkdir();
				}
				//엑셀 파일을 생성
				File xlsFile = new File(fileUpload+fileName);
				fileoutputStream  =  new FileOutputStream(xlsFile);
				xlsxWb.write(fileoutputStream);

			} catch (Exception e) {
				e.printStackTrace();
			}finally {
				if (fileoutputStream != null) {
					try {
						fileoutputStream.close();
					} catch (Exception ignore) {

					}
				}

			}
			mv.addObject("fileName",fileName);
			mv.addObject("result","success");
		}

		return mv;
	}


	@GET
	@GetMapping(value="/getpdfFile.fd")
	public void getpdfFile(
			HttpServletRequest req
			, HttpServletResponse res
			)throws IOException
	{
		String pdf_path = EgovProperties.getProperty("Globals.pdf.path");


		String fileName = "manual.pdf";
		String ext = "pdf";


		BufferedOutputStream out = null;
		InputStream in = null;

		try {
			res.setContentType("image/" + ext);
			res.setHeader("Content-Disposition", "inline;filename=" + fileName);
			File file = new File(pdf_path);
			if(file.exists()){
				in = new FileInputStream(file);
				out = new BufferedOutputStream(res.getOutputStream());
				int len;
				byte[] buf = new byte[512];
				while ((len = in.read(buf)) > 0) {
					out.write(buf, 0, len);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if(out != null){ out.flush(); }
			if(out != null){ out.close(); }
			if(in != null){ in.close(); }
		}
	}

	@GET
	@GetMapping(value="/imageload.fd", produces = MediaType.IMAGE_JPEG_VALUE)
	public void getImageWithMediaType(
			HttpServletRequest req
			, HttpServletResponse res
			,@RequestParam("fileNm") String fileNm
			,@RequestParam("fieldVal") String fieldVal
			)throws IOException
	{

		String pyResult_path = EgovProperties.getProperty("Globals.pyResult.path");

		String realFile = pyResult_path+fileNm+".png";
		String fileName = fileNm+".png";
		String ext = "png";


		BufferedOutputStream out = null;
		InputStream in = null;

		try {
			res.setContentType("image/" + ext);
			res.setHeader("Content-Disposition", "inline;filename=" + fileName);
			File file = new File(realFile);
			if(file.exists()){
				in = new FileInputStream(file);
				out = new BufferedOutputStream(res.getOutputStream());
				int len;
				byte[] buf = new byte[512];
				while ((len = in.read(buf)) > 0) {
					out.write(buf, 0, len);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if(out != null){ out.flush(); }
			if(out != null){ out.close(); }
			if(in != null){ in.close(); }
		}
	}


	@RequestMapping(value="/fileCheck.fd")
	public ModelAndView fileCheck(@RequestParam("fileName") String fileNm ,@RequestParam("fieldVal") String fieldVal , ModelAndView mv )throws IOException {
		String result = "";
		String contents = "";
		String result_csv = "";
		jsonResultVO resultcsv = null;
		try {
			String csv_path = EgovProperties.getProperty("Globals.csv.path");
			String excute_result = EgovProperties.getProperty("Globals.pyResult.path");

			String realFile = csv_path+fileNm+".txt";

			JSONParser parser = new JSONParser();
			JSONObject jsonObject2 = new JSONObject();


			File file = new File(realFile);
			boolean isExists = file.exists();
			this.csvreading_check = false;



			if(isExists) {

				Object obj = parser.parse(new FileReader(realFile));
				JSONObject jsonObject = (JSONObject) obj;

				result = jsonObject.get("result").toString();
				contents = jsonObject.get("detailMsg").toString();

				String realFile2 = excute_result+fileNm+".csv";

				InputStream is = new FileInputStream(new File(realFile2));

				resultcsv = UtilFiles.csvparse2(is);

				this.csvreading_check = true;

			} else {
				result = "ing";
			}
		}
		catch(Exception e)
		{
			log.error(e.getMessage());
			e.printStackTrace();
		}

		mv.setViewName("jsonView");
		mv.addObject("contents",contents);
		mv.addObject("result",result);

		if(this.csvreading_check) {
			mv.addObject("csv",resultcsv.getData());
		}

		return mv;
	}
}