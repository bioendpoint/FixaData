package fixadata.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.rosuda.JRI.REXP;
import org.rosuda.JRI.RList;
import org.rosuda.JRI.Rengine;


public class UtilR {

	/** R java  */
	static String[] Rargs={"--vanilla"};
	private static Rengine re = new Rengine(Rargs, false, null);

	public static List logisticTypeOne(Map map, List data){

		List list = new ArrayList();

		String header = "";
		String[] headerKeys = null;

		StringBuffer sd = new StringBuffer();
		if (data != null & data.size() > 0) {
			Map<String ,Object> dataMap = (Map<String ,Object>) data.get(0);
			Iterator<String> iter = dataMap.keySet().iterator();
			String tmpKeys = "";
			while (iter.hasNext()) {
				if (tmpKeys.equals("")) {
					tmpKeys = iter.next();
				} else {
					tmpKeys += "," + iter.next();
				}
			}

			String[] keys = tmpKeys.split(","); // header column get

			headerKeys = keys;

			String tmpSd = "";

			for (int i = 0; i < keys.length; i++) {
				if (!map.get("PARAM1").toString().equals(keys[i]) && !keys[i].toString().equals("HIST_SN")
						&& !keys[i].toString().equals("idx")) {
					header += keys[i] + "+";
				}

				tmpSd = "";
				if (!keys[i].toString().equals("HIST_SN") && !keys[i].toString().equals("idx")) {
					//tmpSd.append("'" + keys[i].toString() + "' = c(");
					tmpSd += "'" + keys[i].toString() + "' = c(";
					for (int j = 0; j < data.size(); j++) {
						Map tmpMap = (Map) data.get(j);
						String tmp = (String) tmpMap.get(keys[i].toString());
						if (j == 0) {
							if (UtilString.isNumberChk(tmp)) {
								tmpSd += tmpMap.get(keys[i].toString());
							} else {
								tmpSd += "'" + tmpMap.get(keys[i].toString()) + "'";
							}
						} else {
							if (UtilString.isNumberChk(tmp)) {
								tmpSd += "," + tmpMap.get(keys[i].toString()) + "";
							} else {
								tmpSd += ",'" + tmpMap.get(keys[i].toString()) + "'";
							}
						}
					}
					tmpSd += ")";
					if (i == 0) {
						sd.append(tmpSd.toString());
					} else {
						sd.append("," + tmpSd.toString());
					}
				}
			}

			header = header.substring(0, header.length() - 1);
		}


		StringBuffer var2 = new StringBuffer();
		var2.append("mydata <- data.frame(" + sd.toString().substring(1, sd.toString().length()) + ")");
		// 그리드로 읽어온 데이터 전송.
		try {
			REXP x;
			Map rData = new LinkedHashMap();
			String basic_param = map.get("PARAM2").toString();
			String sel_param = map.get("PARAM1").toString();
			x = re.eval(var2.toString());
			x = re.eval("mydata");
			x = re.eval("head(mydata)");
			x = re.eval("paste(capture.output(head(mydata)),collapse='<br>')");
			rData.put("head(mydata)", x.asString());
			x = re.eval("summary(mydata)");
			x = re.eval("paste(capture.output(summary(mydata)),collapse='<br>')");
			rData.put("summary(mydata)", x.asString());
			x = re.eval("str(mydata)");
			x = re.eval("paste(capture.output(str(mydata)),collapse='<br>')");
			rData.put("str(mydata)", x.asString());
			x = re.eval("sapply(mydata, sd)");
			x = re.eval("paste(capture.output(sapply(mydata, sd)),collapse='<br>')");
			rData.put("sapply(mydata, sd)", x.asString());
			x = re.eval("xtabs(~" + sel_param + "+" + basic_param + ", data=mydata)");
			x = re.eval("paste(capture.output(xtabs(~" + sel_param + "+" + basic_param + ", data=mydata)),collapse='<br>')");
			rData.put("xtabs(~" + sel_param + "+" + basic_param + ", data=mydata)", x.asString());
			x = re.eval("mydata$" + basic_param + " <-factor(mydata$" + basic_param + ")");
			x = re.eval("paste(capture.output(mydata),collapse='\\n')");
			rData.put("mydata$" + basic_param + " <-factor(mydata$" + basic_param + ")", x.asString());
			x = re.eval("mylogit <- glm(" + sel_param + "~" + header + ", family='binomial', data=mydata)");
			x = re.eval("paste(capture.output(mylogit <- glm(" + sel_param + "~" + header + ", family='binomial', data=mydata)),collapse='\\n')");
			//rData.put("mylogit <- glm(" + sel_param + "~" + header + ", family='binomial', data=mydata)", x.asString());
			x = re.eval("mylogit");
			x = re.eval("summary(mylogit)");
			x = re.eval("paste(capture.output(summary(mylogit)),collapse='<br>')");
			rData.put("summary(mylogit)", x.asString());
			x = re.eval("nlevels(mydata$"+basic_param+")");
			int levels = x.asInt();
			x = re.eval("newdata2 <- with(mydata, data.frame("+headerKeys[3]+" = rep(seq(from=min(mydata$"+headerKeys[3]+"), to=max(mydata$"+headerKeys[3]+"), length.out = 100),"+levels+"), "+headerKeys[4]+"=mean("+headerKeys[4]+"), "+basic_param+"=factor(rep(1:"+levels+", each= 100))))");
			x = re.eval("chartdata <- cbind(newdata2, predict(mylogit, newdata = newdata2, type='link', se= TRUE))");
			x = re.eval("chartdata2 <- within(chartdata, { \n PredictedProb <- plogis(fit) \n LL <- plogis(fit-(1.96*se.fit)) \n UL <- plogis(fit+(1.96*se.fit)) \n })");
			x = re.eval("chartdata2");
			x = re.eval("subset(chartdata2, select=c('"+headerKeys[3]+"','"+basic_param+"','PredictedProb'))");

			re.eval("rm(list=ls())");
			RList rList = x.asList();

			List dataList = new ArrayList<>();

			int iSize = 0;

			if(rList.at(0).getType()==33){
				iSize = rList.at(0).asDoubleArray().length;
			} else if(rList.at(0).getType()==32){
				iSize = rList.at(0).asIntArray().length;
			} else if(rList.at(0).getType()==127){
				iSize = rList.at(0).asFactor().size();
			}

			String[] keys = rList.keys();

			String temp_head = "";
			String key_data =	"";
			for(int i=0;i<iSize;i++){
				if(rList.at(1).asFactor().at(i).equals(temp_head)){
					key_data  += rList.at(1).asFactor().at(i) + ",";
				}
				Map dataMap = new LinkedHashMap<>();
				Map rankMap = new LinkedHashMap<>();
				dataMap.put("x", rList.at(0).asDoubleArray()[i]);
				dataMap.put("y", rList.at(2).asDoubleArray()[i]);
				rankMap.put(rList.at(1).asFactor().at(i), dataMap);
				dataList.add(rankMap);

				temp_head = rList.at(1).asFactor().at(i);
			}

			key_data = key_data.substring(0, key_data.length()-1);

			list.add(rData);
			list.add(dataList);
			list.add(key_data);
			list.add("LogisticTypeOne");
		} catch (Exception e) {
			Map<String ,Object> result = new HashMap<String ,Object>();
			result.put("result" ,"false");
			list.add(result);
			re.end();
		}

		return list;
	}

