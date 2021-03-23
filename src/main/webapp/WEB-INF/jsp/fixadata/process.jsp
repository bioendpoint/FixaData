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
<script src="/_geo-common/D3/boxPlot.js"></script>
<script src="/_geo-common/D3/d3-selection-multi.v1.min.js"></script>
<script src="/_geo-common/D3/d3_timeseries.min.js"></script>
<script src="/fixadata-common/js/FixaData-Process.js"></script>

<style>
	.line {
      fill: none;
      stroke: steelblue;
      stroke-width: 1.5px;
</style>
</head>

<body><div id="_body" class="_body"><div id="_inni" class="_inni">
<div id="wrap" class="panel">
<header id="wrHeader">
<jsp:include page="/fixadata-common/inc/header.jsp" />
</header><!--// #wrHeader -->

	<div id="wrContents">

		<ul id="arSheet"><!--
			--><li class="item"><a href="#" class="on"><spring:message code="fixa.proc.title001"/></a></li><!--
			--><li class="item"><a href="#" class="lock"><spring:message code="fixa.proc.title002"/></a></li><!--
			--><li class="item"><a href="#" class="lock"><spring:message code="fixa.proc.title003"/></a></li><!--
		--></ul><!--// #arSheet -->

		<div id="arContent">
		<form id="form" method="post" action="#" onsubmit="return false">
			<div class="content grid on"><table id="itmHeadendGrid"></table></div><!--// ### 콘텐츠 : 데이터 그리드 -->
			<div class="content diagram">
				<div id="itmDiagramItem"></div>
				<a href="#" id="itmDiagramPlus"></a>
				<div id="itmDiagram">
					<div id="itmDiagramCanvas"></div>
				</div>
			</div><!--// ### 콘텐츠 : 이상치 검출 다이어그램 -->
			<div class="content output">
				<div id="itmChart" class="bxChartR">
					<div id="OutputChartMetrix" class="bxChart metrix"></div>
					<div id="OutputChartBoxplot" class="bxChart boxplot"></div>
				</div>
				<div id="itmScriptR" class="bxChartR">
					<pre id="OutputScriptStr" class="bxChart metrix"></pre>
					<pre id="OutputScriptSummary" class="bxChart boxplot"></pre>
				</div>
				<table id="itmStatistic">
				<thead></thead>
				<tbody></tbody>
				</table>
			</div><!--// ### 콘텐츠 : 이상치 검출 결과 -->
		</form>
		</div><!--// #arContent -->

		<div id="arConsole">
			<div class="itmPanel">
				<div class="header">
					<a href="#" data-id="console" class="title on">Console</a>
					<a href="#" data-id="blockchain" class="title">Blockchain</a>
					<div class="button"><a href="#" class="minimize changeBottom">축소</a><span class="line"></span><a href="#" class="close"><spring:message code="fixa.proc.title004"/></a></div>
				</div>
				<div data-id="console" class="contents on">
					<div id="consoleText" class="content"><!--<span class="code">[ERR-1004]</span>콘솔 내용을 표출<br><span class="code">[ERR-1004]</span><span class="strong">중요한 내용은 색상으로 강조</span>--></div>
				</div>
				<div data-id="blockchain" class="contents">
					<div id="blockchainInfo" class="info"></div>
					<div id="blockchain" class="content block"></div>
					<div class="_clear"></div>
				</div>
			</div><!--// .itmPanel -->
		</div><!--// #arConsole -->

	</div><!--// #wrContents -->

	<aside id="wrSidebar">

		<div id="arHistory">
			<div class="itmPanel">
				<div class="header">
					<div class="title history on">History</div>
					<div class="title property"><spring:message code="fixa.proc.title005"/></div>
					<div class="button"><!--a href="#" class="minimize changeRight">축소</a><span class="line">|</span--><a href="#" class="close"><spring:message code="fixa.proc.title004"/></a></div>
				</div>
				<div class="contents on" id="itmHistory">
					<div id="historyProjectName" class="item projectName"></div>
					<ul id="itmHistoryGrid" class="content itmHistory">
						<li><a href="#" class="item a now" data-id="" id="0" data-index-row="-1" data-index-col="-1" data-value-bef="" data-value-aft="" onclick="Core.History.GridClick(this);"><spring:message code="fixa.proc.title006"/></a></li>
					</ul>
					<ul id="itmHistoryDiagram" class="content itmHistory _none">
						<li><a href="#" class="item a now" data-id="" id="0" data-index-row="-1" data-index-col="-1" data-value-bef="" data-value-aft="" onclick="Core.History.DiagramClick(this);"><spring:message code="fixa.proc.title007"/></a></li>
					</ul>
				</div>
				<div class="contents" id="itmProperty"></div>
			</div><!--// .itmPanel -->
		</div><!--// #arHistory -->

		<div id="arChatbot">
			<div class="itmPanel">
				<div class="header">
					<div class="title on">Chatbot</div>
					<div class="button"><!--a href="#" class="minimize changeRight">축소</a><span class="line"></span--><a href="#" class="close"><spring:message code="fixa.proc.title004"/></a></div>
				</div>
				<div class="contents">
					<div class="content">
						<ul id="chatBot" class="text">
							<!--<li><span class="time">00:00</span><span class="message">이곳은 입력한 챗 내용이 표출 되는 부분 입니다.</span></li>-->
							<li><span class="message widthFull"><spring:message code="fixa.proc.title008"/></span></li>
						</ul>
						<div class="input"><input id="inputChatBot" name="CHATBOT_INPUT" type="text" value=""><a href="#" id="btnChatBot" class="button"><spring:message code="fixa.proc.title009"/></a></div>
					</div>
				</div>
			</div><!--// .itmPanel -->
		</div><!--// #arChatbot -->

	</aside><!--// #wrSidebar -->
</div><!--// #wrap -->
</div></div></body>
</html>