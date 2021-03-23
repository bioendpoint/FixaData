package fixadata.util;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.univocity.parsers.common.record.Record;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UtilJson {

	/**
	 * map 을 JSONObject 변환 하기
	 * @param map
	 * @return
	 */
	public static JSONObject toJson(Map<String, Object> map){
		JSONObject  jsonObject = new JSONObject();
		for(Map.Entry<String, Object> entry : map.entrySet()){
			String key = entry.getKey();
			Object value = entry.getValue();
			jsonObject.put(key, value);
		}
		return jsonObject;
	}


	/**
	 * List 를  JSONArray 변환 하기
	 * @param list
	 * @return
	 */
	public static JSONArray getJsonArrayFromList(List<?> list){
		JSONArray  jsonArray = new JSONArray();
		for(Object map : list){
			jsonArray.add(toJson((Map<String, Object>) map));
		}
		return jsonArray;
	}


	/**
	 * JSONObject 을  map 변환 하기
	 * @param JSONObject
	 * @return
	 * @throws IOException
	 * @throws JsonMappingException
	 * @throws JsonParseException
	 */
	public static Map<String, Object>  toMap(JSONObject jsonObj) {
		Map<String, Object> map = null;
		try {
			map =  new ObjectMapper().readValue(jsonObj.toJSONString(), Map.class);
		} catch (JsonParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return map;
	}

	public static List<Map<String,Object>>  toList(String str) {
		List<Map<String,Object>> list = null;
		try {
			list = new ObjectMapper().readValue(str, new TypeReference<List<Map<String, Object>>>() {});
		} catch (JsonParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return list;
	}


	/**
	 * header 와 record 를 json 으로 반환
	 * @param header
	 * @param record
	 * @return
	 */
	public static String convertRecordToJson(String[] header, Record record) {
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> map = convertRecordToMap(header, record);
		try {
			String jsonstr = mapper.writeValueAsString(map);
			return jsonstr;
		} catch (Exception ex) {
			log.warn(ex.getMessage(), ex);
			return StringUtils.EMPTY;
		}
	}

	/**
	 * header 와 record 를 map 으로 반환
	 * @param header
	 * @param record
	 * @return
	 */
	public static Map<String, Object> convertRecordToMap(String[] header, Record record) {
		Map<String, Object> map = new HashMap<>();
		for (int i = 0; i < header.length; i++) {

			String str = record.getString(header[i]);

			if(str==null)
			{
				map.put(header[i], "");
			}
			else
			{
				map.put(header[i], str);
			}
		}
		return map;
	}

	public static Map ConverObjectToMap(Object obj)
	{
		try {
			//Field[] fields = obj.getClass().getFields(); //private field는 나오지 않음.
			Field[] fields = obj.getClass().getDeclaredFields();
			Map resultMap = new HashMap();
			for(int i=0; i<=fields.length-1;i++)
			{
				fields[i].setAccessible(true);
				resultMap.put(fields[i].getName(), fields[i].get(obj));
			} return resultMap;
		} catch (IllegalArgumentException e)
		{
			e.printStackTrace();
		} catch (IllegalAccessException e)
		{
			e.printStackTrace();
		} return null;
	}


	public static List<HashMap> toListMap(String jsonString)
	{
		ObjectMapper objectMapper = new ObjectMapper();
		List<HashMap> resultList = null;

		try {
			resultList = objectMapper.readValue(jsonString,
					new TypeReference<List<HashMap>>() {
			});
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return resultList;
	}


	public static HashMap toStromgToMap(String jsonString)
	{
		ObjectMapper objectMapper = new ObjectMapper();
		HashMap resultMap = null;

		try {
			resultMap = objectMapper.readValue(jsonString,
					new TypeReference<HashMap>() {
			});
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return resultMap;
	}
}