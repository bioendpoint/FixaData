<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<jsp:include page="/fixadata-common/inc/lang.jsp" />

<!-- header  -->
<c:import url="/common/page.fd?page=header2"/>
<!--// header  -->

	<link rel="stylesheet" type="text/css" href="/fixadata-common/css/FixaData-Datainput.css">
	<link rel="stylesheet" type="text/css" href="/fixadata-common/css/FixaData-Process.css">
	<script src="/fixadata-common/js/FixaData-Datainput.js"></script>
	<script src="/fixadata-common/js/FixaData-Core.js"></script>
	
	<script src="/fixadata-common/js/dropzone.js"></script>
	 
	<script src="/fixadata-common/common.js"></script>
    <script src="/fixadata-common/member.js"></script>
    <script src="/fixadata-common/collect.js"></script>  
    <script src="/fixadata-common/outlier.js"></script>
    <script src="/_geo-common/jQuery/jquery.serializeObject.js"></script>
   	
</head>
<script type="text/javascript">

var frmType = "";
	$(function() {
		$(document).on('contextmenu', function() {
			  return false;
			});
		
		var selectOpenApi = $("#openApi option:selected").val();
		if(selectOpenApi == "1"){
			frmType = "1";
			$("#api_name").val($("#openApi option:selected").text());
			$("#innerDOP").css("display","");
			$("#innerIF").css("display","none");
			$("#innerIF2").css("display","none");
		}else if(selectOpenApi == "2"){
			frmType = "2";
			$("#api_name").val($("#openApi option:selected").text());
			$("#innerDOP").css("display","none");
			$("#innerIF").css("display","");
			$("#innerIF2").css("display","none");
		}else if(selectOpenApi == "3"){
			frmType = "3";
			$("#api_name").val($("#openApi option:selected").text());
			$("#innerDOP").css("display","none");
			$("#innerIF").css("display","none");
			$("#innerIF2").css("display","");
		}
		f2collect.listBinding();
		/* f2collect.type('file'); */
		
	});
	function showParm(val){
		if(val == "1"){
			frmType = "1";
			$("#api_name").val($("#openApi option:selected").text());
			$("#innerDOP").css("display","");
			$("#innerIF").css("display","none");
			$("#innerIF2").css("display","none");
		}else if(val == "2"){
			frmType = "2";
			$("#api_name").val($("#openApi option:selected").text());
			$("#innerDOP").css("display","none");
			$("#innerIF").css("display","");
			$("#innerIF2").css("display","none");
		}else if(val == "3"){
			frmType = "3";
			$("#api_name").val($("#openApi option:selected").text());
			$("#innerDOP").css("display","none");
			$("#innerIF").css("display","none");
			$("#innerIF2").css("display","");
		}	
	}
	
	function collectOpenAPI(){
		var formData = "";
		if(frmType == "1"){
			formData = $("#innerDOPfrm").serializeObject();
		}else if(frmType == "2"){
			formData = $("#innerIFfrm").serializeObject();
		}else if(frmType == "3"){
			formData = $("#innerIFfrm2").serializeObject();
		}
		f2collect.insertOpenApiCollect(formData);
	}
	
	/**
	파일 업로드 처리
	**/
	function fileUpload(){
	   if(confirm("<spring:message code="fixa.datainput.fileupload"/>") ) {//파일을 업로드 하시겠습니까?
	         var data = new FormData();
	         for (var i = 0; i < files.length; i++) {
	            data.append('uploadFile', files[i]);
	         }
	         loadingBar();
	         $.ajax({
	            url: "/collect/collectUploadProcess.fd",
	            method: 'post',
	            data: data,
	            dataType: 'json',
	            processData: false,
	            contentType: false,
	            success: function(res) {
	            },
	            complete : function() {
	            	loadingprogresshide();
	                location.href  = "/prep/prep.fd";
	            }
	         });
	     } 
	}
	
	$(function () {
	
		$('.divBox').click(function(){
			$('.divBox').removeClass('on');
			$(this).addClass('on');
		});
	});
	
	var type = "${type}";
	
	$( document ).ready(function() {
		Options.Menu.Tnb.Admin.lock
		if(type=="db")
		{
			$("#collect_title").html("<spring:message code="fixa.datainput.title1"/>"); //데이터 베이스를 통한 데이터 수집
			$("#collect_type_file").hide();
			$("#collect_type_sample").hide();
			$("#collect_type_project").hide();
			$("#collect_type_db").show();
			$("#collect_type_scheduling").hide();
			$("#arInputdata2").show();
		}
		else if(type=="file")
		{
			/*$("#collect_title").html("파일을 통한 데이터 수집");*/
			$("#collect_type_file").show();
			$("#collect_type_sample").hide();
			$("#collect_type_project").hide();
			$("#collect_type_db").hide();
			$("#collect_type_scheduling").hide();
			$("#arInputdata2").hide();
		}
		else if(type=="sample")
		{
			$("#collect_title").html("<spring:message code="fixa.datainput.title2"/>"); //샘플데이터 리스트
			$("#collect_type_file").hide();
			$("#collect_type_sample").show();
			$("#collect_type_project").hide();
			$("#collect_type_db").hide();
			$("#collect_type_scheduling").hide();
			$("#arInputdata2").show();
			
			f2collect.sampleList("sample");
		}
		else if(type=="OpenApi")
		{
			$("#collect_type_file").hide();
			$("#collect_type_sample").show();
			$("#collect_type_project").hide();
			$("#collect_type_db").hide();
			$("#collect_type_scheduling").hide();
			$("#arInputdata2").hide();
			$("#OpenApiData").show();
		}
		else if(type=="scheduling")
		{
			$("#collect_type_file").hide();
			$("#collect_type_sample").hide();
			$("#collect_type_project").hide();
			$("#collect_type_db").hide();
			$("#collect_type_scheduling").show();
			$("#arInputdata2").hide();
			
			f2collect.schedulingBinding();
		}
	});

