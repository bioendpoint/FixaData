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
package fixadata.outprocess;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.json.simple.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import fixadata.outprocess.service.OutProcessService;
import fixadata.rule.service.RuleService;
import fixadata.util.UtilJson;

/**
 * @author Tom.DongHyuk (bioendpoint@gmail.com)
 */

@Controller
public class OutProcessController {

	/** OutService */
	@Resource(name = "outProcessService")
	private OutProcessService outProcessService;

	/** RuleService */
	@Resource(name = "ruleService")
	private RuleService ruleService;

	@RequestMapping(value="/listRuleOutData.fd", method = RequestMethod.POST)
	public ModelAndView listRuleOutData(@RequestParam Map<String, Object> map, HttpServletRequest req) throws Exception {


		ModelAndView mv = new ModelAndView();

		Map<String ,Object> mapHeader = outProcessService.selectOne(map);
		String value = (String) mapHeader.get("TEMP_TABLE_HEADER");
		String key	 = (String) mapHeader.get("TEMP_TABLE_HEADER_KEY");


		String   sqlTmp = "SELECT *     \n"
				+ "FROM "+ (String) mapHeader.get("TEMP_TABLE_NM") +" \n"
				+ "WHERE HIST_SN = (SELECT MAX(HIST_SN) FROM "+ (String) mapHeader.get("TEMP_TABLE_NM") +")   \n";
		String   sql    = "";
		List<Map<String,Object>> ruleList;
		ruleList =  UtilJson.toList(map.get("DATA_LIST").toString());

		map.put("sql", sqlTmp + sql);

		String[] values = value.split(",");
		String[] keys   = key.split(",");
		int iKeys = 0;

		List<?> list = null;
		list = outProcessService.list(map);
		int tmpSize = list.size();
		int iSeq = 0;

		String tmpCond = "";
		String tmpAo   = "";
		for (int i=0;i<ruleList.size();i++){
			Map dataMap = new HashMap();
			dataMap = ruleList.get(i);

			String sRuleGb = dataMap.get("rule_gb").toString();

			if("01".equals(sRuleGb)){
				map.put("RULE_SN", dataMap.get("rule_sn"));
				List<?> ruleTmp = ruleService.selectRuleList(map);

				JSONObject paramMap1 = UtilJson.toJson((Map<String, Object>) ruleTmp.get(0));
				if("01".equals(paramMap1.get("RULE_BSIS_DATA_GB"))){
					String tmp = "";
					String[] headers = dataMap.get("column_header").toString().split(",");
					for(int j=0;j<headers.length;j++){
						sql += "AND "+ tmp  + paramMap1.get("RULE_CONT").toString().replaceAll("#param", headers[j].toString() )  + " \n" ;
						map.put("sql", sqlTmp + sql);

						list = outProcessService.list(map);

						for(int c=0;c<keys.length;c++){
							if(keys[c].toString().equals(headers[j].toString())){
								iKeys = i;
							}
						}

						mv.addObject("dataBefCnt"+(iSeq) ,tmpSize);
						mv.addObject("dataCnt"+(iSeq) ,list.size());
						mv.addObject("dataDiffCnt"+(iSeq) ,(tmpSize - list.size()));
						mv.addObject("dataHerd"+(iSeq) ,values[iKeys].toString() + " "+ paramMap1.get("RULE_NM") );
						mv.addObject("dataList"+(iSeq) ,UtilJson.getJsonArrayFromList(list));

						tmpSize = list.size();
						iSeq++;
					}

				}
			} else if("02".equals(sRuleGb)){
				String[][] cond = {{"01" , ">"},{"02" , "<"},{"03" , "="},{"04" , "<>"},{"05" , ">="},{"06" , "<="},{"07" , "LIKE"}};
				String[][] ao   = {{"01" , "AND "},{"02" , "OR"},{"" , "AND "} };

				tmpCond = "";
				tmpAo   = "";
				String[] headers = dataMap.get("column_header").toString().split(",");
				for (int j=0;j<ao.length;j++){
					if(dataMap.get("filter_ao").toString().equals(ao[j][0].toString())){
						tmpAo = ao[j][1].toString() + "  ";
					}
				}
				for (int j=0;j<cond.length;j++){
					if(dataMap.get("filter_cond").toString().equals(cond[j][0].toString())){
						tmpCond = cond[j][1].toString()+ "  ";
					}
				}

				if(dataMap.get("filter_cond").toString().equals("07")){
					sql += tmpAo + dataMap.get("column_header").toString() + " "+ tmpCond  + " '%' || '"+ dataMap.get("filter_val").toString() + "' ||'%' \n" ;
				} else if(dataMap.get("filter_cond").toString().equals("04")){
					sql += tmpAo + dataMap.get("column_header").toString() + " "+ tmpCond + " '" + dataMap.get("filter_val").toString() + "' \n" ;
				} else {
					sql += tmpAo  + "cast ("+ dataMap.get("column_header").toString() + " as integer) "+ tmpCond + dataMap.get("filter_val").toString() + " \n" ;
				}

				map.put("sql", sqlTmp + sql);

				for(int c=0;c<keys.length;c++){
					if(keys[c].toString().equals(dataMap.get("column_header").toString())){
						iKeys = i;
					}
				}

				list = outProcessService.list(map);
				mv.addObject("dataBefCnt"+(iSeq) ,tmpSize);
				mv.addObject("dataCnt"+(iSeq) ,list.size());
				mv.addObject("dataDiffCnt"+(iSeq) ,(tmpSize - list.size()));
				mv.addObject("dataHerd"+(iSeq) ,values[iKeys].toString() + " "+ tmpAo );
				mv.addObject("dataList"+(iSeq) ,UtilJson.getJsonArrayFromList(list));

				tmpSize = list.size();
				iSeq++;

			}
		}

		//
		mv.addObject("dataCnt" ,list.size());
		mv.addObject("dataList" ,UtilJson.getJsonArrayFromList(list));
		mv.setViewName("jsonView");
		return mv;
	}

