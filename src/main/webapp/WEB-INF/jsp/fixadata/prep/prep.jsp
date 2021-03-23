
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>


<jsp:include page="/fixadata-common/inc/lang.jsp" />
<c:import url="/common/page.fd?page=header2"/>
<link rel="stylesheet" type="text/css" href="/_geo-common/jQuery/jquery-ui-1.12.1/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="/_geo-common/JointJS/css/joint.min.css">
<link rel="stylesheet" type="text/css" href="/fixadata-common/css/FixaData-Process.css">

<script src="/_geo-common/JointJS/lodash.js"></script>
<script src="/_geo-common/JointJS/backbone.js"></script>
<script src="/_geo-common/JointJS/joint.min.js"></script>
<script src="/_geo-common/D3/d3.js"></script>
<script src="/_geo-common/D3/boxPlot.js"></script>
<script src="/_geo-common/D3/d3-selection-multi.v1.min.js"></script>
<script src="/_geo-common/D3/d3_timeseries.min.js"></script>

<!--  -->
<link href="/fixadata-common/ImageViewer/Image-Viewer-Plugin-jQuery-Magnify/dist/jquery.magnify.css" rel="stylesheet">
<script src="/fixadata-common/ImageViewer/Image-Viewer-Plugin-jQuery-Magnify/dist/jquery.magnify.js"></script>

<script src="/fixadata-common/js/FixaData-Process.js"></script>
<script src="/fixadata-common/js/FixaData-Core.js"></script>
<script src="/fixadata-common/js/FixaData-PrepSetting.js"></script>
<link rel="stylesheet" type="text/css" href="/_geo-common/C3/c3.css">
<script src="/_geo-common/C3/c3.js"></script>

<script type="text/javascript">
	var testData = [];
	var commandQueue = [];
	var statis_time;
	var prep = {};
	var columnFilters = {};
	var grid;
	var columns = [];
	var data = [];
    var ori_data = [];
	var options = {
	  enableCellNavigation: true,
	  enableColumnReorder: false,
	  asyncEditorLoading: false,
	  /**col 수정 가능 여부**/
	  editable: true,
	  forceFitColumns: false,
	  //showHeaderRow: true,
	  enableAddRow: false,
	  autoEdit: false,
	  editCommandHandler: queueAndExecuteCommand,
	  multiColumnSort: true
	};
	
	var workflow_result;
	var session_project_data_sn;
	var project_sn = ${searchVO.project_sn};
	var project_data_sn = ${searchVO.project_data_sn};
	Options.project_sn = ${searchVO.project_sn};
	Options.project_data_sn = ${searchVO.project_data_sn};
	var count = 0;
