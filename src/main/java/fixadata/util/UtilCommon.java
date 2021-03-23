package fixadata.util;

import java.io.IOException;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.URLDecoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import fixadata.process.service.ProcessService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UtilCommon {

	@Resource(name = "processService")
	private static ProcessService processService;
	// 파일 헤더 정보 : 파일형태
	public static String mimeType(String Url) throws IOException{
		Path souce = Paths.get(Url);
		return Files.probeContentType(souce);
	}


	// Jetty Server 프로세스 중지
	public static void serverStop() throws IOException{
		String name = java.lang.management.ManagementFactory.getRuntimeMXBean().getName();
		Runtime runtime = Runtime.getRuntime();
		runtime.exec("taskkill /F /PID "+name.split("@")[0].toString());
	}

	public static String getBrowser(HttpServletRequest request) throws IOException {
		String header = request.getHeader("User-Agent");
		if (header.indexOf("MSIE") > -1) {
			return "MSIE";
		} else if (header.indexOf("Chrome") > -1) {
			return "Chrome";
		} else if (header.indexOf("Opera") > -1) {
			return "Opera";
		} else if (header.indexOf("Trident/7.0") > -1){
			//IE 11 이상 //IE 버전 별 체크 >> Trident/6.0(IE 10) , Trident/5.0(IE 9) , Trident/4.0(IE 8)
			return "MSIE";
		}
		return "Firefox";
	}


	/**
	 * date format 변경 변경 범위를 벗어나는것은 null return
	 * @param inputDate
	 * @param transFormDateFormat
	 * @return
	 */
	public static String detectDateFormat(String inputDate, String transFormDateFormat)
	{
		List<SimpleDateFormat> dateFormats= new ArrayList<SimpleDateFormat>();

		inputDate = inputDate.replace(" ", "").replace("/", "").replace(":", "").replace("-","").replace(".","");

		//ko style
		dateFormats.add(new SimpleDateFormat("yyyyMMdd"));
		dateFormats.add(new SimpleDateFormat("yyyyMMddHH"));
		dateFormats.add(new SimpleDateFormat("yyyyMMddHHmm"));
		dateFormats.add(new SimpleDateFormat("yyyyMMddHHmmss"));
		dateFormats.add(new SimpleDateFormat("yyyyMMddHHmmss.SSS"));

		Date date = null;
		for (SimpleDateFormat format : dateFormats) {

			try {
				format.setLenient(false);
				date = format.parse(inputDate);
			} catch (ParseException e) {}
			if (date != null) {
				break;
			}
		}

		if(date==null)
		{
			return null;
		}

		SimpleDateFormat newDateFormat = new SimpleDateFormat(transFormDateFormat);
		newDateFormat.applyPattern(transFormDateFormat);
		String returnDate = newDateFormat.format(date);
		return returnDate;
	}



	public static void main(String[] args )
	{

		String jsonString = "http%3A%2F%2Fnewsapi.org%2Fv2%2Feverything%3Fq%3Dcovid19%26from%3D2020-08-10%26sortBy%3DpublishedAt%26apiKey%3D114ab2fe5f934c269f9aeb1660b1d7e8";
		String ss = URLDecoder.decode(jsonString);
		System.out.print("asdf==>"+ss);
	}


	public static String getMacAddress()  {
		StringBuilder sb = new StringBuilder();
		List<String> list = new ArrayList<String>();

		try {
			final Enumeration<NetworkInterface> e = NetworkInterface.getNetworkInterfaces();

			while (e.hasMoreElements()) {
				final byte [] mac = e.nextElement().getHardwareAddress();
				if (mac != null) {

					for (int i = 0; i < mac.length; i++)
						sb.append(String.format("%02X%s", mac[i], (i < mac.length - 1) ? "-" : ""));
					list.add(sb.toString());
				}
			}
		}catch (Exception e) {
			e.printStackTrace();
		}

		if(list.size()>0) {
			return list.get(0);
		}

		return sb.toString();

	}

	/**
	 * macAddress 추출
	 * @return
	 */
	public static String getMacAddress2()
	{
		StringBuffer sb = new StringBuffer();
		try {
			InetAddress ip = InetAddress.getLocalHost();
			NetworkInterface mac = NetworkInterface.getByInetAddress(ip);
			if(ip != null) {
				byte[] mc = mac.getHardwareAddress();

				String macAddress = "";

				for (int i = 0; i < mc.length; i++) {
					macAddress += (String.format("%02x", mc[i]) + ":");
				}

				sb.append(macAddress.substring(0, macAddress.length()-1));

			}
		}catch(Exception e) {
			e.printStackTrace();
		}

		return sb.toString();
	}
}