	@RequestMapping(value="/listRuleFilterOutData.fd", method = RequestMethod.POST)
	public ModelAndView listRuleFilterOutData(@RequestParam Map<String, Object> map, HttpServletRequest req) throws Exception {

		ModelAndView mv = new ModelAndView();
		//		<![CDATA[		        ]]>

		Map<String ,Object> mapHeader = outProcessService.selectOne(map);
		String value = (String) mapHeader.get("TEMP_TABLE_HEADER");
		String key	 = (String) mapHeader.get("TEMP_TABLE_HEADER_KEY");


		String   sqlTmp = "SELECT *     \n"
				+ "FROM "+ (String) mapHeader.get("TEMP_TABLE_NM") +" \n"
				+ "WHERE HIST_SN = (SELECT MAX(HIST_SN) FROM "+ (String) mapHeader.get("TEMP_TABLE_NM") +")   \n";
		String   sql    = "";


		List<Map<String,Object>> ruleList;
		ruleList =  UtilJson.toList(map.get("DATA_LIST").toString());

		String[][] cond = {{"01" , ">"},{"02" , "<"},{"03" , "="},{"04" , "<>"},{"05" , ">="},{"06" , "<="},{"07" , "LIKE"}};
		String[][] ao   = {{"01" , "AND "},{"02" , "OR"},{"" , "AND "} };
		// filter_col 컬럼명
		// filter_cond 조건  01 : >  | 02 : < | 03: = | 04 :  <> | 05: >= | 06 : <= |  07 : like
		// filter_val  비교값
		// filter_ao : 01 : and | 02 : OR

		List<?> list = null;
		String tmpCond = "";
		String tmpAo   = "";
		for (int i=0;i<ruleList.size();i++){
			Map dataMap = new HashMap();
			dataMap = ruleList.get(i);
			tmpCond = "";
			tmpAo   = "";
			for (int j=0;j<ao.length;j++){
				if(dataMap.get("filter_ao").toString().equals(ao[j][0].toString())){
					tmpAo = ao[j][1].toString() + "  ";
				}
			}
			for (int j=0;j<cond.length;j++){
				if(dataMap.get("filter_cond").toString().equals(cond[j][0].toString())){
					tmpCond = cond[j][1].toString()+ "  ";
				}
			}

			if(dataMap.get("filter_cond").toString().equals("07")){
				sql += tmpAo + dataMap.get("filter_col").toString() + " "+ tmpCond  + " '%' || '"+ dataMap.get("filter_val").toString() + "' ||'%' \n" ;
			} else if(dataMap.get("filter_cond").toString().equals("04")){
				sql += tmpAo + dataMap.get("filter_col").toString() + " "+ tmpCond + " '" + dataMap.get("filter_val").toString() + "' \n" ;
			} else {
				sql += tmpAo  + "cast ("+ dataMap.get("filter_col").toString() + " as integer) "+ tmpCond + dataMap.get("filter_val").toString() + " \n" ;
			}

			map.put("sql", sqlTmp + sql);

			list = outProcessService.list(map);
			//	mv.addObject("dataCnt"+i ,list.size());
			//	mv.addObject("dataList"+i ,UtilJson.getJsonArrayFromList(list));
		}

		mv.addObject("dataCnt" ,list.size());
		mv.addObject("dataList" ,UtilJson.getJsonArrayFromList(list));


		mv.setViewName("jsonView");
		return mv;
	}
}