// 	function winClose(){
// 		 open(location, '_self').close();
// 		 return false;
// 	}

	$(function () {
		Prep.ManifySetting();
		Prep.EventSetting();
		
		Core.Prep.LoadDiagramData(); 
		
		//이미 다이어그램이 그려졌을 경우 다시 그리지 않음
		if(diagramfirst == false){
			Process.DocReady();
		}
		Prep.GridSetting();
		Prep.GridDataSetting(project_sn,project_data_sn);

		Options.oriPaperScrollY = parseInt($(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").css("height").replace("px",""));
		Options.oriPaperScrollX = parseInt($(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").css("width").replace("px",""));
	});

	//데이터 수정시 데이터 push
 	function queueAndExecuteCommand(item, column, editCommand) {
	    commandQueue.push(editCommand);
	    editCommand.execute();
	    count++;
	    Core.Prep.HistoryAdd(item , column ,editCommand , count , commandQueue);
	    
	}
	
	function excelDown() {
		var projectNm = $("#projectNm").val();

		if(projectNm == ""){
			alert("<spring:message code="fixa.prep.title001"/>"); //프로젝트 이름을 작성해 주세요.
			return;
		}

		//엑셀 다운로드 하시겠습니까?
	 	if(!confirm('<spring:message code="fixa.prep.title002"/>')) return;
		var excelFrm =document.excelForm;
		
		excelFrm.action = "/common/excelDownload.fd?project_sn="+project_sn+"&project_data_sn="+project_data_sn+"&project_nm="+projectNm;
		excelFrm.submit(); 
		
	} 
	function resultFun(x){
		var target = document.getElementById('itmDiagramCanvas');
		var clientRect = target.getBoundingClientRect(); // DomRect 구하기 (각종 좌표값이 들어있는 객체)
		var relativeTop = clientRect.top; // Viewport의 시작지점을 기준으로한 상대좌표 Y 값.
		var relativeLeft = clientRect.left; // Viewport의 시작지점을 기준으로한 상대좌표 Y 값.
		var scrolledTopLength = window.pageYOffset; // 스크롤된 길이
		var scrolledLeftLength = window.pageXOffset; // 스크롤된 길이
		var absoluteTop = scrolledTopLength + relativeTop; // 절대좌표
		var absoluteLeft = scrolledLeftLength + relativeLeft; // 절대좌표
	    var xY = x.clientX +  " * "  + (x.clientY-absoluteTop) ;
		var result = x.clientY-absoluteTop;
		var result2 = x.clientX-absoluteLeft; 
		var default_canvasY = parseInt($("#itmDiagramCanvas").css("height").replace("px",""));
		var default_canvasX = parseInt($("#itmDiagramCanvas").css("width").replace("px",""));
		if(result > 0 && result <= default_canvasY){
		}else{
			if(result >= default_canvasY){
				if(Options.checkPointY == true){
					$(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").css("height",parseInt($(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").css("height").replace("px",""))+300);
					Options.checkPointY = false;
					if(result2 >= parseInt($("#itmDiagramCanvas").css("width").replace("px",""))){
						$(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").css("width",parseInt($(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").css("width").replace("px",""))+300);
					}
				}
			}
		}
		
		if(result2 > 0 && result2 <= default_canvasX){
		}else{
			if(result2 >= default_canvasX){
				if(Options.checkPointX == true){
					$(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").css("width",parseInt($(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").css("width").replace("px",""))+300);
					Options.checkPointX = false;
					if(result >= parseInt($("#itmDiagramCanvas").css("height").replace("px",""))){
						$(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").css("height",parseInt($(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").css("height").replace("px",""))+300);
					}
				}
			}
		}
		if(Options.dragId != ""){
						
			var str = $("g[model-id='"+Options.dragId+"']").attr("transform");
			if(str!= undefined){
				var no = str.replace('translate',"").replace("(","").replace(")","").split(",");
				if(no[1] < 0){
					$("g[model-id='"+Options.dragId+"']").attr("transform","translate("+no[0]+","+0+")");
				}
				if(no[0] < 0){
					$("g[model-id='"+Options.dragId+"']").attr("transform","translate("+0+","+no[1]+")");
				}
			}
		}
	}
	
	function active(id){
		activePage = id;
		$("#activePage").val(id);
	}
	
</script> 
</head>
<div id="div_ajax_load_image" style="position: absolute;top: 0; left: 0; width: 100%; height: 100%; z-index: 9999;  margin: auto; padding: 0px; display: none;background-color: gainsboro;filter:opacity(0.5)">
	<div style="position:relative">
		<table width="160px" border="0">
			<!-- 
			<tr>
				<td><font class="progress_loading">loading...</font></td>
			</tr>
			<tr>
				<td align="">
					<img src="/fixadata-common/images/ajax-loader.gif">
					
				</td>
			</tr>
			 -->
		</table>
	</div>
</div>
<div id="div_ajax_load_image2" style="position: absolute; top: calc(50% - 40px); left: calc(50% - 80px); width: 180px; height: 20px; z-index: 99999;  margin: auto; padding: 0px; display: none;">
	<div style="position:relative">
		<table width="180px" border="0">
			<tr>
				<td><font class="progress_loading"><div id="loading_bar">통계 설정중 입니다..</div></font></td>
			</tr>
			<tr>
				<td align="">
					<img src="/fixadata-common/images/ajax-loader.gif">
				</td>
			</tr>
		</table>
	</div>
</div>
<body><div id="_body" class="_body"><div id="_inni" class="_inni">

