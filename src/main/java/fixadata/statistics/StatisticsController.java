package fixadata.statistics;

import java.util.Map;

import javax.annotation.Resource;
import javax.ws.rs.GET;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import fixadata.collect.mapper.CollectMapper;
import fixadata.collect.service.CollectService;
import lombok.extern.slf4j.Slf4j;

/**
 * @author Tom.DongHyuk (bioendpoint@gmail.com)
 * rule 관련
 */

@Slf4j
@RequestMapping("/statistics")
@Controller
public class StatisticsController {

	@Resource(name="collectMapper")
	private CollectMapper CollectMapper;

	@Autowired
	CollectService CollectServiceImpl;

	/**
	 * R통계 데이터 선택 창
	 * @param map
	 * @param model
	 * @return
	 * @throws Exception
	 */

	@GET
	@RequestMapping(value = "/statDataInput.fd")
	public String uploadFormFile(@RequestParam Map<String ,Object> map, ModelMap model) throws Exception {

		return "statistics/statDataInput";
	}
}