	public static List  clusterTypeOne(Map map, List data){

		List list = new ArrayList();

		String sd = dataFrame(data);

		StringBuffer var2 = new StringBuffer();
		var2.append("mydata <- data.frame(" + sd.toString().substring(1, sd.toString().length()) + ")");
		// 그리드로 읽어온 데이터 전송.

		try {
			REXP x;
			Map rData = new LinkedHashMap();
			String sel_param = map.get("PARAM1").toString();

			x = re.eval("library(caret)");
			x = re.eval(var2.toString());
			x = re.eval("mydata");
			x = re.eval("head(mydata)");
			x = re.eval("paste(capture.output(head(mydata)),collapse='<br>')");
			rData.put("head(mydata)", x.asString());
			x = re.eval("inTrain <- createDataPartition( y = mydata$"+sel_param+", p = 0.7, list = F)");
			x = re.eval("training <- mydata[inTrain,]");
			x = re.eval("testing <- mydata[-inTrain,]");
			x = re.eval("training.data <- scale(training[-grep(\""+sel_param+"\", colnames(mydata))])");
			x = re.eval("paste(capture.output(training.data),collapse='<br>')");
			rData.put("training <- mydata[inTrain,]", x.asString());
			x = re.eval("summary(training.data)");
			x = re.eval("paste(summary(training.data),collapse='\\n')");
			rData.put("summary(training.data)", x.asString());
			x = re.eval("mydata$" + sel_param + " <-factor(mydata$" + sel_param + ")");
			x = re.eval("nlevels(mydata$"+sel_param+")");
			int levels = x.asInt();
			x = re.eval("mydata.kmeans <- kmeans(training.data[,-grep(\""+sel_param+"\", colnames(mydata))], center ="+levels+", iter.max = 10000)");
			x = re.eval("paste(capture.output(mydata.kmeans <- kmeans(training.data[,-grep(\""+sel_param+"\", colnames(mydata))], center ="+levels+", iter.max = 10000)),collapse='\\n')");
			x = re.eval("training$cluster <- as.factor(mydata.kmeans$cluster)");
			x = re.eval("training");
			x = re.eval("attach(training)");
			x = re.eval("training_order <- training[order(cluster),]");
			x = re.eval("training_order");

			RList rList = x.asList();

			List dataList = new ArrayList<>();

			int iSize = 0;

			if(rList.at(0).getType()==33){
				iSize = rList.at(0).asDoubleArray().length;
			} else if(rList.at(0).getType()==32){
				iSize = rList.at(0).asIntArray().length;
			} else if(rList.at(0).getType()==127){
				iSize = rList.at(0).asFactor().size();
			}

			String[] keys = rList.keys();

			String temp_head = "";
			String key_data =	"";
			int idx = re.eval("grep(\""+map.get("PARAM2").toString()+"\", colnames(mydata))").asInt();
			int idx2 = re.eval("grep(\""+map.get("PARAM3").toString()+"\", colnames(mydata))").asInt();

			re.eval("rm(list=ls())");
			for(int i=0;i<iSize;i++){
				if(rList.at((keys.length-1)).asFactor().at(i) != temp_head){
					key_data  += rList.at((keys.length-1)).asFactor().at(i) + ",";
				}
				Map dataMap = new LinkedHashMap<>();
				Map rankMap = new LinkedHashMap<>();
				//X축 선택 파라미터
				dataMap.put("x", rList.at(idx-1).asDoubleArray()[i]);
				//Y축 선택 파라미터
				dataMap.put("y", rList.at(idx2-1).asDoubleArray()[i]);
				rankMap.put(rList.at((keys.length-1)).asFactor().at(i), dataMap);
				dataList.add(rankMap);

				temp_head = rList.at((keys.length-1)).asFactor().at(i);
			}
			key_data = key_data.substring(0, key_data.length()-1);

			list.add(rData);
			list.add(dataList);
			list.add(key_data);
			list.add("ClusterTypeOne");
		} catch (Exception e) {
			Map<String ,Object> result = new HashMap<String ,Object>();
			result.put("result" ,"false");
			list.add(result);
		}
		re.end();

		return list;
	}

