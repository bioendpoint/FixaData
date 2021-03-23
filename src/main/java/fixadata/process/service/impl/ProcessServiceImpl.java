package fixadata.process.service.impl;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.transaction.Transactional;

//import org.rosuda.JRI.REXP;
//import org.rosuda.JRI.Rengine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import fixadata.process.mapper.ProcessMapper;
import fixadata.process.service.ProcessService;
import fixadata.rule.mapper.RuleMapper;
import fixadata.util.UtilExcel;
import fixadata.util.UtilJson;
import fixadata.util.UtilR;
import fixadata.util.UtilSession;



@Service("processService")
public class ProcessServiceImpl extends EgovAbstractServiceImpl implements ProcessService {

	private static final Logger LOGGER = LoggerFactory.getLogger(ProcessServiceImpl.class);


	private static final int Object = 0;


	@Resource(name="processMapper")
	private ProcessMapper processDAO;

	@Resource(name="ruleMapper")
	private RuleMapper ruleDAO;


	/* 프로젝트 데이터 컬럼 목록 */
	@Override
	public List selectTempColumnList(Object map) throws Exception {
		return processDAO.selectTempColumnList(map);
	}


	/* 프로젝트 목록 */
	@Override
	public List selectProjectList(Object map) throws Exception {
		return processDAO.selectProjectList(map);
	}


