/*
 * Copyright 2008-2009 the original author or authors.
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
package fixadata.outprocess.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import fixadata.outprocess.mapper.OutProcessMapper;
import fixadata.outprocess.service.OutProcessService;

/**
 * @author Tom.DongHyuk (bioendpoint@gmail.com)
 */

@Service("outProcessService")
public class OutProcessServiceImpl extends EgovAbstractServiceImpl implements OutProcessService {

	//	private static final Logger LOGGER = LoggerFactory.getLogger(RuleServiceImpl.class);
	//
	//	/** SampleDAO */
	//	// TODO ibatis 사용
	//	@Resource(name = "sampleDAO")
	//	private SampleDAO sampleDAO;
	// TODO mybatis 사용
	@Resource(name="outProcessMapper")
	private OutProcessMapper outProcessMapper;

	/**
	 * 글 목록을 조회한다.
	 * @param searchVO - 조회할 정보가 담긴 VO
	 * @return 글 목록
	 * @exception Exception
	 */
	@Override
	public List<?> list(Map<String ,Object> param) throws Exception {
		return outProcessMapper.list(param);
	}


	/**
	 * 글 목록을 조회한다.
	 * @param searchVO - 조회할 정보가 담긴 VO
	 * @return 글 목록
	 * @exception Exception
	 */
	@Override
	public Map<String ,Object> selectOne(Map<String ,Object> param)  throws Exception {
		return outProcessMapper.selectOne(param);
	}
}