</script>
<style>

	#container {
	  display: flex;
	  font-size: 15px;
	}
	.divBox {
	  background: #fff;
	  flex: 1;
	  padding:40px 0;
	  text-align: center;
	  border: 1px solid black;
	  cursor: pointer;
	  box-sizing:border-box;
	}
	
	.divBox.on {
		background:#e6edfb;
		color:#3146b3;
	}
	
	.divBox.on div {
		font-weight:bold;
		text-decoration:underline;
	}
	
	   #dropzone
    {
        border:2px dotted #3292A2;
        width:90%;
        height:50px;
        color:#92AAB0;
        text-align:center;
        font-size:30px;
        padding-top:12px;
        margin-top:10px;
    }
    
    #schedulingArea{
     margin-left: auto;
     margin-right: auto;
    }

	
</style>

<body><div id="_body" class="_body"><div id="_inni" class="_inni">
<!--<div id="div_ajax_load_image2" style="position: absolute; top: calc(50% - 40px); left: calc(50% - 80px); width: 180px; height: 20px; z-index: 99999;  margin: auto; padding: 0px; display: none;">
	 <div style="position:relative">
		<table width="180px" border="0">
			<tr>
				<td><font class="progress_loading"><div id="loading_bar">Now API Data Collecting....</div></font></td>
			</tr>
			<tr>
				<td align="">
							
					<img src="/fixadata-common/images/ajax-loader.gif">
				</td>
			</tr>
		</table>
	</div>
</div>-->

<div id="div_ajax_load_image" 
			style="position: absolute;top: 0; left: 0; width: 100%; height: 100%; z-index: 9999;  margin: auto; padding: 0px; display: none;background-color: gainsboro;filter:opacity(0.5)">
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

<div style="width: 100%; height: 10px; display: inline-block; background: rgba(0,0,0,0)"></div>
<div id="wrap" class="panel">
	<header id="wrHeader">
		<jsp:include page="/fixadata-common/inc/header.jsp" />
	</header><!--// #wrHeader -->
	
