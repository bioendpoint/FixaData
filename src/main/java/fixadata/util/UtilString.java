package fixadata.util;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;

import fixadata.collect.vo.baseDataVO;
import lombok.extern.slf4j.Slf4j;
import net.objecthunter.exp4j.Expression;
import net.objecthunter.exp4j.ExpressionBuilder;

//import java.util.regex.Matcher;
//import java.util.regex.Pattern;

@Slf4j
public class UtilString {

	/**
	 * 소문자로 변환
	 * @param str
	 * @return
	 */
	public static String lowerCase(String str){
		if(str==null) return null;
		return str.trim().toLowerCase();
	}

	/**
	 * 대문자로 변환
	 * @param str
	 * @return
	 */
	public static String upperCase(String str){
		if(str==null) return null;
		return str.trim().toUpperCase();
	}


	/**
	 * 첫글자를 대문자로 변경하는 함수
	 * @param str
	 * @return
	 */
	public static String firstLetterUpperCase(String str){
		if(str==null){ return null; }
		if(str.equals("")){ return ""; }
		return str.substring(0, 1).toUpperCase()+str.substring(1);
	}

	/**<pre>
	 * 해당 문자를 해당 길이로 나타낼 때 길이보다 작을 경우 exp 문자로 대체
	 * ex) lpad("1",3,"0") => 001
	 * 단, 해당 문자의 길이보다 len이 작을 때는 전체 str을 반환한다.
	 * @param str
	 * @param len : 단일 문자
	 * @param exp
	 * @return
	 * </pre>
	 */
	public static String lpad(String str, String word, int len){
		if(word.length()<1) return null;
		int strLen = str.length();
		if(strLen>=len) return str;

		String temp = "";
		for(int i = 0; i< len-strLen; i++){
			temp += word;
		}
		return temp+str;
	}

	/**
	 * 들어오는 문자를 null을 고려하여 공백제거 처리
	 * @param lineFlag
	 * @return
	 */
	public static String trim(String str) {
		if(str==null) return null;
		return str.trim();
	}

	/**
	 * 문자열의 값이 null이거나 공백("")일 경우만 false
	 * 값이 있는 경우 true 반환하는 함수
	 * @param str
	 * @return
	 */
	public static boolean isNotEmpty(String str){
		if(str==null || str.equals("")) return false;
		return true;
	}

	/**
	 * Null을 고려한 toString()
	 * @param obj
	 * @return
	 */
	public static String toString(Object obj){
		if(obj==null){
			return null;
		}else{
			return obj.toString();
		}
	}

	/**
	 * 숫아형인지에 대한 체크
	 * @param str
	 * @return 숫자일 경우 return true 아닐 경우 false
	 */
	public static boolean isNumberChk(String str){
		try{
			Double.parseDouble(str);
			return true;
		} catch(Exception e){
			return false;
		}
	}


	/**
	 * 정규식의 정상유무 체크
	 * @param regexp
	 * @return
	 */
	public static boolean regexpTest(String regexp, String value)
	{
		boolean result = true;

		Pattern p = Pattern.compile(regexp);
		Matcher m = p.matcher(value);
		if(!m.find())
		{
			result = false;
		}
		return result;
	}


	/**
	 * 해당 리스트의 field값에 해당하는 것이 value와 비교했을대 의 존재 여부 확인
	 * @param compare
	 * @param field
	 * @param value
	 * @return 만약 comare리스트에 해당 하는 값이있을때 true 아닐때는 false
	 */
	public static boolean ListCompare(List<Map> compare, String field, String value)
	{
		boolean result = false;
		for(Map m: compare)
		{
			if(String.valueOf(m.get(field)).equals(value))
			{
				result = true;
				break;
			}
		}
		return  result;
	}

