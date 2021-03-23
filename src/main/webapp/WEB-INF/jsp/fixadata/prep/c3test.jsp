<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<jsp:include page="/fixadata-common/inc/lang.jsp" />
<c:import url="/common/page.fd?page=header2"/>

<script>
var data = new Object();

var obj = new Object();
data.url = "https://www.fda.gov/files/api/datatables/static/recalls-market-withdrawals.json?_=1590730531143";
data.method = "get";

var jsonData = JSON.stringify(data);

var ul =  $("<ul/>");
$.ajax({
	url: '/common/reqCollectRest.fd' 
    ,contentType: 'application/json'
    ,async: true
    ,type: 'POST'
    ,data: jsonData
    ,dataType: 'json'
	,success:function(res) { 

		var test = JSON.parse(res.list);
		obj = jQuery.parseJSON(res.list)
		console.log("obj",obj);
		if(null!=obj)
		{
			if(typeof obj=="object"  && isJsonArray(obj)==true)
			{
				
			}
		}
			
		//JSON.stringify(jsObj, null, "\t"); // stringify with tabs inserted at each level
		//JSON.stringify(jsObj, null, 4);    // stringify with 4 spaces at each level
	}
});


/**
 * json Array유무 체크
 */
function isJsonArray(obj)
{
	if(obj.length==undefined)
	{
		return false
	}
	else if(obj.length>=0){
		return true;
	}
}

function jsonSearch(obj)
{
	//array인경우
	if(isJsonArray(obj)==true){
		$.each(obj, function(k, item){ 
			
			key = Object.keys(item);
			
			for(i=0;i<key.length;i++)
			{
				console.log(key[i],"",item[key[i]]);
				
				console.log("\n\n");
			}
			
		});		
	}
	else
	{
		
	}
	
}

</script>
</body>
</html>