	/* 프로젝트 데이터 목록 */
	@Override
	public Map<String ,Object> tempDataList( Map<String ,Object> map ) throws Exception {
		Map<String ,Object> result	= new HashMap<String, Object>();
		String SESSION_PROJECT_SN			= "";
		String SESSION_PROJECT_NAME			= "";
		String SESSION_TABLE_NAME			= "";
		String SESSION_FILE_NAME			= "";
		String SESSION_TABLE_HEADER			= "";
		String SESSION_TABLE_HEADER_KEY		= "";
		String SESSION_TABLE_HEADER_COUNT	= "";
		String exlHeaderCount	= "";
		String exlHeaderKey		= "";
		String exlHeaderName	= "";
		List<?> listData;
		String WORK_FLOW_DATA	= "";
		String HISTORY_GLOBAL	= "";
		String HISTORY_DIAGRAM	= "";
		String SCORE_DATA		= "";

		if ( UtilSession.getAttribute("SESSION_FILE_NAME") != null ) {
			SESSION_FILE_NAME = UtilSession.getAttribute("SESSION_FILE_NAME").toString();
		}

		if ( SESSION_FILE_NAME.equals("") ) {		// ## if ## 프로젝트 열기 시
			String prjct_sn = ( UtilSession.getAttribute("SESSION_PROJECT_SN") == null ) ? "0" : UtilSession.getAttribute("SESSION_PROJECT_SN").toString();
			map.put( "PRJCT_SN" ,prjct_sn );
			List listProject	= processDAO.selectProjectList(map);		// 프로젝트 목록
			map = (Map)listProject.get(0);

			exlHeaderCount		= Integer.toString( map.get("TEMP_TABLE_HEADER_KEY").toString().split(",").length);
			exlHeaderKey		= map.get("TEMP_TABLE_HEADER_KEY").toString();
			exlHeaderName		= map.get("TEMP_TABLE_HEADER").toString().replaceAll("\\n", "");

			listData			= processDAO.selectTempDataList(map);		// 프로젝트 데이터 목록

			// 프로젝트 오픈상테 세션 값 설정
			SESSION_PROJECT_SN			= map.get("PRJCT_SN").toString();
			SESSION_PROJECT_NAME		= map.get("PRJCT_NM").toString();
			SESSION_TABLE_NAME			= map.get("TEMP_TABLE_NM").toString();
			SESSION_FILE_NAME			= "";
			SESSION_TABLE_HEADER		= exlHeaderName;
			SESSION_TABLE_HEADER_KEY	= exlHeaderKey;
			SESSION_TABLE_HEADER_COUNT	= exlHeaderCount;

			// ##### 작업해야함 ##### 워크플로우 JSON을 조회하여 담아야함
			Map history = new HashMap();

			history = processDAO.selectPrjHistInfo(map);

			map.put("MEMBER_SN", UtilSession.getAttribute("SESSION_USER_SN"));
			map.put("PRJCT_SN", SESSION_PROJECT_SN);

			int score = processDAO.selectScore(map);

			WORK_FLOW_DATA				= history.get("HISTORY_DIAGRAM").toString();
			HISTORY_GLOBAL				= history.get("HISTORY_GLOBAL").toString();
			HISTORY_DIAGRAM				= history.get("HISTORY_DIAGRAM").toString();
			SCORE_DATA					= String.valueOf(score);

		} else {	// ## if ## 파일첨부 시

			String fileName					= UtilSession.getAttribute("SESSION_FILE_NAME").toString();

			File desti						= new File("database");
			UtilExcel exl					= new UtilExcel();
			exl.setInputFile(desti.getAbsolutePath() +"\\"+ fileName);
			map								= exl.read();

			Map<String ,Object> mapHeader	= (Map<String ,Object>) map.get("header");
			exlHeaderCount					= ( Integer.toString((Integer.parseInt(map.get("columnCnt").toString()) + 1)) );

			int fx							= 0;
			for ( String mapkey:mapHeader.keySet() ) {
				exlHeaderKey	+= mapkey.toString();
				exlHeaderName	+= mapHeader.get(mapkey).toString();
				++fx;
				if ( fx < mapHeader.keySet().size() ) {
					exlHeaderKey	+= ",";
					exlHeaderName	+= ",";
				}
			};
			listData = UtilJson.getJsonArrayFromList((List) map.get("dataList"));

			// 프로젝트 오픈상테 세션 값 설정
			SESSION_PROJECT_SN			= "";
			SESSION_PROJECT_NAME		= "";
			SESSION_TABLE_NAME			= "";
			SESSION_FILE_NAME			= fileName;
			SESSION_TABLE_HEADER		= exlHeaderName;
			SESSION_TABLE_HEADER_KEY	= exlHeaderKey;
			SESSION_TABLE_HEADER_COUNT	= exlHeaderCount;
			WORK_FLOW_DATA				= "";
			HISTORY_GLOBAL				= "";
			SCORE_DATA					= "0";
		}

		// Session Setting ( fixadata.util.UtilCommon.projectSession )
		Map<String ,Object> mapSession = new HashMap<String ,Object>();
		mapSession.put( "SESSION_PROJECT_SN"			,SESSION_PROJECT_SN			);
		mapSession.put( "SESSION_PROJECT_NAME"			,SESSION_PROJECT_NAME		);
		mapSession.put( "SESSION_TABLE_NAME"			,SESSION_TABLE_NAME			);
		mapSession.put( "SESSION_FILE_NAME"				,SESSION_FILE_NAME			);
		mapSession.put( "SESSION_TABLE_HEADER"			,SESSION_TABLE_HEADER		);
		mapSession.put( "SESSION_TABLE_HEADER_KEY"		,SESSION_TABLE_HEADER_KEY	);
		mapSession.put( "SESSION_TABLE_HEADER_COUNT"	,SESSION_TABLE_HEADER_COUNT	);
		UtilSession.setProjectSession(mapSession);

		// response
		result.put( "PROJECT_SN"			,SESSION_PROJECT_SN			);
		result.put( "TABLE_NAME"			,SESSION_TABLE_NAME			);
		result.put( "PROJECT_NAME"			,SESSION_PROJECT_NAME		);
		result.put( "FILE_NAME"				,SESSION_FILE_NAME			);
		result.put( "TABLE_HEADER"			,SESSION_TABLE_HEADER		);
		result.put( "TABLE_HEADER_KEY"		,SESSION_TABLE_HEADER_KEY	);
		result.put( "TABLE_HEADER_COUNT"	,SESSION_TABLE_HEADER_COUNT	);
		result.put( "listData"				,listData					);
		result.put( "WORK_FLOW_DATA"		,WORK_FLOW_DATA				);
		result.put( "HISTORY_GLOBAL"		,HISTORY_GLOBAL				);
		result.put( "HISTORY_DIAGRAM"		,HISTORY_DIAGRAM			);
		result.put( "SCORE_DATA"			,SCORE_DATA					);

		return result;
	}