<div class="ng_bg">
	<div class="ng_bg_next" onclick='Prep.tutorialNext()'><span>N</span> next</div>
	<div class="ng_bg_close" onclick='$(".ng_bg").hide()'><span>X</span> close</div>
	
    <div class="tutorial_01">
    	<div class="tutorial_area">
        	<div class="tutorial_arrow"><img src="/fixadata-common/images/arrow_01.png" /></div>
            <div class="tutorial_text_area">
        	<h3><b>console</b></h3>
            <p>console은 동작하는 주요내용에 대한 log내용을 화면에 표시</p>
        </div>
        </div>
    </div>
    
    <div class="tutorial_02">
    	<div class="tutorial_area">
        	<div class="tutorial_arrow"><img src="/fixadata-common/images/arrow_01.png" /></div>
            <div class="tutorial_text_area">
        	<h3><b>blockchain</b></h3>
            <p>block chain은 data prepprocessing 에서 데이터의 변경 내용을 추적및 표시함</p>
        </div>
        </div>
    </div>
    
    <div class="tutorial_03">
    	<div class="tutorial_area">
        	<div class="tutorial_arrow"><img src="/fixadata-common/images/arrow_01.png" /></div>
            <div class="tutorial_text_area">
        	<h3><b>diagram</b></h3>
            <p>검출하고자하는 다이어그램을 drag&drop하여 stage에 구성하는 역활을 담당하고, stage의 diagram을 더블클릭하여 속성을 설정할수있음. </p>
        </div>
        </div>
    </div>
    
    <div class="tutorial_04">
    	<div class="tutorial_area">
        	<div class="tutorial_arrow"><img src="/fixadata-common/images/arrow_02.png" /></div>
            <div class="tutorial_text_area">
        	<h3><b>run(play)</b></h3>
            <p>설정된 diargam의 필수 입력값을 선택 및 설정하신후 run(play) 버튼을 클긱하여 기동할수있음.</p>
        </div>
        </div>
    </div>
    
    <div class="tutorial_05">
    	<div class="tutorial_area">
        	<div class="tutorial_arrow"><img src="/fixadata-common/images/arrow_01.png" /></div>
            <div class="tutorial_text_area">
        	<h3><b>anomlay detection</b></h3>
            <p>기동된 결과물을 anolay detection tab에서 확인할수있습니다.</p>
        </div>
        </div>
    </div>
</div>

<!-- <input type="button"  onclick="return winClose('quit');"> -->
<div style="width: 100%; height: 10px; display: inline-block; background: rgba(0,0,0,0)"></div>
<div id="wrap" class="panel">

<div class="slide_right2" id="right_slide_open_btn" onClick="Core.Panel.Close('open_console')"></div>
<div class="slide_left2" id="left_slide_open_btn" onClick="Core.Panel.Close('open_history')"></div>

<input type ="hidden" id= "activePage" value="">

<header id="wrHeader">
	<jsp:include page="/fixadata-common/inc/header.jsp" />
</header><!--// #wrHeader -->

<div id="wrContents">
<div class="logo_area"></div>
<div class="logo_name">
	<div class="title">FixaData</div>
	<div class="varsion">Ver. ${version_info}</div>
</div>
<div class="custom_titile">FixaData build by Tom.DongHyuk</div>

<div class="macaddr">Mac address : <span>${mac_address_info}</span></div>

<ul class="top_btn_group">
	<li class="btn_login"></li>
	<li class="btn_lang"></li>
	<li class="btn_help"></li>