<div id="wrContents">
<div class="logo_area"></div>
<div class="logo_name">
	<div class="title">FixaData build by Tom.DongHyuk</div>
	<div class="varsion">Ver. ${version_info}</div>
</div>
<div class="custom_titile"><font color="red">Outlier Ditection | Praud Detection | Data Quality | Data Cleansing</font></div>

<div class="macaddr">Mac address xxx : <span>${mac_address_info }</span></div>
<ul class="top_btn_group">
	<li class="btn_login"></li>
	<li class="btn_lang"></li>
	<li class="btn_help"></li>
</ul>

<!-- 스케줄러 리스트 context기능  -->
<ul id="schedule_contextMenu" style="display:none;position:absolute">
  <li  id="start" onclick="f2collect.schedulingActive($(this).attr('schedule_sn'),$(this).attr('id'))"><spring:message code="fixa.scheduling.title037"/><!--기동--></li>
  <li  id="stop" onclick="f2collect.schedulingActive($(this).attr('schedule_sn'),$(this).attr('id'))"><spring:message code="fixa.scheduling.title038"/><!--중지--></li>
  <li  id="delete" onclick="f2collect.schedulingActive($(this).attr('schedule_sn'),$(this).attr('id'))"><spring:message code="fixa.scheduling.title039"/><!--삭제--></li>
