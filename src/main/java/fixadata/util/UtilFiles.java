package fixadata.util;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellValue;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import com.univocity.parsers.common.record.Record;
import com.univocity.parsers.csv.CsvParser;
import com.univocity.parsers.csv.CsvParserSettings;

import fixadata.common.commonVO.jsonResultVO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UtilFiles {

	/* 파일 업로드 */
	public static String fileUpload( MultipartFile file ) throws IOException{
		String fileName	= file.getOriginalFilename();

		File desti = new File("database");

		log.debug(desti.getAbsolutePath());

		if(!desti.exists()){
			desti.mkdirs();
		} else{
			File[] destroy = desti.listFiles();
			for(File des:destroy){
				des.delete();
			}
		}

		BufferedOutputStream outputStream = new BufferedOutputStream(new FileOutputStream(new File(desti.getAbsolutePath() ,file.getOriginalFilename())));
		outputStream.write(file.getBytes());
		outputStream.flush();
		outputStream.close();

		return fileName;
	}

	/**
	 * sheet(xls,xlsx) parse
	 * @param file
	 * @return
	 * @throws Exception
	 */
	public static List<HashMap> uploadExcelSheetParse(MultipartFile file) throws Exception
	{
		String filename = UtilFiles.fileUpload(file);

		if(null!= file)
		{
			String ext = UtilFiles.fileExt(filename);

			List<HashMap> list = sheetparse(filename);

			return list;

		}

		return null;
	}


	/**
	 * 업로드 파일을 받아서 처리함
	 * @param file
	 * @return
	 * @throws Exception
	 */
	public static jsonResultVO uploadFileParse(MultipartFile file, int sheetIndex) throws Exception
	{

		//파일 업로드
		String filename = UtilFiles.fileUpload(file);

		jsonResultVO result = new jsonResultVO();

		if(null!= file)
		{

			String ext = UtilFiles.fileExt(filename);

			if(null== ext || "".equals(ext))
			{
				result.setResultMsg("확장자가 정확하지 않거나 파일 업로가 실패 하였습니다.");
				return result;

			}
			else
			{
				if(ext.toLowerCase().equals("xls") || ext.toLowerCase().equals("xlsx"))
				{
					result = excelparse(filename,sheetIndex);

				}
				else if(ext.toLowerCase().equals("csv"))
				{
					result = csvparse(file);
				}
			}


		}

		return result;
	}



	/**
	 * csv 파일 파싱
	 * @param file
	 * @return
	 * @throws IOException
	 */
	public static jsonResultVO csvparse(MultipartFile file) throws IOException{

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

		BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(),"EUC-KR"));
		parser.beginParsing(br);
		headers = parser.getRecordMetadata().headers();
		header.add("idx");
		int chk = 0;
		boolean check = true;

		for(int i=0; i<headers.length; i++) {
			check = true;

			for(String str : header)
			{
				if(null!=str&&str.equals(headers[i]))
				{
					chk++;
					check = false;
					break;
				}
			}


			if(check==false)
			{
				header.add(headers[i]+"("+chk+")");
				chk++;
			}
			else
			{
				header.add(headers[i]);
			}


		}
		Record record = null;
		//record = parser.parseNextRecord();
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

				if(null==field)
				{

				}
				else if(field.equals("idx"))
				{
					map.put("idx", ++rowNum);
				}
				else
				{
					String v2	 = record.getValue(idx, "");
					map.put(field, v2);
					idx++;
				}
			}

			list.add(map);
			//			recore_cnt++;
		}


		for(String str:header)
		{
			if(null!=str)
			{
				header2.add(str);
			}
		}

		result.setHeader(header2);
		result.setData(list);

		return result;
	}


	/**
	 * csv to jsonResultVO BY inputstream
	 * @param isfile
	 * @return
	 * @throws IOException
	 */
	public static jsonResultVO csvparse2(InputStream isfile) throws IOException{

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

		BufferedReader br = new BufferedReader(new InputStreamReader(isfile,"EUC-KR"));
		parser.beginParsing(br);
		headers = parser.getRecordMetadata().headers();
		header.add("idx");
		int chk = 0;
		boolean check = true;

		for(int i=0; i<headers.length; i++) {
			check = true;

			for(String str : header)
			{
				if(null!=str&&str.equals(headers[i]))
				{
					chk++;
					check = false;
					break;
				}
			}


			if(check==false)
			{
				header.add(headers[i]+"("+chk+")");
				chk++;
			}
			else
			{
				header.add(headers[i]);
			}
		}

		Record record = null;
		//record = parser.parseNextRecord();
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

				if(null==field)
				{

				}
				else
				{
					String v2	 = record.getValue(idx, "");
					map.put(field, v2);
					idx++;
				}

			}

			list.add(map);
			//	recore_cnt++;
		}


		for(String str:header)
		{
			if(null!=str)
			{
				header2.add(str);
			}
		}

		result.setHeader(header2);
		result.setData(list);

		return result;
	}


	public static List<HashMap> sheetparse(String filename) throws IOException{

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		jsonResultVO result = new jsonResultVO();
		String ext = UtilFiles.fileExt(filename);
		List<HashMap> list = new ArrayList();
		ArrayList<String> header = new ArrayList();

		List<HashMap> resultList = new ArrayList<HashMap>();

		if("xls".equals(ext.toLowerCase()))
		{

			InputStream ExcelFileToRead = new FileInputStream("database/"+filename);
			HSSFWorkbook wb = new HSSFWorkbook(ExcelFileToRead);
			FormulaEvaluator evaluator = wb.getCreationHelper().createFormulaEvaluator();

			for (int i=0; i<wb.getNumberOfSheets(); i++) {
				HashMap h = new HashMap();
				h.put("index", i);
				h.put("indexName",wb.getSheetName(i));
				resultList.add(h);
			}

		}
		else if("xlsx".equals(ext.toLowerCase()))
		{
			InputStream file = new FileInputStream("database/"+filename);
			XSSFWorkbook  wb = new XSSFWorkbook (file);

			for (int i=0; i<wb.getNumberOfSheets(); i++) {
				HashMap h = new HashMap();
				h.put("index", i);
				h.put("indexName",wb.getSheetName(i));
				resultList.add(h);
			}
		}

		return resultList;
	}


	/**
	 * excel 파일 파싱
	 * @param file
	 * @return
	 * @throws IOException
	 */
	public static jsonResultVO excelparse(String filename, int sheetIndex) throws IOException{

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		jsonResultVO result = new jsonResultVO();
		String ext = UtilFiles.fileExt(filename);
		List<HashMap> list = new ArrayList();
		ArrayList<String> header = new ArrayList();


		if("xls".equals(ext.toLowerCase()))
		{
			InputStream ExcelFileToRead = new FileInputStream("database/"+filename);
			HSSFWorkbook wb = new HSSFWorkbook(ExcelFileToRead);
			FormulaEvaluator evaluator = wb.getCreationHelper().createFormulaEvaluator();
			int rowindex=0;
			int columnindex=0;
			HSSFSheet sheet=wb.getSheetAt(sheetIndex);
			//행의 수
			int rows=sheet.getPhysicalNumberOfRows();
			ArrayList arr = new ArrayList<>();
			int cells= 0;
			for(rowindex=0;rowindex<rows;rowindex++){
				HSSFRow row=sheet.getRow(rowindex);
				LinkedHashMap<String,Object> map = new LinkedHashMap();

				if(row !=null){
					//셀의 수
					if(rowindex == 0){
						map.put("idx", "idx");
						cells = row.getLastCellNum();

					}else{
						map.put("idx", rowindex+"");
					}
					int null_cnt =0;
					int cnt = 0;
					Map<String,String> tmp = new HashMap<String,String>();
					Map<String,Integer> tmp_int = new HashMap<String,Integer>();
					for(columnindex=0;columnindex<cells;columnindex++){
						HSSFCell cell=row.getCell(columnindex);
						if(rowindex == 0){
							if(cell != null) {
								if(!tmp.isEmpty()) {
									String str1 ="";
									String str2 = "";
									if(tmp.get(cell.toString().trim()) == null) {
										str1 = "null"+null_cnt;
										str2 = "null";
										null_cnt++;
									}else {
										str1 = tmp.get(cell.toString().trim());
										str2 = cell.toString().trim();
									}
									if(str1.equals(str2)) {
										cnt = tmp_int.get(str2);
										cnt++;
										if(cell.toString().trim().length()== 0) {
											arr.add(cell.toString().trim());
											//	tmp_int.put(cell.toString().trim(),cnt);
										}else {
											arr.add(cell.toString().trim()+"("+(cnt)+")");
											tmp_int.put(cell.toString().trim(),cnt);
										}
									}else {
										if(cell.toString().trim()!= null) {
											arr.add(cell.toString().trim());
											tmp.put(cell.toString().trim(),cell.toString().trim());
											tmp_int.put(cell.toString().trim(),0);
										}
									}
								}else {
									String str1 ="";
									String str2 = "";
									if(tmp.get(cell.toString().trim()) == null || cell.toString().trim()== null) {
										str1 = "null"+null_cnt;
										str2 = "null";
										null_cnt++;
									}else {
										str1 = tmp.get(cell.toString().trim());
										str2 = cell.toString().trim();
									}
									if(str1.equals(str2)) {
										cnt = tmp_int.get(str2);
										cnt++;
										arr.add(cell.toString().trim()+"("+(cnt)+")");
										tmp_int.put(str2,cnt);
									}else {
										if(cell.toString().trim()!= null) {
											arr.add(cell.toString().trim());
											tmp.put(cell.toString().trim(),cell.toString().trim());
											tmp_int.put(cell.toString().trim(),0);

										}
									}
								}

							}else {
								if(!tmp.isEmpty()) {
									String str1 ="";
									String str2 = "";
									if(tmp.get("TEMP") == null) {
										str1 = "TEMP"+null_cnt;
										str2 = "TEMP";
										null_cnt++;
									}else {
										str1 = tmp.get("TEMP");
										str2 = "TEMP";
									}
									if(str1.equals(str2)) {
										cnt = tmp_int.get(str2);
										cnt++;
										arr.add("TEMP");
										tmp_int.put(str2,cnt);
									}else {
										if(str2 != null) {
											arr.add("TEMP");
											tmp_int.put("TEMP",0);
										}
									}
								}else {
									String str1 ="";
									String str2 = "";
									if(tmp.get("TEMP") == null) {
										str1 = "TEMP"+null_cnt;
										str2 = "TEMP";
										null_cnt++;
									}else {
										str1 = tmp.get("TEMP");
										str2 = "TEMP";
									}
									if(str1.equals(str2)) {
										cnt = tmp_int.get(str2);
										cnt++;
										arr.add("TEMP");
										tmp_int.put(str2,cnt);
									}else {
										if(str2 != null) {
											arr.add("TEMP");
											//	tmp.put("TEMP","TEMP");
											tmp_int.put("TEMP",0);
										}
									}
								}
							}
						}
						if(cell  == null ){
							if(!(((String)arr.get(columnindex)).equals("TEMP")  || ((String)(arr.get(columnindex))).length() == 0)) {
								map.put((String) arr.get(columnindex),  "");
							}

						}else if( cell.getCellType() == HSSFCell.CELL_TYPE_FORMULA){

							if(!(((String)arr.get(columnindex)).equals("TEMP")  || ((String)(arr.get(columnindex))).length() == 0)) {


								CellValue c=evaluator.evaluate(cell);

								String cellValue = "";

								try {
									switch(c.getCellType())
									{
									case Cell.CELL_TYPE_STRING: cellValue = c.getStringValue(); break;
									case Cell.CELL_TYPE_NUMERIC: cellValue = String.valueOf(c.getNumberValue()); break;
									case Cell.CELL_TYPE_BOOLEAN: cellValue = String.valueOf(c.getBooleanValue()); break;
									case Cell.CELL_TYPE_ERROR: cellValue = String.valueOf(c.getBooleanValue()); break;
									default:break;


									}
								}catch(Exception e) {
									log.error(e.getMessage());
								}

								map.put((String) arr.get(columnindex), cellValue);
							}

						}else if( cell.getCellType() == HSSFCell.CELL_TYPE_STRING){
							if(!(((String)arr.get(columnindex)).equals("TEMP")  || ((String)(arr.get(columnindex))).length() == 0)) {

								map.put((String) arr.get(columnindex), cell.getStringCellValue());
							}
						}else if(cell.getCellType() == HSSFCell.CELL_TYPE_NUMERIC){
							if(!(((String)arr.get(columnindex)).equals("TEMP")  || ((String)(arr.get(columnindex))).length() == 0)) {
								map.put((String) arr.get(columnindex), cell.getNumericCellValue());
							}
							if(DateUtil.isCellDateFormatted(cell)){
								if(!(((String)arr.get(columnindex)).equals("TEMP")  || ((String)(arr.get(columnindex))).length() == 0)) {
									map.put((String) arr.get(columnindex), sdf.format( cell.getDateCellValue()));
								}
							}
						}else{
							if(!(((String)arr.get(columnindex)).equals("TEMP")  || ((String)(arr.get(columnindex))).length() == 0)) {
								map.put((String) arr.get(columnindex), cell + "");
							}
						}

						String value="";
					}

					if(rowindex == 0){
						for(String key : map.keySet())
						{
							header.add(key);
						}

					}else{
						list.add(map);
					}

				}

			}

			result.setData(list);
			result.setHeader(header);
			result.setResult("success");
			return result;

		}
		else if("xlsx".equals(ext.toLowerCase()))
		{
			InputStream file = new FileInputStream("database/"+filename);
			XSSFWorkbook  workbook = new XSSFWorkbook (file);


			FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();

			int rowindex=0;
			int columnindex=0;

			XSSFSheet sheet = workbook.getSheetAt(sheetIndex);

			int rows = sheet.getPhysicalNumberOfRows();
			int cells = 0;
			ArrayList arr = new ArrayList<>();
			for(rowindex = 0; rowindex < rows;rowindex++){
				XSSFRow row = sheet.getRow(rowindex);

				if(row != null){
					LinkedHashMap<String,Object> map = new LinkedHashMap();

					if(rowindex == 0){
						map.put("idx", "idx");
						cells = row.getPhysicalNumberOfCells();
					}else{
						map.put("idx", rowindex+"");
					}

					int null_cnt =0;
					int cnt = 0;
					Map<String,String> tmp = new HashMap<String,String>();
					Map<String,Integer> tmp_int = new HashMap<String,Integer>();
					for(columnindex=0;columnindex<cells;columnindex++){

						XSSFCell cell = row.getCell(columnindex);


						if(rowindex == 0){
							if(cell != null) {
								if(!tmp.isEmpty()) {
									String str1 ="";
									String str2 = "";
									if(tmp.get(cell.toString().trim()) == null) {
										str1 = "null"+null_cnt;
										str2 = "null";
										null_cnt++;
									}else {
										str1 = tmp.get(cell.toString().trim());
										str2 = cell.toString().trim();
									}
									if(str1.equals(str2)) {
										cnt = tmp_int.get(str2);
										cnt++;
										if(cell.toString().trim().length()== 0) {
											arr.add(cell.toString().trim());
											//			    							tmp_int.put(cell.toString().trim(),cnt);
										}else {
											arr.add(cell.toString().trim()+"("+(cnt)+")");
											tmp_int.put(cell.toString().trim(),cnt);
										}
									}else {
										if(cell.toString().trim()!= null) {
											arr.add(cell.toString().trim());
											tmp.put(cell.toString().trim(),cell.toString().trim());
											tmp_int.put(cell.toString().trim(),0);
										}
									}
								}else {
									String str1 ="";
									String str2 = "";
									if(tmp.get(cell.toString().trim()) == null || cell.toString().trim()== null) {
										str1 = "null"+null_cnt;
										str2 = "null";
										null_cnt++;
									}else {
										str1 = tmp.get(cell.toString().trim());
										str2 = cell.toString().trim();
									}
									if(str1.equals(str2)) {
										cnt = tmp_int.get(str2);
										cnt++;
										arr.add(cell.toString().trim()+"("+(cnt)+")");
										tmp_int.put(str2,cnt);
									}else {
										if(cell.toString().trim()!= null) {
											arr.add(cell.toString().trim());
											tmp.put(cell.toString().trim(),cell.toString().trim());
											tmp_int.put(cell.toString().trim(),0);

										}
									}
								}

							}else {
								if(!tmp.isEmpty()) {
									String str1 ="";
									String str2 = "";
									if(tmp.get("TEMP") == null) {
										str1 = "TEMP"+null_cnt;
										str2 = "TEMP";
										null_cnt++;
									}else {
										str1 = tmp.get("TEMP");
										str2 = "TEMP";
									}
									if(str1.equals(str2)) {
										cnt = tmp_int.get(str2);
										cnt++;
										arr.add("TEMP" +"("+(cnt)+")");
										tmp_int.put(str2,cnt);
									}else {
										if(str2 != null) {
											arr.add("TEMP");
											tmp_int.put("TEMP",0);
										}
									}
								}else {
									String str1 ="";
									String str2 = "";
									if(tmp.get("TEMP") == null) {
										str1 = "TEMP"+null_cnt;
										str2 = "TEMP";
										null_cnt++;
									}else {
										str1 = tmp.get("TEMP");
										str2 = "TEMP";
									}
									if(str1.equals(str2)) {
										cnt = tmp_int.get(str2);
										cnt++;
										arr.add("TEMP" +"("+(cnt)+")");
										tmp_int.put(str2,cnt);
									}else {
										if(str2 != null) {
											arr.add("TEMP");
											//	tmp.put("TEMP","TEMP");
											tmp_int.put("TEMP",0);
										}
									}
								}
							}
						}


						if(cell  == null ){
							if(!(((String)arr.get(columnindex)).equals("TEMP")  || ((String)(arr.get(columnindex))).length() == 0)) {
								map.put((String) arr.get(columnindex),  "");
							}

						}
						else if( cell.getCellType() == XSSFCell.CELL_TYPE_FORMULA)
						{

							CellValue c=evaluator.evaluate(cell);

							String cellValue = "";

							try {
								switch(c.getCellType())
								{
								case Cell.CELL_TYPE_STRING: cellValue = c.getStringValue(); break;
								case Cell.CELL_TYPE_NUMERIC: cellValue = String.valueOf(c.getNumberValue()); break;
								case Cell.CELL_TYPE_BOOLEAN: cellValue = String.valueOf(c.getBooleanValue()); break;
								case Cell.CELL_TYPE_ERROR: cellValue = String.valueOf(c.getBooleanValue()); break;
								default:break;


								}
							}catch(Exception e) {
								log.error(e.getMessage());
							}


							if(!(((String)arr.get(columnindex)).equals("TEMP")  || ((String)(arr.get(columnindex))).length() == 0)) {
								map.put((String) arr.get(columnindex), cellValue);
							}
						}
						else if( cell.getCellType() == XSSFCell.CELL_TYPE_STRING){
							if(!(((String)arr.get(columnindex)).equals("TEMP")  || ((String)(arr.get(columnindex))).length() == 0)) {
								map.put((String) arr.get(columnindex), cell.getStringCellValue());
							}
						}else if(cell.getCellType() == XSSFCell.CELL_TYPE_NUMERIC){
							if(!(((String)arr.get(columnindex)).equals("TEMP")  || ((String)(arr.get(columnindex))).length() == 0)) {
								map.put((String) arr.get(columnindex), cell.getNumericCellValue());
							}

							if(DateUtil.isCellDateFormatted(cell)){
								if(!(((String)arr.get(columnindex)).equals("TEMP")  || ((String)(arr.get(columnindex))).length() == 0)) {
									map.put((String) arr.get(columnindex), sdf.format( cell.getDateCellValue()));
								}
							}
						}else{
							if(!(((String)arr.get(columnindex)).equals("TEMP")  || ((String)(arr.get(columnindex))).length() == 0)) {
								map.put((String) arr.get(columnindex), cell + "");
							}
						}
						String value="";
					}

					if(rowindex == 0){
						for(String key : map.keySet())
						{
							header.add(key);
						}

					}else{
						list.add(map);
					}
				}
			}

			result.setData(list);
			result.setHeader(header);
			result.setResult("success");
			return result;
		}
		else
		{
			result.setResultMsg("지정된 확장자가 아입니다.");
		}
		return result;
	}



	/**
	 * file확장자 추출
	 * @param file
	 * @return
	 */
	public static String fileExt(String file)
	{
		String result = "";

		if(null!=file && file.length()>0)
		{
			int pos = file.lastIndexOf(".");
			result = file.substring(pos+1);
		}

		return result;
	}
	public static void deletefiles(String path) {

		try {
			File deleteFolder = new File(path);
			if(deleteFolder.exists()){
				File[] deleteFolderList = deleteFolder.listFiles();

				for (int j = 0; j < deleteFolderList.length; j++) {
					deleteFolderList[j].delete();
				}

				if(deleteFolderList.length == 0 && deleteFolder.isDirectory()){
					deleteFolder.delete();
				}
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
}