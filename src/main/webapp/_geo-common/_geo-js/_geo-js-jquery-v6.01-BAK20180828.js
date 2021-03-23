

inni=$inni=$i=window.$;(function($i){

	inni.inni	=  {
		_Version	: '0.0.1'
	,	_Author		: ''
	,	_Email		: '/'
	,	_Nicname	: ''
	,	_Copyright	: ''
	,	_License	: ''
	,	_Service	: {
			_Name					: 'JavaScript Library (JQuery for geo)'
		,	_Description			: 'jQuery를 이용한 자주사용하는 기본 자바스크립트 정의'
		}
	,	_Date		: {
			_Create					: '2019. 08. 25.'
		,	_Update					: '2019. 08. 25.'
		}
	,	_Check		: {
			_Session				: ''
		,	_Value					: ''
		}
	,	_Default		: {
			_AlertType				: false
		,	_ConfirmType			: false
		,	_RootImage				: '/_geo-common/_geo-images'
		,	_ErrorImg				: {
				_Photo					: ''
			,	_Error400				: ''
			,	_Error404				: ''
			,	_Error500				: ''
			}
		,	_ErrorUri				: {
				_Error400				: ''
			,	_Error404				: ''
			,	_Error500				: ''
			}
		,	_Message	: {
				_ErrorAjax			: '비동기 통신에 일시적인 문제가 발생 하였습니다.\n새로고침 후 다시 이용해 주세요.\n문제가 지속될 경우 관리자에게 문의하세요.'
			,	_ClipboardCopy_1	: '복사 되었습니다.'
			,	_ClipboardCopy_2	: 'Ctrl+C를 눌러 클립보드로 복사하세요.'
			}
		}
	};

	inni.Log=function(m){try{window.console.log(m);}catch(e){};};
	inni.Param=function(o){var result=new RegExp('[\?&]'+o+'=([^&#]*)').exec(window.location.search);return ((result==null)?'':result[1]||0);};
	inni.Alert=function(m){if(inni.inni._Default._AlertType){alert(m);}else{inni.Modal({type:'alert',contents:m});};return false;};

	inni.Confirm = function(m ,callback) {
		$('#_wrModal').empty().remove();

		var op={type:'confirm',elParent:'#_inni',width:'40%',contents:'',title:'',close:{right:'10px',top:'10px'}};
		var sa='z-index:99985;position:fixed;left:0;top:0;width:100%;height:100%;text-align:center;background-color:rgba(0 ,0 ,0 ,0.7);overflow:hidden;';
		var sc='z-index:99986;display:block;position:relative;width:'+op.width+';height:100%;margin:0 auto;text-align:left;';
		var so='z-index:99987;display:block;position:absolute;left:50%;top:30px;width:100%;margin-left:-50%;padding:1em 1em 0 1em;border:1px solid #000000;background-color:#4b4b4b;';
		var sm='max-height:300px;padding:1em;color:#ffffff;line-height:1.6em;background-color:#323232;overflow-y:scroll;';
		var sb='padding:1.5em; text-align:center;';

		var ea=inni('<div/>',{id:'_wrModal',style:sa});
		var ec=inni('<div/>',{class:'_modalContainer',html:op.contents,style:sc});

		var eo= inni('<div/>',{class:'_confirm',style:so});
		var em=inni('<div/>',{class:'_message',style:sm}).html(m);
		var eb=inni('<div/>',{class:'_button',style:sb});
		var eb1=inni('<a/>',{id:'_confirm-ok',class:'_btn',href:'#',text:'확인',onclick:'return false'}).css('margin','0 10px');
		var eb2=inni('<a/>',{id:'_confirm-cancel',class:'_btn',href:'#',text:'취소',onclick:'return false'}).css('margin','0 10px');

		eb.append(eb1).append(eb2);
		eo.append(em).append(eb);
		ec.html(eo);
		ea.html(ec);

		inni(op.elParent).append(ea);

		inni('#_confirm-cancel').focus();

		ConfirmCallback(function(confirm){
			if(confirm==1){callback(true);}else{callback(false);};
		});

	};


	var ConfirmCallback = function(callback){
		$('#_confirm-ok').on('click',function(){callback(1);$('#_wrModal').empty().remove();});
		$('#_confirm-cancel').on('click',function(){callback(0);$('#_wrModal').empty().remove();});
	};

	inni.Modal	= function( o ) {
		$('#_wrModal').empty().remove();
		var op=inni.extend({type:'alert',elParent:'#_inni',width:'40%',contents:'',title:'',close:{right:'10px',top:'10px'}},o);
		var sm='z-index:99985;position:fixed;left:0;top:0;width:100%;height:100%;text-align:center;background-color:rgba(0 ,0 ,0 ,0.7);overflow:hidden;';
		var sc='z-index:99986;display:block;position:relative;width:'+op.width+';height:100%;margin:0 auto;text-align:left;';

		var em=inni('<div/>',{id:'_wrModal',style:sm});
		var ec=inni('<div/>',{class:'_modalContainer',html:op.contents,style:sc});

		var tp = (op.type).toLowerCase();
		if('alert'==tp){
			var objAlert=inni.ModalHtml.Alert(op.contents);
			ec.html(objAlert);
			em.html(ec);
			inni(op.elParent).append(em);
			inni('#_wrModal ._btn').focus();
		}else if('confirm'==tp){
		};
		return false;
	};

	inni.ModalHtml			= {};
	inni.ModalHtml.Alert	= function( message ) {
		var sa='z-index:99987; display:block; position:absolute; left:50%; top:30px; width:100%; margin-left:-50%; padding:1em 1em 0 1em; border:1px solid #000000; background-color:#4b4b4b;';
		var sm='max-height:300px; padding:1em; color:#ffffff; line-height:1.6em; background-color:#323232; overflow-y:scroll;';
		var sb='padding:1.5em; text-align:center;';
		var obj= inni('<div/>' ,{
			class	: '_alert'
		,	style	: sa
		});
		var objMessage		= inni('<div/>' ,{
			class	: '_message'
		,	style:sm
		}).html(message);
		var objButtonBox	= inni('<div/>' ,{
			class	: '_button',style:sb
		});
		var objButton		= inni('<a/>' ,{
			class	: '_btn'
		,	href	: '#'
		,	text	: '확인'
		,	onclick	: 'return false'
		}).on('click' ,function(){$('#_wrModal').empty().remove();});
		objButtonBox.html(objButton);

		return obj.append(objMessage).append(objButtonBox);
	};

	inni.JsonSearch = function( json ,keyCode ) {
		var response = '';
		inni.each( json ,function( key ,value ) {
			if ( keyCode == key ) {
				response = value;
			};
		} );
		return response;
	};

	inni.Ajax				= function( options ) {
		var options = inni.extend( {
			async		: false
		,	url			: ''
		,	data		: ''
		,	type		: 'post'
		,	dataType	: 'json'
		,	success		: null
		,	error		: function( response ,status ,error ) { inni.Log(response.responseText); inni.Alert(inni.inni._Default._Message._ErrorAjax); }
		,	complete	: null
		} ,options);inni.ajax( options );
	};

	inni.Clipboard			= function( data ) {
		var chk = ( window.clipboardData ) ? true : false;
		if ( chk ) {
			window.clipboardData.setData("Text" ,data);
			inni.Alert( inni.inni._Default._Message._ClipboardCopy_1 );
		} else {
			var temp = prompt( inni.inni._Default._Message._ClipboardCopy_2 ,data );
		};
	};

	inni.StrBlankDel		= function( str ) {
		return (inni.ChkBlank(str)) ? '' : str.replace(/ /g ,'');
	};

	inni.ChkBlank			= function( str ) {
		return ( str === null || str === undefined || str == '' ) ? true : false;
	};

	inni.ChkBlankNot		= function( str ) {
		return ( str !== null && str !== undefined && str != '' ) ? true : false;
	};


	inni.Ext				= function( fileName ) {
		return fileName.split('.').pop().toLowerCase();
	};

	inni.ExtLimit			= function( data ) {
		var ext = inni.Ext( data.name );
		return ( ext.length > 0 && inni.inArray( ext ,data.extLimit) > -1 );
	};

	inni.fn.SerializeObject	= function() {
		var obj = null;
		try {
			if ( this[0].tagName && this[0].tagName.toUpperCase() == "FORM" ) {
				var arr = this.serializeArray();
				if ( arr ) {
					obj = {};
					inni.each(arr ,function() {
						obj[this.name] = this.value;
					});
				};
			};
		} catch (e) {
			inni.Alert(e.message);
		} finally {};
		return obj;
	};

	inni.fn.SetForm			= function() {
		var elInput = inni(this).find('input');
		for ( fx=0; fx<elInput.length; ++fx ) {
			var elTarget	= elInput.eq(fx);
			var elInputVal	= elTarget.val();
			if ( !inni.ChkBlank(elInputVal) ) {
				elTarget.parent().addClass('focus');
			};
		};
		
		inni(this).find('input').on('keyup' ,function(){
			var elTarget	= inni(this);
			var dataFormat	= (elTarget.attr('data-format')).toLowerCase();
			var val			= '';
			if ( 'phone' == dataFormat ) {
//				val = (elTarget.val()).replace(/(^01[0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/ ,'$1-$2-$3');
				val = (elTarget.val()).replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/ ,'$1-$2-$3');
			} else if ( 'number' == dataFormat ) {
				val = (elTarget.val()).replace(/[^0-9]/ ,'');
			} else if ( 'id' == dataFormat ) {
				val = (elTarget.val()).replace(/[^a-z0-9]/ ,'');
			} else if ( 'pw' == dataFormat ) {
				val = (elTarget.val()).replace(/[^a-z0-9!@$_]/ ,'');
			} else if ( 'projectname' == dataFormat ) {
				val = (elTarget.val()).replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎ_]/ ,'');
			};
			elTarget.val(val);
		});

		inni(this).find('._form-input>input').on('focus' ,function(){
			var elTarget	= inni(this).parent();
			if ( !elTarget.is('.focus') ) {
				elTarget.addClass('focus');
			};
		}).on('blur' ,function(){
			var elEvent			= inni(this);
			var elTarget		= elEvent.parent();
			var elTargetInput	= elTarget.find('input');
			var elEventVal		= (elTargetInput.val() + '').replace(/ /g ,'');
			if ( '' == elEventVal ) {
				elTargetInput.val('').parent().removeClass('focus');
			};
		});
	};

})(inni);