	/* 프로젝트 정보 저장 */
	@SuppressWarnings("unchecked")
	@Override
	public String insertPrjInfo( Map map ) throws Exception {

		String SESSION_USER_SN		= UtilSession.getAttribute("SESSION_USER_SN").toString();
		String SESSION_PROJECT_SN	= "";
		if ( UtilSession.getAttribute("SESSION_PROJECT_SN") != null ) {
			SESSION_PROJECT_SN = UtilSession.getAttribute("SESSION_PROJECT_SN").toString();
		}
		if( SESSION_PROJECT_SN.equals("") ) {

			map.put( "REAL_FILE_NM"				,UtilSession.getAttribute("SESSION_FILE_NAME")			);
			map.put( "TEMP_TABLE_HEADER"		,UtilSession.getAttribute("SESSION_TABLE_HEADER")		);
			map.put( "TEMP_TABLE_HEADER_KEY"	,UtilSession.getAttribute("SESSION_TABLE_HEADER_KEY")	);

			processDAO.insertPrjInfo(map);

			map.put( "TEMP_TABLE_NM" ,"TEMP_TABLE" + map.get("PRJCT_SN").toString() );
			createTempTable(map);

			List<?> listProject	= processDAO.selectProjectList(map);		// 프로젝트 목록
			Map<String ,Object> mapProject = (Map<String ,Object>) listProject.get(0);
			Map<String ,Object> mapSession = new HashMap<String ,Object>();

			// 프로젝트 오픈상테 세션 값 설정
			mapSession.put( "SESSION_PROJECT_SN"			,mapProject.get("PRJCT_SN")												);
			mapSession.put( "SESSION_PROJECT_NAME"			,mapProject.get("PRJCT_NM")												);
			mapSession.put( "SESSION_TABLE_NAME"			,mapProject.get("TEMP_TABLE_NM").toString()								);
			mapSession.put( "SESSION_FILE_NAME"				,""																		);
			mapSession.put( "SESSION_TABLE_HEADER"			,mapProject.get("TEMP_TABLE_HEADER").toString()							);
			mapSession.put( "SESSION_TABLE_HEADER_KEY"		,mapProject.get("TEMP_TABLE_HEADER_KEY").toString()						);
			mapSession.put( "SESSION_TABLE_HEADER_COUNT"	,mapProject.get("TEMP_TABLE_HEADER_KEY").toString().split(",").length	);
			UtilSession.setProjectSession(mapSession);

			// ### 코인 저장
			map.put("MEMBER_SN" ,SESSION_USER_SN);
			processDAO.insertScoreInfo(map);
		}

		map.put("TEMP_TABLE" ,UtilSession.getAttribute("SESSION_TABLE_NAME"));

		String result = "false";
		result = insertTempData(map);

		// ### BlockChain 블록정보 저장
		if ( !result.equals("false") ) {
			int bChainHashCode = Math.abs(map.get("TEMP_TABLE").hashCode());
			String bChainHashCodes = "BCH" + bChainHashCode;
			Map<String ,Object> bChainMap = new HashMap<String ,Object>();
			bChainMap.put("PRJCT_SN_FK"		,SESSION_PROJECT_SN);
			bChainMap.put("MEMBER_SN_FK"	,SESSION_USER_SN);
			bChainMap.put("BCHAIN_HASHCODE" ,bChainHashCodes);

			processDAO.insertBlockchain( bChainMap );
		}

		return result;

	}

