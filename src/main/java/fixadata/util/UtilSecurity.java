package fixadata.util;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;
/**
 * 암호화 관련 유틸
 * @author Tom.DongHyuk (bioendpoint@gmail.com)
 *
 */
public class UtilSecurity {


	/**
	 * ase알고리즘을 통한 복호화
	 * @param text : 암호문
	 * @param key : key
	 * @return
	 * @throws Exception
	 */
	public static String AseDecode(String text, String key) throws Exception

	{

		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");

		byte[] keyBytes= new byte[16];

		byte[] b= key.getBytes("UTF-8");

		int len= b.length;

		if (len > keyBytes.length) len = keyBytes.length;

		System.arraycopy(b, 0, keyBytes, 0, len);

		SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");

		IvParameterSpec ivSpec = new IvParameterSpec(keyBytes);

		cipher.init(Cipher.DECRYPT_MODE,keySpec,ivSpec);

		//BASE64Decoder decoder = new BASE64Decoder();

		//byte [] results = cipher.doFinal(decoder.decodeBuffer(text));
		byte [] results = cipher.doFinal(Base64.decodeBase64(text.getBytes()));

		return new String(results,"UTF-8");
	}


	/**
	 * ase알고리즘을 통한 암호화
	 * @param text : 평문
	 * @param key : key
	 * @return
	 * @throws Exception
	 **/
	public static String AseEncode(String text, String key) throws Exception

	{

		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");

		byte[] keyBytes= new byte[16];

		byte[] b= key.getBytes("UTF-8");

		int len= b.length;

		if (len > keyBytes.length) len = keyBytes.length;

		System.arraycopy(b, 0, keyBytes, 0, len);

		SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");

		IvParameterSpec ivSpec = new IvParameterSpec(keyBytes);

		cipher.init(Cipher.ENCRYPT_MODE,keySpec,ivSpec);


		byte[] results = cipher.doFinal(text.getBytes("UTF-8"));

		return new String(Base64.encodeBase64(results));
	}


	/**
	 * mac주소 추출
	 * @return
	 * @throws IOException
	 */
	public final static String getMacAddress() throws IOException {
		String os = System.getProperty("os.name");

		if (os.startsWith("Windows")) {
			return ParseMacAddress(windowsRunIpConfigCommand());
		} else if (os.startsWith("Linux")) {
			return ParseMacAddress(linuxRunIfConfigCommand());
		} else {
			throw new IOException("unknown operating system: " + os);
		}
	}

	/**
	 * Windows에 있는 네트워크 설정값들을 문자열로 가져온다.
	 */
	private final static String windowsRunIpConfigCommand() throws IOException {
		Process p = Runtime.getRuntime().exec("ipconfig /all");
		InputStream stdoutStream = new BufferedInputStream(p.getInputStream());

		StringBuffer buffer = new StringBuffer();
		for (;;) {
			int c = stdoutStream.read();
			if (c == -1)
				break;
			buffer.append((char) c);
		}
		String outputText = buffer.toString();

		stdoutStream.close();

		return outputText;
	}

	/**
	 * 문자열에서  패턴에 맞는 문자열 즉 맥주소를 뽑아낸다.
	 * @param text 검사할 문자열
	 * @return 맥 주소
	 */
	public static String ParseMacAddress(String text) {
		String result = null;
		String[] list = text.split("\\p{XDigit}{2}(-\\p{XDigit}{2}){5}");
		int index = 0;
		for (String str : list) {
			if (str.length() < text.length()) {
				index = str.length();
				result = text.substring(index, index + 17);
				if (!result.equals("00-00-00-00-00-00")) {
					break;
				}
				text = text.substring(index + 17);

			}
		}
		return result;
	}

	/**
	 * Linux 에 있는 네트워크 설정 값들을 문자열로 불러온다.
	 */
	private final static String linuxRunIfConfigCommand() throws IOException {
		Process p = Runtime.getRuntime().exec("ifconfig");
		InputStream stdoutStream = new BufferedInputStream(p.getInputStream());

		StringBuffer buffer = new StringBuffer();
		for (;;) {
			int c = stdoutStream.read();
			if (c == -1)
				break;
			buffer.append((char) c);
		}
		String outputText = buffer.toString();

		stdoutStream.close();

		return outputText;
	}

	public static void main(String[] args) throws Exception
	{
		UtilSecurity se = new UtilSecurity();


		System.out.println(se.windowsRunIpConfigCommand());

		/**
    	String encode = se.AseEncode("test123", "1234");
    	System.out.println(encode);
    	System.out.println(se.AseDecode(encode, "1234"));
		 **/
	}
}