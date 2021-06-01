<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<jsp:include page="/fixadata-common/inc/head.jsp" />

<link rel="stylesheet" type="text/css" href="/fixadata-common/css/FixaData-Datainput.css">
<script src="/fixadata-common/js/FixaData-Datainput.js"></script>

</head>
<body><div id="_body" class="_body"><div id="_inni" class="_inni">

<div id="wrap">


<header id="wrHeader">
<jsp:include page="/fixadata-common/inc/header.jsp" />
</header><!--// #wrHeader -->

<div id="wrContents">

<form id="form" action="#" method="post">
		<div id="arInputdata">
			<div id="itmDataArea">
				<span class="text">=== 여기에 드래그하여 데이터 파일을 첨부 하세요 ===</span>
			</div>
			<div id="itmFileName">
				<span class="title">선택파일</span>
				<span class="fileName"></span>
			</div>
			<div id="itmButtonArea"><!--
				--><!--<a href="#" class="button">파일찾기</a>--><!--
			--></div>
		</div><!--// #arLogin -->
</form>

</div><!--// #wrContents -->
</div><!--// #wrap -->

</div></div></body>
</html>