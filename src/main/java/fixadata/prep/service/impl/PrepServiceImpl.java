package fixadata.prep.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.json.simple.JSONArray;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import fixadata.collect.mapper.CollectMapper;
import fixadata.collect.vo.tbProjectDataVO;
import fixadata.collect.vo.tbProjectVO;
import fixadata.prep.mapper.PrepMapper;
import fixadata.prep.service.PrepService;
import fixadata.util.UtilCommon;
import fixadata.util.UtilJson;
import fixadata.util.UtilSession;



@Service("prepService")
public class PrepServiceImpl extends EgovAbstractServiceImpl implements PrepService {

	@Resource(name="prepMapper")
	private PrepMapper prepMapper;


	@Resource(name="collectMapper")
	private CollectMapper collectMapper;

	/*
	 * 전처리 데이터 로드
	 * (non-Javadoc)
	 * @see fixadata.prep.service.PrepService#selectPrepDataList(fixadata.collect.vo.tbProjectDataVO)
	 */
	@Override
	public List<tbProjectDataVO> selectPrepDataList(tbProjectDataVO vo) throws Exception {
		return prepMapper.selectPrepDataList(vo);
	}


	/**
	 * 전처리 데이터 로드
	 * @param uploadFile
	 * @param mv
	 * @return
	 * @throws Exception
	 */
	@Override
	public tbProjectDataVO selectLoadData(tbProjectDataVO vo) throws Exception {
		tbProjectDataVO result = prepMapper.selectTbProjectData(vo);
		return result;
	}


