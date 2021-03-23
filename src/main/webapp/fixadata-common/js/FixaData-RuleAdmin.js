
Ruleadmin = {};

Ruleadmin.List = function() {
	var data		= Options.Element.RuleAdmin.Form.El().SerializeObject();
	var optionsAjax = {
		url		: Options.Uri.Ajax.Ruleadmin.List
	,	data	: data
	,	success	: function( d ,e ) { Ruleadmin.ListResponse( d ,e ); }
	};$i.Ajax(optionsAjax);
};

Ruleadmin.ListResponse = function( d ,e ) {
	let data	= d.list;
	
	console.log(data);
	
	let tbody	= $i('#itmRuleList tbody').empty();
	for( let fx=0; fx<data.length; ++fx ) {
		
		let btn1 = ('01'==data[fx].rule_base_data_gb) ? '' : $i('<a/>' ,{ class : '_btn _btnSmall' ,text : '수정' ,href : '#' ,'data-index' : data[fx].rule_sn }).on('click' ,function(e){ Ruleadmin.Update(data[fx]); });
		let btn2 = ('01'==data[fx].rule_base_data_gb) ? '' : $i('<a/>' ,{ class : '_btn _btnSmall' ,text : '삭제' ,href : '#' ,'data-index' : data[fx].rule_sn }).on('click' ,function(e){
			
			var optionsAjax = {
				url		: Options.Uri.Ajax.Ruleadmin.Save
			,	data	: { state : '3' ,rule_sn : $i(this).attr('data-index') }
			,	success	: function( d ,e ) { $i.Alert( '룰(Rule)이 삭제 되었습니다.' ,function(response){}); Ruleadmin.List(); }
			};$i.Ajax(optionsAjax);
		});
		let td1	= $i('<td/>' ,{ text : gubun(parseInt(data[fx].rule_gb)) });
		let td2	= $i('<td/>' ,{ text : data[fx].rule_name });
		let td3 = $i('<td/>' ,{ text : data[fx].rule_cont });
		let td4 = $i('<td/>' ,{ text : data[fx].rule_dc });
		let td5 = $i('<td/>' ,{ class : 'alignCenter' }).append(btn1).append(btn2);
		let tr	= $i('<tr/>' ,{ 'data-index' : data[fx].rule_sn }).append(td1).append(td2).append(td3).append(td4).append(td5);
		tbody.append(tr);
	};
	function gubun( idx ){
		let text = [];
		text[1]	= '검출 룰';
		text[2] = '필터';
		text[3] = 'R 설정';
		text[4] = 'D3 차트';
		text[5] = '시계열 차트';
		return text[idx];
	};
};

Ruleadmin.SaveCheck = function( d ) {
	let data		= d;
	let ruleNm		= data.rule_name;
	let ruleCont	= data.rule_cont;
	let ruleDc		= data.rule_dc;
	let result		= true;
	if ( $i.ChkBlank(ruleNm) || $i.ChkBlank(ruleCont) || $i.ChkBlank(ruleDc)  ) {
		$i.Alert( '명칭, 조건식, 설명의 항목이 모두 입력되어야 합니다.' ,function(response){});
		result = false;
	};
	return result;
};

Ruleadmin.Insert = function() {
	let data	= Options.Element.RuleAdmin.Form.El().SerializeObject();
	let check	= Ruleadmin.SaveCheck(data);
	if ( check ) {
		data['state'] = '1';
		let optionsAjax = {
			url		: Options.Uri.Ajax.Ruleadmin.Save
		,	data	: data
		,	success	: function( d ,e ) { Options.Element.RuleAdmin.Form.El()[0].reset(); $i('._form-input').removeClass('focus'); Ruleadmin.ListResponse( d ,e ); }
		};$i.Ajax(optionsAjax);
	};
};

Ruleadmin.Update = function( d ) {
	
	console.log("d",d);
	
	var modalStyle		= 'z-index:99985; position:fixed; left:0; top:0; width:100%; height:100%; text-align:center; background-color:rgba(0 ,0 ,0 ,0.7); overflow:hidden;';
	var objModal	= $i('<div/>' ,{ id : Options.Element.Global.Modal.Id ,style : modalStyle });
	
	var elContainer	= $i('<div/>' ,{
		id		: 'formUpdate'
	});
	var elTitle		= $i('<div/>' ,{
		class	: 'title'
	,	text	: '룰(Rule) 수정'
	});

	var itmInputBox1 = $i('<div/>' ,{ class : '_form-input'}).append($i('<label for="ruleNmUp">명칭</label><input id="ruleNmUp" name="rule_name" data-format="none" type="text" value=""/>'));
	var itmInputBox2 = $i('<div/>' ,{ class : '_form-input'}).append($i('<label for="ruleContUp">조건식</label><input id="ruleContUp" name="rule_cont" data-format="none" type="text" value=""/>'))
	var itmInputBox3 = $i('<div/>' ,{ class : '_form-input'}).append($i('<label for="ruleDcUp">설명</label><input id="ruleDcUp" name="rule_dc" data-format="none" type="text" value=""/>'))

	var elContent	= $i('<div/>' ,{
		class	: 'content'
	}).append(itmInputBox1).append(itmInputBox2).append(itmInputBox3);

	var elButtonOk	= $i('<a/>' ,{
		class	: 'button'
	,	text	: '저장'
	,	href	: '#'
	}).on('click' ,function() {
		let data	= $i(this).parent().parent().parent().SerializeObject();
		let check	= Ruleadmin.SaveCheck(data);
		if ( check ) {
			data['rule_sn'] = d.rule_sn;
			data['state'] = '2';
			let optionsAjax = {
				url		: Options.Uri.Ajax.Ruleadmin.Save
			,	data	: data
			,	success	: function( d ,e ) { Core.Modal.Close(); Ruleadmin.ListResponse( d ,e ); }
			};$i.Ajax(optionsAjax);
		};
		
		return false;
	} );

	var elButtonCancle	= $i('<a/>' ,{
		class	: 'button'
	,	text	: '취소'
	,	href	: '#'
	}).on('click' ,function() {
		Core.Modal.Close();
		return false;
	} );

	var elButtonBox	= $i('<div/>' ,{
		class	: 'itmButton'
	}).append(elButtonCancle).append(elButtonOk);

	elContainer.append(elTitle).append(elContent).append(elButtonBox);
	var elForm = $i('<form/>').html(elContainer);
	objModal.html(elForm);

	Options.Element.Global.Inni.El().append(objModal);
	$i('#formUpdate').SetForm();
	$i('#formUpdate ._form-input').addClass('focus');
	$i('#formUpdate input[name="rule_name"]').val(d.rule_name);
	$i('#formUpdate input[name="rule_cont"]').val(d.rule_cont);
	$i('#formUpdate input[name="rule_dc"]').val(d.rule_dc);
};



Ruleadmin.Start = function( e ) {
	Options.Menu.Level2();
	Core.Start( function( response ) {
		if ( response ) {
			Options.Element.RuleAdmin.Form.El().SetForm();
		};
	} );
	Ruleadmin.List();
};

$i(document).ready( function( e ) {
	Ruleadmin.Start( e );
} );