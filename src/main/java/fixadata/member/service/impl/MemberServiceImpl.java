package fixadata.member.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import fixadata.member.mapper.MemberMapper;
import fixadata.member.service.MemberService;
import fixadata.util.UtilSecurity;
import fixadata.util.UtilSession;


@Service("memberService")
public class MemberServiceImpl extends EgovAbstractServiceImpl implements MemberService {

	@Resource(name="memberMapper")
	private MemberMapper memberMapper;


	@Override
	public List<?> memberList(Map<String ,Object> param) throws Exception {
		return memberMapper.memberList(param);
	}

	@Override
	public Map<String ,Object> memberAutoLogin(Map<String ,Object> param) throws Exception {

		List<?> list = memberMapper.memberList(param);

		if(list.size()>0)
		{
			memberMapper.updateMemberMacAddress(param);
		}

		Map<String ,String> mapList = new HashMap<String ,String>();
		mapList = (list.size() == 0) ? null : (Map<String ,String>)list.get(0);

		String temp_id		= (mapList == null) ? "" : mapList.get("member_id");
		String temp_sn		= (mapList == null) ? "" : String.valueOf(mapList.get("member_sn"));
		String temp_auth	= (mapList == null) ? "" : String.valueOf(mapList.get("member_auth"));

		Boolean	response		= false;	// 정상 로그인=true, 로그인 실패=false
		String	responseValue	= "1";		// 아이디가 없을 경우= 1, 비밀번호가 틀릴경우= 2, 정상처리= 0

		UtilSession.setAttribute("SESSION_USER_AUTH"		, temp_auth);		// 0= 시스템, 1=관리자, 11=사용자
		UtilSession.setAttribute("SESSION_USER_ID"			, temp_id);
		UtilSession.setAttribute("SESSION_USER_SN"			, temp_sn);
		UtilSession.setAttribute("SESSION_PROJECT_SN"		, null);
		UtilSession.setAttribute("SESSION_PROJECT_DATA_SN"	, null);
		UtilSession.setAttribute("SESSION_MAC_ADDRESS"	, String.valueOf(param.get("mac_address")));

		response		= true;
		responseValue	= "0";

		Map<String ,Object> map = new HashMap<String ,Object>();
		map.put("response"		,response);
		map.put("responseValue"	,responseValue);

		return map;
	}

	/**
	 * 회의 로그인 기능
	 */
	@Override
	public Map<String ,Object> memberLogin(Map<String ,Object> param) throws Exception {
		String id = (param.size()>0) ? param.get("member_id").toString() : "";
		String pw = (param.size()>0) ? param.get("member_pw").toString() : "";

		List<?> list = memberMapper.memberList(param);

		Map<String ,String> mapList = new HashMap<String ,String>();
		mapList = (list.size() == 0) ? null : (Map<String ,String>)list.get(0);

		//복호화
		String key = "key";

		String temp_id		= (mapList == null) ? "" : mapList.get("member_id");
		String temp_pw		= (mapList == null) ? "" : UtilSecurity.AseDecode(mapList.get("member_pw").toString(), key);
		//String temp_pw	= (mapList == null) ? "" : mapList.get("member_pw");
		String temp_sn		= (mapList == null) ? "" : String.valueOf(mapList.get("member_sn"));
		String temp_auth	= (mapList == null) ? "" : String.valueOf(mapList.get("member_auth"));

		Boolean	response		= false;	// 정상 로그인=true, 로그인 실패=false
		String	responseValue	= "1";		// 아이디가 없을 경우= 1, 비밀번호가 틀릴경우= 2, 정상처리= 0

		if ( !temp_id.equals(id) ) {
			responseValue = "1";
		} else if ( !temp_pw.equals(pw) ) {
			responseValue = "2";
		} else {
			UtilSession.setAttribute("SESSION_USER_AUTH"		, temp_auth);		// 0= 시스템, 1=관리자, 11=사용자
			UtilSession.setAttribute("SESSION_USER_ID"			, temp_id);
			UtilSession.setAttribute("SESSION_USER_SN"			, temp_sn);
			UtilSession.setAttribute("SESSION_PROJECT_SN"		, null);
			UtilSession.setAttribute("SESSION_PROJECT_DATA_SN"	, null);
			response		= true;
			responseValue	= "0";
		}

		Map<String ,Object> map = new HashMap<String ,Object>();
		map.put("response"		,response);
		map.put("responseValue"	,responseValue);

		return map;
	}
	/**
	 * member 목록을 조회한다.
	 * @param searchVO - 조회할 정보가 담긴 VO
	 * @return 글 목록
	 * @exception Exception
	 */
	@Override
	public List<Map<String ,Object>> selectMemberList(Map<String ,Object> map) throws Exception {
		//if ( !map.containsKey("itemList") ) {
		//	String rule_base_data_gb = (UtilSession.getAttribute("SESSION_USER_AUTH").equals("11")) ? "02" : "";
		//	map.put("rule_base_data_gb" ,rule_base_data_gb);
		//}

		//map.put("member_sn",UtilSession.getAttribute("SESSION_USER_SN"));
		//map.put("member_auth",UtilSession.getAttribute("SESSION_USER_AUTH"));
		//map.put("member_id",UtilSession.getAttribute("SESSION_USER_ID"));
		//

		return memberMapper.selectMemberList(map);
	}
	/**
	 * 룰정보를 입력 수정 삭제 한다
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	@Override
	public int memberSave(Map<String ,Object> param) throws Exception {
		int i =  memberMapper.memberSave(param);
		return i;
	}

	@Override
	public int memberChk(Map<String ,Object> param) throws Exception {
		int i =  memberMapper.memberChk(param);
		return i;
	}
}
