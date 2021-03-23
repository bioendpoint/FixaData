package fixadata.common.schelduler;

import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;
import java.util.concurrent.ScheduledFuture;

import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;

public interface SchedulerService {
	public void addTaskToScheduler(int id, Runnable task,String cron)throws Exception;
	public void removeTaskFromScheduler(int id)throws Exception;
	public void allRemoveTaskFromScheduler()throws Exception;

}