	public static Map outPutResult(List data){

		Map resultMap = new HashMap();

		String sd = dataFrame(data);

		StringBuffer var2 = new StringBuffer();
		var2.append("mydata <- data.frame(" + sd.toString().substring(1, sd.toString().length()) + ")");

		REXP x;
		x = re.eval(var2.toString());
		x = re.eval("mydata");
		x = re.eval("paste(capture.output(str(mydata)),collapse='<br>')");
		resultMap.put("result1", x.asString());
		x = re.eval("paste(capture.output(summary(mydata)),collapse='<br>')");
		resultMap.put("result2", x.asString());

		return resultMap;
	}

	public static Map outPutResultTime(Map map, List data){
		Map resultMap = new HashMap();

		String sd = dataFrame(data);

		StringBuffer var2 = new StringBuffer();
		var2.append("mydata <- data.frame(" + sd.toString().substring(1, sd.toString().length()) + ")");

		REXP x;
		x = re.eval("library(forecast)");
		x = re.eval("library(xts)");
		x = re.eval(var2.toString());
		x = re.eval("mydata");
		x = re.eval("ap_ts_Data <- xts(mydata$"+map.get("BASIC_PARAM")+", as.Date(mydata$"+map.get("SEL_TIME")+", format='%Y-%m-%d'))");
		x = re.eval("ap_ts_Data");
		x = re.eval("str(ap_ts_Data)");
		x = re.eval("myts <- ts(ap_ts_Data, start=c(as.numeric(format(min(index(ap_ts_Data)),'%Y')), as.numeric(format(min(index(ap_ts_Data)),'%m'))), end=c(as.numeric(format(max(index(ap_ts_Data)),'%Y')), as.numeric(format(max(index(ap_ts_Data)),'%m'))), frequency=as.numeric(format(max(index(ap_ts_Data)),'%m')))");
		x = re.eval("mydata_decomp <- decompose(myts, type='multiplicative')");
		x = re.eval("dq <- data.frame(Y=as.matrix(mydata_decomp$trend), date=as.character(as.Date(as.yearmon(time(mydata_decomp$trend)))))");
		x = re.eval("dq[is.na(dq)] <- 0");
		x = re.eval("dq");
		RList avg_list = x.asList();
		x = re.eval("findbest <- auto.arima(myts)");
		x = re.eval("md_arima <- forecast(findbest, h=20)");
		x = re.eval("data.frame(Y=as.matrix(md_arima$x), date=as.character(as.Date(as.yearmon(time(md_arima$x)))))");
		RList ori_list = x.asList();
		x = re.eval("data.frame(Y=as.matrix(md_arima$mean), date=as.character(as.Date(as.yearmon(time(md_arima$mean)))))");
		RList pd_list = x.asList();
		re.eval("rm(list=ls())");
		re.end();

		String[] avg_keys = avg_list.keys();
		String[] ori_keys = ori_list.keys();
		String[] pd_keys = pd_list.keys();

		ArrayList aList = new ArrayList<>();

		for(int i=0;i<ori_list.at(0).asDoubleArray().length;i++){
			Map avgMap = new LinkedHashMap<>();

			//avgMap.put("a", avg_list.at(avg_keys[0]).asDoubleArray()[i]);
			avgMap.put("b", Math.round(ori_list.at(ori_keys[0]).asDoubleArray()[i]) );
			//			avgMap.put("c", null );
			avgMap.put("date", ori_list.at(ori_keys[1]).asFactor().at(i));
			if( i==ori_list.at(0).asDoubleArray().length-1 ) {
				avgMap.put("c" ,Math.round(ori_list.at(ori_keys[0]).asDoubleArray()[i]) );
			}
			aList.add(avgMap);
		}

		for(int i=0;i<pd_list.at(0).asDoubleArray().length;i++){
			Map avgMap = new LinkedHashMap<>();
			avgMap.put("c", Math.round( pd_list.at(pd_keys[0]).asDoubleArray()[i]) );
			avgMap.put("date", pd_list.at(pd_keys[1]).asFactor().at(i));
			aList.add(avgMap);
		}

		resultMap.put("r_chart", aList);

		return resultMap;
	}