</ul>
  <!-- 파일 업로드 시작 -->
  <div id='collect_type_file'> 
  		<form id="uploadFileFrm" name='uploadFileFrm' method="post" enctype="multipart/form-data">
		<input type="hidden" name="collect_flag" value = "file" />
		<input type="file" name="uploadFileCollect" style="display: none;" id="uploadFileCollect" value = "" onchange="Core.Files.FilesInfo2();"/>
			<div id="arInputdata">
				<div class="fileup_title"><spring:message code="fixa.datainput.title13"/><!--파일 업로드--></div>
				<div id="itmDataArea">
					<span class="text"><spring:message code="fixa.datainput.title3"/><!--여기에 드래그하여 데이터 파일을 첨부하세요--></span>
				</div>
				<div id="itmFileName">
					<span class="title" onclick="Core.Files.Find2();"><spring:message code="fixa.datainput.selectfile"/><!--선택파일--></span>
					<span class="fileName" id="fileName"></span>
				</div>
				<div id="itmButtonArea"></div>
			</div><!--// #arLogin -->
		</form>
	</div>
    <!-- 파일 업로드 끝 -->
           
	<div id="arInputdata2" style="display: none;" >
    <h6 id='collect_title'></h6>
          <!-- 디비 설정 시작 -->
            <div id='collect_type_db'>
            <div id="itmDataArea">
				<table width='100%' id="dbList" class="border-list pointer" style="margin-top:10px;">
					<colgroup>
						<col style="width:40px;">
						<col style="width:30%;">
						<col style="width:auto;">
						<col style="width:10%;">
						<col style="width:10%;">
					</colgroup>
					<thead>
						<tr>
							<td>code</td>
							<td>db</td>
							<td>url</td>
							<td>id</td>
							<td>pw</td>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
				<p style="margin-top:20px; margin-bottom:10px; font-size:14px; font-weight:500; color: #8e8e8e;">* <spring:message code="fixa.datainput.title11"/><!--데이터베이스 접속 정보--></p>
					<form name='dbinfo' id='dbinfo'>
						<table width='100%' class="border-list type-01">
							<colgroup>
								<col style="width:15%;">
								<col style="width:auto%;">
								<col style="width:20%;">
								<col style="width:20%;">
							</colgroup>
							<tbody>
								<tr>
									<th style="font-weight:500;">db</td>
									<th style="font-weight:500;">url</td>
									<th style="font-weight:500;">id</td>
									<th style="font-weight:500;">pw</td>
								</tr>
								<tr>
									<td>
										<select name='driver' style="width:100%;">
											<option value='com.mysql.jdbc.Driver'>mysql</option>
											<option value='oracle.jdbc.driver.OracleDriver'>oracle</option>
										</select>
									</td>
									<td><!-- <input type='text' name='url' value='jdbc:mysql://nshare.co.kr:3306/mess?serverTimezone=Asia/Seoul' style="width:100%;"> --></td>
									<td><input type='text' name='id' value='root' style="width:100%"></td>
									<td><input type='password' name='pw' value=''  style="width:100%"></td>
								</tr>
							</tbody>
						</table>
					</form>
					<div style="margin-top:10px; text-align: center;">
						<a class="button_s" onClick="f2collect.insertDbConnectionInfo();" ><spring:message code="fixa.datainput.submit"/><!--등	록--></a>
					</div>
			</div>
			</div>	
            <!-- 디비 설정 끝 -->
      
           <!-- 샘플데이터 시작 -->
           <div id='collect_type_sample'>
           <div id="itmDataArea">
           </div>
           </div>
           <!-- 샘플데이터 끝 -->

	</div><!--// #arInputdata2 -->
	
	<div id="OpenApiData" style="display: none;">
		<div id="itmDataArea">
			<h6 id="collect_title" style="font-size: 18px; font-weight:bold;"><spring:message code="fixa.api.title001"/><!--OpenAPI를 통한 데이터 수집--></h6>
				<p style="margin-top:20px; margin-bottom:10px; font-size:14px; font-weight:500; color: #8e8e8e;">* Open APi info</p>
						<table width='100%' class="border-list type-01" STYLE="margin-bottom: 10PX">
							<colgroup>
								<col style="width:15%;">
								<col style="width:auto%;">
							</colgroup>
							<tbody>
								<tr>
									<td style="font-weight:500;">OpenAPI:</td>
									<td style="font-weight:500;">
											<select name='openApi' id="openApi" style="width:100%;" onchange="showParm(this.value);">
											<option value='1'><spring:message code="fixa.api.title002"/><!--해외 직구 유해식품--></option>
											<option value='2'><spring:message code="fixa.api.title003"/><!--수입식품--></option>
											<option value='3'><spring:message code="fixa.api.title004"/><!--식품영양성분DB(NEW)--></option>
										</select>
									</td>
								</tr>
							</tbody>
						</table>
						<div id="innerDOP" style="display:none;">
						<form name='innerDOPfrm' id='innerDOPfrm'>
							<input type="hidden" name="api_name" id="api_name" value="">
							<input type='hidden' name='openapiType' value='1'>
							<table width='100%' class="border-list type-01">
							<colgroup>
								<col style="width:50%;">
								<col style="width:auto%;">
							</colgroup>
							<tbody>
								<tr> 
									<td style="font-weight:500;">keyId
<!-- 										<input type='hidden' name='r_key' value='keyId'/> -->
									</td>
									<td style="font-weight:500;">
										<input type="text"  name="keyId" value='963839e65a414c8995d0'>
									</td>
								</tr>
								<tr>
									<td style="font-weight:500;">serviceId
<!-- 										<input type='hidden' name='r_serviceId[]' value='serviceId'/> -->
									</td>
									<td style="font-weight:500;">
										<input type="text"  name="serviceId" value='I2715'>
									</td>
								</tr>
								<tr>
									<td style="font-weight:500;">dataType
<!-- 										<input type='hidden' name='r_dataType[]' value='dataType'/> -->
									</td>
									<td style="font-weight:500;">
										<input type="text"  name="dataType" readonly="readonly" value='json'>
									</td>
								</tr>
							</tbody>
						</table>
						</form>
						</div>
						<div id="innerIF" style="display:none;">
						<form name='innerIFfrm' id='innerIFfrm'>
							<input type="hidden" name="api_name"  id="api_name" value="">
							<input type='hidden' name='openapiType' value='2'>
							<table width='100%' class="border-list type-01">
							<colgroup>
								<col style="width:50%;">
								<col style="width:auto%;">
							</colgroup>
							<tbody>
								<tr>
									<td style="font-weight:500;">receipt_no