	/* 프로젝트 데이터 템프 테이블 생성 */
	@Override
	public String createTempTable(Map map) throws Exception {

		int column_cnt	= Integer.parseInt(UtilSession.getAttribute("SESSION_TABLE_HEADER_COUNT").toString());

		String[] header = UtilSession.getAttribute("SESSION_TABLE_HEADER").toString().split(",");

		String sql		= "CREATE TABLE " + map.get("TEMP_TABLE_NM") + " (HIST_SN INTEGER";

		for ( int i=0; i<column_cnt; i++ ) {
			//sql += ( ",name" + i + (i==0 ? " INTEGER" : " TEXT") );
			/*
			if(i==0){
				sql += ( ",name" + i +   " INTEGER"   );
			} else {
				sql += ( ",name" + i +   " TEXT"  );
			}
			 */
			if(i==0){
				sql += ( "," + header[i] +   " INTEGER"   );
			} else {
				sql += ( "," + header[i] +   " TEXT"  );
			}
		}

		sql += ")";

		map.put("SQL", sql);

		processDAO.createTempTable(map);
		return "true";

	}


	/* 프로젝트 데이터 템프테이블 데이터 저장 */
	@Override
	@Transactional
	public String insertTempData( Map map ) throws Exception {
		if ( UtilSession.getAttribute("SESSION_PROJECT_SN") != null ) {
			String projectSn = (UtilSession.getAttribute("SESSION_PROJECT_SN").toString()).replaceAll(" " ,"");
			if ( "" != projectSn ) {
				map = UtilSession.setProjectSessionMap(map);
			}
		}
		List<?> columnList	= processDAO.selectTempColumnList(map);
		String columnString	= "";
		for( int j=0; j<columnList.size(); j++ ) {
			Map headerMap = new HashMap();
			headerMap = (Map)columnList.get(j);
			columnString += headerMap.get("name").toString();
			if ( j+1 < columnList.size() ) {
				columnString += ",";
			}
		}
		List list = (List)map.get("DATA_LIST");
		int ms = processDAO.selectHistMaxSn(map);
		for(int i=0;i<list.size();i++){
			Map dataMap = new HashMap();
			dataMap = (Map) list.get(i);
			String values = ms + ",";
			String columns = "HIST_SN,";
			Iterator<String> iter = dataMap.keySet().iterator();
			while(iter.hasNext()){
				String keys = iter.next();
				columns += keys + ",";
				values	+= ( (dataMap.get(keys) != null && dataMap.get(keys) != "") ? "\"" + dataMap.get(keys).toString().replaceAll("\"", "'") + "\"" + "," : "''," );
			}
			columns = columns.substring(0, columns.length()-1);
			values = values.substring(0, values.length()-1);
			String sql = "INSERT INTO " + map.get("TEMP_TABLE_NM").toString() + "(" + columns + ") VALUES" + " (" + values +")";
			map.put("SQL", sql);
			processDAO.insertHistData(map);
		}

		map.put("HIST_SN", ms);

		// 히스토리 갯수 제한을 위한 쿼리 및 로직 변경 (유재인)
		processDAO.deleteMinHistSn(map);	// 한방쿼리로 변경

		// 데이터 이상치 검출 텝 내용 저장
		processDAO.insertPrjHistInfo(map);

		return map.get("TEMP_TABLE_NM").toString();

	}


	/* 프로젝트 데이터 최신 버전 가져오기 */
	@Override
	public int selectHistMaxSn(Object map) throws Exception {
		return processDAO.selectHistMaxSn(map);
	}

	/* 프로젝트 이력 데이터 목록 */
	@Override
	public List tempHistDataList(Object map) throws Exception {
		return processDAO.selectTempDataList(map);
	}

	/* SQL Query Parameter 실행 */
	@Override
	public List<?> sql(Map<String ,Object> param) throws Exception {
		return processDAO.sql(param);
	}

	/* BlockChain 목록 가져오기 */
	@Override
	public List<Object> selectBlockchain(Map<String ,Object> requestMap) throws Exception {
		return processDAO.selectBlockchain(requestMap);
	}

