var member = {};

/**
 * 로그인 체크
 */
member.login = function(frm)
{
	restRequest("/ajax/loginAjax.fd", "POST", $("#"+frm).serialize(), function(data){
		
		
		console.log($("#"+frm).serialize());
		
		if(data.Response == true)
		{
			window.location.href = "/collect/datainput.fd";
		}
		else
		{
			alert('로그인이 실패하였습니다. 다시 시도해주시기 발바니다.');
			return ;
		}
	});
}