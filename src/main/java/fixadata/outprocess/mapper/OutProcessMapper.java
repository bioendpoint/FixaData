/*
 * Copyright 2011 MOPAS(Ministry of Public Administration and Security).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package fixadata.outprocess.mapper;

import java.util.List;
import java.util.Map;

import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * sample에 관한 데이터처리 매퍼 클래스
 *
 * @author Tom.DongHyuk (bioendpoint@gmail.com)
 *
 * </pre>
 */
@Mapper("outProcessMapper")
public interface OutProcessMapper {

	/**
	 * 글 목록을 조회한다.
	 * @param searchVO - 조회할 정보가 담긴 VO
	 * @return 글 목록
	 * @exception Exception
	 */
	List<?> list(Map<String ,Object> map) throws Exception;

	/**
	 * 룰정보를 입력 수정 삭제 한다
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	Map<String ,Object> selectOne(Map<String ,Object> map) throws Exception;
}