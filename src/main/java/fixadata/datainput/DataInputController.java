package fixadata.datainput;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import fixadata.util.UtilFiles;
import fixadata.util.UtilSession;

@Controller
public class DataInputController {

	/* 데이터수집(파일첨부) 첫 화면 */
	/* 첨부파일 저장 */
	@RequestMapping(value = "/ajax/datainputUploadAjax.fd" ,method = RequestMethod.POST)
	public ModelAndView TempUpload(@RequestParam("file") MultipartFile file, HttpServletRequest request) throws Exception {

		String fileName	= UtilFiles.fileUpload(file);

		UtilSession.setProjectSessionDell();
		UtilSession.setAttribute("SESSION_FILE_NAME" ,fileName);

		ModelAndView mv	= new ModelAndView();
		mv.setViewName("jsonView");
		mv.addObject("result", "true");
		mv.addObject("fileName", fileName);

		return mv;
	}
}
