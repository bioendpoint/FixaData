package fixadata.member.service;


import java.util.List;
import java.util.Map;



public interface MemberService {

	List<?> memberList( Map<String ,Object> map ) throws Exception;

	Map<String ,Object> memberLogin( Map<String ,Object> param ) throws Exception;

	Map<String ,Object> memberAutoLogin( Map<String ,Object> param ) throws Exception;

	List<Map<String ,Object>> selectMemberList(Map<String ,Object> map) throws Exception;

	int memberSave(Map<String ,Object> map) throws Exception;

	int memberChk(Map<String ,Object> map) throws Exception;


}