	/**
	 * 코드 비교
	 * @param rule_array
	 * @param field
	 * @param data
	 * @param option
	 * @return
	 * @throws Exception
	 */
	public static Map<String, Object> CodeCompare(List<baseDataVO> codeCompareList, String[] field, List<Map<String,Object>> data, String option) throws Exception
	{

		long startTime = System.currentTimeMillis();
		baseDataVO compareData = new baseDataVO();
		Gson gson = new Gson();


		List<Map> cleanDataList = new ArrayList<Map>();
		List<Map> eraserDataList = new ArrayList<Map>();
		List<Map> compareDataList = new ArrayList<Map>();
		/**
		 * 삭제이유
		 */
		List<HashMap> reasonDataList = new ArrayList<HashMap>();
		Map<String, Object> resultMap = new HashMap<String,Object>();


		if(codeCompareList.size()>0)
		{
			compareData = codeCompareList.get(0);
			compareData.getStrd_header();
			compareData.getUse_yn();
			compareDataList = gson.fromJson(compareData.getData(), new TypeToken<List<LinkedHashMap>>() {}.getType());
		}


		//선택된 필드값

		if(null!=data && data.size()>0)
		{
			for(int i=0;i<data.size();i++)
			{

				boolean isdetecting = true;
				Map<String,Object> m = data.get(i);
				HashMap reasonMap = new HashMap();
				//field 정보 초기화


				boolean reasonCheck = false;
				reasonMap.put("idx", Integer.valueOf(String.valueOf(m.get("idx"))));
				for(int j=0;j< field.length;j++)
				{
					String v = String.valueOf(m.get(field[j]));
					reasonMap.put(field[j], 0);
					reasonMap.put(field[j]+"_reason", "");

				}

				for(int j=0;j< field.length;j++)
				{
					String v = String.valueOf(m.get(field[j]));
					boolean result;
					boolean compareresult;

					compareresult = ListCompare(compareDataList, compareData.getStrd_header(), v);

					if(Integer.parseInt(option)==0)
					{
						if(compareresult==true)
						{
							result = false;

						}
						else
						{
							result = true;
						}
					}
					else
					{
						result = compareresult;
					}

					if(result==false)
					{
						reasonCheck = true;
						reasonMap.put(field[j],1);
						reasonMap.put(field[j]+"_reason",v);
					}


					if(isdetecting==true)
					{
						isdetecting = result;
					}

				}

				if(reasonCheck==true)
				{
					reasonDataList.add(reasonMap);
				}

				if(isdetecting==true)
				{
					cleanDataList.add(m);

				}
				else
				{
					eraserDataList.add(m);
				}
			}

			resultMap.put("cleanData", cleanDataList);
			resultMap.put("eraserData", eraserDataList);
			resultMap.put("reasonData", reasonDataList);

		}
		else
		{
			resultMap.put("cleanData", cleanDataList);
			resultMap.put("eraserData", eraserDataList);
			resultMap.put("reasonData", reasonDataList);
		}

		long estimatedTime = System.currentTimeMillis() - startTime;

		log.debug("성능측정 : "+estimatedTime);

		return resultMap;
	}


	/**
	 *
	 * @param regexp : String
	 * @param field: String
	 * @param data : List<HashMap<String,Object>>
	 * @param option 0=> 해당 정규식에 해당하는것을 eraserData 데이터에 추가, 그외의 값은 cleanData에 적제, option 1=> 해당 정규식에 해당하지않는것 eraserData 데이터에 추가, 그외의 값은 cleanData에 적제
	 *
	 *
	 * @return
	 *<pre>
	 *	Map key(cleanData): 해당 정규식에 의애헛 처리된 데이터
	 *	Map key(eraserData): 정규식에 의해서 삭제된 데이터 리스트
	 *</pre>
	 *@see
	 *<pre>
	 *@param regexp 정규식 기준에 부합하지 않는 값들은 eraserData에 추가하는 방식으로 동작함
	 *</pre>
	 *
	 */
	public static Map<String, Object> regexp(String regexp, String[] field, List<Map<String,Object>> data, String option)
	{

		long startTime = System.currentTimeMillis();

		List<Map> cleanDataList = new ArrayList<Map>();
		List<Map> eraserDataList = new ArrayList<Map>();
		/**
		 * 삭제이유
		 */
		List<HashMap> reasonDataList = new ArrayList<HashMap>();
		Map<String, Object> resultMap = new HashMap<String,Object>();


		if(null!=data && data.size()>0)
		{
			for(int i=0;i<data.size();i++)
			{
				boolean isdetecting = true;
				Map<String,Object> m = data.get(i);
				HashMap reasonMap = new HashMap();
				//field 정보 초기화


				boolean reasonCheck = false;
				reasonMap.put("idx", Integer.valueOf(String.valueOf(m.get("idx"))));
				for(int j=0;j< field.length;j++)
				{
					String v = String.valueOf(m.get(field[j]));
					reasonMap.put(field[j], 0);
					reasonMap.put(field[j]+"_reason", "");
				}

				for(int j=0;j< field.length;j++)
				{
					String v = String.valueOf(m.get(field[j]));

					Pattern p = Pattern.compile(regexp);
					Matcher matcher = p.matcher(v);


					//v = v + "";
					//option 1인경우 해당 정규식에 해당하지 않는것에 대한 처리
					boolean result;
					if(Integer.parseInt(option)==0)
					{
						result = matcher.find();
						if(result==true)
						{
							result = false;
						}
						else
						{
							result = true;
						}
					}
					else
					{
						result = matcher.find();
					}

					if(result==false)
					{
						reasonCheck = true;
						reasonMap.put(field[j],1);
						reasonMap.put(field[j]+"_reason",v);
					}

					if(isdetecting==true)
					{
						isdetecting = result;
					}
				}


				if(reasonCheck==true)
				{
					reasonDataList.add(reasonMap);
				}

				if(isdetecting==true)
				{
					cleanDataList.add(m);
				}
				else
				{
					eraserDataList.add(m);
				}
			}

			resultMap.put("cleanData", cleanDataList);
			resultMap.put("eraserData", eraserDataList);
			resultMap.put("reasonData", reasonDataList);
		}
		else
		{
			resultMap.put("cleanData", cleanDataList);
			resultMap.put("eraserData", eraserDataList);
			resultMap.put("reasonData", reasonDataList);
		}

		long estimatedTime = System.currentTimeMillis() - startTime;

		log.debug("성능측정 : "+estimatedTime);

		return resultMap;
	}