</ul>
	<div id="itmDiagramItem"></div>
	<a href="#" id="itmDiagramPlus"></a>
	<ul id="arSheet">
		<li class="item one" child_id="data_ori" z_index_status="100">
			<div class="tab_btn_left"></div>
			<a href="#"  id="data_ori"   class="on"><spring:message code="fixa.prep.title009"></spring:message></a><!--원본데이터-->
			<div class="tab_btn_right"></div>
		</li>
		<li class="item two" child_id="data_prep"  z_index_status="90">
			<div class="tab_btn_left"></div>
			<a href="#"  id="data_prep"   class=""><spring:message code="fixa.prep.title003"/></a><!-- 데이터 전처리 -->
			<div class="tab_btn_right"></div>
		</li>
		<li class="item three" child_id="data_workflow" z_index_status="80">
			<div class="tab_btn_left"  ></div>
			<a href="#" id="data_workflow" class=""><spring:message code="fixa.prep.title014"></spring:message></a><!--원본데이터-->
			<div class="tab_btn_right"></div>
		</li>
		<li class="item four" child_id="workflow_output"  z_index_status="70">
			<div class="tab_btn_left"></div>
			<a href="#"  id='workflow_output'  class="lock"><spring:message code="fixa.prep.title005"/></a><!-- 이상치 검출 결과 -->
			<div class="tab_btn_right"></div>
		</li>
		<li class="item five" child_id="data_output"  z_index_status="60" style="display:none;">
			<div class="tab_btn_left"></div>
			<a href="#"  id="data_output"  class=""><spring:message code="fixa.prep.title004"/></a><!-- 데이터이상치 검출 -->
			<div class="tab_btn_right"></div>
		</li>
	</ul>
	<!--// #arSheet -->
 
	<div id="arContent">
		
		<ul id="diagram_contextMenu" style="display:none;position:absolute">
		  <li onclick="Core.Diagram.TemplateSave();"><spring:message code="fixa.prep.title015"/></li>
		</ul>
		<ul id="contextMenu" style="display:none;position:absolute">
		  <b>Set priority:</b>
		  <li onClick='alert(1)'>추가</li>
		  <li onClick='alert(2)'>삭제</li>
		</ul>
		<!-- excel 다운로드 폼 -->
		<form id="excelForm" name="excelForm" method="post"enctype="multipart/form-data" style="text-align: right;"/></form>
		<form id="form" method="post" action="#" onsubmit="return false">
			<input type='hidden' name='project_sn' id='project_sn'value="${searchVO.project_sn}"> 
			<input type='hidden' name='project_data_sn' id='project_data_sn'value="${searchVO.project_data_sn}"> 
			<input type="hidden" id="projectNm" name="projectNm" />
			
			<div class="content ori on">
				<div class="tab_bar">
					<ul>
						<li class="tab_bar_left"></li>
						<li class="tab_bar_m"></li>
						<li class="tab_bar_right"></li>
					</ul>
				</div>
				<div id="oriGrid" style="width: 100%; height: 97%;"></div>
			
			</div>
			<div class="content grid ">
				<div class="tab_bar">
					<ul>
						<li class="tab_bar_left"></li>
						<li class="tab_bar_m"></li>
						<li class="tab_bar_right"></li>
					</ul>
				</div>
				<div id="itmHeadendGrid2" style="width: 100%; height: 100%;">
					<div id="prepGrid" style="width: 100%; height: 97%;"></div>
				</div>
			</div>
			<div class="content diagram">
				<div class="tab_bar">
					<ul>
						<li class="tab_bar_left"></li>
						<li class="tab_bar_m"></li>
						<li class="tab_bar_right"></li>
					</ul>
				</div>
				
				<div id="itmDiagram">
					<div id="itmDiagramCanvas" style="overflow:scroll;"></div>
	
					<textarea name='workflow_json'style='width: 300px; height: 200px; display: none'>
								
					</textarea>
				</div>
			</div>	
			
			<!--// ### 콘텐츠 : 데이터 그리드 -->
			<div class="content output">
				<div class="tab_bar">
					<ul>
						<li class="tab_bar_left"></li>
						<li class="tab_bar_m"></li>
						<li class="tab_bar_right"></li>
					</ul>
				</div>		
				<div id='result'>
					<ul class="tabs" id="result_tab">
						
					</ul>
	
					<div class="tab_container" id="result_tab_content">
						
	
					</div>
				</div>
	
			</div>
			<!--// ### 콘텐츠 : 이상치 검출 결과 -->
			<div class="content diagram22">
				<div class="tab_bar">
					<ul>
						<li class="tab_bar_left"></li>
						<li class="tab_bar_m"></li>
						<li class="tab_bar_right"></li>
					</ul>
				</div>
				
				<div id="itmDiagram">
					<div id="itmDiagramCanvas22" style="overflow:scroll;"></div>
	
					<textarea name='workflow_json'style='width: 300px; height: 200px; display: none'>
								
					</textarea>
				</div>
			</div>
			<!--// ### 콘텐츠 : 이상치 검출 다이어그램 -->
			
			
		</form>
	</div>

	<!--// #arContent -->
	<div id="arConsole">
		<div class="itmPanel">
			<div class="header">
				<a href="#" data-id="console" class="title one on">
					<div class="tab_btn_left"  ></div>
					<div class="console on">Console</div>
					<div class="tab_btn_right"></div>
				</a> 
				<a href="#" data-id="blockchain" class="title two">
					<div class="tab_btn_left"></div>
					<div class="blockchain">Blockchain</div>
					<div class="tab_btn_right"></div>
				</a>
				
				
				
				<!-- <div class="button">
					<a href="#" class="minimize changeBottom">minimize</a><span
						class="line"></span><a href="#" class="close">close</a>
				</div>
				 -->
			</div>
			<div data-id="console" class="contents on">
				<div class="tab_bar2">
					<ul>
						<li class="tab_bar_left"></li>
						<li class="tab_bar_m"></li>
						<li class="tab_bar_right"></li>
					</ul>
				</div>
				<div id="consoleText" class="content">
				</div>
			</div>
			<div data-id="blockchain" class="contents">
				<div class="tab_bar2">
					<ul>
						<li class="tab_bar_left"></li>
						<li class="tab_bar_m"></li>
						<li class="tab_bar_right"></li>
					</ul>
				</div>
