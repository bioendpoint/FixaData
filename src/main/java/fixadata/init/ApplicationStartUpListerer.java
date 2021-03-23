package fixadata.init;

import java.io.File;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import fixadata.collect.service.CollectService;
import fixadata.common.EgovProperties;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@WebListener
public class ApplicationStartUpListerer implements ServletContextListener, Runnable {

	private Thread thread;
	private ServletContext sc;

	/**
	 * 중지시
	 */
	@Override
	public void contextDestroyed(ServletContextEvent event) {
		// TODO Auto-generated method stub
		System.out.println("########################################################################");
		System.out.println("fixa Data closed.....");
		System.out.println("########################################################################");
		//backgroud process stop
	}

	/**
	 * 동작시
	 */
	@Override
	public void contextInitialized(ServletContextEvent event) {

		System.out.println("########################################################################");
		System.out.println("fixa Data starting...");
		System.out.println("windows config checking ");
		System.out.println("########################################################################");

		//데이터 크리닝 처리
		File file = new File(".");
		String rootPath = file.getAbsoluteFile().getAbsolutePath();

		//임시 프로젝트 및 데이터 삭제 로직.
		//새로 빈을 작성 리스너에 빈등록 후 사용
		WebApplicationContext springContext = WebApplicationContextUtils.getWebApplicationContext(event.getServletContext());
		CollectService CollectServiceImpl = (CollectService)springContext.getBean("collectService");

		String globalDay = EgovProperties.getProperty("Globals.tmp.data.day");

		try {
			System.out.println("########################################################################");
			System.out.println("임시 프로젝트 및 데이터 삭제...");
			CollectServiceImpl.tmpProjectDataDelete(globalDay);
			System.out.println("complete ");
			System.out.println("########################################################################");
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
	}

	@Override
	public void run() {
		// TODO Auto-generated method stub
	}
}