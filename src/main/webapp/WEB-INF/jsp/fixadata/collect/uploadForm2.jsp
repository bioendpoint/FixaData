<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %> 
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>


<jsp:include page="/fixadata-common/inc/head.jsp" />

	<link rel="stylesheet" type="text/css" href="/fixadata-common/css/FixaData-Member.css">
	<script src="/fixadata-common/js/FixaData-Member.js"></script>

</head>
<body>
	<form name='uploadFrm' method="post" enctype="multipart/form-data">
		<input type='file' name='uploadFile'>
	</form>
	
	<a href='#' onClick="uploadFile();">upload</a>
	
	
	<script>
		function uploadFile()

		{
			document.uploadFrm.action = "<c:url value="/test/jsonTest3.fd"/>";
			document.uploadFrm.submit();
		}
	</script>
</body>
</html>