<!-- 				<div id="blockchainInfo" class="info"></div> -->
				<div id="blockchain" class="content block">
					
				</div>
					<div style="position: absolute;top: 30px;left: 0px;width: 100%;display: none;">
						<ul class="bc_area">
							<li class="bc_icon"></li>
							<li>
								<p>Block-number:<span>#0030</span></p>
								<p>create_time:<span>20200610000011</span></p>
								<p>Block-size:<span>100</span></p>
								<p>Block-owner:<span>aa:xx:dd:ee</span></p>
							</li>
							<li class="bc_down"></li>
						</ul>
						<ul class="bc_area">
							<li class="bc_icon"></li>
							<li>
								<p>Block-number:<span>#0030</span></p>
								<p>create_time:<span>20200610000011</span></p>
								<p>Block-size:<span>100</span></p>
								<p>Block-owner:<span>aa:xx:dd:ee</span></p>
							</li>
							<li class="bc_down"></li>
						</ul>
						<ul class="bc_area">
							<li class="bc_icon"></li>
							<li>
								<p>Block-number:<span>#0030</span></p>
								<p>create_time:<span>20200610000011</span></p>
								<p>Block-size:<span>100</span></p>
								<p>Block-owner:<span>aa:xx:dd:ee</span></p>
							</li>
							<li class="bc_down"></li>
						</ul>
						<ul class="bc_area">
							<li class="bc_icon"></li>
							<li>
								<p>Block-number:<span>#0030</span></p>
								<p>create_time:<span>20200610000011</span></p>
								<p>Block-size:<span>100</span></p>
								<p>Block-owner:<span>aa:xx:dd:ee</span></p>
							</li>
							<li class="bc_down"></li>
						</ul>
						<ul class="bc_area">
							<li class="bc_icon"></li>
							<li>
								<p>Block-number:<span>#0030</span></p>
								<p>create_time:<span>20200610000011</span></p>
								<p>Block-size:<span>100</span></p>
								<p>Block-owner:<span>aa:xx:dd:ee</span></p>
							</li>
							<li class="bc_down"></li>
						</ul>
					</div>
				
				<div class="_clear"></div>
			</div>
		</div>
		<!--// .itmPanel -->
		<div class="slide_left" id="left_slide_btn" onclick="Core.Panel.Close('console')"></div>
	</div>
	<!--// #arConsole -->
	<aside id="wrSidebar">

		<div id="arHistory">
			<div class="itmPanel">
				<div class="header">
					<div class="title history on">
						<div class="tab_btn_left"  ></div>
						<a href="#" id="" class="on">History</a>
						<div class="tab_btn_right"></div>
					</div>
					<div class="title property">
						<div class="tab_btn_left"></div>
						<a href="#"  id="" class=""><spring:message code="fixa.prep.title006"/><!-- 속성설정 --></a>
						<div class="tab_btn_right"></div>
					</div>
					<div class="button"><!--a href="#" class="minimize changeRight"><spring:message code="fixa.prep.title010"/></a><span class="line">|</span--><!-- <a href="#" class="close"><spring:message code="fixa.prep.title011"/></a> --></div>
					<div class="tab_bar3">
					<ul>
						<li class="tab_bar_left"></li>
						<li class="tab_bar_m"></li>
						<li class="tab_bar_right"></li>
					</ul>
				</div>
				</div>
				<div class="contents on" id="itmHistory">
					
					<div id="historyProjectName" class="item projectName"></div>
					<ul id="itmHistoryGrid" class="content itmHistory">
						<li><a href="#" class="item a now" data-id="" id="0" data-index-row="-1" data-index-col="-1" data-value-bef="" data-value-aft="" onclick="Core.Prep.HistoryClick(this);"><spring:message code="fixa.prep.title012"/>
						<input type='hidden' name='mac_address' id='mac_address'></a></li>
						 
					</ul>
					<ul id="itmHistoryDiagram" class="content itmHistory _none">
						<li><a href="#" class="item a now" data-id="" id="0" data-index-row="-1" data-index-col="-1" data-value-bef="" data-value-aft="" onclick="Core.History.DiagramClick(this);"><spring:message code="fixa.prep.title013"/></a></li>
					</ul>
					
				</div>
				<div class="contents" id="itmProperty">
				
				</div>
			</div><!--// .itmPanel -->
		</div><!--// #arHistory -->


		<div id="arChatbot">
			<div class="itmPanel">
				<div class="header">
					<div class="title on">Chatbot</div>
					<div class="button"><!--a href="#" class="minimize changeRight"><spring:message code="fixa.prep.title010"/></a><span class="line"></span--><a href="#" class="close"><spring:message code="fixa.prep.title011"/></a></div>
				</div>
				<div class="contents">
					<div class="content">
						<ul id="chatBot" class="text">
							<!--<li><span class="time">00:00</span><span class="message">이곳은 입력한 챗 내용이 표출 되는 부분 입니다.</span></li>-->
							<li><span class="message widthFull"><spring:message code="fixa.prep.title007"/><!-- [시스템] 명령 단어 또는 문장을 입력하세요. --></span></li>
						</ul>