<!-- 										<input type='hidden' name='r_receipt_no[]' value='receipt_no'/> -->
									</td>
									<td style="font-weight:500;">
										<input type="text"  name="receipt_no" value=''>$$$test$$$
									</td>
								</tr>
								<tr>
									<td style="font-weight:500;">cp_apply_no
<!-- 										<input type='hidden' name='r_cp_apply_no[]' value='cp_apply_no'/> -->
									</td>
									<td style="font-weight:500;">
										<input type="text"  name="cp_apply_no" value=''>
									</td>
								</tr>
								<tr>
									<td style="font-weight:500;">bl_no
<!-- 										<input type='hidden' name='r_bl_no[]' value='bl_no'/> -->
									</td>
									<td style="font-weight:500;">
										<input type="text"  name="bl_no" value=''>
									</td>
								</tr>
								<tr>
									<td style="font-weight:500;">pageNo
<!-- 										<input type='hidden' name='r_pageNo[]' value='pageNo'/> -->
									</td>
									<td style="font-weight:500;">
										<input type="text"  name="pageNo" value=''>
									</td>
								</tr>
								<tr>
									<td style="font-weight:500;">numOfRows
<!-- 										<input type='hidden' name='r_numOfRows[]' value='numOfRows'/> -->
									</td>
									<td style="font-weight:500;">
										<input type="text"  name="numOfRows" value=''>
									</td>
								</tr>
							</tbody>
						</table>
						</form>
						</div>
						<div id="innerIF2" style="display:none;">
						<form name='innerIFfrm2' id='innerIFfrm2'>
							<input type="hidden" name="api_name"  id="api_name" value="">
							<input type='hidden' name='openapiType' value='3'>
							<table width='100%' class="border-list type-01">
							<colgroup>
								<col style="width:50%;">
								<col style="width:auto%;">
							</colgroup>
							<tbody>
								<tr> 
									<td style="font-weight:500;">keyId
<!-- 										<input type='hidden' name='r_key' value='keyId'/> -->
									</td>
									<td style="font-weight:500;">
										<input type="text"  name="keyId" value='sample'>
									</td>
								</tr>
								<tr>
									<td style="font-weight:500;">serviceId
<!-- 										<input type='hidden' name='r_serviceId[]' value='serviceId'/> -->
									</td>
									<td style="font-weight:500;">
										<input type="text"  name="serviceId" value='I0760'>
									</td>
								</tr>
								<tr>
									<td style="font-weight:500;">dataType
<!-- 										<input type='hidden' name='r_dataType[]' value='dataType'/> -->
									</td>
									<td style="font-weight:500;">
										<input type="text"  name="dataType" readonly="readonly" value='json'>
									</td>
								</tr>
							</tbody>
						</table>
						</form>
						</div>
					<div style="margin-top:10px; text-align:center;">
						<a class="button_s" onClick="collectOpenAPI();" ><spring:message code="fixa.datainput.collect"/><!--수	집--></a>
					</div>
			</div>
	</div> 
	
	<!-- 스케줄링 시작 시-> 첫 화면 리스트  -->
	<div id="collect_type_scheduling" style="display: none; ">
		<div id="schedulingArea">
		 <form id="schedule_data" name="schedule_data" action="/collect/scheduleList.fd" method="post">
			<input type='hidden' name='collect_flag'>
			<input type='hidden' name='schedule_data_sn'>
		 
			<h6 id="collect_title" style="font-size: 18px; text-align: center; margin-bottom: 20px; font-weight:bold;"><spring:message code="fixa.scheduling.title036"/><!--스케줄러 관리--></h6>
			<div id="schedulescroll" style="overflow-x:hidden; overflow-y:scroll;height: 260px" >
				<table id="schedulelist" border="1px" class="border-list">
					<colgroup>
						 <col width="*">
					     <col width="100px">
					     <col width="100px">
				     </colgroup>
					<thead>
						<tr child_uuid=''>
							<td><spring:message code="fixa.scheduling.title002"/><!--타이틀--></td> 
							<td><spring:message code="fixa.scheduling.title007"/><!--수집주기--></td>
							<td><spring:message code="fixa.scheduling.title030"/><!--동작--></td>  
						</tr>
					</thead>  
						<tbody >
						</tbody>
				</table>
			</div>
		</form>
			<div style="text-align: center; margin-top: 10px;">
				<a class="button_s" onClick="Core.scheduling()"><spring:message code="fixa.scheduling.title031"/><!--스케줄러추가--></a>
			</div>
		</div>
	</div>
