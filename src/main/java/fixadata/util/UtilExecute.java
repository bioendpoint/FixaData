package fixadata.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.simple.JSONObject;

import fixadata.common.EgovProperties;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UtilExecute  {

	public static HashMap<String,String> py (String[] fieldsArray,String fileName) throws Exception {

		//경로
		String python_path = EgovProperties.getProperty("Globals.python.path");
		String ml_path = EgovProperties.getProperty("Globals.ml.path");
		String csv_path = EgovProperties.getProperty("Globals.csv.path");
		String pyResult_path = EgovProperties.getProperty("Globals.pyResult.path");

		String filePath = csv_path+fileName+".csv";
		String filePath_log = csv_path+fileName+".txt";

		String str = null;
		Process process = null;


		//로지스틱
		if("1".equals(String.valueOf(fieldsArray[0]))){

			String[] cmd = new String[] {python_path, ml_path, "{'read_file': '"+filePath+"','write_path': '"+pyResult_path+"','write_file': '"+fileName+"','isSaveExcel': true,'isSavePng': true,'algorithm_name': 'LogisticRegression','hyper_parameter':{ 'param1': '"+fieldsArray[1]+"', 'param2' : 1.0}}"};

			System.out.println("cmd : 로지스틱");
			System.out.println("{'read_file': '"+filePath+"','write_path': '"+pyResult_path+"','write_file': '"+fileName+"','isSaveExcel': true,'isSavePng': true,'algorithm_name': 'LogisticRegression','hyper_parameter':{ 'param1': '"+fieldsArray[1]+"', 'param2' : 1.0}}");

			process = new ProcessBuilder(cmd).start();


			//군집
		} else if("2".equals(String.valueOf(fieldsArray[0]))){

			String[] cmd = new String[] {python_path, ml_path, "{'read_file': '"+filePath+"','write_path': '"+pyResult_path+"','write_file': '"+fileName+"','isSaveExcel': true,'isSavePng': true,'algorithm_name': 'HDBSCAN','hyper_parameter': 'default'}"};


			System.out.println("cmd : 군집");
			System.out.println("{'read_file': '"+filePath+"','write_path': '"+pyResult_path+"','write_file': '"+fileName+"','isSaveExcel': true,'isSavePng': true,'algorithm_name': 'HDBSCAN','hyper_parameter': 'default'}");


			process = new ProcessBuilder(cmd).start();

			//시계열
		} else if("3".equals(String.valueOf(fieldsArray[0]))){

			String[] cmd = new String[] {python_path, ml_path, "{'read_file': '"+filePath+"','write_path': '"+pyResult_path+"','write_file': '"+fileName+"','isSaveExcel': true,'isSavePng': true,'algorithm_name': 'SARIMAX','hyper_parameter': {'param1': 30}}"};

			System.out.println("cmd : 시계열");
			System.out.println("{'read_file': '"+filePath+"','write_path': '"+pyResult_path+"','write_file': '"+fileName+"','isSaveExcel': true,'isSavePng': true,'algorithm_name': 'SARIMAX','hyper_parameter': {'param1': 30}}");


			process = new ProcessBuilder(cmd).start();

		} else if("4".equals(String.valueOf(fieldsArray[0]))){ // prophet 을 이용한 시계열

			String[] cmd = new String[] {python_path, ml_path, "{'read_file': '"+filePath+"','write_path': '"+pyResult_path+"','write_file': '"+fileName+"','isSaveExcel': true,'isSavePng': true,'algorithm_name': 'prophet','hyper_parameter': {'param1': 10}}"};

			System.out.println("cmd : 시계열");
			System.out.println("{'read_file': '"+filePath+"','write_path': '"+pyResult_path+"','write_file': '"+fileName+"','isSaveExcel': true,'isSavePng': true,'algorithm_name': 'SARIMAX','hyper_parameter': {'param1': 10}}");


			process = new ProcessBuilder(cmd).start();

		}

		// 외부 프로그램의 표준출력 상태 버퍼에 저장
		BufferedReader stdOut = new BufferedReader( new InputStreamReader(process.getInputStream(),  "euc-kr") );

		StringBuffer sb = new StringBuffer();
		JSONObject jsonObj = new JSONObject();

		// 표준출력 상태를 출력
		while( (str = stdOut.readLine()) != null ) {
			log.debug(str);
			sb.append(str);
		}

		String msg = "";
		if(sb.toString().contains("success"))
		{
			msg = "success";
		}
		else
		{
			msg = "fail";
		}

		jsonObj.put("result",msg);
		jsonObj.put("detailMsg",sb.toString());


		HashMap<String,String> resultMap = new HashMap<String,String>();

		String jsonStr = jsonObj.toJSONString();


		File file = new File(filePath_log);

		FileWriter writer = null;

		try {
			// 기존 파일의 내용에 이어서 쓰려면 true를, 기존 내용을 없애고 새로 쓰려면 false를 지정한다.
			writer = new FileWriter(file, true);
			writer.write(jsonStr);
			writer.flush();

			System.out.println("DONE");
		} catch(IOException e) {
			e.printStackTrace();
		} finally {
			try {
				if(writer != null) writer.close();
			} catch(IOException e) {
				e.printStackTrace();
			}
		}

		//  resultMap.put("result",msg);
		//  resultMap.put("detailMsg", sb.toString());

		return resultMap;
	}


	public static String file (ArrayList<String> fieldsTempGet, List<Map<String, Object>> dataList, String fieldVal ) throws Exception {
		/**
		 * csv 파일을 쓰기위한 설정
		 * 설명
		 * D:/R/sample_data.csv : csv 파일저장할 위치+파일명
		 * EUC-KR : 한글깨짐설정을 방지하기위한 인코딩설정(UTF-8로 지정해줄경우 한글깨짐)
		 **/
		String csv_path = EgovProperties.getProperty("Globals.csv.path");
		PrintWriter pw = null;
		StringBuilder sb = null;
		String fileName = "";
		sb = new StringBuilder();

		String dateTime = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());

		if("1".equals(fieldVal)){
			fileName = "Logistic_"+dateTime;
		}else if("2".equals(fieldVal)){
			fileName = "dbScan_"+dateTime;
		}else {
			fileName = "timeSeries_"+dateTime;
		}


		ArrayList<String> fieldTemp = new ArrayList<String>();
		int cnt = 0;
		for(String str :fieldsTempGet)
		{
			if(cnt==1)
			{
				fieldTemp.add("idx");
			}
			fieldTemp.add(str);
			cnt++;

		}

		fieldsTempGet.clear();
		fieldsTempGet = fieldTemp;

		try {


			pw = new PrintWriter(new File(csv_path+fileName+".csv"), "EUC-KR");
			if(fieldsTempGet != null && fieldsTempGet.size() > 0){
				//헤더 생성
				for(int i = 1; i < fieldsTempGet.size(); i++){

					sb.append(fieldsTempGet.get(i));

					if(i == fieldsTempGet.size()-1){

					}else {
						sb.append(",");
					}
				}
				sb.append("\n");
			}

			//데이터
			for(Map<String, Object> m : dataList) {

				for(int i = 1 ; i< fieldsTempGet.size(); i++) {

					if(i ==fieldsTempGet.size() -1) {
						sb.append(m.get(fieldsTempGet.get(i))+"");
					}else {
						sb.append(m.get(fieldsTempGet.get(i))+",");
					}
				}
				sb.append("\n");
			}

			pw.println(sb.toString());
			pw.flush();

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if(pw != null){pw.close();}
			if(sb != null){sb = null;}
		}
		return fileName;

	}
}