package fixadata.util;

import java.util.Map;

import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

public class UtilSession {

	/* 세션 값 가져오기 */
	public static Object getAttribute( String name ) throws Exception {
		return RequestContextHolder.getRequestAttributes().getAttribute(name ,RequestAttributes.SCOPE_SESSION);
	}


	/* 세션 값 세팅하기 */
	public static void setAttribute( String name ,Object value ) throws Exception {
		RequestContextHolder.getRequestAttributes().setAttribute(name ,value ,RequestAttributes.SCOPE_SESSION);
	}


	/* 세션 값 삭제 */
	public static void removeAttribute( String name ) throws Exception {
		RequestContextHolder.getRequestAttributes().removeAttribute(name ,RequestAttributes.SCOPE_SESSION);
	}


	/* 세션 ID 가져오기 */
	public static String getSessionId() throws Exception {
		return RequestContextHolder.getRequestAttributes().getSessionId();
	}


	// 세션 세팅
	public static void setProjectSession( Map<String ,Object> map ) throws Exception {

		UtilSession.setAttribute( "SESSION_PROJECT_SN"			,map.get("SESSION_PROJECT_SN")			);
		UtilSession.setAttribute( "SESSION_PROJECT_DATA_SN"		,map.get("SESSION_PROJECT_DATA_SN")	    );
		UtilSession.setAttribute( "SESSION_PROJECT_NAME"		,map.get("SESSION_PROJECT_NAME")		);
		UtilSession.setAttribute( "SESSION_TABLE_NAME"			,map.get("SESSION_TABLE_NAME")			);
		UtilSession.setAttribute( "SESSION_FILE_NAME"			,map.get("SESSION_FILE_NAME")			);
		UtilSession.setAttribute( "SESSION_TABLE_HEADER"		,map.get("SESSION_TABLE_HEADER")		);
		UtilSession.setAttribute( "SESSION_TABLE_HEADER_KEY"	,map.get("SESSION_TABLE_HEADER_KEY")	);
		UtilSession.setAttribute( "SESSION_TABLE_HEADER_COUNT"	,map.get("SESSION_TABLE_HEADER_COUNT")	);
		UtilSession.setAttribute( "SESSION_PLAY_DATA"			,map.get("SESSION_PLAY_DATA")			);

	}


	// Map에 세션값 갱신하여 Return
	public static Map<String ,Object> setProjectSessionMap( Map<String ,Object> map ) throws Exception {

		map.put( "PRJCT_SN"					,UtilSession.getAttribute("SESSION_PROJECT_SN")			);
		map.put( "PRJCT_DATA_SN"			,UtilSession.getAttribute("SESSION_PROJECT_DATA_SN")	);
		map.put( "PRJCT_NM"					,UtilSession.getAttribute("SESSION_PROJECT_NAME")		);
		map.put( "TEMP_TABLE_NM"			,UtilSession.getAttribute("SESSION_TABLE_NAME")			);
		map.put( "REAL_FILE_NM"				,UtilSession.getAttribute("SESSION_FILE_NAME")			);
		map.put( "TEMP_TABLE_HEADER"		,UtilSession.getAttribute("SESSION_TABLE_HEADER")		);
		map.put( "TEMP_TABLE_HEADER_KEY"	,UtilSession.getAttribute("SESSION_TABLE_HEADER_KEY")	);
		return map;

	}


	/* 프로젝트 Session 전체 초기화 */
	public static void setProjectSessionDell() throws Exception {

		UtilSession.removeAttribute( "SESSION_PROJECT_SN"			);
		UtilSession.removeAttribute( "SESSION_PROJECT_DATA_SN"		);
		UtilSession.removeAttribute( "SESSION_PROJECT_NAME"			);
		UtilSession.removeAttribute( "SESSION_TABLE_NAME"			);
		UtilSession.removeAttribute( "SESSION_FILE_NAME"			);
		UtilSession.removeAttribute( "SESSION_TABLE_HEADER"			);
		UtilSession.removeAttribute( "SESSION_TABLE_HEADER_KEY"		);
		UtilSession.removeAttribute( "SESSION_TABLE_HEADER_COUNT"	);
		UtilSession.removeAttribute( "SESSION_PLAY_DATA"			);

	}
}