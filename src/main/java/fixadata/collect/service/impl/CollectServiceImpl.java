package fixadata.collect.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import fixadata.collect.mapper.CollectMapper;
import fixadata.collect.service.CollectService;
import fixadata.collect.vo.baseDataVO;
import fixadata.collect.vo.collectVO;
import fixadata.collect.vo.dbInfoVO;
import fixadata.collect.vo.scheduleDataVO;
import fixadata.collect.vo.scheduleVO;
import fixadata.collect.vo.tbProjectDataVO;
import fixadata.collect.vo.tbProjectVO;
import fixadata.collect.vo.versionInfoVO;
import fixadata.common.commonVO.jsonResultVO;
import fixadata.util.UtilDb;
import fixadata.util.UtilFiles;
import fixadata.util.UtilJson;
import fixadata.util.UtilSession;

@Service("collectService")
public class CollectServiceImpl extends EgovAbstractServiceImpl implements CollectService {

	@Resource(name="collectMapper")
	private CollectMapper collectMapper;

	/**
	 * 디비 정보 등록
	 */
	@Override
	public int insertDbInfo(dbInfoVO vo) throws Exception {
		String member_sn = (String) UtilSession.getAttribute("SESSION_USER_SN");
		vo.setMember_sn(member_sn);
		return collectMapper.insertDbInfo(vo);
	}

	/**
	 * db정보 수정
	 */
	@Override
	public int updateDbInfo(dbInfoVO vo) throws Exception {
		return collectMapper.updateDbInfo(vo);
	}

	/**
	 * 사용자에게 등록된 db정보 추출
	 */
	@Override
	public List<dbInfoVO> selectDbList(dbInfoVO vo) throws Exception {
		String member_sn = (String) UtilSession.getAttribute("SESSION_USER_SN");
		vo.setMember_sn(member_sn);
		return collectMapper.selectDbList(vo);
	}

	/**
	 * db_sn기준으로 데이터 추출
	 */
	@Override
	public dbInfoVO selectDbInfoBySn(dbInfoVO vo) throws Exception {
		return collectMapper.selectDbInfoBySn(vo);
	}

