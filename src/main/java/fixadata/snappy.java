package fixadata;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;

import org.json.simple.parser.ParseException;
import org.xerial.snappy.Snappy;

public class snappy {

	public static void main(String[] args) throws IOException, ParseException {
		// TODO Auto-generated method stub


		StringBuffer sb = new StringBuffer();
		StringBuffer desb = new StringBuffer();

		//String fileName = "C:\\Downloads\\36_1474212963188600684_4451886.snappy";


		String fileName = "d:\\data\\test\\test.json";
		String compress = "d:\\data\\test\\test.snappy";
		String decompress = "d:\\data\\test\\test2.json";

		FileInputStream fis = new FileInputStream(new File(fileName));
		FileChannel channel = fis.getChannel();
		ByteBuffer bb = ByteBuffer.allocate((int) channel.size());
		channel.read(bb);
		byte[] beforeBytes = bb.array();

		//compress
		System.out.println("Before snappy compress size：" + beforeBytes.length + " bytes");
		long startTime1 = System.currentTimeMillis();
		byte[] afterBytes = Snappy.compress(beforeBytes);
		long endTime1 = System.currentTimeMillis();
		System.out.println("after snappy compress size：" + afterBytes.length + " bytes");
		System.out.println("snappy compress time elapsed：" + (endTime1 - startTime1)+ "ms");
		System.out.println("byte count="+afterBytes.length);

		FileOutputStream lFileOutputStream = new FileOutputStream(new File(compress));
		lFileOutputStream.write(afterBytes);
		lFileOutputStream.close();

		File f2 = new File(compress);

		FileInputStream fis2 = new FileInputStream(f2);
		byte[] buffer = new byte[(int)f2.length()];
		fis2.read(buffer);

		//uncompress
		long startTime2 = System.currentTimeMillis();
		byte[] resultBytes = Snappy.uncompress(buffer);
		System.out.println("snappy uncompress size：" + resultBytes.length + " bytes");
		long endTime2 = System.currentTimeMillis();
		System.out.println("uncompress time elapsed：" + (endTime2 - startTime2)+ "ms");


		FileOutputStream lFileOutputStream2 = new FileOutputStream(new File(decompress));
		lFileOutputStream2.write(resultBytes);
		lFileOutputStream2.close();
	}
}