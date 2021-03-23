package fixadata.util;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.json.simple.parser.ParseException;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.jayway.jsonpath.JsonPath;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

import fixadata.collect.service.CollectService;
import fixadata.collect.vo.scheduleVO;
import fixadata.common.schelduler.SchedulerService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UtilCrawling {


	public static List reqCollectRest(
			String method
			, String url
			, Map<String,Object> param
			)throws IOException
	{

		String jsonString = reqCollectRestReturnJsonString(method, url, param);

		if(jsonString.substring(0,1).equals("{"))
		{
			jsonString = "["+jsonString+"]";
		}

		if(null!=jsonString)
		{
			List tempList = UtilJson.toListMap(jsonString);
			return tempList;
		}
		return null;
	}

	/**
	 * restapi 호출 후 return json string
	 * @param method
	 * @param url
	 * @param param
	 * @return jsonString
	 * @throws IOException
	 */
	public static String reqCollectRestReturnJsonString(
			String method
			, String url
			, Map<String,Object> param
			) throws IOException
	{

		HttpResponse<JsonNode> list = null;
		try {

			if(method.equals("get"))
			{
				list = Unirest.get(url).queryString(param).asJson();

				return list.getBody().toString();
			}
			else if(method.equals("post"))
			{
				list = Unirest.post(url).queryString(param).asJson();
				return list.getBody().toString();
			}
		}catch(UnirestException ue)
		{
			log.error(ue.getMessage());
			ue.printStackTrace();
		}
		finally {

		}
		return null;
	}

	/**
	 * Test
	 * @param method
	 * @param url
	 * @param selectorList
	 * @return
	 * @throws IOException
	 * @throws UnirestException
	 */
	public static String reqCollectCrawlingTest(
			String method
			, String url
			, List<String> selectorList) throws IOException, UnirestException {

		StringBuffer sb = new StringBuffer();
		method = "get";
		//url = "https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts/pharmedium-issues-voluntary-nationwide-recall-4mg-norepinephrine-bitartrate-16mcgml-added-09-sodium";
		//url = "";

		HttpResponse<String> resultT = Unirest.get(url).asString();

		return resultT.getBody();
	}



	public static String reqCollectCrawling(
			String method
			, String url
			, List<String> selectorList) throws IOException, UnirestException {

		StringBuffer sb = new StringBuffer();
		method = "get";

		Document doc = null;
		Connection.Response response = null;
		Connection connection = null;

		for(int timeOutCnt=1;timeOutCnt<5;timeOutCnt++)
		{
			System.out.println("retry=>"+timeOutCnt);
			int time = timeOutCnt *1*1000;
			try {

				connection = Jsoup.connect(url);
				response = connection.execute();

				if(response.statusCode()==200)
				{
					if(method.toLowerCase().equals("get"))
					{
						doc = connection.get();

						//doc = Jsoup.connect(url).timeout(time).get();
					}
					else if(method.toLowerCase().equals("post"))
					{
						//doc = Jsoup.connect(url).timeout(time).post();
						doc = connection.post();
					}
					break;
				}
			}catch(Exception e) {
				log.error(e.getMessage());
				e.printStackTrace();
			}

			/**if(doc!=null && !"".equals(doc.body().html()))
			{
				break;
			}
			 **/
		}


		if(selectorList!=null && selectorList.size()>0)
		{

			int firstCheck = 0;
			Elements el = new Elements();
			for(String sel:selectorList)
			{
				if(firstCheck==0)
				{
					el = doc.select(sel);
				}
				else
				{
					el = el.select(sel);
				}

			}
			//Elements el = doc.select("#main-content").select("div").select("[role=main]").select("p");

			//el = el.select("div");
			//el = el.select("[role=main]");
			//el = el.select("p");
			if(el.size()>0)
			{
				for(Element e: el)
				{
					if(null!=e.text() && !"".equals(e.text()))
					{
						//System.out.println(e.text());
						sb.append(e.text());
					}
				}
			}
		}
		else
		{
			Element body = doc.body();
			sb.append(body.text());
		}


		List<HashMap<String,Object>> list = new ArrayList<HashMap<String,Object>>();

		/**
		String[] strArray = sb.toString().split(" ");


		for(String str : strArray)
		{
			if(list.size()>0)
			{
				boolean check = false;
				for(HashMap map:list)
				{
					if(map.get("key").equals(str))
					{
						map.put("cnt", Integer.valueOf(String.valueOf(map.get("cnt")))+1);
						check = true;
						break;
					}

				}

				if(check==false)
				{
					HashMap<String,Object> h = new HashMap<String,Object>();

					h.put("key",str);
					h.put("cnt",1);
					list.add(h);
				}
			}
			else
			{
				HashMap<String,Object> h = new HashMap<String,Object>();

				h.put("key",str);
				h.put("cnt",1);
				list.add(h);

			}
		}
		 **/

		return sb.toString();
	}

	/**
	 * 일반 custom path 형식을 json path형식으로 파싱
	 * @param path
	 * @return
	 */


	public static String getPath(String str) {
		StringBuffer sb = new StringBuffer();

		for(int i =0;i<str.split("\\.").length-1;i++) {
			if(i==0)
			{
				sb.append(str.split("\\.")[i]);
			}
			else
			{
				sb.append(".");
				sb.append(str.split("\\.")[i]);

			}
		}
		return sb.toString();
	}

	/**
	 *
	 * @param method get or post
	 * @param url
	 * @param param param....
	 * @param expressionMap 수집식(json path expression)
	 * @param afterPrepField (필드값이 not null or !"".equest( 이면 수행
	 * @param afterPrepStr 추가할 문자열
	 * @param newField 추가 수집한것이 저장될 필드명
	 * @return
	 * @throws IOException
	 */
	public static HashMap<String,Object> reqCollectPrep(
			String method
			, String url
			, Map<String,Object> param
			, LinkedHashMap<String,String> expressionMap
			, String afterPrepOption
			, String afterPrepField
			, String afterPrepStr
			, String newField

			) throws IOException {
		//Map<String,String> param = new HashMap<String,String>();

		String jsonString = UtilCrawling.reqCollectRestReturnJsonString(method,url,param).trim();

		if(jsonString.substring(0,1).equals("{"))
		{
			jsonString = "["+jsonString+"]";
		}

		List<Map<String,Object>> dataList = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> tempList = new ArrayList<Map<String,Object>>();

		HashMap<String,Object> resultMap = new HashMap<String,Object>();

		if(jsonString!=null)
		{

			List<String> HeaderList =new ArrayList<String>();
			List<String> expList = new ArrayList<String>();


			for (String key : expressionMap.keySet()) {
				String value = expressionMap.get(key);
				HeaderList.add(key);
				expList.add(value);
			}
			List<HashMap> list = JsonPath.read(jsonString, UtilCrawling.getPath(expList.get(0)));
			int cnt = 0;
			for(HashMap h:list)
			{
				Map dataMap = new HashMap();
				int i=0;
				for(String expression :expList)
				{
					//idx값을 가지고 있을경우
					if(HeaderList.get(i).equals("idx")) {
						//키값 idx value값 카운팅된 숫자로 바인딩
						dataMap.put(HeaderList.get(i),(cnt+1));
					}else {
						String data = (String) h.get(expression.split("\\.")[expression.split("\\.").length-1]);
						dataMap.put(HeaderList.get(i),data);
					}
					i++;
				}
				cnt++;
				dataList.add(dataMap);
			}


			/**
            int i = 0;
            for(Map m:dataList)
    		{

            	if(i<100)
            	{
            		tempList.add(m);
            	}
            	i++;
    		}
            dataList.clear();
            dataList = tempList;
			 **/


			if(null!=afterPrepOption && !"".equals(afterPrepOption))
			{
				int lineno = 0;
				String crawingurl = "";
				for(Map m:dataList)
				{

					if(afterPrepOption.equals("0"))
					{

						crawingurl = afterPrepStr+String.valueOf(m.get(afterPrepField));

					}
					else if(afterPrepOption.equals("1"))
					{
						crawingurl = afterPrepStr+String.valueOf(m.get(afterPrepField));
					}
					else if(afterPrepOption.equals("")) {
						crawingurl = String.valueOf(m.get(afterPrepField));
					}

					log.debug("lineno =>"+lineno);
					try {

						List<String> selector = new ArrayList<String>();
						selector.add("body");

						String resultCrawling = UtilCrawling.reqCollectCrawling("get",crawingurl,selector);
						//String resultCrawling = reqCollectCrawlingTest("get",crawingurl,null);
						m.put(newField,resultCrawling);

					}
					catch(Exception e) {
						m.put(newField,"");
						log.error("crawling error",e.getMessage());
						e.printStackTrace();
					}
					lineno++;
				}
				HeaderList.add(newField);

			}

			resultMap.put("header",HeaderList);
			resultMap.put("data",dataList);

			return resultMap;
		}
		else
		{
			return null;
		}
	}

	/**
	 *
	 * @param option 0 시간 / 1주기
	 * @param time option 0 => 시분 기준 /1=> 시기준
	 * @return
	 */
	public static String convertCronExpression(String option , String time)
	{
		StringBuffer sb = new StringBuffer();

		sb.append("0");   //초

		if("0".equals(option))
		{
			String hour = time.split(":")[0];
			String min = time.split(":")[1];

			sb.append(" ").append(min); //분
			sb.append(" ").append(hour);
			sb.append(" *"); //일
			sb.append(" *"); //월
			sb.append(" *"); //요일

		}
		else if("1".equals(option))
		{
			String loopexpression = "0/"+time;
			sb.append(" 0"); //분
			sb.append(" "+loopexpression); //시
			sb.append(" *"); //일
			sb.append(" *"); //월
			sb.append(" *"); //요일

		}
		return sb.toString();

	}

	public static void CrawlingProcess(
			String active, int schedule_sn,SchedulerService schedulerServiceImpl,CollectService CollectServiceImpl) throws Exception {

		scheduleVO vo = new scheduleVO();

		//스케줄 정보중 active 값 update처리
		vo.setSchedule_active(active);
		vo.setSchedule_sn(schedule_sn);
		int result2 = CollectServiceImpl.updateScheduleActive(vo);

		//스케쥴러 전체 상태 제거
		schedulerServiceImpl.allRemoveTaskFromScheduler();

		//클릭한 스케줄 정보를 가져옴.
		scheduleVO detail = CollectServiceImpl.selectScheduleDetail(vo);

		//클릭한 스케줄 정보를 가져와서 크롤링 처리 (주기,시간)
		String schedule_time = UtilCrawling.convertCronExpression(detail.getSchedule_term_type(), detail.getSchedule_term());
		schedulerServiceImpl.addTaskToScheduler(1, new Runnable() {
			@Override
			public void run() {
				//시간 세팅을 위한 변수처리
				Calendar calendar = Calendar.getInstance();
				java.util.Date date = calendar.getTime();
				String today = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date));

				//json형태로 저장된 jsonPath,fieldName 정보를 hashMap형태로 리스트 화
				List<HashMap> temppathMap2 = UtilJson.toListMap(String.valueOf(detail.getSchedule_path()));

				//리스트값에서 부터 추려낸 데이터값을 다시 hashMap형태로 데이터를 적재
				LinkedHashMap expressionsMap = new LinkedHashMap<String,String>();

				//기본패스 정보를 분해할 배열을 선언
				String[] str = null;
				//분해된 패스 정보를 추릴 변수 선언
				String createPathData = "";
				//공통된 패스정보를 .단위를 짤라 배열에 저장
				str = String.valueOf(temppathMap2.get(0).get("jsonPath")).split("\\.");
				//0부터 배열의 마지막 이전을 제외하고 수행
				for(int j=0; j<str.length-1; j++) {
					//분해된 패스 정보를 재배열
					createPathData += str[j]+".";
					//.구분자의 마지막의 단어를 버리고 idx값으로 셋팅
					if(j == (str.length-1)-1) {
						createPathData += "idx";
					}
				}
				//idx값에 idx패스값을 가상으로 지정하여 저장
				expressionsMap.put("idx",createPathData);

				//temppathMap2 리스트의 갯수만큼 루프
				for(int i=0; i<temppathMap2.size(); i++) {
					//추려낸 데이터를 하나씩 적재
					expressionsMap.put(temppathMap2.get(i).get("fieldName"),temppathMap2.get(i).get("jsonPath"));

				}

				//크롤링 결과를 담을 map변수
				HashMap pathMap = new HashMap();

				//checkbox값을 뽑아내기위한 임시 map변수
				HashMap temppathMap = new HashMap();
				//스케줄after값을 map형태로 뽑아냄
				temppathMap = UtilJson.toStromgToMap(String.valueOf(detail.getSchedule_after()));

				//크롤링을 위한 변수 초기화
				String afterPrepOption = "";
				String schedule_field = "";
				String schedule_preappend = "";
				String schedule_prinput = "";
				String schedule_newinput = "";


				//스케줄 패스 정보가 있고, 후처리 체크박스가 v체크 된것이라면  아래를 수행
				if(null!=detail.getSchedule_path() && temppathMap.get("schedule_checkbox").equals("1")) {
					afterPrepOption="0";
					pathMap = UtilJson.toStromgToMap(String.valueOf(detail.getSchedule_after()));
					schedule_field 		= String.valueOf(pathMap.get("schedule_field"));
					schedule_preappend 	= String.valueOf(pathMap.get("schedule_preappend"));
					schedule_prinput 	= String.valueOf(pathMap.get("schedule_prinput"));
					schedule_newinput 	= String.valueOf(pathMap.get("schedule_newinput"));
				}


				try {
					HashMap<String,Object> testObj = UtilCrawling.reqCollectPrep(
							"get"
							,detail.getSchedule_url()
							,null
							, expressionsMap
							, afterPrepOption
							, schedule_field
							, schedule_prinput
							, schedule_newinput);

					try {
						int scheduleData_result = CollectServiceImpl.insertScheduleProjectData(testObj,schedule_sn);
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}

				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		},schedule_time);
	}


	public static void main(String[] args) throws IOException, ParseException, UnirestException
	{
		String result = convertCronExpression("0", "10:02");
		/**
		System.out.println(result);

		String crawingurl = "https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts/nuway-distributors-llc-issues-voluntary-worldwidenationwide-recall-apexxx-due-presence-undeclared";
		List<String> selector = new ArrayList<String>();
		selector.add("body");

		String resultCrawling = UtilCrawling.reqCollectCrawling("get",crawingurl,selector);

		System.out.println(resultCrawling);
		 **/


		LinkedHashMap<String,String> expressionMap = new LinkedHashMap<String,String>();

		expressionMap.put("path", "$.[*].path");
		expressionMap.put("field_change_date_2", "$.[*].field_change_date_2");
		expressionMap.put("field_recall_reason_description", "$.[*].field_recall_reason_description");
		expressionMap.put("field_company_name", "$.[*].field_company_name");


		HashMap<String,Object> testObj = UtilCrawling.reqCollectPrep(
				"get"
				,"https://www.fda.gov/files/api/datatables/static/recalls-market-withdrawals.json?_=1590730531143"
				,null
				,expressionMap
				,"1"
				,"path"
				,"https://www.fda.gov"
				, "newfield");


		/**
		String method
			, String url
			, Map<String,Object> param
			, Map<String,String> expressionMap
			, String afterPrepOption
			, String afterPrepField
			, String afterPrepStr
			, String newField

		 **/


		/**

		Map<String,String> expressionMap = new HashMap<String,String>();


		expressionMap.put("path", "$.[*].path");
		expressionMap.put("field_change_date_2", "$.[*].field_change_date_2");
		expressionMap.put("field_recall_reason_description", "$.[*].field_recall_reason_description");
		expressionMap.put("field_company_name", "$.[*].field_company_name");


		HashMap<String,Object> testObj = UtilCrawling.reqCollectPrep(
					"get"
					,"https://www.fda.gov/files/api/datatables/static/recalls-market-withdrawals.json?_=1590730531143"
					,null
					,expressionMap
					,"preappend"
					,"path"
					,"https://www.fda.gov"
					, "newfield");


		String STRING_ARRAY_SAMPLE = "d:/string-array-sample.csv";

		Writer writer = Files.newBufferedWriter(Paths.get(STRING_ARRAY_SAMPLE));

		CSVWriter csvWriter = new CSVWriter(writer,
                CSVWriter.DEFAULT_SEPARATOR,
                CSVWriter.DEFAULT_QUOTE_CHARACTER,
                CSVWriter.DEFAULT_ESCAPE_CHARACTER,
                CSVWriter.DEFAULT_LINE_END);


		List<String> header = (List<String>) testObj.get("header");
		List<HashMap> list = (List<HashMap>) testObj.get("data");


		csvWriter.writeNext(header.stream().toArray(String[]::new));
		csvWriter.flush();
		for(HashMap h : list)
		{
			String[] newStringArray = new String[header.size()];
			int cnt=0;
			for(String headerField: header)
			{
				newStringArray[cnt] =(String) h.get(headerField);
				cnt++;
			}

			csvWriter.writeNext(newStringArray);
		}
		 **/
		/**

		 //div [role=main] p

		List<String> selectoList = new ArrayList<String>();

		selectoList.add("#main-content");
		selectoList.add("div");
		selectoList.add("[role=main]");
		selectoList.add("p");

		Map<String,String> param = new HashMap<String,String>();

		String jsonString = UtilCrawling.reqCollectRestReturnJsonString("get","https://www.fda.gov/files/api/datatables/static/recalls-market-withdrawals.json?_=1590730531143",null);

		//jsonString = "{\"text1\":\"1\",\"test2\":2,\"list\":[{\"list1-1\":\"1-1\",\"list1-2\":\"1-2\"},{\"list2-1\":\"2-1\",\"list2-2\":\"2-2\"}],\"list2\":[{\"kkk\":\"kkk1\",\"kkk2\":\"kkk2\"}]}";

		List<Map<String,Object>> result = new ArrayList<Map<String,Object>>();

		//param.put("path111","$.[*].path");
		//param.put("field_change_date_2","$.[*].field_change_date_2");
		//param.put("field_recall_reason","$.[*].field_recall_reason");


		if(jsonString!=null)
		{
			List<String> HeaderList =new ArrayList<String>();
			List<String> expList = new ArrayList<String>();
			String json_path = "";
			for (String key : param.keySet()) {
	            String value = (String) param.get(key);
	            HeaderList.add(key);
	            expList.add(value);
			}

            List<HashMap> list = JsonPath.read(jsonString, UtilCrawling.getPath(expList.get(0)));

            for(HashMap h:list)
            {
            	Map dataMap = new HashMap();
            	int i=0;
            	for(String expression :expList)
            	{
            		String data = (String) h.get(expression.split("\\.")[expression.split("\\.").length-1]);
            		dataMap.put(HeaderList.get(i),data);
            		i++;
            	}
            	result.add(dataMap);
            }

		}
		else
		{

		}
		 **/
	}
}