package fixadata.util;

import java.io.File;
import java.io.FileOutputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import fixadata.common.EgovProperties;

public class UtilExcelDown {

	//    private static final String CONTENT_TYPE = "application/vnd.ms-excel";

	public void renderMergedOutputModel(ArrayList<Map<String, Object>> param, HttpServletRequest request,HttpServletResponse response) {
		FileOutputStream fileoutputStream = null;
		try {
			// Workbook 생성
			XSSFWorkbook xlsWb = new XSSFWorkbook(); // Excel 2007 이전 버전
			Workbook xlsxWb = new XSSFWorkbook(); // Excel 2007 이상

			//탭의 갯수만큼 sheet를 초기화할 배열크기를 결정
			Sheet sheet1[] = new Sheet[param.size()];
			//엑셀 저장파일명 선언
			String fileName = "";
			//엑셀의 sheet명 선언
			String sheetName = "";
			String dataType = "";
			//엑셀의 헤더 리스트 변수 선언
			ArrayList header = null;
			//엑셀의 데이터 값 리스트 변수 선언
			List dataList = null;
			List tbData = null;
			//Cell 스타일 변수 선언
			CellStyle cellStyle = null;
			//탭 생성 갯수만큼 반복 하여 sheet생성
			for(int i=0; i<param.size(); i++) {
				//파일명 초기화
				fileName = (String) param.get(i).get("fileName");
				//시트명 초기화
				sheetName = String.valueOf(param.get(i).get("sheetName"));

				dataType =  String.valueOf(param.get(i).get("dataType"));
				//헤더 리스트 초기화
				header = (ArrayList) param.get(i).get("header");
				//데이터 리스트 초기화
				dataList = (List) param.get(i).get("dataList");
				if(null !=param.get(i).get("tbData"))
					tbData = (List) param.get(i).get("tbData");

				// *** Sheet-------------------------------------------------
				sheet1[i] = xlsxWb.createSheet( String.valueOf(sheetName+ "("+(i+0)+")"));
				// Sheet 생성

				// 컬럼 너비 설정
				sheet1[i].setColumnWidth(0, 10000);
				sheet1[i].setColumnWidth(9, 10000);

				// ----------------------------------------------------------

				// *** Style--------------------------------------------------
				// Cell 스타일 생성
				cellStyle = xlsxWb.createCellStyle();

				// 줄 바꿈
				cellStyle.setWrapText(true);

				// Cell 색깔, 무늬 채우기
				cellStyle.setFillForegroundColor(HSSFColor.LIME.index);
				cellStyle.setFillPattern(CellStyle.BIG_SPOTS);

				Row row = null;
				Cell cell = null;
				int rowNo = 0;
				//----------------------------------------------------------
				if(null == tbData) {
					// 첫 번째 줄
					row = sheet1[i].createRow(rowNo++);

					//헤더 리스트
					for(int j= 0 ; j < header.size(); j++) {
						cell = row.createCell(j);
						cell.setCellValue(String.valueOf(header.get(j)));
					}
				}

				//데이터 리스트
				int count = 1;
				int cellCnt = 0;
				int count2 = 0 ;


				if(null == tbData) {
					//데이터 수 만큼 반복 수행
					for(int k=0;k<dataList.size();k++){
						//순차적 시트 row생성
						row = sheet1[i].createRow(count);
						//데이터값 맵형태로 초기화
						Map<String ,Object> map = (Map<String, Object>) dataList.get(k);

						//엑셀 헤더라인을 생성
						for(int l= 0 ; l < header.size(); l++) {
							cell = row.createCell(cellCnt++);
							cell.setCellValue(""+map.get(String.valueOf(header.get(l))).toString());
						}
						cellCnt = 0;
						//처리후 증가
						count2 = count++;

					}
				}else if("04".equals(dataType)){

					for(int j = 0; j<tbData.size(); j++) {

						row = sheet1[i].createRow(++count2);
						//데이터값 맵형태로 초기화
						Map<String ,Object> map = (Map<String, Object>) tbData.get(j);

						if(j == 0 ) {

							int cont = 0;
							for(String mapkey : map.keySet()) {
								String value = (String) map.get(mapkey);


								cell = row.createCell(cellCnt++);
								cell.setCellValue(""+mapkey);
								cell = row.createCell(cellCnt++);
								cell.setCellValue(""+value);

								if((cont % 3) == 2) {
									row = sheet1[i].createRow(++count2);
									cellCnt = 0;
								}

								cont++;
							}

						} else {

							for(String mapkey : map.keySet()) {
								if("1".equals(mapkey) || "3".equals(mapkey)|| "4".equals(mapkey)) {
									row = sheet1[i].createRow(++count2);
									cellCnt = 0;

								}

								cell = row.createCell(cellCnt++);
								cell.setCellValue(""+map.get(mapkey));

							}

						}
						//엑셀 헤더라인을 생성

						cellCnt = 0;
						count2++;

					}
				}
			}

			response.setCharacterEncoding("UTF-8");
			response.setHeader("Content-Disposition", String.format("attachment; filename=", URLEncoder.encode(fileName,"UTF-8")));
			response.setContentType("application/vnd.ms-excel");

			//실서버 적용시 globals.properties에서 파일 업로드 위치 경로를 변경해줘야 한다.
			String fileUpload = EgovProperties.getProperty("Globals.upload");
			File derectory = new File(fileUpload);

			//해당 결로에 폴더가 없다면 생성
			if(!derectory.isDirectory()) {
				derectory.mkdir();
			}
			//엑셀 파일을 생성
			File xlsFile = new File(fileUpload+fileName);
			fileoutputStream  =  new FileOutputStream(xlsFile);
			xlsxWb.write(fileoutputStream);

		}catch(Exception e) {
			e.printStackTrace();

		}finally {
			if (fileoutputStream != null) {
				try {
					fileoutputStream.close();
				} catch (Exception ignore) {

				}
			}
		}
	}
}
