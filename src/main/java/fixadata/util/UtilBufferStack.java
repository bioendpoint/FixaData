package fixadata.util;

import java.util.HashMap;

import org.springframework.stereotype.Component;

/**
 * history적재를 위한 임시 메모리
 * @author Tom.DongHyuk (bioendpoint@gmail.com)
 *
 */
@Component
public class UtilBufferStack {

	public static HashMap<String,String> tempMemory = new HashMap<String,String>();


	public void setTempData(String key, String data)
	{
		tempMemory.put(key,data);
	}

	public String getTempData(String key)
	{
		return tempMemory.get(key);
	}
}