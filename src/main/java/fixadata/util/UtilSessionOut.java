package fixadata.util;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

public class UtilSessionOut implements HttpSessionListener{

	@Override
	public void sessionCreated(HttpSessionEvent arg0) {
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent arg0) {
		try {

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void sessionOutGo(HttpSessionEvent arg0, HttpServletRequest request ,HttpServletResponse response) throws IOException {
		HttpServletRequest hsRequest = request;
		HttpServletResponse hsResponse = response;
		hsResponse.sendRedirect("/fixadata/sessionOut.fd");
	}
}