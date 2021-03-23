package fixadata.member.mapper;

import java.util.List;
import java.util.Map;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

@Mapper("memberMapper")
public interface MemberMapper {

	List<?> memberList( Map<String ,Object> map ) throws Exception;
	
	List<Map<String ,Object>> selectMemberList(Map<String ,Object> map) throws Exception;
	
	int memberSave(Map<String ,Object> map) throws Exception;
	
	int memberChk(Map<String ,Object> map) throws Exception;
	
	int updateMemberMacAddress(Map<String ,Object> map) throws Exception;
}