	/* 이상치 검출 실행 */
	@Override
	public List<Object> output( LinkedHashMap<String ,Object> paramEvent ,LinkedHashMap<String ,Object> paramGlobal, LinkedHashMap<String ,Object> paramDiagram ) throws Exception {
		Map<String ,Object> requestParam = new HashMap();
		List<Object> response = outputQuery(paramEvent ,paramGlobal, paramDiagram);
		return response;
	}

	@SuppressWarnings("unchecked")
	private List<Object> outputQuery( LinkedHashMap<String ,Object> paramEvent ,LinkedHashMap<String ,Object> paramGlobal,LinkedHashMap<String ,Object> paramDiagram ) throws Exception {
		String evtGubun		= paramEvent.get("Gubun").toString();		// Gubun : 단위결과=0, 전체실행=1
		String evtType		= paramEvent.get("Type").toString();		// Type(단위결과 요청 형태) : 데이터 목록=datalist, 차트=chart, 통계=stat
		String evtId		= paramEvent.get("Id").toString();			// 룰 Cell 고유 아이디(Key 값으로 사용)
		String evtRuleSn	= paramEvent.get("RuleSn").toString();		// DB Rule Table 고유값(Primary Key)
		String evtRuleType	= paramEvent.get("RuleType").toString();	// 룰 형태: DB=00, 룰=01, 필터=02, R=03, D3=04
		String queryFilter	= "";
		String queryRule	= "";
		String query		= "";
		String queryAll		= "";

		//score 용도
		int    score		= 0	;
		ArrayList ruleSnList= new ArrayList<>();

		Map<String ,Object> stat = new HashMap<String ,Object>();

		Map<String ,Object> R_Param 	= new HashMap<String ,Object>();
		List<Object> response			= new ArrayList<Object>();
		String	typeBefore				= "";
		Boolean	memoDefine				= false;
		Map<String ,Object> memoRowTmp	= new HashMap<String ,Object>();


		Map<String ,Object> statCount	= new HashMap<String ,Object>();

		String typeLast = "09";

		String idNow = "";
		for ( String keys : paramGlobal.keySet() ) {
			Map<String ,Object> rowTmp = (Map<String, Object>) paramGlobal.get(keys);

			String	queryTmp		= "";
			String	ruleSn			= rowTmp.get("Rule").toString();
			idNow			= rowTmp.get("Id").toString();
			String	typeNow			= rowTmp.get("Type").toString();
			String	columnNow		= rowTmp.get("Column").toString();
			String	useDefine		= rowTmp.get("UseDefineQuery").toString();
			Boolean	useDefineTmp	= ( "".equals(useDefine) ) ? false : true;	// ture=사용자 정의 실행, false=기본 룰 실행
			String	useDefineAnd	= (useDefineTmp) ? " " : " AND ";

			if(ruleSn != null && !ruleSn.equals("")){
				ruleSnList.add(ruleSn);
			}
			if(ruleSnList.indexOf(ruleSn) >= 0){
				score += 1;
			}

			Map<String ,Object> countMap = new HashMap<String ,Object>();
			countMap.put("TEMP_TABLE_NM" ,UtilSession.getAttribute("SESSION_TABLE_NAME"));

			LinkedHashMap<String ,Object> responseQuery = new LinkedHashMap<String ,Object>();
			if ( "01".equals(typeNow) ) {
				queryFilter		= "";
				query			= "";
				responseQuery	= outputUseDefine( rowTmp ,ruleSn ,typeNow ,columnNow ,useDefineTmp );
				queryTmp		= responseQuery.get("query").toString();
				queryRule		= useDefineAnd + queryTmp;
				memoDefine		= useDefineTmp;
				memoRowTmp		= rowTmp;

				Map<String ,Object>				ruleMap		= new HashMap<String ,Object>();					ruleMap.put("RULE_SN" ,ruleSn);
				List<Map<String ,Object>>		dbRuleInfo	= ruleDAO.selectRuleList( ruleMap );
				String							ruleRegexp	= dbRuleInfo.get(0).get("RULE_CONT").toString();

				String[] tmpArrColumn = columnNow.split(",");
				for ( int cx=0; cx<tmpArrColumn.length; ++cx) {
					String tmpColumnNowKey = tmpArrColumn[cx].toString();

					countMap.put("sql" ," AND " + tmpColumnNowKey + " " + ruleRegexp);

					int tmpCount	= processDAO.selectHistCnt(countMap);
					if (statCount.containsKey(tmpColumnNowKey)) {
						tmpCount	= tmpCount + (int)statCount.get(tmpColumnNowKey);
					}
					statCount.put(tmpColumnNowKey ,tmpCount);
				}
			} else if ( "02".equals(typeNow) ) {
				responseQuery	= outputUseDefine( rowTmp ,ruleSn ,typeNow ,columnNow ,useDefineTmp );
				queryTmp		= useDefineAnd + responseQuery.get("query").toString();
				queryFilter		+= useDefineAnd + queryTmp;
				memoDefine		= useDefineTmp;
				memoRowTmp		= rowTmp;
			} else if ( "03".equals(typeNow) ) {
				String rdata	= rowTmp.get("Rdata").toString();
				String[] rData	= (rdata.split(","));
				for(int i=0;i<rData.length;++i){
					R_Param.put("PARAM" + i, rData[i]);
				}
			}

			query				= queryFilter + queryRule;
			Boolean tmpBreak	= ( evtId.equals(idNow) ) ? true : false;

			if ( tmpBreak && "datalist".equals(evtType) && idNow.equals(evtId) ) {
				String tmpQuery = queryRule + ( "01".equals(typeNow) ? "" : queryTmp );
				response = outputDataList(tmpQuery);
				break;
			}

			if ( tmpBreak && "04".equals(typeNow) && idNow.equals(evtId) ) {
				if ( "03".equals(typeBefore) ) {

					response = outputRscript( R_Param ," AND NOT(1=1 " + query + ")" );

				} else {
					response = outputChart( memoRowTmp ,memoDefine ,query ,queryRule ,queryFilter );
				};
				break;
			}

			queryAll	+= query;
			typeBefore	= typeNow;
			typeLast	= typeNow;
		}

		if ( "1".equals(evtGubun) ) {
			String header			= UtilSession.getAttribute("SESSION_TABLE_HEADER").toString();
			String headerKey		= UtilSession.getAttribute("SESSION_TABLE_HEADER_KEY").toString();
			String[] headerKeyArr	= headerKey.split(",");
			Map<String ,Object> requestMap = new HashMap<String ,Object>();
			requestMap.put("TEMP_TABLE_NM" ,UtilSession.getAttribute("SESSION_TABLE_NAME"));

			String TEMP_CHECK_COLUMN	= "";
			String TEMP_COLUMN_NM		= "";
			for ( int fx=1; fx<headerKeyArr.length; ++fx ) {
				TEMP_CHECK_COLUMN	+= "(SELECT " + headerKeyArr[fx] + " GLOB '*[^0-9.]*' FROM " + UtilSession.getAttribute("SESSION_TABLE_NAME") + ") " + headerKeyArr[fx];
				TEMP_COLUMN_NM		+= headerKeyArr[fx];
				if ( fx + 1<headerKeyArr.length ) {
					TEMP_CHECK_COLUMN	+= ",";
					TEMP_COLUMN_NM		+= ",";
				};
			}
			requestMap.put("TEMP_CHECK_COLUMN"	,TEMP_CHECK_COLUMN);
			requestMap.put("TEMP_COLUMN_NM"		,TEMP_COLUMN_NM);

			int statTotal = processDAO.selectHistCnt(requestMap);

			requestMap.put("queryWhere" ,"NOT(1=1" + queryAll + ")");
			requestMap.put("column" ,headerKey);
			processDAO.insertOutput(requestMap);

			//추후 수정 요망
			requestMap.put("PRJCT_SN", UtilSession.getAttribute("SESSION_PROJECT_SN"));
			requestMap.put("DATA_DIAGRAM", UtilJson.toJson(paramDiagram).toJSONString());
			requestMap.put("DATA_GLOBAL", UtilJson.toJson(paramGlobal).toJSONString());
			processDAO.insertPrjHistInfo(requestMap);

			requestMap.put("MEMBER_SN", UtilSession.getAttribute("SESSION_USER_SN"));
			requestMap.put("PRJCT_SCORE", score);
			processDAO.updateScore(requestMap);

			List<?> rDataList = processDAO.selectTempDataList(requestMap);

			List<?> tempOutputList;

			Map timeMap = new HashMap();

			if ( "05".equals(typeLast) ) {

				Map<String ,Object> rowTmp = (Map<String, Object>) paramGlobal.get(idNow);

				String[] timeParam = rowTmp.get("TimeChart").toString().split(",");

				Map map = new HashMap();
				map.put("SEL_TIME", timeParam[0]);
				map.put("BASIC_PARAM", timeParam[1]);
				/*
				map.put("SEL_TIME", "TravelDate");
				map.put("BASIC_PARAM", "Passengers");
				 */
				timeMap = UtilR.outPutResultTime(map, rDataList);
				tempOutputList	= processDAO.selectOutputList(requestMap);
			} else {
				tempOutputList	= processDAO.selectOutputList(requestMap);
			}

			score = processDAO.selectScore(requestMap);

			stat.clear();
			stat = statCount;

			String rScriptStr		= "";
			String rScriptSummary	= "";

			Map resultRMap = UtilR.outPutResult(rDataList);

			rScriptStr		= resultRMap.get("result1").toString();
			rScriptSummary	= resultRMap.get("result2").toString();

			response.clear();

			response.add(stat);
			response.add(statTotal);
			response.add(header);
			response.add("statTypeOne");
			response.add(tempOutputList);
			response.add(rScriptStr);
			response.add(rScriptSummary);
			response.add(score);
			response.add(typeLast);
			response.add(timeMap);
		}

		return response;
	};

