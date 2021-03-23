package fixadata.member;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;
import org.springframework.web.servlet.support.RequestContextUtils;

import fixadata.common.EgovProperties;
import fixadata.member.service.MemberService;
import fixadata.util.UtilCommon;
import fixadata.util.UtilSecurity;



@Controller
public class MemberController {

	@Resource(name = "memberService")
	private MemberService memberService;


	@Autowired
	SessionLocaleResolver localeRsolver;

	/**
	 * 로그인 화면
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/fixadata/login.fd")
	public String loginView(
			ModelMap model
			, HttpServletRequest request
			, HttpServletResponse response
			, @RequestParam(value="language",defaultValue="") String language
			) throws Exception {
		String multi_language = EgovProperties.getProperty("Globals.multi_language");
		String default_language = EgovProperties.getProperty("Globals.default_language");

		// model.addAttribute("multi_language", multi_language);
		model.addAttribute("multi_language", multi_language);

		if(multi_language.equals("0"))
		{

			if(null!=language && !"".equals(language))
			{

				localeRsolver.resolveLocale(request);
				Locale locale = new Locale(language);
				LocaleResolver localeResolver = RequestContextUtils.getLocaleResolver(request);
				localeResolver.setLocale(request, response, locale);
			}
			else
			{
				localeRsolver.resolveLocale(request);
				Locale locale = new Locale(default_language);
				LocaleResolver localeResolver = RequestContextUtils.getLocaleResolver(request);
				localeResolver.setLocale(request, response, locale);
			}
		}
		else
		{
			localeRsolver.resolveLocale(request);
			Locale locale = new Locale(default_language);
			LocaleResolver localeResolver = RequestContextUtils.getLocaleResolver(request);
			localeResolver.setLocale(request, response, locale);
		}

		//macaddress를 기반으로 로그인 자동 로그인 처리

		System.out.println("===>"+UtilCommon.getMacAddress());

		String defaultId = EgovProperties.getProperty("Globals.default.loginId");

		Map<String,Object> param =new HashMap<String,Object>();

		param.put("member_id", defaultId);
		param.put("mac_address",UtilCommon.getMacAddress());
		memberService.memberAutoLogin(param);

		return "redirect:/collect/datainput.fd";

		/**
        if(multi_language.equals("0"))
        {

        	if(null!=language && !"".equals(language))
        	{

	            localeRsolver.resolveLocale(request);
		        Locale locale = new Locale(language);
		        LocaleResolver localeResolver = RequestContextUtils.getLocaleResolver(request);
				localeResolver.setLocale(request, response, locale);
        	}
        	else
        	{
        	    localeRsolver.resolveLocale(request);
		        Locale locale = new Locale(default_language);
		        LocaleResolver localeResolver = RequestContextUtils.getLocaleResolver(request);
				localeResolver.setLocale(request, response, locale);
        	}
        }
        else
        {
        	localeRsolver.resolveLocale(request);
	        Locale locale = new Locale(default_language);
	        LocaleResolver localeResolver = RequestContextUtils.getLocaleResolver(request);
			localeResolver.setLocale(request, response, locale);
        }
		 **/

		//return "member/member-login";

	}

	/**
	 * 로그아웃 기능
	 * @param map
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/fixadata/sessionOut.fd")
	public String sessionOut(@RequestParam Map<String, Object> map, ModelMap model, HttpSession session ) throws Exception {
		session.invalidate();
		return "redirect:/";
	}

	/**
	 * 사용자 체크 및 권한 할당(세션처리)
	 * @param param
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/ajax/loginAjax.fd" ,method = RequestMethod.POST)
	public ModelAndView login( @RequestParam Map<String ,Object> param ) throws Exception {

		Map<String ,Object> response = memberService.memberLogin( param );
		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject( "Response"		,response.get("response") );
		mv.addObject( "ResponseValue"	,response.get("responseValue") );

		return mv;
	}

	/**
	 * member목록 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/ajax/memberList.fd" ,method = RequestMethod.POST)
	public ModelAndView memberList( @RequestParam Map<String ,Object> map, ModelMap model ) throws Exception {
		List<?> list = memberService.selectMemberList(map);
		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject("list" ,list);
		return mv;

	}

	@RequestMapping(value = "/ajax/memberSave.fd")
	public ModelAndView memberSave(@RequestParam Map<String ,Object> map ) throws Exception {
		//		if ( map.get("state").toString().equals("1") ) {
		//			map.put("rule_member_id" ,UtilSession.getAttribute("SESSION_USER_ID"));
		//			map.put("rule_base_data_gb" ,"02");
		//		}
		if(map.get("state").equals("1") || map.get("state").equals("2")) {
			String key = "key";
			//암호화
			String pss = UtilSecurity.AseEncode(map.get("member_pw").toString(), key);

			map.put("member_pw", pss);
		}

		int response = memberService.memberSave(map);

		String result = "success";

		map.remove("rule_sn");
		List<?> list = memberService.selectMemberList(map);
		if ( response != 1 ) {
			result = "error";
		}

		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject("result" ,result);
		mv.addObject("list" ,list);
		return mv;
	}
	@RequestMapping(value = "/ajax/memberChk.fd")
	public ModelAndView memberChk(@RequestParam Map<String ,Object> map ) throws Exception {
		//		if ( map.get("state").toString().equals("1") ) {
		//			map.put("rule_member_id" ,UtilSession.getAttribute("SESSION_USER_ID"));
		//			map.put("rule_base_data_gb" ,"02");
		//		}
		int response = memberService.memberChk(map);
		String result = "";
		if ( response > 0 ) {
			result = "error";
		}else {
			result = "success";
		}
		ModelAndView mv = new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject("result" ,result);
		return mv;
	}

}
