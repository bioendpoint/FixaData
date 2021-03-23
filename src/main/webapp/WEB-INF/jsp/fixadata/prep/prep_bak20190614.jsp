<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<!-- header  -->
<c:import url="/common/page.fd?page=header2"/>
<!--// header  -->

	<link rel="stylesheet" type="text/css" href="/fixadata-common/css/FixaData-Process.css">

	
	<script src="/fixadata-common/plugin/slickgrid/jquery-1.7.min.js"></script> 
	
	<!-- slickgrid  -->
 	<script src="/fixadata-common/plugin/slickgrid/jquery.event.drag-2.2.js"></script>
    <script src="/fixadata-common/plugin/slickgrid/slick.core.js"></script>
    <script src="/fixadata-common/plugin/slickgrid/slick.grid.js"></script> 
    <script src="/fixadata-common/plugin/slickgrid/slick.dataview.js"></script>
    <script src="/fixadata-common/plugin/slickgrid/slick.formatters.js"></script>
    <script src="/fixadata-common/plugin/slickgrid/slick.editors.js"></script>
    <script src="/fixadata-common/plugin/jqueryui/jquery-ui.js"></script>
     <!-- //slickgrid  -->
    
	<script src="/fixadata-common/common.js"></script>
	<script src="/fixadata-common/member.js"></script>
	<script src="/fixadata-common/collect.js"></script>  
	<script src="/fixadata-common/outlier.js"></script>

	<!-- 데이터 이상치 검출용  lib -->
	<script src="/_geo-common/JointJS/lodash.js"></script>
	<script src="/_geo-common/JointJS/backbone.js"></script>
	<script src="/_geo-common/JointJS/joint.min.js"></script>
	<script src="/_geo-common/D3/d3.js"></script>
	<script src="/_geo-common/D3/boxPlot.js"></script>
	<script src="/_geo-common/D3/d3-selection-multi.v1.min.js"></script>
	<script src="/_geo-common/D3/d3_timeseries.min.js"></script>
	<script src="/fixadata-common/js/FixaData-Process.js"></script>  
	
	<style type="text/css">
		.line {
	      fill: none;
	      stroke: steelblue;
	      stroke-width: 1.5px;
	</style>
 	<script type="text/javascript">

	var prep = {};
	var columnFilters = {};
	var grid;
	var options = {
	  enableCellNavigation: true,
	  enableColumnReorder: false,
	  asyncEditorLoading: false,
	  /**col 수정 가능 여부**/
	  editable: true,
	  //showHeaderRow: true,

	};
	
	var project_sn = ${searchVO.project_sn};
	var project_data_sn = ${searchVO.project_data_sn};

	$(function () {
		var columns = [];
	    var data = [];
	    grid = slickGrid.init(options, grid, "prepGrid", columns, data);

	    prep.loadData();
	});

	/**
	 * 데이터 로드
	 */
	prep.loadData = function()
	{
		var param = {
			  "project_sn"     : project_sn
			, "project_data_sn": project_data_sn
		}; 
		
		restRequest('/prep/loadData.fd', 'GET', param, function(data){
			
			if(data.projectName!="" && data.projectName!=null)
			{
				$("#projectNm").val(data.projectName);
				$("#projectNm").attr("readonly",true); 

			}
			
			slickGrid.setColumn(grid, data.result.header);
			slickGrid.setData(grid, data.result.data);
		});
	}

	/**
	 * 데이터 저장
	 */
	prep.saveData = function(){
		
		var projectNm = $("#projectNm").val();
		
		
		if(projectNm == ""){
			alert("프로젝트 이름을 작성해 주세요.");
			return;
		}
		
		
		var gridData = {
				  data : slickGrid.getData(grid)
				, header : slickGrid.getHeaderName(grid)
				, project_sn:project_sn
				, project_data_sn: project_data_sn
			 	, project_nm : projectNm
		}
		
		var jsonData = JSON.stringify(gridData);
		
		
		$.ajax({
		    url: '/prep/savePrep.fd' 
		    ,crossDomain: true
		    ,contentType: 'application/json'
		    ,async: false
		    ,type: 'POST'
		    ,data: jsonData
		    ,dataType: 'json'
		    ,success: function(data) {
				if(data.result=="success")
				{
					if(confirm("outler설정으로 이동하시겠습니까?"))
					{
						location.href  = "/outlier/workflow.fd";
					}
					else
					{
						return ;
					}
				}
		    	
		    }
		    
		});
	}

	 function excelDown() {
		
		var projectNm = $("#projectNm").val();
		
		
		if(projectNm == ""){
			alert("프로젝트 이름을 작성해 주세요.");
			return;
		}
		if(!confirm('엑셀 다운로드 하시겠습니까?')) return;
		var form2 =$("#excelForm");
		//url ="/common/excelDownload.fd?project_sn="+project_sn+"&project_data_sn="+project_data_sn+"&project_nm="+projectNm;
		url ="/common/excelDownload.fd";
		
		$("input[name='project_sn']").val(project_sn);
		$("input[name='project_data_sn']").val(project_data_sn);
		$("input[name='project_nm']").val(project_nm);
		
		form2.action = url; 
		form2.submit();
	} 
	
</script> 

</head>
<body><div id="_body" class="_body"><div id="_inni" class="_inni">
<div id="wrap" class="panel">
	<form id="excelForm" name="excelForm" method="post" enctype="multipart/form-data">
		<input type="hidden" name="project_sn" value="">
		<input type="hidden" name="project_data_sn" value="">
		<input type="hidden" name="project_nm" value="">
		
	</form>
	<header id="wrHeader">
		<jsp:include page="/fixadata-common/inc/header.jsp" />
	</header><!--// #wrHeader -->

	<div id="wrContents">

		<ul id="arSheet">
			<li class="item"><a href="#" class="on">데이터 전처리</a></li>
			<li class="item"><a href="#" >데이터 이상치 검출</a></li>
			<li class="item"><a href="#" class="lock">이상치 검출 결과</a></li>
		</ul>
		<!--// #arSheet -->

		<div id="arContent">
			<input type="hidden" id="projectNm" name="projectNm" ></input>
			
			 <form id="form" method="post" action="#" onsubmit="return false">
			
					<div class="content grid on">
						<table id="itmHeadendGrid" style="table-layout:fixed; width:100%; height: 100%; ">
							<tr>
								<td>
									<button type="button" onclick="prep.loadData();" style="height: 30px; margin-right: 3px;">데이터 초기화</button> 
										<button id="btn_excel" type="button" onclick="excelDown();"  style="height: 30px;">엑셀다운로드</button>
								</td>
							</tr>
							<tr>
								<td>
									<div id="prepGrid" style="width: 100%; height: 100%;"></div>
								</td>
							</tr>
						</table>
					</div>
					<!--// ### 콘텐츠 : 데이터 그리드 -->

					<div class="content diagram">
						<div id="itmDiagramItem"></div>
						<a href="#" id="itmDiagramPlus"></a>
						<div id="itmDiagram">
							<div id="itmDiagramCanvas"></div>
						</div>
					</div>
					<!--// ### 콘텐츠 : 이상치 검출 다이어그램 -->
					
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
					</div>
					<!--// ### 콘텐츠 : 이상치 검출 결과 -->
					
			</form> 
		</div>
		<!--// #arContent -->

<!-- footer  -->
<c:import url="/common/page.fd?page=footer"/>
<!--// footer  -->