	private static String dataFrame(List data){

		String header = "";

		StringBuffer sd = new StringBuffer();

		if (data != null & data.size() > 0) {
			Map<String ,Object> dataMap = (Map<String ,Object>) data.get(0);
			Iterator<String> iter = dataMap.keySet().iterator();
			String tmpKeys = "";
			while (iter.hasNext()) {
				if (tmpKeys.equals("")) {
					tmpKeys = iter.next();
				} else {
					tmpKeys += "," + iter.next();
				}
			}

			String[] keys = tmpKeys.split(","); // header column get

			String tmpSd = "";

			for (int i = 0; i < keys.length; i++) {
				if (!keys[i].toString().equals("HIST_SN")
						&& !keys[i].toString().equals("idx")) {
					header += keys[i] + "+";
				}

				tmpSd = "";
				if (!keys[i].toString().equals("HIST_SN") && !keys[i].toString().equals("idx")) {
					tmpSd += "'" + keys[i].toString() + "' = c(";
					for (int j = 0; j < data.size(); j++) {
						Map tmpMap = (Map) data.get(j);
						String tmp = (String) tmpMap.get(keys[i].toString());
						if (j == 0) {
							if (UtilString.isNumberChk(tmp)) {
								tmpSd += tmpMap.get(keys[i].toString());
							} else {
								tmpSd += "'" + tmpMap.get(keys[i].toString()) + "'";
							}
						} else {
							if (UtilString.isNumberChk(tmp)) {
								tmpSd += "," + tmpMap.get(keys[i].toString()) + "";
							} else {
								tmpSd += ",'" + tmpMap.get(keys[i].toString()) + "'";
							}
						}
					}
					tmpSd += ")";
					if (i == 0) {
						sd.append(tmpSd.toString());
					} else {
						sd.append("," + tmpSd.toString());
					}
				}
			}
			header = header.substring(0, header.length() - 1);
		}
		return sd.toString();
	}
}