package fixadata.util;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class DirectoryManager {


	public static void deleteFile(String path) {

		String d_path = path;
		File folder = new File(path);
		try {
			while(folder.exists()) {
				File[] folder_list = folder.listFiles(); //파일리스트 얻어오기

				for (int j = 0; j < folder_list.length; j++) {
					folder_list[j].delete(); //파일 삭제
				}
				if(folder_list.length == 0 && folder.isDirectory()){
					folder.delete(); //대상폴더 삭제
				}
			}
		} catch (Exception e) {
			e.getStackTrace();
		}

	}

	public static void mkdir(String path) {
		File dir = new File(path);
		if(!dir.exists()) {    //디렉토리 없으면 생성.
			dir.mkdirs();
		}
	}

	public static void fileMove(String inFileName, String outFileName) {
		try {
			FileInputStream fis = new FileInputStream(inFileName);
			BufferedInputStream bis = new BufferedInputStream(fis);
			FileOutputStream fos = new FileOutputStream(outFileName);
			BufferedOutputStream bos = new BufferedOutputStream(fos);
			int data = 0;
			while((data=bis.read())!=-1) {
				bos.write(data);
			}
			bis.close();
			bos.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public static boolean isExistFile(String path){
		boolean isExists = false;
		File file = new File(path);
		isExists = file.exists();

		return isExists;
	}
}