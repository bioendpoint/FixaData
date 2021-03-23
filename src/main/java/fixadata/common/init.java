package fixadata.common;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import fixadata.collect.service.CollectService;
import fixadata.collect.vo.scheduleVO;
import fixadata.common.schelduler.SchedulerService;
import fixadata.util.UtilCrawling;

@Component
public class init {

	@Autowired
	CollectService CollectServiceImpl;

	@Resource(name = "schedulerService")
	SchedulerService schedulerServiceImpl;

	@PostConstruct
	public void init_db() {
		//no operation
	}

	@PostConstruct
	public void init_sc()throws Exception{
		//스케줄링 active상태 의 갯수를 파악
		int cnt = CollectServiceImpl.selectActiveProcessCnt();

		//active값이 1개일때 만 수행
		if(cnt == 1) {
			//스케줄 active된 값을 가져온다. 1개의값
			scheduleVO scheduleVO = CollectServiceImpl.selectActiveProcess();
			//active값 셋팅
			String active = scheduleVO.getSchedule_active();
			//스케줄 데이터 pk값 셋팅
			int schedule_sn = scheduleVO.getSchedule_sn();
			//크롤링 수행
			UtilCrawling.CrawlingProcess(active,schedule_sn,schedulerServiceImpl,CollectServiceImpl);

			//active값이 다중으로 설정되어 있을경우
		}else {
			//모든 스케줄링 active 상태를 stop으로 초기화 설정(이경우 스케줄링을 지정해줘야함)
			CollectServiceImpl.initScheduleActive();
			System.out.println("=======================================================");
			System.out.println("===========스케줄링 Active가 설정되어 있지 않습니다.==============");
			System.out.println("=======================================================");
		}
	}
}
