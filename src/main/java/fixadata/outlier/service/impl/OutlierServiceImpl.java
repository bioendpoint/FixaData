package fixadata.outlier.service.impl;

import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import fixadata.collect.mapper.CollectMapper;
import fixadata.outlier.service.OutlierService;
import fixadata.outlier.vo.outlierVO;

@Service("outlierService")
public class OutlierServiceImpl extends EgovAbstractServiceImpl implements OutlierService {

	@Resource(name = "collectMapper")
	private CollectMapper collectMapper;

	@Override
	public HashMap runWorkFlow(outlierVO vo) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}
}