<div class="bottom_raund"></div>
</div><!--// #wrap -->

<div class="foot_area">

<table>
	<tr>
		<td>
			<ul class="foot_btn_group">
				<li class="btn_file" item-type="menuItem"></li>
				<li class="btn_admin unlock" item-type="menuItem"></li>
				<li class="btn_windows unlock" item-type="menuItem"></li>
			</ul>
		</td>
		<td><div class="btn_save unlock" item-type="menuItem"></div></td>
		<td>
			<div class="search_area">
			<input type="text" readonly="readonly">
			<div class="search_btn"></div>
		</div>
		</td>
		<td>
			<ul class="play_area">
				<li class="btn_preview"></li>
				<li class="btn_play unlock"></li>
				<li class="btn_next"></li>
			</ul>
		</td>
		<td>
			<div class="progress_bar">
				<img id="progress_img" src="/fixadata-common/images/slider_loding.png" style="background-color: transparent;">
				<img id="progress_img2" src="/fixadata-common/images/slider_loding.gif" style="background-color: transparent;display: none;">
			</div>
			
		</td>
		<td>
			<ul class="import_area">
				<li class="btn_export unlock"></li>
				<li class="btn_import unlock"></li>
			</ul>
		</td>
		
	</tr>
</table>

</div>

<form name='uploadDbFrm' method="post">
	<input type='hidden' name='db_sn'>
	<input type='hidden' name='table'>
	<input type='hidden' name='limit'>
	<input type='hidden' name='field_key'>
	<input type='hidden' name='collect_flag'>
	<input type='hidden' name='ord'>
</form>
	
	
<form name='sampleFrm' method="post">
	<input type='hidden' name='base_data_sn'>
	<input type='hidden' name='data_name'>
	<input type='hidden' name='data'>
	<input type='hidden' name='header'>
	<input type='hidden' name='collect_flag'>
</form>

   <!-- 팝업뜰때 배경 -->
   <div id="mask"></div>

   <!--Popup Start -->
   <div id="layerbox" class="layerpop"  style="width: 700px; height: 350px;">
       <article class="layerpop_area">
	       <div class="title"><spring:message code="fixa.datainput.title4"/><!--등록데이터 데이터베이스 리스트--></div>
	       <a href="javascript:popupClose();" class="layerpop_close" id="layerbox_close"></a>
	       <div id="tableList" class="content">
	       </div>
       </article>
   </div>
   <!--Popup End -->
   
    <!-- modal 창 -->
	<div id="fieldLay" class="layerpop"  style="width: 700px; height: 350px;">
		<article class="layerpop_area">
			<div class="title"><spring:message code="fixa.datainput.title5"/><!--테이블 필드 리스트--></div>
	       	<a href="javascript:popupClose2();" class="layerpop_close" id="layerbox_close"></a>
	       	<div class="content">
		        <table width='100%' id="fieldList" class="border-list type-01 pointer">
		        	<thead>
						<tr>
							<td><spring:message code="fixa.datainput.title6"/><!--필드명--></td>
							<td><spring:message code="fixa.datainput.title7"/><!--타입--></td>
						</tr>
					</thead>
					<tbody>
						
					</tbody>
		        </table>
	        </div>
        </article>
	</div>
<style>

