<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>

<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:include page="/fixadata-common/inc/head.jsp" />
	
	<link rel="stylesheet" type="text/css" href="/fixadata-common/css/FixaData-Member.css">
	<script src="/fixadata-common/js/FixaData-Member.js"></script>
	<script src="/fixadata-common/common.js"></script>
    <script src="/fixadata-common/member.js"></script>
    <script src="/fixadata-common/collect.js"></script>  
<style>
body {background: url(/fixadata-common/images/bg.jpg) center center; background-size: cover;}
#wrap{background: none !important}
</style>

</head>
<body><div id="_body" class="_body">
<div id="_inni" class="_inni">

<div id="wrap">

<header id="wrHeader">
	<jsp:include page="/fixadata-common/inc/header.jsp" />
</header>
<!--// #wrHeader -->

	<div id="wrContents">
		<form class="user" id="formLogin" method="post" onsubmit="return false;">
			<div id="arLogin">
				<div class="form">
					<div id="itmHeader"><spring:message code="fixa.login"/><!-- FixaData --></div>
					<div id="itmInput">
						<div class="_form-input">
							<!-- -<label>아이디</label> --> 
							<input name="member_id" id="form_userId" type="text" data-format="id" value="" placeholder="<spring:message code="fixa.core.title204"/>"><!-- 아이디 -->
						</div>
						<div class="_form-input">
							<!-- <label>비밀번호</label>  -->
							<input name="member_pw" id="form_userPw" type="password" data-format="pw" value="" placeholder="<spring:message code="fixa.core.title205"/>"><!-- 비밀번호 -->
						</div>
					</div>
					<div id="itmMessage"></div>
				</div>
				<input type="submit" class="button" value="<spring:message code="fixa.login.button"></spring:message>" onClick="member.login('formLogin')">
				
				<c:choose>
					<c:when test="${multi_language eq '0' }">
						<table width='300px' border='0' align='center'>
						<tr>
							<td align="center" width="33%"><a href='/?language=ko'>korea</a></td>
							<td align="center" width="33%"><a href='/?language=en'>english</a></td>
							<td align="center" width="33%"><a href='/?language=vt'>vietnam</a></td>							
						</tr>
						</table>
					</c:when>
					<c:otherwise>
						<div></div>
						<br><table width='300px'>
							<tr>
								<td>
								</td>  
							</tr>
						</table>
					</c:otherwise>
				</c:choose>
			</div>
			<!--// #arLogin -->
		</form>

	</div>
	<!--// #wrContents -->

</div>
<!--// #wrap -->

</div></div></body>
</html>