	/**
	 * 데이터 수집 처리 로직
	 * @param uploadFile
	 * @return
	 * @throws Exception
	 */
	@Override
	public int collectUploadProcess(collectVO collectVO) throws Exception {
		// 결과 값 변수
		int result = 0 ;
		// MEMBERSN 변수
		int member_sn = Integer.parseInt((String) UtilSession.getAttribute("SESSION_USER_SN"));

		//파일 업로드 데이터 수집
		if(collectVO.getCollect_flag().equals("file")) {
			tbProjectVO tbProjectVO = new tbProjectVO();
			//프로젝트 정보 등록
			tbProjectVO.setMember_sn(member_sn);
			tbProjectVO.setFlag(0);

			// PROJECT TABLE DATA 등록
			collectMapper.insertTbProject(tbProjectVO);

			tbProjectDataVO tbProjectDataVO = new tbProjectDataVO();

			//파일 업로드 처리
			jsonResultVO jsonResult = new jsonResultVO();
			jsonResult = UtilFiles.uploadFileParse(collectVO.getUploadFile(),collectVO.getSheetIndex());

			JSONArray header = new JSONArray();
			//헤더 정보 가공
			for(String str : jsonResult.getHeader())
			{
				header.add(str);
			}

			JSONArray list = UtilJson.getJsonArrayFromList(jsonResult.getData());

			//세션에 PROJECT SN 정보 입력
			UtilSession.setAttribute("SESSION_PROJECT_SN",tbProjectVO.getProject_sn());
			//프로젝트 데이터 정보 등록
			tbProjectDataVO.setProject_sn(tbProjectVO.getProject_sn());
			tbProjectDataVO.setData(list.toJSONString());
			tbProjectDataVO.setData_version(0);
			tbProjectDataVO.setHeader(header.toJSONString());
			tbProjectDataVO.setStep("C");

			// PROJECT_DATA TABLE 데이터 등록 후 result값 반환
			result = collectMapper.insertTbProjectData(tbProjectDataVO);

			// 세션에 PROJECT_DATA_SN 정보 입력
			UtilSession.setAttribute("SESSION_PROJECT_DATA_SN",tbProjectDataVO.getProject_data_sn());

			// DB연결을 통한 데이터 수집
		}else if(collectVO.getCollect_flag().equals("db")){
			tbProjectVO tbProjectVO = new tbProjectVO();

			//프로젝트 임시 정보 입력
			tbProjectVO.setMember_sn(member_sn);
			tbProjectVO.setFlag(0);
			collectMapper.insertTbProject(tbProjectVO);

			tbProjectDataVO tbProjectDataVO = new tbProjectDataVO();

			//파일 업로드 처리
			jsonResultVO jsonResult = new jsonResultVO();

			dbInfoVO dbInfoVO = new dbInfoVO();
			UtilDb db = new UtilDb();

			UtilSession.setAttribute("SESSION_PROJECT_SN",tbProjectVO.getProject_sn());

			dbInfoVO.setDb_sn(collectVO.getDb_sn());
			dbInfoVO dbInfo = selectDbInfoBySn(dbInfoVO);
			db.ConnectionInfo(dbInfo.getDriver(), dbInfo.getUrl(), dbInfo.getId(), dbInfo.getPw());

			//설정된 테이블의 n개의 데이터 추출
			List<Map<String,Object>> list = db.listQueryLimitN(dbInfo, "select rownum idx, tb.* from "+collectVO.getTable()+" tb", collectVO.getLimit());

			//추출된 데이터를 json 으로 변경
			JSONArray jsonList = UtilJson.getJsonArrayFromList(list);

			//관련 필드 정보 추출
			List<Map<String, Object>> fieldList = db.fieldQuery(dbInfo, collectVO.getTable());

			JSONArray header = new JSONArray();
			header.add("idx");
			for(Map<String,Object> m  : fieldList)
			{
				header.add(String.valueOf(m.get("COLUMN_NAME")));
			}

			String jsonString = jsonResult.toString();

			tbProjectDataVO.setProject_sn(tbProjectVO.getProject_sn());
			tbProjectDataVO.setData(jsonList.toJSONString());
			tbProjectDataVO.setData_version(0);
			tbProjectDataVO.setHeader(header.toJSONString());
			tbProjectDataVO.setStep("C");
			result = collectMapper.insertTbProjectData(tbProjectDataVO);

			UtilSession.setAttribute("SESSION_PROJECT_DATA_SN",tbProjectDataVO.getProject_data_sn());
			//스케줄러 데이터 분석 처리
		}else if(collectVO.getCollect_flag().equals("schedule")){

			tbProjectVO tbProjectVO = new tbProjectVO();
			//프로젝트 정보 등록
			tbProjectVO.setMember_sn(member_sn);
			tbProjectVO.setFlag(0);

			//PROJECT TABLE DATA 등록
			collectMapper.insertTbProject(tbProjectVO);

			tbProjectDataVO tbProjectDataVO = new tbProjectDataVO();

			scheduleDataVO dataVO = new scheduleDataVO();

			dataVO.setSchedule_data_sn(collectVO.getSchedule_data_sn());

			scheduleDataVO resultDataVo = collectMapper.selectScheduleDataByScheduSn(dataVO);

			JSONParser parser = new JSONParser();
			JSONArray headerJsonArray = (JSONArray)parser.parse(resultDataVo.getHeader());
			JSONArray dataJsonArray = (JSONArray)parser.parse(resultDataVo.getData());

			//세션에 PROJECT SN 정보 입력
			UtilSession.setAttribute("SESSION_PROJECT_SN",tbProjectVO.getProject_sn());
			//프로젝트 데이터 정보 등록
			tbProjectDataVO.setProject_sn(tbProjectVO.getProject_sn());
			tbProjectDataVO.setData(dataJsonArray.toJSONString());
			tbProjectDataVO.setData_version(0);
			tbProjectDataVO.setHeader(headerJsonArray.toJSONString());
			tbProjectDataVO.setStep("C");

			//PROJECT_DATA TABLE 데이터 등록 후 result값 반환
			result = collectMapper.insertTbProjectData(tbProjectDataVO);

			//세션에 PROJECT_DATA_SN 정보 입력
			UtilSession.setAttribute("SESSION_PROJECT_DATA_SN",tbProjectDataVO.getProject_data_sn());

			//샘플 데이터 데이터 수집
		}else {

			baseDataVO baseDataVO = new baseDataVO();

			baseDataVO.setBase_data_sn(collectVO.getBase_data_sn());

			List<baseDataVO> sampleList = collectMapper.selectSampleList(baseDataVO);

			tbProjectVO tbProjectVO = new tbProjectVO();
			//프로젝트 정보 등록
			tbProjectVO.setProject_name(null);
			tbProjectVO.setMember_sn(member_sn);
			tbProjectVO.setFlag(0);

			//PROJECT TABLE DATA 등록
			collectMapper.insertTbProject(tbProjectVO);

			tbProjectDataVO tbProjectDataVO = new tbProjectDataVO();

			//세션에 PROJECT SN 정보 입력
			UtilSession.setAttribute("SESSION_PROJECT_SN",tbProjectVO.getProject_sn());

			//프로젝트 데이터 정보 등록
			tbProjectDataVO.setProject_sn(tbProjectVO.getProject_sn());
			tbProjectDataVO.setData(sampleList.get(0).getData());
			tbProjectDataVO.setData_version(0);
			tbProjectDataVO.setHeader(sampleList.get(0).getHeader());
			tbProjectDataVO.setStep("C");

			//PROJECT_DATA TABLE 데이터 등록 후 result값 반환
			result = collectMapper.insertTbProjectData(tbProjectDataVO);

			//세션에 PROJECT_DATA_SN 정보 입력
			UtilSession.setAttribute("SESSION_PROJECT_DATA_SN",tbProjectDataVO.getProject_data_sn());
		}
		return result;
	}
	@Override
	public void collectimportProcess(tbProjectVO tbProjectVO, Map<String, Object> jsonData) throws Exception {

		//PROJECT TABLE DATA 등록
		int resultCnt = collectMapper.insertTbProject(tbProjectVO);
		tbProjectDataVO tbProjectDataVO = new tbProjectDataVO();
		JSONArray list = UtilJson.getJsonArrayFromList((List<?>) jsonData.get("data"));
		List headerList = (List)jsonData.get("header");
		List<HashMap> headerOptionList = (List<HashMap>)jsonData.get("header_option");

		JSONArray header = new JSONArray();
		JSONArray header_option = new JSONArray();
		int maxProjectSn = 0;
		int maxProjectDataSn = 0;

		//헤더 정보 가공
		for(Object str: headerList)
		{
			header.add(String.valueOf(str));
		}

		for(Object str: headerOptionList)
		{
			header_option.add(str);
		}
		if(resultCnt == 1) {
			maxProjectSn = collectMapper.selectMaxProjectSn();
			maxProjectDataSn = collectMapper.selectMaxProjectDataSn();
			tbProjectDataVO.setProject_sn(maxProjectSn);
			tbProjectDataVO.setProject_data_sn(maxProjectDataSn);
			tbProjectDataVO.setData(list.toJSONString());
			tbProjectDataVO.setData_version(0);
			tbProjectDataVO.setHeader(header.toJSONString());
			tbProjectDataVO.setHeader_option(header_option.toJSONString());
			tbProjectDataVO.setDiagram_layout(String.valueOf(jsonData.get("diagram_layout")));
			tbProjectDataVO.setBlockchain(String.valueOf(jsonData.get("blockchain")));
			tbProjectDataVO.setStep("C");
			int result = collectMapper.insertTbProjectData(tbProjectDataVO);
		}
		UtilSession.setAttribute("SESSION_PROJECT_SN",String.valueOf(maxProjectSn));
		UtilSession.setAttribute("SESSION_PROJECT_DATA_SN",String.valueOf(maxProjectDataSn));
	}

