<%--
  Class Name : EgovFileList.jsp
  Description : 파일목록화면(include)
  Modification Information
 
 * @author Tom.DongHyuk (bioendpoint@gmail.com)
--%>

<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<script type="text/javascript">
	function fn_egov_downFile(atchFileId, fileSn){
		window.open("<c:url value='/cmm/fms/FileDown.do?atchFileId="+atchFileId+"&fileSn="+fileSn+"'/>");
	}	
	
	function fn_egov_deleteFile(atchFileId, fileSn) {
		
		forms = document.getElementsByTagName("form");

		for (var i = 0; i < forms.length; i++) {
			if (typeof(forms[i].atchFileId) != "undefined" &&
					typeof(forms[i].fileSn) != "undefined" &&
					typeof(forms[i].fileListCnt) != "undefined") {
				form = forms[i];
			}
		}
		//form = document.forms[0];
// 		form.atchFileId.value = atchFileId;
// 		form.fileSn.value = fileSn;
		deleteFileInfs(atchFileId,fileSn)
// 		form.action = "<c:url value='/cmm/fms/deleteFileInfs.do'/>";
// 		form.submit();
		
		
	}
	
	function fn_egov_check_file(flag) {
		if (flag=="Y") {
			document.getElementById('file_upload_posbl').style.display = "block";
			document.getElementById('file_upload_imposbl').style.display = "none";			
		} else {
			document.getElementById('file_upload_posbl').style.display = "none";
			document.getElementById('file_upload_imposbl').style.display = "block";
		}
	}
	
	function deleteFileInfs(atchFileId,fileSn){
		
		var data = new Object();
		data.atchFileId = atchFileId;
		data.fileSn = fileSn;
		
		if (confirm('<spring:message code="common.delete.msg" />')) {
			$.ajax({
			    type: "POST" ,
			    url : '${pageContext.request.contextPath}/cmm/fms/deleteFileInfs.do',
			    dataType : "text",
			    data : data,
			    success : function(data) {
			    	alert('<spring:message code="fixa.egov.title001"/>');
			    	//IE 호환성위한 파일 체크 (팝업 )
			    	$("#egovComFileUploader").attr("disabled",false);
			    	deleteFileChk(atchFileId,fileSn);
			    	
			    },
			    error : function() {
			    	alert('<spring:message code="fixa.egov.title002"/>'); // Ajax 실행 도중 에러 발생 시 실행
			    }
			});
		}
	}

	//첨부파일 삭제시 ajax로 첨부파일 유무를 확인하고 파일목록 비활성
	function deleteFileChk(atchFileId,fileSn){
		var data = new Object();
		data.atchFileId = atchFileId;
		data.fileSn = fileSn;
			$.ajax({
			    type: "POST" ,
			    url : "${pageContext.request.contextPath}/cmm/fms/deleteFileChk.do",
			    dataType : "text",
			    data : data,
			    success : function(data) {
			    	if(data == 0){
			    		$("#"+atchFileId+"_"+fileSn+"").css("display","none");
			    		file_stre_cours = "";
			    		
			    	}
			    },
			    error : function() {
			    	alert('<spring:message code="fixa.egov.title002"/>'); // Ajax 실행 도중 에러 발생 시 실행
			    }
			});
	}
	
</script>
      
<!-- <form name="fileForm" action="" method="post" >  -->
<input type="hidden" name="atchFileId" value="${atchFileId}">
<input type="hidden" name="fileSn" >
<input type="hidden" name="fileListCnt" value="${fileListCnt}">
      	<c:forEach var="fileVO" items="${fileList}" varStatus="status">
	       <c:choose>
		       <c:when test="${updateFlag=='Y'}">
			       <div id="${fileVO.atchFileId}_${fileVO.fileSn}" ><c:out value="${fileVO.orignlFileNm}"/>&nbsp;[<c:out value="${fileVO.fileMg}"/>&nbsp;byte]
			       	<img alt="<spring:message code="fixa.egov.title003"/>" title="<spring:message code="fixa.egov.title003"/>" src="<c:url value='/images/btn/bu5_close.gif'/>" 
			       		width="19" height="18" id="fileDel"  onClick="fn_egov_deleteFile('<c:out value="${fileVO.atchFileId}"/>','<c:out value="${fileVO.fileSn}"/>');" />
			       </div>
		       </c:when>
		       <c:otherwise>
			       <a href="#LINK"  onclick="javascript:fn_egov_downFile('<c:out value="${fileVO.atchFileId}"/>','<c:out value="${fileVO.fileSn}"/>')">
			       <c:out value="${fileVO.orignlFileNm}"/>&nbsp;[<c:out value="${fileVO.fileMg}"/>&nbsp;byte]
			       </a>
		       </c:otherwise>
	       </c:choose>
        </c:forEach>
        <c:if test="${fn:length(fileList) == 0}">
	    </c:if>