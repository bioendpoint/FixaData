package fixadata.statistics.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.json.simple.JSONArray;
import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import fixadata.collect.mapper.CollectMapper;
import fixadata.collect.vo.collectVO;
import fixadata.collect.vo.dbInfoVO;
import fixadata.collect.vo.tbProjectDataVO;
import fixadata.collect.vo.tbProjectVO;
import fixadata.common.commonVO.jsonResultVO;
import fixadata.statistics.service.StatisticsService;
import fixadata.util.UtilDb;
import fixadata.util.UtilFiles;
import fixadata.util.UtilJson;
import fixadata.util.UtilSession;


@Service("statisticsService")
public class StatisticsServiceImpl extends EgovAbstractServiceImpl implements StatisticsService {

	@Resource(name="collectMapper")
	private CollectMapper collectMapper;

	/**
	 * 디비 정보 등록
	 */
	@Override
	public int insertDbInfo(dbInfoVO vo) throws Exception {
		// TODO Auto-generated method stub

		String member_sn = (String) UtilSession.getAttribute("SESSION_USER_SN");
		vo.setMember_sn(member_sn);
		return collectMapper.insertDbInfo(vo);
	}

	/**
	 * db정보 수정
	 */
	@Override
	public int updateDbInfo(dbInfoVO vo) throws Exception {
		// TODO Auto-generated method stub
		return collectMapper.updateDbInfo(vo);
	}

	/**
	 * 사용자에게 등록된 db정보 추출
	 */
	@Override
	public List<dbInfoVO> selectDbList(dbInfoVO vo) throws Exception {
		// TODO Auto-generated method stub
		String member_sn = (String) UtilSession.getAttribute("SESSION_USER_SN");
		vo.setMember_sn(member_sn);
		return collectMapper.selectDbList(vo);
	}

	/**
	 * db_sn기준으로 데이터 추출
	 */
	@Override
	public dbInfoVO selectDbInfoBySn(dbInfoVO vo) throws Exception {
		// TODO Auto-generated method stub
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

		int result = 0 ;
		int member_sn = Integer.parseInt((String) UtilSession.getAttribute("SESSION_USER_SN"));


		//파일 업로드 데이터 수집
		if(collectVO.getCollect_flag().equals("file")) {


			tbProjectVO tbProjectVO = new tbProjectVO();

			tbProjectVO.setMember_sn(member_sn);
			tbProjectVO.setFlag(0);

			collectMapper.insertTbProject(tbProjectVO);

			tbProjectDataVO tbProjectDataVO = new tbProjectDataVO();

			//파일 업로드 처리
			jsonResultVO jsonResult = new jsonResultVO();
			jsonResult = UtilFiles.uploadFileParse(collectVO.getUploadFile(),collectVO.getSheetIndex());

			JSONArray header = new JSONArray();
			for(String str : jsonResult.getHeader())
			{
				header.add(str);
			}

			JSONArray list = UtilJson.getJsonArrayFromList(jsonResult.getData());

			UtilSession.setAttribute("SESSION_PROJECT_SN",tbProjectVO.getProject_sn());

			tbProjectDataVO.setProject_sn(tbProjectVO.getProject_sn());
			tbProjectDataVO.setData(list.toJSONString());
			tbProjectDataVO.setData_version(0);
			tbProjectDataVO.setHeader(header.toJSONString());
			tbProjectDataVO.setStep("C");

			result = collectMapper.insertTbProjectData(tbProjectDataVO);

			UtilSession.setAttribute("SESSION_PROJECT_DATA_SN",tbProjectDataVO.getProject_data_sn());

			// DB연결을 위한 데이터 수집
		}else {
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


			//jsonResult = UtilFiles.uploadFileParse(collectVO.getUploadFile());
			String jsonString = jsonResult.toString(); // UtilJson.ConverObjectToMap(jsonResult)

			tbProjectDataVO.setProject_sn(tbProjectVO.getProject_sn());
			tbProjectDataVO.setData(jsonList.toJSONString());
			tbProjectDataVO.setData_version(0);
			tbProjectDataVO.setHeader(header.toJSONString());
			tbProjectDataVO.setStep("C");
			result = collectMapper.insertTbProjectData(tbProjectDataVO);

			UtilSession.setAttribute("SESSION_PROJECT_DATA_SN",tbProjectDataVO.getProject_data_sn());
		}
		return result;
	}

	@Override
	public List<tbProjectVO> selectProjectList(tbProjectVO vo) throws Exception {
		// TODO Auto-generated method stub
		return collectMapper.selectProjectList(vo);
	}

	@Override
	public List<tbProjectDataVO> selectProjectDataVersionList(tbProjectDataVO vo) throws Exception {
		// TODO Auto-generated method stub
		return collectMapper.selectProjectDataVersionList(vo);
	}
}