	/**
	 * Y,N 등과 같이 특정 유무에 대한 체크 기능 개발
	 * @param regexp
	 * @param field
	 * @param data
	 * @param option
	 * @return
	 */
	public static Map<String, Object> whether(String regexp, String[] field, List<Map<String,Object>> data, String option)
	{

		long startTime = System.currentTimeMillis();

		List<Map> cleanDataList = new ArrayList<Map>();
		List<Map> eraserDataList = new ArrayList<Map>();
		/**
		 * 삭제이유
		 */
		List<HashMap> reasonDataList = new ArrayList<HashMap>();
		Map<String, Object> resultMap = new HashMap<String,Object>();

		String[] whether = regexp.split(",");


		boolean result;
		if(null!=data && data.size()>0)
		{
			for(int i=0;i<data.size();i++)
			{
				boolean isdetecting = true;
				Map<String,Object> m = data.get(i);
				HashMap reasonMap = new HashMap();

				boolean reasonCheck = false;
				result=false;
				for(int j=0;j< field.length;j++)
				{
					String v = String.valueOf(m.get(field[j]));

					for(int k=0;k<whether.length;k++)
					{
						if(whether[k].equals(v))
						{
							result = true;
							reasonCheck = true;
							reasonMap.put(field[j],1);
							reasonMap.put(field[j]+"_reason",v);

							reasonCheck = true;
							break;
						}
					}
				}

				if(Integer.parseInt(option)>0)
				{
					if(result==true)
					{
						result = false;
					}
					else
					{
						result = true;
					}
				}


				if(reasonCheck==true)
				{
					reasonDataList.add(reasonMap);
				}


				if(result==true)
				{
					cleanDataList.add(m);

				}
				else
				{
					eraserDataList.add(m);
				}
			}

			resultMap.put("cleanData", cleanDataList);
			resultMap.put("eraserData", eraserDataList);
			resultMap.put("reasonData", reasonDataList);

		}
		else
		{
			resultMap.put("cleanData", cleanDataList);
			resultMap.put("eraserData", eraserDataList);
			resultMap.put("reasonData", reasonDataList);
		}

		long estimatedTime = System.currentTimeMillis() - startTime;
		log.debug("성능측정 : "+estimatedTime);
		return resultMap;
	}



