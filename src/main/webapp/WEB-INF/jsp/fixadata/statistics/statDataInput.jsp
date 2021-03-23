<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<c:import url="/common/page.fd?page=head"/>

<link rel="stylesheet" href="/fixadata-common/plugin/slickgrid/slick.grid.css" type="text/css"/>
<link rel="stylesheet" href="/fixadata-common/plugin/slickgrid/slick-default-theme.css" type="text/css"/>
<!-- <link rel="stylesheet" href="/fixadata-common/plugin/slickgrid/examples.css" type="text/css"/> -->

<script>
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
</script>
  	
</head>
<body><div id="_body" class="_body"><div id="_inni" class="_inni">

<div id="wrap">
	<header id="wrHeader">
	<jsp:include page="/fixadata-common/inc/header.jsp" />
	</header><!--// #wrHeader -->
	
	<div id="wrContents">
	<table width='100%' border='1'>
		<tr>
			<td>
				<select id='project'>
					<option value=''>선택해주세요</option>
				</select>
				<select id='project_data'>
				</select>	
				<button id='dataload' onclick='dataLoad();'>선택</button>
			</td>
		</tr>
		<tr>
			<td align="left"><div id="statGrid" style="width:600px;height:500px;"></div></td>
		</tr>
		<tr>
			R statistics result
		</tr>
	</table>		

	<script>
	var grid;
	var columns = [];
    var data = [];
      
		window.onload = function(){
			var data = f2collect.projectList2(function(data){
				console.log(data);
				console.log(data.result);
				
				for(i=0;i<data.result.length;i++)
				{
					$("#project").append("<option value='"+data.result[i].project_sn+"'>"+data.result[i].project_NAME+"</option>");
					
				}
			});
		}
		
		function dataLoad(){
			if($("#project").val()=="")
			{
				alert('<spring:message code="fixa.stat.title001"/>');
				return ;
			}
			
			if($("#project_data").val()=="" ||$("#project_data").val()==null)
			{
				alert('<spring:message code="fixa.stat.title002"/>');
				return ;
			}
			
			
			var param = {
					  "project_sn"     : $("#project").val()
					, "project_data_sn": $("#project_data").val()
				}; 
				
				console.log(param);
				restRequest('/prep/loadData.fd', 'GET', param, function(data){
					console.log(data);
					
					if(data.projectName!="")
					{
						$("#projectNm").val(data.projectName);
						$("#projectNm").attr("readonly",true);
					}
					
					slickGrid.setColumn(grid, data.result.header);
					slickGrid.setData(grid, data.result.data);
				});
		}
		
		$(function(){
			
			grid = slickGrid.init(options, grid, "statGrid", columns, data)
			
			$("#project").change(function(){
				f2collect.projectDataList2(this.value, function(data){
					
					console.log();
					$('#project_data').find('option').remove().end();
					for(i=0;i<data.result.length;i++)
					{
						name = "VERSION=>"+data.result[i].data_VERSION+"("+data.result[i].insert_DT+")";
						$("#project_data").append("<option value='"+data.result[i].project_data_sn+"'>"+name+"</option>");
					}	
				});
			});
		});
		
	</script>

	</div><!--// #wrContents -->
</div><!--// #wrap -->

</div></div></body>
<script>
</script>
</html>