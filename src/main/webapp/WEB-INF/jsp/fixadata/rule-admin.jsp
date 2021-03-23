<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<!-- header  -->
<c:import url="/common/page.fd?page=popHeader"/>
<!--// header  -->

<script type="text/javascript">

$(document).ready(function() {
    //loadData();
});

/**
 * 데이터 로드
 */
function loadData(){
	
	var param = {
			rule_sn : 1,
	}; 
	
	console.log(param);
	restRequest('/ajax/ruleList.fd', 'POST', param, function(data){
		console.log(data);
		var tbody = $("#dataTable tbody").empty();
		var html = "";
		
		for(var i = 0 ; i < data.list.length ; i++){
			
			html +=  "<tr>";
			
			if(data.list[i].rule_gb == 01){
				html +=  "<td><spring:message code="fixa.rule.title001"/></td>";
			}else{
				html +=  "<td><spring:message code="fixa.rule.title002"/></td>";
			}
			
			html +=  "<td><input type='text' id='rule_name' class='form-control'  value='"+data.list[i].rule_name+"'></td>";
			html +=  "<td><input type='text' id='rule_name' class='form-control'  value='"+data.list[i].rule_cont+"'></td>";
			html +=  "<td><input type='text' id='rule_name' class='form-control'  value='"+data.list[i].rule_dc+"'></td>";
			if(data.list[i].rule_base_data_gb == 02){
				html += "<td>";
				html += "<a href='#' onclick='updateData("+data.list[i].rule_sn+",2,"+i+")' class='btn btn-warning'>수정</a>";
				html +=	"<a href='#' onclick='deleteData("+data.list[i].rule_sn+",3,"+i+")' class='btn btn-danger'>삭제</a>";
			    html += "</td>";
			}else{
			}
			html +=  "</tr>";
		}
		tbody.append(html);
		
	});
}

/**
 * 데이터 등록
 */
function insertData(){
	
	var data = jQuery("#formRule").serialize();
	 restRequest('/ajax/save.fd', 'POST', data, function(data){
		 location.href = "/fixadata/ruleadmin.fd";
	});	
}
/**
 * 데이터 업데이트
 */
 function updateData(rule_sn ,state , count) {
	
		 var data = {
				rule_sn   : rule_sn ,
				rule_name : $("#frmDetail_"+count+" #rule_name").val() ,
				rule_cont : $("#frmDetail_"+count+" #rule_cont").val() ,
				rule_dc   : $("#frmDetail_"+count+" #rule_dc").val() ,
				state     : state
		} 
		 if(confirm($("#frmDetail_"+count+" #rule_name").val() + "<spring:message code="fixa.rule.title003"/>")){
	
			   restRequest('/ajax/save.fd', 'POST', data, function(data){
				
				 location.href = "/fixadata/ruleadmin.fd";
				
			});    
		}
	
}
 
 /**
  * 데이터 삭제
  */
  function deleteData(rule_sn ,state , count) {
 	
 		 var data = {
 				rule_sn   : rule_sn ,
 				state     : state
 		} 
 		if(confirm($("#frmDetail_"+count+" #rule_name").val() + "<spring:message code="fixa.rule.title004"/>"))
			{
				restRequest('/ajax/save.fd', 'POST', data, function(data){
 			 	location.href = "/fixadata/ruleadmin.fd";
	 		});  
		}
 }

</script>


<!-- Content Wrapper -->
<div id="content-wrapper" class="d-flex flex-column">
	<div class="content">
		<!-- DataTales Example -->
		<div class="container-fluid">
			<div id="card shadow mb-4">
				 <div class="card-header py-3">
	              <h6 class="m-0 font-weight-bold text-primary">RULE SET</h6>
	            </div>
				 <div class="card-body">
		             <div class="table-responsive">
						<form id="formRule" name="formRule" action="#" method="post">
							<input name=state id="state" type="hidden" value="1">
							<table width='70%' style="margin-bottom: 10px;">
								<tr>
									<td>
										<select name="rule_gb" id="form_ruleGb">
											<option value="01">검출 룰</options>
											<option value="02">필터</options>
										</select>
									</td>
									<td>
										명칭 <input name="rule_name" id="form_ruleNm" type="text" value="">
										
									</td>
									<td>
										조건식 <input name="rule_cont" id="form_ruleCont" type="text" value="" >
									</td>
									<td>
										설명  <input name="rule_dc" id="form_ruleDc" type="text" value="" >
									</td>
									<td>
										<a href="#" onclick="insertData()" class="btn btn-primary"><spring:message code="fixa.rule.title005"/></a>
									</td>
								</tr>
							</table>
						</form>
						<table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
							<colgroup>
								<col width="8%">
								<col width="20%">
								<col width="20%">
								<col width="">
								<col width="10%">
							</colgroup>
							<thead>
							<tr>
								<th scope="col"><spring:message code="fixa.rule.title006"/></th>
								<th scope="col"><spring:message code="fixa.rule.title007"/></th>
								<th scope="col"><spring:message code="fixa.rule.title008"/></th>
								<th scope="col"><spring:message code="fixa.rule.title009"/></th>
								<th scope="col"><spring:message code="fixa.rule.title010"/></th>
							</tr>
							</thead>
							<tbody>
								<c:forEach var="result" items="${list}" varStatus="status" >
									<tr id ="frmDetail_${status.count}">
										<td>
											<c:if test="${result.rule_gb eq 01}">
												<input type="text" class="form-control"  value="<spring:message code="fixa.rule.title011"/>"  readonly="readonly" />
											</c:if>
											<c:if test="${result.rule_gb ne 01}">
												<input type="text" class="form-control"  value="<spring:message code="fixa.rule.title002"/>" readonly="readonly" />
											</c:if>
										</td>
										<td>
											<input type="text" id="rule_name" class="form-control"  value="<c:out value="${result.rule_name}" />">
										</td>
										<td>
											<input type="text" id="rule_cont" class="form-control"  value="<c:out value="${result.rule_cont}" />">
										</td>
										<td>
											<input type="text" id="rule_dc" class="form-control"  value="<c:out value="${result.rule_dc}" />">
										</td>
										<td>
											<!--  rule_base_data_gb 02면 수정 , 삭제 가능  -->
											<c:if test="${result.rule_base_data_gb eq 02}">
												<a href="#" onclick="updateData(${result.rule_sn},2,${status.count})" class="btn btn-warning"><spring:message code="fixa.rule.title012"/></a>
												<a href="#" onclick="deleteData(${result.rule_sn},3,${status.count})" class="btn btn-danger"><spring:message code="fixa.rule.title013"/></a>
											</c:if>
										</td>
									</tr>
								</c:forEach>
							</tbody>
						</table>
					</div>
				</div>
			</div><!--// #arRuleAdmin -->
		</div>
	</div><!--// #container-fluid -->
</div>

<c:import url="/common/page.fd?page=popFooter"/>
