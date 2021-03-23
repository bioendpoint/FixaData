<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!-- header  -->
<c:import url="/common/page.fd?page=header"/>
<!--// header  -->
	
<script src="/fixadata-common/plugin/jquery_multi_select/jquery.multi-select.min.js"></script>
<link rel="stylesheet" href="/fixadata-common/plugin/jquery_multi_select/example-styles.css" type="text/css"/>

<script type="text/javascript">

// sidebar 펼침
$("#accordionSidebar").show();

var result;
$(function () {
	var columns = [];
    var data = [];
    grid = slickGrid.init(options, grid, "workGrid", columns, data)

    workflow.loadData('${searchVO.project_sn}','${searchVO.project_data_sn}');
    $('#field_select').multiSelect();
    
});

</script>

	<input type='hidden' name='project_sn' value='${searchVO.project_sn }'>
	<input type='hidden' name='project_data_sn' value='${searchVO.project_data_sn }'>
	
<div class="container-fluid">
	<h1 class="h4 mb-1 text-gray-800">워크플오우(이상데이터 추출)</h1>
	<div class="row">
		<div class="col-2" style="">
	    	<div class="card shadow mb-4">
					<div class="card-header py-3 float-left" >
						<table width='100%'>
							<tr>	
								<td>
									룰셋 리스트 개발 계획
								</td>
								<td width="50px">
									<a href='#' onClick="link('ruleset')"><span data-toggle="tooltip" data-placement="top" title="룰셋 설정">+</span></a>
								</td>
							</tr>
						</table>
								
					</div>
					<div class="card-body">
						<div class="table-responsive">
							룰셋 리스트 출력 예정
						</div>
					</div>  
			</div>
	    	
	    </div>
	    <div class="col-10">
			<!-- workflow start -->
				<div class="card shadow mb-4">
					<div class="card-header py-3 float-left" >
						<table width='100%'>
							<tr>
								<td>
									<label>결과 저장 유무</label>
									<input type='checkbox' name='dbsave' id='dbsave' value='1'>
									
									<!-- run button start -->
									<a href="#" class="btn btn-primary btn-icon-split" onClick="workflow.run();">
							            <span class="icon text-white-50">
							              <i class="fas fa-play"></i>
							            </span>
							            <span class="text">Run</span>
							        </a>
							        <!-- run button end -->
								
									<!-- rule manager button start -->
									<a href="#" class="btn btn-primary btn-icon-split" onClick="alert('를셋 관리')">
							            <span class="icon text-white-50">
							              <i class="fas fa-check-circle"></i>
							            </span>
							            <span class="text">rule manage</span>
							        </a>
							        <!-- run button end -->
								
									<!-- data check button start -->
									<a href="#" class="btn btn-primary btn-icon-split" onClick="datacheck()">
							            <span class="icon text-white-50">
							              <i class="fas fa-check"></i>
							            </span>
							            <span class="text">Data check</span>
							        </a>
							        <!-- data check button end -->

									<select id="field_select" name="field_select"  multiple></select>
								    <button onClick="workflow.getSelectField('field_select')">필드확인</button>
								</td>
							</tr>
							
						</table>
			
					</div>
					
					<div class="card-body">
						<div class="table-responsive">
							<table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
								<tr>	
									<td><div id="dropZone" style='width:100%;height:300px;border-width:2px; border-color:gray; border-style:dashed'>
											<span>workflow stage</span>
										</div>
									</td>
								</tr>
								<tr>
									<td align="left">

												<textarea name='workflow_json' style='width:100%;height:200px'>
												{
												    "dbsave":0
												    ,"project_sn":79
												    , "project_data_sn":67
												    , "ruleSet":[
												        {
												        	"rule_sn": 4
												        	, "rule_name":"test1"
												        	, "rule_string":"^[a-zA-Z]*$"
												        	, "field":["번호","개방서비스명","개방서비스ID","개방자치단체코드","관리번호","인허가일자","인허가취소일자","영업상태구분코드","영업상태명"]
												        }
												       
												    ]
												}</textarea>
												<!-- rule정재후 결과 -->
												<div id='result'>
													<ul class="nav nav-tabs" id='result_tab' >
													  <li class="nav-item">
													    <a class="nav-link active" data-toggle="tab" href="#qwe">rule set1 </a>
													  </li>
													  <li class="nav-item">
													    <a class="nav-link" data-toggle="tab" href="#asd">rule set2</a>
													  </li>
													  <li class="nav-item">
													    <a class="nav-link" data-toggle="tab" href="#zxc">rule set3</a>
													  </li>
													</ul>
													
													<div class="tab-content" id='result_tab_content'>
														  <div class="tab-pane fade show active" id="qwe">
														    	<table width='100%' border='1'>
														    		<tr>
														    			<td width='50%'>clean 데이터</td>
														    			<td width='50%'>rule 정제데이터</td>
														    		</tr>
														    	</table>  
														  </div>
														  <div class="tab-pane fade" id="asd">
														    	<table width='100%' border='1'>
														    		<tr>
														    			<td width='50%'>clean 데이터</td>
														    			<td width='50%'>rule 정제데이터</td>
														    		</tr>
														    	</table>
														  </div>
														  <div class="tab-pane fade" id="zxc">
														   		 <table width='100%' border='1'>
														    		<tr>
														    			<td width='50%'>clean 데이터</td>
														    			<td width='50%'>rule 정제데이터</td>
														    		</tr>
														    	</table>
														  </div>
													</div>
											</div>	
									</td>
								</tr>
							</table>
						</div>
					</div>
				</div>
			
			<!-- workflow end -->
	    </div>
	</div>
	
	
	 <!-- modal 창 -->
	<div class="modal" id="data_check_modal" tabindex="-1" role="dialog" >
	  <div class="modal-dialog modal-lg	modal-dialog-scrollable" role="document"  >
	    <div class="modal-content">
	      <div class="modal-header">
	        <h5 class="modal-title" id='modal_title'>데이터 체크</h5>
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	          <span aria-hidden="true">&times;</span>
	        </button>
	      </div>
	      <div class="modal-body" style="height:300px">
	        	<p>
   					<div id="workGrid" style="width:750px;height:220px;overflow: overlay"></div>	        	
	        	</p>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
	      </div>
	    </div>
	  </div>
	</div>
</div>	
		
    
   <script>
   	function datacheck()
   	{
   		$('#data_check_modal').modal('show');
   	}
   	
   </script>

<!-- footer -->
<c:import url="/common/page.fd?page=footer"/>
<!--// footer -->