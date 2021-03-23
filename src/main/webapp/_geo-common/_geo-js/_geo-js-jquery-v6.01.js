


inni=$inni=$i=window.$;(function($i){
	inni.inni	=  {
		_Version	: '0.0.1'
	,	_Author		: ''
	,	_Email		: ''
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
	,	_Default:{_AlertType:false,_ConfirmType:false,_RootImage:'/_geo-common/_geo-images',_ErrorImg:{_Photo:'',_Error400:'',_Error404:'',_Error500:''},_ErrorUri:{_Error400:'',_Error404:'',_Error500:''},_Message:{_ErrorAjax:'비동기 통신에 일시적인 문제가 발생 하였습니다.\n새로고침 후 다시 이용해 주세요.\n문제가 지속될 경우 관리자에게 문의하세요.',_ClipboardCopy_1	: '복사 되었습니다.',_ClipboardCopy_2:'Ctrl+C를 눌러 클립보드로 복사하세요.'}}
	};
	inni.Log = function(m1, m2) {
	    try {
	        if (inni.ChkBlank(m2)) {
	            window.console.log(m1);
	        } else {
	            window.console.log(m1, m2);
	        };
	    } catch (e) {};
	};
	inni.Right = function(str, leng) {
	    return str.substring(str.length - leng, str.length);
	};
	inni.Modal = {};
	inni.Modal.Wrap = function() {
	    return inni('<div/>', {
	        id: '_wrModal',
	        style: 'z-index:99985;position:fixed;left:0;top:0;width:100%;height:100%;text-align:center;background-color:rgba(0 ,0 ,0 ,0.7);overflow:hidden;'
	    });
	};
	inni.Modal.Container = function() {
	    return inni('<div/>', {
	        class: '_modalContainer',
	        style: 'z-index:99986;display:block;position:relative;width:40%;height:100%;margin:0 auto;text-align:left;'
	    });
	};
	inni.Modal.Messagebox = function() {
	    return inni('<div/>', {
	        class: '_messageArea',
	        style: 'z-index:99987;display:block;position:absolute;left:50%;top:30px;width:100%;margin-left:-50%;padding:1em 1em 0 1em;border:1px solid #000000;background-color:#4b4b4b;'
	    });
	};
	inni.Modal.Message = function(m) {
	    return inni('<div/>', {
	        class: '_message',
	        html: m,
	        style: 'max-height:300px;padding:1em;color:#ffffff;line-height:1.6em;background-color:#323232;overflow-y:scroll;'
	    });
	};
	inni.Modal.Buttonbox = function() {
	    return inni('<div/>', {
	        class: '_button',
	        style: 'padding:1.5em;text-align:center;'
	    });
	};
	inni.Modal.Close = function() {
	    inni('#_wrModal').empty().remove();
	};
	inni.MessageCreate = function(m, t) {
	    inni.Modal.Close();
	    var eb2 = ('confirm' == t) ? inni('<a/>', {
	        id: '_confirm-cancel',
	        class: '_btn',
	        href: '#',
	        text: '취소',
	        onclick: 'return false'
	    }).css('margin', '0 10px') : '';
	    var eb1 = inni('<a/>', {
	        id: '_confirm-ok',
	        class: '_btn',
	        href: '#',
	        text: '확인',
	        onclick: 'return false'
	    }).css('margin', '0 10px');
	    var eb = inni.Modal.Buttonbox().append(eb1).append(eb2);
	    var em = inni.Modal.Message(m);
	    var ea = inni.Modal.Messagebox().append(em).append(eb);
	    var ec = inni.Modal.Container().append(ea);
	    var ew = inni.Modal.Wrap().append(ec);
	    inni('#_inni').append(ew);
	    inni('#_confirm-cancel').focus();
	};
	inni.Alert = function(m, callback) {
	    inni.MessageCreate(m, 'alert');
	    $('#_confirm-ok').on('click', function() {
	        callback(true);
	        inni.Modal.Close();
	    });
	};
	inni.Confirm = function(m, callback) {
	    inni.MessageCreate(m, 'confirm');
	    $('#_confirm-ok').on('click', function() {
	        callback(true);
	        inni.Modal.Close();
	    });
	    $('#_confirm-cancel').on('click', function() {
	        callback(false);
	        inni.Modal.Close();
	    });
	};
	inni.JsonSearch = function(j, kc) {
	    var r = '';
	    inni.each(j, function(k, v) {
	        if (kc == k) {
	            r = v;
	        };
	    });
	    return r;
	};
	inni.Ajax = function(options) {
	    var options = inni.extend({
	        async: true,
	        url: '',
	        data: '',
	        type: 'post',
	        dataType: 'json',
	        success: null,
	        error: function(response, status, error) {
	            inni.Log('Error Message: ', response.responseText);
	            inni.Alert(inni.inni._Default._Message._ErrorAjax, function() {});
	        }
	    }, options);
	    inni.ajax(options);
	};
	inni.StrBlankDel = function(s) {
	    return (inni.ChkBlank(s)) ? '' : s.replace(/ /g, '');
	};
	inni.ChkBlank = function(s) {
	    return (s === null || s === undefined || s == '') ? true : false;
	};
	inni.ChkBlankNot = function(s) {
	    return (s !== null && s !== undefined && s != '') ? true : false;
	};
	inni.Ext = function(f) {
	    return f.split('.').pop().toLowerCase();
	};
	inni.ExtLimit = function(d) {
	    var e = inni.Ext(d.name);
	    return (e.length > 0 && inni.inArray(e, d.extLimit) > -1);
	};
	inni.fn.SerializeObject = function() {
	    var o = null;
	    try {
	        if (this[0].tagName && this[0].tagName.toUpperCase() == "FORM") {
	            var a = this.serializeArray();
	            if (a) {
	                o = {};
	                inni.each(a, function() {
	                    o[this.name] = this.value;
	                });
	            };
	        };
	    } catch (e) {
	        inni.Alert(e.message, function() {});
	    } finally {};
	    return o;
	};
	inni.fn.SetForm = function() {
	    var ei = inni(this).find('input');
	    for (fx = 0; fx < ei.length; ++fx) {
	        var et = ei.eq(fx);
	        var ev = et.val();
	        if (!inni.ChkBlank(ev)) {
	            et.parent().addClass('focus');
	        };
	    };
	    inni(this).find('input').on('keyup', function() {
	    	
	        var et = inni(this);
	        var dp = (et.attr('data-format')).toLowerCase();
	        if (dp == 'none') {
	        	
	            return;
	        };
	        var v = '';
	        if ('phone' == dp) {
	            v = (et.val()).replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3');
	        } else if ('number' == dp) {
	            v = (et.val()).replace(/[^0-9]/, '');
	        } else if ('id' == dp) {
	            v = (et.val()).replace(/[^a-z0-9]/, '');
	        } else if ('pw' == dp) {
	            v = (et.val()).replace(/[^a-z0-9!@$_]/, '');
	        } else if ('projectname' == dp || 'importname' == dp ) {
	            v = (et.val()).replace(/[^ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\*\s]+$/, '');
	        };
	        et.val(v);
	    });
	    inni(this).find('._form-input>input').on('focus', function() {
	        var et = inni(this).parent();
	        if (!et.is('.focus')) {
	            et.addClass('focus');
	        };
	    }).on('blur', function() {
	        var ee = inni(this);
	        var et = ee.parent();
	        var eti = et.find('input');
	        var ev = (eti.val() + '').replace(/ /g, '');
	        if ('' == ev) {
	            eti.val('').parent().removeClass('focus');
	        };
	    });
	};
})(inni);