	/**
	 * 데이터 수집 처리 로직
	 * @param uploadFile
	 * @return
	 * @throws Exception
	 */
	@Override
	public int collectStandardVocaUploadProcess(collectVO collectVO) throws Exception {
		//결과 값 변수
		int result = 0 ;
		//MEMBERSN 변수
		//int member_sn = Integer.parseInt((String) UtilSession.getAttribute("SESSION_USER_SN"));

		//파일 업로드 표준 데이터
		baseDataVO baseDataVO = new baseDataVO();
		//프로젝트 정보 등록

		//baseDataVO.setMember_sn(member_sn);
		baseDataVO.setFlag(collectVO.getFlag());

		//tbProjectDataVO tbProjectDataVO = new tbProjectDataVO();

		//파일 업로드 처리
		jsonResultVO jsonResult = new jsonResultVO();
		jsonResult = UtilFiles.uploadFileParse(collectVO.getUploadFile(),0);

		JSONArray header = new JSONArray();
		//헤더 정보 가공
		for(String str : jsonResult.getHeader())
		{
			header.add(str);
		}
		JSONArray list = UtilJson.getJsonArrayFromList(jsonResult.getData());
		baseDataVO.setData(list.toJSONString());
		baseDataVO.setHeader(header.toJSONString());
		if(collectVO.getFlag() == 0) {
			baseDataVO.setData_name("표준용어데이터");
		}else if(collectVO.getFlag() == 1) {
			baseDataVO.setData_name("행정표준코드");
		}else if(collectVO.getFlag() == 2){
			baseDataVO.setData_name("코드 도메인");
		}
		int chkCnt = collectMapper.selectChkBaseData(baseDataVO);
		if(chkCnt > 0) {
			result = collectMapper.updateBaseData(baseDataVO);
		}else {
			//PROJECT_DATA TABLE 데이터 등록 후 result값 반환
			result = collectMapper.insertBaseData(baseDataVO);
		}
		return result;
	}