	/**
	 * 특정 범위를 체크하는 method
	 * @param regexp
	 * @param field
	 * @param data
	 * @param option
	 * @return
	 */
	public static Map<String, Object> range(String regexp, String[] field, List<Map<String,Object>> data, String option)
	{

		long startTime = System.currentTimeMillis();

		List<Map> cleanDataList = new ArrayList<Map>();
		List<Map> eraserDataList = new ArrayList<Map>();
		/**
		 * 삭제이유
		 */
		List<HashMap> reasonDataList = new ArrayList<HashMap>();
		Map<String, Object> resultMap = new HashMap<String,Object>();

		String[] range = regexp.split("~");


		boolean result;
		if(null!=data && data.size()>0)
		{

			for(int i=0;i<data.size();i++)
			{
				boolean isdetecting = true;
				Map<String,Object> m = data.get(i);
				HashMap reasonMap = new HashMap();

				boolean reasonCheck = false;
				result=false;
				for(int j=0;j< field.length;j++)
				{
					String v = String.valueOf(m.get(field[j]));
					Pattern p = Pattern.compile(regexp);
					Matcher matcher = p.matcher(v);

					if(Integer.parseInt(option)==0)
					{

						if(UtilString.isNumberChk(v)==true
								&& (Double.parseDouble(v)>=Double.parseDouble(range[0])
								&& Double.parseDouble(v)<=Double.parseDouble(range[1]))
								)
						{
							result = true;
						}else {
							result = false;
						}

					}else {
						if(UtilString.isNumberChk(v)==true
								&& (Double.parseDouble(v)>=Double.parseDouble(range[0])
								&& Double.parseDouble(v)<=Double.parseDouble(range[1]))
								)
						{
							result = false;
						}else {
							result = true;
						}
					}

					if(result==false)
					{
						reasonCheck = true;
						reasonMap.put(field[j],1);
						reasonMap.put(field[j]+"_reason",v);
					}


					if(isdetecting==true)
					{
						isdetecting = result;
					}
				}

				if(reasonCheck==true)
				{
					reasonDataList.add(reasonMap);
				}


				if(result==true)
				{
					cleanDataList.add(m);

				}
				else
				{
					eraserDataList.add(m);
				}
			}


			resultMap.put("cleanData", cleanDataList);
			resultMap.put("eraserData", eraserDataList);
			resultMap.put("reasonData", reasonDataList);

		}
		else
		{
			resultMap.put("cleanData", cleanDataList);
			resultMap.put("eraserData", eraserDataList);
			resultMap.put("reasonData", reasonDataList);
		}
		long estimatedTime = System.currentTimeMillis() - startTime;
		log.debug("성능측정 : "+estimatedTime);
		return resultMap;
	}

	/**
	 * 클라우드 워드용 split method
	 * @param regexp
	 * @param field
	 * @param data
	 * @param option
	 * @return
	 */
	public static Map<String, Object> cloudword(String split_option, String[] field, List<Map<String,Object>> data, String option)
	{


		long startTime = System.currentTimeMillis();

		List<Map> cleanDataList = new ArrayList<Map>();
		List<Map> eraserDataList = new ArrayList<Map>();
		/**
		 * 삭제이유
		 */
		List<HashMap> reasonDataList = new ArrayList<HashMap>();
		Map<String, Object> resultMap = new HashMap<String,Object>();

		List<HashMap<String,Object>> list = new ArrayList<HashMap<String,Object>>();

		HashMap<String, Object> tempResult = new HashMap<String,Object>();
		StringBuffer sb = new StringBuffer();

		boolean result;
		if(null!=data && data.size()>0)
		{

			for(int i=0;i<data.size();i++)
			{
				boolean isdetecting = true;
				Map<String,Object> m = data.get(i);
				HashMap reasonMap = new HashMap();

				boolean reasonCheck = false;
				result=false;
				for(int j=0;j< field.length;j++)
				{
					String v = String.valueOf(m.get(field[j]));
					if(split_option.equals("space_basic"))
					{
						sb.append(" "+v);
					}else if(split_option.equals("space_notulcase"))
					{
						sb.append(" "+v.toLowerCase());

					}
				}
			}

			String[] strArray = sb.toString().split(" ");

			List<String> list2 = Arrays.asList(strArray);

			System.out.println("list size "+ list2.size());

			Map<String, Integer> counts = list2.parallelStream().collect(Collectors.toConcurrentMap(w -> w, w -> 1, Integer::sum));


			for (String key : counts.keySet()) {

				if(key!=null && !"".equals(key))
				{
					HashMap h = new HashMap();
					h.put("text",key);
					h.put("weight",counts.get(key));
					list.add(h);
				}
			}


			/**
    		String[] strArray = sb.toString().split(" ");

    		for(String str : strArray)
    		{
    			if(str!=null && !str.equals(""))
    			{
	    			if(list.size()>0)
	    			{

	    				boolean check = false;
	    				for(HashMap map:list)
	    				{
	    					if(map.get("text").equals(str))
	    					{
	    						map.put("weight", Integer.valueOf(String.valueOf(map.get("weight")))+1);
	    						check = true;
	    						break;
	    					}

	    				}

	    				if(check==false)
	    				{
	    					HashMap<String,Object> h = new HashMap<String,Object>();

	    					h.put("text",str);
	    					h.put("weight",1);
	    					list.add(h);
	    				}
	    			}
	    			else
	    			{
	    				HashMap<String,Object> h = new HashMap<String,Object>();

	    				h.put("text",str);
	    				h.put("weight",1);
	    				list.add(h);

	    			}
    			}
    		}
			 **/

			resultMap.put("cleanData", list);
			resultMap.put("eraserData", eraserDataList);
			resultMap.put("reasonData", reasonDataList);
		}
		else
		{
			resultMap.put("cleanData", cleanDataList);
			resultMap.put("eraserData", eraserDataList);
			resultMap.put("reasonData", reasonDataList);
		}
		long estimatedTime = System.currentTimeMillis() - startTime;
		log.debug("성능측정 cloud word : "+estimatedTime);
		return resultMap;
	}


