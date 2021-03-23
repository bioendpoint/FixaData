package fixadata.common.schelduler;

import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;
import java.util.concurrent.ScheduledFuture;

import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * 스케쥴링 등록 및 관리
 * @author Tom.DongHyuk
 *
 */
@Service("schedulerService")
public class SchedulerServiceImpl extends EgovAbstractServiceImpl implements SchedulerService{

	TaskScheduler scheduler;

	Map<Integer, ScheduledFuture<?>> jobsMap = new HashMap<>();

	public SchedulerServiceImpl(TaskScheduler scheduler) {
		this.scheduler = scheduler;
	}

	// Schedule Task to be executed every night at 00 or 12 am
	@Override
	public void addTaskToScheduler(int id, Runnable task,String cron) {

		System.out.println("run 스케쥴");

		ScheduledFuture<?> scheduledTask = scheduler.schedule(task, new CronTrigger(cron, TimeZone.getTimeZone(TimeZone.getDefault().getID())));
		jobsMap.put(id, scheduledTask);
	}

	// Remove scheduled task
	@Override
	public void removeTaskFromScheduler(int id) {
		ScheduledFuture<?> scheduledTask = jobsMap.get(id);
		if(scheduledTask != null) {
			scheduledTask.cancel(true);
			jobsMap.put(id, null);
		}
	}

	//scheduled all remove
	@Override
	public void allRemoveTaskFromScheduler() {
		for(Integer key :jobsMap.keySet())
		{
			ScheduledFuture<?> scheduledTask = jobsMap.get(key);
			if(scheduledTask != null) {
				scheduledTask.cancel(true);
				jobsMap.put(key, null);
			}
		}
	}
}