	@Override
	public List<tbProjectVO> selectProjectList(tbProjectVO vo) throws Exception {
		return collectMapper.selectProjectList(vo);
	}
	@Override
	public tbProjectDataVO selectProjectDataInfo(tbProjectDataVO vo) throws Exception {
		return collectMapper.selectProjectDataInfo(vo);
	}
	@Override
	public int selectProjectDataInfoCnt(tbProjectDataVO vo) throws Exception {
		return collectMapper.selectProjectDataInfoCnt(vo);
	}
	@Override
	public List<tbProjectDataVO> selectProjectDataVersionList(tbProjectDataVO vo) throws Exception {
		return collectMapper.selectProjectDataVersionList(vo);
	}

	/**
	 * 임시 프로젝트 및 데이터 삭제 로직
	 */
	@Override
	public void tmpProjectDataDelete(String globalDay) throws Exception {

		tbProjectVO tbProjectVO = new tbProjectVO();

		tbProjectVO.setInsert_dt(globalDay);
		//project 테이블 데이터 삭제
		collectMapper.deleteProject(tbProjectVO);
		//projectData 테이블 데이터 삭제
		collectMapper.deleteProjectData(tbProjectVO);
	}

	/**
	 * 샘플 리스트
	 */
	@Override
	public List<baseDataVO> selectSampleList(baseDataVO baseDataVO) throws Exception {
		return collectMapper.selectSampleList(baseDataVO);
	}
	@Override
	public List<baseDataVO> selectStandardList(baseDataVO baseDataVO) throws Exception {
		if(baseDataVO.getFlag() == 0) {
			baseDataVO.setData_name("표준용어데이터");
		}else if(baseDataVO.getFlag() == 1) {
			baseDataVO.setData_name("행정표준코드");
		}else if(baseDataVO.getFlag() == 2){
			baseDataVO.setData_name("코드 도메인");
		}
		return collectMapper.selectStandardList(baseDataVO);
	}
	@Override
	public List<baseDataVO> selectCordDomainList(baseDataVO baseDataVO) throws Exception {
		if(baseDataVO.getFlag() == 0) {
			baseDataVO.setData_name("표준용어데이터");
		}else if(baseDataVO.getFlag() == 1) {
			baseDataVO.setData_name("행정표준코드");
		}else if(baseDataVO.getFlag() == 2){
			baseDataVO.setData_name("코드 도메인");
		}
		return collectMapper.selectCordDomainList(baseDataVO);
	}
	@Override
	public int selectProjectDataListCnt(tbProjectVO vo) throws Exception {
		return collectMapper.selectProjectDataListCnt(vo);
	}
	@Override
	public int selectProjectDataSn(tbProjectDataVO vo) throws Exception {
		return collectMapper.selectProjectDataSn(vo);
	}

	@Override
	public int standardInsert(baseDataVO baseDataVO) throws Exception {
		int i =  collectMapper.standardInsert(baseDataVO);
		return i;
	}

	@Override
	public void inserOpenApiProject(ArrayList<Map<String, Object>> resultData,ArrayList<String> headerData,String name) throws Exception {
		int member_sn = Integer.parseInt((String) UtilSession.getAttribute("SESSION_USER_SN"));
		tbProjectVO tbProjectVO = new tbProjectVO();
		tbProjectVO.setMember_sn(member_sn);
		tbProjectVO.setFlag(0);
		tbProjectVO.setProject_name(null);
		int resultCnt = collectMapper.insertTbProject(tbProjectVO);
		tbProjectDataVO tbProjectDataVO = new tbProjectDataVO();
		JSONArray list = UtilJson.getJsonArrayFromList(resultData);
		List headerList = headerData;
		JSONArray header = new JSONArray();
		JSONArray header_option = new JSONArray();
		int maxProjectSn = 0;
		int maxProjectDataSn = 0;
		// 헤더 정보 가공
		for(Object str: headerList)
		{
			header.add(String.valueOf(str));
		}
		if(resultCnt == 1) {
			maxProjectSn = collectMapper.selectMaxProjectSn();
			maxProjectDataSn = collectMapper.selectMaxProjectDataSn();
			tbProjectDataVO.setProject_sn(maxProjectSn);
			tbProjectDataVO.setProject_data_sn(maxProjectDataSn);
			tbProjectDataVO.setData(list.toJSONString());
			tbProjectDataVO.setData_version(0);
			tbProjectDataVO.setHeader(header.toJSONString());
			tbProjectDataVO.setStep("C");
			int result = collectMapper.insertTbProjectData(tbProjectDataVO);
		}
		UtilSession.setAttribute("SESSION_PROJECT_SN",String.valueOf(maxProjectSn));
		UtilSession.setAttribute("SESSION_PROJECT_DATA_SN",String.valueOf(maxProjectDataSn));
	}

