<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %> 
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>


<jsp:include page="/fixadata-common/inc/head.jsp" />
</head>
<body>
	<form name='frm' id='frm'>
	<table width='1000px' border="1">
		<tr>	
			<td width="200px">데이터베이스 선택</td>
			<td>
				<select name='driver'>
					<option value='com.mysql.jdbc.Driver'>mysql</option>
					<option value='oracle.jdbc.driver.OracleDriver'>oracle</option>
				</select>
			</td>
		</tr> 
		<tr>
			<td>url</td> 
			<td>
				<input type='text' name='url' value='jdbc:mysql://nshare.co.kr:3306/mess?serverTimezone=Asia/Seoul'>
			</td>
		</tr>
		<tr> 
			<td>아이디</td>
			<td>
				<input type='text' name='id' value='root' style="width:90%">
			</td>
		</tr>
		<tr>
			<td>pw</td>
			<td>
				<input type='password' name='pw' value=''  style="width:90%">
			</td>
		</tr>
		<tr>
			<td>sql</td>
			<td><textarea name='sql' id='sql' rows="10" cols="10" style="width:100%">select * from test</textarea></td>
		</tr>
	</table>
	</form>
	<a href="#" onclick="connectTest()"><spring:message code="fixa.dbForm.title001"/></a>
	<a href="#" onclick="queryTest()"><spring:message code="fixa.dbForm.title002"/> </a>
	<a href="#" onclick="connectDatabases()"><spring:message code="fixa.dbForm.title003"/></a>

	<script type="text/javascript">
	
		function connectTest()
		{
			var formData = $("#frm" ).serialize();
			$.ajax({
			    url: '/collect/dbConnectionCheck.fd' 
			    ,async: false
			    ,type: 'post'
			    ,dataType: 'json'
			    ,data:formData
			    ,success: function(data) {
			    	console.log(data);
			    	if(data.result=="success")
			    	{
			    		alert(<spring:message code="fixa.dbForm.title004"/>);
			    	}
			    	else
			    	{
			    		alert(<spring:message code="fixa.dbForm.title005"/>+data.result);
			    	}
			    }
			});
		}
		function queryTest()
		{
			var formData = $("#frm" ).serialize();
			$.ajax({
			    url: '/collect/dbConnectionList.fd' 
			    ,async: false
			    ,type: 'post'
			    ,dataType: 'json'
			    ,data:formData
			    ,success: function(data) {
			    	console.log(data);
			    	alert(JSON.stringify(data));

			    }
			});
		}

		function connectDatabases()
		{
			var formData = $("#frm" ).serialize();
			$.ajax({
			    url: '/collect/databasesList.fd' 
			    ,async: false
			    ,type: 'post'
			    ,dataType: 'json'
			    ,data:formData
			    ,success: function(data) {
			    	console.log(data);
			    	alert(JSON.stringify(data));
			    }
			});
		}
		
	</script>
</body>
</html>