	private LinkedHashMap<String ,Object> outputUseDefine( Map<String ,Object> paramRowTmp ,String paramRuleSn ,String paramTypeNow ,String paramColumnNow ,Boolean paramUseDefineTmp ) throws Exception {
		LinkedHashMap<String ,Object>	response	= new LinkedHashMap<String ,Object>();
		String							query		= "";

		if ( paramUseDefineTmp ) {
			query = paramRowTmp.get("UseDefineQuery").toString();
			response.put("query" ,query);
		} else {
			response = outputColumnFor( paramRuleSn ,paramColumnNow );
			if ( "01".equals(paramTypeNow) ) {	// 룰일 경우 소괄호 안에 넣어준다
				query = "(" + response.get("query") + ")";
				response.put("query" ,query);
			}
		}

		return response;
	}

	private LinkedHashMap<String ,Object> outputColumnFor(String paramRuleSn ,String paramColumnNow) throws Exception {
		LinkedHashMap<String ,Object>	response		= new LinkedHashMap<String ,Object>();
		Map<String ,Object>				requestMap		= new HashMap<String ,Object>();					requestMap.put("RULE_SN" ,paramRuleSn);
		List<Map<String ,Object>>		dbRuleInfo		= ruleDAO.selectRuleList( requestMap );
		String							ruleGubun		= dbRuleInfo.get(0).get("RULE_GB").toString();
		String							ruleRegexp		= dbRuleInfo.get(0).get("RULE_CONT").toString();
		String							queryAnd		= ( "01".equals(ruleGubun) ) ? "OR" : "AND";
		String[]						columnNowArr	= paramColumnNow.split(",");
		String							query			= "";
		for ( int fx=0; fx<columnNowArr.length; ++fx ) {
			query += ( " " + columnNowArr[fx].toString() + " " + ruleRegexp);
			if ( fx<columnNowArr.length-1 ) {
				query += " " + queryAnd;
			}
		}
		response.put("query"	,query);
		return response;
	}