	/**
	 * 날짜 형식에 대한 정규성 체크
	 * @param regexp
	 * @param field
	 * @param data
	 * @param option
	 * @return
	 */
	public static Map<String, Object> DateValidation(String regexp, String[] field, List<Map<String,Object>> data, String option)
	{

		long startTime = System.currentTimeMillis();
		boolean result;


		List<Map> cleanDataList = new ArrayList<Map>();
		List<Map> eraserDataList = new ArrayList<Map>();
		/**
		 * 삭제이유
		 */
		List<HashMap> reasonDataList = new ArrayList<HashMap>();
		Map<String, Object> resultMap = new HashMap<String,Object>();

		if(null!=data && data.size()>0)
		{
			for(int i=0;i<data.size();i++)
			{
				result=false;
				boolean isdetecting = true;
				Map<String,Object> m = data.get(i);
				HashMap reasonMap = new HashMap();
				//field 정보 초기화

				boolean reasonCheck = false;
				reasonMap.put("idx", Integer.valueOf(String.valueOf(m.get("idx"))));
				for(int j=0;j< field.length;j++)
				{
					String v = String.valueOf(m.get(field[j]));
					reasonMap.put(field[j], 0);
					reasonMap.put(field[j]+"_reason", "");
				}


				for(int j=0;j< field.length;j++)
				{
					String v = String.valueOf(m.get(field[j]));

					String dateToCheck = UtilCommon.detectDateFormat(v,"yyyy-MM-dd");

					//이상치 검출 선택시
					if(Integer.parseInt(option)==0)
					{
						if(null==dateToCheck)
						{
							//널값  맵에 담기
							result = false;

						}
						else
						{
							//정상값 패스
							result = true;

						}
					}
					// 비 이상치 검출 선택시
					else
					{
						if(null==dateToCheck)
						{
							//널이면 패스
							result = true;
						}
						else
						{
							//널이 아니면 map에 담기
							result = false;

						}
					}
					if(result==false)
					{
						reasonCheck = true;
						reasonMap.put(field[j],1);
						reasonMap.put(field[j]+"_reason",v);
					}


					if(isdetecting==true)
					{
						isdetecting = result;
					}


				}
				if(reasonCheck==true)
				{
					reasonDataList.add(reasonMap);
				}

				if(isdetecting==true)
				{
					cleanDataList.add(m);

				}
				else
				{
					eraserDataList.add(m);
				}
			}


			resultMap.put("cleanData", cleanDataList);
			resultMap.put("eraserData", eraserDataList);
			resultMap.put("reasonData", reasonDataList);

		}
		else
		{
			resultMap.put("cleanData", cleanDataList);
			resultMap.put("eraserData", eraserDataList);
			resultMap.put("reasonData", reasonDataList);
		}

		long estimatedTime = System.currentTimeMillis() - startTime;

		log.debug("성능측정 : "+estimatedTime);

		return resultMap;
	}