body {
    font-family: "맑은 고딕"
}
     #schedule_contextMenu {
      background: #e1efc7;
      border: 1px solid gray;
      padding: 2px;
      display: inline-block;
      min-width: 100px;
      -moz-box-shadow: 2px 2px 2px silver;
      -webkit-box-shadow: 2px 2px 2px silver;
      z-index: 99999;
    }

    #schedule_contextMenu li {
      padding: 4px 4px 4px 14px;
      list-style: none;
      cursor: pointer;
    }

    #schedule_contextMenu li:hover {
      background-color: white;
    }
    
     #schedule_contextMenu li:hover {
      background-color: white;
    }
    

/*-- POPUP common style S ======================================================================================================================== --*/
#mask {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
    background-color: #000000;
    display: none; }

.layerpop {
    display: none;
    z-index: 1000;
    border: 1px solid #ccc;
    background: #fff;
    cursor: move;
    border-radius: 10px;
    padding: 10px;
    }

.layerpop_area .title {
    padding: 10px 10px 10px 10px;
    border: 0px solid #aaaaaa;
    background: #01c2fa;
    color: #ffffff;
    font-size: 18px;
    font-weight: bold;
    line-height: 24px;
    border-radius: 5px;
    text-align: center;
    }

.layerpop_area .layerpop_close {
    width: 25px;
    height: 25px;
    display: block;
    position: absolute;
    top: 20px;
    right: 20px;
    background: transparent url('/fixadata-common/images/close_icon.png') no-repeat;
    }

.layerpop_area .layerpop_close:hover {
    background: transparent url('/fixadata-common/images/close_icon.png') no-repeat;
    cursor: pointer; }

.layerpop_area .content {
    width: 100%;
    height:306px;
    padding:10px;
    box-sizing:border-box;
    overflow:auto;
    color: #222;
    font-size: 14px; }
/*-- POPUP common style E --*/

</style>
<script type="text/javascript">
function wrapWindowByMask() {
    //화면의 높이와 너비를 구한다.
    var maskHeight = $(document).height(); 
    var maskWidth = $(window).width();

    //문서영역의 크기 
    console.log( "document size:"+ $(document).width() + "*" + $(document).height()); 
    //브라우저에서 문서가 보여지는 영역의 크기
    console.log( "window size:"+ $(window).width() + "*" + $(window).height());        

    //마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채운다.
    $('#mask').css({
        'width' : maskWidth,
        'height' : maskHeight
    });

    //애니메이션 효과
    //$('#mask').fadeIn(1000);      
    $('#mask').fadeTo("slow", 0.5);
}

function popupOpen() {
    $('.layerpop').css("position", "absolute");
    //영역 가운에데 레이어를 뛰우기 위해 위치 계산 
    $('.layerpop').css("top",(($(window).height() - $('.layerpop').outerHeight()) / 2) + $(window).scrollTop());
    $('.layerpop').css("left",(($(window).width() - $('.layerpop').outerWidth()) / 2) + $(window).scrollLeft());
    $('.layerpop').draggable();
    $('#layerbox').show();
}

function popupClose() {
    $('#layerbox').hide();
    $('#mask').hide();
}

function popupClose2() {
    $('#fieldLay').hide();
    $('#mask').hide();
}

function goDetail() {

    /*팝업 오픈전 별도의 작업이 있을경우 구현*/ 

    popupOpen(); //레이어 팝업창 오픈 
    wrapWindowByMask(); //화면 마스크 효과 
}


window.onload = function(){
	
	$("a[item-type='play']").removeClass('unlock').addClass('lock');
	$("a[item-type='reset']").removeClass('unlock').addClass('lock');
	$("a[item-type='download']").removeClass('unlock').addClass('lock');
	$("a[item-type='save']").removeClass('unlock').addClass('lock');
	
	setTimeout(function(){
		$("#wrContents > ul.top_btn_group > li.btn_help > ul > li:nth-child(2) > a").removeClass('unlock').addClass('lock');
	},100);
}
//#scheduletitle > tr:nth-child(1)

</script>
</div></div></body>
</html>