	private List<Object> outputChart( Map<String ,Object> memoRowTmp ,Boolean memoDefine ,String query ,String queryRule ,String queryFilter ) throws Exception {
		List<Object>		response		= new ArrayList<Object>();
		Map<String ,Object> stat			= new HashMap<String ,Object>();
		Map<String ,Object>	requestParam	= new HashMap<String ,Object>();
		requestParam.put("TEMP_TABLE_NM"	,UtilSession.getAttribute("SESSION_TABLE_NAME"));
		int statTotal = processDAO.selectHistCnt(requestParam);

		if ( memoDefine ) {
			String[]	useDefineQueryArr	= memoRowTmp.get("UseDefineQuery").toString().split("AND");
			String		tmpColumn			= "";
			Map<String ,Object> tmpQuery	= new HashMap<String ,Object>();
			for ( int fx=1; fx<useDefineQueryArr.length; ++fx ) {
				String[]	useDefineQueryArrRow	= useDefineQueryArr[fx].toString().split("[=><]|(LIKE)|(!=)|(>=)|(<=)");
				tmpColumn							= useDefineQueryArrRow[0].toString().replaceAll(" " ,"");

				if ( tmpQuery.get(tmpColumn)==null ) {
					tmpQuery.put(tmpColumn ,useDefineQueryArr[fx]);
				} else {
					tmpQuery.put(tmpColumn ,tmpQuery.get(tmpColumn) + " OR " + useDefineQueryArr[fx]);
				}
			}
			for ( String key : tmpQuery.keySet() ) {
				requestParam.put("sql" ," AND " + tmpQuery.get(key));
				int statOutlier = processDAO.selectHistCnt(requestParam);
				stat.put(key ,Integer.toString(statOutlier));
			}
		} else {
			String						ruleSn			= memoRowTmp.get("Rule").toString();
			Map<String ,Object>			requestMap		= new HashMap<String ,Object>();					requestMap.put("RULE_SN" ,ruleSn);
			List<Map<String ,Object>>	dbRuleInfo		= ruleDAO.selectRuleList( requestMap );
			String						ruleRegexp		= dbRuleInfo.get(0).get("RULE_CONT").toString();
			String[] 					tmpColumnArr	= memoRowTmp.get("Column").toString().split(",");
			for ( int fx=0; fx<tmpColumnArr.length; ++fx ) {
				requestParam.put("sql" ," AND " + tmpColumnArr[fx] + " " + ruleRegexp);
				int statOutlier = processDAO.selectHistCnt(requestParam);
				stat.put(tmpColumnArr[fx] ,statOutlier);
			}
		};
		response.add(stat);
		response.add(statTotal);
		response.add("");
		response.add("StatTypeOne");

		return response;
	}

	private List<Object> outputDataList(String paramQuery) throws Exception {
		Map<String ,Object> requestMap = new HashMap<String ,Object>();
		requestMap.put("sql" ,paramQuery);
		requestMap.put("TEMP_TABLE_NM" ,UtilSession.getAttribute("SESSION_TABLE_NAME"));
		List<Object> response = processDAO.selectTempDataList(requestMap);
		return response;
	}

	private List<Object> outputRscript( Map<String ,Object> map ,String paramQuery ) throws Exception {

		map.put("TEMP_TABLE_NM", UtilSession.getAttribute("SESSION_TABLE_NAME"));
		map.put("sql" ,paramQuery);

		List<Object> data = processDAO.selectTempDataList(map);
		List list = new ArrayList<>();

		if ( data.size()==0 ) {
			list.add("");
			list.add("");
			list.add("");
			list.add("LogisticTypeOne");
			return list;
		};


		if(map.get("PARAM0").toString().equals("1")){
			list = UtilR.logisticTypeOne(map, data);
		}else if(map.get("PARAM0").toString().equals("2")){
			list = UtilR.clusterTypeOne(map, data);
		}

		return list;
	};
}