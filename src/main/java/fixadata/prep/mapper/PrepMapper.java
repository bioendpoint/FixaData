package fixadata.prep.mapper;

import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import fixadata.collect.vo.tbProjectDataVO;
import fixadata.collect.vo.tbProjectVO;

@Mapper("prepMapper")
public interface PrepMapper {

	public List<tbProjectDataVO> selectPrepDataList(tbProjectDataVO vo) throws Exception;

	/**
	 * 전처리 데이터 로드
	 * @param uploadFile
	 * @param mv
	 * @return
	 * @throws Exception
	 */
	public tbProjectDataVO selectTbProjectData(tbProjectDataVO tbProjectDataVO) throws Exception;

	/**
	 * 전처리 FLAG 체크
	 * @return
	 * @throws Exception
	 */
	public tbProjectVO selectTbProjectCheck(tbProjectVO tbProjectVO)throws Exception;

	/**
	 * TB_PROJECT 프로젝트 이름 , 플레그 업데이트
	 * @param tbProjectVO
	 */
	public void updateTbProject(tbProjectVO tbProjectVO)throws Exception;


}