	@Override
	public List<scheduleVO> selectScheduleProject(scheduleVO vo)throws Exception{
		return collectMapper.selectScheduleProject(vo);
	}

	/*스케줄링 스케줄러 관리 화면*/
	@Override
	public List<scheduleDataVO> selectScheduleData(scheduleDataVO vo)throws Exception{
		return collectMapper.selectScheduleData(vo);
	}

	@Override
	public int insertScheduleProject(scheduleVO vo) throws Exception{
		String member_sn = (String) UtilSession.getAttribute("SESSION_USER_SN");
		vo.setMember_sn(member_sn);

		//		if(null==vo.getSchedule_active() || "".equals(vo.getSchedule_active()))
		//		{
		//			vo.setSchedule_active("");
		//		}

		return collectMapper.insertScheduleProject(vo);
	}

	@Override
	public int updateScheduleActive(scheduleVO vo) throws Exception {
		// TODO Auto-generated method stub
		return collectMapper.updateScheduleActive(vo);
	}

	@Override
	public scheduleDataVO selectScheduleDataByScheduSn(scheduleDataVO vo) throws Exception {
		// TODO Auto-generated method stub
		return collectMapper.selectScheduleDataByScheduSn(vo);
	}

	@Override
	public scheduleVO selectScheduleDetail(scheduleVO vo) throws Exception {
		// TODO Auto-generated method stub
		return collectMapper.selectScheduleDetail(vo);
	}

	@Override
	public scheduleVO selectActiveProcess() throws Exception {
		// TODO Auto-generated method stub
		return collectMapper.selectActiveProcess();
	}

	@Override
	public int selectActiveProcessCnt() throws Exception {
		// TODO Auto-generated method stub
		return collectMapper.selectActiveProcessCnt();
	}

	@Override
	public void initScheduleActive() throws Exception {
		// TODO Auto-generated method stub
		collectMapper.initScheduleActive();
	}

	@Override
	public int insertScheduleProjectData(Map<String, Object> jsonData, int schedule_sn) throws Exception {
		scheduleVO schedulevo = new scheduleVO();
		schedulevo.setSchedule_sn(schedule_sn);
		//임시등록상태일 경우
		int check_result = collectMapper.checkScheduleProject(schedulevo);
		int result = 0;
		if(check_result > 0) {
			scheduleDataVO scheduleDataVO = new scheduleDataVO();
			JSONArray list = UtilJson.getJsonArrayFromList((List<?>) jsonData.get("data"));

			List headerList = (List)jsonData.get("header");
			//List<HashMap> headerOptionList = (List<HashMap>)jsonData.get("header_option");

			JSONArray header = new JSONArray();
			JSONArray header_option = new JSONArray();
			//헤더 정보 가공
			for(Object str: headerList)
			{
				header.add(String.valueOf(str));
			}
			scheduleDataVO.setSchedule_sn(String.valueOf(schedule_sn));
			scheduleDataVO.setData(list.toJSONString());
			scheduleDataVO.setHeader(header.toJSONString());
			//scheduleDataVO.setHeader_option(header_option.toJSONString());
			result = collectMapper.insertScheduleData(scheduleDataVO);
		}
		return result;
	}
	@Override
	public int deleteScheduleList(scheduleVO vo) throws Exception{
		return collectMapper.deleteScheduleList(vo);
	}

	@Override
	public versionInfoVO selectVersionInfo() throws Exception{
		return collectMapper.selectVersionInfo();
	}
	@Override
	public int selectVersionInfoCheck() throws Exception{
		return collectMapper.selectVersionInfoCheck();
	}
	@Override
	public void insertVersionDefault() throws Exception{
		collectMapper.insertVersionDefault();
	}
}