	/**
	 * 사용자 정의패턴
	 * @param regex_array
	 * @param field
	 * @param data
	 * @param option
	 * @return
	 */
	public static Map<String, Object> CustomSyntax(List<HashMap> regex_array, String[] field, List<Map<String,Object>> data, String option)
	{

		long startTime = System.currentTimeMillis();

		List<Map> cleanDataList = new ArrayList<Map>();
		List<Map> eraserDataList = new ArrayList<Map>();

		List<HashMap> reasonDataList = new ArrayList<HashMap>();
		Map<String, Object> resultMap = new HashMap<String,Object>();

		boolean result;
		if(null!=data && data.size()>0)
		{
			for(int i=0;i<data.size();i++)
			{
				boolean isdetecting = true;
				Map<String,Object> m = data.get(i);
				HashMap reasonMap = new HashMap();

				boolean reasonCheck = false;

				/**
				 * 각 단계 별 체크를 위한 배열
				 */
				ArrayList<HashMap<String, Object>> checkList = new ArrayList<HashMap<String, Object>>();


				String field_name = "";
				String prefix_data = "";

				checkList.clear();
				for(HashMap h:regex_array)
				{
					result=false;

					if(h.get("type").equals("addrule")) {

						ArrayList<HashMap<String,String>> exprList = (ArrayList<HashMap<String, String>>) h.get("data");

						prefix_data 			= expUtil(exprList,"prefix");
						String datatype_data	= expUtil(exprList,"datatype");
						String field_data 		= expUtil(exprList,"field");
						String operation_data 	= expUtil(exprList,"operation");
						String input1_data 		= expUtil(exprList,"input1");

						if(field_name.equals(""))
						{
							field_name = field_data;
						}


						try {

							if(datatype_data.equals("int") || datatype_data.equals("float")|| datatype_data.equals("number"))
							{
								if(operation_data.equals(">"))
								{
									if(Double.parseDouble(String.valueOf(m.get(field_data)))>Double.parseDouble(input1_data))
									{

										result = true;
									}

								}
								else if(operation_data.equals("<"))
								{
									if(Double.parseDouble(String.valueOf(m.get(field_data)))<Double.parseDouble(input1_data))
									{
										result = true;
									}

								}
								else if(operation_data.equals("<="))
								{
									if(Double.parseDouble(String.valueOf(m.get(field_data)))<=Double.parseDouble(input1_data))
									{
										result = true;
									}

								}
								else if(operation_data.equals(">="))
								{
									if(Double.parseDouble(String.valueOf(m.get(field_data)))>=Double.parseDouble(input1_data))
									{
										result = true;
									}

								}else if(operation_data.equals("between"))
								{
									String input2_data 		= expUtil(exprList,"input2");
									if(Double.parseDouble(String.valueOf(m.get(field_data)))>=Double.parseDouble(input1_data)
											&& Double.parseDouble(String.valueOf(m.get(field_data)))<=Double.parseDouble(input2_data))
									{
										result = true;
									}

								}

							}
							else if(datatype_data.equals("date"))
							{
								String v = "";
								String dateToCheck = UtilCommon.detectDateFormat(String.valueOf(m.get(field_data)),"yyyy-MM-dd");
								if(null==dateToCheck)
								{

									result = false;
								}
								else
								{
									if(operation_data.equals("between"))
									{
										String input2_data 		= expUtil(exprList,"input2");



										v = UtilCommon.detectDateFormat(String.valueOf(m.get(field_data)), "yyyy-MM-dd");

										if(true == checkBetween(v, input1_data, input2_data))
										{
											result = true;
										}
									}
								}
							}
							else if(datatype_data.equals("char"))
							{
								boolean innserCheck = false;
								if(operation_data.equals("in"))
								{
									String[] in = input1_data.split(",");
									for(String str : in)
									{
										if(String.valueOf(m.get(field_data)).equals(str))
										{
											innserCheck = true;
											break;
										}
									}

									if(innserCheck==true) {
										result = true;
									}
								}
							}
						}catch(Exception e)
						{
							log.debug(e.getMessage());
							result = false;
						}
					}
					else if(h.get("type").equals("addgroup"))
					{
						ArrayList<HashMap<String, Object>> groupcheckList = new ArrayList<HashMap<String, Object>>();
						ArrayList<Object> loop =(ArrayList<Object>) h.get("data");

						try {

							for(Object obj:loop)
							{

								ArrayList<HashMap<String,String>> exprList = (ArrayList<HashMap<String, String>>)obj;

								prefix_data 			= expUtil(exprList,"prefix");
								String datatype_data	= expUtil(exprList,"datatype");
								String field_data 		= expUtil(exprList,"field");
								String operation_data 	= expUtil(exprList,"operation");
								String input1_data 		= expUtil(exprList,"input1");

								if(field_name.equals(""))
								{
									field_name = field_data;
								}

								if(datatype_data.equals("int") || datatype_data.equals("float") || datatype_data.equals("number"))
								{
									if(operation_data.equals(">"))
									{
										if(Double.parseDouble(String.valueOf(m.get(field_data)))>Double.parseDouble(input1_data))
										{

											result = true;
										}

									}
									else if(operation_data.equals("<"))
									{
										if(Double.parseDouble(String.valueOf(m.get(field_data)))<Double.parseDouble(input1_data))
										{
											result = true;
										}

									}
									else if(operation_data.equals("<="))
									{
										if(Double.parseDouble(String.valueOf(m.get(field_data)))<=Double.parseDouble(input1_data))
										{
											result = true;
										}

									}
									else if(operation_data.equals(">="))
									{
										if(Double.parseDouble(String.valueOf(m.get(field_data)))>=Double.parseDouble(input1_data))
										{
											result = true;
										}

									}else if(operation_data.equals("between"))
									{
										String input2_data 		= expUtil(exprList,"input2");
										if(Double.parseDouble(String.valueOf(m.get(field_data)))>=Double.parseDouble(input1_data)
												&& Double.parseDouble(String.valueOf(m.get(field_data)))<=Double.parseDouble(input2_data))
										{
											result = true;
										}

									}

								}
								else if(datatype_data.equals("date"))
								{

									String dateToCheck = UtilCommon.detectDateFormat(String.valueOf(m.get(field_data)),"yyyy-MM-dd");
									if(null==dateToCheck)
									{

										result = false;
									}
									else
									{
										if(operation_data.equals("between"))
										{
											String input2_data 		= expUtil(exprList,"input2");
											if(true == checkBetween(String.valueOf(m.get(field_data)), input1_data, input2_data))
											{
												result = true;
											}
										}
									}
								}
								else if(datatype_data.equals("char"))
								{
									boolean innserCheck = false;
									if(operation_data.equals("in"))
									{
										String[] in = input1_data.split(",");
										for(String str : in)
										{
											if(String.valueOf(m.get(field_data)).equals(str))
											{
												innserCheck = true;
												break;
											}
										}

										if(innserCheck==true) {
											result = true;
										}
									}
								}
								//체크를 위해 배열에 입력
								HashMap<String,Object> checkHashMap = new HashMap<String,Object>();
								checkHashMap.put("prefix", prefix_data);
								checkHashMap.put("type", "addgroup");
								checkHashMap.put("result", result);
								groupcheckList.add(checkHashMap);
							}

							result = checkListaAalyzer(groupcheckList);
						}catch(Exception e)
						{
							log.debug(e.getMessage());
							result = false;
						}
					}


					//체크를 위해 배열에 입력
					HashMap<String,Object> checkHashMap = new HashMap<String,Object>();
					checkHashMap.put("prefix", "and");
					checkHashMap.put("type", "addgroup");
					checkHashMap.put("result", result);
					checkList.add(checkHashMap);
				}

				result = checkListaAalyzer(checkList);

				if(reasonCheck==true)
				{
					reasonDataList.add(reasonMap);
				}


				if(result==true)
				{
					cleanDataList.add(m);

				}
				else
				{
					eraserDataList.add(m);
				}
			}

			resultMap.put("cleanData", cleanDataList);
			resultMap.put("eraserData", eraserDataList);
			resultMap.put("reasonData", reasonDataList);

		}
		else
		{
			resultMap.put("cleanData", cleanDataList);
			resultMap.put("eraserData", eraserDataList);
			resultMap.put("reasonData", reasonDataList);
		}

		long estimatedTime = System.currentTimeMillis() - startTime;
		log.debug("성능측정 : "+estimatedTime);
		return resultMap;
	}


