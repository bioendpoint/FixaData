package fixadata.common;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class AuthenticationFilter implements Filter{

	private ServletContext context;

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws IOException, ServletException {
		// TODO Auto-generated method stub
		/**
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;
		String url = request.getRequestURI();
		HttpSession session = request.getSession(false);

		if(url.equals("/fixadata/login.fd") || url.equals("/ajax/loginAjax.fd")){
			chain.doFilter(req, res);

		}else if((session == null || session.getAttribute("SESSION_USER_AUTH") == null)){
			response.sendRedirect("/fixadata/login.fd");
		}else{
			chain.doFilter(req, res);
		}
		 **/

		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;
		String url = request.getRequestURI();
		HttpSession session = request.getSession(false);

		if(url.equals("/fixadata/login.fd") || url.equals("/ajax/loginAjax.fd")){
			chain.doFilter(req, res);

		}else if((session == null || session.getAttribute("SESSION_USER_AUTH") == null)){
			response.sendRedirect("/fixadata/login.fd");
		}else{
			if ( req instanceof HttpServletRequest )
			{
				String ae = request.getHeader( "accept-encoding" );
				if ( ae != null && ae.indexOf( "gzip" ) != -1 ) {
					GZIPResponseWrapper wrappedResponse = new GZIPResponseWrapper( response );
					chain.doFilter( req, wrappedResponse );
					wrappedResponse.finishResponse();
					return;
				}
				chain.doFilter( req, res );
			}
			else
			{
				chain.doFilter(req, res);
			}
		}
	}

	@Override
	public void init(FilterConfig config) throws ServletException {
		// TODO Auto-generated method stub
		this.context = config.getServletContext();
		this.context.log("Authentication filter Log");
	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}
}