<%-- 						<div class="input"><input id="inputChatBot" name="CHATBOT_INPUT" type="text" value=""><a href="#" id="btnChatBot" class="button"><spring:message code="fixa.prep.title008"/><!-- 말풍선 버튼(입력 텍스트 전송) --></a></div> --%>
					</div>
				</div>
			</div><!--// .itmPanel -->
		</div><!--// #arChatbot -->
	<div class="slide_right" id="right_slide_btn" onclick="Core.Panel.Close('history')"></div>
	</aside><!--// #wrSidebar -->
	
	
	<div class="bottom_raund"></div>
</div>
<!--// #wrContents -->

<div class="foot_area">



<table>
	<tr>
		<td>
			<ul class="foot_btn_group">
				<li class="btn_file" item-type="menuItem"></li>
				<li class="btn_admin" item-type="menuItem"></li>
				<li class="btn_windows" item-type="menuItem"></li>
			</ul>
		</td>
		<td><div class="btn_save" item-type="menuItem" onClick="Core.Project.SaveShow();return false;"></div></td>
		<td>
			<div class="search_area">
			<input type="text" id="inputChatBot" name="CHATBOT_INPUT">
			<div class="search_btn"></div>
		</div>
		</td>
		<td>
			<ul class="play_area">
				<li class="btn_preview" onClick="Core.History.Undo(this);return false;"></li>
				<li class="btn_play" onClick="Core.Diagram.run('workflow');return false;"></li>
				<li class="btn_next" onClick="Core.History.Redo(this);return false;"></li>
			</ul>
		</td>
		<td>
			<div class="progress_bar">
				<img id="progress_img" src="/fixadata-common/images/slider_loding.png" style="background-color: transparent;">
				<img id="progress_img2" src="/fixadata-common/images/slider_loding.gif" style="background-color: transparent;display: none;">
<!-- 				<div id="slider"></div> -->
				
			</div>
		</td>
		<td>
			<ul class="import_area">
				<li class="btn_export" onClick="Core.exportData();"></li>
				<li class="btn_import" onClick="Core.importData();"></li>
			</ul>
		</td>
		
	</tr>
</table>

</div>
	
</div><!--// #wrap -->
</div></div>
<jsp:include page="/fixadata-common/inc/foot.jsp" />
<script>
$(window).resize( function() {
	
	try{
		$.each(Object.keys(Options.Variable.slickGrid.id),function(k,v){
			Options.Variable.slickGrid.id[v].resizeCanvas();
		});
	}catch(e)
	{
		console.log(e);
	}
	
});

</script>
<iframe id="hidden_ifr"></iframe>