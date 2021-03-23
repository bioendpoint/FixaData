package fixadata.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.opencsv.CSVReader;

import jxl.Cell;
import jxl.CellType;
import jxl.Sheet;
import jxl.Workbook;

public class UtilExcel {

	private List excelList;
	private String inputFile;

	public List getExcelList() {
		return excelList;
	}

	public void setInputFile(String inputFile) {
		this.inputFile = inputFile;
	}

	@SuppressWarnings("resource")
	public Map read() throws IOException  {

		//File inputWorkbook = new File(inputFile);

		Map dataMap = new HashMap();

		List list = new ArrayList();

		SimpleDateFormat obj = new SimpleDateFormat("yyyy-MM-dd");

		if(UtilCommon.mimeType(inputFile).indexOf(".sheet") > 0 && inputFile.substring(inputFile.lastIndexOf(".")+1, inputFile.length()).equals("xlsx")){

			InputStream file = new FileInputStream(inputFile);

			XSSFWorkbook workbook = new XSSFWorkbook(file);

			int rowindex = 0;
			int columnindex = 0;

			XSSFSheet sheet = workbook.getSheetAt(0);

			int rows = sheet.getPhysicalNumberOfRows();
			int cells = 0;
			ArrayList arr = new ArrayList<>();
			for(rowindex = 0; rowindex < rows;rowindex++){
				XSSFRow row = sheet.getRow(rowindex);

				if(row != null){
					Map map = new LinkedHashMap();

					if(rowindex == 0){
						map.put("idx", "idx");
						cells = row.getPhysicalNumberOfCells();
					}else{
						map.put("idx", rowindex+"");
					}

					for(columnindex=0;columnindex<cells;columnindex++){
						XSSFCell cell = row.getCell(columnindex);
						if(rowindex == 0){
							arr.add(cell.toString());
						}
						if(cell  == null ){
							map.put(arr.get(columnindex),  "");
						}else if( cell.getCellType() == XSSFCell.CELL_TYPE_STRING){
							map.put(arr.get(columnindex), cell.getStringCellValue());
						}else if(cell.getCellType() == XSSFCell.CELL_TYPE_NUMERIC){
							map.put(arr.get(columnindex), cell.getNumericCellValue());
							if(DateUtil.isCellDateFormatted(cell)){
								map.put(arr.get(columnindex), obj.format( cell.getDateCellValue()));
							}
						}else{
							map.put(arr.get(columnindex), cell + "");
						}

						String value="";
					}

					if(rowindex == 0){
						//엑셀 1번줄 컬럼명 분기 처리
						dataMap.put("header", map);
					}else{
						list.add(map);
					}

				}
				dataMap.put("columnCnt", cells);
			}
			dataMap.put("dataList", list);

		}else if(UtilCommon.mimeType(inputFile).indexOf(".sheet") < 0 && inputFile.substring(inputFile.lastIndexOf(".")+1, inputFile.length()).equals("xls")){

			File inputWorkbook = new File(inputFile);

			inputWorkbook.canRead();

			Workbook w;

			try {
				w = Workbook.getWorkbook(inputWorkbook);
				// Get the first sheet
				w.getSheets();

				String names[] = w.getSheetNames();

				dataMap.put("sheetName", names);

				Sheet sheet = w.getSheet(0);

				dataMap.put("columnCnt", sheet.getColumns());

				ArrayList arr = new ArrayList<>();

				for (int j=0; j < sheet.getRows(); j++) {

					Map map = new LinkedHashMap();

					if(j == 0){
						map.put("idx", "idx");
					}else{
						map.put("idx", j+"");
					}

					for (int i=0; i < sheet.getColumns(); i++) {
						Cell cell = sheet.getCell(i, j);
						CellType type = cell.getType();
						if(j == 0){
							arr.add(cell.getContents());
						}
						map.put(arr.get(i), cell.getContents());
					}

					if(j == 0){
						//엑셀 1번줄 컬럼명 분기 처리
						dataMap.put("header", map);
					}else{
						list.add(map);
					}
				}

				dataMap.put("dataList", list);
				inputWorkbook.exists();
			} catch (Exception e) {
				e.printStackTrace();
			}

		} else if(UtilCommon.mimeType(inputFile).indexOf(".sheet") < 0 && inputFile.substring(inputFile.lastIndexOf(".")+1, inputFile.length()).equals("csv") ){

			try {

				//CSVReader reader = new CSVReader(new FileReader(inputFile));
				CSVReader reader = new CSVReader(new InputStreamReader(new FileInputStream(inputFile), "EUC-KR"));
				String[] s;
				int i = 0;
				ArrayList arr = new ArrayList<>();

				while((s = reader.readNext()) != null){
					Map map = new LinkedHashMap();
					if(i == 0){
						map.put("idx", "idx");
					}else{
						map.put("idx", i+"");
					}
					for(int j=0;j<s.length;j++){
						if(i == 0){
							arr.add(s[j]);
						}
						map.put(arr.get(j), s[j]);
					}
					if(i == 0){
						dataMap.put("header", map);
						dataMap.put("columnCnt", s.length);
					}else{
						list.add(map);
					}
					i++;
				}
				dataMap.put("dataList", list);

			} catch (FileNotFoundException e){
				e.printStackTrace();
			} catch (IOException e){
				e.printStackTrace();
			}
			System.out.println(dataMap);
		}

		return dataMap;
	}
}