	public static boolean checkListaAalyzer(List<HashMap<String, Object>> list)
	{
		boolean result =true;

		for(HashMap<String, Object> h:list)
		{
			if(String.valueOf(h.get("prefix")).equals("") || String.valueOf(h.get("prefix")).equals("and"))
			{
				if(Boolean.valueOf(String.valueOf(h.get("result")))==false)
				{
					result = false;
				}
			}else if(String.valueOf(h.get("prefix")).equals("or"))
			{
				boolean test = Boolean.valueOf(String.valueOf(h.get("result")));
				if(test==false && result==false)
				{
					result = false;
				}
				else if(test==true)
				{
					result = true;
				}
			}
		}

		return result;
	}

	/**
	 * 식 생성 유틸
	 * @param exprList
	 * @param key
	 * @return
	 */
	public static String expUtil(ArrayList<HashMap<String, String>> exprList, String key)
	{
		String result = "";
		try {
			for(HashMap<String,String> h: exprList)
			{
				if(h.get("name").equals(key))
				{
					result = String.valueOf(h.get("val"));
					break;
				}
			}
		}catch(Exception e) {
			// log.error(e.getMessage());
			return result;
		}
		return result;
	}

	/**
	 * 날짜 범위 체크
	 * @param dateToCheck
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	public static boolean checkBetween(String dateToCheck, String startDate, String endDate) {
		boolean res = false;
		SimpleDateFormat fmt1 = new SimpleDateFormat("yyyy-MM-dd");
		SimpleDateFormat fmt2 = new SimpleDateFormat("yyyy-MM-dd");
		try {
			Date requestDate = fmt2.parse(dateToCheck);
			Date fromDate = fmt1.parse(startDate);
			Date toDate = fmt1.parse(endDate);
			res = requestDate.compareTo(fromDate) >= 0 && requestDate.compareTo(toDate) <=0;
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
		return res;
	}

	/**
	 * 논리 조건에 대한 처리
	 * @param regex_array
	 * @param field
	 * @param data
	 * @param option
	 * @return
	 */
	public static Map<String, Object> LogicalSyntax(List<HashMap> regex_array, String[] field, List<Map<String,Object>> data, String option)
	{
		long startTime = System.currentTimeMillis();

		List<Map> cleanDataList = new ArrayList<Map>();
		List<Map> eraserDataList = new ArrayList<Map>();

		List<HashMap> reasonDataList = new ArrayList<HashMap>();
		Map<String, Object> resultMap = new HashMap<String,Object>();

		boolean result;
		if(null!=data && data.size()>0)
		{

			for(int i=0;i<data.size();i++)
			{
				boolean isdetecting = true;
				Map<String,Object> m = data.get(i);
				HashMap reasonMap = new HashMap();

				boolean reasonCheck = false;
				result=false;
				double evaluation = 0;

				int loop = 0;
				boolean check = true;

				StringBuffer expr = new StringBuffer();
				String evaluation_field = String.valueOf(regex_array.get(0).get("field"));


				try {

					for(HashMap h:regex_array)
					{

						String logical_field = String.valueOf(h.get("field"));

						if(loop ==0 && logical_field.equals("field"))
						{
							evaluation_field = String.valueOf(h.get("data"));
							evaluation = Double.parseDouble(String.valueOf( m.get(String.valueOf(h.get("data")))));
						}
						else
						{
							if("operation".equals(logical_field))
							{
								expr.append(String.valueOf( String.valueOf(h.get("data"))));
							}
							else if("field".equals(logical_field))
							{
								expr.append(Double.parseDouble(String.valueOf( m.get(String.valueOf(h.get("data"))))));
							}
						}
						loop++;
					}

					Expression e = new ExpressionBuilder(expr.toString()).build();

					double r=  e.evaluate();

					if(evaluation==r)
					{
						result = true;

						reasonCheck = true;
						reasonMap.put(evaluation_field,1);
						reasonMap.put(evaluation_field+"_reason",String.valueOf(evaluation)+"="+expr.toString());
					}

				}catch(Exception e) { //형변환 및 처리시 오류가있을시 무조건 디텍딩으로 처리함 이유는 숫자가 아닐경우에 대한 처리
					reasonMap.put(evaluation_field,1);
					reasonMap.put(evaluation_field+"_reason",String.valueOf(evaluation)+"="+expr.toString());
				}


				if(reasonCheck==true)
				{
					reasonDataList.add(reasonMap);
				}


				if(result==true)
				{
					cleanDataList.add(m);

				}
				else
				{
					eraserDataList.add(m);
				}
			}

			resultMap.put("cleanData", cleanDataList);
			resultMap.put("eraserData", eraserDataList);
			resultMap.put("reasonData", reasonDataList);

		}
		else
		{
			resultMap.put("cleanData", cleanDataList);
			resultMap.put("eraserData", eraserDataList);
			resultMap.put("reasonData", reasonDataList);
		}

		long estimatedTime = System.currentTimeMillis() - startTime;
		log.debug("성능측정 : "+estimatedTime);
		return resultMap;
	}


	/**
	 * 년월일시분초
	 * @return
	 */
	public static String getYmdHis() {
		SimpleDateFormat fmt1 = new SimpleDateFormat("");

		Date date = Calendar.getInstance().getTime();
		String result = null;
		java.text.SimpleDateFormat format = new java.text.SimpleDateFormat("yyyyMMddHHmmddss");
		result = format.format(date);

		return result;
	}

	public static void main(String[] args) {
		// no operation
	}
}