	/**
	 * 전처리 데이터 저장
	 * @param map
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@Override
	public int savePrep(Map<String, Object> jsonData) throws Exception {


		tbProjectVO projectvo = new tbProjectVO();
		projectvo.setProject_sn(Integer.parseInt(String.valueOf(jsonData.get("project_sn"))));
		tbProjectVO projectDetail = prepMapper.selectTbProjectCheck(projectvo);
		//임시등록상태일 경우
		if(projectDetail.getFlag()==1)
		{
			projectDetail.setProject_name((String) jsonData.get("project_nm"));
			//PROJECT TABLE에  프로젝트 이름 , 플레그 업데이트
			prepMapper.updateTbProject(projectDetail);
		}else {
			projectDetail.setProject_name((String) jsonData.get("project_nm"));
			projectDetail.setFlag(1);
			//PROJECT TABLE에  프로젝트 이름 , 플레그 업데이트
			prepMapper.updateTbProject(projectDetail);
		}

		tbProjectDataVO tbProjectDataVO = new tbProjectDataVO();
		JSONArray list = UtilJson.getJsonArrayFromList((List<?>) jsonData.get("data"));

		List headerList = (List)jsonData.get("header");
		List<HashMap> headerOptionList = (List<HashMap>)jsonData.get("header_option");

		Gson gson = new Gson();

		JSONArray header = new JSONArray();
		JSONArray header_option = new JSONArray();
		// 헤더 정보 가공
		for(Object str: headerList)
		{
			header.add(String.valueOf(str));
		}

		for(Object str: headerOptionList)
		{
			header_option.add(str);
		}


		tbProjectDataVO.setProject_data_sn(Integer.parseInt(String.valueOf(jsonData.get("project_data_sn"))));
		tbProjectDataVO.setProject_sn(Integer.parseInt(String.valueOf(jsonData.get("project_sn"))));
		tbProjectDataVO.setData(list.toJSONString());
		tbProjectDataVO.setData_version(1);
		tbProjectDataVO.setHeader(header.toJSONString());
		tbProjectDataVO.setHeader_option(header_option.toJSONString());
		tbProjectDataVO.setDiagram_layout(String.valueOf(jsonData.get("diagram")));
		tbProjectDataVO.setBlockchain(String.valueOf(jsonData.get("blockchain")));
		tbProjectDataVO.setStep("P");
		tbProjectDataVO.setMac_address(UtilCommon.getMacAddress());
		int result = collectMapper.insertTbProjectData(tbProjectDataVO);

		//신규 생성한데이터를 현재 선택된 데이터로 설정함.
		UtilSession.setAttribute("SESSION_PROJECT_DATA_SN",tbProjectDataVO.getProject_data_sn());
		UtilSession.setAttribute("SESSION_PROJECT_SN",projectDetail.getProject_sn());

		return result;
	}

	@Override
	public int saveAsPrep(Map<String, Object> jsonData) throws Exception {



		tbProjectVO tbProjectVO = new tbProjectVO();
		int member_sn = Integer.parseInt((String) UtilSession.getAttribute("SESSION_USER_SN"));
		//프로젝트 정보 등록
		tbProjectVO.setMember_sn(member_sn);
		tbProjectVO.setProject_name((String) jsonData.get("project_nm"));
		int resultCnt = collectMapper.insertTbProject(tbProjectVO);
		int result = 0;
		tbProjectVO projectDetail = prepMapper.selectTbProjectCheck(tbProjectVO);


		if(projectDetail.getFlag()==1)
		{
			projectDetail.setProject_name((String) jsonData.get("project_nm"));
			//PROJECT TABLE에  프로젝트 이름 , 플레그 업데이트
			prepMapper.updateTbProject(projectDetail);
		}else {
			projectDetail.setProject_name((String) jsonData.get("project_nm"));
			projectDetail.setFlag(1);
			//PROJECT TABLE에  프로젝트 이름 , 플레그 업데이트
			prepMapper.updateTbProject(projectDetail);
		}


		if(resultCnt > 0) {
			tbProjectDataVO tbProjectDataVO = new tbProjectDataVO();
			JSONArray list = UtilJson.getJsonArrayFromList((List<?>) jsonData.get("data"));

			List headerList = (List)jsonData.get("header");
			List<HashMap> headerOptionList = (List<HashMap>)jsonData.get("header_option");

			JSONArray header = new JSONArray();
			JSONArray header_option = new JSONArray();
			// 헤더 정보 가공
			for(Object str: headerList)
			{
				header.add(String.valueOf(str));
			}

			for(Object str: headerOptionList)
			{
				header_option.add(str);
			}

			tbProjectDataVO.setProject_data_sn(Integer.parseInt(String.valueOf(jsonData.get("project_data_sn"))));
			tbProjectDataVO.setProject_sn(projectDetail.getProject_sn());
			tbProjectDataVO.setData(list.toJSONString());
			tbProjectDataVO.setData_version(0);
			tbProjectDataVO.setHeader(header.toJSONString());
			tbProjectDataVO.setHeader_option(header_option.toJSONString());
			tbProjectDataVO.setDiagram_layout(String.valueOf(jsonData.get("diagram")));
			tbProjectDataVO.setBlockchain(String.valueOf(jsonData.get("blockchain")));
			tbProjectDataVO.setStep("C");
			tbProjectDataVO.setMac_address(UtilCommon.getMacAddress());
			result = collectMapper.insertTbProjectData(tbProjectDataVO);

			//신규 생성한데이터를 현재 선택된 데이터로 설정함.
			UtilSession.setAttribute("SESSION_PROJECT_DATA_SN",tbProjectDataVO.getProject_data_sn());
			UtilSession.setAttribute("SESSION_PROJECT_SN",projectDetail.getProject_sn());

		}

		return result;
	}


	@Override
	public int udpatePrep(Map<String, Object> jsonData) throws Exception {

		JSONArray list = UtilJson.getJsonArrayFromList((List<?>) jsonData.get("data"));

		List headerList = (List)jsonData.get("header");
		List<HashMap> headerOptionList = (List<HashMap>)jsonData.get("header_option");

		Gson gson = new Gson();
		JSONArray blockchain = gson.fromJson(String.valueOf(jsonData.get("blockchain")), JSONArray.class);
		JSONArray header = new JSONArray();
		JSONArray header_option = new JSONArray();
		// 헤더 정보 가공

		for(Object str: headerList)
		{
			header.add(String.valueOf(str));
		}

		for(Object str: headerOptionList)
		{
			header_option.add(str);
		}

		tbProjectDataVO tbProjectDataVO= new tbProjectDataVO();
		tbProjectDataVO.setData(list.toJSONString());
		tbProjectDataVO.setProject_sn(Integer.valueOf(String.valueOf(UtilSession.getAttribute("SESSION_PROJECT_SN"))));
		tbProjectDataVO.setHeader_option(header_option.toJSONString());
		tbProjectDataVO.setHeader(header.toJSONString());
		tbProjectDataVO.setProject_data_sn(Integer.valueOf(String.valueOf(UtilSession.getAttribute("SESSION_PROJECT_DATA_SN"))));
		tbProjectDataVO.setDiagram_layout(String.valueOf(jsonData.get("diagram")));
		tbProjectDataVO.setBlockchain(String.valueOf(jsonData.get("blockchain")));
		tbProjectDataVO.setMac_address(UtilCommon.getMacAddress());

		return collectMapper.updateTbProjectData(tbProjectDataVO);
	}


	@Override
	public int diagramUpdatePrep(Map<String, Object> jsonData) throws Exception {

		Gson gson = new Gson();
		JSONArray blockchain = gson.fromJson(String.valueOf(jsonData.get("blockchain")), JSONArray.class);
		tbProjectDataVO tbProjectDataVO= new tbProjectDataVO();
		tbProjectDataVO.setProject_sn(Integer.valueOf(String.valueOf(UtilSession.getAttribute("SESSION_PROJECT_SN"))));
		tbProjectDataVO.setProject_data_sn(Integer.valueOf(String.valueOf(UtilSession.getAttribute("SESSION_PROJECT_DATA_SN"))));
		tbProjectDataVO.setDiagram_layout(String.valueOf(jsonData.get("diagram")));
		tbProjectDataVO.setBlockchain(String.valueOf(jsonData.get("blockchain")));

		return collectMapper.diagramUpdateTbProjectData(tbProjectDataVO);
	}

	/**
	 * 전처리 FLAG 체크
	 * @return
	 * @throws Exception
	 */
	@Override
	public tbProjectVO selectTbProjectCheck(tbProjectVO vo) throws Exception {
		tbProjectVO detail = prepMapper.selectTbProjectCheck(vo);
		return detail;
	}
}
