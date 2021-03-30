<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<jsp:include page="/fixadata-common/inc/head.jsp" />

<link rel="stylesheet" type="text/css" href="/_geo-common/Guriddo_jqGrid_JS_5.3.1/css/ui.jqgrid-bootstrap.css">
<link rel="stylesheet" type="text/css" href="/_geo-common/JointJS/css/joint.min.css">
<link rel="stylesheet" type="text/css" href="/fixadata-common/css/FixaData-Process.css">

<script src="/_geo-common/Guriddo_jqGrid_JS_5.3.1/js/i18n/grid.locale-kr.js"></script>
<script src="/_geo-common/Guriddo_jqGrid_JS_5.3.1/js/jquery.jqGrid.min.js"></script>
<script src="/_geo-common/JointJS/lodash.js"></script>
<script src="/_geo-common/JointJS/backbone.js"></script>
<script src="/_geo-common/JointJS/joint.min.js"></script>
<script src="/_geo-common/D3/d3.js"></script>
<script src="/fixadata-common/js/FixaData-Process.js"></script>

</head>
<body><div id="_body" class="_body"><div id="_inni" class="_inni">
<div id="wrap" class="panel">

<header id="wrHeader">
<jsp:include page="/fixadata-common/inc/header.jsp" />
</header><!--// #wrHeader -->

	<div id="wrContents">

		<ul id="arSheet"><!--
			--><li class="item"><a href="#" class="on">데이터 전처리(Data Preparation)</a></li><!--
			--><li class="item"><a href="#" class="lock">데이터 이상치 검출(Data Outlier Detection)</a></li><!--
			--><li class="item"><a href="#" class="lock">이상치 검출 결과(Data Detection Result)</a></li><!--
		--></ul><!--// #arSheet -->

		<div id="arContent">
<form id="form" method="post" action="#" onsubmit="return false">
			<div class="content grid on"><table id="itmHeadendGrid"></table></div><!--// ### 콘텐츠 : 데이터 그리드 -->
			<div class="content diagram">
				<div id="itmDiagramItem"></div>
				<div id="itmDiagram">
					<div id="itmDiagramCanvas"></div>
				</div>
			</div><!--// ### 콘텐츠 : 이상치 검출 다이어그램 -->
			<div class="content output">
				<table id="itmStatistic">
				<thead>
					<tr>
						<th scope="col">룰 명칭</th>
						<th scope="col">Column 명칭</th>
						<th scope="col">이전 데이터 수</th>
						<th scope="col">이상치 데이터 수</th>
						<th scope="col">검출 후 데이터 수</th>
					</tr>
				</thead>
				</table>
				<div id="itmChart" style="margin-top:50px;width:100%; height:400px; background-color:#f4f4f4">
					<div class="list"></div>
					<svg id="outputChart" width="800" height="400"></svg>
				</div>
			</div><!--// ### 콘텐츠 : 이상치 검출 결과 -->
</form>
		</div><!--// #arContent -->

		<div id="arConsole">
			<div class="itmPanel">
				<div class="header">
					<div class="title">Console</div>
					<div class="button"><a href="#" class="changeRight">축소</a><span class="line"></span><a href="#" class="close">닫기</a></div>
				</div>
				<div class="contents">
					<div id="consoleText" class="content"><!--<span class="code">[ERR-1004]</span>콘솔 내용을 표출<br><span class="code">[ERR-1004]</span><span class="strong">중요한 내용은 색상으로 강조</span>--></div>
				</div>
			</div><!--// .itmPanel -->
		</div><!--// #arConsole -->
	</div><!--// #wrContents -->

	<aside id="wrSidebar">
		<div id="arHistory">
			<div class="itmPanel">
				<div class="header">
					<div class="title">History</div>
					<div class="button"><a href="#" class="changeRight">축소</a><span class="line">|</span><a href="#" class="close">닫기</a></div>
				</div>
				<div class="contents">
					<div class="item projectName">의약품 안전점검_20180510...</div>
					<ul class="content">
						<li><a href="#" class="item d">데이터 삭제 (R12)</a></li>
						<li><a href="#" class="item u">데이터 수정 (R11,C13)</a></li>
						<li><a href="#" class="item a">데이터 추가 (R18)</a></li>
					</ul>
				</div>
			</div><!--// .itmPanel -->
		</div><!--// #arHistory -->

		<div id="arChatbot">
			<div class="itmPanel">
				<div class="header">
					<div class="title">Chatbot</div>
					<div class="button"><a href="#" class="changeRight">축소</a><span class="line"></span><a href="#" class="close">닫기</a></div>
				</div>
				<div class="contents">
					<div class="content">
						<ul class="text">
							<li><span class="time">00:00</span><span class="message"> ===이곳은 입력한 챗 내용이 표출 되는 부분 입니다=== </span></li>
						</ul>
						<div class="input"><input name="CHATBOT_INPUT" type="text" value=""><a href="#" class="button">말풍선 버튼(입력 텍스트 전송)</a></div>
					</div>
				</div>
			</div><!--// .itmPanel -->
		</div><!--// #arChatbot -->
	</aside><!--// #wrSidebar -->

</div><!--// #wrap -->
</div></div></body>
</html>
