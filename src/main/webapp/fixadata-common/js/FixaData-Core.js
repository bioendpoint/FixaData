
(function($i){
var dd = "";
var project_data_sn = "";
var project_sn = "";
var beforeKey = "";
var eraserData;
var cleanData;
var flag ="";
var tabName ="";
var tabId = "";
var memoryGrid = new Array();
var importId = "";

Core = {};



/**
 * 파일 다운로드 기능
 */
Core.DownFile = function(fileName){
	window.open("/common/excelFileDown.fd?fileName="+fileName+"", "hiddenframe");
}	

Core.Close = function() {
	var browserName	= navigator.appName;
	var browserVer	= parseInt(navigator.appVersion);

	console.log(window.close);

	if( 'Microsoft Internet Explorer' == browserName ){
		var ie7 = ( document.all && !window.opera && window.XMLHttpRequest ) ? true : false;
		if (ie7) {
			window.open('' ,'_parent' ,'');
			window.close();
		} else {
			this.focus();
			self.opener = this;
			self.close();
		};
	} else {
		try{
			this.focus();
			self.opener = this;
			self.close();
		} catch(e) {};
		try{
			window.open('' ,'_self' ,'');
			window.close();
		} catch(e) {};
		try{
			window.opener = 'self';
			window.open('' ,'_parent' ,'');
			window.opener = this;
			window.close();
			self.close();
		} catch(e) {};
	};
};

Core.c3 = {};

/**
 * bar chart
 */
Core.c3.groupbarchart = function(bindto, xcategory, chartData, groupData)
{
	
	
	bindData = {
    	/** data* */
        
    	columns: chartData
        ,groups: 
        [
                groupData
        ]
		,type: 'bar'
    };
	
	console.log("bindData", bindData);
	
	
	var chart = c3.generate({
		bindto: bindto, 
	    data: bindData
		,axis: {
			    x: {
			        type: 'category',
			        categories: xcategory
			    }
		} 
	  
	});
	
	return chart;
}


Core.Tnb = {};

// 상단 메뉴 생성
Core.Tnb.Create = function( tnb ) {
	var elMenu		= $i('<ul/>' ,{ class : 'mainmenu' });
	var menuTree	= Options.Menu.Tnb;
	
	
	
	$i.each( menuTree ,function( key ,value ) {
		var elItem		= $i('<li/>'	,{ class : 'item' });
		var elLink		= $i('<a/>'		,{ href : value.Link ,text : value.Name ,'item-type' : 'menuItem' ,onclick : 'return false;' }).addClass(value.Lock);
		
		//버튼 기능 추가
		$(".btn_"+key.toLowerCase()).on("click",function(e){
			
			//unlock이 아닌경우만
			if($(this).hasClass("unlock")==false)
			{	
				if($(this).attr("class").indexOf("btn_lang")>=0)
				{
					$(this).children(".submenu").css("left",100).css("top",60).css("width",70).show();
				}
				else if($(this).attr("class").indexOf("btn_help")>=0)
				{
					$(this).children(".submenu").css("left",180).css("top",60).css("width",70).show();
				}
				else
				{
					$(this).children(".submenu").css("left",$(this).offset().left-17).show();
				}
			}
			
		});
		
		$(".btn_"+key.toLowerCase()).append(Core.Tnb.SubmenuCreate(value.Submenu,value.Name));
		
		if ( 'unlock'==value.Lock ) {
			elLink.on('click' ,function( e ) { Core.Tnb.On($i(this)); return false; });
		};

		
		
		
		
		var elSubmenu	= Core.Tnb.SubmenuCreate(value.Submenu);
		elItem.append(elLink).append(elSubmenu);
		elMenu.append(elItem);
	} );

	Options.Element.Global.Tnb.El().html(elMenu);
};

// 상단 메뉴 화면 별 사용가능 처리
Core.Tnb.On = function( elEvent ) {
	var elEventParent = elEvent.parent();
	if ( elEventParent.is('.on') ) {
		elEventParent.removeClass('on');
	} else {
		Core.Tnb.SubmenuClose();
		elEventParent.addClass('on');
	};
};

// 상단 메뉴 클릭 시 하위 메뉴 표출
Core.Tnb.SubmenuCreate = function( prMenu , bindName) {
	var elMenu	= $i('<ul/>' ,{ class : 'submenu' });
	
	//<li style="width:76px;height:50px;position:absolute;bottom: -50px;left:0;background:#000;"></li>
	
	  
	if(bindName!='Help' && bindName!='lang'){
		elMenu.append($("<li/>",{"style":"width:76px;height:10px;position:absolute;bottom: -10px;left:5px;background: url('/fixadata-common/images/menu_arrow.png') no-repeat;"}));
	}
	
	
	$i.each( prMenu ,function( key ,value ) {
		var elItem	= $i('<li/>');
		if ( value.Type == 'line' ) {
			elItem.addClass('line').append($i('<span/>'));
		} else {
			var evClick	= ( 'unlock'==value.Lock ) ? value.Event : 'return false;';
			var tpType	= ( 'unlock'==value.Lock ) ? '' : 'menuItem';
			var elLink	= $i('<a/>' ,{ href : value.Link ,text : value.Name ,onclick : evClick ,'item-type' : tpType }).addClass(value.Lock);
			elItem.append(elLink);
		};
		elMenu.append(elItem);
	} );

	return elMenu;
};

// 상단 하위 메뉴 닫기
Core.Tnb.SubmenuClose = function() {
	$i('#' + Options.Element.Global.Tnb.Id + '>ul.mainmenu>li.item').removeClass('on');
	
	
	
	/**
	$(".submenu").each(function(k,v){
		  $(this).hide();
	});
	**/
	
	
	
};


Core.Pnb = {};

// 상단 실행 아이콘 메뉴 생성
Core.Pnb.Create = function() {
	var menuTree	= Options.Menu.Pnb;
	var elMenu		= $i('<div/>' ,{ class : 'panel' });
	
	$i.each(menuTree ,function( key ,value ) { 
		var elItem	= Core.Pnb.GroupCreate( value );
		elMenu.append(elItem);
	});

	Options.Element.Global.Pnb.El().html(elMenu);
};

// 상신 실행 아이콘 메뉴 생성 시 그룹 별로 HTML Element 조합
Core.Pnb.GroupCreate = function( prMenu ) {
	var elMenu	= $i('<div/>' ,{ class : 'panelGroup' });

	$i.each(prMenu ,function( key ,value ) {
		var evClick	= ( 'unlock'==value.Lock ) ? value.Event : 'return false;';
		var elLink	= $i('<a/>' ,{ href : value.Link ,text : value.Name ,'item-type' : value.ItemType ,class : value.Class ,onclick : evClick }).addClass(value.Lock);
		elMenu.append(elLink);
	});

	return elMenu;
};



Core.Console = {};

/**
 * # Core.Console.Write : 콘솔창에 알림내역 표출 # Parameter json = { Type : [String
 * Value] ,KeyCode : [String Value] } - Type = Info or Error or Success
 * (FixaData-Options에 정의된 Options.Message 변수의 하위 변수 명칭) - KeyCode = Type 값에 의하여
 * 호출된 Json의 키값
 */
Core.Console.Write = function( json ){
	var elTarget		= Options.Element.Console.Text.El()
	var consoleMessage	= eval('Options.Message.' + json.Type);
	var jsonValue		= $i.JsonSearch( consoleMessage ,json.KeyCode );
	var message			= json.Message;
	var subMessage      = json.subMessage;
	if ( $i.ChkBlankNot(jsonValue) ) {
		
		// message가 있을 경우 데이터이상치 검출 console.log
		if(message != ""){
			
			var html		= '<span class="code">[' + jsonValue.Code + ']</span>'+ subMessage +': <span class="' + jsonValue.Type + '">'  + message + '</span>'+ jsonValue.Message +'<br>';
		
		}else{
			
			var html		= '<span class="code">[' + jsonValue.Code + ']</span><span class="' + jsonValue.Type + '">' + jsonValue.Message + '</span>' + message + '<br>';

		}
		
		
		elTarget.append(html);
	};
	elTarget.animate({scrollTop: elTarget.prop("scrollHeight")}, 500);
};


Core.Modal = {};


/**
 * # Core.Modal.Background : 레이어 팝업 반투명 배경 생성
 */
Core.Modal.Background = function() {
	Options.Variable.Global['History'] = false;
	var modalStyle		= 'z-index:99985; position:fixed; left:0; top:0; width:100%; height:100%; text-align:center; background-color:rgba(0 ,0 ,0 ,0.7); overflow:hidden;';
	var modalBackground	= $i('<div/>' ,{ id : Options.Element.Global.Modal.Id ,style : modalStyle });
	return modalBackground;
};



/**
 * # Core.Modal.Loading : 콘텐츠 로딩 이미지 레이어 생성
 */
Core.Modal.Loading = function( callback ) {
	var	elLoadingArea	= $i('<div/>' ,{
		id	: Options.Element.Global.Loading.Id
	});
	Options.Element.Global.Inni.El().append(elLoadingArea);
};

/**
 * # Core.Modal.LoadingClose : 콘텐츠 로딩 이미지 레이어 제거
 */
Core.Modal.LoadingClose = function() {
	Options.Element.Global.Loading.El().empty().remove();
};

/**
 * # Core.Modal.Close : 레이어 팝업 창닫기
 */
Core.Modal.Close = function() { Options.Variable.Global['History'] = true;Options.Element.Global.Modal.El().empty().remove(); }

/**
 * # Core.Modal.Timer : 실행 타이머 레이어 팝업
 */
Core.Modal.Timer = function() {

	Core.Output.Output('Core.Output.OutputResponse');
	return;

	var global	= Options.Variable.Diagram.Global;
	var keys	= Object.keys(global);

	// 다이어 그램 등록유무 검사
	if ( 1 > keys.length - 1 ) {
		Core.Console.Write( { Type : 'Error' ,KeyCode : 'Errr1601' ,Message : lang_return("fixa.core.title002") } ); // (룰
																														// 등록
																														// 방법은
																														// Help를
																														// 참고
																														// 하세요.)
		return;
	};
	

	var objInputTypeOp1	= $i('<option/>' ,{ value : Options.Element.Process.TimerTpA.Id ,text : 'timer' });
	var objInputTypeOp2	= $i('<option/>' ,{ value : Options.Element.Process.TimerTpB.Id ,text : 'time' });
	var objInputType	= $i('<select/>' ,{ id : Options.Element.Process.InputTimerType.Id ,name : Options.Element.Process.InputTimerType.Name }).append(objInputTypeOp1).append(objInputTypeOp2).on('change' ,function(e) {
		var value = $i(this).val();
		$i('#' + value).parent().parent().find('.timer').css('display' ,'none').end().end().end().css('display' ,'inline');
	});

	var objInputMinutes	= Core.Modal.SelectTimer(Options.Element.Process.InputTimerMinutes.Id ,Options.Element.Process.InputTimerMinutes.Name);

	var objInputHour	= Core.Modal.Select24(Options.Element.Process.InputTimerHour.Id ,Options.Element.Process.InputTimerHour.Name);
	var objInputMinute	= Core.Modal.Select60(Options.Element.Process.InputTimerMinute.Id ,Options.Element.Process.InputTimerMinute.Name);
	
	var objTimerTp		= $i('<span/>').append(objInputType);
	var objTimerTpA		= $i('<span/>' ,{ id : Options.Element.Process.TimerTpA.Id ,class : 'timer' }).append(objInputMinutes).append(lang_return("fixa.core.title003")); // 뒤에
																																											// 실행
																																											// 합니다.
	var objTimerTpB		= $i('<span/>' ,{ id : Options.Element.Process.TimerTpB.Id ,class : 'timer' ,css : {display:'none'} }).append(objInputHour).append(' : ').append(objInputMinute).append(lang_return("fixa.core.title003")); // 뒤에
																																																									// 실행
																																																									// 합니다.
	var objTimer		= $i('<div/>' ,{ id : Options.Element.Process.Timer.Id }).append(objTimerTp).append(objTimerTpA).append(objTimerTpB);
	
	var elTitle		= $i('<div/>' ,{
		class	: 'title'
	,	text	: lang_return("fixa.core.title004")// '이상치 검출 실행'
	});

	var elContent	= $i('<div/>' ,{
		class	: 'content'
	}).append(objTimer);

	var elButtonOk	= $i('<a/>' ,{
		class	: 'button buttonOk'
	,	text	: lang_return("fixa.core.title005")// '실행하기'
	,	href	: '#'
	}).on('click' ,function() {
		Core.Output.Timer();
	} );
	var elButtonCancle	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title006")// '취소'
	,	href	: '#'
	}).on('click' ,function() {
		clearTimeout(Options.Variable.Global.SetTimer);
		Core.Modal.Close();
		return false;
	} );
	var elButtonBox	= $i('<div/>' ,{
		class	: 'itmButton'
	}).append(elButtonCancle).append(elButtonOk);

	var elInfo = $i('<div/>' ,{ class : 'info' })

	var elContainer	= $i('<div/>' ,{
		id		: Options.Element.Process.TimerBox.Id
	}).append(elTitle).append(elContent).append(elButtonBox);

	var objModal	= Core.Modal.Background().append(elContainer);
	Options.Element.Global.Inni.El().append(objModal);
};

// 타이머 : 분선택 HTML Element 생성
Core.Modal.Select60 = function( id ,name ) {
	var objSelect	= $i('<select/>' ,{ id : id ,name : name });
	objSelect.append($i('<option/>' ,{value : '' ,text : lang_return("fixa.core.title088")})); // 분석택
	for ( fx=0; fx<60; ++fx ) {
		var tmpOptions = $i('<option/>' ,{
			value	: fx
		,	text	: fx
		});
		objSelect.append(tmpOptions);
	};
	return objSelect;
};

// 타이머 : 시 선택 HTML Element 생성
Core.Modal.Select24 = function( id ,name ) {
	var objSelect	= $i('<select/>' ,{ id : id ,name : name });
	objSelect.append($i('<option/>' ,{value : '' ,text : lang_return("fixa.core.title007")})); // 시선택
	for ( fx=0; fx<24; ++fx ) {
		var tmpOptions = $i('<option/>' ,{
			value	: fx
		,	text	: fx
		});
		objSelect.append(tmpOptions);
	};
	return objSelect;
};

// 타이머 : 시간 선택 HTML Element 생성
Core.Modal.SelectTimer = function( id ,name ) {
	var data		= [1 ,5 ,10 ,15 ,20 ,30 ,40 ,50 ,60 ,90 ,120 ,150 ,180];
	var dataGap		= 60;
	var objSelect	= $i('<select/>' ,{ id : id ,name : name });
	objSelect.append($i('<option/>' ,{value : '' ,text : lang_return("fixa.core.title008")})); // 시간
																								// 선택
	for ( fx=0; fx<data.length; ++fx ) {
		var tmpData			= parseInt(data[fx]);
		var tmpQuotient		= parseInt(tmpData / dataGap);
		var tmpRemainder	= tmpData%dataGap;

		var tmpTimer		= ((tmpData>59 && tmpQuotient>0) ? tmpQuotient + lang_return("fixa.core.title009") : '' ) + ( (tmpRemainder<1) ? '' : ((tmpData>59) ? $i.Right('0' + tmpRemainder ,2) : tmpData) + '분&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' ); 

		var tmpOptions = $i('<option/>' ,{
			value	: tmpData
		,	html	: tmpTimer
		});
		objSelect.append(tmpOptions);
	};
	return objSelect;
};

Core.StandardVoca = {};
Core.CordDomain = {};


Core.Member = {};

Core.Member.Login = {};

// 비동기 로그인 처리
Core.Member.Login.Submit = function( objForm ,responseFunction ) {
	var response;
	var data		= objForm.SerializeObject()
	var validation	= Core.Member.Login.Validation( data );
	if ( validation>2 && validation<5 ) { response = { Response : false ,ResponseValue : validation };
	} else {
		var optionsAjax = {
			url		: Options.Uri.Ajax.Member.Login
		,	data	: data
		,	success	: function( d ,e ) { eval(responseFunction + '( d ,e )'); }
		};$i.Ajax(optionsAjax);
		response = { Response : true };
	};
	return response;
};

// 비동기 로그인 처리 시 아이디, 비밀번호 내용 확인
Core.Member.Login.Validation = function ( data ) {
	var id			= eval('data.' + Options.Element.Member.LoginUserId.Name);
	var pw			= eval('data.' + Options.Element.Member.LoginUserPw.Name);
	var response	= 0;
	if ( $i.ChkBlank(id) || 4 > id.length || 20 < id.length || !(Options.Pattern.Id).test(id) ) {
		response = 3;
	} else if ( $i.ChkBlank(pw) || 8 > pw.length || 20 < pw.length ) {
		response = 4;
	} else if ( !( (pw.search(Options.Pattern.SpecialCharacter) == -1 && (Options.Pattern.Password2).test(pw)) || (pw.search(Options.Pattern.SpecialCharacter) > -1 && (Options.Pattern.Password).test(pw)) ) ) {
		response = 4;
	};
	return response;
};

// 로그아웃 처리
Core.Member.Logout = function() {
	var optionsAjax = {
		url		: Options.Uri.Ajax.Member.Logout
	,	data	: ''
	,	success	: function( d ,e ) { window.location.href = Options.Uri.Url.Login }
	};$i.Ajax(optionsAjax);
};


Core.Files = {};
Core.Files.Find = function(){
	$("#uploadFile").click();
	
	
};
Core.Files.Find2 = function(){
	$("#uploadFileCollect").click();
};
// 드래그 파일 첨부 영역 HTML Element 생성
Core.Files.Create = function( responseFunction ) {
	$i('html *').on( 'dragover' ,function(e) { Core.Files.PreventDefault( e ); }).on('drop' ,function(e) { Core.Files.PreventDefault( e ); } );
	Options.Element.Datainput.ItemArea.El().on( 'dragenter' ,function( e ) { 
		Core.Files.FilesEnter( e );
	} ).on( 'dragover' ,function( e ){
		Core.Files.FilesOver( e );
	} ).on( 'drop' ,function( e ) {
		
		Core.Files.FilesDrop( e ,responseFunction );
	} );
};

// 드래그 된 파일 초기화
Core.Files.PreventDefault = function( e ) {
	e.preventDefault();
};

// 드래그 된 파일이 영역 안에서 끝났을 때 발생하는 이벤트
Core.Files.FilesEnter = function( e ) {
	Core.Files.PreventDefault( e );
};

// 드래그 된 파일이 영역 안에 올라 왔을 때 발생하는 이벤트
Core.Files.FilesOver = function( e ) {
	Core.Files.PreventDefault( e );
};

// 드래그 된 파일이 영역 안에 Drop 됬을 때 발생하는 이벤트
Core.Files.FilesDrop = function( e ,responseFunction ) {
	Core.Files.PreventDefault( e );
	var files	= e.originalEvent.dataTransfer.files;
	if ( Options.Files.Setting.Count < files.length ) {
		$i.Alert( Options.Message.Error.Errr1401.Message ,function(response){});
	} else {
		Core.Files.FilesInfo( files ,responseFunction );
	};
};

Core.Files.HtmlList = function( data ) {
	return (data.name + ' (' + data.size + Options.Files.Setting.SizeType + ')');
};

Core.Files.FilesInfo = function( files ,responseFunction ) {
	
	var isexe = true;
	
	var elTarget = $i('#' + Options.Element.Datainput.FileInfo.Id + ' .fileName');
	
	
	
	var elButton = Options.Element.Datainput.ButtonArea.El();
	for ( var fx = 0; fx < files.length; fx++ ) {
		var size = files[fx].size;
		for ( var fx2 = 0; fx2 < Options.Files.Setting.SizeTypeLeng; ++fx2 ) {
			size = (size / 1024);
		};
		
		
		var data = {
			name		: files[fx].name
		,	mimeType	: files[fx].type
		,	size		: size.toFixed(Options.Files.Setting.SizeFixed)
		,	extLimit	: Options.Files.Setting.ExtLimit
		};
		
		
		if ( !($i.ExtLimit(data)) ) {
			isexe = false;
			$i.Alert( Options.Message.Error.Errr1402.Message ,function(response){});
		};
		
		
		var fileLimitSize = Options.Files.Setting.limitSize[data.name.split('.').pop().toLowerCase()];
		var fileExt = data.name.split('.').pop().toLowerCase();
		
		
		
		if(fileLimitSize<=data.size)
		{
			isexe = false;
			$i.Alert( "'"+fileExt+"' "+Options.Message.Error.Errr1602.Message.replace("{0}",fileLimitSize/1024), function(reponse){});
		};
		
		
		
		
		
		
		if(isexe==true){

			var button = $i('<a/>' ,{
				href 	: '#'
			,	id		: Options.Element.Datainput.ButtonSubmit.Id
			,	class	: 'button'
			,	text	: lang_return("fixa.core.title010") // 파일전송
			}).on( 'click' ,function( e ) {
				Core.Files.Submit( files ,responseFunction );
				return false;
			} );
			
			elButton.html( button )
			elTarget.html( Core.Files.HtmlList( data ) );
		}
	};
};
Core.Files.FilesInfo2 = function(e,responseFunction) {
	var aa = document.getElementById("uploadFileCollect");
	var files = aa.files;
	var isexe = true;
	
	var elTarget = $i('#' + Options.Element.Datainput.FileInfo.Id + ' .fileName');
	
	var elButton = Options.Element.Datainput.ButtonArea.El();
	for ( var fx = 0; fx < files.length; fx++ ) {
		var size = files[fx].size;
		for ( var fx2 = 0; fx2 < Options.Files.Setting.SizeTypeLeng; ++fx2 ) {
			size = (size / 1024);
		};
		
		
		var data = {
			name		: files[fx].name
		,	mimeType	: files[fx].type
		,	size		: size.toFixed(Options.Files.Setting.SizeFixed)
		,	extLimit	: Options.Files.Setting.ExtLimit
		};
		
		
		if ( !($i.ExtLimit(data)) ) {
			isexe = false;
			$i.Alert( Options.Message.Error.Errr1402.Message ,function(response){});
		};
		
		
		var fileLimitSize = Options.Files.Setting.limitSize[data.name.split('.').pop().toLowerCase()];
		var fileExt = data.name.split('.').pop().toLowerCase();
		
		
		
		if(fileLimitSize<=data.size)
		{
			isexe = false;
			$i.Alert( "'"+fileExt+"' "+Options.Message.Error.Errr1602.Message.replace("{0}",fileLimitSize/1024), function(reponse){});
		};
		
		
		if(isexe==true){
			var button = $i('<a/>' ,{
				href 	: '#'
			,	id		: Options.Element.Datainput.ButtonSubmit.Id
			,	class	: 'button'
			,	text	: lang_return("fixa.core.title010") // 파일전송
			}).on( 'click' ,function( e ) {
				Core.Files.Submit( files ,responseFunction );
				return false;
			} );
			
			elButton.html( button )
			elTarget.html( Core.Files.HtmlList( data ) );
		}
	};
};
// 드래그 된 파일을 비동기 통신으로 서버에 전송하여 저장
Core.Files.Submit = function( files ,responseFunction,data) {
	
		url = "";
		//excel shee개수에 따른 처리
		if(multi_sheet==1)
		{
			url = "/collect/excelSheetParser.fd";
		}
		else
		{
			url = "/collect/collectUploadProcess.fd";
		}
		confirmBox(lang_return("fixa.core.title011"),function(data){
			   if(data==true ) {  // 파일을 업로드 하시겠습니까?
			         var data = new FormData();
			         for (var i = 0; i < files.length; i++) {
			            data.append('uploadFile', files[i]);
			         }
			         loadingBar();
			         $.ajax({
			            url: url ,
			            method: 'post',
			            data: data,
			            dataType: 'json',
			            processData: false,
			            contentType: false,
			            success: function(res) {
			            	console.log("res",res);
			            	if(multi_sheet=="1")
			        		{
			            		Core.excelSheet(res,files);
			            		loadingprogresshide();
			        		}
			            	else
			            	{
			            		loadingprogresshide();
			            		location.href  = "/prep/prep.fd";
			            	}
			            	
			           },complete : function() {
			        	   
			        	   if(multi_sheet!="1"){
			        		   loadingprogresshide();
					           location.href  = "/prep/prep.fd"; 
			        	   }
				        		
			            	
			           }
			         
			         });
			     } 
		})

};

/**
 * excelSheet list출력
 */
Core.excelSheet = function(res,files){   
   var objModal   = Core.Modal.Background();
   var elContainer   = $i('<div/>' ,{
      id      : Options.Element.fileupload.excelList.Id
   });
   var elTitle = $i('<div/>',{
      class : 'title'
   });
   var elContent =$i('<div/>',{
      class : 'content'
   });

   var td1= $i('<td/>',{text:"sheetName"});
   var td2= $i('<td/>');
   var select=$i('<select/>',{text:"sheetList",id:"sheetList"});
   for(i=0;i<res.sheetList.length;i++)
   {
      var option = $i('<option/>' ,{ value : res.sheetList[i].index ,text:res.sheetList[i].indexName});
      select.append(option);
   }
   
   var tr =$('<tr/>').append(td1).append(td2.append(select));
   var table =$('<table/>').append(tr);
   var form = $('<form/>').append(table);
   
   elContent.html(form);
   
   var elButtonOk   = $i('<a/>' ,{
      class   : 'button'
   ,   text   : "selective"// 'selective'
   ,   href   : '#'
   }).on('click' ,function() {
	   
	   var data = new FormData();
       for (var i = 0; i < files.length; i++) {
          data.append('uploadFile', files[i]);
       }
       
       data.append("sheetIndex",$("#sheetList").val());
       url = "/collect/getExcelSheet.fd";
       
       $.ajax({
          url: url ,
          method: 'post',
          data: data,
          processData: false,
          contentType: false,
          success: function(result) {
        	  location.href  = "/prep/prep.fd";
          	
          }
       });
	  
      return false;
   } );

   var elButtonCancle   = $i('<a/>' ,{
      class   : 'button'
   ,   text   : lang_return("fixa.core.title006")// '취소'
   ,   href   : '#'
   }).on('click' ,function() {
      Core.Modal.Close(); // 기존 페이지로 돌아가기
      return false;
   } );
   var elButtonBox   = $i('<div/>' ,{
      class   : 'itmButton'
   })
   .append(elButtonCancle).append(elButtonOk);
   
   elTitle.append($("<div/>",{"class":"tab_btn_left"}));
   elTitle.append($("<a/>",{"text":"excelList"}));
   elTitle.append($("<div/>",{"class":"tab_btn_right"}));
   
   elContainer.append(elTitle).append(Core.tabbar4()).append(elContent).append(elButtonBox);
   objModal.html(elContainer);
   Options.Element.Global.Inni.El().append(objModal);
   Options.Element.fileupload.excelList.El().SetForm();
   
};

Core.Files.Submit2 = function(){
	
// let StandardVoca_data = $("#uploadFileFrm").SerializeObject();
	let check = Core.StandardVoca.Check();
	
	if (check) {
	   if(confirm(lang_return("fixa.core.title011")) ) {  // 파일을 업로드 하시겠습니까?
// var form = $('#formStandardVoca')[0];
// var formData = new FormData(form);
// restRequest("/collect/collectStandardVocaUploadProcess.fd","POST",formData,
// function(data){
//	     		
// alert("1");
// });
		   	var data = new Object();
	     	$.ajax({
	     	    type:"POST",
	     	    url:"/collect/collectStandardVocaUploadProcess.fd",
	     	    data: new FormData($("#uploadFileFrm")[0]),
	     	    dataType:"json",
	     	    contentType	: false,
	   			processData	: false,
	   		    async: true,
	     	    success:function(res) {
	     	        // success
	     	    	
	     	    },
	     	   complete : function() {
// location.href = "/prep/prep.fd";
	     		  var data = $("#uploadFileFrm").SerializeObject();
	     		  let optionsAjax = {
     					url		: Options.Uri.Ajax.StandardVoca.List
     				,	data	: data
     				,	success	: function( d ,e ) {
     					
     					
     					alert_message(lang_return("fixa.core.title210"));
     					Core.StandardVoca.ListResponse(d,e); 
     				
     				}
     				};$i.Ajax(optionsAjax);
	            }
	     	});
	     } 
	};
};


Core.Files.Submit3 = function(){
	
	let check = Core.CordDomain.Check();
	
	if (check) {
	   if(confirm(lang_return("fixa.core.title011")) ) {  // 파일을 업로드 하시겠습니까?
// var form = $('#formStandardVoca')[0];
// var formData = new FormData(form);
// restRequest("/collect/collectStandardVocaUploadProcess.fd","POST",formData,
// function(data){
//	     		
// alert("1");
// });
		   	var data = new Object();
	     	$.ajax({
	     	    type:"POST",
	     	    url:"/collect/collectStandardVocaUploadProcess.fd",
	     	    data: new FormData($("#uploadFileFrm2")[0]),
	     	    dataType:"json",
	     	    contentType	: false,
	   			processData	: false,
	   		    async: true,
	     	    success:function(res) {
	     	        // success
	     	    	
	     	    },
	     	   complete : function() {
// location.href = "/prep/prep.fd";
	     		  var data = $("#uploadFileFrm2").SerializeObject();
	     		  let optionsAjax = {
  					url		: Options.Uri.Ajax.StandardVoca.List
  				,	data	: data
  				,	success	: function( d ,e ) {
  					alert_message(lang_return("fixa.core.title210"));
  					Core.CordDomain.ListResponse(d,e); 
  				
  				}
  				};$i.Ajax(optionsAjax);
	            }
	     	});
	     } 
	}
};


Core.Project = {};

Core.Project.SaveShow = function() {
	
	// ### 프로젝트 고유값이 있을 경우 바로 저장
	if ( !$i.ChkBlank(Options.project_sn) && !$i.ChkBlank($("#historyProjectName").text()) ) {
		Prep.SaveData();// 프로젝트 저장
		return false;
	};
	// ### 프로젝트 고유값이 없을 경우 신규 저장
	var objModal	= Core.Modal.Background();
	var elContainer	= $i('<div/>' ,{
		id		: Options.Element.Project.SaveForm.Id
	});
	var elTitle		= $i('<div/>' ,{
		class	: 'title'
	// '프로젝트 저장'
	});
	var elContent	= $i('<div/>' ,{
		class	: 'content'
	});
	var itmInputBox	= $i('<div/>' ,{
		class	: '_form-input'
	}).append($i('<label for="projectName">'+lang_return("fixa.core.title013")+'</label><input name="' + Options.Element.Project.SaveInput.Name + '" id="' + Options.Element.Project.SaveInput.Id + '" data-format="projectName" type="text" value="'+$("#projectNm").val()+'"/>'));
	elContent.html(itmInputBox);

	var elButtonOk	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title012")// '프로젝트 저장'
	,	href	: '#'
	}).on('click' ,function() {
		// Core.Project.Save(); // 프로젝트 저장
		Core.Console.Write( { Type : 'Success' ,KeyCode : 'Succ1301' ,Message :'' } );
		Prep.SaveData();
		return false;
	} );

	var elButtonCancle	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title006")// '취소'
	,	href	: '#'
	}).on('click' ,function() {
		Core.Modal.Close();
		return false;
	} );
	var elButtonBox	= $i('<div/>' ,{
		class	: 'itmButton'
	}).append(elButtonCancle).append(elButtonOk);
	
	elTitle.append($("<div/>",{"class":"tab_btn_left"}));
	elTitle.append($("<a/>",{"text":lang_return("fixa.core.title012")}));
	elTitle.append($("<div/>",{"class":"tab_btn_right"}));
	
	elContainer.append(elTitle).append(Core.tabbar4()).append(elContent).append(elButtonBox);
	objModal.html(elContainer);
	Options.Element.Global.Inni.El().append(objModal);
	Options.Element.Project.SaveForm.El().SetForm();
};

//Save As
Core.Project.SaveAsShow = function() {
	
	// ### 프로젝트 고유값이 없을 경우 신규 저장
	var objModal	= Core.Modal.Background();
	var elContainer	= $i('<div/>' ,{
		id		: Options.Element.Project.SaveForm.Id
	});
	var elTitle		= $i('<div/>' ,{
		class	: 'title'
	// '프로젝트 저장'
	});
	var elContent	= $i('<div/>' ,{
		class	: 'content'
	});
	var itmInputBox	= $i('<div/>' ,{
		class	: '_form-input'
	}).append($i('<label for="projectName">'+lang_return("fixa.core.title013")+'</label><input name="' + Options.Element.Project.SaveInput.Name + '" id="' + Options.Element.Project.SaveInput.Id + '" data-format="projectName" type="text" value=""/>'));
	elContent.html(itmInputBox);

	var elButtonOk	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title012")// '프로젝트 저장'
	,	href	: '#'
	}).on('click' ,function() {
		// Core.Project.Save(); // 프로젝트 저장
		Core.Console.Write( { Type : 'Success' ,KeyCode : 'Succ1301' ,Message :'' } );
		Prep.SaveAsData();
		return false;
	} );

	var elButtonCancle	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title006")// '취소'
	,	href	: '#'
	}).on('click' ,function() {
		Core.Modal.Close();
		return false;
	} );
	var elButtonBox	= $i('<div/>' ,{
		class	: 'itmButton'
	}).append(elButtonCancle).append(elButtonOk);
	
	elTitle.append($("<div/>",{"class":"tab_btn_left"}));
	elTitle.append($("<a/>",{"text":lang_return("fixa.core.title012")}));
	elTitle.append($("<div/>",{"class":"tab_btn_right"}));
	
	elContainer.append(elTitle).append(Core.tabbar4()).append(elContent).append(elButtonBox);
	objModal.html(elContainer);
	Options.Element.Global.Inni.El().append(objModal);
	Options.Element.Project.SaveForm.El().SetForm();
};


// 프로젝트 저장
Core.Project.Save = function() {
	var projectNm = $("#projectNm").val();
	
	
	if(projectNm == ""){
		alert_message(lang_return("fixa.core.title014"));
		return;
	}
	
	
	var gridData = {
			  data : slickGrid.getData(grid)
			, header : slickGrid.getHeaderName(grid)
			, project_sn:project_sn
			, project_data_sn: project_data_sn
		 	, project_nm : projectNm
	}
	
	var jsonData = JSON.stringify(gridData);
	
	
	$.ajax({
	    url: '/prep/savePrep.fd' 
	    ,crossDomain: true
	    ,contentType: 'application/json'
	    ,async: false
	    ,type: 'POST'
	    ,data: jsonData
	    ,dataType: 'json'
	    ,success: function(data) {
			if(data.result=="success")
			{
				if(confirm(lang_return("fixa.core.title015")))
				{
					location.href  = "/outlier/workflow.fd";
				}
				else
				{
					return ;
				}
			}
	    	
	    }
	    
	});
};

// 프로젝트 저장 결과를 처리
Core.Project.SaveResponse = function( d ,e ) {
	$i('#' + Options.Element.Process.Sheet.Id + '>.item>a').eq(1).removeClass('lock');
	$i.extend( Options.Variable.Global ,{
		PROJECT_SN		: d.PROJECT_SN
		,	PROJECT_NAME	: d.PROJECT_NAME
		,	FILE_NAME		: ''
		} );
	Core.Console.Write( { Type : 'Success' ,KeyCode : 'Succ1301' ,Message : ' ('+lang_return("fixa.core.title013")+': ' + d.PROJECT_NAME + ')' } );  // 프로젝트
																																						// 명칭
	Options.Element.Global.ProjectName.El().html(d.PROJECT_NAME);
	
	// 프로젝트 명칭
	$i('#historyProjectName').text(d.PROJECT_NAME);

	// BlockChain 목록 갱신
	let elBlockChain = Options.Element.Blockchain.Block.El();
	if ( elBlockChain.is('.on') ) {
		var blockChainData = d.listBlockchain;
		Core.Blockchain.ListRow(blockChainData);
	} else {
		Core.Blockchain.List();
	};
	Core.Modal.Close();
};

// 프로젝트 열기 HTML Element 생성
Core.Project.OpenShow = function() {
	var objModal	= Core.Modal.Background();
	var elContainer	= $i('<div/>' ,{
		id		: Options.Element.Project.Open.Id
	});
	var elTitle		= $i('<div/>' ,{
		class	: 'title'
	// '프로젝트 열기'
	});
	var elContent	= $i('<div/>' ,{
		class	: 'content'
	});
	var itmList		= $i('<ul/>' ,{
		class	: 'list',
		id  	: 'collect_type_project'
	});
	var elButtonOk	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title001")// '프로젝트 열기'
	,	href	: '#'
	}).on('click' ,function() {
		var elProjectList	= $i('#' + Options.Element.Project.Open.Id + ' .list li.select a');
		
		
		var activeCheck=0;
		$i('#' + Options.Element.Project.Open.Id + ' .list li ul p').each(function(k,v){
		if($(v).attr("class")=="active"){
			activeCheck++;
		}
		});
		
		
		if(activeCheck==0)
		{
			alert_message(lang_return("fixa.stat.title001"));
			return ;
		}
		
		
		// Core.Project.Open();
		Core.Project.Open2();
		Core.Modal.Close();
		return false;
	} );
	var elButtonCancle	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title036")// '취소'
	,	href	: '#'
	}).on('click' ,function() {
		Core.Modal.Close();
		return false;
	} );
	var elButtonBox	= $i('<div/>' ,{
		class	: 'itmButton'
	}).append(elButtonCancle).append(elButtonOk);
	elContent.html(itmList);
	
	elTitle.append($("<div/>",{"class":"tab_btn_left"}));
	elTitle.append($("<a/>",{"text":lang_return("fixa.core.title001")}));
	elTitle.append($("<div/>",{"class":"tab_btn_right"}));
	
	elContainer.append(elTitle).append(Core.tabbar4()).append(elContent).append(elButtonBox);
	objModal.html(elContainer);
	Options.Element.Global.Inni.El().append(objModal);
	// Core.Project.List();
	Core.Project.List2();
};
// 프로젝트 열기 화면에 표출 되는 프로젝트 목록 HTML Element 생성(2019.08.13) 신규 생성
// Core.Project.List2 <-기존 호출 함수 변경
Core.Project.List2 = function() {
	$.ajax({
	    url: '/collect/projectList.fd' 
	    ,async: false
	    ,type: 'post'
	    ,dataType: 'json'
	    ,success: function(data) {
	    	console.log("data",data);
			var html = "";
			var obj = "";
			for(i=0;i<data.result.length;i++){
				if(data.result[i].flag==1)
				{
					var param = new Object();
					param.project_sn = data.result[i]['project_sn'];
					$.ajax({
					    url: '/collect/projectDataVersionCheck.fd' 
					    ,async: false
					    ,type: 'post'
					    ,data : param
					    ,success: function(data2) {
					    	if(data2.resultCnt != 0){
					    		html += "<li id='dataList_"+data.result[i]['project_sn']+"'><p style='color:545454' onclick='Core.Project.DataList("+data.result[i]['project_sn']+");'>"+data.result[i]['project_name']+"</p></li>";
					    		obj = JSON.parse((data.result[i]['workflow']));
					    	}
					    }
					});
				}
			}
			$("#collect_type_project").append(html);
	    }
	});
};
Core.Project.ImportList = function() {
	$.ajax({
	    url: '/collect/importList.fd' 
	    ,async: false
	    ,type: 'post'
	    ,dataType: 'json'
	    ,success: function(data) {
	    	alert_message("여기옴");
// console.log("data",data);
			var html = "";
// var obj = "";
			for(i=0;i<data.result.length;i++){
				html += "<li><p style='color:545454' id='imp"+(i+1)+"' class='imp' onmouseover='Core.Project.ImportMouseover("+(i+1)+");' onmouseout='Core.Project.ImportMouseout("+(i+1)+");' onclick='Core.Project.ImportClick("+(i+1)+","+(data.result.length)+");'>"+data.result[i]["fileName"]+"</p></li>";
				
// if(data.result[i].flag==1)
// {
// var param = new Object();
// param.project_sn = data.result[i]['project_sn'];
// $.ajax({
// url: '/collect/projectDataVersionCheck.fd'
// ,async: false
// ,type: 'post'
// ,data : param
// ,success: function(data2) {
// if(data2.resultCnt != 0){
// }
// }
// });
				}
// }
			$("#collect_import_data").append(html);
	    }
	});
};

/**
 * app Release 기능
 */
Core.appRelease = function(){
	// ### 프로젝트 고유값이 없을 경우 신규 저장
	
	var objModal	= Core.Modal.Background();
	var elContainer	= $i('<div/>' ,{
		id		: Options.Element.Release.SaveForm.Id 
	});
	var elTitle = $i('<div/>',{
		class : 'title'
	});
	var elContent =$i('<div/>',{
		class : 'content'
	});
	var input1		= $('<input/>'	,{ id : 'form_release_id' ,name : 'form_release_id' ,type : 'text' ,'data-format' : 'none' ,value : '' , disabled : 'disabled'}); // 파일
																																										// 이름
																																										// 들어가는곳
	var input2  	= $('<input/>'  ,{ id : 'uploadFile' ,name : 'uploadFile',type : 'file' , style : 'display: none;',onchange : "javascript:document.getElementById('form_release_id').value = this.files[0].name"}); // 파일찾아오기
	var input3  	= $('<input/>'  ,{ id : 'version' ,name : 'version',type : 'hidden' , style : 'display: none;'}); // 파일찾아오기
	var itmInputBox = $i('<div/>',{class : '_form-input'}).append(input1).append(input2).append(input3);
	var button =$i('<a/>',{class : '_btn' , href :'#', text : lang_return("fixa.core.title161")}).on('click',function(){Core.Files.Find(); return false;}); // 파일선택
	var form	= $('<form/>'	,{ id: 'uploadReleaseFileFrm' , name : 'uploadReleaseFileFrm' ,enctype : 'multipart/form-data' ,method : 'post' }).append(itmInputBox).append(button);
	
	elContent.html(form);
	
	var elButtonOk	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title213")// '배포'
	,	href	: '#'
	}).on('click' ,function() {
		Core.Project.ReleaseData(); // 배포 버튼을 누르고 실행되는 기능
		Core.Console.Write( { Type : 'Success' ,KeyCode : 'Succ1301' ,Message :'' } );// 배포
																						// 성공
																						// 메시지
																						// 출력
// prep.saveData();
		return false;
	} );

	var elButtonCancle	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title006")// '취소'
	,	href	: '#'
	}).on('click' ,function() {
		Core.Modal.Close(); // 기존 페이지로 돌아가기
		return false;
	} );
	var elButtonBox	= $i('<div/>' ,{
		class	: 'itmButton'
	})
	.append(elButtonCancle).append(elButtonOk);
	
	elTitle.append($("<div/>",{"class":"tab_btn_left"}));
	elTitle.append($("<a/>",{"text":lang_return("fixa.core.title213")}));
	elTitle.append($("<div/>",{"class":"tab_btn_right"}));
	
	elContainer.append(elTitle).append(Core.tabbar4()).append(elContent).append(elButtonBox);
	objModal.html(elContainer);
	Options.Element.Global.Inni.El().append(objModal);
	Options.Element.Release.SaveForm.El().SetForm();
	
};
Core.Project.ReleaseData = function() {
	
	
	var form = $("#uploadReleaseFileFrm")[0];
	// 확장자명 파일 체크
	var ext = $('#form_release_id').val().split('.').pop().toLowerCase();
	$("#version").val($(".varsion").text().replace("Ver.","").trim());
	
	var formData = new FormData(form);


	if(ext  == "zip"){
		loadingBar();
		$.ajax({
			type:"POST",
			url:"/common/releaseData.fd",
			data: formData,
			dataType:"json",
			contentType	: false,
			processData	: false,
			async: true,
			success:function(res) {
				if(res.result == 1){
//					alert_message(lang_return("fixa.core.title215"));
					alert_message("업데이트 완료");
					loadingprogresshide();
					location.href  = "/prep/prep.fd";
//					self.close();
				}else{
					alert_message(lang_return("fixa.core.title216"));
					loadingprogresshide();
				}
			}
		});
	}else{
		alert_message(lang_return("fixa.core.title214"));
	}
	
};

/**
 * 파일 import 기능
 */
Core.importData = function(){

	// ### 프로젝트 고유값이 없을 경우 신규 저장
	var objModal	= Core.Modal.Background();
	var elContainer	= $i('<div/>' ,{
		id		: Options.Element.Import.SaveForm.Id
	});
	var elTitle		= $i('<div/>' ,{
		class	: 'title'
	
	});
	var elContent	= $i('<div/>' ,{
		class	: 'content'
	});
	
	var td1= $i('<td/>',{text:lang_return("fixa.core.title013")});	//프로젝트명칭
	var td2= $i('<td/>',{class:'_form-input2'}).append($i('<input name="' + Options.Element.Import.SaveInput.Id  + '" id="' + Options.Element.Import.SaveInput.Id + '" data-format="importName" type="text" value=""/>'));;						//input
	
	var td3= $i('<td/>',{text:lang_return("fixa.core.title235")});						//input
	var td4= $i('<td/>');						//파일선택 button
	var td5= $i('<td/>');						//파일선택 button
		
	var input1		= $('<input/>'	,{ id : 'form_import_id' ,name : 'form_import_id' ,type : 'text' ,'data-format' : 'none' ,value : '' , disabled : 'disabled'});
	var input2  	= $('<input/>'  ,{ id : 'uploadFile' ,name : 'uploadFile',type : 'file' , style : 'display: none;',onchange : "javascript:document.getElementById('form_import_id').value = this.files[0].name"});

	var button		= $('<a/>'		,{id : 'wrImportForm', class : '_btn' ,href : '#' ,text  :  lang_return("fixa.core.title161")}).on('click' ,function(){ Core.Files.Find(); return false; });// 추가
	
	var tr1= $('<tr/>').append(td1).append(td2);
	var tr2= $('<tr/>').append(td3).append(td4.append(input1).append(input2)).append(td4.append(button));

	var table=$('<table/>').append(tr1).append(tr2);
	var form	= $('<form/>'	,{ id: 'uploadImportFileFrm' , name : 'uploadImportFileFrm' ,enctype : 'multipart/form-data' ,method : 'post' }).append(table);
	elContent.html(form);

	var elButtonOk	= $i('<a/>' ,{
		class	: 'button'
	,	text	: 'import'// 'import'
	,	href	: '#'
	}).on('click' ,function() {
		Core.Project.ImportData();
		
		// prep.saveData();
		return false;
	} );

	var elButtonCancle	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title006")// '취소'
	,	href	: '#'
	}).on('click' ,function() {
		$("#itmImportSave").remove();
		Core.Modal.Close();
		
	} );
	var elButtonBox	= $i('<div/>' ,{
		class	: 'itmButton'
	}).append(elButtonCancle).append(elButtonOk);
	
	elTitle.append($("<div/>",{"class":"tab_btn_left"}));
	elTitle.append($("<a/>",{"text":'Import'}));
	elTitle.append($("<div/>",{"class":"tab_btn_right"}));
	
	elContainer.append(elTitle).append(Core.tabbar4()).append(elContent).append(elButtonBox);
//	objModal.html(elContainer);
	Options.Element.Global.Inni.El().append(objModal).append(elContainer);
	Options.Element.Import.SaveForm.El().SetForm();
};
// import 2020.05.07 완료
Core.Project.ImportData = function( d ) {
	$("#itmImportSave").css("z-index","9999");
	var ext = $('#form_import_id').val().split('.').pop().toLowerCase();
	if($.trim($("#import_name").val()) != ""){
		if(ext=="zip"){
			loadingBar();
			$.ajax({
	     	    type:"POST",
	     	    url:"/common/importData.fd",
	     	    data: new FormData($("#uploadImportFileFrm")[0]),
	     	    dataType:"json",
	     	    contentType	: false,
	   			processData	: false,
	   		    async: true,
	     	    success:function(data) {
	     	    	
	     	    	
	     	    	if(data.result == 'success'){
	     	    		loadingprogresshide();
				   		$("#itmImportSave").remove();
				   		location.href  = "/prep/prep.fd";
				   		Core.Console.Write( { Type : 'Success' ,KeyCode : 'Succ1301' ,Message :'' } );
	     	    	}else{
	     	    		
	     	    		alert(lang_return("fixa.core.title240"));//json파일이 없습니다.
	     	    		loadingprogresshide();
	     	    		$("#itmImportSave").css("z-index","999999");
	     	    	}
			   		
	     	    },
	     	    beforeSend : function() {
	   			//loadingBar();
	     	    }, 
	     	    complete: function (data) {
	     	    	
	     	    	
	     	   }
	     	});
		}else{
			alert_message(lang_return("fixa.core.title241"));//.zip파일만 가져올 수 있습니다.
	    	$("#itmImportSave").css("z-index","99999");
		}
		
	}else{
		alert_message(lang_return("fixa.core.title242"));//프로젝트 명 입력은 필수사항 입니다.
		$("#itmImportSave").css("z-index","99999");
		return false;
	}
};

//import 취소기능
Core.Project.ImportDataCancel = function( d ) {
	var xhr;

    var fn = function(){
        if(xhr && xhr.readyState != 4){
            xhr.abort();
        }
        xhr = $.ajax({
     	    type:"POST",
     	    url:"/common/importData.fd",
     	    data: new FormData($("#uploadImportFileFrm")[0]),
     	    dataType:"json",
     	    contentType	: false,
   			processData	: false,
   		    async: true,
     	    success:function(res) {
     	    },
     	    beforeSend : function() {
   			//loadingBar();
     	    }, 
     	    complete: function () {
		   		loadingprogresshide();
		   		location.href  = "/prep/prep.fd";
		   		Core.Console.Write( { Type : 'Success' ,KeyCode : 'Succ1301' ,Message :'' } );
     	   }
     	});
       
    };
    
    var interval = setInterval(fn, 500);
}




/**
 * 파일 scheduling 기능
 */
Core.scheduling = function(frmData){
	
	var objModal	= Core.Modal.Background();
	var elContainer	= $i('<div/>' ,{
		id		: Options.Element.Scheduling.SaveForm.Id
		,width :'1000px'
	});
	var elTitle = $i('<div/>',{
		id	 :"title",
		class : 'title'
	});
	var elContent =$i('<div/>',{
		class : 'content'
		,id : 'content'
	});
	
	var td1			= $('<td/>'		,{ text : lang_return("fixa.scheduling.title002")	});				// 타이틀
	var td2			= $('<td/>'		,{ colspan:'6'});													// 타이틀<input>
	var td3			= $('<td/>'		,{ text : lang_return("fixa.scheduling.title003")});				// 수집URL
	var td4			= $('<td/>'		,{ colspan:'2'});													// 수집URL<input>
	var td5			= $('<td/>'		,{ text : lang_return("fixa.scheduling.title004")	});				// 수집방법
	var td6			= $('<td/>'		,{ colspan :'6'});													// 수집방법<hidden>
	var td7			= $('<td/>'		,{ text : lang_return("fixa.scheduling.title007")	});				// 수집주기
	var td8			= $('<td/>'		,{ colspan :'2'});													// 시간/주기<option1>
	var td9			= $('<td/>'		,{ id : 'schedule_term' ,name : 'schedule_term' , colspan :'2'});	// 시간/주기<option2>
	var td10		= $('<td/>'		,{align:"right"});																		// 후처리
	var td11		= $('<td/>'		,{ text : lang_return("fixa.scheduling.title010")	});				// 후처리
	var td12		= $('<td/>'		,{ text : lang_return("fixa.scheduling.title011")	});				// 후크롤링
	var td13		= $('<td/>');																		// 필드
	var td14		= $('<td/>');																		// pre/app
	var td15		= $('<td/>');																		// 그뒤에
	var td16		= $('<td/>');																		// 신규생성필드
	var td17		= $('<td/>'		,{ colspan :'2'});													// 수집url->파싱
	
	var input1		= $('<input/>'	,{ id : 'schedule_title' ,name : 'schedule_title' ,type : 'text' ,'data-format' : 'none' ,value : ''  });  		  // 타이틀
	var input2		= $('<input/>'	,{ id : 'schedule_url' ,name : 'schedule_url' ,type : 'text' ,'data-format' : 'none' ,value : ''  });			  // 수집URL
	var input3		= $('<input/>'	,{ id : 'scheduling_time2' ,name : 'scheduling_time2' , type : 'time' , 'display':'none'});						  // 수집주기->시간설정
	var input4		= $('<input/>'	,{ id : 'schedule_checkbox' ,name : 'schedule_checkbox' , type : 'checkbox' , value:''  }).on('click',function(){ // 체크박스
		let chk = $('input:checkbox[id="schedule_checkbox"]').is(":checked");
			if( $("#schedule_url").val()=="" || Options.jsonPathData.length<=0)
			{
				$('input:checkbox[id="schedule_checkbox"]').prop("checked", false);
				alert_message(lang_return("fixa.scheduling.title021"));
			}
			else if(chk==true)
			{
				$("#schedule_field").attr("disabled", false);
	        	$("#schedule_preappend").attr("disabled", false);
	        	$("#schedule_prinput").attr("disabled", false);
	        	$("#schedule_newinput").attr("disabled", false);
	        }else{
	        	$("#schedule_field").attr("disabled",true);
				$("#schedule_preappend").attr("disabled",true);
				$("#schedule_prinput").attr("disabled",true);
				$("#schedule_newinput").attr("disabled", true);
	        }
		});
	
	var input5		= $('<input/>'	,{ id : 'schedule_prinput' ,name : 'schedule_prinput' , type : 'text' , value:'', disabled: "disabled", "data-format":"none"});	// preappend
	var input6		= $('<input/>'	,{ id : 'schedule_newinput' ,name : 'schedule_newinput' , type : 'text' , value:'', disabled: "disabled", "data-format":"none","style":"display:none"});		// 신규생성필드

	var select1  	= $('<select/>'	,{ id : 'schedule_type' ,name : 'schedule_type'	,"style":"display:none"});																	// 수집방법
	var select2		= $('<select/>' ,{id:"schedule_term_type" ,name:"schedule_term_type"}).on('change',function(){Core.scheduling.Time();	});						// 수집주기
	var select3		= $('<select/>' ,{id:"scheduling_term2" ,name:"scheduling_term2"});																	// 수집주기->주기설정시
	var select4		= $('<select/>' ,{id:"schedule_field" ,name:"schedule_field",disabled: "disabled"}).on('change',function(){
		$("#schedule_newinput").val($(this).val()+"_craw");
	});												// field
	
	var select5		= $('<select/>' ,{id:"schedule_preappend" ,name:"schedule_preappend",disabled: "disabled"}).on('change',function (){				// preappend
		let x = $("#schedule_preappend option:selected").val();
			if(x == 0){ 																																	// preappend자동생성
				$("#schedule_prinput").val("");
			}else if(x== 1){
				$("#schedule_prinput").val("");
			}
	});
	
	var option1	= $i('<option/>' ,{ value : "0" ,text : "REST API", selected:true });		// 시간
	var option2	= $i('<option/>' ,{ id:'scheduling_time1',name:'scheduling_time1',value : "0" ,text : lang_return("fixa.scheduling.title008") });		// 시간
	var option3	= $i('<option/>' ,{ id:'scheduling_term1',name:'scheduling_term1',value : "1" ,text : lang_return("fixa.scheduling.title009") });		// 주기
	var option4	= $i('<option/>' ,{ value : "0" ,text : lang_return("fixa.scheduling.title012") });		// field
	var option5	= $i('<option/>' ,{ value : "1" ,text : lang_return("fixa.scheduling.title013") });		// cw
	var option6	= $i('<option/>' ,{ value : "0" ,text : lang_return("fixa.scheduling.title014") });		// preappend
	var option7	= $i('<option/>' ,{ value : "1" ,text : lang_return("fixa.scheduling.title015") });		// append
		
	for(var i=0; i<24; i++ ){
		var optionx = $i('<option/>' ,{ value : i ,text : i+lang_return("fixa.scheduling.title008")  });  
		select3.append(optionx);
	}
	
	
	var btn1		= $('<a/>',{ id:'parse_btn',class : '_btn' ,href : '#' ,text  : lang_return("fixa.scheduling.title020")}).on('click' ,function(){		     
		
		
		if(Options.status.schedule_btn==true){
			//validation체크 -> 버튼 중복 실행했을경우//
			alert_message(lang_return("fixa.scheduling.title022"));
			return false;
		}else
		{
			//파싱 시-> url형식 validation 체크 
			var urlCheck = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);
			
			if($("#schedule_url").val()!=""){
				if(urlCheck.test($("#schedule_url").val())){
					Core.scheduling.url();
				}else{
					alert_message(lang_return("fixa.scheduling.title023"));
					return false;
					
				}
			}else{
				alert_message(lang_return("fixa.scheduling.title024"));
				return false;
			}
		}
	});
	
	var tr1			=$('<tr/>').append(td1).append(td2.append(input1));
	var tr2			=$('<tr/>').append(td3).append(td4.append(input2)).append(td17.append(btn1));
	var tr3			=$('<tr/>',{"style":"display:none"}).append(td5).append(td6.append(select1.append(option1)));
	var tr4			=$('<tr/>').append(td7).append(td8.append(select2.append(option2).append(option3))).append(td9.append(input3).append(select3));
	var tr5			=$('<tr/>',{id : 'schedule_after', name : 'schedule_after'}).append(td10.append(input4)).append(td11).append(td12).append(td13.append(select4.append(option4).append(option5))).append(td14.append(select5.append(option6).append(option7))).append(td15.append(input5)).append(td16.append(input6));		
	
	var table =$('<table/>').append(tr1).append(tr2).append(tr3).append(tr4).append(tr5);
	var form = $('<form/>').append(table);
	
	elContent.html(form);

	var elButtonOk	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title035")// '저장'
	,	href	: '#'
	}).on('click' ,function() {
	
		// validation체크 -> 타이틀 or url 값이 없을 경우
		if($("#schedule_title").val()=="" || $("#schedule_url").val()=="" )
		{
			alert_message(lang_return("fixa.scheduling.title025"));
			return false;
		}
		
		// validation체크 -> 수집주기 값이 없을 경우
		if(($("#schedule_term_type").val()=="0" && $("#scheduling_time2").val()=="") 
				|| $("#schedule_term_type").val()=="1" && $("#scheduling_term2").val()==""){
			
			alert_message(lang_return("fixa.scheduling.title026"));
			return false;
		}
		// validation체크 -> 후처리 값이 없을 경우
		if($('input:checkbox[id="schedule_checkbox"]').is(":checked")==true && $("#schedule_newinput").val()=="")
		{
			alert_message(lang_return("fixa.scheduling.title027"));
			return false;
		}

		Core.scheduling.save();
		Core.Console.Write( { Type : 'Success' ,KeyCode : 'Succ1301' ,Message :'' } );
		return false;
		
	} );

	var elButtonCancle	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title059")// '닫기'
	,	href	: '#'
	}).on('click' ,function() {
		Core.Modal.Close();
		return false;
	} );
	var elButtonBox	= $i('<div/>' ,{
		class	: 'itmButton'
	})
	.append(elButtonCancle).append(elButtonOk);
	
	elTitle.append($("<div/>",{"class":"tab_btn_left"}));
	elTitle.append($("<a/>",{"text":lang_return("fixa.scheduling.title001")}));
	elTitle.append($("<div/>",{"class":"tab_btn_right"}));
	
	elContainer.append(elTitle).append(Core.tabbar4()).append(elContent).append(elButtonBox);
	objModal.html(elContainer);
	Options.Element.Global.Inni.El().append(objModal);
	Options.Element.Scheduling.SaveForm.El().SetForm();
	Core.scheduling.Time();

};

// 스케줄링 화면(추가눌렀을때나오는화면) ->저장
Core.scheduling.save = function(){
	var data =Options.Element.Scheduling.SaveForm.El().serializeObject(); 
	
	data.schedule_title  = $("#schedule_title").val();
	data.schedule_url  = encodeURIComponent($("#schedule_url").val());
	
	data.schedule_path = Options.jsonPathData;
	console.log("data.schedule_path",data.schedule_path)//path내용물 확인하기 위해서
	
	data.schedule_type  = $("#schedule_type").val();
	
	let term_type = $('#schedule_term_type').val();
	if(term_type ==0){
		data.schedule_term_type  = $('#scheduling_time1').val(); 
	}else if(term_type==1){
		data.schedule_term_type = $('#scheduling_term1').val(); 
	}
	
	let term = $("#schedule_term_type option:selected").val();
		if(term == 0){
			data.schedule_term  = $("#scheduling_time2").val();
		}else if(term == 1){
			data.schedule_term = $("#scheduling_term2 option:selected").val();
		}
		
	var after = new Object();
	
		if($("input:checkbox[name=schedule_checkbox]").is(":checked") == true) {
		  // 작업
			after.schedule_checkbox = "1";
		}else{
			after.schedule_checkbox = "0";
		}
		after.schedule_field =$("#schedule_field").val();
		after.schedule_preappend =$("#schedule_preappend").val();
		after.schedule_prinput =$("#schedule_prinput").val();
		after.schedule_newinput =$("#schedule_newinput").val();
	var jsonData = JSON.stringify(after);
	
	data.schedule_after  = jsonData;
	data.schedule_active = $("#schedule_active").val();
	
	loadingBar();
	$.ajax({
	type:"GET",
	url:"/collect/scheduleAdd.fd",
	data:data,
	dataType:"json",
	success:function(data){
		// 값은 전부들어있으나, 파싱이 실행되지 않았을 경우
		if(Options.jsonPathData==""){
			alert_message(lang_return("fixa.scheduling.title028"));
			return false;
		}
		loadingprogresshide();
		location.href  = "/collect/datainput.fd?type=scheduling";
	}
	});
	
};

// 수집URL 추가 클릭시 팝업창
Core.scheduling.jsonSearch= function(obj, par)
{
	// 루트 변수값은 $.을 기본으로 변수 초기화
	var root = "$.";
	
    var returnObject = new Object();
    // 넘겨받은 par값이 널이거나 값이 없다면
	if(par==null || par==undefined || par == "")
	{
	// $.으로 초기화
	root =  root;
	}else if(par != ""){
	// 념겨받은 변수에 값이 있다면 root값을 넘겨받은 값에 .을 추가
	root =  par+".";
	}
   
	// json 리스트 형태를 체크
    check = isJsonArray(obj);

   // 결과 같이 true일경우
   if(check==true){
	    // ul문서 객체 생성(리스트)
        var list_ul = $("<ul/>",{class:"list"});
        // path를 생성하기 위한 변수 할당
        var list = "[*].";
        // obj갯수만큼 반복
        $.each(obj, function(k, item){
        // object에서 키값을 뽑아 배열화
        var key = Object.keys(item);
        // ul문서 객체 생성(object)
        var ul_object = $("<ul/>",{class:"object"});
        
        // 키값을 뽑아내여 키의 갯수만큼 수행
         for(var i=0;i<key.length;i++)
         {
        	 
            if(i==0){
                    sep = ""
			}else{
                    sep = ",";
            }
            if(typeof item[key[i]]=="string"){
            	var fullpath = root + list  + key[i];
            	var path = fullpath;
                ul_object.append($("<li/>",{"text":""+"\t"+sep+key[i]+" : \""+item[key[i]]+"\"","key":key[i], "path":path,"id":key[i],"onclick":"Core.scheduling.confirm($(this).attr('path'),$(this).attr('id'))"}));

			}else if(typeof item[key[i]]=="number"){
				var fullpath = root + list + key[i];
            	var path = fullpath;
                temp = "\t"+sep+key[i]+" : "+item[key[i]];
                ul_object.append($("<li/>",{"text":temp,"key":key[i] , "path":path ,"id":key[i],"onclick":"Core.scheduling.confirm($(this).attr('path'),$(this).attr('id'))"}));

			}else if(typeof(item[key[i]])=="object"){
				var fullpath = root + list  + key[i];
            	var path = fullpath;
                var title = key[i];
                var li = $("<li/>",{"path":path,"text":"\t"+sep+title+":", "key":key[i], "id":key[i]});
                var result = Core.scheduling.jsonSearch(item[key[i]],path);
                li.append($(result).wrap("<div/>").parent().html());

                ul_object.append(li); 
			}
            
         }
            list_ul.append(ul_object);
      });   
        returnObject = list_ul;
        
   }
   else
   {
        var key = Object.keys(obj);
        
        ul_object = $("<ul/>",{class:"object"});

        for(var i=0;i<key.length;i++)
        {
            if(i==0){
                sep = ""
            }
            else{
                sep = ",";
            }
            if(typeof obj[key[i]]=="string" )
            {
				var fullpath = root  + key[i];
            	var path = fullpath;
                ul_object.append($("<li/>",{"path":path,"text":"\t"+sep+key[i]+" : \""+obj[key[i]]+"\"","key": key[i],"id":key[i],"onclick":"Core.scheduling.confirm($(this).attr('path'),$(this).attr('id'))"}));
            }
            else if(typeof obj[key[i]]=="number")
            {
				var fullpath = root  + key[i];
            	var path = fullpath;
                ul_object.append($("<li/>",{"path":path,"text":"\t"+sep+key[i]+" : "+obj[key[i]]+"","key": key[i],"id":key[i],"onclick":"Core.scheduling.confirm($(this).attr('path'),$(this).attr('id'))"}));
            }
            else if(typeof(obj[key[i]])=="object")
            {
				var fullpath = root  + key[i];
            	var path = fullpath;
                var title = key[i];
                var li = $("<li/>",{"path":path,"text":"\t"+sep+title+":","key":key[i],"id":key[i]});
                var result = Core.scheduling.jsonSearch(obj[key[i]], path);
                li.append($(result).wrap("<div/>").parent().html());
                ul_object.append(li); 
            }
        }
        returnObject = ul_object;
   }
    return returnObject;
}
function isJsonArray(obj)
{
    try{
        if(obj.length==undefined)
        {
            return false;
        }
        else if(obj.length>=0){
            return true;
        }
    }catch(e){
        console.log("err");
      return true;
    }
}
Core.scheduling.url=function(){
	Options.status.schedule_btn = true;
	
	var data =new Object();
	data.url = $("#schedule_url").val();
	data.method = "get";
	
	var jsonData = JSON.stringify(data);
	var elJsonView 	=$i('<div/>',{
		class   : "content"
		,id		: "jsonView"
	});
	$.ajax({
		url: '/common/reqCollectRest.fd' 
	    ,contentType: 'application/json'
	    ,crossDomain:true
	    ,async: true
	    ,type: 'POST'
	    ,data: jsonData
	    ,dataType: 'json'
		,success:function(res) {
			
			
			var parseJson = JSON.parse(res.list);
			var par = "";
			var str = Core.scheduling.jsonSearch(parseJson, par);
			 
			elJsonView.html(str);
			
			var objModal		= Core.Modal.Background();
			var elContainer 	=$i('<div/>',{
				id		: Options.Element.Scheduling.parseForm.Id
			});
			
			var elTitle		= $i('<div/>' ,{
				class	: 'title'
			});
			var elContent	= $i('<div/>' ,{
				class	: 'content'
				,id     : 'btnlist'
				,style  : "overflow-y:auto; width:770px; min-height:50px;max-height:220px"
			});
			
			var td1 = $('<td/>');
			var btn1		= $('<a/>').on('click',function(){	Core.scheduling.json();	});
			var tr1 =$('<tr/>',{class:'addBtn'}).append(td1.append(btn1));
			
			var table =$('<table/>').append(tr1);
			elContent.html(table);
			
			var elButtonOk	= $i('<a/>' ,{
				class	: 'button'
			,	text	: lang_return("fixa.core.title079")// 'RUN'
			,	href	: '#'
			}).on('click' ,function() {
				Core.Console.Write( { Type : 'Success' ,KeyCode : 'Succ1301' ,Message :'' } );
				// 선택된 jsonpath,fieldname 전역변수에 json데이터로 저장되어 있는상태
				
				if($("#btnlist.content").find("input").length==0)
				{
					alert_message(lang_return("fixa.scheduling.title029")); 
				}
				else
				{
					
					$("#schedule_field option").remove();
					
					$("#btnlist").find("input[name*='json_field']").each(function(k,v){
						if(k==0)
						{
							$("#schedule_newinput").val($(this).val()+"_craw");
						}
						$("#schedule_field").append("<option value='"+$(this).val()+"'>"+$(this).val()+"</option>");
					});
					Core.scheduling.Data();
					$(this).parent().parent().parent().empty().remove();
					Options.status.schedule_btn = false;
				}					
			} );
			
			var elButtonCancle	= $i('<a/>' ,{
				class	: 'button'
			,	text	: lang_return("fixa.core.title059")// '닫기'
			,	href	: '#'
			}).on('click' ,function() {
				$(this).parent().parent().parent().empty().remove();
				Options.status.schedule_btn =false;
				
			} );
			var elButtonBox	= $i('<div/>' ,{
				class	: 'itmButton'
			}).append(elButtonCancle).append(elButtonOk);
			
			elTitle.append($("<div/>",{"class":"tab_btn_left"}));
			elTitle.append($("<a/>",{"text":lang_return("fixa.scheduling.title020")}));
			elTitle.append($("<div/>",{"class":"tab_btn_right"}));
			
			elContainer.append(elTitle).append(Core.tabbar4()).append(elJsonView).append(elContent).append(elButtonBox);
			objModal.html(elContainer);
			Options.Element.Global.Inni.El().append(objModal);
			Options.Element.Scheduling.SaveForm.El().SetForm();
		}
			,complete:function(){//로딩바 끝내고 멈추기
			loadingprogresshide();
	}
	});
};

// 추가된 jsonpath,fieldName 전역에 저장
Core.scheduling.Data = function(){
	// array배열 선언
	var jsonPathDataList = new Array();
	// 데이터를 담아줄 오브젝트 변수 널값으로 초기화
	var data = "";
	// 추가된 버튼의 갯수만큼 반복
	for(var i=0; i<$(".addBtn_new").length; i++){
		// 오브젝트 선언
		data = new Object();
		
		// jquery 선택자를 통한 각각의 jsonpath필드 id값 찾고 변수 할당
		var path_id = $(".addBtn_new").eq(i).children().eq(0).children('input').attr('id');
		
		// jquery 선택자를 통한 각각의 fieldName필드 id값 찾고 변수 할당
		var field_id = $(".addBtn_new").eq(i).children().eq(1).children('input').attr('id');
		
		// jsonpath의id값을 통하여 value값 찾아 변수 할당
		var recent_path = $("#"+path_id).val();
		// fieldName의id값을 통하여 value값 찾아 변수 할당
		var recent_field = $("#"+field_id).val();
		
		// data 오브젝트에 jsonPath키 값으로 데이터를 묶음
		data.jsonPath = recent_path;
		// data 오브젝트에 fieldName키 값으로 데이터를 묶음
		data.fieldName = recent_field;
		
		// 셋팅된 data오브젝트를 배열에 담음
		jsonPathDataList.push(data);
	}
	// 배열에 담긴 오브젝트를 json형태로 변형후 전역변수 Options.jsonPathData 할당
	Options.jsonPathData = JSON.stringify(jsonPathDataList);
	// 로그 확인
	console.log(Options.jsonPathData);
}

// json화면에서 컬럼 명칭 클릭시 승인 처리
Core.scheduling.confirm = function(jsonPath,fieldName){
	
	// 추가된 버튼이 없다면
	if($(".addBtn_new").length == 0){
		// 전역변수 초기화
		Options.selectedListPath = [];
	}
	// 파라미터로 넘겨받은 jsonPath값을 .을 기준으로 값을 배열화하여 데이터를 저장
	var comparePath = jsonPath.split(".");
	// 전역변수에 값이 할당되어 있지 않다면
	if(Options.selectedListPath.length == 0){
		// 넘겨받은 jsonPath에서 [*]의 형태의 문자열이 있다면
		if(jsonPath.match("[*]")){
			// 전역변수로 지정된 배열에 문자열을 담음
			Options.selectedListPath.push(jsonPath);
		}else{
			// 만약 [*]이 존재하지 않느다면 경고창후 되돌림
			alert_message(lang_return("fixa.scheduling.title032"));//리스트 항목의 path만 지정가능합니다.
			return false;
		}
	}
	// 전역변수에 저장된 값 (무조건 1개의 데이터만 취급)을 .을 기준으로 배열화 하여 변수 저장
	var beforeList = Options.selectedListPath[0].split(".");
	// 비교할변수 1
	var result = "";
	// 비교할변수 2
	var result2 = "";
	// 넘겨받아 저장한 배열의 길이 만큼 문자를 재조합
	for(var i=0; i<(comparePath.length-1); i++){
		result += comparePath[i];
	}
	// 전역으로부터 저장한 배열의 길이만큼 문자를 재조합
	for(var i=0; i<(beforeList.length-1); i++){
		result2 += beforeList[i];
	}
	// 변수1 과 변수2가 같지 않을경우
	if(result != result2){
		// 다른영역을 감지하고 경고창 호출후 되돌림
		alert_message(lang_return("fixa.scheduling.title033"));
		return false;
	}else{
		// 변수1 과 변수2가 같을경우 fileCnt를 0값으로 초기화
		var fileCnt = 0;
		// 넘겨받은 파라미터의 문자중 [*]이 존재하면 수행
		if(jsonPath.match("[*]")){
			// 버튼이 생성된 길이 만큼 수행(같은 필드가 있는지 여부를 확인하기위함)
			for(var i=0; i<$(".addBtn_new").length; i++){
				// 선택자를 통하여 id값을 찾음
				var field_id = $(".addBtn_new").eq(i).children().eq(1).children('input').attr('id');
				// id값을 통해 필드값을 가져옴
				var recent_field = $("#"+field_id).val();
				// 정제된 필드값이 념겨받은 값과 같을때
				if(fieldName == recent_field){
					// fileCnt 값 1씩 증분
					fileCnt++;
				}
			}
			// fileCnt값이 0이면
			if(fileCnt == 0){
				// 버튼 추가 기능을 수행
				Core.scheduling.json(jsonPath,fieldName);
			}else{
				// 동일한 값을 감지하고 return false
				alert_message(lang_return("fixa.scheduling.title034"))
			}
		// 넘겨받은 파라미터의 문자중 [*] 존재하지 않는다면
		}else{
			// 리스트만을 선택하도록 경고창 호출
			alert(lang_return("fixa.scheduling.title035"));
			
		}
	}
}

// Json Path추가 버튼 누를시 발생하는 함수
Core.scheduling.json=function(jsonPath,fieldName){
	
// Options.createdFieldName.push(fieldName);
	var cnt = parseInt($("a#btn_remove._btn").length) + 1;
	var length = $(".addBtn").length-1;

	var td_new1			= $('<td/>');// Path
	var td_new2			= $('<td/>');// field
	var td_new3			= $('<td/>');// button
	
	var path = 'json_path' + cnt ;
	var field = 'json_field' + cnt;

	var input_new1		= $('<input/>'	,{ id : path  ,name : path  ,type : 'text' });
	var input_new2	= $('<input/>'	,{ id : field  ,name : field  ,type : 'text' });
	
	var bttn = $('<a/>',{ class : '_btn' ,id:'btn_remove',href : '#' ,text  : lang_return("fixa.core.title050")}).on('click' ,function(){ Core.scheduling.del(path);	});
	
	var tr_new1			=$('<tr/>',{class:"addBtn_new"}).append(td_new1.append(input_new1)).append(td_new2.append(input_new2)).append(td_new3.append(bttn));
	
	$(".addBtn:eq("+length +")").after(tr_new1);
	
	$("#"+path).val(jsonPath);
	$("#"+field).val(fieldName);
	
};

// Json Path삭제 버튼 누를시 발생하는 함수
Core.scheduling.del = function(path){
	if($(".addBtn_new").length != 0){
		 $("#"+path+"").parent().parent().remove();
	}
	
};

// 수집주기 부분에서 화면 display관리
Core.scheduling.Time=function(){
	let y = $("#schedule_term_type").val();
	if(y==0){
		$("#scheduling_time2").css("display","");
		$("#scheduling_term2").css("display","none");
	}else if(y==1){
		$("#scheduling_time2").css("display","none");
		$("#scheduling_term2").css("display","");
	}
};


Core.Project.Next = function() {
	$.ajax({
	    url: '/collect/importNext.fd' 
	    ,async: false
	    ,type: 'post'
	    ,dataType: 'json'
	    ,success: function(data) {
// console.log("data",data);
			var html = "";
// var obj = "";
			for(i=0;i<data.result.length;i++){
				html += "<li><p style='color:545454' onclick='Core.Project.Next("+data.result[i]+");'>"+data.result[i]+"</p></li>";
				
// if(data.result[i].flag==1)
// {
// var param = new Object();
// param.project_sn = data.result[i]['project_sn'];
// $.ajax({
// url: '/collect/projectDataVersionCheck.fd'
// ,async: false
// ,type: 'post'
// ,data : param
// ,success: function(data2) {
// if(data2.resultCnt != 0){
// }
// }
// });
				}
// }
			$("#collect_import_data").append(html);
	    }
	});
}

// 프로젝트 목록 2depth 목록 조회 (2019.08.13) 신규생성
Core.Project.DataList = function(sn) {
	$("#dataList_"+sn+"").focus();
	var param = "project_sn="+sn;
	if($("#dataList_"+sn+"").attr("class") == "active"){
		if($("#ul_dataList_"+sn+"").css('display') == "none"){
			$("#ul_dataList_"+sn+"").css('display', '');
		}else{
			$("#ul_dataList_"+sn+"").css('display', 'none');
		}
		return;
	}else{
		$.ajax({
		    url: '/collect/projectDataVersionList.fd' 
		    ,async: false
		    ,type: 'post'
		    ,data : param
		    ,success: function(data) {
		    	var dataList = "<ul id='ul_dataList_"+sn+"'>";
				for(i=0;i<data.result.length;i++)
				{
					
					if(data.result[i]['step']=="P")
					{
						dataList +="<li><p id='p_"+data.result[i]['project_data_sn']+"' style='color:545454' onmouseout='Core.Project.Mouseout("+data.result[i]['project_data_sn']+");' onmouseover='Core.Project.Mouseover("+data.result[i]['project_data_sn']+");' onclick='Core.Project.click("+data.result[i]['project_sn']+","+data.result[i]['project_data_sn']+");' ondblclick='Core.Project.DataLinkPage("+data.result[i]['project_sn']+","+data.result[i]['project_data_sn']+");'>"+lang_return("fixa.core.title017")+"("+data.result[i]['data_version']+")</p></li>";// 전처리
																																																																																																																																												// 완료데이터
					}
					else if(data.result[i]['step'] =="C")
					{
						dataList +="<li><p id='p_"+data.result[i]['project_data_sn']+"' style='color:545454' onmouseout='Core.Project.Mouseout("+data.result[i]['project_data_sn']+");' onmouseover='Core.Project.Mouseover("+data.result[i]['project_data_sn']+");' onclick='Core.Project.click("+data.result[i]['project_sn']+","+data.result[i]['project_data_sn']+");'  ondblclick='Core.Project.DataLinkPage("+data.result[i]['project_sn']+","+data.result[i]['project_data_sn']+");'>"+lang_return("fixa.core.title018")+"("+data.result[i]['data_version']+")<p></li>";// 수집데이터
					}
				}
				dataList += "</ul>";
				$("#dataList_"+sn+"").append(dataList);
				$("#dataList_"+sn+"").attr("class","active");
		    }
		});
	}
};

// 프로젝트 목록 클릭시 글씨 색 전환 및 열기 값 세팅
Core.Project.click = function(sn,data_sn){
	
	if(beforeKey != ""){
		$("#p_"+beforeKey+"").removeAttr("class");
		$("#p_"+beforeKey+"").css("color","#888");
	}
	$("#p_"+data_sn+"").attr("class","active");
	$("#p_"+data_sn+"").css("color","red");
	project_data_sn = data_sn;
	project_sn = sn;
	beforeKey = data_sn;
}
// 프로젝트 목록 마우스 아웃시 회색계열 글씨색 변경
Core.Project.Mouseout = function(data_sn){
	if($("#p_"+data_sn+"").attr("class")=="active"){
	}else{
		$("#p_"+data_sn+"").css("color","#888");
	}
}
// 프로젝트 목록 마우스 오버시 빨강색 글자색 변경
Core.Project.Mouseover = function(data_sn){
	$("#p_"+data_sn+"").css("color","red");
}
// 프로젝트 목록 2depth 클릭시 전처리 리스트 목록 화면 이동 (2019.08.13) 신규생성
Core.Project.DataLinkPage = function(sn,data_sn) {
		
	var param = new Object();
	param.project_sn = sn;
	param.project_data_sn = data_sn;
		$.ajax({
		    url: '/collect/setProjectAndDataSn.fd' 
		    ,async: false
		    ,type: 'post'
		    ,data : param
		    ,success: function(data) {
				
				if(data.result=="success")
				{
					location.href  = "/prep/prep.fd";
				}
				else
				{
					
					alert(lang_return("fixa.core.title019"));
					
					return;
				}
				
		    }
		
		});
};
// 프로젝트 열기 화면에 표출 되는 프로젝트 목록 HTML Element 생성
Core.Project.List = function() {
	var options = {
		url			: Options.Uri.Ajax.Project.List
	,	success		: function( d ) {
			var data = d.list;
			for ( var fx=0; fx<data.length; ++fx ) {
				var li	= $i('<li/>' ,{});
				var a	= $i('<a/>' ,{
					class			: 'lst'
				,	text			: data[fx].PRJCT_NM
				,	'data-index'	: data[fx].PRJCT_SN
				,	'data-table'	: data[fx].TEMP_TABLE_NM
				,	'data-header'	: data[fx].TEMP_TABLE_HEADER
				,	'data-key'		: data[fx].TEMP_TABLE_HEADER_KEY
				,	href			: '#'
				}).on( 'click' ,function(e) {
					$i(this).parent().parent().find('li').removeClass('select').end().end().addClass('select');
					return false;
				} );
				$i('#' + Options.Element.Project.Open.Id + ' .list').append(li.html(a));
			};
		}
	,	error	: function( response ,status ,error ) { Core.Console.Write( { Type : 'Error' ,KeyCode : 'Errr1002' ,Message : ' (' + error + ')' } ); }
	};$i.Ajax(options);
};

// 프로젝트 열기 화면에서 목록을 선택 후 열기 버튼을 클릭 하였을 때 발생하는 이벤트
Core.Project.Open = function() {
	var objOpen		= $i('#' + Options.Element.Project.Open.Id + ' .list li.select a');
	var prjctIdx	= objOpen.attr('data-index');
	var tableNm		= objOpen.attr("data-table");
	var optionsAjax	= {
		url			: Options.Uri.Ajax.Project.Open
	,	data		: { SESSION_PROJECT_SN : prjctIdx }
	,	success		: function( d ,e ) {
			window.location.href = Options.Uri.Url.Process;
		}
	,	error		: function( response ,status ,error ) { Core.Console.Write( { Type : 'Error' ,KeyCode : 'Errr1002' ,Message : ' (' + error + ')' } ); }
	,	beforeSend	: Core.Modal.Loading
	,	complete	: Core.Modal.LoadingClose
	};$i.Ajax(optionsAjax);
};
// 프로젝트 열기 화면에서 목록을 선택 후 열기 버튼을 클릭 하였을 때 발생하는 이벤트
Core.Project.Open2 = function() {
	var param = new Object();
	param.project_data_sn = project_data_sn;
	param.project_sn = project_sn;
	$.ajax({
	    url: '/collect/setProjectAndDataSn.fd' 
	    ,async: false
	    ,type: 'post'
	    ,data : param
	    ,success: function(data) {
// alert(JSON.stringify(data));
			
			if(data.result=="success")
			{
				location.href  = "/prep/prep.fd";
			}
			else
			{
				alert(lang_return("fixa.core.title019"));// "저리 진행중 오류 발생");
				
				return;
			}
			
	    }
	
	});
};

Core.Project.New = function() {
	var optionsAjax = {
		url		: Options.Uri.Ajax.Project.New
	,	data	: {}
	,	success	: function( d ,e ) {
			$i.extend(Options.Variable.Global ,{
				PROJECT_SN			: ''
			,	PROJECT_NAME		: ''
			,	FILE_NAME			: ''
			,	SheetClick			: true
			,	SheetClickOutput	: true
			});
			window.location.href = Options.Uri.Url.DataInput;
		}
	};$i.Ajax(optionsAjax);
};


Core.Grid = {};

// 데이터 전처리 그리드 생성
Core.Grid.Create = function() {
	var optionsAjax = {
		url		: Options.Uri.Ajax.Process.DataList
	,	success	: function( d ,e ) {Core.Grid.Setting( d ,e );}
	,	error	: function( response ,status ,error ) { Core.Console.Write( { Type : 'Error' ,KeyCode : 'Errr1002' ,Message : ' (' + error + ')' } ); }
	};$i.Ajax(optionsAjax);
};

// 그리드 히스토리 초기 생성
Core.Project.DiagramHistory = function( d1 ,d2 ) {
	var historyGlobal	= JSON.parse(d1);
	var historyDiagram	= ('[]'==d2) ? [] : JSON.parse(d2).Rule;
		historyDiagram	= (1>historyDiagram.length) ? [] : historyDiagram[historyDiagram.length - 1];

	Options.Variable.Temp['Global']	= historyGlobal;
	Options.Variable.Temp['Cells']	= historyDiagram;
};

// 그리드 내용 및 컨트롤 화면 표출 처리
Core.Grid.Setting = function( d ,e ) {
	Core.Project.DiagramHistory( d.HISTORY_GLOBAL ,d.HISTORY_DIAGRAM );

	$i.extend( Options.Variable.Global ,{
		PROJECT_SN		: d.PROJECT_SN
	,	PROJECT_NAME	: d.PROJECT_NAME
	,	FILE_NAME		: d.FILE_NAME
	} );

	if ( !$i.ChkBlank(d.PROJECT_SN) ) {
		$i('#' + Options.Element.Process.Sheet.Id + '>.item>a').eq(1).removeClass('lock');
	};

	var elGridTable			= Options.Element.Process.GridTable.El();
	var ajaxResult			= d.Result;
	var TABLE_HEADER		= d.TABLE_HEADER;
	var TABLE_HEADER_KEY	= d.TABLE_HEADER_KEY;
	var TABLE_HEADER_COUNT	= d.TABLE_HEADER_COUNT;
	var listData			= d.ListData;

	var exlHeaderNames		= TABLE_HEADER.split(',');
	var exlHeaderKeys		= TABLE_HEADER_KEY.split(',');
	var gridColumn			= [];
	var gridColumnModel		= [];

	if ( elGridTable.length<1 ) { $i('#' + Options.Element.Global.Content + ' .grid').html( $i('<table/>' ,{ id : Options.Element.Process.GridTable.Id ,cellpadding : '0' ,cellspacing : '0' }) ); };

	for ( var fx=0; fx<TABLE_HEADER_COUNT; ++fx ) {
		var model = {
			name		: exlHeaderKeys[fx]
		,	index		: exlHeaderKeys[fx]
		,	align		: 'center'
		,	editable	: true
		};
		if ( fx==0 ) {
			model = $i.extend({
				editable	: false
			,	key			: true
			,	width		: '50px'
			} ,model);
		};
		gridColumn.push(exlHeaderNames[fx]);
		gridColumnModel.push(model);
	};
	var jqOptions	= {
		datatype	: 'local'
	,	colNames	: gridColumn
	,	colModel	: gridColumnModel
	,	data		: listData
	,	height		: 'calc(100% - 32px)'
	,	width		: null
	,	shrinkToFit	: false
	,	scroll		: 1
	,	cellEdit	: true
	,	rowNum		: 40
	,	editurl		: 'clientArray'
	,	cellsubmit	: 'clientArray'
	,	gridview	: true
	,	forceFit	: true
	,	shrinkToFit	: false
	,   afterEditCell: function(rowid ,cellname ,value ,iRow ,iCol){	// jqGrid
																		// cellEditable
																		// complete
			var elTarget	= $("#" + rowid + "_" + cellname);
			elTarget.on('keydown blur' ,function( e ){
				if ( e.keyCode==13 || e.type == 'blur' ) {
					Options.Element.Process.GridTable.El().jqGrid("saveCell", iRow, iCol);
					if ( elTarget.val() != value ) {
						Core.History.Add( { Type : 'grid' ,InputId : rowid + '_' + cellname ,RowId : rowid ,CellName : cellname ,IRow : iRow ,ICol : iCol ,Value : elTarget.val() ,ValueBef : value } );
					};
				};
			});
		}
	};
	elGridTable.jqGrid( jqOptions );
	var dataName = ( $i.ChkBlank(d.PROJECT_SN) ) ? d.FILE_NAME : d.PROJECT_NAME;
	Core.Console.Write( { Type : 'Info' ,KeyCode : 'Mssg1301' ,Message : lang_return("fixa.core.title020")+'' + dataName + ')' } );// (프로젝트(파일)
																																	// 명칭:
	Options.Element.Global.ProjectName.El().html(dataName);
	
	
	// 프로젝트 명칭
	// $i('#historyProjectName').text(dataName);
	// $('#historyProjectName').text(projectNm);
	// SCORE
	$i('#score').html(d.SCORE_DATA);
};



Core.Drag = {};

// 룰(Rule) 아이콘 드래그 생성
Core.Drag.Create = function( dropFunction ) {
	$i('#' + Options.Element.Diagram.RuleItem.Id + ' .item').draggable({
		revert		: true
	,	stack		: '#' + Options.Element.Diagram.RuleItem.Id + ' .item'
	,	start	: function( event ,ui ) {
			var elWrapper		= $i('#' + Options.Element.Diagram.RuleItem.Id + ' .wrapper');
			var item			= $i('#' + Options.Element.Diagram.RuleItem.Id + ' .item');
			var widthWrapper	= parseInt(elWrapper.width());
			for ( var fx=0; fx<item.length; ++fx ) {
				var tmpElItem		= item.eq(fx);
				var tmpElItemPos	= parseInt(tmpElItem.css('left').replace('px' ,''));
				if ( widthWrapper<(tmpElItemPos + 10) || 0>=(tmpElItemPos + 10) ) {
					tmpElItem.addClass('hide');
				};
			};
			elWrapper.css('overflow' ,'visible');
		}
	,	stop	: function( event ,ui ) {
			var elWrapper		= $i('#' + Options.Element.Diagram.RuleItem.Id + ' .wrapper');
			var item			= $i('#' + Options.Element.Diagram.RuleItem.Id + ' .item');
			var widthWrapper	= parseInt(elWrapper.width());
			for ( var fx=0; fx<item.length; ++fx ) {
				var tmpElItem		= item.eq(fx);
				var tmpElItemPos	= parseInt(tmpElItem.css('left').replace('px' ,''));
				if ( widthWrapper>=(tmpElItemPos + 105) || 0<=(tmpElItemPos - 105) ) {
					tmpElItem.removeClass('hide');
				};
			};
			elWrapper.css('overflow' ,'hidden');
		}
	});
	Options.Element.Diagram.Canvas.El().droppable({
		accept	: '#' + Options.Element.Diagram.RuleItem.Id + ' .item'
	,	drop	: function( event ,ui ) {
// console.log("Options.Element.Diagram.Canvas.El()", ui);
			var type	= $i(ui.draggable).attr('data-type');
			var rule_gb	= $i(ui.draggable).attr('rule_gb');
			var data_rule_cont	= $i(ui.draggable).attr('data_rule_cont');
			if(rule_gb == "100"){
				Options.template_modelId = [];
				var templateInfo = JSON.parse(data_rule_cont);
				var element = $i(ui.draggable);
				
				for(var i=0; i<templateInfo.length; i++){
					$i(ui.draggable).attr('data-type',templateInfo[i].data_type);
					$i(ui.draggable).attr('data-rule',templateInfo[i].data_rule);
					$i(ui.draggable).attr('data-text',templateInfo[i].data_name);
					$i(ui.draggable).attr('data-icon',templateInfo[i].data_icon);
					$i(ui.draggable).attr('data-rule-opt',templateInfo[i].data_rule_opt);
					Core.Diagram.Add( ui );
					
				}
				Options.template_x = 0;
				Core.Diagram.TemplateSetData(templateInfo);
			}else{
				var check	= Core.Drag.Check( ui ,type );
				if ( check ) {
					Core.Diagram.Add( ui );
				} else {
					return;
				};
			}
		}
	});
};

// 드래그 시 데이터 처리
Core.Drag.Check = function( ui ,ruleType ) {
	var global			= Options.Variable.Diagram.Global;
	var keys			= Object.keys(global);
	var lastRule		= global[keys[keys.length-1]];
	var lastRuleType	= parseInt(lastRule.Type);
	var ruleType		= parseInt(ruleType);
	var result			= false;
	
// console.log("lastRuleType",lastRuleType);
// console.log("ruleType",ruleType);
	
	
	if ( 9==lastRuleType && (1!=ruleType && 20!=ruleType && 30!=ruleType && 40!=ruleType&& 50!=ruleType && 60!=ruleType&& 70!=ruleType ) ) {
		Core.Console.Write( { Type : 'Error' ,KeyCode : 'Errr1505' ,Message : '' } );
	// } else if ( 3==lastRuleType && 4!=ruleType ) {
	} else if ( 3==lastRuleType) {
		Core.Console.Write( { Type : 'Error' ,KeyCode : 'Errr1501' ,Message : '' } );
	} else if ( 5==lastRuleType ) {
		Core.Console.Write( { Type : 'Error' ,KeyCode : 'Errr1507' ,Message : '' } );
	}else if(lastRuleType == 80){ 
//			Core.Console.Write( { Type : 'Error' ,KeyCode : 'Errr1507' ,Message : '' } );
		alert(lang_return("fixa.core.title225"));//클라우드 워드 통계 다이어그램 뒤에는 룰(Rule)을 등록할 수 없습니다.
	}else{
			result = true;
	};

	return result;
};

// 전처리 기능
Core.Prep = {};
/**
 * obj의 key변경
 */
Core.Prep.keymodify = function (obj, oldKey, newKey) {
	
	if(oldKey !=newKey)
	{
		obj[newKey] = obj[oldKey];
// delete obj[oldKey];
	}
	return obj;
}
/**
 * Prep 전처리 히스토리 추가
 */
Core.Prep.HistoryAdd = function(item , column ,editCommand , count , commandQueue){
	
	console.log(column);
	
	var before_Data = editCommand.prevSerializedValue;
	var after_Data  = editCommand.serializedValue;
	var elHistory ,a;
	elHistory = Options.Element.Diagram.HistoryGrid.El();
	
	var indexItemMax	= elHistory.find('a.item').length - 1;
	var indexItemNow	= elHistory.find('a.now').parent().index();
	if ( indexItemNow < indexItemMax ) {
		var itemLi = elHistory.find('li');
		if(elHistory.find('li').eq(indexItemNow).find('a').attr("data-block-chained")!="true"){
			for ( var fx=itemLi.length; fx>indexItemNow; --fx ) {
				itemLi.eq(fx).empty().remove();
			};
		}
	};
	
	// 현제 히스토리 갯수
	var id = $("#itmHistoryGrid li").find('a.item').length;
	
	// id인자값으로 json데이터 생성 함수 호출 및 처리(로컬의 특정 지정폴더)
	Core.Prep.jsonWrite(id);
	
	elHistory.find('a').removeClass('now').end();
	
	column_name = "";
	if(column!=undefined)
	{
		column_name = column.name;
	}
	

	//yyyy-mm-dd hh:mm:dd
	var date = new Date();
	var dateStr = date.getFullYear() + "-" +("00" + (date.getMonth() + 1)).slice(-2) + "-" +("00" + date.getDate()).slice(-2) + " " +("00" + date.getHours()).slice(-2) + ":" +("00" + date.getMinutes()).slice(-2) + ":" +("00" + date.getSeconds()).slice(-2);
	
	
	
	a = $i('<a/>' ,{
		href				: '#'
	,	text				: lang_return("fixa.core.title021")+' (Rows : ' + editCommand.row + ', Cols : ' + editCommand.cell +" //"+before_Data + " → "+after_Data+')' //
	,	class				: 'item u now'
	,	id					: (parseInt(id)) +''
	,	title				: before_Data + '→' + after_Data
	,   'data-block-chained': false
	,	'data-value-cloumn'	: column_name
	,	'data-value-before'	: before_Data
	,	'data-value-after'	: after_Data
	,	'data-index-row'	: editCommand.row
	,	'data-index-col'	: editCommand.cell
	,	'data-index'		: count
	,   'mac-address'       : $("#mac_address").val()
	,   'create-date'		: dateStr
	}).on( 'click' ,function(e) { Core.Prep.HistoryClick(this); } );
	
	
	var li	= $i('<li/>').html(a);
	
	elHistory.append(li);
	$("#itmHistory").scrollTop($(document).height());
	
};
Core.Prep.BlockChainHistoryAdd = function(mac_address,text,data_value_column,title,data_value_before,data_value_after,data_index_col,data_index,create_date){
	
	
	var before_Data = data_value_before;
	var after_Data  = data_value_after;
	var elHistory ,a;
	elHistory = Options.Element.Diagram.HistoryGrid.El();
	
	var indexItemMax	= elHistory.find('a.item').length - 1;
	var indexItemNow	= elHistory.find('a.now').parent().index();
	
	//현재에 선택된 히스토리 가 최대값보다 작다면
	if ( indexItemNow < indexItemMax ) {
		var itemLi = elHistory.find('li');
		//만약 현재에 선택된 히스토리 목록에서 data-block-chained 속성이 true일경우가 아니라면  수행
		if(elHistory.find('li').eq(indexItemNow).find('a').attr("data-block-chained")!="true"){
			//히스토리 목록을 뒤로부터 다 지워준다
			for ( var fx=itemLi.length; fx>indexItemNow; --fx ) {
				itemLi.eq(fx).empty().remove();
			};
		}
	};
	
	// 현제 히스토리 갯수
	var id = $("#itmHistoryGrid li").find('a.item').length;
	
	// id인자값으로 json데이터 생성 함수 호출 및 처리(로컬의 특정 지정폴더)
	
	elHistory.find('a').removeClass('now').end();
	
	column_name = "";
	if(data_value_column!=undefined)
	{
		column_name = data_value_column;
	}
	

	//yyyy-mm-dd hh:mm:dd
	var dateStr = create_date;
	
	
	
	a = $i('<a/>' ,{
		href				: '#'
	,	text				: text
	,	class				: 'item h now'
	,	id					: (parseInt(id)) +''
	,	title				: title
	,   'data-block-chained': true
	,	'data-value-cloumn'	: column_name
	,	'data-value-before'	: before_Data
	,	'data-value-after'	: after_Data
	,	'data-index-row'	: 0
	,	'data-index-col'	: data_index_col
	,	'data-index'		: data_index
	,   'mac-address'       : mac_address
	,   'create-date'		: dateStr
	}).on( 'click' ,function(e) { 
		
		Core.Prep.BlockChainHistoryClick(this);
			
	});
	
	
	var li	= $i('<li/>').html(a);
	
	elHistory.append(li);
	
};
/**
 * prep 전처리 히스토리 row추가
 */
Core.Prep.HistoryAddRow = function(editCommand){
	
	var elHistory ,a;
	elHistory = Options.Element.Diagram.HistoryGrid.El();
	
	var indexItemMax	= elHistory.find('a.item').length - 1;
	var indexItemNow	= elHistory.find('a.now').parent().index();
	
	if ( indexItemNow < indexItemMax ) {
		var itemLi = elHistory.find('li');
		if(elHistory.find('li').eq(indexItemNow).find('a').attr("data-block-chained")!="true"){
			for ( var fx=itemLi.length; fx>indexItemNow; --fx ) {
				itemLi.eq(fx).empty().remove();
			};
		}
	};
	// 현제 히스토리 갯수
	var id = $("#itmHistoryGrid li").find('a.item').length;
	
	// id인자값으로 json데이터 생성 함수 호출 및 처리(로컬의 특정 지정폴더)
	Core.Prep.jsonWrite(id);
	
	elHistory.find('a').removeClass('now').end();
	
	
	
	

	//yyyy-mm-dd hh:mm:dd
	var date = new Date();
	var dateStr = date.getFullYear() + "-" +("00" + (date.getMonth() + 1)).slice(-2) + "-" +("00" + date.getDate()).slice(-2) + " " +("00" + date.getHours()).slice(-2) + ":" +("00" + date.getMinutes()).slice(-2) + ":" +("00" + date.getSeconds()).slice(-2);
	
	
	a = $i('<a/>' ,{
		href				: '#'
	,	text				: 'Row추가'
	,	class				: 'item u now'
	,	id					: parseInt(id) +''
	,   'data-block-chained': false
	,	'data-value-cloumn'	: "add row"
	,	'data-value-before'	: ""
	,	'data-value-after'	: ""
	,	'data-index-row'	: ""
	,	'data-index-col'	: ""
	,	'data-index'		: ""
	,   'mac-address'       : $("#mac_address").val()
	,   'create-date'		: dateStr

	}).on( 'click' ,function(e) { Core.Prep.HistoryClick(this); } );
	
	
	var li	= $i('<li/>').html(a);
	
	elHistory.append(li);
	$("#itmHistory").scrollTop($(document).height());
};

/**
 * prep 전처리 히스토리 row삭제
 */
Core.Prep.HistoryDelRow = function(delete_object){
	
	var elHistory ,a;
	elHistory = Options.Element.Diagram.HistoryGrid.El();
	
	var indexItemMax	= elHistory.find('a.item').length - 1;
	var indexItemNow	= elHistory.find('a.now').parent().index();
	
	if ( indexItemNow < indexItemMax ) {
		var itemLi = elHistory.find('li');
		if(elHistory.find('li').eq(indexItemNow).find('a').attr("data-block-chained")!="true"){
			for ( var fx=itemLi.length; fx>indexItemNow; --fx ) {
				itemLi.eq(fx).empty().remove();
			};
		}
	};
	// 현제 히스토리 갯수
	var id = $("#itmHistoryGrid li").find('a.item').length;
	
	// id인자값으로 json데이터 생성 함수 호출 및 처리(로컬의 특정 지정폴더)
	Core.Prep.jsonWrite(id);
	
	elHistory.find('a').removeClass('now').end();
	var date = new Date();
	var dateStr = date.getFullYear() + "-" +("00" + (date.getMonth() + 1)).slice(-2) + "-" +("00" + date.getDate()).slice(-2) + " " +("00" + date.getHours()).slice(-2) + ":" +("00" + date.getMinutes()).slice(-2) + ":" +("00" + date.getSeconds()).slice(-2);
	
	a = $i('<a/>' ,{
		href				: '#'
	,	text				: 'Row삭제'
	,	class				: 'item d now'
	,	id					: parseInt(id) +''
	,   'data-block-chained': false
	,	'data-value-cloumn'	: "delete row"
	,	'data-value-before'	: JSON.stringify(delete_object)
	,	'data-value-after'	: "delete"
	,	'data-index-row'	: ""
	,	'data-index-col'	: ""
	,	'data-index'		: ""
	,   'mac-address'       : $("#mac_address").val()
	,   'create-date'		: dateStr
	
	}).on( 'click' ,function(e) { Core.Prep.HistoryClick(this); } );
	
	
	var li	= $i('<li/>').html(a);
	
	elHistory.append(li);
	$("#itmHistory").scrollTop($(document).height());
};

/**
 * Prep 속성 히스토리 추가
 */
Core.Prep.PropertyHistoryAdd = function(id , befValue, aftValue, befType , aftType,type){
	var elHistory ,a , historyType;
	elHistory = Options.Element.Diagram.HistoryGrid.El();
	
	var indexItemMax	= elHistory.find('a.item').length - 1;
	var indexItemNow	= elHistory.find('a.now').parent().index();
	
	if ( indexItemNow < indexItemMax ) {
		var itemLi = elHistory.find('li');
		if(elHistory.find('li').eq(indexItemNow).find('a').attr("data-block-chained")!="true"){
			for ( var fx=itemLi.length; fx>indexItemNow; --fx ) {
				itemLi.eq(fx).empty().remove();
			};
		}
	};
	// 현제 히스토리 갯수
	var id = $("#itmHistoryGrid li").find('a.item').length;
	
	// id인자값으로 json데이터 생성 함수 호출 및 처리(로컬의 특정 지정폴더)
	Core.Prep.jsonWrite(id);

	
	elHistory.find('a').removeClass('now').end();
	
	var title = "";
	var d_v_c = "";
	if(type == "C"){
		title = befValue + '→' +"삭제";
		d_v_c = "field_delete";
		
	}else {
		//컬럼명 변경
		if(befType == aftType){
			title =	befValue + '→' + aftValue;
			d_v_c = "field_modfiy";
		//컬럼 type변경
		}else if(befType != aftType){
			title =	befType + '→' + aftType;
			d_v_c = "type_modify";
		}else if(befValue != aftValue){
	    	title =	befValue + '→' + aftValue;
		    d_v_c = "column_modify";
		
		}
		
	}
	
	
	a = $i('<a/>' ,{
		href				 : '#'
	,	text				 : lang_return("fixa.core.title022")+':'+title+')' // 속성
																				// 수정
																				// (필드명
	,	class				 : 'item u now'
	,	id					: parseInt(id) +''
	,	title				 : title
	,   'data-block-chained': false
	,	'data-value-cloumn'	: d_v_c
	,	'data-value-before'	 : befValue
	,	'data-value-after'	 : aftValue
	,	'data-value-befType' : befType
	,	'data-value-aftType' : aftType
	,   'data-value-Property':'Y'
	,   'mac-address'       : $("#mac_address").val()
	}).on( 'click' ,function(e) { Core.Prep.HistoryClick(this); } );
	
	
	var li	= $i('<li/>').html(a);
	
	elHistory.append(li);
	$("#itmHistory").scrollTop($(document).height());
	
};


/**
 * prep 전처리 히스토리 선택 이벤트
 */
Core.Prep.HistoryClick = function(paThis){
	var elGrid		=$("#itmHeadendGrid2 .grid-canvas");
	var evTarget	= $i(paThis);
	var indexTarget	= evTarget.parent().index();
	var indexNow	= evTarget.parent().parent().find('a.now').parent().index();
	var li			= evTarget.parent().parent().find('li');
	var property ;
	elGrid.children().find('div').css('background-color' ,'rgba(255, 255, 255, 0)');
	evTarget.parent().parent().find('a.item').removeClass('now').end().end().end().addClass('now');
	
	// 이전 값 기억 시작
	Options.beforeColumns  = Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name});
	// 이전 값 기억끝
	if($(".item.now").attr("id") == "0"){
		for(var i=0;i<Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).length;i++){
			for(var k=0; k<($(".item.u").length); k++){
				if(  $(".item.u:eq("+k+")").attr("data-value-before") != ""){
					// 히스토리 목록중 기본 초기히스토리를 제외한 다음히스토리의 이전값 바탕으로 초기 값 돌려놓는 작업
					if(Options.Variable.slickGrid.header["prepGrid"][i] == $(".item.u:eq("+k+")").attr("data-value-after")){
						Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = $(".item.u:eq("+k+")").attr("data-value-beftype");
						Options.Variable.slickGrid.headerOption["prepGrid"][i].name = $(".item.u:eq("+k+")").attr("data-value-before");
// Options.Variable.slickGrid.header["prepGrid"][i] =
// $(".item.u:eq("+k+")").attr("data-value-after");
						break;
					}else if(Options.Variable.slickGrid.header["prepGrid"][i] == $(".item.u:eq("+k+")").attr("data-value-before")){
							Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = $(".item.u:eq("+k+")").attr("data-value-beftype");
							Options.Variable.slickGrid.headerOption["prepGrid"][i].name = $(".item.u:eq("+k+")").attr("data-value-before");
// Options.Variable.slickGrid.header["prepGrid"][i] =
// $(".item.u:eq("+k+")").attr("data-value-after");
							break;
					}
				}
			}
		}
		for(var i=0; i<$("#oriGrid .slick-column-name").length; i++){
			if(Options.Variable.slickGrid.header["prepGrid"][i] == $("#prepGrid .slick-column-name:eq("+i+")").text()){
				Options.Variable.slickGrid.header["prepGrid"][i] = $("#oriGrid .slick-column-name:eq("+i+")").text();
				Options.Variable.slickGrid.headerOption["prepGrid"][i].name =  $("#oriGrid .slick-column-name:eq("+i+")").text();
				Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = Options.oriDataType[i];
			}
		}
		
	}else if($(".item.u.now").attr("data-value-afttype") != ""){
		// 히스토리 목록 갯수만큼 마지막부터 루핑
		for(var k=($(".item.u").length); k>=0; k--){
			// 루핑중 현재 선택한값보다 id값이 큰것까지만 이전데이터 롤백(마지막부터 롤백)
			if(parseInt($(".item.u.now").attr("id")) < k){
				// 속성히스토리 루핑중 속성히스토리가 아닌 데이터 변경 히스토리는 배제하고 이전값셋팅
				if($(".item.u").attr("data-value-afttype") != ""){
					for(var i=0;i<Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).length;i++){
						if(Options.Variable.slickGrid.header["prepGrid"][i] == $("#"+(k)).attr("data-value-after")){
							Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = $("#"+(k)).attr("data-value-beftype");
							Options.Variable.slickGrid.headerOption["prepGrid"][i].name = $("#"+(k)).attr("data-value-before");
							Options.Variable.slickGrid.header["prepGrid"][i] = $("#"+(k)).attr("data-value-before");
							// 데이터 내용 변경
						}else if(Options.Variable.slickGrid.header["prepGrid"][i] == $("#"+(k)).attr("data-value-before")){
							Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = $("#"+(k)).attr("data-value-beftype");
							Options.Variable.slickGrid.headerOption["prepGrid"][i].name = $("#"+(k)).attr("data-value-before");
							Options.Variable.slickGrid.header["prepGrid"][i] =  $("#"+(k)).attr("data-value-before");
						}
					}
				}
			}
		}
		// 히스토리 목록 갯수만큼 처음부터 루핑
		for(var k=0; k<$(".item.u").length; k++){
			// 루핑중 현재 선택한값보다 id값이 큰것까지만 이전데이터 롤백(처음부터 롤백)
			if(parseInt($(".item.u.now").attr("id")) > (k+1)){
				// 속성히스토리 루핑중 속성히스토리가 아닌 데이터 변경 히스토리는 배제하고 이전값셋팅
				if($(".item.u").attr("data-value-afttype") != ""){
					for(var i=0;i<Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).length;i++){
						if(Options.Variable.slickGrid.header["prepGrid"][i] == $("#"+(k+1)).attr("data-value-after")){
							Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = $("#"+(k+1)).attr("data-value-afttype");
							Options.Variable.slickGrid.headerOption["prepGrid"][i].name = $("#"+(k+1)).attr("data-value-after");
							Options.Variable.slickGrid.header["prepGrid"][i] =  $("#"+(k+1)).attr("data-value-after");
						}else if(Options.Variable.slickGrid.header["prepGrid"][i] == $("#"+(k+1)).attr("data-value-before")){
							Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = $("#"+(k+1)).attr("data-value-afttype");
							Options.Variable.slickGrid.headerOption["prepGrid"][i].name = $("#"+(k+1)).attr("data-value-after");
							Options.Variable.slickGrid.header["prepGrid"][i] =  $("#"+(k+1)).attr("data-value-after");
						}
					}
				}
			}
		}
		// 이전값되돌린후 현재값 셋팅
		for(var i=0;i<Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).length;i++){
		
			if(Options.Variable.slickGrid.header["prepGrid"][i] == $(".item.u.now").attr("data-value-after")){
				Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type =$(".item.u.now").attr("data-value-afttype");
				Options.Variable.slickGrid.headerOption["prepGrid"][i].name = $(".item.u.now").attr("data-value-after");
				Options.Variable.slickGrid.header["prepGrid"][i] = $(".item.u.now").attr("data-value-after");
				
			}else if(Options.Variable.slickGrid.header["prepGrid"][i] == $(".item.u.now").attr("data-value-before")){
				Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type =$(".item.u.now").attr("data-value-afttype");
				Options.Variable.slickGrid.headerOption["prepGrid"][i].name = $(".item.u.now").attr("data-value-after");
				Options.Variable.slickGrid.header["prepGrid"][i] = $(".item.u.now").attr("data-value-after");
			}
		}
	}
	// 기존로직 대체-> 생성된json데이터를 바탕으로 id값을 비교후 그리드 생성 처리(로컬의 특정 지정폴더)
	Core.Prep.jsonRead();
// for(var i=0;
// i<Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return
// e.name}).length; i++){
// if(Options.Variable.slickGrid.header["prepGrid"][i] == $("#prepGrid
// .slick-column-name:eq("+i+")").text()){
// Options.Variable.slickGrid.header["prepGrid"][i] = $("#prepGrid
// .slick-column-name:eq("+i+")").text();
// }
	Core.Prep.DiagramTypeSetting();
}
/**
 * prep history Write
 */
Core.Prep.DiagramTypeSetting = function(){
	for(var i=0; i<$("image").length; i++){
		if(i !=0){
			if($("image:eq("+i+")").parent().parent().attr("data-type") !="devs.MyImageModel"){
// Options.recentChangedCloumn = [];
// Options.recentChangedCloumn =
// Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column.split(",");
				if($("image:eq("+i+")").parent().parent().attr("data-type")== "01" ||$("image:eq("+i+")").parent().parent().attr("data-type")== "20"||$("image:eq("+i+")").parent().parent().attr("data-type")== "30" 
					||$("image:eq("+i+")").parent().parent().attr("data-type")== "60"||$("image:eq("+i+")").parent().parent().attr("data-type")== "70"||$("image:eq("+i+")").parent().parent().attr("data-type")== "80"  ){
					// 현재 선택되어진 01타입의 데이터를 배열로 저장
					var beforeVal = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column.split(",");
					// 현재 컬럼 설정된 컬럼 정보만큼 루핑
					for(var j=0;j<Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).length;j++){
						// 변경되기전에 저장된 컬럼 정보와 현재 컬럼 정보를 비교 하여 같은 위치의 컬럼이 서로 다른다면
						if(Options.beforeColumns[j] != Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name})[j]){
							// 현재 선택되어진 필드값 만큼 루핑
							for(var k=0; k< beforeVal.length; k++ ){
								// 01 타입의 다이어그램 선택되어진필드값이 j조건에 부합한 컬럼이라면 (변경되지
								// 않은값 찾음)
								if(Options.beforeColumns[j] == beforeVal[k]){
									// j조건에 부합한 컬럼을 현재 설정된 헤더값으로 변경항여 선택되어진 값을
									// 변경한다.
									Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column.replace(Options.beforeColumns[j],Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name})[j]);
								}
							}
						}
					}
				}else if($("image:eq("+i+")").parent().parent().attr("data-type") == "40"){
					var beforeVal = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont;
					for(var j=0; j<Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).length; j++ ){
						if(Options.beforeColumns[j] != Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name})[j]){
							// 현재 선택되어진 필드값 만큼 루핑
							for(var k=0; k<beforeVal.length; k++ ){
								if(Options.beforeColumns[j] == beforeVal[k].data){
									// j조건에 부합한 컬럼을 현재 설정된 헤더값으로 변경항여 선택되어진 값을
									// 변경한다.
									Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[k].data = Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name})[j];
								}
							}
						}
					}
				}else if($("image:eq("+i+")").parent().parent().attr("data-type") == "50"){
					var beforeVal = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont;
					for(var j=0; j<Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).length; j++){
						if(Options.beforeColumns[j] != Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name})[j]){
							for(var k=0; k< beforeVal.length; k++ ){
								if(k==0){
									for(var l=0; l<Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[k].data.length; l++){
										if(Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[k].data[l].name == "field"){
											if(Options.beforeColumns[j] == Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[k].data[l].val){
												Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[k].data[l].val = Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name})[j];
											}
										}
									}
								}else{
									for(var l=0; l<Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[k].data.length; l++){
										for(var m=0; m<Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[k].data[l].length; m++){
											if(Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[k].data[l][m].name == "field"){
												if(Options.beforeColumns[j] == Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[k].data[l][m].val){
													Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[k].data[l][m].val = Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name})[j];
												}
											}
										}
									}
								}
							}
						}
					}
				}else if($("image:eq("+i+")").parent().parent().attr("data-type") == "03"){
					var beforeVal = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Rdata.split(",");
					// 현재 컬럼 설정된 컬럼 정보만큼 루핑
					for(var j=0;j<Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).length;j++){
						// 변경되기전에 저장된 컬럼 정보와 현재 컬럼 정보를 비교 하여 같은 위치의 컬럼이 서로 다른다면
						if(Options.beforeColumns[j] != Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name})[j]){
							// 현재 선택되어진 필드값 만큼 루핑
							for(var k=0; k< beforeVal.length; k++ ){
								// 01 타입의 다이어그램 선택되어진필드값이 j조건에 부합한 컬럼이라면 (변경되지
								// 않은값 찾음)
								if(Options.beforeColumns[j] == beforeVal[k]){
									// j조건에 부합한 컬럼을 현재 설정된 헤더값으로 변경항여 선택되어진 값을
									// 변경한다.
									Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Rdata = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Rdata.replace(Options.beforeColumns[j],Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name})[j]);
								}
							}
						}
					}
				}
			}
		}
	}
}

Core.Prep.jsonWrite = function(a_id){
	var gridData = "";
	var id = a_id;
	
	gridData = {
			  data : Options.Variable.slickGrid.id["prepGrid"].getData()
			, header : slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"])
			, header_option:Options.Variable.slickGrid.headerOption["prepGrid"]
			, historyId:parseInt(id) +''
			, mac_address : $("#mac_address").val()
			
	}
	var jsonData = JSON.stringify(gridData);
	
	$.ajax({
	   url: '/prep/writeJson.fd' 
	   ,crossDomain: true
	   ,contentType: 'application/json'
	   ,async: true
	   ,type: 'POST'
	   ,data: jsonData
	   ,dataType: 'json'
	   ,success: function(data) {
	   }
	});
}
//
Core.Prep.jsonOriRead = function(){
	var gridData = "";
	gridData = {
			historyId: "0"
		   , mac_address : $("#mac_address").val()
	}
	
	var jsonData = JSON.stringify(gridData);
	
	$.ajax({
		   url: '/prep/readJson.fd' 
		   ,contentType: 'application/json'
		   ,async: true
		   ,type: 'POST'
		   ,data: jsonData
		   ,dataType: 'json'
		   ,success: function(data) {
				// 전처리 grid에 데이터 바인딩
			    $("#mac_address").val(data.mac_address);
				slickGrid.setColumnReadOnly(Options.Variable.slickGrid.id["oriGrid"], data.result.header);
				slickGrid.setData(Options.Variable.slickGrid.id["oriGrid"], data.result.data);
				Options.Variable.slickGrid.id["oriGrid"].resizeCanvas();
				Options.Variable.slickGrid.id["oriGrid"].render();
		   }
	});
}
/**
 * prep history Read
 */
Core.Prep.jsonRead = function(){
	var gridData = "";
	var now_li = $("#itmHistoryGrid li").find('a.item.now').attr('id');
	if($("#itmHistoryGrid li").find('a.item#'+now_li+'').attr("data-block-chained") =="true" ||
			$("#itmHistoryGrid li").find('a.item#'+now_li+'').attr("data-block-chained") ==undefined){
		gridData = {
				historyId: "0"
		}
	}else{
		gridData = {
				historyId: $("#itmHistoryGrid li").find('a.item.now').attr('id')
		}
	}
	var jsonData = JSON.stringify(gridData);
	
	$.ajax({
		   url: '/prep/readJson.fd' 
		   ,contentType: 'application/json'
		   ,async: true
		   ,type: 'POST'
		   ,data: jsonData
		   ,dataType: 'json'
		   ,success: function(data) {
				// 전처리 grid에 데이터 바인딩
			   
			
				Options.Variable.slickGrid.header["prepGrid"] = data.result.header;
				Options.Variable.slickGrid.headerOption["prepGrid"] = [];
				if(data.result.header_option==null || data.result.header_option.length==0)
				{
// Options.oriDataType = [];
					for(i=0;i<Options.Variable.slickGrid.header["prepGrid"].length;i++)
					{
						var obj = {};
						
						obj.name = data.result.header_option[i].name;
						obj.data_type = "char";
//						Options.oriDataType[i] = obj.data_type;
						Options.Variable.slickGrid.headerOption["prepGrid"].push(obj);
					}
				}
				else
				{
// Options.oriDataType = [];
					for(i=0;i<data.result.header_option.length;i++)
					{
// Options.oriDataType[i] = data.result.header_option[i].data_type;
						var obj = {};
						obj.name = data.result.header_option[i].name;
						obj.data_type =  data.result.header_option[i].data_type;
						Options.Variable.slickGrid.headerOption["prepGrid"].push(obj);
					}
				}
				slickGrid.setColumn(Options.Variable.slickGrid.id["prepGrid"], data.result.header);
				slickGrid.setData(Options.Variable.slickGrid.id["prepGrid"], data.result.data);
				// 작업 대기중
				Options.Variable.slickGrid.id["prepGrid"].resizeCanvas();
				Options.Variable.slickGrid.id["prepGrid"].render();
		   }
	});
}
/**
 * prep 속성 히스토리 이전 기능(ctrl+z)
 */
Core.Prep.jsonReadPrev = function(){
	Options.PrevProcess = true;
	var gridData = "";
	var liMaxlength = $("#itmHistoryGrid li").find('a.item').length;
	// 뒤로가기 처리
	var recent_id = $("#itmHistoryGrid li").find('a.item.now').attr('id');
	if(recent_id >= 1){
		var prev_id =  $("#itmHistoryGrid li").find('a.item.now').attr('id')-1;
		// 이전아이디값으로 클래스 변경(now)선택값 변경
		$("#itmHistoryGrid li #"+prev_id).addClass('now');
		// 현재 li 클래스 변경 now값 제거
		$("#itmHistoryGrid li #"+recent_id).removeClass('now');
		
		
		if($("#itmHistoryGrid li").find('a.item#'+prev_id+'').attr("data-block-chained") =="true" ||
				$("#itmHistoryGrid li").find('a.item#'+prev_id+'').attr("data-block-chained") ==undefined){
			gridData = {
					historyId: "0"
			}
		}else{
			gridData = {
					historyId: $("#itmHistoryGrid li").find('a.item.now').attr('id')
			}
		}
		
		var jsonData = JSON.stringify(gridData);
		
		$.ajax({
			   url: '/prep/readJson.fd' 
			   ,crossDomain: true
			   ,contentType: 'application/json'
			   ,async: false
			   ,type: 'POST'
			   ,data: jsonData
			   ,dataType: 'json'
			   ,success: function(data) {
				   
				   Options.Variable.slickGrid.header["prepGrid"] = data.result.header;
				   Options.Variable.slickGrid.headerOption["prepGrid"] = [];
				   if(data.result.header_option==null || data.result.header_option.length==0)
					{
		// Options.oriDataType = [];
						for(i=0;i<Options.Variable.slickGrid.header["prepGrid"].length;i++)
						{
							var obj = {};
							obj.name = Options.Variable.slickGrid.header["prepGrid"][i];
							obj.data_type = "char";
							Options.oriDataType[i] = obj.data_type;
							Options.Variable.slickGrid.headerOption["prepGrid"].push(obj);
						}
					}
				   else
					{
	// Options.oriDataType = [];
						for(i=0;i<data.result.header_option.length;i++)
						{
	// Options.oriDataType[i] = data.result.header_option[i].data_type;
							var obj = {};
							obj.name = data.result.header_option[i].name;
							obj.data_type =  data.result.header_option[i].data_type;
							Options.Variable.slickGrid.headerOption["prepGrid"].push(obj);
						}
					}
					// 전처리 grid에 데이터 바인딩
					slickGrid.setColumn(Options.Variable.slickGrid.id["prepGrid"], data.result.header);
					slickGrid.setData(Options.Variable.slickGrid.id["prepGrid"], data.result.data);
// for(i=0;i<data.result.header_option.length;i++)
// {
// Options.Variable.slickGrid.headerOption["prepGrid"].push(data.result.header_option[i]);
// }
					Options.Variable.slickGrid.id["prepGrid"].resizeCanvas();
					Options.Variable.slickGrid.id["prepGrid"].render();
			   }
		});
		
	}
	Options.PrevProcess = false;
}
/**
 * prep 속성 히스토리 다음 기능(ctrl+y)
 */
Core.Prep.jsonReadNext = function(){
	Options.NextProcess = true;
	var gridData = "";
	var liMaxlength = $("#itmHistoryGrid li").find('a.item').length;
	// 앞으로 가기 처리
	var recent_id = $("#itmHistoryGrid li").find('a.item.now').attr('id');
	if((parseInt(liMaxlength)-1) > parseInt(recent_id)){
		
		var next_id =  parseInt($("#itmHistoryGrid li").find('a.item.now').attr('id'))+1;
		// 다음아이디값으로 클래스 변경(now)선택값 변경
		$("#itmHistoryGrid li #"+next_id).addClass('now');
		// 현재 li 클래스 변경 now값 제거
		$("#itmHistoryGrid li #"+recent_id).removeClass('now');
		
		
		if($("#itmHistoryGrid li").find('a.item#'+next_id+'').attr("data-block-chained") =="true" ||
				$("#itmHistoryGrid li").find('a.item#'+next_id+'').attr("data-block-chained") ==undefined){
			gridData = {
					historyId: "0"
			}
		}else{
			gridData = {
					historyId: $("#itmHistoryGrid li").find('a.item.now').attr('id')
			}
		}
		
		var jsonData = JSON.stringify(gridData);
		
		$.ajax({
			   url: '/prep/readJson.fd' 
			   ,crossDomain: true
			   ,contentType: 'application/json'
			   ,async: false
			   ,type: 'POST'
			   ,data: jsonData
			   ,dataType: 'json'
			   ,success: function(data) {
				   $("#mac_address").val(data.mac_address);
				  
				   Options.Variable.slickGrid.header["prepGrid"] = data.result.header;
				   Options.Variable.slickGrid.headerOption["prepGrid"] = [];
				   if(data.result.header_option==null || data.result.header_option.length==0)
					{
		// Options.oriDataType = [];
						for(i=0;i<Options.Variable.slickGrid.header["prepGrid"].length;i++)
						{
							var obj = {};
							obj.name = Options.Variable.slickGrid.header["prepGrid"][i];
							obj.data_type = "char";
							Options.oriDataType[i] = obj.data_type;
							Options.Variable.slickGrid.headerOption["prepGrid"].push(obj);
						}
					}
				   	else
					{
	// Options.oriDataType = [];
						for(i=0;i<data.result.header_option.length;i++)
						{
	// Options.oriDataType[i] = data.result.header_option[i].data_type;
							var obj = {};
							obj.name = data.result.header_option[i].name;
							obj.data_type =  data.result.header_option[i].data_type;
							Options.Variable.slickGrid.headerOption["prepGrid"].push(obj);
						}
					}
					// 전처리 grid에 데이터 바인딩
				   slickGrid.setColumn(Options.Variable.slickGrid.id["prepGrid"], data.result.header);
				   slickGrid.setData(Options.Variable.slickGrid.id["prepGrid"], data.result.data);
					
// for(i=0;i<data.result.header_option.length;i++)
// {
// Options.Variable.slickGrid.headerOption["prepGrid"].push(data.result.header_option[i]);
// }
					Options.Variable.slickGrid.id["prepGrid"].resizeCanvas();
					Options.Variable.slickGrid.id["prepGrid"].render();
			   }
		});
	}
	Options.NextProcess = false;
	
}

/**
 * prep 속성 히스토리 선택 이벤트
 */
Core.Prep.PropertyHistoryClick = function(paThis){
	
	console.log(historyType);
	
	
	var tmpObj			= li.eq(1);
	var tmpObjAk		= tmpObj.find('a.item').eq(0);
	var tmpValBef		= tmpObjAk.attr('data-value-before');
	var tmpValAft		= tmpObjAk.attr('data-value-after');
	var tmpValBefType	= tmpObjAk.attr('data-value-befType');
	var tmpValAftType	= tmpObjAk.attr('data-value-aftType');
	var tmpRow			= tmpObjAk.attr('data-index-row');
	var tmpCol			= tmpObjAk.attr('data-index-col');
	
	
	// header 설정 변경
	Options.Variable.slickGrid.header["prepGrid"][Options.Variable.slickGrid.header["prepGrid"].indexOf(tmpValAft)] = tmpValBef;
	
	// 데이터 내용 변경
	var data = [];
	$.each(Options.Variable.slickGrid.id["prepGrid"].getData(),function(k,v){
		data.push(Core.Prep.keymodify(v, tmpValAft,tmpValBef));
	});
	
	// 데이터 type의 key 변
	
	Options.Variable.slickGrid.headerOption["prepGrid"]
	
	
	
	
	slickGrid.setColumn(Options.Variable.slickGrid.id["prepGrid"], Options.Variable.slickGrid.header["prepGrid"]);
	slickGrid.setData(Options.Variable.slickGrid.id["prepGrid"], data);
	
	// 데이터 타입 변경
	for(i=0;i<Options.Variable.slickGrid.headerOption["prepGrid"].length;i++)
	{
		if(Options.Variable.slickGrid.headerOption["prepGrid"][i].name==tmpValBef)
		{
			/*
			 * if(Options.Variable.slickGrid.headerOption["prepGrid"][i].name !=
			 * $("#"+id).val()) {
			 */
				Options.Variable.slickGrid.headerOption["prepGrid"][i].name = tmpValBef
			// }
				
			Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = tmpValBefType;
			break;
		}
	}
	
	
}
// 이미 저장되어 있는 다이어그램 정보를 초기화 하는 함수
Core.Prep.LoadDiagramData = function(){
	var obj = "";
	Options.defauleDiagramData = "";
		$.ajax({
		    url: '/collect/setProjectAndDataSn2.fd' 
		    ,async: false
		    ,type: 'post'
		    ,success: function(data) {
		    	Core.Diagram.Reset();
		    	if(data.workflow != ""){
			    	obj = JSON.parse(data.workflow);
			    	if(obj[0].before_scrollerX !="" && obj[0].before_scrollerY !=""){
			    		if($("#itmDiagramCanvas").width() < parseInt(obj[0].before_scrollerX) || $("#itmDiagramCanvas").height() < parseInt(obj[0].before_scrollerY)){
			    			$(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").css("width",parseInt(obj[0].before_scrollerX));
			    			$(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").css("height",parseInt(obj[0].before_scrollerY));
			    		}
			    	}
			    	if(obj.length != 0){
				    	for(var i=0; i<obj.length; i++){
							if(obj[i].before_data_type !="devs.MyImageModel"){
								Core.Diagram.Add2(obj[i].before_data_y,obj[i].before_data_x,obj[i].before_data_icon,obj[i].before_data_rule,obj[i].before_data_rule_opt,obj[i].before_data_name,obj[i].before_data_index,obj[i].before_data_type);
							}
						}
			    	}
			    	Core.Diagram.DiagramSetData(data);
		    	}else{
		    	}
		    }
		});
		Options.defauleDiagramData = JSON.stringify(obj);
		$("#_btn_prepGrid_close").click();
		
		//$("#div_ajax_load_image").css("left",($("#itmDiagramCanvas").position().left+$("#itmDiagramCanvas").width()/2)-80);
		//$("#div_ajax_load_image").css("top",($("#itmDiagramCanvas").position().top+$("#itmDiagramCanvas").height()/2));
		
		
}


/**
 */
Core.Prep.ColumnProperty = function(column)
{
	
	if(column == "idx"){
		return false;
	}
	var beforeCheckDataOutput=[];
	var elItemProperty	= Options.Element.Diagram.Property.El();
	var elAreaHistory	= Options.Element.Global.History.El();
	var idxProperty		= elAreaHistory.find('.history').removeClass('on').end().find('.property').addClass('on').index();
	var data = [];
	var itmList				= $i( '<ul/>' ,{ class : 'checkColumn' } );
	var id = "temp_"+Core.uuid();
	var radio_id = "radio_"+Core.uuid();
	// input 변수 초기화
	var input= "";
	// input Default로 활성화 저장
	input		= $i('<input/>' ,{
		id		: id
	,	name	: id
	,	type	: 'text'
	,	value	: column
	});
	
	var label		= $i('<label/>' ,{
		"class":"label_tit",
		text	: lang_return("fixa.core.title024")// '필드명'
	});
	var li			= $i('<li/>').append(label).append("&nbsp;").append(input);
	
	// 컬럼 입력기능 적용
	itmList.append(li);
	
	
	
	
	
	itmList.append("<br/>");
	
	if(Process.prepfirst==false){
	// 다이어그램이 그려지고 정보를 가지고 있을때
	if(Options.beforeUi.length != 0){
		// 다이어그램 정보의 갯수 만큼 루프
		for(var k=0; k<Options.beforeUi.length; k++){
			
			// 컬럼 정보를 초기화
			var workflowRuleSetfields = "";
			// 이미 그려진 다이어그램 정보의 modelId값이 존재하면
			if($("g[model-id='"+Options.beforeUi[k]["modelId"]+"']").length > 0){
				// 이미 그려진 다이어그램 정보 컬럼정보를 workflowRuleSetfields 배열 정보를 저장
				workflowRuleSetfields = Options.Variable.Diagram.Global[Options.beforeUi[k]["modelId"]].Column.split(",");
				// 저장 된 배열의 횟수만큼 루프
				for(var j=0; j<workflowRuleSetfields.length; j++){
					// 만일 배열의 정보중 사용자가 선택한 column과 매칭이 된다면 아래의 설정값으로 대체
					if(workflowRuleSetfields[j] == column ){
						input		= $i('<input/>' ,{
							id		: id
						,	name	: id
						,	type	: 'text'
						,	value	: column
						,   disabled :"disabled"
						, 	title	: lang_return("fixa.core.title023")// '이미
																		// 속성에서
																		// 선택된
																		// 필드입니다.
																		// 수정이
																		// 불가능합니다.'
						});
					}
				}
			}
		}
		$.ajax({
		    url: '/collect/setProjectAndDataSn2.fd' 
		    ,async: false
		    ,type: 'post'
		    ,success: function(data) {
		    	if(data.workflow != ""){
		    		// 조회된 DB정보와 매칭이 되는 다이어그램 정보를 json파싱후 저장
			    	var obj = JSON.parse(data.workflow);
			    	// obj 존재한다면
			    	if(obj.length != 0){
			    		// obj 정보가 존재하는 만큼 루프
				    	for(var k=0; k<obj.length; k++){
				    		// beforeCheckDataOutput 배열을 루프돌때마다 초기화(저장되어진
							// check정보값)
				    		// 선택된 필드 갯수 만큼 루프
				    		for(var i=0;i<Options.Variable.slickGrid.headerOption["prepGrid"].length;i++)
				    		{
				    			if(Options.Variable.slickGrid.headerOption["prepGrid"][i].name==column)
				    			{
				    				Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = String(obj[k].before_data_columnType[i].data_type);
				    			}
				    		}
						}
			    	}
		    	}
		    }
		});
	// 다이어그램이 그려지지 않고 원본데이터/데이터 전처리 탭으로 수행시
	}else if(Options.beforeUi.length == 0){
		// 해당 DB정보를 조회
		$.ajax({
		    url: '/collect/setProjectAndDataSn2.fd' 
		    ,async: false
		    ,type: 'post'
		    ,success: function(data) {
		    	if(data.workflow != ""){
		    		// 조회된 DB정보와 매칭이 되는 다이어그램 정보를 json파싱후 저장
			    	var obj = JSON.parse(data.workflow);
			    	// obj 존재한다면
			    	if(obj.length != 0){
			    		// obj 정보가 존재하는 만큼 루프
				    	for(var k=0; k<obj.length; k++){
				    		// beforeCheckDataOutput 배열을 루프돌때마다 초기화(저장되어진
							// check정보값)
				    		var beforeCheckDataOutput=[];
				    		// obj가 가지고 있는 다이어그램 정보중 check된 정보값을 배열로 저장
				    		beforeCheckDataOutput = String(obj[k].data).split(",");
				    		// 선택된 필드 갯수 만큼 루프
				    		for(var j=0; j<beforeCheckDataOutput.length; j++){
				    			// 저장된 필드 값과 사용자가 선택한 필드값이 매칭이 된다면 아래의 정보로 대체
				    			if(beforeCheckDataOutput[j] == column ){
				    				input		= $i('<input/>' ,{
				    					id		: id
				    				,	name	: id
				    				,	type	: 'text'
				    				,	value	: column
				    				,   disabled :"disabled"
				    				, 	title	: lang_return("fixa.core.title023")// '이미
																					// 속성에서
																					// 선택된
																					// 필드입니다.
																					// 수정이
																					// 불가능합니다.'
				    				});
				    				
				    			}
				    		}
				    		for(var i=0;i<Options.Variable.slickGrid.headerOption["prepGrid"].length;i++)
				    		{
				    			if(Options.Variable.slickGrid.headerOption["prepGrid"][i].name==column)
				    			{
				    				Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = String(obj[k].before_data_columnType[i].data_type);
				    			}
				    		}
						}
			    	}
		    	}
		    }
		});
	}
	}
	// 현재 타입 로드
	var data_type = "";
	for(i=0;i<Options.Variable.slickGrid.headerOption["prepGrid"].length;i++)
	{
		if(Options.Variable.slickGrid.headerOption["prepGrid"][i].name==column)
		{
			data_type = Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type;
			break;
		}			
	}
	
	// 속성 데이타 타입 html생성
	var typeList = "";
	var radio_ori_val;
	typeList = typeList +("<table width='100%' border='0'>");
	
	
	var div = $("<div/>");
	
	for(i=0;i<Options.Element.prep.typeList.length;i++)
	{
	
		var radio_is_check = false; 
		if(data_type==Options.Element.prep.typeList[i])
		{
			radio_is_check = true;
			radio_ori_val = Options.Element.prep.typeList[i];
		}
		var radio		= "";
		radio= $("<input/>",{"type":"radio","name":radio_id,"id":radio_id+"_"+i,"value":Options.Element.prep.typeList[i],"checked":radio_is_check}).on("change",function(e){
			
			var data ={}; 
			field = column;
			checked_id = radio_id+"_"+i;
			
			// label일 경우
			if("label" == $(".checkColumn input:radio:checked").val()){
				
				 var limit_check = false;
				 var jsonData = Options.Variable.slickGrid.id["prepGrid"].getData();
			     
			     for(i=0;i<jsonData.length;i++)
			     {
			        if(data[jsonData[i][field]]===undefined){
			           data[jsonData[i][field]] = 1;
			        }
			        else
			        {
			           data[jsonData[i][field]]++;
			        }
			        
			        
			     }
			     
			     // 너무 많은 컬럼 제한 50개
		        if(1 >= Object.keys(data).length || 50  <= Object.keys(data).length){
		        	limit_check =true;
		        }
			     
			     if(limit_check==false)
			     {
			    	 
			    	 // 값아 "" 이거나 null인경우 null이라는 key값으로 변경하여 출력함
			    	 for(i=0;i<Object.keys(data).length;i++)
			         {
			    		 if(Object.keys(data)[i]=="" || Object.keys(data)[i]==undefined || Object.keys(data)[i]==null)
			    	     {
			    			 data["null"] = data[""];
			    			 delete data[""];
			    			 break;
			    	     }
			         }
			     
			         var chartDonut = c3.generate({
				    	  bindto: "#labelChart",
				    	  data: {
				    	    json: [data],
				    	    keys: {
				    	      value: Object.keys(data),
				    	    },
				    	    type: "donut",
				    	  },
				    	  donut: {
				    	    title: field,
				    	  },
				    	}); 
				     
				     $("#labelChart").show();
			     }
			     else
			   	 {
					 alert(lang_return("fixa.core.title156"));
			    	 // 전 타입으로
			    	 $("#"+checked_id+"input:radio:checked");
			    	 Core.Diagram.Contextmenu.CloseSidebar();
			    	 
			   	 }
				
			}else{
				
			     $("#labelChart").hide();
				
			}
		});
		var li = $("<li/>");
		var radioId = ""+radio_id+"_"+i;
		li.append(radio);
		li.append($("<label/>",{"for":radioId,"text":Options.Element.prep.typeList[i]}));
		
		div.append(li);
		
	}
	
	
	
	itmList.append( $i('<label/>' ,{
		text	: lang_return("fixa.core.title025")// '타입설정'
	})).append(div);
	
	var elDel			= $('<a/>' ,{
		text	: "Delete"// '컬럼 삭제'
	,	class	: '_btn'
	}).on('click' ,function(){
		
		// 다이어그램 설정된값 체크 이미 설정된 컬럼이 있다면 메시지 출력후 return
		for(var i=0; i<$("image").length; i++){
			if(i !=0){
				if($("image:eq("+i+")").parent().parent().attr("data-type") !="devs.MyImageModel"){
					if($("image:eq("+i+")").parent().parent().attr("data-type")== "01" 
						|| $("image:eq("+i+")").parent().parent().attr("data-type")== "20" || $("image:eq("+i+")").parent().parent().attr("data-type")== "30"
						|| $("image:eq("+i+")").parent().parent().attr("data-type")== "60" || $("image:eq("+i+")").parent().parent().attr("data-type")== "70"
						|| $("image:eq("+i+")").parent().parent().attr("data-type")== "80"
					){
						if (Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column.indexOf(column)  != -1) {
							alert(lang_return("fixa.core.title226"));//데이터이상치검출 설정에 이미 해당 컬럼이 설정되어 있어 삭제가 불가능합니다.
							return;
						}
					}else if($("image:eq("+i+")").parent().parent().attr("data-type") == "04"){
					}else if($("image:eq("+i+")").parent().parent().attr("data-type") == "40"){
						for(var j=0; j<Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont.length; j++ ){
							if(Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].field == "field"){
								if(Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].data == column){
									alert(lang_return("fixa.core.title226"));//데이터이상치검출 설정에 이미 해당 컬럼이 설정되어 있어 삭제가 불가능합니다.
									return;
								}
							}
						}
					}else if($("image:eq("+i+")").parent().parent().attr("data-type") == "50"){
						for(var j=0; j<Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont.length; j++){
							if(j==0){
								for(var k=0; k<Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].data.length; k++){
									if(Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].data[k].name == "field"){
										if(Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].data[k].val == column){
											alert(lang_return("fixa.core.title226"));//데이터이상치검출 설정에 이미 해당 컬럼이 설정되어 있어 삭제가 불가능합니다.
											return;
										}
									}
								}
								
							}else{
								for(var k=0; k<Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].data.length; k++){
									for(var l=0; l<Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].data[k].length; l++){
										if(Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].data[k][l].name == "field"){
											if(Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].data[k][l].val == column){
												alert(lang_return("fixa.core.title226"));//데이터이상치검출 설정에 이미 해당 컬럼이 설정되어 있어 삭제가 불가능합니다.
												return;
											}
										}
									}
								}
							}
						}
					}else if($("image:eq("+i+")").parent().parent().attr("data-type") == "03"){
						// 현재 컬럼 설정된 컬럼 정보만큼 루핑
						if(Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Rdata.indexOf(column) != -1 ){
							alert(lang_return("fixa.core.title226"));//데이터이상치검출 설정에 이미 해당 컬럼이 설정되어 있어 삭제가 불가능합니다.
							return;
						}
					}
				}
			}
		}
		Core.Prep.ColumnDel(column);
		Core.Prep.PropertyHistoryAdd(id , column , $("#"+id).val() , data_type , $('input[name="'+radio_id+'"]:checked').val(),"C");
		Core.Diagram.Contextmenu.CloseSidebar();
		$("#itmHistory").scrollTop($(document).height());
	});
	
	// alert(radio_ori_val);
	
	// 설정하기
	var elSave			= $('<a/>' ,{
		text	: lang_return("fixa.core.title026")// '설정하기'
	,	class	: '_btn'
	}).on('click' ,function(){
		
		// field속성확인
		if(column != $("#"+id).val())
		{
			
			console.log()
			// 필드 명이 변경되었을시 전역변수에 마지막 변경 값을 저
			if(slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"]).indexOf($("#"+id).val())>-1)
			{
				alert($("#"+id).val()+""+lang_return("fixa.core.title028"));  // 필드명은
																				// 이미
																				// 사용중인
																				// 필드이거나,
																				// 사용이
																				// 불가능한
																				// 필드입니다.
				return ;
			}
			else
			{
				// Options.Variable.slickGrid.header["prepGrid"]
				for(var i=0; i<Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).length; i++){
						Options.Variable.slickGrid.header["prepGrid"][i] = $("#prepGrid .slick-column-name:eq("+i+")").text();
				}
				// header 설정 변경
				Options.Variable.slickGrid.header["prepGrid"][slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"]).indexOf(column)] = $("#"+id).val();
// Options.Variable.slickGrid.headerOption["prepGrid"][slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"]).indexOf(column)].name
// = $("#"+id).val();
// Options.Variable.slickGrid.headerOption["prepGrid"][slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"]).indexOf(column)].data_type
// = $(".checkColumn input:radio:checked").val();
				
				var data = [];
				$.each(Options.Variable.slickGrid.id["prepGrid"].getData(),function(k,v){
					data.push(Core.Prep.keymodify(v, column,$("#"+id).val()));
				});
				
				// 속성 컬럼 변경에 따른 다이어그램 컬럼 선택값 유지
				for(var i=0; i<$("image").length; i++){
					if(i !=0){
						if($("image:eq("+i+")").parent().parent().attr("data-type") !="devs.MyImageModel"){
							if($("image:eq("+i+")").parent().parent().attr("data-type")== "01" 
								||$("image:eq("+i+")").parent().parent().attr("data-type") == "20" || $("image:eq("+i+")").parent().parent().attr("data-type") == "30"
								||$("image:eq("+i+")").parent().parent().attr("data-type") == "60" || $("image:eq("+i+")").parent().parent().attr("data-type") == "70"
								|| $("image:eq("+i+")").parent().parent().attr("data-type") == "80"		
							){
								Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column.replace(column,$("#"+id).val());
							}else if($("image:eq("+i+")").parent().parent().attr("data-type") == "04"){
							}else if($("image:eq("+i+")").parent().parent().attr("data-type") == "30"){
								Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column.replace(column,$("#"+id).val());
							}else if($("image:eq("+i+")").parent().parent().attr("data-type") == "40"){
								for(var j=0; j<Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont.length; j++ ){
									if(Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].data == column){
										if(Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].field == "field"){
											Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].data = $("#"+id).val();
										}
									}
								}
							}else if($("image:eq("+i+")").parent().parent().attr("data-type") == "50"){
								for(var j=0; j<Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont.length; j++){
									if(j==0){
										for(var k=0; k<Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].data.length; k++){
											if(Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].data[k].name == "field"){
												if(Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].data[k].val == column){
													Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].data[k].val = $("#"+id).val();
												}
											}
										}
									}else{
										for(var k=0; k<Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].data.length; k++){
											for(var l=0; l<Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].data[k].length; l++){
												if(Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].data[k][l].name == "field"){
													if(Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].data[k][l].val == column){
														Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont[j].data[k][l].val = $("#"+id).val();
													}
												}
											}
										}
										
									}
									
								}
							}else if($("image:eq("+i+")").parent().parent().attr("data-type") == "03"){
								var beforeVal = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Rdata.split(",");
								// 현재 컬럼 설정된 컬럼 정보만큼 루핑
								for(var j=0;j<Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).length;j++){
									if(Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name})[j] == column){
										// 변경되기전에 저장된 컬럼 정보와 현재 컬럼 정보를 비교 하여 같은
										// 위치의 컬럼이 서로 다른다면
										for(var k=0; k< beforeVal.length; k++ ){
											// 01 타입의 다이어그램 선택되어진필드값이 j조건에 부합한
											// 컬럼이라면 (변경되지 않은값 찾음)
											if( beforeVal[k] == column){
												// j조건에 부합한 컬럼을 현재 설정된 헤더값으로
												// 변경항여 선택되어진 값을 변경한다.
												Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Rdata = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Rdata.replace(column,$("#"+id).val());
											}
										}
									}
								}
							}
						}
					}
				}
				// 데이터 내용 변경
				// headerOption 변경여부에 따른 그리드 헤더옵션 변경처리
				for(var i=0; i<Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).length; i++){
					if(Options.Variable.slickGrid.header["prepGrid"][i] == $("#"+id).val()){
						Options.Variable.slickGrid.headerOption["prepGrid"][i].name = $("#"+id).val();
						Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = $(".checkColumn input:radio:checked").val();
					}				
				}
				
				// 데이터 type의 key 변
				slickGrid.setColumn(Options.Variable.slickGrid.id["prepGrid"], Options.Variable.slickGrid.header["prepGrid"]);
				slickGrid.setData(Options.Variable.slickGrid.id["prepGrid"],data);
			}
		}else{
			
		}
		
		// 데이터 타입 변경
		for(var i=0;i<Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).length;i++)
		{
			if(Options.Variable.slickGrid.header["prepGrid"][i]==column)
			{
				if(Options.Variable.slickGrid.headerOption["prepGrid"][i].name != $("#"+id).val())
				{
					Options.Variable.slickGrid.headerOption["prepGrid"][i].name = $("#"+id).val();
				}
				
				if($(".checkColumn input:radio:checked").val()=="date")
				{
					if(slickGrid.isDate(Options.Variable.slickGrid.id["prepGrid"].getData(),$("#"+id).val())==false)
					{
						if(confirm(lang_return("fixa.core.title029"))) // "해당정보는
																		// date타입이
																		// 아닙니다.
																		// 그럼에도
																		// 불구하고
																		// 선택하시겠습니까?"
						{
							
							
							
							Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = $(".checkColumn input:radio:checked").val();
							break;
						}
						else
						{
							Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = radio_ori_val;
							break;
						}
					}
					else
					{
						Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = $(".checkColumn input:radio:checked").val();
						break;		
					}
				}
				else if($(".checkColumn input:radio:checked").val()=="number")
				{
					console.log(slickGrid.isNumber(Options.Variable.slickGrid.id["prepGrid"].getData(),$("#"+id).val()));
					if(slickGrid.isNumber(Options.Variable.slickGrid.id["prepGrid"].getData(),$("#"+id).val())==false)
					{
						if(confirm(lang_return("fixa.core.title030"))) // "해당정보는
																		// int
																		// 타입이
																		// 아닙니다.
																		// 그럼에도
																		// 불구하고
																		// 선택하시겠습니까?"
						{
							Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = $(".checkColumn input:radio:checked").val();
							break;
						}
						else
						{
							Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = radio_ori_val;
							break;
						}
					}
					else
					{
						console.log(Options.Variable.slickGrid.headerOption["prepGrid"][i]);
						Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = $(".checkColumn input:radio:checked").val();
						break;		
					}
				}else if($(".checkColumn input:radio:checked").val()=="label"){
					
					if(slickGrid.isFloat(Options.Variable.slickGrid.id["prepGrid"].getData(),$("#"+id).val())==false)
					{
						if(confirm(lang_return("fixa.core.title157")))
						{
							Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = $(".checkColumn input:radio:checked").val();
							break;
						}
						else
						{
							Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = radio_ori_val;
							break;
						}
					}
					else
					{
						Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = $(".checkColumn input:radio:checked").val();
						break;		
					}
				}else if($(".checkColumn input:radio:checked").val()=="char"){
					if(slickGrid.isFloat(Options.Variable.slickGrid.id["prepGrid"].getData(),$("#"+id).val())==false)
					{
						if(confirm(lang_return("fixa.core.title158"))) // "해당정보는
																		// float
																		// 타입이
																		// 아닙니다.
																		// 그럼에도
																		// 불구하고
																		// 선택하시겠습니까?"
						{
							Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = $(".checkColumn input:radio:checked").val();
							break;
						}
						else
						{
							Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = radio_ori_val;
							break;
						}
					}
					else
					{
						Options.Variable.slickGrid.headerOption["prepGrid"][i].data_type = $(".checkColumn input:radio:checked").val();
						break;		
					}
				}
			}else{
			}
		}
		
		Options.Variable.slickGrid.id["prepGrid"].invalidate();

		Core.Prep.PropertyHistoryAdd(id , column , $("#"+id).val() , data_type , $('input[name="'+radio_id+'"]:checked').val(),"M");
		
		Core.Diagram.Contextmenu.CloseSidebar();
		$("#itmHistory").scrollTop($(document).height());
		
	});
	
	
	var elClose			= $('<a/>' ,{
		text	: lang_return("fixa.core.title032")// '닫기'
	,	class	: '_btn'
	,   id		: '_btn_prepGrid_close'
	}).on('click' ,function(){
		Core.Diagram.Contextmenu.CloseSidebar();
	});
	
	var labelChart			= $('<div/>' ,{
		text	: ''
	,   id      : 'labelChart'
	}).on('click' ,function(){
		
	});
	
	var elDelButton		= $('<span/>' ,{
		class	: 'button'
	}).html(elDel);
	
	var elButton		= $('<span/>' ,{
		class	: 'button'
	}).html(elClose);
	
	var elSaveButton		= $('<span/>' ,{
		class	: 'button'
	}).html(elSave);
	
	var labelDiv		= $('<span/>' ,{
		class	: ' '
	}).html(labelChart);
	
	
	
	elAreaHistory.find('.contents').removeClass('on').eq(idxProperty).addClass('on');
	// 임시
	elItemProperty.html("");
	elItemProperty.append(itmList).append(elButton).append(" ").append(elSaveButton).append(elDelButton).append(labelDiv);
	
	if(data_type == "label"){
		var data ={}; 
		field = column;
		checked_id = radio_id+"_"+i;
		
		var limit_check = false;
		 var jsonData = Options.Variable.slickGrid.id["prepGrid"].getData();
	     
	     for(i=0;i<jsonData.length;i++)
	     {
	        if(data[jsonData[i][field]]===undefined){
	           data[jsonData[i][field]] = 1;
	        }
	        else
	        {
	           data[jsonData[i][field]]++;
	        }
	        
	        
	     }
	     var chartDonut = c3.generate({
	    	  bindto: "#labelChart",
	    	  data: {
	    	    json: [data],
	    	    keys: {
	    	      value: Object.keys(data),
	    	    },
	    	    type: "donut",
	    	  },
	    	  donut: {
	    	    title: field,
	    	  },
	    	});
	     $("#labelChart").show();
	}
	
	return itmList;
}
Core.Prep.ColumnDel = function(column){
	var idx = slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"]).indexOf(column);
	Options.Variable.slickGrid.header["prepGrid"].splice(idx,1);
	slickGrid.setColumn(Options.Variable.slickGrid.id["prepGrid"], Options.Variable.slickGrid.header["prepGrid"]);
	slickGrid.setData(Options.Variable.slickGrid.id["prepGrid"],Options.Variable.slickGrid.id["prepGrid"].getData());
    Options.Variable.slickGrid.id["prepGrid"].render();
}




Core.Diagram = {};
Core.Diagram.DiagramSetData = function(data){
	if(data.workflow != ""){
    	var obj = JSON.parse(data.workflow);
    	
    	if(obj.length != 0){
	    	for(var i=0; i<obj.length; i++){
	    		var beforeCheckDataOutput=[];
	    		var inputId = "";
	    		var modelId = $("g[data-index='"+obj[i].before_data_index+"']").attr("model-id");
	    		
	    		if(obj[i].before_data_type=="03"){
	    			if(!(String(obj[i].data)=="")){
	    				Options.Variable.Diagram.Global[modelId].Rdata = String(obj[i].data);
	    			}
	    		}else if(obj[i].before_data_type=="20"){
	    			if(!(obj[i].data=="")&& !(String(obj[i].before_feild_name)=="")){
	    				Options.Variable.Diagram.Global[modelId].rule_cont = obj[i].data;
	    				Options.Variable.Diagram.Global[modelId].Column = String(obj[i].before_feild_name);
	    			}
	    		}else if(obj[i].before_data_type=="30"){
	    			if(!(obj[i].data=="")&& !(String(obj[i].before_feild_name)=="")){
	    				Options.Variable.Diagram.Global[modelId].rule_cont = obj[i].data;
	    				Options.Variable.Diagram.Global[modelId].Column = String(obj[i].before_feild_name);
	    			}
	    		}else if(obj[i].before_data_type=="40"){
	    			if(!(obj[i].data=="")&& !(String(obj[i].before_feild_name)=="")){
	    				Options.Variable.Diagram.Global[modelId].rule_cont =  obj[i].data;
	    				Options.Variable.Diagram.Global[modelId].Column = String(obj[i].before_feild_name);
	    			}
	    		}else if(obj[i].before_data_type=="50"){
	    			if(!(obj[i].data=="")&& !(String(obj[i].before_feild_name)=="")){
	    				Options.Variable.Diagram.Global[modelId].rule_cont =  obj[i].data;
	    				Options.Variable.Diagram.Global[modelId].Column = String(obj[i].before_feild_name);
	    			}
	    		}else if(obj[i].before_data_type=="60"){
	    			if(!(obj[i].data=="")&& !(String(obj[i].before_feild_name)=="")){
	    				Options.Variable.Diagram.Global[modelId].rule_cont =  obj[i].data;
	    				Options.Variable.Diagram.Global[modelId].Column = String(obj[i].before_feild_name);
	    			}
	    		}else if(obj[i].before_data_type=="70"){
	    			if(!(obj[i].data=="")&& !(String(obj[i].before_feild_name)=="")){
	    				Options.Variable.Diagram.Global[modelId].rule_cont =  obj[i].data;
	    				Options.Variable.Diagram.Global[modelId].Column = String(obj[i].before_feild_name);
	    			}
	    		}else if(obj[i].before_data_type=="80"){
	    			if(!(obj[i].data=="")&& !(String(obj[i].before_feild_name)=="")){
	    				Options.Variable.Diagram.Global[modelId].rule_cont =  obj[i].data;
	    				Options.Variable.Diagram.Global[modelId].Column = String(obj[i].before_feild_name);
	    			}
	    		}else if(obj[i].before_data_type=="01"){
	    			if(!(String(obj[i].data)=="")){
	    				Options.Variable.Diagram.Global[modelId].Column = String(obj[i].data);
	    			}
	    		}
			}
    	}
	}
};
// 룰(Rule) 아이콘이 캔버스에 드래그 되어 등록 될 때 데이터 추출 후 반환
Core.Diagram.RuleInfo = function() {
	var elDiagram	= Options.Element.Diagram.Diagram.El();
	var ruleId		= elDiagram.attr('data-sel-id');
	var ruleSn		= elDiagram.attr('data-sel-rule');
	var ruleType	= elDiagram.attr('data-sel-type');
	return { RuleId : ruleId ,RuleSn : ruleSn ,RuleType : ruleType };
};

// 룰(Rule) 아이콘 목록 비동기 호출
Core.Diagram.RuleItem = function( responseFunction ,flag ) {
	var options = {
		url		: Options.Uri.Ajax.Process.RuleItem
	,	success	: function( d ,e ) { eval(responseFunction + '( d ,e ,' + flag + ' )'); }
	};$i.Ajax(options);
};

Core.Diagram.MemberItem = function( responseFunction ,flag ) {
	var options = {
		url		: Options.Uri.Ajax.Process.MemberItem
	,	success	: function( d ,e ) { eval(responseFunction + '( d ,e ,' + flag + ' )'); }
	};$i.Ajax(options);
};

// 룰(Rule) 아이콘 목록을 HTML Element를 생성하여 영역에 표출
Core.Diagram.RuleItemResponse = function( d ) {
	var elTarget	= Options.Element.Diagram.RuleItem.El();
	var dataList	= d.list;
	var tmpCls		= ['db' ,'rule' ,'filter' ,'Rscript' ,'D3chart'];
	var color		= Options.Variable.Diagram.RuleColorList;
	elTarget.empty();
	var elWrap		= $i('<div/>' ,{ class : 'wrapper' });
	for (var fx=1; fx<dataList.length; ++fx) {
		var tmpRuletype	= dataList[fx].rule_gb;
		var left		= parseInt((fx - 1) * 90) + 'px';
		var rabelText	= (2 == parseInt(dataList[fx].rule_bsis_data_gb)) ? dataList[fx].rule_name : null;
		var elItem	= $i('<a/>' ,{
			href			: '#'
		,	onclick			: 'return false;'
		,	class			: 'item ' + tmpCls[tmpRuletype]
		,	'data-type' 	: tmpRuletype
		,	'data-text'		: dataList[fx].rule_name
		,	'data-rule'		: dataList[fx].rule_sn
		,	'data-base'		: dataList[fx].rule_bsis_data_gb
		,	'data-icon'		: dataList[fx].rule_icon_uri
		,   'data-rule-opt'	: dataList[fx].rule_opt
		,   'data_rule_cont': dataList[fx].rule_cont
		,   'rule_gb'	: dataList[fx].rule_gb
		,	text			: rabelText
		,	title			: dataList[fx].rule_name
		}).css({ left : left ,background : 'url(' + dataList[fx].rule_icon_uri + '.png)' });
		
		elWrap.append(elItem);
	};
	var prev	= $i('<a/>' ,{
		href	: "#"
	,	class	: 'button-prev'
	,	text	: ''
	}).on('click' ,function(e){
		var elTargetItem = $i(this).parent().find('a.item');
		Core.Diagram.RuleItemMove( elTargetItem ,'prev' );
	});
	var next	= $i('<a/>' ,{
		href	: "#"
	,	class	: 'button-next'
	,	text	: ''
	}).on('click' ,function(e){
		var elTargetItem = $i(this).parent().find('a.item');
		Core.Diagram.RuleItemMove( elTargetItem ,'next' );
	});
	elTarget.append(prev).append(elWrap).append(next);
};

// 룰(Rule) 아이콘이 드래그 될때 발생하는 이벤트
Core.Diagram.RuleItemMove = function( elTargetItem ,moveType ) {
	var areaWidth	= Options.Element.Diagram.RuleItem.El().width();
	var pos			= ( 'prev'==moveType ) ? parseInt(elTargetItem.eq(0).css('left').replace('px' ,'')) : parseInt(elTargetItem.eq(elTargetItem.length-1).css('left').replace('px' ,''));
	if ( ( 'prev'==moveType && 0<=pos ) || ( 'next'==moveType && (pos+105)<=areaWidth ) ) {
		return;
	} else {
		for ( var fx=0; fx<elTargetItem.length; ++fx ) {
			var tmpElTargetItem	= elTargetItem.eq(fx);
			var left			= ( moveType=='next' ) ? parseInt(tmpElTargetItem.css('left').replace('px' ,'')) - 105 : parseInt(tmpElTargetItem.css('left').replace('px' ,'')) + 105;
			tmpElTargetItem.css('left' ,left + 'px');
		};
	};
};

// 다이어그램 옵션 정의
Core.Diagram.OptionsLink = function( options ) {
	var optionsLink	= {
		connector	: { name : 'rounded' }
	,	attrs	: {
			'.connection'	: {
				stroke			: '#0099ff'
			,	'stroke-width'	: 2
			}
		,	'.link-tools'			: { display : 'none' }
		,	'.marker-arrowheads'	: { display : 'none' }
		}
	};
	return $i.extend( optionsLink ,options );
};


/* ## Diagram 초기 생성 ## */
Core.Diagram.Create = function() {
	Options.Variable.Diagram['Graph'] = new joint.dia.Graph();	// 전역으로 사용할
																// 지역변수에 객체 생성
	var	optionsPaper		= {
		el					: document.getElementById(Options.Element.Diagram.Canvas.Id)
	,	model				: Options.Variable.Diagram.Graph
	,	width				: '100%'
	,	height				: '100%'
	/**,	gridSize			: 20
	,	drawGrid			: {
			name	: 'mesh'
		,	args	: { color : '#c54343' ,thickness : 1 ,markup : 'path' }
		}
	**/
	, 	background : {
		 image: '/fixadata-common/images/bg3.png'
		, repeat: 'background-repeat'
		, opacity: 1
	}
	,	defaultRouter		: { name : 'metro' }
	,	clickThreshold		: 1
	,	validateMagnet		: false
	};
	
	
	Options.Variable.Diagram['Paper'] = new joint.dia.Paper(optionsPaper);	// 전역으로
																			// 사용할
																			// 지역변수에
																			// 객체
																			// 생성

	// diagram의 x 표시 stage(paper 클릭시 close 처리함)
	Options.Variable.Diagram['Paper'].on('blank:pointerdown', function(cellView, evt) {
// console.log("cellView",cellView);
// console.log("evt",evt);
		$(".jointJS_shapes_close").hide();
	});
	
	
	// Diagram 요소 삭제 시 Line을 지워주기 위하여 객체에 이벤트 생성
	Options.Variable.Diagram.Graph.on( 'change:source change:target' ,function( link ) {
		if ( link.target === undefined || link.source === undefined ) {
			link.remove();
		};
	} );

	// Diagram 요소에서 마우스 우측 클릭 시 발생하는 이벤트 함수
	// 신규 버전은 context menu가 아니라 속성 방식을 사용하여 서비스함 이에 따라서 해당 코드는 주석 처리함 by
	// kwongunbo
	//2020.07.23 더블클릭과 중복되며 아이콘별 속성과 일치하지 않아 막음
//	Options.Variable.Diagram.Paper.on( 'element:contextmenu' ,function( cellView ,evt ,x ,y ) {
//		
//		var elTarget		= $i(evt.target);
//		var elTargetCell	= elTarget.parents('.joint-cell');
//		var ruleSn 			= $i(cellView.el).attr("data-rule");
//		var ruleType 		= $i(cellView.el).attr("data-type");
//		var ruleOpt			= $i(cellView.el).attr("data-rule-opt");
//		
//		
//		
//		
//		if ( !elTargetCell.is('.lock') ) {
//			if ( 4==parseInt(ruleType) ) {
//				Core.Output.Chart( 'Core.Output.ChartResponse' );
//			} else if ( 1==parseInt(ruleType) || 20==parseInt(ruleType) || 30==parseInt(ruleType)  || 40==parseInt(ruleType) ){
//				var ruleTypes	= parseInt(ruleType);
//				var options		= {
//					url		: Options.Uri.Ajax.Process.ColumnList
//				,	success	: function( d ,e ) {
//					
//						
//						Core.Diagram.Contextmenu.CreateSidebar( cellView ,evt ,x ,y ,elTarget ,ruleSn ,ruleTypes ,d )
//					}
//				};$i.Ajax(options);
//			} 
//			else 
//			{
//				Core.Diagram.Contextmenu.Create( cellView ,evt ,x ,y ,elTarget, ruleSn, ruleType );
//			};
//		};
//		Core.Diagram.Selector.Remove( cellView ,evt ,x ,y ,elTarget );
//	} );
	//



	/**
	 * diagram 요소 더블클릭 발생 이벤트 (dbclick)
	 */
	Options.Variable.Diagram.Paper.on( 'cell:pointerdblclick' ,function( cellView ,evt ,x ,y ) {
		var elTarget		= $i(evt.target);
		var elTargetCell	= elTarget.parents('.joint-cell');
		var ruleSn 			= $i(cellView.el).attr("data-rule");
		var ruleType 		= $i(cellView.el).attr("data-type");
		var ruleOpt 		= $i(cellView.el).attr("data-rule-opt");
		
// console.log("ruleOpt",ruleOpt);
		
		if ( !elTargetCell.is('.lock') ) {
			if ( 4==parseInt(ruleType) ) {
				Core.Output.Chart( 'Core.Output.ChartResponse' );
			} else if ( 1==parseInt(ruleType) || 20==parseInt(ruleType) || 30==parseInt(ruleType)  || 40==parseInt(ruleType)|| 50==parseInt(ruleType)|| 60==parseInt(ruleType) || 70==parseInt(ruleType) || 80==parseInt(ruleType)){
				var ruleTypes	= parseInt(ruleType);
				var options		= {
					url		: Options.Uri.Ajax.Process.ColumnList
				,	success	: function( d ,e ) 
					{
						if($("#arHistory").is("._none")==true)
						{
							Core.Panel.Close($("#arHistory .close"));
						}
						if(1==parseInt(ruleType))
						{
							Core.Diagram.Contextmenu.CreateSidebar(cellView ,evt ,x ,y ,elTarget ,ruleSn ,ruleTypes ,d )
						}
						else if(20==parseInt(ruleType))
						{
							Core.Diagram.Contextmenu.WhetherCreateSidebar( cellView ,evt ,x ,y ,elTarget ,ruleSn ,ruleTypes ,d )
						}
						else if(30==parseInt(ruleType))
						{
							Core.Diagram.Contextmenu.RangeCreateSidebar( cellView ,evt ,x ,y ,elTarget ,ruleSn ,ruleTypes ,d )
						}
						else if(40==parseInt(ruleType)) // 논리구문
						{
							Core.Diagram.Contextmenu.LogicalSyntaxCreateSidebar( cellView ,evt ,x ,y ,elTarget ,ruleSn ,ruleTypes ,d )
						}
						else if(50==parseInt(ruleType)) // 사용자 정의구문
						{
							Core.Diagram.Contextmenu.CustomCreateSidebar( cellView ,evt ,x ,y ,elTarget ,ruleSn ,ruleTypes ,d )
						}
						else if(60==parseInt(ruleType)) // 사용자 정의구문
						{
							Core.Diagram.Contextmenu.CodeCreateSidebar( cellView ,evt ,x ,y ,elTarget ,ruleSn ,ruleTypes ,d )
						}
						else if(70==parseInt(ruleType)) // 사용자 정의구문
						{
							Core.Diagram.Contextmenu.CreateSidebar( cellView ,evt ,x ,y ,elTarget ,ruleSn ,ruleTypes ,d )
						}
						else if(80==parseInt(ruleType)) //클라우드 워드
						{
							Core.Diagram.Contextmenu.CloudWordCreateSidebar(cellView ,evt ,x ,y ,elTarget ,ruleSn ,ruleTypes ,d )
						}	
						
					}
				};$i.Ajax(options);
			} else {
				Core.Diagram.Contextmenu.Create( cellView ,evt ,x ,y ,elTarget, ruleSn, ruleType );
			};
		};
		Core.Diagram.Selector.Remove( cellView ,evt ,x ,y ,elTarget );
		
		/**
		 * //popup 을 통한 컬럼 선택 기능 disabled by kwon var elTarget = $i(evt.target);
		 * var elTargetCell = elTarget.parents('.joint-cell'); var ruleSn =
		 * $i(cellView.el).attr("data-rule"); var ruleType =
		 * $i(cellView.el).attr("data-type");
		 * 
		 * if ( !elTargetCell.is('.lock') ) { if ( 4==parseInt(ruleType) ) {
		 * Core.Output.Chart( 'Core.Output.ChartResponse' ); console.log('4type : '
		 * ,'ok'); } else { console.log('order type : ' ,'ok');
		 * Core.Diagram.Contextmenu.Create( cellView ,evt ,x ,y ,elTarget,
		 * ruleSn, ruleType ); }; }; Core.Diagram.Selector.Remove( cellView ,evt
		 * ,x ,y ,elTarget );
		 * 
		 * var elTarget = $i(evt.target); var elTargetCell =
		 * elTarget.parents('.joint-cell'); var ruleSn =
		 * $i(cellView.el).attr("data-rule"); var ruleType =
		 * $i(cellView.el).attr("data-type"); if ( !elTargetCell.is('.lock') ) {
		 * if ( 4==parseInt(ruleType) ) { Core.Output.Chart(
		 * 'Core.Output.ChartResponse' ); } else if ( 1==parseInt(ruleType) ){
		 * var ruleTypes = parseInt(ruleType); var options = { url :
		 * Options.Uri.Ajax.Process.ColumnList , success : function( d ,e ) {
		 * Core.Diagram.Contextmenu.CreateSidebar( cellView ,evt ,x ,y ,elTarget
		 * ,ruleSn ,ruleTypes ,d ) } };$i.Ajax(options); } else {
		 * Core.Diagram.Contextmenu.Create( cellView ,evt ,x ,y ,elTarget,
		 * ruleSn, ruleType ); }; }; Core.Diagram.Selector.Remove( cellView ,evt
		 * ,x ,y ,elTarget );
		 */
	} );

	// Diagram 요소에서 마우스를 눌렀을 때 또는 비어 있는 공간에서 마우스를 눌렀다가 올렸을 때 발생하는 이벤트 함수
	Options.Variable.Diagram.Paper.on( 'blank:pointerup cell:pointerdown' ,function( cellView ,evt ,x ,y ) {
		var elTarget		= $i(evt.target);
		var elTargetCell	= elTarget.parents('.joint-cell');
		if ( !elTargetCell.is('.lock') && !(elTarget.is('rect') || elTarget.is('image') || elTarget.is('text') || elTarget.is('tspan')) ) {
// Core.Diagram.Selector.Remove( cellView ,evt ,x ,y ,elTarget );
		};
	} );
	Options.Variable.Diagram.Paper.on( 'cell:pointerdown' ,function( cellView ,evt ,x ,y ) {
		var modelId = cellView.model.id;
		Options.dragId = ""
		var elTarget		= $i(evt.target);
		if(Options.keyVal == true){
			if ((evt.button == 2) || (evt.which == 3)){
				$("#diagram_contextMenu").css("display","none");
				$("#itmDiagram a.jointJS_shapes_close#"+modelId+"").css("display","none");
			}else{
				$("#diagram_contextMenu").css("display","none");
				Options.mouseClick = $("#itmDiagram a.jointJS_shapes_close#"+modelId+"").css("display");
				Options.Element.Diagram.Diagram.El().find("#"+modelId+"").remove().end().find("#"+modelId+"").remove();
			}
		}else{
			if ((evt.button == 2) || (evt.which == 3)){
				$("#itmDiagram a.jointJS_shapes_close#"+modelId+"").css("display","none");
			}else{
				Core.Diagram.Selector.Remove( cellView ,evt ,x ,y ,elTarget );
			}
		}
		if ( document.addEventListener ) {
		    document.addEventListener("mousemove",resultFun,false);
		} else if ( document.attachEvent ) {
		    document.attachEvent("onmousemove",resultFun);
		} else {
		    document.onmousemove = resultFun;
		}
		Options.checkPointX = true;
		Options.checkPointY = true;
		

	} );
	// Diagram 요소에서 마우스를 눌렀다 올렸을 때 발생하는 이벤트 함수
	Options.Variable.Diagram.Paper.on( 'cell:pointerup' ,function( cellView ,evt ,x ,y ) {
		var modelId = cellView.model.id;
		Options.dragId = modelId;
		var elTarget		= $i(evt.target);
		var elTargetCell	= elTarget.parents('.joint-cell');
		
			if(!elTargetCell.is('.lock') && (elTarget.is('rect') || elTarget.is('image') || elTarget.is('text') || elTarget.is('tspan')) ) {
				var target = document.getElementById('itmDiagramCanvas');
				var clientRect = target.getBoundingClientRect(); // DomRect 구하기 (각종 좌표값이 들어있는 객체)
				var relativeTop = clientRect.top; // Viewport의 시작지점을 기준으로한 상대좌표 Y 값.
				var scrolledTopLength = window.pageYOffset; // 스크롤된 길이
				var absoluteTop = scrolledTopLength + relativeTop; // 절대좌표
			    	var xY = evt.clientX +  " * "  + (evt.clientY-absoluteTop) ;
				var result = evt.clientY-absoluteTop;
				var result2 = evt.clientX;
				if(Options.keyVal == true){
					if ((evt.button == 2) || (evt.which == 3) && evt.keyCode == 16) {
							$("#diagram_contextMenu")
						    .css("top",result)
						    .css("left", result2)
						    .css("display","");
					}else{
						$("#diagram_contextMenu").css("display","none");
					}
				}else{
					$("#diagram_contextMenu").css("display","none");
				}
				
				
				Core.Diagram.Selector.Create( cellView ,evt ,x ,y ,elTarget);
				var ruleSn 			= $i(cellView.el).attr("data-rule");
				var ruleType 		= $i(cellView.el).attr("data-type");
				var ruleText 		= $i(cellView.el).attr("data-name");

				Options.Element.Diagram.Diagram.El().attr("data-sel-rule"	,ruleSn);
				Options.Element.Diagram.Diagram.El().attr("data-sel-type"	,ruleType);
				Options.Element.Diagram.Diagram.El().attr("data-sel-id"		,cellView.model.id);
				Options.Element.Diagram.Diagram.El().attr("data-sel-name"	,ruleText);
			}
			// shift누른 상태에서 작업->클릭시 글자 지우기
			if(Options.mouseClick =="none" || Options.mouseClick == undefined ){
				if ((evt.button == 2) || (evt.which == 3)){
					
				}else{
					if(Options.keyVal == true){
						$("#itmDiagram a.jointJS_shapes_close#"+modelId+"").css("display","");
					}
				} 
				 
			}else if(Options.mouseClick == "block"){
				if ((evt.button == 2) || (evt.which == 3)){
					
				}else{
					if(Options.keyVal == true){
						$("#itmDiagram a.jointJS_shapes_close#"+modelId+"").css("display","none");
					}
				}
			};
			
		Options.checkPointX = false;
		Options.checkPointY = false;
	});
	


		
	// ### JointJS Model 사용자 정의 시작
	var optionsMarkup	= '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>';
	var optionsRect		= { 'stroke-width' : 0 ,fill : 'transparent' ,rx : 8 };
	var optionsCircle	= { 'stroke-width' : 0 ,fill : '#2b2b2b' };
	var optionsLabel	= { width: '60px' ,fill : '#9cc4ff' ,'ref-y' : 30 ,'font-family' : '돋움,Dotum' ,'font-size' : '1em' };
	var optionsPort		= {
		'.port-label'	: { fill : '#969696' ,'font-family' : '돋움,Dotum' ,'font-size' : '1em' }
	,	'.port-body'	: { fill : '#0099ff' ,stroke : '#ababab' ,'stroke-width' : 0 ,r : 8 }
	};
	var optionsPortIn		= {
		position	: { name : 'left' }
	,	attrs		: optionsPort
	,	label		: {
			position: { name : 'left' ,args : { y: 10 } }
		}
	};
	var optionsPortOut		= {
		position	: { name : 'right' }
	,	attrs		: optionsPort
	,	label		: {
			position: { name : 'right' ,args : { y: 10 } }
		}
	};
	var optionsInPort		= { fill : '#5b5b5b' };
	var optionsOutPort		= { fill : '#212121'};
	var optionsImage		= {
		'xlink:href'	: Options.Uri.Root.Images.RuleBasic		// 기본 이미지
	,	width			: 70
	,	height			: 70
	,	ref				: 'rect'
	,	'ref-x'			: .5
	,	'ref-y'			: .5
	,	'x-alignment'	: 'middle'
	,	'y-alignment'	: 'middle'
	};
	var optionsMyModel	= {
		markup		:	optionsMarkup
	,	defaults	:	joint.util.deepSupplement( {
			type	:	'devs.MyImageModel'
		,	size	:	{ width : 70 ,height : 70 }
		,	attrs	:	{
				rect				: optionsRect
			,	image				: optionsImage
			,	circle				: optionsCircle
			,	'.label'			: optionsLabel
			}

		} ,joint.shapes.devs.Model.prototype.defaults )
	};

	joint.shapes.devs.MyImageModel		= joint.shapes.devs.Model.extend( optionsMyModel );
	joint.shapes.devs.MyImageModelView	= joint.shapes.devs.ModelView;
	// ### JointJS Model 사용자 정의 끝

	var height	= Options.Element.Diagram.Canvas.El().outerHeight() / 2 - 35;

	// ### 최초 DB Rect 추가 시작
	var model	= new joint.shapes.devs.MyImageModel( {
		position	: { x : 50 ,y : height }
	,	attrs		: {
			image		: { 'xlink:href' : Options.Uri.Root.Images.RuleDatabase }
		,	'.label'	: null
		}
	,	Use			: {
			Index		: Options.Variable.Diagram.Cells.length
		,	Rule		: ''
		,	Name		: 'DB'
		,	RuleType	: '09'
		,	RuleBase	: '01'
		}
	} );
	Options.Variable.Diagram.Cells.push( model );
	Options.Variable.Diagram.Graph.addCells( Options.Variable.Diagram.Cells );
	V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el ).addClass('lock');
	Core.Diagram.GlobalAdd( model.id ,'' ,'09' );
	// ### 최초 DB Rect 추가 끝

	var dataHistory = Options.Variable.Diagram.Cells;

	Options.Variable.History.Diagram.Global[0]	= { Id  : model.id ,Rule : '' ,Type : '09' ,Column : '' ,UseDefineQuery : '' ,Rdata : '' };
	Options.Variable.History.Diagram.Rule[0]	= [];
	for ( var fx=0; fx<dataHistory.length; ++fx ) {
		Options.Variable.History.Diagram.Rule[0][fx] = dataHistory[fx];
	};

	
	
	
// if ( 0<Options.Variable.Diagram.Cells.length ) { // Project Open 시 저장된
// History가 있을 경우
// Core.Diagram.HistoryAdd( Options.Variable.Diagram.Cells );
// };
	if ( 0<Options.Variable.Diagram.Cells.length ) {				// Project
																	// Open 시
																	// 저장된
																	// History가
																	// 있을 경우
		Core.Diagram.HistoryAdd( Options.Variable.Temp["Cells"] );
	};
};

/* ### Project Open 시 Diagram History가 있을 경우 요소를 생성하는 함수 ### */
Core.Diagram.HistoryAdd = function( d ) {
	
	if(d !=null)
	{
		var color			= Options.Variable.Diagram.RuleColorDiagram;	// Diagram
																			// 요소에
																			// 사용되는
																			// 색상
																			// 배열
		for ( var fx=1; fx<d.length; ++fx ) {
			var element		= d[fx];
			if ( 'devs.Link' != element.type ) {
				var y			= element.position.y;
				var x			= element.position.x;
				var width		= element.size.width;
				var height		= element.size.height;
		
				var rule		= element.Use.Rule;
				var ruleName	= element.Use.Name;
				var ruleType	= element.Use.RuleType;
				var ruleBase	= element.Use.RuleBase;
				var ruleIcon	= element.attrs.image['xlink:href'];
		
				var rabelText		= (2 == parseInt(ruleBase)) ? { text : ruleName } : null;
		
				var model			= new joint.shapes.devs.MyImageModel({
					position	: { x : x ,y : y }
				,	attrs		: {
						image		: { 'xlink:href' : ruleIcon }
					,	'.label'	: rabelText
					,	rect		: { fill : 'transparent' }
					}
				,	Use			: {
						Index		: Options.Variable.Diagram.Cells.length
					,	Rule		: rule
					,	Name		: ruleName
					,	RuleType	: ruleType
					,	RuleBase	: ruleBase
					}
				});
			
				Options.Variable.Diagram.Cells.push(model);
				Options.Variable.Diagram.Graph.addCells( Options.Variable.Diagram.Cells );
			
				V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el ).attr( 'data-index'	,Options.Variable.Diagram.Cells.length	);
				V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el ).attr( 'data-rule'	,rule									);
				V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el ).attr( 'data-name'	,ruleName								);
				V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el ).attr( 'data-type'	,ruleType								);
				V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el ).attr( 'data-base'	,ruleBase								);
			
				var globalKey	= Object.keys( Options.Variable.Diagram.Global );
				var globalId	= globalKey[globalKey.length-1];
				var optionsLink = Core.Diagram.OptionsLink({
					source		: { id : globalId }
				,	target		: { id : model.id }
				,	router		: { name : 'orthogonal' }
				,	Use			: {
						Index		: Options.Variable.Diagram.Cells.length
					,	Rule		: '0'
					,	RuleType	: '08'
					,	RuleBase	: '01'
					}
				});
				var link		= new joint.shapes.devs.Link( optionsLink );
				Options.Variable.Diagram.Cells.push(link);
				Options.Variable.Diagram.Graph.addCells( link );
				Core.Diagram.GlobalAdd( model.id ,element.Use.Rule ,ruleType );
			
				Core.History.Add({ Type : 'diagram' ,RuleId : model.id ,RuleSn : element.Use.Rule ,RuleName : element.Use.Name ,RuleType : ruleType });
			};
		};
	
	};
	
};
Core.Diagram.TemplateSaveForm = function(){
	// ### 프로젝트 고유값이 없을 경우 신규 저장
	var objModal	= Core.Modal.Background();
	var elContainer	= $i('<div/>' ,{
		id		: Options.Element.Template.SaveForm.Id
	});
	var elTitle		= $i('<div/>' ,{
		class	: 'title'
// , text : lang_return("fixa.core.title012")//'템플릿 저장'
		});
	var elContent	= $i('<div/>' ,{
		class	: 'content'
	});
	var text  =  "템플릿 명 :"; 
	var input1		= $('<input/>'	,{ id : 'rule_name' ,name : 'rule_name' ,type : 'text' ,'data-format' : 'none' ,value : '' });
	var form	= $('<form/>'	,{ id: 'templateSaveFrm' , name : 'templateSaveFrm' ,method : 'post' }).append(text).append(input1);
	
	
	elContent.html(form);

	var elButtonOk	= $i('<a/>' ,{
		class	: 'button'
	,	text	: 'Save'// 'Save'
	,	href	: '#'
	}).on('click' ,function() {
		
		
		if($.trim($("#rule_name").val())=="")
		{
			alert_message(lang_return("fixa.core.title243"));//템플릿 명은 필수입력사항입니다.
		}
		else
		{
			var Template_diagramInfo = new Array();
			var length = $(".jointJS_shapes_seletor").length;
			for(var i=0; i<$(".jointJS_shapes_seletor").length; i++){
				var Template_diagramData = new Object();
				var model_id = $(".jointJS_shapes_seletor:eq("+i+")").attr("id");
				Template_diagramData.data_rule = $("g[model-id="+model_id+"]").attr("data-rule");
				Template_diagramData.data_type = $("g[model-id="+model_id+"]").attr("data-type");
				Template_diagramData.data_icon = $("g[model-id="+model_id+"]").children().children("image").attr("xlink:href").replace("-on.png","");
				Template_diagramData.data_name = $("g[model-id="+model_id+"]").attr("data-name");
				Template_diagramData.data_rule_opt = $("g[model-id="+model_id+"]").attr("data-rule-opt");
				if($("g[model-id="+model_id+"]").attr("data-type") == "03"){
	// diagramData.before_feild_name =
	// Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column;
					Template_diagramData.data = Options.Variable.Diagram.Global[model_id].Rdata.split(",");
				// 사용자 정의 및 정규식 체크박스 데이터
				}else if($("g[model-id="+model_id+"]").attr("data-type")== "01"){
					Template_diagramData.data = Options.Variable.Diagram.Global[model_id].Column.split(",");
				// 차트 데이터
				}else if($("g[model-id="+model_id+"]").attr("data-type") == "04"){
					Template_diagramData.data = "";
				}else if($("g[model-id="+model_id+"]").attr("data-type") == "20"){
					Template_diagramData.feild_name = Options.Variable.Diagram.Global[model_id].Column;
					Template_diagramData.data = Options.Variable.Diagram.Global[model_id].rule_cont;
				}else if($("g[model-id="+model_id+"]").attr("data-type") == "30"){
					Template_diagramData.feild_name = Options.Variable.Diagram.Global[model_id].Column;
					Template_diagramData.data = Options.Variable.Diagram.Global[model_id].rule_cont;
				}else if($("g[model-id="+model_id+"]").attr("data-type") == "40"){
					Template_diagramData.feild_name = Options.Variable.Diagram.Global[model_id].Column;
					Template_diagramData.data = Options.Variable.Diagram.Global[model_id].rule_cont;
				}else if($("g[model-id="+model_id+"]").attr("data-type") == "50"){
					Template_diagramData.feild_name = Options.Variable.Diagram.Global[model_id].Column;
					Template_diagramData.data = Options.Variable.Diagram.Global[model_id].rule_cont;
				}else if($("g[model-id="+model_id+"]").attr("data-type") == "60"){
					Template_diagramData.feild_name = Options.Variable.Diagram.Global[model_id].Column;
					Template_diagramData.data = Options.Variable.Diagram.Global[model_id].rule_cont;
				}else if($("g[model-id="+model_id+"]").attr("data-type") == "70"){
					Template_diagramData.feild_name = Options.Variable.Diagram.Global[model_id].Column;
					Template_diagramData.data = Options.Variable.Diagram.Global[model_id].rule_cont;
				}else if($("g[model-id="+model_id+"]").attr("data-type") == "80"){
					Template_diagramData.feild_name = Options.Variable.Diagram.Global[model_id].Column;
					Template_diagramData.data = Options.Variable.Diagram.Global[model_id].rule_cont;
				}
				else{
					Template_diagramData.feild_name = Options.Variable.Diagram.Global[model_id].Column;
					Template_diagramData.data = Options.Variable.Diagram.Global[model_id].rule_cont;
				}
				
				
				Template_diagramInfo.push(Template_diagramData);
			}
			var gridData = "";
			gridData = {
					 rule_sn : JSON.stringify(Template_diagramInfo)
					, rule_name : $("#rule_name").val()
			}
			var jsonData = JSON.stringify(gridData);
			
			$.ajax({
			url: '/ajax/templateSave.fd' 
				,crossDomain: true
				,contentType: 'application/json'
				,async: false
				,type: 'POST'
				,data: jsonData
				,dataType: 'json'
				,success: function(data) {
					if(data.result=="success")
					{
						
						Core.Modal.Close();
						Core.Diagram.RuleItem( 'Process.RuleItemResponse' ,true );
					
					}
				}
			});
		}
	});

	var elButtonCancle	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title006")// '취소'
	,	href	: '#'
	}).on('click' ,function() {
		Core.Modal.Close();
		return false;
	} );
	var elButtonBox	= $i('<div/>' ,{
		class	: 'itmButton'
	}).append(elButtonCancle).append(elButtonOk);
	
	elTitle.append($("<div/>",{"class":"tab_btn_left"}));
	elTitle.append($("<a/>",{"text":'템플릿 저장'}));
	elTitle.append($("<div/>",{"class":"tab_btn_right"}));
	
	elContainer.append(elTitle).append(Core.tabbar4()).append(elContent).append(elButtonBox);
	objModal.html(elContainer);
	Options.Element.Global.Inni.El().append(objModal);
	Options.Element.Template.SaveForm.El().SetForm();
};
Core.Diagram.TemplateSave = function(data){
	$("#diagram_contextMenu").css("display","none");
	
	confirmBox(lang_return("fixa.core.title244"),function(data){
		if(data==true){
			Core.Diagram.TemplateSaveForm();	
		}else{
			return;
		}
		
	})

	
};
Core.Diagram.Add = function( ui ) {
	Options.dragId = ""
	Core.Diagram.SetCellIndex();
	var color			= Options.Variable.Diagram.RuleColorDiagram;
	var element			= $i(ui.draggable);
	var offsetTarget	= Options.Element.Diagram.Canvas.El().offset();
	var yTarget			= offsetTarget.top;
	var xTarget			= offsetTarget.left;
	var y				= (ui.offset.top - yTarget);
	// 다이어그램 x좌표값을 기본 0으로 초기화
	var x = 0;
	// 템플릿 아이콘일경우
	if(element.attr("rule_gb") == "100"){
		// 전역변수템플릿이 최초일때
		if(Options.template_x == 0){
			// 전역변수 템플릿 x 는 사용자가 드래그한 위치
			Options.template_x = (ui.offset.left - xTarget);
		// 전역변수가 최초가 아닐때
		}else{
			// 전역변수 템플릿x 는 이전에 사용자가 드래그한 위치에서 +120
			Options.template_x = Options.template_x + 120;
		}
		// 전역변수 템플릿 x 는 x변수값으로 세팅
		x				= Options.template_x;
	}else{
		// x변수값은 사용자가 드래그한 위치
		x				= (ui.offset.left - xTarget);
	}
	
	var width			= element.outerWidth();
	var height			= element.outerHeight();
	var ruleIndex		= Options.Variable.Diagram.Cells.length;
	var ruleType		= element.attr('data-type');
	var ruleBase		= element.attr('data-base');
	var rule			= element.attr('data-rule');
	var name			= element.attr('data-text');
	var ruleIcon		= element.attr('data-icon') + '-on.png';
	var ruleOpt			= element.attr('data-rule-opt');
	
	if(ruleOpt == null){
		ruleOpt = "0";
	}
	var rabelText		= (2 == parseInt(ruleBase)) ? { text : element.attr('data-text') } : null;
	var model			= new joint.shapes.devs.MyImageModel({
		position	: { x : x ,y : y }
	,	attrs		: {
			image		: { 'xlink:href' : ruleIcon }
		,	'.label'	: rabelText
		,	rect		: { fill : 'transparent' }	// color[parseInt(ruleType)]
													// }
		}
	,	Use			: {
			Index		: Options.Variable.Diagram.Cells.length
		,	Rule		: element.attr('data-rule')
		,	Name		: element.attr('data-text')
		,	RuleOpt		: ruleOpt
		,	RuleType	: ruleType
		,   x           : x
		,   y           : y
		}
// , inPorts : [ 'in' ]
// , outPorts : [ 'out' ]
	});

	Options.Variable.Diagram.Cells.push(model);
	Options.Variable.Diagram.Graph.addCells( Options.Variable.Diagram.Cells );

	V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el ).attr( 'data-index'		,Options.Variable.Diagram.Cells.length	);
	V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el ).attr( 'data-rule'		,element.attr('data-rule')				);
	V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el ).attr( 'data-type'		,element.attr('data-type')				);
	V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el ).attr( 'data-name'		,element.attr('data-text')				);
	V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el ).attr( 'data-rule-opt'	,ruleOpt			);
	

	var globalKey	= Object.keys( Options.Variable.Diagram.Global );
	var globalId	= globalKey[globalKey.length-1];
	var optionsLink = Core.Diagram.OptionsLink({
		source		: { id : globalId } // ,port : 'out' }
	,	target		: { id : model.id } // ,port : 'in' }
	,	router		: { name : 'orthogonal' }
	,	Use			: {
			Index		: Options.Variable.Diagram.Cells.length
		,	Rule		: element.attr('data-rule')
		,	RuleType	: element.attr('data-type')
		}
	});
	var link		= new joint.shapes.devs.Link( optionsLink );
	link.vertexMarkup = '<g class="marker-vertex-group" transform="translate(<%= x %>, <%= y %>)">'
        +'</g>';
	Options.Variable.Diagram.Cells.push(link);
	Options.Variable.Diagram.Graph.addCells( link );
	Core.Diagram.GlobalAdd( model.id ,element.attr('data-rule') ,element.attr('data-type') );
//	Options.Variable.Diagram.Global[model.id].ChkRule = "";
	Core.Diagram.IndexSetting();
	$("g[model-id='"+model.id+"']").attr("transformX",x);
	$("g[model-id='"+model.id+"']").attr("transformY",y);
// $("g[model-id='"+model.id+"']").attr("ui",ui);
// var data = new Object();
// data.ui = "1"+element;
// data.modelId = model.id;
// // data.index = Options.Variable.Diagram.Cells.length;
// data.index = $("g[model-id='"+model.id+"']").attr("data-index");
// data.type = ruleType;
// data.x = $("g[model-id='"+model.id+"']").attr("transformX");
// data.y = $("g[model-id='"+model.id+"']").attr("transformY");
// data.icon = ruleIcon;
// data.rule = rule;
// data.opt = ruleOpt;
// data.name = element.attr('data-text');
// data.Column = Options.Variable.Diagram.Global[model.id].Column;
// data.rule_cont = Options.Variable.Diagram.Global[model.id].rule_cont;
// if(ruleType == "20"){
// data.Column = Options.Variable.Diagram.Global[model.id].Column;
// data.rule_cont = Options.Variable.Diagram.Global[model.id].rule_cont;
// } else if(ruleType == "30"){
// data.Column = Options.Variable.Diagram.Global[model.id].Column;
// data.rule_cont = Options.Variable.Diagram.Global[model.id].rule_cont;
// } else if(ruleType == "40"){
// data.Column = Options.Variable.Diagram.Global[model.id].Column;
// data.rule_cont = Options.Variable.Diagram.Global[model.id].rule_cont;
// } else if(ruleType == "50"){
// data.Column = Options.Variable.Diagram.Global[model.id].Column;
// data.rule_cont = Options.Variable.Diagram.Global[model.id].rule_cont;
// } else{
// alert(Options.Variable.Diagram.Global[model.id].Column);
// data.Column = Options.Variable.Diagram.Global[model.id].Column;
// // data.rule_cont = Options.Variable.Diagram.Global[model.id].rule_cont;
// }
// Options.beforeUi.push(data);
	if(element.attr("rule_gb") == "100"){
		Options.template_modelId.push(model.id);
	}
	Core.History.Add({ Type : 'diagram' ,RuleId : model.id ,RuleSn : element.attr('data-rule') ,RuleName : element.attr('data-text') ,RuleType : element.attr('data-type') });
};

Core.Diagram.GlobalAdd = function( modelId1 ,dataRule ,dataType ) {
	Options.Variable.Diagram.Global[modelId1] = { Id  : modelId1 ,Rule : dataRule ,Type : dataType ,Column : '' ,UseDefineQuery : '' ,Rdata : '' ,TimeChart : '' };
};

Core.Diagram.Remove = function( cellView ,evt ,x ,y ,elTarget ) {
	if ( !elTarget.is('.lock') ) {
		var cellLength	= elTarget.attr('data-index');
		var modelId		= cellView.model.id;
		Core.Diagram.Contextmenu.Remove( cellView ,evt ,x ,y ,elTarget );
		Core.Diagram.Selector.Remove( cellView ,evt ,x ,y ,elTarget );
		cellView.model.remove();
		$("#ClosePropertiesSidebar").click();
		// 다이어 그램 재설정
		
		var tmpModelIdBef ,tmpModelIdAft ,tmpMatch = false;
		$i.each( Options.Variable.Diagram.Global ,function( key ,value ) {
			if ( tmpMatch ) {
				tmpModelIdAft	= key;
				return false;
			};
			if ( modelId == key ) {
				tmpMatch		= true;
			} else {
				tmpModelIdBef	= key;
			};
		} );

		var elDiagram		= Options.Element.Diagram.Diagram.El();

		
		$i.each(Options.Variable.Diagram.Cells ,function( idx ,value) {
			if ( modelId == value.id ) {
				tmpMatch		= true;

				Options.Variable.Diagram.Cells.splice( idx+1 ,1 );
				Options.Variable.Diagram.Cells.splice( idx+2 ,1 );
				var leng = Options.Variable.Diagram.Cells.length ,tmpCellArr = [] ,tmpIdx;
				if ( $i.ChkBlankNot(tmpModelIdAft) ) {
					var optionsLink = {
						source		: { id : tmpModelIdBef }
					,	target		: { id : tmpModelIdAft }
					,	router		: { name : 'orthogonal' }
					,	Use			: {
							Index		: null
						,	Rule		: elDiagram.attr('data-sel-rule')
						,	RuleType	: elDiagram.attr('data-sel-type')
						}
					};
					for ( var fx=0; fx<leng; ++fx ) {
						var tmpId = Options.Variable.Diagram.Cells[fx].id;
						if ( modelId == tmpId ) {
							var tmpInt = parseInt(fx + 2);
							tmpIdx = (leng>tmpInt) ? tmpInt : leng;
						};

						if ( fx==tmpIdx ){
							optionsLink.Use['Index'] = tmpIdx
							optionsLink = Core.Diagram.OptionsLink(optionsLink);
							var link	= new joint.shapes.devs.Link( optionsLink );
							Options.Variable.Diagram.Graph.addCells( link );
							tmpCellArr.push(link);
						};
						if ( modelId != tmpId) {
							tmpCellArr.push(Options.Variable.Diagram.Cells[fx]);
						};

					};

					if ( leng<=tmpIdx ){
						optionsLink.Use['Index'] = tmpIdx
						optionsLink	= Core.Diagram.OptionsLink(optionsLink);
						var link	= new joint.shapes.devs.Link( optionsLink );
						Options.Variable.Diagram.Graph.addCells( link );
						tmpCellArr.push(link);
					};
				} else {
					for ( let fx=0; fx<Options.Variable.Diagram.Cells.length; ++fx ) {
						var tmpId = Options.Variable.Diagram.Cells[fx].id;
						if ( modelId != tmpId ) {
							tmpCellArr.push(Options.Variable.Diagram.Cells[fx]);
						};
					};
				};
				Options.Variable.Diagram['Cells'] = [];
				for ( let fx=0; fx<tmpCellArr.length; ++fx ) {
					Options.Variable.Diagram.Cells.push(tmpCellArr[fx]);
				};
				return false;
			};
		});
		Options.dragId = "";
		delete Options.Variable.Diagram.Global[modelId];
		
		Core.History.Add({ Type : 'diagram' ,RuleId : modelId ,RuleSn : elDiagram.attr('data-sel-rule') ,RuleName : elDiagram.attr('data-sel-name')+"===> 삭제" ,RuleType : elDiagram.attr('data-sel-type') });
		Prep.DiagramUpdateData();
		Core.Diagram.settingRecent();
// Core.Diagram.IndexSetting();
// $.ajax({
// url: '/collect/setProjectAndDataSn2.fd'
// ,async: false
// ,type: 'post'
// ,success: function(data) {
// Core.Diagram.Reset2();
// if(data.workflow != ""){
// var obj = JSON.parse(data.workflow);
// if(obj.length != 0){
// for(var i=0; i<obj.length; i++){
// Core.Diagram.Add2(obj[i].before_data_y,obj[i].before_data_x,obj[i].before_data_icon,obj[i].before_data_rule,obj[i].before_data_rule_opt,obj[i].before_data_name,obj[i].before_data_index,obj[i].before_data_type);
// }
// }
// diagramfirst = true;
// Core.Diagram.DiagramSetData(data);
// }else{
// diagramfirst = true;
// }
// }
// });
		
// var maxli = $("#itmHistoryDiagram li").length;
// $("#"+maxli+"").click();
	};
	
};
Core.Diagram.IndexSetting = function(){
	var diagramSize = $("image").length;
	if(diagramSize > 1){
		for(var i=0; i<$("image").length; i++){
			if(i != 0){
				$("image:eq("+i+")").parent().parent().attr("data-index",(i*2));
			}
		}
		
	}
};
Core.Diagram.LinkIndexSetting = function(){
	var diagramLinkSize = $(".joint-link").length;
	if(diagramLinkSize > 0){
		for(var i=0; i<diagramLinkSize; i++){
// $("image:eq("+i+")").parent().parent().attr("data-index",(i*2));
			$(".joint-link:eq("+i+")").attr("data-type","devs.Link").removeAttr("data-rule").removeAttr("data-index");
		}
		
	}
};

Core.Diagram.Reset = function(init) {
	Options.Element.Diagram.Canvas.El().empty();
	Core.Diagram.Selector.Remove();
	$i.extend( Options.Variable.Diagram ,{
		Graph	: null
	,	Paper	: null
	,	Cells	: []
	,	Global	: {}
	} );
	$i.extend( Options.Variable.Chart ,{
		Diagram	: {
			Type : 'stick'
		,	Data : {}
		,	Rule : ''
		}
	,	Output	: {
			Type : 'stick'
		,	Data : {}
		,	Rule : ''
		}
	} );
	Core.Diagram.Create();
	
	if(init==false)
	{
		Core.Console.Write( { Type : 'Info' ,KeyCode : 'Mssg1502' ,Message : '' } );
	}
	Options.Variable.History['Grid']			= [];
	Options.Variable.History.Diagram['Rule']	= [];
	Options.Variable.History.Diagram['Global']	= [];
	Options.Variable.History.Diagram['DataSel']	= { SelRule : '' ,SelId : '' ,SelType : '' };
	Options.Element.Diagram.HistoryDiagram.El().find('a.item').eq(0).addClass('now').end().end().find('a.u').parent().remove();
};
Core.Diagram.Reset2 = function(init) {
	Options.Element.Diagram.Canvas.El().empty();
	Core.Diagram.Selector.Remove();
	$i.extend( Options.Variable.Diagram ,{
		Graph	: null
	,	Paper	: null
	,	Cells	: []
	,	Global	: {}
	} );
	$i.extend( Options.Variable.Chart ,{
		Diagram	: {
			Type : 'stick'
		,	Data : {}
		,	Rule : ''
		}
	,	Output	: {
			Type : 'stick'
		,	Data : {}
		,	Rule : ''
		}
	} );
	Core.Diagram.Create();
	
	if(init==false)
	{
		Core.Console.Write( { Type : 'Info' ,KeyCode : 'Mssg1502' ,Message : '' } );
	}
	Options.Variable.History['Grid']			= [];
	Options.Variable.History.Diagram['Rule']	= [];
	Options.Variable.History.Diagram['Global']	= [];
	Options.Variable.History.Diagram['DataSel']	= { SelRule : '' ,SelId : '' ,SelType : '' };
	Options.Element.Diagram.HistoryDiagram.El().find('a.item').eq(0).addClass('now').end().end().find('a.u').parent().remove();
};

Core.RuleUser = {};

Core.RuleUser.Change = function() {
	Core.Diagram.RuleItem( 'Process.RuleItemResponse' ,true );
};

Core.Member.Change = function() {
	Core.Diagram.MemberItem( 'Process.MemberItemResponse' ,true );
};

Core.RuleUser.SaveCheck = function( d ) {
	let data		= d;
	let ruleNm		= data.rule_name;
	let ruleCont	= data.rule_cont;
	let ruleDc		= data.rule_dc;
	let ruleOpt		= data.rule_opt;
	let result		= true;
	if ( $i.ChkBlank(ruleNm) || $i.ChkBlank(ruleCont) || $i.ChkBlank(ruleDc)) {
		alert(lang_return("fixa.core.title033"));
		return false;
// $i.Alert(lang_return("fixa.core.title033") ,function(response){}); //'명칭,
// 조건식, 설명의 항목이 모두 입력되어야 합니다.'
// return false;
// result = false;
	}else{
		return result;
	}
};
Core.Member.SaveCheck = function( d ) {
	let memberSn		= d.member_sn;
	let memberId	= d.member_id;
	let memberPw		= d.member_pw;
	let memberAuth		= d.member_auth;
	let result		= true;
	if ( $i.ChkBlank(memberPw) || $i.ChkBlank(memberId)) {
		alert(lang_return("fixa.core.title133"));
		return false;
// $i.Alert(lang_return("fixa.core.title137") ,function(response){}); //'명칭,
// 조건식, 설명의 항목이 모두 입력되어야 합니다.'
// result = false;
	}else{
		return result;
	}
};

Core.RuleUser.Insert = function() {
	let data	= Options.Element.RuleAdmin.Form.El().SerializeObject();
	
	console.log(data);
	
	let check	= Core.RuleUser.SaveCheck(data);
	if ( check ) {
		data['state'] = '1';
		let optionsAjax = {
			url		: Options.Uri.Ajax.Ruleadmin.Save
		,	data	: data
		,	success	: function( d ,e ) { Core.RuleUser.Change(); Core.RuleUser.ListResponse( d ,e ); }
		};$i.Ajax(optionsAjax);
	}
};

/**
 * 룰 수정
 */
Core.RuleUser.Update = function( d ) {
	console.log("Core.RuleUser.Update",d);
	Core.Modal.Close();
	var modalStyle		= 'z-index:99985; position:fixed; left:0; top:0; width:100%; height:100%; text-align:center; background-color:rgba(0 ,0 ,0 ,0.7); overflow:hidden;';
	var objModal	= $i('<div/>' ,{ id : Options.Element.Global.Modal.Id ,style : modalStyle });
	
	var elContainer	= $i('<div/>' ,{
		id		: 'formUpdate'
	});
	var elTitle		= $i('<div/>' ,{
		class	: 'title'
	,	text	: lang_return("fixa.core.title034")// '룰(Rule) 수정'
	});

	var itmInputBox1 = $i('<div/>' ,{ class : '_form-input'}).append($i('<!--명칭--><label for="ruleNmUp">'+lang_return("fixa.core.title039")+'</label><input id="ruleNmUp" name="rule_name" data-format="none" type="text" value=""/>'));
	var itmInputBox2 = $i('<div/>' ,{ class : '_form-input'}).append($i('<!--조건식--><label for="ruleContUp">'+lang_return("fixa.core.title040")+'</label><input id="ruleContUp" name="rule_cont" data-format="none" type="text" value=""/>'))
	var itmInputBox3 = $i('<div/>' ,{ class : '_form-input'}).append($i('<!--설명--><label for="ruleDcUp">'+lang_return("fixa.core.title041")+'</label><input id="ruleDcUp" name="rule_dc" data-format="none" type="text" value=""/>'))
	
	
	
	var itmInputBox4 = $i('<div/>' ,{ class : '_form-input'}).append($i('<select id="form_ruleOpt" name="rule_opt"><option value="0">in</option><option value="1">not in</option></select>'))

	var elContent	= $i('<div/>' ,{
		class	: 'content'
	}).append(itmInputBox1).append(itmInputBox4).append(itmInputBox2).append(itmInputBox3);
		
	var elButtonOk	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title035")// '저장'
	,	href	: '#'
	}).on('click' ,function() {
		let data	= $i(this).parent().parent().parent().SerializeObject();
		let check	= Core.RuleUser.SaveCheck(data);
		if ( check ) {
			
			
			data['rule_sn'] = d.rule_sn;
			data['state'] = '2';
			let optionsAjax = {
				url		: Options.Uri.Ajax.Ruleadmin.Save
			,	data	: data
			,	success	: function( d ,e ) { Core.RuleUser.Change(); Core.RuleUser.ListResponse( d ,e ); }
			};$i.Ajax(optionsAjax);
		};
		
		return false;
	} );

	var elButtonCancle	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title036")// '취소'
	,	href	: '#'
	}).on('click' ,function() {
		Core.RuleUser.List();
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
	$i('#formUpdate select[name="rule_opt"]').val(d.rule_opt);
	
};

/**
 * 멤버 수정
 */
Core.Member.Update = function( d ) {
	console.log("Core.Member.Update",d);
	Core.Modal.Close();
	var modalStyle		= 'z-index:99985; position:fixed; left:0; top:0; width:100%; height:100%; text-align:center; background-color:rgba(0 ,0 ,0 ,0.7); overflow:hidden;';
	var objModal	= $i('<div/>' ,{ id : Options.Element.Global.Modal.Id ,style : modalStyle });
	
	var elContainer	= $i('<div/>' ,{
		id		: 'formUpdate'
	});
	var elTitle		= $i('<div/>' ,{
		class	: 'title'
	,	text	: 'Member 수정'// '룰(Rule) 수정'
	});

	var itmInputBox1 = $i('<div/>' ,{ class : '_form-input'}).append($i('<select id="form_memberAuth" name="member_auth" disabled="disabled"><option value="1">일반사용자</option><option value="2">업무사용자</option><option value="0">시스템관리자</option></select>'));
	var itmInputBox2 = $i('<div/>' ,{ class : '_form-input'}).append($i('<!--ID--><label for="memberIdUp">'+'ID'+'</label><input id="memberIdUp" name="member_id" data-format="none" type="text" disabled="disabled" value=""/>'));
	var itmInputBox3 = $i('<div/>' ,{ class : '_form-input'}).append($i('<!--PW--><label for="memberPwUp">'+'PW'+'</label><input id="memberPwUp" name="member_pw" data-format="none" type="password"  value=""/>'));

	var elContent	= $i('<div/>' ,{
		class	: 'content'
	}).append(itmInputBox1).append(itmInputBox2).append(itmInputBox3);

	var elButtonOk	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title035")// '저장'
	,	href	: '#'
	}).on('click' ,function() {
// let data = $i(this).parent().parent().parent().SerializeObject();
		let check	= Core.Member.SaveCheck(d);
		if (check) {
			d.state = '2';
			let optionsAjax = {
				url		: Options.Uri.Ajax.Member.Save
			,	data	: d
			,	success	: function( d ,e ) {  Core.Member.ListResponse( d ,e ); }
			};$i.Ajax(optionsAjax);
		};
		return false;
	} );

	var elButtonCancle	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title036")// '취소'
	,	href	: '#'
	}).on('click' ,function() {
		Core.Member.List();
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
	$i('#formUpdate input[name="member_id"]').val(d.member_id);
	$i('#formUpdate input[name="member_pw"]').val(d.member_pw);
	$i('#formUpdate select[name="member_auth"]').val(d.member_auth);
	
};
Core.StandardVoca.Update = function( d ) {
	var data_update = $("#uploadFileFrm").SerializeObject();
	console.log("Core.StandardVoca.Update",d);
		let optionsAjax = {
			url		: Options.Uri.Ajax.StandardVoca.Save
		,	data	: data_update
		,	success	: function( d ,e ) { 
// var columns = [];
// var data = [];
// const data2 = d.list;
// alert(JSON.parse(data2[0].header));
// alert(JSON.parse(data2[0].data));
// var grid = slickGrid.init(options,
// Options.Variable.slickGrid.id["strdHeaderList"], "strdHeaderList", columns,
// data);
// slickGrid.setColumn(grid, JSON.parse(data2[0].header));
// slickGrid.setData(grid, JSON.parse(data2[0].data));
			Core.StandardVoca.ListResponse(d,e); 
			
		}
		};$i.Ajax(optionsAjax);
	return false;
	
};

	
	
Core.CordDomain.Update = function( d ) {
	var data_update = $("#uploadFileFrm2").SerializeObject();
	console.log("Core.CordDomain.Update",d);
		let optionsAjax = {
			url		: Options.Uri.Ajax.CordDomain.Save
		,	data	: data_update
		,	success	: function( d ,e ) { 
// var columns = [];
// var data = [];
// const data2 = d.list;
// alert(JSON.parse(data2[0].header));
// alert(JSON.parse(data2[0].data));
// var grid = slickGrid.init(options,
// Options.Variable.slickGrid.id["strdHeaderList"], "strdHeaderList", columns,
// data);
// slickGrid.setColumn(grid, JSON.parse(data2[0].header));
// slickGrid.setData(grid, JSON.parse(data2[0].data));
			Core.CordDomain.ListResponse(d,e); 
			
		}
		};$i.Ajax(optionsAjax);
	return false;
	
};

Core.RuleUser.List = function() {
	var data		= {};// Options.Element.RuleAdmin.Form.El().SerializeObject();
	var optionsAjax = {
		url		: Options.Uri.Ajax.Ruleadmin.List
	,	data	: data
	,	success	: function( d ,e ) { Core.RuleUser.ListResponse( d ,e ); }
	};$i.Ajax(optionsAjax);
};


Core.Member.List = function() {
	var data		= {};// Options.Element.RuleAdmin.Form.El().SerializeObject();
	var optionsAjax = {
		url		: Options.Uri.Ajax.Member.List
	,	data	: data
	,	success	: function( d ,e ) { Core.Member.ListResponse( d ,e ); }
	};$i.Ajax(optionsAjax);
};


Core.StandardVoca.List = function() {
	var data = new Object();
	data.flag = $("#flag").val();
	var optionsAjax = {
		url		: Options.Uri.Ajax.StandardVoca.List
	,	data	: data
	,	success	: function( d ,e ) { 
	
		Core.StandardVoca.ListResponse( d ,e ); 
		
	}
	};$i.Ajax(optionsAjax);
// Core.StandardVoca.ListResponse();
};
Core.CordDomain.List = function() {
	var data = new Object();
	data.flag = "2";
	var optionsAjax = {
			url		: Options.Uri.Ajax.CordDomain.List
// url : Options.Uri.Ajax.StandardVoca.List
			,	data	: data
			,	success	: function( d ,e ) { Core.CordDomain.ListResponse( d ,e ); }
// , success : function( d ,e ) { Core.StandardVoca.ListResponse( d ,e ); }
	};$i.Ajax(optionsAjax);
// Core.StandardVoca.ListResponse();
};

Core.Member.Insert = function() {
	let data	= Options.Element.MemberAdmin.Form.El().SerializeObject();
	
	console.log(data);
	
	let check	= Core.Member.SaveCheck(data);
	
		data['member_id'] = data.member_id;
		let optionsAjax = {
			url		: Options.Uri.Ajax.Member.MemberChk
		,	data	: data
		,	success	: function(d) {
			if(d.result == "error"){
				alert(lang_return("fixa.core.title136"));
				return false;
			}else{
				if ( check ) {
					data['state'] = '1';
					let optionsAjax = {
						url		: Options.Uri.Ajax.Member.Save
					,	data	: data
					,	success	: function( d ,e ) {  Core.Member.ListResponse( d ,e ); }
					};$i.Ajax(optionsAjax);
				};
				return false;
			}
		}
		};$i.Ajax(optionsAjax);
};

/**
 * 룰셋
 */
Core.RuleUser.ListResponse = function( d ,e ,callback ) {
	Core.Modal.Close();
	var options1	= $('<option/>' ,{ value : '01' ,text : lang_return("fixa.core.title037") }); // 검출툴
	var options2	= $('<option/>' ,{ value : '02' ,text : lang_return("fixa.core.title038") }); // 필터
	
	/**
	 * var options3 = $('<option/>' ,{ value : '11' ,text :
	 * lang_return("fixa.core.title122") }); //유무 필터 var options4 = $('<option/>' ,{
	 * value : '12' ,text : lang_return("fixa.core.title123") }); //범위 필터 var
	 * options5 = $('<option/>' ,{ value : '13' ,text :
	 * lang_return("fixa.core.title124") }); //사용자 필터
	 */	
		
	var select		= $('<select/>'	,{ id : 'form_ruleGb' ,name : 'rule_gb',"style":"display:none;" }).append(options1).append(options2);/** .append(options3).append(options4).append(options5);* */
	
	var label1		= $('<label/>'	,{ "class":"label_tit",text : lang_return("fixa.core.title039") }); // 명칭
	var input1		= $('<input/>'	,{ id : 'form_ruleNm' ,name : 'rule_name' ,type : 'text' ,'data-format' : 'none' ,value : '' });
	var formInput1	= $('<div/>'	,{ class : '_form-input' }).append(label1).append(input1);
	
	// 포함여부
	var options11	= $('<option/>' ,{ value : '0' ,text : 'in' });
	var options12	= $('<option/>' ,{ value : '1' ,text : 'not in' });
	var select2		= $('<select/>'	,{ id : 'form_ruleOpt' ,name : 'rule_opt' }).append(options11).append(options12);
	
	
	
	
	var label2		= $('<label/>'	,{ "class":"label_tit",text : lang_return("fixa.core.title046") });// '조건식'
	var input2		= $('<input/>'	,{ id : 'form_ruleCont' ,name : 'rule_cont' ,type : 'text' ,'data-format' : 'none' ,value : '' });
	var formInput2	= $('<div/>'	,{ class : '_form-input' }).append(label2).append(input2);
	
	var label3		= $('<label/>'	,{ "class":"label_tit",text : lang_return("fixa.core.title041") });// '설명'
	var input3		= $('<input/>'	,{ id : 'form_ruleDc' ,name : 'rule_dc' ,type : 'text' ,'data-format' : 'none' ,value : '' });
	var formInput3	= $('<div/>'	,{ class : '_form-input' }).append(label3).append(input3);
	
	var button		= $('<a/>'		,{ class : '_btn' ,href : '#' ,text  : lang_return("fixa.core.title042") }).on('click' ,function(){ Core.RuleUser.Insert(); return false; });// 추가
	var add			= $('<div/>'	,{ id : 'wrRuleForm' }).append(select).append(formInput1).append(select2).append(formInput2).append(formInput3).append(button);

	var form		= $('<form/>'	,{ id : 'formRule' ,name : 'formRule' ,action : '#' ,method : 'post' }).append(add);
	
	var th1			= $('<th/>'		,{ scope : 'col' ,text : lang_return("fixa.core.title046")		});// '구분'
	var th2			= $('<th/>'		,{ scope : 'col' ,text : lang_return("fixa.core.title044")		});// '명칭'
	var th6			= $('<th/>'		,{ scope : 'col' ,text : lang_return("fixa.core.title045")		});// '포함'
	var th3			= $('<th/>'		,{ scope : 'col' ,text : lang_return("fixa.core.title046")	,"width":"300px"	});// '조건식'
	var th4			= $('<th/>'		,{ scope : 'col' ,text : lang_return("fixa.core.title047")		});// '설명'
	var th5			= $('<th/>'		,{ scope : 'col' ,text : lang_return("fixa.core.title048")		});// '관리'
	var tr			= $('<tr/>').append(th1).append(th2).append(th6).append(th3).append(th4).append(th5);
	var thead		= $('<thead/>').append(tr);
	var tbody		= $('<tbody/>');

	const data	= d.list;
	for( let fx=0; fx<data.length; ++fx ) {
		
		
		
		
		let btn1 = ('01'==data[fx].rule_base_data_gb || '100'==data[fx].rule_gb) ? '' : $i('<a/>' ,{ class : '_btn _btnSmall' ,text : lang_return("fixa.core.title049") ,href : '#' ,'data-index' : data[fx].rule_sn }).on('click' ,function(e){ Core.RuleUser.Update(data[fx]); });// 수정
		let btn2 = ('01'==data[fx].rule_base_data_gb) ? '' : $i('<a/>' ,{ class : '_btn _btnSmall' ,text : lang_return("fixa.core.title050") ,href : '#' ,'data-index' : data[fx].rule_sn }).on('click' ,function(e){// 삭제
			var optionsAjax = {
				url		: Options.Uri.Ajax.Ruleadmin.Save
			,	data	: { state : '3' ,rule_sn : $i(this).attr('data-index') }
			,	success	: function( d ,e ) { Core.RuleUser.Change(); Core.RuleUser.List(); }
			};$i.Ajax(optionsAjax);
		});
		
		
		let td1	= $i('<td/>' ,{ text : gubun(parseInt(data[fx].rule_gb)) });
		let td2	= $i('<td/>' ,{ text : data[fx].rule_name });

		let td6 = $i('<td/>' ,{ text : fn_rule_opt(parseInt(data[fx].rule_opt)) });
		
		rule_cont = "";
		if(data[fx].rule_gb==100)
		{
			rule_cont = "template Data";
		}
		else
		{
			rule_cont = data[fx].rule_cont;
		}
	
		let td3 = $i('<td/>' ,{ text : rule_cont });
		
		let td4 = $i('<td/>' ,{ text : data[fx].rule_dc });
		let td5 = $i('<td/>' ,{ class : 'alignCenter' }).append(btn1).append(btn2);
		let tr	= $i('<tr/>' ,{ 'data-index' : data[fx].rule_sn }).append(td1).append(td2).append(td6).append(td3).append(td4).append(td5);
		tbody.append(tr);
	};
	function gubun( idx ){
		
		console.log("idx",idx);
		let text = [];
		text[1]	= lang_return("fixa.core.title051")// '검출 룰';
		text[2] = lang_return("fixa.core.title052")// '필터';
		text[3] = lang_return("fixa.core.title053")// 'R 설정';
		text[4] = lang_return("fixa.core.title054")// 'D3 차트';
		text[5] = lang_return("fixa.core.title055")// '시계열 차트';
		text[20] = lang_return("fixa.core.title200")// '유무필터';
		text[30] = lang_return("fixa.core.title201")// '법위필터';
		text[40] = lang_return("fixa.core.title202")// '논리구문';
		text[50] = lang_return("fixa.core.title199")// '사용자정의';
		text[60] = lang_return("fixa.core.title203")// '코드룰셋';
		text[70] = "date rule set"// '코드룰셋';
		text[80] = "cloud word"// '코드룰셋';
		text[100] = "template"// '코드룰셋';
					
		
		
		
		
		
		return text[idx];
	};
	
	function fn_rule_opt(idx)
	{
		let text = [];
		text[0]	= 'in';
		text[1] = 'not in';
		text[99] = '';
		
		
		return text[idx];
	}
	
	var table		= $('<table/>'	,{ id : 'itmRuleList'	}).append(thead).append(tbody);
	var list		= $('<div/>'	,{ id : 'wrRuleList'	}).append(table);

	
	var elButtonOk	= '';
	var elContent	= $i( '<div/>' ,{ class : 'content' } ).append(form).append(list);
	var contents = {
		Title		: lang_return("fixa.core.title056")
	,	ElButtonOk	: elButtonOk
	,	ElContent	: elContent
	};
	var objModal		= Core.Modal.Background();
	var txtTitle		= contents.Title;
	var elButtonOk		= contents.ElButtonOk;
	var elContent		= contents.ElContent;
	var elContainer		= $i( '<div/>'	,{ id : Options.Element.Diagram.RuleAdmin.Id } );
	var elTitle			= $i( '<div/>'	,{ class : 'title' 	 } );
	var elButtonCancle	= $i( '<a/>'	,{ class : 'button' ,text : lang_return("fixa.core.title059") ,href : '#' }).on('click' ,function() { Core.Modal.Close(); return false; } ); // 닫기
	var elButtonBox		= $i( '<div/>'	,{ class : 'itmButton' }).append(elButtonCancle);

	elTitle.append($("<div/>",{"class":"tab_btn_left"}));
	elTitle.append($("<a/>",{"text":txtTitle}));
	elTitle.append($("<div/>",{"class":"tab_btn_right"}));
	
	
	
	
	
	
	
	elContainer.append(elTitle).append(Core.tabbar4()).append(elContent).append(elButtonBox);
	objModal.html(elContainer);
	Options.Element.Global.Inni.El().append(objModal);

	Options.Element.RuleAdmin.Form.El().SetForm();
};

/**
 * 멤버셋
 */
Core.Member.ListResponse = function( d ,e ,callback ) {
	Core.Modal.Close();
// var options1 = $('<option/>' ,{ value : '2' ,text :
// lang_return("fixa.core.title132") }); //일반사용자
// var options2 = $('<option/>' ,{ value : '1' ,text :
// lang_return("fixa.core.title126") }); //업무사용자
// var options3 = $('<option/>' ,{ value : '0' ,text :
// lang_return("fixa.core.title127") }); //시스템관리자
	var options2	= $('<option/>' ,{ value : '1' ,text : lang_return("fixa.core.title125") }); // 일반사용자
	var options1	= $('<option/>' ,{ value : '2' ,text : lang_return("fixa.core.title126") }); // 업무사용자
// var options3 = $('<option/>' ,{ value : '0' ,text : '시스템사용자' }); //시스템관리자
	
	/**
	 * var options3 = $('<option/>' ,{ value : '11' ,text :
	 * lang_return("fixa.core.title122") }); //유무 필터 var options4 = $('<option/>' ,{
	 * value : '12' ,text : lang_return("fixa.core.title123") }); //범위 필터 var
	 * options5 = $('<option/>' ,{ value : '13' ,text :
	 * lang_return("fixa.core.title124") }); //사용자 필터
	 */	
		
	var select		= $('<select/>'	,{ id : 'form_member_auth' ,name : 'member_auth' }).append(options2).append(options1);/** .append(options3).append(options4).append(options5);* */
	
// var label1 = $('<label/>' ,{ text : lang_return("fixa.core.title128") });
// //ID
	var label1		= $('<label/>'	,{ text : 'ID' }); // ID
	var input1		= $('<input/>'	,{ id : 'form_member_id' ,name : 'member_id' ,type : 'text' ,'data-format' : 'none' ,value : '' });
	var formInput1	= $('<div/>'	,{ class : '_form-input' }).append(label1).append(input1);
	
	// 포함여부
// var options11 = $('<option/>' ,{ value : '0' ,text : 'in' });
// var options12 = $('<option/>' ,{ value : '1' ,text : 'not in' });
// var select2 = $('<select/>' ,{ id : 'form_ruleOpt' ,name : 'rule_opt'
// }).append(options11).append(options12);
	
// var label2 = $('<label/>' ,{ text : lang_return("fixa.core.title129") });//PW
	var label2		= $('<label/>'	,{ text : 'PW' });// PW
	var input2		= $('<input/>'	,{ id : 'form_member_pw' ,name : 'member_pw' ,type : 'password' ,'data-format' : 'none' ,value : '' });
	var formInput2	= $('<div/>'	,{ class : '_form-input' }).append(label2).append(input2);
	
// var label3 = $('<label/>' ,{ text : lang_return("fixa.core.title041")
// });//'설명'
// var input3 = $('<input/>' ,{ id : 'form_ruleDc' ,name : 'rule_dc' ,type :
// 'text' ,'data-format' : 'none' ,value : '' });
// var formInput3 = $('<div/>' ,{ class : '_form-input'
// }).append(label3).append(input3);
	
	var button		= $('<a/>'		,{ class : '_btn' ,href : '#' ,text  : lang_return("fixa.core.title042") }).on('click' ,function(){ Core.Member.Insert(); return false; });// 추가
	var add			= $('<div/>'	,{ id : 'wrMemberForm' }).append(select).append(formInput1).append(formInput2).append(button);

	var form		= $('<form/>'	,{ id : 'formMember' ,name : 'formMember' ,action : '#' ,method : 'post' }).append(add);
	
// var th1 = $('<th/>' ,{ scope : 'col' ,text :
// lang_return("fixa.core.title130") });//'사용자 구분'
// var th2 = $('<th/>' ,{ scope : 'col' ,text :
// lang_return("fixa.core.title128") });//'ID'
// var th3 = $('<th/>' ,{ scope : 'col' ,text :
// lang_return("fixa.core.title129") });//'PW'
// var th4 = $('<th/>' ,{ scope : 'col' ,text :
// lang_return("fixa.core.title048") });//'관리'
	var th1			= $('<th/>'		,{ scope : 'col' ,text : lang_return("fixa.core.title130")	});// '사용자
	var th2			= $('<th/>'		,{ scope : 'col' ,text : lang_return("fixa.core.title128")		});// 'ID'
	var th3			= $('<th/>'		,{ scope : 'col' ,text : lang_return("fixa.core.title129")		});// 'PW'
	var th4			= $('<th/>'		,{ scope : 'col' ,text : lang_return("fixa.core.title048")		});// '관리'
	var tr			= $('<tr/>').append(th1).append(th2).append(th3).append(th4);
	var thead		= $('<thead/>').append(tr);
	var tbody		= $('<tbody/>');

	const data	= d.list;
	for( let fx=0; fx<data.length; ++fx ) {
// let btn1 = ('0'==data[fx].member_auth) ? '' : $i('<a/>' ,{ class : '_btn
// _btnSmall' ,text : lang_return("fixa.core.title049") ,href : '#'
// ,'data-index' : data[fx].member_sn }).on('click' ,function(e){
// Core.Member.Update(data[fx]); });//수정
// let btn2 = ('0'==data[fx].member_auth) ? '' : $i('<a/>' ,{ class : '_btn
// _btnSmall' ,text : lang_return("fixa.core.title050") ,href : '#'
// ,'data-index' : data[fx].member_sn }).on('click' ,function(e){//삭제
		let btn1 = $i('<a/>' ,{ class : '_btn _btnSmall' ,text : lang_return("fixa.core.title049") ,href : '#' ,'data-index' : data[fx].member_sn }).on('click' ,function(e){ Core.Member.Update(data[fx]); });// 수정
		let btn2 = $i('<a/>' ,{ class : '_btn _btnSmall' ,text : lang_return("fixa.core.title050") ,href : '#' ,'data-index' : data[fx].member_sn }).on('click' ,function(e){// 삭제
			var optionsAjax = {
				url		: Options.Uri.Ajax.Member.Save
			,	data	: {state : '3',member_sn : $i(this).attr('data-index') }
			,	success	: function( d ,e ) {  Core.Member.List(); }
			};$i.Ajax(optionsAjax);
		});
		let td1	= $i('<td/>' ,{ text : gubun(data[fx].member_auth) });
		let td2	= $i('<td/>' ,{ text : data[fx].member_id });
// let td6 = $i('<td/>' ,{ text : fn_rule_opt(parseInt(data[fx].rule_opt)) });
		let td3 = $i('<td/>' ,{ class :'hidetext' , text : data[fx].member_pw});
		let td4 = $i('<td/>' ,{ class : 'alignCenter' });
		if(data[fx].member_auth == 0){
			td4.append(btn1);
		}else{
			td4.append(btn1).append(btn2);
		}
		
		let tr	= $i('<tr/>' ,{ 'data-index' : data[fx].member_sn }).append(td1).append(td2).append(td3).append(td4);
		tbody.append(tr);
	};
	function gubun( idx ){
		let text = [];
// text[2] = lang_return("fixa.core.title132")//'일반사용자';
// text[1] = lang_return("fixa.core.title126")//'업무사용자';
// text[0] = lang_return("fixa.core.title127")//'시스템관리자';
		text[1]	= '일반사용자';// '일반사용자';
		text[2] = '업무사용자';// '업무사용자';
		text[0] = '시스템사용자';// '시스템관리자';
// text[4] = lang_return("fixa.core.title054")//'D3 차트';
// text[5] = lang_return("fixa.core.title055")//'시계열 차트';
		return text[idx];
	};
	
	function fn_rule_opt(idx)
	{
		let text = [];
		text[0]	= 'in';
		text[1] = 'not in';
		text[99] = '';
		
		
		return text[idx];
	}
	
	var table		= $('<table/>'	,{ id : 'itmMemberList'	}).append(thead).append(tbody);
	var list		= $('<div/>'	,{ id : 'wrMemberList'	}).append(table);

	
	var elButtonOk	= '';
	var elContent	= $i( '<div/>' ,{ class : 'content' } ).append(form).append(list);
	var contents = {
		Title		: 'Member'
	,	ElButtonOk	: elButtonOk
	,	ElContent	: elContent
	};
	var objModal		= Core.Modal.Background();
	var txtTitle		= contents.Title;
	var elButtonOk		= contents.ElButtonOk;
	var elContent		= contents.ElContent;
	var elContainer		= $i( '<div/>'	,{ id : Options.Element.Diagram.RuleAdmin.Id } );
	var elTitle			= $i( '<div/>'	,{ class : 'title'  } );
	var elButtonCancle	= $i( '<a/>'	,{ class : 'button' ,text : lang_return("fixa.core.title059") ,href : '#' }).on('click' ,function() { Core.Modal.Close(); return false; } ); // 닫기
	var elButtonBox		= $i( '<div/>'	,{ class : 'itmButton' }).append(elButtonCancle);

	elTitle.append($("<div/>",{"class":"tab_btn_left"}));
	elTitle.append($("<a/>",{"text":txtTitle}));
	elTitle.append($("<div/>",{"class":"tab_btn_right"}));
	
	elContainer.append(elTitle).append(Core.tabbar4()).append(elContent).append(elButtonBox);
	objModal.html(elContainer);
	Options.Element.Global.Inni.El().append(objModal);

	Options.Element.MemberAdmin.Form.El().SetForm();
};


/**
 * 통계룰셋 기반데이터
 */
Core.StandardVoca.ListResponse = function( d ,e ,callback ) {
	Core.Modal.Close();
	var strd_header = "";
	var use_yn = "";
	var options1	= $('<option/>' ,{ value : '0' ,text : lang_return("fixa.core.title159") }); // 행정표준용어
	// var options2 = $('<option/>' ,{ value : '1' ,text :
	// lang_return("fixa.core.title160") }); //행정표준코드
	if(d.listCnt != 0){
		
		var select		= $('<select/>'	,{ id : 'flag' ,name : 'flag' ,onchange : 'Core.StandardVoca.List();'}).append(options1);// .append(options2);/**.append(options3).append(options4).append(options5);**/
	}else{
		var select		= $('<select/>'	,{ id : 'flag' ,name : 'flag'}).append(options1).append(options2);/** .append(options3).append(options4).append(options5);* */
	}
	
	var input1		= $('<input/>'	,{ id : 'form_standardVoca_id' ,name : 'standardVoca_id' ,type : 'text' ,'data-format' : 'none' ,value : '' , disabled : 'disabled'});
	var input2  	= $('<input/>'  ,{ id : 'uploadFile' ,name : 'uploadFile',type : 'file' , style : 'display: none;',onchange : "javascript:document.getElementById('form_standardVoca_id').value = this.files[0].name"});
	var formInput1	= $('<div/>'	,{ class : '_form-input' }).append(input1).append(input2);
	var button		= $('<a/>'		,{ class : '_btn' ,href : '#' ,text  : lang_return("fixa.core.title161")}).on('click' ,function(){ Core.Files.Find(); return false; });// 추가
	var button2		= $('<a/>'		,{ class : '_btn' ,href : '#' ,text  : lang_return("fixa.core.title162")}).on('click' ,function(){ Core.Files.Submit2(); return false; });// 추가
	var add			= $('<div/>'	,{ id : 'wrStandardVocaForm' }).append(select).append(formInput1).append(button).append(button2);
	var form	= $('<form/>'	,{ id: 'uploadFileFrm' , name : 'uploadFileFrm' ,enctype : 'multipart/form-data' ,method : 'post' }).append(add);
	var th1			= $('<th/>'		,{ scope : 'col' ,text : lang_return("fixa.core.title163")	});// 행정표준
	var th2			= $('<th/>'		,{ scope : 'col' ,text : lang_return("fixa.core.title164")	});// 사용여부
	var th3			= $('<th/>'		,{ scope : 'col' ,text : lang_return("fixa.core.title165")	});// 선택
	// var tr = $('<tr/>').append(th1).append(th2).append(th3);
	// var thead = $('<thead/>').append(tr);
	var tbody		= $('<tbody/>');

	const data	= d.list;
	var options = [];
	for( let fx=0; fx<data.length; ++fx ) {
		let btn1 = $i('<a/>' ,{ class : '_btn _btnSmall' ,text : lang_return("fixa.core.title035") ,href : '#' ,'data-index' : data[fx].base_data_sn }).on('click' ,function(e){ Core.StandardVoca.Update(data[fx]); });// 수정
		strd_header = data[fx].strd_header;
		use_yn = data[fx].use_yn;
// let th1_1 = $('<th/>' ,{ scope : 'col' ,text : '행정표준' });//'사용자 구분'
// let th1_2 = $('<th/>' ,{ scope : 'col' ,text : '사용여부' });//'사용자 구분'
// let td1_1 = $i('<td/>' ,{ text : data[fx].strd_header });
// let td1_2 = $i('<td/>' ,{ text : data[fx].use_yn });
// var tr1_1 = $('<tr/>').append(th1_1).append(th1_2);
// var tr1_2 = $('<tr/>').append(td1_1).append(td1_2);
		// var thead1_1 = $('<thead/>');
		var tbody1_1		= $('<tbody/>');
		// tbody1_1.append(thead1_1);
		
		var list1_2		= $('<div/>'	,{ id : 'strdHeaderList', style : "width: 100%; height: 100%;"	});
		var select2		= $('<select/>'	,{ id : 'strd_header' ,name : 'strd_header' });
		var obj = JSON.parse(data[fx].header);
		for(var i=0; i<obj.length; i++){
		
			options[i] = ($('<option/>' ,{ value : obj[i] ,text :obj[i]}));
			select2 = select2.append(options[i]);
		}
		var options4	= $('<option/>' ,{ value : 'Y' ,text : lang_return("fixa.core.title227") }); // 사용
		var options5	= $('<option/>' ,{ value : 'N' ,text : lang_return("fixa.core.title228") }); // 미사용
		var select3 =  $('<select/>'	,{ id : 'use_yn' ,name : 'use_yn' }); 
		select3.append(options4).append(options5);
		let td1	= $i('<td/>' ,{}).append(select2);
		let td2	= $i('<td/>' ,{}).append(select3);
		let td3	= $i('<td/>' ,{}).append(btn1);
		
		let tr2	= $i('<tr/>' ,{ 'data-index' : data[fx].base_data_sn })
		
		.append(th1).append(td1)
		.append(th2).append(td2)
		.append(th3).append(td3);
		tbody.append(tr2);
		
		
	};
	
	var table		= $('<table/>'	,{ id : 'itmStandardList'	}).append(tbody);
	var list		= $('<div/>'	,{ id : 'wrStandardList'	}).append(table).append(list1_2);
	
	form.append(add).append(table).append(list).append(tbody1_1);
	
	var elButtonOk	= '';
	var elContent	= $i( '<div/>' ,{ class : 'content' } ).append(form);
	var contents = {
		Title		: lang_return("fixa.core.title229")//표준용어 관리
	,	ElButtonOk	: elButtonOk
	,	ElContent	: elContent
	};
	var objModal		= Core.Modal.Background();
	var txtTitle		= contents.Title;
	var elButtonOk		= contents.ElButtonOk;
	var elContent		= contents.ElContent;
	var elContainer		= $i( '<div/>'	,{ id : Options.Element.Diagram.RuleAdmin.Id } );
	var elTitle			= $i( '<div/>'	,{ class : 'title' 	} );
	var elButtonCancle	= $i( '<a/>'	,{ class : 'button' ,text : lang_return("fixa.core.title059") ,href : '#' }).on('click' ,function() { Core.Modal.Close(); return false; } ); // 닫기
	var elButtonBox		= $i( '<div/>'	,{ class : 'itmButton' }).append(elButtonCancle);

	elTitle.append($("<div/>",{"class":"tab_btn_left"}));
	elTitle.append($("<a/>",{"text":txtTitle}));
	elTitle.append($("<div/>",{"class":"tab_btn_right"}));
	
	elContainer.append(elTitle).append(Core.tabbar4()).append(elContent).append(elButtonBox);
	objModal.html(elContainer);
	Options.Element.Global.Inni.El().append(objModal);

	Options.Element.StandardVoca.Form.El().SetForm();
	
	if(strd_header != ""){
		$("#strd_header").val(strd_header).prop({selected: true});
	}
	if(use_yn != ""){
		$("#use_yn").val(use_yn).prop({selected: true});
	}
	if(d.flag != ""){
		$("#flag").val(d.flag).prop({selected: true});
	}
	var options = {
			  enableCellNavigation: true,
			  enableColumnReorder: false,
			  asyncEditorLoading: false,
			  /** col 수정 가능 여부* */
			  editable: true,
			  forceFitColumns: false,
			  // showHeaderRow: true,
			  enableAddRow: false,
			  autoEdit: false,
			  editCommandHandler: queueAndExecuteCommand
			};
	if(d.listCnt != 0){
		var data1 = [];
		var columns = [];
		Options.Variable.slickGrid.id["strdHeaderList"] = slickGrid.init(options, Options.Variable.slickGrid.id["strdHeaderList"], "strdHeaderList", columns, data1);
		
		slickGrid.setColumn(Options.Variable.slickGrid.id["strdHeaderList"], JSON.parse(data[0].header));
		slickGrid.setData(Options.Variable.slickGrid.id["strdHeaderList"], JSON.parse(data[0].data));
	}
	
};

Core.CordDomain.ListResponse = function( d ,e ,callback ) {
	Core.Modal.Close();
	var strd_header = "";
	var use_yn = "";
	var options3	= $('<option/>' ,{ value : '2' ,text : lang_return("fixa.core.title166") }); // 코드
																									// 도메인
	if(d.listCnt != 0){
		
		var select		= $('<select/>'	,{ id : 'flag' ,name : 'flag',onchange : 'Core.CordDomain.List();'  }).append(options3);/** .append(options3).append(options4).append(options5);* */
	}else{
		var select		= $('<select/>'	,{ id : 'flag' ,name : 'flag'  }).append(options3);/** .append(options3).append(options4).append(options5);* */
	}
	var input1		= $('<input/>'	,{ id : 'form_cordDomain_id' ,name : 'cordDomain_id' ,type : 'text' ,'data-format' : 'none' ,value : '' , disabled : 'disabled'});
	var input2  	= $('<input/>'  ,{ id : 'uploadFile' ,name : 'uploadFile',type : 'file' , style : 'display: none;',onchange : "javascript:document.getElementById('form_cordDomain_id').value = this.files[0].name"});
	var formInput1	= $('<div/>'	,{ class : '_form-input' }).append(input1).append(input2);
	var button		= $('<a/>'		,{ class : '_btn' ,href : '#' ,text  : lang_return("fixa.core.title161")}).on('click' ,function(){ Core.Files.Find(); return false; });// 추가
	var button2		= $('<a/>'		,{ class : '_btn' ,href : '#' ,text  : lang_return("fixa.core.title162")}).on('click' ,function(){ Core.Files.Submit3(); return false; });// 추가
	var add			= $('<div/>'	,{ id : 'wrCordDomainForm' }).append(select).append(formInput1).append(button).append(button2);
	var form	= $('<form/>'	,{ id: 'uploadFileFrm2' , name : 'uploadFileFrm2' ,enctype : 'multipart/form-data' ,method : 'post' }).append(add);
	// var tr = $('<tr/>').append(th1).append(th2).append(th3);
	// var thead = $('<thead/>').append(tr);
	var tbody		= $('<tbody/>');

	const data	= d.list;
	var options = [];
	for( let fx=0; fx<data.length; ++fx ) {
		let btn1 = $i('<a/>' ,{ class : '_btn _btnSmall' ,text : lang_return("fixa.core.title035") ,href : '#' ,'data-index' : data[fx].base_data_sn }).on('click' ,function(e){ Core.CordDomain.Update(data[fx]); });// 수정
// let th1_1 = $('<th/>' ,{ scope : 'col' ,text : '코드도메인' });//'사용자 구분'
// let th1_2 = $('<th/>' ,{ scope : 'col' ,text : '사용여부' });//'사용자 구분'
// let td1_1 = $i('<td/>' ,{ text : data[fx].strd_header });
// let td1_2 = $i('<td/>' ,{ text : data[fx].use_yn });
// var tr1_1 = $('<tr/>').append(th1_1).append(th1_2);
// var tr1_2 = $('<tr/>').append(td1_1).append(td1_2);
		// var thead1_1 = $('<thead/>');
		var tbody1_1		= $('<tbody/>');
		// tbody1_1.append(thead1_1);
		
		var list1_2		= $('<div/>'	,{ id : 'cordDomainList', style : "width: 100%; height: 100%;"	});
		var select2		= $('<select/>'	,{ id : 'cord_strd_header' ,name : 'strd_header' });
		var obj = JSON.parse(data[fx].header);
		for(var i=0; i<obj.length; i++){
		
			options[i] = ($('<option/>' ,{ value : obj[i] ,text :obj[i]}));
			select2 = select2.append(options[i]);
		}
		var options4	= $('<option/>' ,{ value : 'Y' ,text : lang_return("fixa.core.title227") }); // 사용
		var options5	= $('<option/>' ,{ value : 'N' ,text : lang_return("fixa.core.title228") }); // 미사용
		var select3 =  $('<select/>'	,{ id : 'cord_use_yn' ,name : 'use_yn' }); 
		select3.append(options4).append(options5);
		var th1			= $('<td/>'		,{ scope : 'col' ,text : lang_return("fixa.core.title163")	});// 코드 도메인
		var th2			= $('<td/>'		,{ scope : 'col' ,text : lang_return("fixa.core.title164")	});// 사용여부
		var th3			= $('<td/>'		,{ scope : 'col' ,text : lang_return("fixa.core.title165")		});// 선택
		let td1	= $i('<td/>' ,{}).append(select2);
		let td2	= $i('<td/>' ,{}).append(select3);
		let td3	= $i('<td/>' ,{}).append(btn1);
		strd_header = data[fx].strd_header;
		use_yn = data[fx].use_yn;
		let tr2	= $i('<tr/>' ,{ 'data-index' : data[fx].base_data_sn })
				.append(th1).append(td1)
				.append(th2).append(td2)
				.append(th3).append(td3);
		tbody.append(tr2);
		
	};
	var table		= $('<table/>'	,{ id : 'itmCordDomainList'	}).append(tbody);
	var list		= $('<div/>'	,{ id : 'wrCordDomainList2'	}).append(table).append(list1_2);
	form.append(add).append(table).append(list).append(list).append(tbody1_1);
	
	var elButtonOk	= '';
	var elContent	= $i( '<div/>' ,{ class : 'content' } ).append(form);
	var contents = {
		Title		: lang_return("fixa.core.title206")
	,	ElButtonOk	: elButtonOk
	,	ElContent	: elContent
	};
	var objModal		= Core.Modal.Background();
	var txtTitle		= contents.Title;
	var elButtonOk		= contents.ElButtonOk;
	var elContent		= contents.ElContent;
	var elContainer		= $i( '<div/>'	,{ id : Options.Element.Diagram.RuleAdmin.Id } );
	var elTitle			= $i( '<div/>'	,{ class : 'title' 	 } );
	var elButtonCancle	= $i( '<a/>'	,{ class : 'button' ,text : lang_return("fixa.core.title059") ,href : '#' }).on('click' ,function() { Core.Modal.Close(); return false; } ); // 닫기
	var elButtonBox		= $i( '<div/>'	,{ class : 'itmButton' }).append(elButtonCancle);

	elTitle.append($("<div/>",{"class":"tab_btn_left"}));
	elTitle.append($("<a/>",{"text":txtTitle}));
	elTitle.append($("<div/>",{"class":"tab_btn_right"}));
	
	elContainer.append(elTitle).append(Core.tabbar4()).append(elContent).append(elButtonBox);
	objModal.html(elContainer);
	Options.Element.Global.Inni.El().append(objModal);

	Options.Element.StandardVoca.Form.El().SetForm();
	if(strd_header != ""){
		$("#cord_strd_header").val(strd_header).prop({selected: true});
	}
	if(use_yn != ""){
		$("#cord_use_yn").val(use_yn).prop({selected: true});
	}
	if(d.listCnt != 0){
		var data1 = [];
		var columns = [];
		Options.Variable.slickGrid.id["cordDomainList"] = slickGrid.init(options,Options.Variable.slickGrid.id["cordDomainList"], "cordDomainList", columns, data1);
		
		slickGrid.setColumn(Options.Variable.slickGrid.id["cordDomainList"], JSON.parse(data[0].header));
		slickGrid.setData(Options.Variable.slickGrid.id["cordDomainList"], JSON.parse(data[0].data));
	}
};
Core.StandardVoca.Check = function(d){
// let data = d;
	let form_standardVoca_id = $("#form_standardVoca_id").val();
	let result = true;
	if ( $i.ChkBlank(form_standardVoca_id)) {
		alert(lang_return("fixa.core.title189"));
		return false;
// $i.Alert(lang_return("fixa.core.title033") ,function(response){}); //'명칭,
// 조건식, 설명의 항목이 모두 입력되어야 합니다.'
// return false;
	}else{
		return result;
	};
};
Core.CordDomain.Check = function(d){
	
	let form_cordDomain_id = $("#form_cordDomain_id").val();
	let result = true;
	if ( $i.ChkBlank(form_cordDomain_id)) {
		alert(lang_return("fixa.core.title189"));
		return false;
// $i.Alert(lang_return("fixa.core.title033") ,function(response){}); //'명칭,
// 조건식, 설명의 항목이 모두 입력되어야 합니다.'
// return false;
	}else{
		return result;
	};
};

Core.History = {};

Core.History.Add = function( paOptions ) {
	var elHistory ,a;
	if ( 'grid' == paOptions.Type.toLowerCase() ) {
		var elGrid		= Options.Element.Process.GridTable.El();
		elGrid.find('td').css('background-color' ,'#434343');
		elHistory			= Options.Element.Diagram.HistoryGrid.El();

		var indexItemMax	= elHistory.find('a.item').length - 1;
		var indexItemNow	= elHistory.find('a.now').parent().index();

		Options.Variable.History.Grid.push({ Id : paOptions.InputId ,Row : paOptions.IRow ,Col : paOptions.ICol ,Value : paOptions.ValueBef ,ValueAft : paOptions.Value });		
		if ( indexItemNow < indexItemMax ) {
			var itemLi = elHistory.find('li');
			if(elHistory.find('li').eq(indexItemNow).find('a').attr("data-block-chained")!="true"){
				for ( var fx=itemLi.length; fx>indexItemNow; --fx ) {
					itemLi.eq(fx).empty().remove();
				};
			}
		};

		elHistory.find('a').removeClass('now').end();

		a = $i('<a/>' ,{
			href				: '#'
		,	text				: lang_return("fixa.core.title057")+'(Rows : ' + paOptions.IRow + ', Cols : ' + paOptions.ICol + ')' // 데이터
																																		// 수정
		,	title				: paOptions.ValueBef + '→' + paOptions.Value
		,	class				: 'item u now'
		,   'data-block-chained': false
		,	'data-id'			: paOptions.InputId
		,	'data-index-row'	: paOptions.IRow
		,	'data-index-col'	: paOptions.ICol
		,	'data-value-before'	: paOptions.ValueBef
		,	'data-value-after'	: paOptions.Value
		,   'mac-address'       : $("#mac_address").val()
		}).on( 'click' ,function(e) { Core.History.GridClick(this); } );

	} else if ( 'diagram' == paOptions.Type.toLowerCase() ) {
		elHistory			= Options.Element.Diagram.HistoryDiagram.El();
// if ( indexItemNow < indexItemMax ) {
		var dataGlobal		= Options.Variable.Diagram.Global;
		var lengthDiagram	= Options.Variable.History.Diagram.Rule.length;
		var elDiagram		= Options.Element.Diagram.Diagram.El();
		var indexItemMax	= elHistory.find('a.item').length - 1;
		var indexItemNow	= elHistory.find('a.now').parent().index();
		var cellsArr		= Options.Variable.Diagram.Cells;
		var dataHistory		= [];
		
		var isChange = false;
		for ( var fx=0; fx<cellsArr.length; fx++ ) {
			dataHistory.push(cellsArr[fx]);
		};
		
		


	Options.Variable.History.Diagram.DataSel.SelRule		= elDiagram.attr('data-sel-rule');
	Options.Variable.History.Diagram.DataSel.SelId			= elDiagram.attr('data-sel-id');
	Options.Variable.History.Diagram.DataSel.SelType		= elDiagram.attr('data-sel-type');
	Options.Variable.History.Diagram.Rule[lengthDiagram]	= [];
	
// var liindex = parseInt($(".item.u.now").attr("id"));
	
		for ( var fx=0; fx<Options.Variable.Diagram.Cells.length; fx++ ) {
			Options.Variable.History.Diagram.Rule[lengthDiagram][fx] = Options.Variable.Diagram.Cells[fx];
		};
		
		Options.Variable.History.Diagram.Global[lengthDiagram]	= {};
		$i.each(dataGlobal ,function(key ,value) {
			Options.Variable.History.Diagram.Global[lengthDiagram][key] = value;
		});
	elHistory.find('a').removeClass('now').end();
	var maxli = $("#itmHistoryDiagram li").length-1;
	a = $i('<a/>' ,{
		href				: '#'
	,	text				: paOptions.RuleName
	,	class				: 'item u now'
	,	id					: maxli
	}).on( 'click' ,function(e) {Core.History.DiagramClick(this); } );

	};	
	var li	= $i('<li/>').html(a);
	elHistory.append(li);
	
};
Core.History.IndexReflect = function() {
	
	var temp= slickGrid.getData(Options.Variable.slickGrid.id["prepGrid"]);
	 var dummy = [];
	  var tempIdx = 0;
	  for(i=0;i<temp.length;i++)
     {
			// 임시 저장된 idx값보다 1증가된값 기존의 row idx값으로 세팅
			temp[i].idx = tempIdx+1;
			// 설정된 row값 그리드에 저장
			dummy.push(temp[i]);
			// 현재 세팅된 idx값을 다시 temp로 저장
			tempIdx = tempIdx+1;
     }
	  slickGrid.setData(Options.Variable.slickGrid.id["prepGrid"],dummy);
	  Options.Variable.slickGrid.id["prepGrid"].render();
};
//뒤로 돌리기(공통 기능)
Core.History.Undo = function(e) {
	var size = $("#arSheet li a").length;
	for(var i=0; i<size; i++){
		if($("#arSheet li:eq("+i+") a").attr("class")== "on"){
			if($("#arSheet li:eq("+i+") a").attr("id")=="data_workflow"){
				Core.Diagram.Prev();
			}else if($("#arSheet li:eq("+i+") a").attr("id")=="data_prep"){
				
				if(Options.PrevProcess == false){
					Core.Prep.jsonReadPrev();
				}else{
					alert_message("로딩중...");
				}
			}
		}
	}
};
//앞으로 되돌리기(공통기능)
Core.History.Redo = function( e ) {
	var size = $("#arSheet li a").length;
	for(var i=0; i<size; i++){
		if($("#arSheet li:eq("+i+") a").attr("class")== "on"){
			if($("#arSheet li:eq("+i+") a").attr("id")=="data_workflow"){
				Core.Diagram.Next();
			}else if($("#arSheet li:eq("+i+") a").attr("id")=="data_prep"){
				
				if(Options.NextProcess == false){
					Core.Prep.jsonReadNext();
				}else{
					alert_message("로딩중...");
				}
			}
		}
	}
};


Core.History.GridClick = function( paThis ) {
	
	var elGrid		= Options.Element.Process.GridTable.El();
	var evTarget	= $i(paThis);
	var indexTarget	= evTarget.parent().index();
	var indexNow	= evTarget.parent().parent().find('a.now').parent().index();
	var li			= evTarget.parent().parent().find('li');

	elGrid.find('td').css('background-color' ,'#4d4d4d');
	evTarget.parent().parent().find('a.item').removeClass('now').end().end().end().addClass('now');

	if ( indexNow > indexTarget ) {
		for ( var fx=parseInt(indexNow); fx>indexTarget; --fx ) {
			var tmpObj		= li.eq(fx);
			var tmpObjAk	= tmpObj.find('a.item').eq(0);
			var tmpValBef	= tmpObjAk.attr('data-value-before');
			var tmpRow		= tmpObjAk.attr('data-index-row');
			var tmpCol		= tmpObjAk.attr('data-index-col');
			elGrid.find('tr').eq(tmpRow).find('td').eq(tmpCol).css('background-color' ,'#000000').text(tmpValBef);
		};
	} else if ( indexNow < indexTarget ) {
		for ( var fx=(parseInt(indexNow)+1); fx<=indexTarget; ++fx ) {
			var tmpObj		= li.eq(fx);
			var tmpObjAk	= tmpObj.find('a.item').eq(0);
			var tmpValAft	= tmpObjAk.attr('data-value-after');
			var tmpRow		= tmpObjAk.attr('data-index-row');
			var tmpCol		= tmpObjAk.attr('data-index-col');
			elGrid.find('tr').eq(tmpRow).find('td').eq(tmpCol).css('background-color' ,'#000000').text(tmpValAft);
		};
	};
};

Core.History.DiagramClick = function( paThis) {
	Options.dragId = "";
	var evTarget		= $i(paThis);
	var indexTarget		= evTarget.parent().index()-1;
	var indexNow		= evTarget.parent().parent().find('a.now').parent().index();
	
	var li				= evTarget.parent().parent().find('li');
	var diagramCell		= Options.Variable.History.Diagram.Rule[indexTarget];
	Core.Diagram.Selector.Remove(evTarget );
	if(diagramCell == undefined){
		
	    diagramCell = Options.Variable.History.Diagram.Rule[0][0];
		
		Options.Variable.Diagram.Graph.resetCells(diagramCell);
		
		evTarget.parent().parent().find('a.item').removeClass('now').end().end().end().addClass('now');
		
	}else{
		
		Options.Variable.Diagram.Global	= Options.Variable.History.Diagram.Global[indexTarget];
		Options.Variable.Diagram.Graph.resetCells(diagramCell);
	    V( Options.Variable.Diagram.Paper.findViewByModel( diagramCell[0].id ).el ).addClass('lock');

		for ( var fx=1; fx<diagramCell.length; ++fx ) {
			var model = diagramCell[fx];
			V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el).attr( 'data-index'	,model.attributes.Use.Index		);
			V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el).attr( 'data-rule'	,model.attributes.Use.Rule		);
			V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el).attr( 'data-type'	,model.attributes.Use.RuleType	);
			V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el).attr( 'transformX'	,model.attributes.Use.x	);
			V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el).attr( 'transformY'	,model.attributes.Use.y	);
			V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el).attr( 'data-name'	,model.attributes.Use.Name	);
			V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el).attr( 'data-rule-opt',model.attributes.Use.RuleOpt	);
		};
		evTarget.parent().parent().find('a.item').removeClass('now').end().end().end().addClass('now');
		
	}
	
	Core.Diagram.IndexSetting();
	
};



Core.Diagram.Selector = {};

Core.Diagram.Selector.Create = function( cellView ,evt ,x ,y ,elTarget ) {

	var type = $i(cellView.el).attr("data-type");
	if(type=="devs.MyImageModel"){
		return false;
	}
	var modelId = cellView.model.id; 
	left_append_px = 345;
	
	if(Number($("#arConsole").css("left").replace("px",""))==10)
	{
		left_append_px = 345;	
	}
	else
	{
		left_append_px = 25;
	}
	if($("#"+modelId).length !=0){
		for(var i=0; i<$("#"+modelId).length; i++){
			Options.Element.Diagram.Diagram.El().find("#"+modelId+"").remove().end().find("#"+modelId+"").remove();
		}
	}
		var elParent		= Options.Element.Diagram.Diagram.El();
		var elTargetOffset	= elTarget.parents('.joint-cell').find('.scalable').offset();
		var elSelector		= $i('<div/>' ,{
			class	: 'jointJS_shapes_seletor'
		,   id      : cellView.model.id 
		,	style	: 'left : ' + (elTargetOffset.left - 6) + 'px; top : ' + (elTargetOffset.top - 98) + 'px;' + 'display:none;' 
		});
		var elCloseButton	= $i('<a/>' ,{
			class	: 'jointJS_shapes_close'
		,   id      : cellView.model.id 
		,	href	: '#'
		,	style	: 'left : ' + (elTargetOffset.left - left_append_px) + 'px; top : ' + (elTargetOffset.top - 190) + 'px;'
		}).on('click' ,function( e ){
			Core.Diagram.Remove( cellView ,evt ,x ,y ,elTarget );
		});
		
		// , html :
		// '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+cellView.model.attributes.Use.Name
		
		var elTitle		= $('<div/>' ,{
				style 	: 'position:relative;left:23px;width:150px'
			, 	html	: cellView.model.attributes.Use.Name
			
		});   
		$i(document).off('keydown');
		$i(document).on('keydown' ,function ( e ) {
			if ( 'input' != $i(e.target).prop('tagName').toLowerCase() ) {
				if (e.keyCode == 90 && e.ctrlKey) { Core.History.Undo( e ); };
				if (e.keyCode == 89 && e.ctrlKey) { Core.History.Redo( e ); };
			};
			if($("image").length > 1){
				if (e.keyCode == 46){
					Core.Diagram.Remove( cellView ,evt ,x ,y ,elTarget );
				} 
			}
			
		});
		
		elCloseButton.append(elTitle);
		
		
		
		
	// Core.Diagram.Selector.Remove( cellView ,evt ,x ,y ,elTarget );
		elParent.append(elSelector).append(elCloseButton);
	
};

Core.Diagram.Selector.Remove = function() {
	Options.Element.Diagram.Diagram.El().find('.jointJS_shapes_seletor').remove().end().find('.jointJS_shapes_close').remove();
};



Core.Diagram.Contextmenu = {};

Core.Diagram.Contextmenu.Create = function( cellView ,evt ,x ,y ,elTarget ,ruleSn ,ruleType ) {
/* 클릭 시 Modal 바로실행을 위한 주석 (삭제하지 마시오) */
/*
 * var elParent = Options.Element.Diagram.Diagram.El(); var elTargetOffset =
 * elTarget.parents('.joint-cell').find('.scalable').offset(); var elContextmenu =
 * $i('<ul/>' ,{ id : Options.Element.Diagram.Contextmenu.Id , class :
 * 'jointJS_shapes_contextmenu' , style : 'left : ' + (elTargetOffset.left + 94) +
 * 'px; top : ' + (elTargetOffset.top + 2) + 'px;' }); var dataMenu =
 * Options.Menu.Context; for ( var fx=0; fx<dataMenu.length; ++fx ) { var
 * elContextmenuList = $i('<li/>' ,{ class : 'item' }); var elContentmenuLink =
 * $i('<a/>' ,{ href : dataMenu[fx].Link , text : dataMenu[fx].Text , onclick :
 * dataMenu[fx].Event }); elContextmenuList.html(elContentmenuLink);
 * elContextmenu.append(elContextmenuList); };
 * 
 * Options.Element.Diagram.Diagram.El().append(elContextmenu);
 */


	Core.Diagram.Contextmenu.ColumnList( ruleType );
};








/**
 * 사용자 정의 룰셋 정의 ed : Existing data(기존데이터)
 */
Core.Diagram.Contextmenu.CustomCreateSidebarMakeTag = function(option,type,d, ed )
{

	
	var div = null;
	
	
	if(type=="addrule")
	{
	
		div = $i("<div/>",{class:"addrule"});
		if($("#custom_setting").children("div.addrule").length>0)
		{
			prefix_value = "";
			if(ed!=null && ed.filter(function(e){if(e.name=="prefix"){return e;}}).length>0 )
			{
				prefix_value =ed.filter(function(e){if(e.name=="prefix"){return e;}})[0]['val'];
			}
			
			 
			
			// and or 등의 prefix
			prefixDiv = $i("<select/>",{name:"prefix"});
			if(prefix_value=="")
			{
				prefixDiv.append($('<option/>' ,{ value : "and" ,text : "and"}));
				prefixDiv.append($('<option/>' ,{ value : "or" ,text : "or"}));
			}
			else
			{
				var prefix_value_selected = {};
				prefix_value_selected[prefix_value] = true;
				prefixDiv.append($('<option/>' ,{ value : "and" ,text : "and", selected:prefix_value_selected['and']}));
				prefixDiv.append($('<option/>' ,{ value : "or" ,text : "or",selected:prefix_value_selected['or']}));
			}
			div.append(prefixDiv);	
		}
		
		// 데이터 타입 설정
		var type_value_selected = {}
		var type_value = "";
		if(ed!=null && ed.filter(function(e){if(e.name=="datatype"){return e;}}).length>0 )
		{
			type_value =ed.filter(function(e){if(e.name=="datatype"){return e;}})[0]['val'];
			type_value_selected[type_value] = true;
		}
		
		
		console.log("type_value",type_value);
		
		// 인붓박스
		var input1_value = "";
		var input2_value = "";
		if(ed!=null && ed.filter(function(e){if(e.name=="input1"){return e;}}).length>0 )
		{
			input1_value =ed.filter(function(e){if(e.name=="input1"){return e;}})[0]['val'];
		}
		
		if(ed!=null && ed.filter(function(e){if(e.name=="input2"){return e;}}).length>0 )
		{
			input2_value =ed.filter(function(e){if(e.name=="input2"){return e;}})[0]['val'];
		}
		var input_text1 = $i("<input/>",{type:"text",name:"input1", value:input1_value, class: "datepicker"});
		var input_text2 = $i("<input/>",{type:"text",name:"input2", value:input2_value, class: "datepicker"});
		
		
		// 데이터의 속성
		typeDiv = $i("<select/>",{name:"datatype",id:"addrule_datatype"} ).on('change' ,function(e) {
			
			var value = $i(this).val();
			if(value != "date"){
				var id = $i(this).parent().children("input[name='input1']").attr("id");
				var id2 = $i(this).parent().children("input[name='input2']").attr("id");
				
				$("#"+id).datepicker( "destroy" );
				$("#"+id).removeClass("hasDatepicker");
				
				$("#"+id2).datepicker( "destroy" );
				$("#"+id2).removeClass("hasDatepicker");
				
				$("#"+id).attr("readonly",false);
				$("#"+id2).attr("readonly",false);
				
				
				$("#"+id).val("");
				$("#"+id2).val("");
				
				
				
			}else{
				var id = $i(this).parent().children("input[name='input1']").attr("id");
				var id2 = $i(this).parent().children("input[name='input2']").attr("id");
				
				
				
				$("#"+id+"").datepicker('option','disabled',false).removeAttr('disabled');
				$("#"+id2+"").datepicker('option','disabled',false).removeAttr('disabled');
				
				
				$("#"+id).datepicker({ dateFormat: 'yy-mm-dd' });
				$("#"+id).attr("autocomplete","off").attr("readonly",true);
				
				$("#"+id2).datepicker({ dateFormat: 'yy-mm-dd' });
				$("#"+id2).attr("autocomplete","off").attr("readonly",true);
				$("#"+id).val("");
				$("#"+id2).val("");
			}

			// console.log($i(this).parent().find("select[name='operation']"));
			
			$i(this).parent().find("select[name='operation'] option").remove();
			
			for(i=0;i<Options.custom_operation.length;i++)
			{
				if(Options.custom_operation[i].permit.split(",").indexOf($(this).val())>=0){
					
					if(operation_value==Options.custom_operation[i].operation){
						$i(this).parent().find("select[name='operation']").append($('<option/>' ,{ value : Options.custom_operation[i].operation ,text : Options.custom_operation[i].display, selected:true}));
					}
					else
					{
						$i(this).parent().find("select[name='operation']").append($('<option/>' ,{ value : Options.custom_operation[i].operation ,text : Options.custom_operation[i].display}));
					}
				}	
			}
			
			
			
			if($i(this).parent().find("select[name='operation']").val()!="between")
			{
				$i(this).parent().children("input[name='input1']").val("");
				$i(this).parent().children("input[name='input2']").val("");
// $i(this).parent().children("input[name='input2']").remove();
				$i(this).parent().children("input[name='input2']").css("display","none");
				
			}
			else
			{
				$i(this).parent().find("input[name='input1']").val("");
// $i(this).parent().find("input[name='input1']").after(input_text2);
				$i(this).parent().children("input[name='input2']").css("display","");
			}
			
		});
		typeDiv.append($('<option/>' ,{ value : "date"  ,text : "date" ,selected : function(){return type_value_selected['date']}}));
		typeDiv.append($('<option/>' ,{ value : "char"  ,text : "char", selected : function(){return type_value_selected['char']} }));
		typeDiv.append($('<option/>' ,{ value : "number"   ,text : "number",selected : function(){return type_value_selected['number']}}));
		
		
		
		div.append(typeDiv)
		
		
		
		
		
		// 해당 필드
		
		var select_field_value = "";
		if(ed!=null && ed.filter(function(e){if(e.name=="field"){return e;}}).length>0 )
		{
			select_field_value =ed.filter(function(e){if(e.name=="field"){return e;}})[0]['val'];
		}
		
		var headerList	= Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).join(",").split(',');
		var select_field = $i("<select/>",{name:"field"});
		for(i=0;i<headerList.length;i++)
		{
			
			if(select_field_value==headerList[i])
			{
				select_field.append($('<option/>' ,{ value : headerList[i] ,text : headerList[i], selected:true}));	
			}
			else
			{
				select_field.append($('<option/>' ,{ value : headerList[i] ,text : headerList[i]}));
			}
			
		}
		div.append(select_field)
		
		
		
		
		// operation
		var operation_value = "";
		if(ed!=null && ed.filter(function(e){if(e.name=="operation"){return e;}}).length>0 )
		{
			operation_value =ed.filter(function(e){if(e.name=="operation"){return e;}})[0]['val'];
		}

		
		var select_operation = $i("<select/>",{name:"operation"}).on('change' ,function(e) {
			var value = $i(this).val();
			
			if(value!="between")
			{
// $i(this).parent().children("input[name='input2']").remove();
				$i(this).parent().children("input[name='input2']").css("display","none");
			}
			else
			{
// $i(this).parent().find("input[name='input1']").after(input_text2);
				$i(this).parent().children("input[name='input2']").css("display","");
			}
		});

		// operation
		for(i=0;i<Options.custom_operation.length;i++)
		{
			if(type_value=="")
			{
				type_value = "date";
			}
			
			if(Options.custom_operation[i].permit.split(",").indexOf(type_value)>=0){
				if(operation_value==Options.custom_operation[i].operation){
					select_operation.append($('<option/>' ,{ value : Options.custom_operation[i].operation ,text : Options.custom_operation[i].display, selected:true}));
				}
				else
				{
					select_operation.append($('<option/>' ,{ value : Options.custom_operation[i].operation ,text : Options.custom_operation[i].display}));
				}
			}
			
		}
		div.append(select_operation);
		
		
		
		
		if(operation_value=="between" || operation_value=="")
		{
			div.append(input_text1).append(input_text2);
		}
		else
		{
			div.append(input_text1);
		}
		
		if($("#custom_setting").children("div.addrule").length>0)
		{
		
			div.append($i("<a/>",{text:lang_return("fixa.core.title050")}).on("click",function(e)
					{
						$i(this).parent().remove();
					}));
		}
		$("#custom_setting").append(div);
		
		
	}
	else if(type=="addgroup")
	{
		
		if(option==null)
		{
			option = {};
		}
		
		
		div = $i("<div/>",{class:"addgroup"}).append($("<span/>",{text:lang_return("fixa.core.title167")}));
		
		
		var sub_div = $i("<div/>", {class:"subrule"});
		
		
		
		option.sub_div = sub_div;
		
		
		
		
// console.log("ed",ed.length);
		if(ed!=null)
		{
			console.log("ed length",ed.length);
			for(var j=0;j<ed.length;j++)
			{
				Core.Diagram.Contextmenu.CustomCreateSidebarMakeTag(option,"add_subrule",d,ed[j]);
			}
		}
		else
		{
			Core.Diagram.Contextmenu.CustomCreateSidebarMakeTag(option,"add_subrule",d,null);
		}
		
		
		div.append(sub_div);
		
		var adgroup_form = $("<a/>",{"class":"add_group",text:lang_return("fixa.core.title170")}).on("click",function(e){
			
			Core.Diagram.Contextmenu.CustomCreateSidebarMakeTag(option,"add_subrule",d, null);
		});
		
		div.append(adgroup_form);
		
		var delgroup_form = $("<a/>",{"class":"del_group",text:lang_return("fixa.core.title169")}).on("click",function(e){
			$(this).parent().remove();
		});
		div.append(delgroup_form);
		
		$("#custom_setting").append(div);
		
		
		
	}
	else if(type=="add_subrule")
	{
		
		
		var litag = $("<li/>");
		
		
		
		if(option.sub_div.children("li").length>0)
		{
			prefix_value = "";
			if(ed!=null && ed.filter(function(e){if(e.name=="prefix"){return e;}}).length>0 )
			{
				prefix_value =ed.filter(function(e){if(e.name=="prefix"){return e;}})[0]['val'];
			}
			
			 
			
			// and or 등의 prefix
			// and or 등의 prefix
			prefixDiv = $i("<select/>",{name:"prefix"});
			if(prefix_value=="")
			{
				prefixDiv.append($('<option/>' ,{ value : "and" ,text : "and"}));
				prefixDiv.append($('<option/>' ,{ value : "or" ,text : "or"}));
			}
			else
			{
				var prefix_value_selected = {};
				prefix_value_selected[prefix_value] = true;
				prefixDiv.append($('<option/>' ,{ value : "and" ,text : "and", selected:prefix_value_selected['and']}));
				prefixDiv.append($('<option/>' ,{ value : "or" ,text : "or",selected:prefix_value_selected['or']}));
			}
			
			litag.append(prefixDiv);	
		}
		
		
		
		
		

		// 데이터 타입 설정
		var type_value_selected = {}
		var type_value = "";
		if(ed!=null && ed.filter(function(e){if(e.name=="datatype"){return e;}}).length>0 )
		{
			type_value =ed.filter(function(e){if(e.name=="datatype"){return e;}})[0]['val'];
			type_value_selected[type_value] = true;
		}
		
		
		console.log("type_value",type_value);
		
		
		// 데이터의 속성
		typeDiv = $i("<select/>",{name:"datatype" ,id:"add_subrule_datatype" }).on('change' ,function(e) {
			var value = $i(this).val();
			if(value != "date"){
				var id = $i(this).parent().children("input[name='input1']").attr("id");
				var id2 = $i(this).parent().children("input[name='input2']").attr("id");
				
				$("#"+id).datepicker( "destroy" );
				$("#"+id).removeClass("hasDatepicker");
				
				$("#"+id2).datepicker( "destroy" );
				$("#"+id2).removeClass("hasDatepicker");
				
				$("#"+id).attr("readonly",false);
				$("#"+id2).attr("readonly",false);
				
				
				$("#"+id).val("");
				$("#"+id2).val("");
				
				
			}else{
				var id = $i(this).parent().children("input[name='input1']").attr("id");
				var id2 = $i(this).parent().children("input[name='input2']").attr("id");
				
				
				$("#"+id+"").datepicker('option','disabled',false).removeAttr('disabled');
				$("#"+id2+"").datepicker('option','disabled',false).removeAttr('disabled');
				
				
				$("#"+id).datepicker({ dateFormat: 'yy-mm-dd' });
				$("#"+id).attr("autocomplete","off").attr("readonly",true);
				
				$("#"+id2).datepicker({ dateFormat: 'yy-mm-dd' });
				$("#"+id2).attr("autocomplete","off").attr("readonly",true);
				$("#"+id).val("");
				$("#"+id2).val("");
			}
			
			$i(this).parent().find("select[name='operation'] option").remove();
			
			for(i=0;i<Options.custom_operation.length;i++)
			{
				if(Options.custom_operation[i].permit.split(",").indexOf($(this).val())>=0){
					
					if(operation_value==Options.custom_operation[i].operation){
						$i(this).parent().find("select[name='operation']").append($('<option/>' ,{ value : Options.custom_operation[i].operation ,text : Options.custom_operation[i].display, selected:true}));
					}
					else
					{
						$i(this).parent().find("select[name='operation']").append($('<option/>' ,{ value : Options.custom_operation[i].operation ,text : Options.custom_operation[i].display}));
					}
				}	
			}
			
			
			
			if($i(this).parent().find("select[name='operation']").val()!="between")
			{
				$i(this).parent().children("input[name='input1']").val("");
				$i(this).parent().children("input[name='input2']").val("");
// $i(this).parent().children("input[name='input2']").remove();
				$i(this).parent().children("input[name='input2']").css("display","none");
				
			}
			else
			{
				$i(this).parent().find("input[name='input1']").val("");
// $i(this).parent().find("input[name='input1']").after(input_text2);
				$i(this).parent().children("input[name='input2']").css("display","");
			}
			
		});
		typeDiv.append($('<option/>' ,{ value : "date" ,text : "date" ,selected : function(){return type_value_selected['date']}}));
		typeDiv.append($('<option/>' ,{ value : "char" ,text : "chart", selected : function(){return type_value_selected['char']} }));
		typeDiv.append($('<option/>' ,{ value : "number"   ,text : "number",selected : function(){return type_value_selected['number']}}));
		
		litag.append(typeDiv)
		
		
		
		
		
		// 해당 필드
		field_value = "";
		if(ed!=null && ed.filter(function(e){if(e.name=="field"){return e;}}).length>0 )
		{
			field_value =ed.filter(function(e){if(e.name=="field"){return e;}})[0]['val'];
		}
		
		
		
		var headerList	= Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).join(",").split(',');
		var select_field = $i("<select/>",{name:"field"});
		for(i=0;i<headerList.length;i++)
		{
			if(field_value==headerList[i])
			{
				select_field.append($('<option/>' ,{ value : headerList[i] ,text : headerList[i],selected:true}));
			}
			else
			{
				select_field.append($('<option/>' ,{ value : headerList[i] ,text : headerList[i]}));	
			}
			
		}
		litag.append(select_field)
		
		
		// 인붓박스
		var input1_value = "";
		var input2_value = "";
		if(ed!=null && ed.filter(function(e){if(e.name=="input1"){return e;}}).length>0 )
		{
			input1_value =ed.filter(function(e){if(e.name=="input1"){return e;}})[0]['val'];
		}
		
		if(ed!=null && ed.filter(function(e){if(e.name=="input2"){return e;}}).length>0 )
		{
			input2_value =ed.filter(function(e){if(e.name=="input2"){return e;}})[0]['val'];
		}
		
		// 인붓박스
		var input_text1 = $i("<input/>",{type:"text",name:"input1", value:input1_value, class: "datepicker"});
		var input_text2 = $i("<input/>",{type:"text",name:"input2", value:input2_value, class: "datepicker"});
		
		
		// operation
		operation_value = "";
		if(ed!=null && ed.filter(function(e){if(e.name=="operation"){return e;}}).length>0 )
		{
			operation_value =ed.filter(function(e){if(e.name=="operation"){return e;}})[0]['val'];
		}
		
		var select_operation = $i("<select/>",{name:"operation"}).on('change' ,function(e) {
			var value = $i(this).val();
			
			if(value!="between")
			{
				$i(this).parent().children("input[name='input2']").remove();
			}
			else
			{
				$i(this).parent().find("input[name='input1']").after(input_text2);
			}
		});
		
		
		
		// operation
		for(i=0;i<Options.custom_operation.length;i++)
		{
			if(type_value=="")
			{
				type_value = "date";
			}
			
			if(Options.custom_operation[i].permit.split(",").indexOf(type_value)>0){
				
				if(operation_value==Options.custom_operation[i].operation){
					select_operation.append($('<option/>' ,{ value : Options.custom_operation[i].operation ,text : Options.custom_operation[i].display, selected:true}));
				}
				else
				{
					select_operation.append($('<option/>' ,{ value : Options.custom_operation[i].operation ,text : Options.custom_operation[i].display}));
				}
			}
		}
		litag.append(select_operation);
		
		if(operation_value=="between" || operation_value=="")	
		{
			litag.append(input_text1).append(input_text2);
		}
		else
		{
			litag.append(input_text1);
		}
		

		if(option.sub_div.children("li").length>0)
		{
			// 서브 필드 삭제 기능 추가
			sub_del = $i("<a/>",{text:lang_return("fixa.core.title050")}).on("click",function(e){
				$(this).parent().remove();
			});
			litag.append(sub_del);
		}
		
		option.sub_div.append(litag);
	}
	
	$(".datepicker" ).datepicker({
		
			dateFormat: 'yy-mm-dd',
			showMonthAfterYear : true,
			changeYear: true,
			changeMonth: true,monthNames : [ lang_return("fixa.common.date1"),lang_return("fixa.common.date2"),lang_return("fixa.common.date3"),lang_return("fixa.common.date4"),lang_return("fixa.common.date5"),lang_return("fixa.common.date6"),lang_return("fixa.common.date7"),
											 lang_return("fixa.common.date8"),lang_return("fixa.common.date9"),lang_return("fixa.common.date10"),lang_return("fixa.common.date11"),lang_return("fixa.common.date12")],//1~12월까지
			monthNamesShort : [ lang_return("fixa.common.date1"),lang_return("fixa.common.date2"),lang_return("fixa.common.date3"),lang_return("fixa.common.date4"),lang_return("fixa.common.date5"),lang_return("fixa.common.date6"),lang_return("fixa.common.date7"),
				 lang_return("fixa.common.date8"),lang_return("fixa.common.date9"),lang_return("fixa.common.date10"),lang_return("fixa.common.date11"),lang_return("fixa.common.date12") ],//1~12월까지
			dayNames : [ lang_return("fixa.common.date13"),lang_return("fixa.common.date14"),lang_return("fixa.common.date15"),lang_return("fixa.common.date16"),lang_return("fixa.common.date17"),lang_return("fixa.common.date18"),lang_return("fixa.common.date19") ],//일요일~월요일
			dayNamesShort : [ lang_return("fixa.common.date20"),lang_return("fixa.common.date21"),lang_return("fixa.common.date22"),lang_return("fixa.common.date23"),lang_return("fixa.common.date24"),lang_return("fixa.common.date25"),lang_return("fixa.common.date26") ],//일~월
			dayNamesMin : [  lang_return("fixa.common.date20"),lang_return("fixa.common.date21"),lang_return("fixa.common.date22"),lang_return("fixa.common.date23"),lang_return("fixa.common.date24"),lang_return("fixa.common.date25"),lang_return("fixa.common.date26") ],//일~월
			yearRange: 'c-70:c+0'
			
		});
	
	// $(".datepicker" ).datepicker({ });
	$(".datepicker").attr("autocomplete","off");
	Core.Diagram.CheckDateType();
	

}


Core.Diagram.CloudSetting = function(obj){
	 weight = "asdf";
	 list = [];
	 
	 
	 //for(var m=0;m<obj.length;m++)
	 //{
	 $.each(obj, function(index, item){ 
 
		 console.log("item",item);
		 
		 temp = {};
		 temp = item;
		 
		 //console.log("temp",temp);
		 
		 weight = temp['weight'];
		 
		 temp['handlers'] = {click: function(res) { 
			 					
			 weight_number = 0;
			 try{
				 weight_number = AddComma($(res.target).eq(0).attr("custom_weight"));
			 }
			 catch(e){
				 
			 }
			 
			 alert_message(res.target.textContent+"단어가 "+weight_number +" 번검출되었습니다.");
			 					/**
			 					alert("it worked for"+weight+"/"+res.target.textContent); 
			 					console.log("aaa");
			 					console.log();
			 					console.log(res.target.attributes.custom_weight.custom_weight);
			 					**/ 
			 				}
		 };
		 list.push(temp);
	 });
	 //}
	  
	 
	 console.log("list",list);
	 
	 setTimeout(function(){
		 $('#cloud').jQCloud(list, {
			 autoResize: true
		 });
	 },1000);
	 
	


		
};

Core.Diagram.CheckDateType = function (){
	
	
	if($('.addrule').length > 0){
		for(var i=0; i<$('.addrule').length; i++ ){
			var value = $('.addrule:eq('+i+') #addrule_datatype').val();
			if(value != "date"){
				var addrule_datatype_id =$('.addrule:eq('+i+') #addrule_datatype').parent().children("input[name='input1']").attr("id");
				var addrule_datatype_id2 =$('.addrule:eq('+i+') #addrule_datatype').parent().children("input[name='input2']").attr("id");
				$("#"+addrule_datatype_id).datepicker( "destroy" );
				$("#"+addrule_datatype_id).removeClass("hasDatepicker");
				$("#"+addrule_datatype_id2).datepicker( "destroy" );
				$("#"+addrule_datatype_id2).removeClass("hasDatepicker");
				$("#"+addrule_datatype_id).attr("readonly",false);
				$("#"+addrule_datatype_id2).attr("readonly",false);
// $("#"+addrule_datatype_id).val("");
// $("#"+addrule_datatype_id2).val("");
				
			}else{
				var addrule_datatype_id = $('.addrule:eq('+i+') #addrule_datatype').parent().children("input[name='input1']").attr("id");
				var addrule_datatype_id2 = $('.addrule:eq('+i+') #addrule_datatype').parent().children("input[name='input2']").attr("id");
				$("#"+addrule_datatype_id+"").datepicker('option','disabled',false).removeAttr('disabled');
				$("#"+addrule_datatype_id2+"").datepicker('option','disabled',false).removeAttr('disabled');
				$("#"+addrule_datatype_id).datepicker({ dateFormat: 'yy-mm-dd' });
				$("#"+addrule_datatype_id).attr("autocomplete","off").attr("readonly",true);
				$("#"+addrule_datatype_id2).datepicker({ dateFormat: 'yy-mm-dd' });
				$("#"+addrule_datatype_id2).attr("autocomplete","off").attr("readonly",true);
// $("#"+addrule_datatype_id).val("");
// $("#"+addrule_datatype_id2).val("");
			}
		}
	}
	if($('.addgroup').length > 0){
		for(var i=0; i<$('.addgroup').length; i++ ){
			for(var j=0; j<$('.addgroup:eq('+i+') li').length; j++){
				var value = $('.addgroup:eq('+i+') li:eq('+j+') #add_subrule_datatype').val();
				if(value != "date"){
					var id = $('.addgroup:eq('+i+') li:eq('+j+') #add_subrule_datatype').parent().children("input[name='input1']").attr("id");
					var id2 = $('.addgroup:eq('+i+') li:eq('+j+') #add_subrule_datatype').parent().children("input[name='input2']").attr("id");
					$("#"+id).datepicker( "destroy" );
					$("#"+id).removeClass("hasDatepicker");
					$("#"+id2).datepicker( "destroy" );
					$("#"+id2).removeClass("hasDatepicker");
					$("#"+id).attr("readonly",false);
					$("#"+id2).attr("readonly",false);
// $("#"+id).val("");
// $("#"+id2).val("");
					
				}else{
					var id = $('.addgroup:eq('+i+') li:eq('+j+') #add_subrule_datatype').parent().children("input[name='input1']").attr("id");
					var id2 =$('.addgroup:eq('+i+') li:eq('+j+') #add_subrule_datatype').parent().children("input[name='input2']").attr("id");
					$("#"+id+"").datepicker('option','disabled',false).removeAttr('disabled');
					$("#"+id2+"").datepicker('option','disabled',false).removeAttr('disabled');
					$("#"+id).datepicker({ dateFormat: 'yy-mm-dd' });
					$("#"+id).attr("autocomplete","off").attr("readonly",true);
					$("#"+id2).datepicker({ dateFormat: 'yy-mm-dd' });
					$("#"+id2).attr("autocomplete","off").attr("readonly",true);
// $("#"+id).val("");
// $("#"+id2).val("");
				}
			}
		}
	}
}
/**
 * 사용자 정의
 */
Core.Diagram.Contextmenu.CustomCreateSidebarHtml = function(d ,ruleId)
{
	
	var option = null;
	// 필드 추가
	var addSelectField = $i( '<a/>' ,{ class : 'button' ,text : lang_return("fixa.core.title168") ,href : '#' } ).on('click' ,function(){
		
		Core.Diagram.Contextmenu.CustomCreateSidebarMakeTag(option,"addrule",d, null);
		
	});
	
	// 오퍼레이션 추가
	var addOperation = $i( '<a/>' ,{ class : 'button' ,text : lang_return("fixa.core.title170") ,href : '#' } ).on('click' ,function()
	{
		
		Core.Diagram.Contextmenu.CustomCreateSidebarMakeTag(option,"addgroup",d, null);
	});
	

	
	
	
	// 타이틀 구성
	var html = $i( '<div/>');
	
	var custom_header = $("<div>",{id:"custom_header"});
	
	
	custom_header.append(addSelectField).append(addOperation);
	
	
	html.append(custom_header);
	
	
	
	
	// 실 입력 기능 구성
	var custom_setting = $i( '<div/>',{id:"custom_setting"});
	html.append(custom_setting);
	
	
	
	
	
	
	
	
	
	
	return html;
}

Core.Diagram.Contextmenu.GetCustomValidation = function(obj, key)
{
	
	result = "";
	if(undefined!=obj)
	{
		for(i=0;i<obj.length;i++)
		{
			
			if(obj[i].name==key){
			
				result = obj[i].val; 
				break;
			}
		}
	}
	return result;
	
}

/**
 * 코드 룰셋
 */
Core.Diagram.Contextmenu.CodeCreateSidebarHtml  = function(d ,ruleId)
{
	var TABLE_HEADER_KEY	= Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).join(",").split(',');
	var TABLE_HEADER_NAME	= Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).join(",").split(',');
	
	var itmList				= $i( '<ul/>' ,{ class : 'checkColumn' } );
	
	var select		= $('<select/>'	,{ id : 'codeRuleSet' ,name : 'codeRuleSet' });
	
	$.each(TABLE_HEADER_KEY, function(index, item){ 
		
		if(item==Options.Variable.Diagram.Global[ruleId].Column)
		{
			select.append($('<option/>' ,{ value : item ,text : item ,selected:true}));
		}
		else
		{
			select.append($('<option/>' ,{ value : item ,text : item }));
		}
		
	});
	
	
	var rule_cont_start = "";
	var rule_cont_end = "";
	
	if(undefined!=Options.Variable.Diagram.Global[ruleId].rule_cont && Options.Variable.Diagram.Global[ruleId].rule_cont !="" && Options.Variable.Diagram.Global[ruleId].rule_cont.split("~").length>0)
	{
		temp = Options.Variable.Diagram.Global[ruleId].rule_cont.split("~");
		var rule_cont_start = temp[0];
		var rule_cont_end = temp[1];
			
	}
	
	itmList.append
	(
	  $i('<label/>' ,{
		text	: lang_return("fixa.core.title171")// '타입설정'
	}))
	.append(select);
	
	
	
	
	return itmList;	
}

Core.Diagram.Contextmenu.CodeCreateSidebar  = function( cellView ,evt ,x ,y ,elTarget ,ruleSn ,ruleType ,d ) {
	
	
	
	
	// @@inni@@
	var elDiagram		= Options.Element.Diagram.Diagram.El();
	var ruleId			= elDiagram.attr('data-sel-id');
	var elAreaHistory	= Options.Element.Global.History.El();
	var elItemHistory	= Options.Element.Diagram.History.El();
	var elItemProperty	= Options.Element.Diagram.Property.El();
	var idxProperty		= elAreaHistory.find('.history').removeClass('on').end().find('.property').addClass('on').index();
	var elWhether		= Core.Diagram.Contextmenu.CodeCreateSidebarHtml( d ,ruleId );
	
	

	
	// 설정하기
	var elSave			= $('<a/>' ,{
		text	: lang_return("fixa.core.title058")// '설정하기'
	,	class	: '_btn'
	}).on('click' ,function(){
		
		
		Options.Variable.Diagram.Global[ruleId].Column = $("#codeRuleSet").val();
		Options.Variable.Diagram.Global[ruleId].rule_cont  = "compare_code";
		Core.Diagram.Contextmenu.CloseSidebar();
	});
	
	
	var elClose			= $('<a/>' ,{
		text	: lang_return("fixa.core.title059")// '닫기'
	,	class	: '_btn'
	,	id		: 'ClosePropertiesSidebar'
	}).on('click' ,function(){
		Core.Diagram.Contextmenu.CloseSidebar();
	});
	
	
	var elButton		= $('<span/>' ,{
		class	: 'button'
		
	}).html(elClose);
	
	var elSaveButton		= $('<span/>' ,{
		class	: 'button'
	}).html(elSave);
	

	elAreaHistory.find('.contents').removeClass('on').eq(idxProperty).addClass('on');
	// 임시
	elItemProperty.html("");
	elItemProperty.append(elWhether).append(elButton).append(elSaveButton);
	
	
}



/**
 * 사용자 정의
 */
Core.Diagram.Contextmenu.CustomCreateSidebar  = function( cellView ,evt ,x ,y ,elTarget ,ruleSn ,ruleType ,d ) {

	var elButtonOk	= $i( '<a/>' ,{ class : 'button' ,text : lang_return("fixa.core.title026") ,href : '#' } ).on('click' ,function() 
	{ 
		valichk = true;
		
		arr = [];
		
		// 체크 로직 처리
		$("#custom_setting").children("div").each(function(k,v){
			
			obj = {};
			obj.type = 	$(this).prop("class");
			obj.data =[];
			
			
			
			
			if($(this).prop("class")=="addrule")
			{
				console.log($(this).children());
				$(this).children().each(function(k1, v2){
					var temp = {};
					switch($(this).prop("name"))
					{
						case "prefix" 		:temp.name = $(this).prop("name");temp.val = $(this).val()		;break;
						case "datatype" 	:temp.name = $(this).prop("name");temp.val = $(this).val()		;break;
						case "field" 		:temp.name = $(this).prop("name");temp.val = $(this).val()		;break;
						case "operation" 	:temp.name = $(this).prop("name");temp.val = $(this).val()		;break;
						case "input1" 		:temp.name = $(this).prop("name");temp.val = $(this).val()		;break;
						case "input2" 		:temp.name = $(this).prop("name");temp.val = $(this).val()		;break;
						
					}
					obj.data.push(temp)
				});
				
				arr.push(obj);
			}
			else if($(this).prop("class")=="addgroup")
			{
			
				
				$(this).children("div").children("li").each(function(k1,v2){
					
					
					
					
					var li = [];
					
					$(this).children().each(function(k2,v2){
						if($(this).prop("name")!="")
						{
							var temp = {};
								
							
							switch($(this).prop("name"))
							{
								case "prefix" 		:temp.name = $(this).prop("name");temp.val = $(this).val()		;break;
								case "datatype" 	:temp.name = $(this).prop("name");temp.val = $(this).val()		;break;
								case "field" 		:temp.name = $(this).prop("name");temp.val = $(this).val()		;break;
								case "operation" 	:temp.name = $(this).prop("name");temp.val = $(this).val()		;break;
								case "input1" 		:temp.name = $(this).prop("name");temp.val = $(this).val()		;break;
								case "input2" 		:temp.name = $(this).prop("name");temp.val = $(this).val()		;break;
								
							}
							li.push(temp);
						}
						
					});
					obj.data.push(li);
				});
				
			
				arr.push(obj);
			}
			
			
		});
		
		
		// validation
		
		
		
		
		
		
		
		
		$.each(arr, function(k, v){ 
			if(v.type=="addrule")
			{
				if(Core.Diagram.Contextmenu.GetCustomValidation(v.data,"operation")=="between" )
				{
					if(Core.Diagram.Contextmenu.GetCustomValidation(v.data,"input1")=="" || Core.Diagram.Contextmenu.GetCustomValidation(v.data,"input2")=="")
					{
						alert(lang_return("fixa.core.title138"));
						valichk = false;
						return false;
					}
					
				}else
				{
					if(Core.Diagram.Contextmenu.GetCustomValidation(v.data,"input1")=="")
					{
						alert(lang_return("fixa.core.title139"));
						valichk = false;
						return false;
					}
				}
				
				
			}
			else if(v.type=="addgroup")
			{
				
				console.log("aaaa",v);
				if(v.data.length>0){
					$.each(v.data, function(k1, v1){
						
						console.log(v1);
						if(Core.Diagram.Contextmenu.GetCustomValidation(v1,"operation")=="between" )
						{
							if(Core.Diagram.Contextmenu.GetCustomValidation(v1,"input1")=="" || Core.Diagram.Contextmenu.GetCustomValidation(v1,"input2")=="")
							{
								alert(lang_return("fixa.core.title138"));
								valichk = false;
								return false;
							}
							
						}else
						{
							if(Core.Diagram.Contextmenu.GetCustomValidation(v1,"input1")=="")
							{
								alert(lang_return("fixa.core.title139"));
								valichk = false;
								return false;
							}
						}
					});
				}
			}
			
		}); 

		
		if(valichk==false)
		{
			return ;
		}
		
		console.log("arr",arr);
		console.log("ruleId",cellView.model.id);
		Options.Variable.Diagram.Global[cellView.model.id].Column = "ok";
		Options.Variable.Diagram.Global[cellView.model.id].rule_cont = arr;
		Core.Console.Write( { Type : 'Success' ,KeyCode : 'Succ2' , subMessage : cellView.model.attributes.Use.Name ,Message : ""} );
		return Core.Modal.Close();;
		
	});// 설정하기
	var elRSetting	= Core.Diagram.Contextmenu.CustomCreateSidebarHtml(d, cellView.model.id);
	var elContent	= $i( '<div/>' ,{ class : 'content' } ).append(elRSetting);
	var Contents = {
		Title		: lang_return("fixa.core.title172")
	,   subTitle    : ""
	,	ElButtonOk	: elButtonOk
	,	ElContent	: elContent
	};
	Core.Diagram.Contextmenu.Modal(Contents);
	
	option = null;
	ruleId = cellView.model.id;
	if(Options.Variable.Diagram.Global[ruleId].rule_cont==null|| Options.Variable.Diagram.Global[ruleId].rule_cont=="")
	{
		Core.Diagram.Contextmenu.CustomCreateSidebarMakeTag(null,"addrule",d, null);
	}
	else
	{
		for(var k=0;k<Options.Variable.Diagram.Global[ruleId].rule_cont.length;k++)
		{
			
			var type = Options.Variable.Diagram.Global[ruleId].rule_cont[k].type;
			var ed = null;
			ed = Options.Variable.Diagram.Global[ruleId].rule_cont[k].data;
			
			if(type == "addrule")
			{
				Core.Diagram.Contextmenu.CustomCreateSidebarMakeTag(null,"addrule",d, ed);
			}
			else if(type=="addgroup")
			{
				Core.Diagram.Contextmenu.CustomCreateSidebarMakeTag(null,"addgroup",d, ed);
			}
			
			/**
			 * if(Options.Variable.Diagram.Global[ruleId].rule_cont[k].field=="field" &&
			 * k==0){ custom_setting
			 * .append(Core.Diagram.Contextmenu.LogicalSyntaxCreateSidebarMakeTag({"class":"","name":"selectField[]",value:Options.Variable.Diagram.Global[ruleId].rule_cont[k].data},"field"))
			 * .append(Core.Diagram.Contextmenu.LogicalSyntaxCreateSidebarMakeTag({"style":"color:white","text":"="},"display_eq")); }
			 * else
			 * if(Options.Variable.Diagram.Global[ruleId].rule_cont[k].field=="field") {
			 * custom_setting
			 * .append(Core.Diagram.Contextmenu.LogicalSyntaxCreateSidebarMakeTag({"class":"","name":"selectField[]",value:Options.Variable.Diagram.Global[ruleId].rule_cont[k].data},"field")) }
			 * else
			 * if(Options.Variable.Diagram.Global[ruleId].rule_cont[k].field=="operation") {
			 * 
			 * custom_setting
			 * .append(Core.Diagram.Contextmenu.LogicalSyntaxCreateSidebarMakeTag({"class":"","name":"selectoperation[]",value:Options.Variable.Diagram.Global[ruleId].rule_cont[k].data},"operation")); }
			 * else { alert("test"); }
			 */
		}
	}
		
	
};

Core.Diagram.Contextmenu.LogicalSyntaxCreateSidebar = function( cellView ,evt ,x ,y ,elTarget ,ruleSn ,ruleType ,d ) {

		
	
	
	var elButtonOk	= $i( '<a/>' ,{ class : 'button' ,text : lang_return("fixa.core.title026") ,href : '#' } ).on('click' ,function() {
		
		if($("#logical_syntax_setting").children("select").length<=1)
		{
			alert(lang_return("fixa.core.title140"));
		}
		else
		{
			var arr=[];
			var column = "";
			$("#logical_syntax_setting").children("select").each(function(k,v){
				
				var obj = {};
				var field = "";
				if(v.name =="selectField[]")
				{
					field = "field";
					if(column=="")
					{
						column = v.value;
					}
				}
				else if(v.name =="selectoperation[]")
				{
					field = "operation";
				}
				obj.field= field;
				obj.data = v.value;
				
				
				arr.push(obj);
				
				
			});
			Options.Variable.Diagram.Global[cellView.model.id].Column = column;
			Options.Variable.Diagram.Global[cellView.model.id].rule_cont = arr;
			
			Core.Console.Write( { Type : 'Success' ,KeyCode : 'Succ3' , subMessage : cellView.model.attributes.Use.Name ,Message :  ""} );
			return Core.Modal.Close();;
		}
		
		
		//
		
		 
	});// 설정하기
	var elRSetting	= Core.Diagram.Contextmenu.LogicalSyntaxCreateSidebarHtml(d, cellView.model.id);
	var elContent	= $i( '<div/>' ,{ class : 'content' } ).append(elRSetting);
	
	
	
	var Contents = {
		Title		: lang_return("fixa.core.title173") 
	,   subTitle    : ""
	,	ElButtonOk	: elButtonOk
	,	ElContent	: elContent
	};
	Core.Diagram.Contextmenu.Modal(Contents);
	
}; 



/**
 * 논리식 룰셋 필드 추가
 */
Core.Diagram.Contextmenu.LogicalSyntaxCreateSidebarMakeTag = function(option,type,d)
{

	
	
	
	if(type=="field")
	{
		var headerList	= Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).join(",").split(',');
		var select = $i("<select/>",option);
		for(i=0;i<headerList.length;i++)
		{
			if(headerList[i]==option.value)
			{
				select.append($('<option/>' ,{ value : headerList[i] ,text : headerList[i],selected:true}));
			}
			else
			{
				select.append($('<option/>' ,{ value : headerList[i] ,text : headerList[i]}));
				
			}
			
		}
	}
	else if(type=="operation")
	{
		var select = $i("<select/>",option);
		for(i=0;i<Options.operation.length;i++)
		{
			if(Options.operation[i].operation==option.value)
			{
				select.append($('<option/>' ,{ value : Options.operation[i].operation ,text : Options.operation[i].display,selected:true}));
			}
			else
			{
				select.append($('<option/>' ,{ value : Options.operation[i].operation ,text : Options.operation[i].display}));
			}
		}
	}
	else if(type=="display_eq")
	{
		select = $i("<span/>",option);
		
	}
	return select;
}

/**
 * 논리식 룰셋
 */
Core.Diagram.Contextmenu.LogicalSyntaxCreateSidebarHtml  = function(d ,ruleId)
{
	
	// 필드 추가
	var addSelectField = $i( '<a/>' ,{ class : 'button' ,text : "addSelectField" ,href : '#' } ).on('click' ,function(){
		
		if($("#logical_syntax_setting").children("select").length==1 
				|| $("#logical_syntax_setting").children("select[name]")[$("#logical_syntax_setting").children("select").length-1].name!="selectField[]")
		{
			$("#logical_syntax_setting").append(Core.Diagram.Contextmenu.LogicalSyntaxCreateSidebarMakeTag({"class":"","name":"selectField[]"},"field"));
		} 
		else 
		{
			alert(lang_return("fixa.core.title141"));
		}
		
	});
	
	// 오퍼레이션 추가
	var addOperation = $i( '<a/>' ,{ class : 'button' ,text : "addoperation" ,href : '#' } ).on('click' ,function()
	{
		if($("#logical_syntax_setting").children("select").length==1)
		{
			alert(lang_return("fixa.core.title142"));
		}
		else if($("#logical_syntax_setting").children("select[name]")[$("#logical_syntax_setting").children("select").length-1].name=="selectoperation[]")
		{
			alert(lang_return("fixa.core.title143"));
		}
		else
		{
			$("#logical_syntax_setting").append(Core.Diagram.Contextmenu.LogicalSyntaxCreateSidebarMakeTag({"class":"","name":"selectoperation[]"},"operation"));
		}
	});
	
	// 초기화
	var addClean = $i( '<a/>' ,{ class : 'button' ,text : lang_return("fixa.core.title174") ,href : '#' } ).on('click' ,function(){
		$("#logical_syntax_setting").children("select").each(function(k,v){
			if(k!=0)
			{
				$(this).remove();
			}
		});
	});
	
	
	
	
	// 타이틀 구성
	var html = $i( '<div/>');
	
	var logical_syntax_header = $("<div>",{id:"logical_syntax_header"});
	
	
	logical_syntax_header.append(addSelectField).append(addOperation).append(addClean);
	
	
	html.append(logical_syntax_header);
	
	
	
	
	// 실 입력 기능 구성
	var custom_setting = $i( '<div/>',{id:"logical_syntax_setting"});
	
	
	if(Options.Variable.Diagram.Global[ruleId].rule_cont==null|| Options.Variable.Diagram.Global[ruleId].rule_cont==""){
		custom_setting
			.append(Core.Diagram.Contextmenu.LogicalSyntaxCreateSidebarMakeTag({"class":"","name":"selectField[]"},"field"))
			.append(Core.Diagram.Contextmenu.LogicalSyntaxCreateSidebarMakeTag({"class":"display_eq","text":"="},"display_eq"));
		
	}
	else
	{
		for(var k=0;k<Options.Variable.Diagram.Global[ruleId].rule_cont.length;k++)
		{
			
			
			if(Options.Variable.Diagram.Global[ruleId].rule_cont[k].field=="field" && k==0){
					custom_setting
					.append(Core.Diagram.Contextmenu.LogicalSyntaxCreateSidebarMakeTag({"class":"","name":"selectField[]",value:Options.Variable.Diagram.Global[ruleId].rule_cont[k].data},"field"))
					.append(Core.Diagram.Contextmenu.LogicalSyntaxCreateSidebarMakeTag({"style":"color:white","text":"="},"display_eq"));
			}
			else if(Options.Variable.Diagram.Global[ruleId].rule_cont[k].field=="field")
			{
				custom_setting
				.append(Core.Diagram.Contextmenu.LogicalSyntaxCreateSidebarMakeTag({"class":"","name":"selectField[]",value:Options.Variable.Diagram.Global[ruleId].rule_cont[k].data},"field"))
			}
			else if(Options.Variable.Diagram.Global[ruleId].rule_cont[k].field=="operation")
			{
				
				custom_setting
				.append(Core.Diagram.Contextmenu.LogicalSyntaxCreateSidebarMakeTag({"class":"","name":"selectoperation[]",value:Options.Variable.Diagram.Global[ruleId].rule_cont[k].data},"operation"));
			}
			else
			{
// alert("test");
			}
		}
	}
	
	
	
	html.append(custom_setting);
	
	return html;
}

Core.Diagram.Contextmenu.RangeCreateSidebarHtml  = function(d ,ruleId ){
	var TABLE_HEADER_KEY	= Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).join(",").split(',');
	var TABLE_HEADER_NAME	= Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).join(",").split(',');
	
	var itmList				= $i( '<ul/>' ,{ class : 'checkColumn' } );
	
	var select		= $('<select/>'	,{ id : 'range' ,name : 'field' });
	
	
	// Options.Variable.Diagram.Global[ruleId].Column =
	// $("#search_value").val();
	// Options.Variable.Diagram.Global[ruleId].detection_value =
	// $("#search_value").val();
	
	
	
	$.each(TABLE_HEADER_KEY, function(index, item){ 
		
		if(item==Options.Variable.Diagram.Global[ruleId].Column)
		{
			select.append($('<option/>' ,{ value : item ,text : item ,selected:true}));
		}
		else
		{
			select.append($('<option/>' ,{ value : item ,text : item }));
		}
		
	});
	
	
	var rule_cont_start = "";
	var rule_cont_end = "";
	
	if(undefined!=Options.Variable.Diagram.Global[ruleId].rule_cont && Options.Variable.Diagram.Global[ruleId].rule_cont !="" && Options.Variable.Diagram.Global[ruleId].rule_cont.split("~").length>0)
	{
		temp = Options.Variable.Diagram.Global[ruleId].rule_cont.split("~");
		var rule_cont_start = temp[0];
		var rule_cont_end = temp[1];
			
	}
	
	itmList.append
	(
	  $i('<label/>' ,{
		  "class":"label_tit",text	: lang_return("fixa.core.title175")// '타입설정'
	}))
	.append(select)
	.append("<br/>")
	.append(
			  $i('<label/>' ,{
				  "class":"label_tit",text	: lang_return("fixa.core.title176")
	}))
	.append(
			$i('<input/>' ,{
				id		: ('rule_cont_start')
			,	name	: 'rule_cont_start'
			,	type	: 'input'
			,	value	: rule_cont_start
			})
	).append("~")
	.append(
			$i('<input/>' ,{
				id		: ('rule_cont_end')
			,	name	: 'rule_cont_end'
			,	type	: 'input'
			,	value	: rule_cont_end
			})
	)
	
	;
	
	
	
	
	return itmList;	
}

/**
 * 범위
 */
Core.Diagram.Contextmenu.RangeCreateSidebar  = function( cellView ,evt ,x ,y ,elTarget ,ruleSn ,ruleType ,d ) {
	
	
	
	
	
	// @@inni@@
	var elDiagram		= Options.Element.Diagram.Diagram.El();
	var ruleId			= elDiagram.attr('data-sel-id');
	var elAreaHistory	= Options.Element.Global.History.El();
	var elItemHistory	= Options.Element.Diagram.History.El();
	var elItemProperty	= Options.Element.Diagram.Property.El();
	var idxProperty		= elAreaHistory.find('.history').removeClass('on').end().find('.property').addClass('on').index();
	var elWhether		= Core.Diagram.Contextmenu.RangeCreateSidebarHtml( d ,ruleId );
	
	var radio1= $("<input/>",{"type":"radio","name":"proType_"+ruleId,"id":"radio1_"+ruleId,"value":"0"}).on('change' ,function() { 
		$("g[model-id='"+ruleId+"']").attr("data-rule-opt","0");
	});
	var elLabel1		= $i('<label/>' ,{
	text	: lang_return("fixa.core.title217")// 이상치 검출
	});
	var radio2= $("<input/>",{"type":"radio","name":"proType_"+ruleId,"id":"radio2_"+ruleId,"value":"1"}).on('change' ,function() { 
		$("g[model-id='"+ruleId+"']").attr("data-rule-opt","1");
	});
	var elLabel2		= $i('<label/>' ,{
		text	: lang_return("fixa.core.title218")// 비 이상치 검출
	});
	
	
	
	var reverse = $("<ul/>",{"class":"reverse"})
									.append(radio1)
									.append(elLabel1)
									.append(radio2)
									.append(elLabel2);
									
	
	
	// 설정하기
	var elSave			= $('<a/>' ,{
		text	: lang_return("fixa.core.title058")// '설정하기'
	,	class	: '_btn'
	}).on('click' ,function(){
		// Core.Diagram.Contextmenu.CloseSidebar();
		
		
		// 범위 validation 시작
		var regexp = /^[-]?\d+(?:[.]\d+)?$/; 
		var regexp_2 = /^\d*[.]\d{2}$/;
		var rule_cont_start = $("#rule_cont_start").val();
		var rule_cont_end = $("#rule_cont_end").val();
		if( rule_cont_start !="" && rule_cont_end !=""){
			if( !regexp.test(rule_cont_start) || !regexp.test(rule_cont_end) ) {
				if(!regexp.test(rule_cont_start)){
					if(!regexp.test(rule_cont_end)){
						alert(lang_return("fixa.core.title144"));
						$("#rule_cont_start").val("");
						$("#rule_cont_end").val("");
						$("#rule_cont_start").focus();
						return;
					}else{
						alert(lang_return("fixa.core.title145"));
						$("#rule_cont_start").val("");
						$("#rule_cont_start").focus();
						return;
					}
				}else if(!regexp.test(rule_cont_end)){
					if(!regexp.test(rule_cont_start)){
						alert(lang_return("fixa.core.title144"));
						$("#rule_cont_start").val("");
						$("#rule_cont_end").val("");
						$("#rule_cont_start").focus();
						return;
					}else{
						alert(lang_return("fixa.core.title146"));
						$("#rule_cont_end").val("");
						$("#rule_cont_end").focus();
						return;
					}
				}
				
			}else{
				if(parseFloat(rule_cont_start) > parseFloat(rule_cont_end)){
					$("#rule_cont_start").val("");
					alert(lang_return("fixa.core.title147"));
					$("#rule_cont_start").focus();
					return;
				}else{
					// 소수점 2째자리 체크
// if(!regexp_2.test(rule_cont_start) || !regexp_2.test(rule_cont_end)){
// if(!regexp_2.test(rule_cont_start)){
// if(!regexp_2.test(rule_cont_end)){
// alert("검출 범위의 시작값 과 종료값이 실수일경우는 소숫점 2째자리까지 유효합니다.");
// $("#rule_cont_start").val("");
// $("#rule_cont_end").val("");
// $("#rule_cont_start").focus();
// return;
// }else{
// alert("실수값 입력시 소숫점 2째자리까지 유효합니다.");
// $("#rule_cont_start").val("");
// $("#rule_cont_start").focus();
// return;
// }
//							
// }else if(!regexp_2.test(rule_cont_end)){
// if(!regexp_2.test(rule_cont_start)){
// alert("검출 범위의 시작값 과 종료값이 실수일경우는 소숫점 2째자리까지 유효합니다.");
// $("#rule_cont_start").val("");
// $("#rule_cont_end").val("");
// $("#rule_cont_start").focus();
// }else{
// alert("실수값 입력시 소숫점 2째자리까지 유효합니다.");
// $("#rule_cont_end").val("");
// $("#rule_cont_end").focus();
// }
//							
// return;
// }
//					
// }
				}
			}
		}else{
			if(rule_cont_start == ""){
				alert(lang_return("fixa.core.title148"));
// alert("검출 범위의 시작값은 필수 입력 항목입니다.");
				$("#rule_cont_start").focus();
				return;
			}else if(rule_cont_end == ""){
				alert(lang_return("fixa.core.title149"));
// alert("검출 범위의 종료값은 필수 입력 항목입니다.");
				$("#rule_cont_end").focus();
				return;
			}
		}
		
		
		
		
		
		
		
		if ($("#Whether").val() != "" && $("#rule_cont").val()!="" ){
			Core.Console.Write( { Type : 'Success' ,KeyCode : 'Succ1' , subMessage : cellView.model.attributes.Use.Name ,Message :  $("#range").val() +":"+$("#rule_cont_start").val()+"~"+$("#rule_cont_end").val()} );
		} 
		
		
		Options.Variable.Diagram.Global[ruleId].Column = $("#range").val();
		Options.Variable.Diagram.Global[ruleId].rule_cont  = $("#rule_cont_start").val()+"~"+$("#rule_cont_end").val();
//		Options.Variable.Diagram.Global[ruleId].ChkRule = $(':radio[name=proType_'+ruleId+']:checked').val();
		
		Core.Diagram.Contextmenu.CloseSidebar();
	});
	
	
	var elClose			= $('<a/>' ,{
		text	: lang_return("fixa.core.title059")// '닫기'
	,	class	: '_btn'
	,	id		: 'ClosePropertiesSidebar'
	}).on('click' ,function(){
		Core.Diagram.Contextmenu.CloseSidebar();
	});
	
	
	var elButton		= $('<span/>' ,{
		class	: 'button'
		
	}).html(elClose);
	
	var elSaveButton		= $('<span/>' ,{
		class	: 'button'
	}).html(elSave);
	

	elAreaHistory.find('.contents').removeClass('on').eq(idxProperty).addClass('on');
	// 임시
	elItemProperty.html("");
	elItemProperty.append(reverse).append(elWhether).append(elButton).append(elSaveButton);
	
	Core.Diagram.Contextmenu.RadioCheck(ruleId);
};


/**
 * 유무 리스트 생성
 */
Core.Diagram.Contextmenu.WhetherCreateSidebarHtml = function(d ,ruleId )
{
	var TABLE_HEADER_KEY	= Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).join(",").split(',');
	var TABLE_HEADER_NAME	= Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).join(",").split(',');
	
	var itmList				= $i( '<ul/>' ,{ class : 'checkColumn' } );
	
	var select		= $('<select/>'	,{ id : 'Whether' ,name : 'field' });
	
	
	// Options.Variable.Diagram.Global[ruleId].Column =
	// $("#search_value").val();
	// Options.Variable.Diagram.Global[ruleId].detection_value =
	// $("#search_value").val();
	
	
	
	$.each(TABLE_HEADER_KEY, function(index, item){ 
		
		if(item==Options.Variable.Diagram.Global[ruleId].Column)
		{
			select.append($('<option/>' ,{ value : item ,text : item ,selected:true}));
		}
		else
		{
			select.append($('<option/>' ,{ value : item ,text : item }));
		}
		
	});
	
	itmList.append
	(
	  $i('<label/>' ,{
		  "class":"label_tit",text	: lang_return("fixa.core.title175")// '타입설정'
	}))
	.append(select)
	.append("<br/>")
	.append(
			  $i('<label/>' ,{
				  "class":"label_tit",text	: lang_return("fixa.core.title177")
	}))
	.append(
			$i('<input/>' ,{
				id		: ('rule_cont')
			,	name	: 'rule_cont'
			,	type	: 'input'
			,	value	: Options.Variable.Diagram.Global[ruleId].rule_cont
			})
	);
	
	
	
	return itmList;	
}

/**
 * 존재 여부
 */
Core.Diagram.Contextmenu.WhetherCreateSidebar  = function( cellView ,evt ,x ,y ,elTarget ,ruleSn ,ruleType ,d ) {
	
// console.log("Core.Diagram.Contextmenu.CreateSidebar",d);
// console.log("Core.Diagram.Contextmenu.CreateSidebar.ruleId",ruleId);
	
	
	
	
	// @@inni@@
	var elDiagram		= Options.Element.Diagram.Diagram.El();
	var ruleId			= elDiagram.attr('data-sel-id');
	var elAreaHistory	= Options.Element.Global.History.El();
	var elItemHistory	= Options.Element.Diagram.History.El();
	var elItemProperty	= Options.Element.Diagram.Property.El();
	var idxProperty		= elAreaHistory.find('.history').removeClass('on').end().find('.property').addClass('on').index();
	var elWhether		= Core.Diagram.Contextmenu.WhetherCreateSidebarHtml( d ,ruleId );
	var radio1= $("<input/>",{"type":"radio","name":"proType_"+ruleId,"id":"radio1_"+ruleId,"value":"0"}).on('change' ,function() { 
		$("g[model-id='"+ruleId+"']").attr("data-rule-opt","0");
	});
	var elLabel1		= $i('<label/>' ,{
	text	: lang_return("fixa.core.title217")// 이상치 검출
	});
	var radio2= $("<input/>",{"type":"radio","name":"proType_"+ruleId,"id":"radio2_"+ruleId,"value":"1"}).on('change' ,function() { 
		$("g[model-id='"+ruleId+"']").attr("data-rule-opt","1");
	});
	var elLabel2		= $i('<label/>' ,{
		text	: lang_return("fixa.core.title218")// 비 이상치 검출
	});
	
	var reverse = $("<ul/>",{"class":"reverse"})
	.append(radio1)
	.append(elLabel1)
	.append(radio2)
	.append(elLabel2);
	
	
	// 설정하기
	var elSave			= $('<a/>' ,{
		text	: lang_return("fixa.core.title058")// '설정하기'
	,	class	: '_btn'
	}).on('click' ,function(){
		// Core.Diagram.Contextmenu.CloseSidebar();
		
		// 유무 validation 시작
		var rule_cont = $("#rule_cont").val();
		if(rule_cont ==""){
			alert(lang_return("fixa.core.title150"));
// alert("검출 값은 필수 입력 항목입니다.");
			$("#rule_cont").focus();
			return;
		}
		
		
		if ($("#Whether").val() != "" && $("#rule_cont").val()!="" ){
			Core.Console.Write( { Type : 'Success' ,KeyCode : 'Succ1' , subMessage : cellView.model.attributes.Use.Name ,Message :  $("#Whether").val() +":"+$("#rule_cont").val()} );
		} 
		
		
		Options.Variable.Diagram.Global[ruleId].Column = $("#Whether").val();
		Options.Variable.Diagram.Global[ruleId].rule_cont  = $("#rule_cont").val();
//		Options.Variable.Diagram.Global[ruleId].ChkRule = $(':radio[name=proType_'+ruleId+']:checked').val();
		
		Core.Diagram.Contextmenu.CloseSidebar();
	});
	
	
	var elClose			= $('<a/>' ,{
		text	: lang_return("fixa.core.title059")// '닫기'
	,	class	: '_btn'
	,	id		: 'ClosePropertiesSidebar'
	}).on('click' ,function(){
		Core.Diagram.Contextmenu.CloseSidebar();
	});
	
	
	var elButton		= $('<span/>' ,{
		class	: 'button'
		
	}).html(elClose);
	
	var elSaveButton		= $('<span/>' ,{
		class	: 'button'
	}).html(elSave);
	

	elAreaHistory.find('.contents').removeClass('on').eq(idxProperty).addClass('on');
	// 임시
	elItemProperty.html("");
	elItemProperty.append(reverse).append(elWhether).append(elButton).append(elSaveButton);

	Core.Diagram.Contextmenu.RadioCheck(ruleId);
};


/**
 *  클라우드워드
 */
Core.Diagram.Contextmenu.CloudWordCreateSidebar = function(cellView ,evt ,x ,y ,elTarget ,ruleSn ,ruleTypes ,d )
{
	//console.log("cloud_word Core.Diagram.Contextmenu.CreateSidebar",d);
	// console.log("Core.Diagram.Contextmenu.CreateSidebar.ruleId",ruleId);
		
		// @@inni@@
		var elDiagram		= Options.Element.Diagram.Diagram.El();
		var ruleId			= elDiagram.attr('data-sel-id');
		var elAreaHistory	= Options.Element.Global.History.El();
		var elItemHistory	= Options.Element.Diagram.History.El();
		var elItemProperty	= Options.Element.Diagram.Property.El();
		var idxProperty		= elAreaHistory.find('.history').removeClass('on').end().find('.property').addClass('on').index();
		var elColumnList	= Core.Diagram.Contextmenu.CloudWordCreateSidebarHtml( d ,ruleId );
		
	// console.log("elColumnList", elColumnList);
		
		
		// 설정하기
		var elSave			= $('<a/>' ,{
			text	: lang_return("fixa.core.title058")// '설정하기'
		,	class	: '_btn'
		}).on('click' ,function(){
			
			Options.Variable.Diagram.Global[ruleId].Column = $("#split_field option:selected").val();
			Options.Variable.Diagram.Global[ruleId].rule_cont  = $("#split option:selected").val();
			//Options.Variable.Diagram.Global[ruleId].Column = setCheckList;
			
			Core.Diagram.Contextmenu.CloseSidebar();
		});
		
		
		var elClose			= $('<a/>' ,{
			text	: lang_return("fixa.core.title059")// '닫기'
		,	class	: '_btn'
		,	id		: 'ClosePropertiesSidebar'
		}).on('click' ,function(){
			Core.Diagram.Contextmenu.CloseSidebar();
		});
		
		
		var elButton		= $('<span/>' ,{
			class	: 'button'
			
		}).html(elClose);
		
		var elSaveButton		= $('<span/>' ,{
			class	: 'button'
		}).html(elSave);
		

		elAreaHistory.find('.contents').removeClass('on').eq(idxProperty).addClass('on');
		// 임시
		elItemProperty.html("");
		elItemProperty.append(elColumnList).append(elButton).append(elSaveButton);

};

/**
 * 클라우드 워드(cloud word 속설 설정)
 */
Core.Diagram.Contextmenu.CloudWordCreateSidebarHtml  = function(d ,ruleId ){
	var TABLE_HEADER_KEY	= Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).join(",").split(',');
	var TABLE_HEADER_NAME	= Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).join(",").split(',');
	
	var itmList				= $i( '<ul/>' ,{ class : 'checkColumn' } );
	
	var select		= $('<select/>'	,{ id : 'split_field' ,name : 'field' });
	var word_split_select = $('<select/>'	,{ id : 'split' ,name : 'split_word' });
	
	$.each(TABLE_HEADER_KEY, function(index, item){ 
		
		if(item==Options.Variable.Diagram.Global[ruleId].Column)
		{
			select.append($('<option/>' ,{ value : item ,text : item ,selected:true}));
		}
		else
		{
			select.append($('<option/>' ,{ value : item ,text : item }));
		}
		
	});
	
	var word_split_select_value = "space_basic";
	var word_split_select_list = [];
	word_split_select_list[0] = {"text":lang_return("fixa.core.title230"), "item":"space_basic"}; //띄어쓰기
	word_split_select_list[1] = {"text":lang_return("fixa.core.title231"), "item":"space_notulcase"};//띄어쓰기 + 대소문자 구분 무시
	
	if(undefined!=Options.Variable.Diagram.Global[ruleId].rule_cont)
	{
		word_split_select_value = Options.Variable.Diagram.Global[ruleId].rule_cont;
	}
	
	$.each(word_split_select_list , function(index, item){ 
		
		if(item['item']==word_split_select_value)
		{
			word_split_select.append($('<option/>' ,{ value : item['item'] ,text : item['text'] ,selected:true}));
		}
		else
		{
			word_split_select.append($('<option/>' ,{ value : item['item'] ,text : item['text'] }));
		}
		
	});

	
	
	
	
	
	
	itmList.append
	(
	  $i('<label/>' ,{
		  "class":"label_tit",text	: lang_return("fixa.core.title175")// '타입설정'
	}))
	.append(select)
	.append("<br/>")
	.append(
			  $i('<label/>' ,{
				  "class":"label_tit",text	: "단어구분"
	}))
	.append(word_split_select);
	
	
	
	
	return itmList;	
}

/**
 * 속성에서 사용될 tab_bar3
 */
Core.tabbar3 = function(){
	tab_bar3 = $("<div/>",{"class":"tab_bar3"}).append($("<ul/>")
			.append($("<li/>",{"class":"tab_bar_left"}))
			.append($("<li/>",{"class":"tab_bar_m"}))
			.append($("<li/>",{"class":"tab_bar_right"})));
	
	return tab_bar3;
}

Core.tabbar4 = function(){
	tab_bar4 = $("<div/>",{"class":"tab_bar4"}).append($("<ul/>")
			.append($("<li/>",{"class":"tab_bar_left"}))
			.append($("<li/>",{"class":"tab_bar_m"}))
			.append($("<li/>",{"class":"tab_bar_right"})));
	
	return tab_bar4;
}



/**
 * 기본 속성 설정
 */
Core.Diagram.Contextmenu.CreateSidebar = function( cellView ,evt ,x ,y ,elTarget ,ruleSn ,ruleType ,d) {
	
// console.log("Core.Diagram.Contextmenu.CreateSidebar",d);
// console.log("Core.Diagram.Contextmenu.CreateSidebar.ruleId",ruleId);
	
	// @@inni@@
	
	var elDiagram		= Options.Element.Diagram.Diagram.El();
	var ruleId			= elDiagram.attr('data-sel-id');
	var elAreaHistory	= Options.Element.Global.History.El();
	var elItemHistory	= Options.Element.Diagram.History.El();
	var elItemProperty	= Options.Element.Diagram.Property.El();
	var idxProperty		= elAreaHistory.find('.history').removeClass('on').end().find('.property').addClass('on').index();
	
	var radio1= $("<input/>",{"type":"radio","name":"proType_"+ruleId,"id":"radio1_"+ruleId,"value":"0"}).on('change' ,function() { 
		$("g[model-id='"+ruleId+"']").attr("data-rule-opt","0");
	});
	var elLabel1		= $i('<label/>' ,{
	text	: lang_return("fixa.core.title217")// 이상치 검출
	});
	var radio2= $("<input/>",{"type":"radio","name":"proType_"+ruleId,"id":"radio2_"+ruleId,"value":"1"}).on('change' ,function() { 
		$("g[model-id='"+ruleId+"']").attr("data-rule-opt","1");
	});
	var elLabel2		= $i('<label/>' ,{
		text	: lang_return("fixa.core.title218")// 비 이상치 검출
	});
	var elColumnList	= Core.Diagram.Contextmenu.ColumnsCheck( d ,ruleId );
	
	
	var reverse = $("<ul/>",{"class":"reverse"})
	.append(radio1)
	.append(elLabel1)
	.append(radio2)
	.append(elLabel2);
	
	
	
// console.log("elColumnList", elColumnList);
//	var elInput		= $i('<input/>' ,{
//		id		: 'chkRule_'+ ruleId
//	,	name	: 'chkRule'
//	,	type	: 'checkbox'
//	
//	}).on("click", function(){
//		var chk = $(this).is(":checked") ? true : false; 
//		if(chk==true){
//			$(this).val("1");
//		}else{
//			$(this).val("0");
//		}
//	});
//	var elLabel		= $i('<label/>' ,{
//		text	: '역 검출'// 
//	});

	// 설정하기
	var elSave			= $('<a/>' ,{
		text	: lang_return("fixa.core.title058")// '설정하기'
	,	class	: '_btn'
	}).on('click' ,function(){
		// Core.Diagram.Contextmenu.CloseSidebar();
		var setCheckList = "";
		$.each($(this).parent().parent().find("input:checkbox"), function(k,v){
			if($(this).is(":checked"))
			{
				if(setCheckList=="")
				{
					setCheckList = v.value;	
				}
				else
				{
					setCheckList = setCheckList +","+v.value;
				}
			}
			
		});
		if(setCheckList == ""){
			alert(lang_return("fixa.core.title151"));
			return;
		}
		
		
		
		if (setCheckList != ""){
			Core.Console.Write( { Type : 'Success' ,KeyCode : 'Succ1' , subMessage : cellView.model.attributes.Use.Name ,Message : setCheckList } );
		} 
		
		Options.Variable.Diagram.Global[ruleId].Column = setCheckList;
//		Options.Variable.Diagram.Global[ruleId].ChkRule = $("#chkRule_"+ruleId).val();
//		console.log($("#chkRule_"+ruleId).val());
		setCheckList = "";
		
		Core.Diagram.Contextmenu.CloseSidebar();
	});
	
	
	var elClose			= $('<a/>' ,{
		text	: lang_return("fixa.core.title059")// '닫기'
	,	class	: '_btn'
	,	id		: 'ClosePropertiesSidebar'
	}).on('click' ,function(){
		Core.Diagram.Contextmenu.CloseSidebar();
	});
	
	
	var elButton		= $('<span/>' ,{
		class	: 'button'
		
	}).html(elClose);
	
	var elSaveButton		= $('<span/>' ,{
		class	: 'button'
	}).html(elSave);
	

	elAreaHistory.find('.contents').removeClass('on').eq(idxProperty).addClass('on');
	// 임시
	elItemProperty.html("");
	elItemProperty.append(reverse).append(elColumnList).append(elButton).append(elSaveButton);

	
	
	
	elItemProperty.append(reverse).append(elColumnList).append(elButton).append(elSaveButton);
	
	
	
	
	Core.Diagram.Contextmenu.RadioCheck(ruleId);
	
//	if(Options.Variable.Diagram.Global[ruleId].ChkRule=="1"){
//		$("#chkRule_"+ruleId).attr("checked","checked");
//		console.log($("#chkRule_"+ruleId).val());
//	}else{
//		console.log($("#chkRule_"+ruleId).val());
//	}

};
Core.Diagram.TemplateSetData = function(obj){
	if(obj != ""){
    	
    	if(obj.length != 0){
	    	for(var i=0; i<obj.length; i++){
	    		if(obj[i].data_type=="03"){
	    			if(!(String(obj[i].data)=="")){
	    				Options.Variable.Diagram.Global[Options.template_modelId[i]].Rdata = String(obj[i].data);
	    			}
	    		}else if(obj[i].data_type=="20"){
	    			if(!(obj[i].data=="")&& !(String(obj[i].feild_name)=="")){
	    					Options.Variable.Diagram.Global[Options.template_modelId[i]].rule_cont = obj[i].data;
	    					Options.Variable.Diagram.Global[Options.template_modelId[i]].Column = String(obj[i].feild_name);
	    			}
	    		}else if(obj[i].data_type=="30"){
	    			if(!(obj[i].data=="")&& !(String(obj[i].feild_name)=="")){
	    					Options.Variable.Diagram.Global[Options.template_modelId[i]].rule_cont = obj[i].data;
		    				Options.Variable.Diagram.Global[Options.template_modelId[i]].Column = String(obj[i].feild_name);
	    			}
	    		}else if(obj[i].data_type=="40"){
	    			if(!(obj[i].data=="")&& !(String(obj[i].feild_name)=="")){
	    					Options.Variable.Diagram.Global[Options.template_modelId[i]].rule_cont =  obj[i].data;
		    				Options.Variable.Diagram.Global[Options.template_modelId[i]].Column = String(obj[i].feild_name);
	    			}
	    		}else if(obj[i].data_type=="50"){
	    			if(!(obj[i].data=="")&& !(String(obj[i].feild_name)=="")){
	    					Options.Variable.Diagram.Global[Options.template_modelId[i]].rule_cont =  obj[i].data;
		    				Options.Variable.Diagram.Global[Options.template_modelId[i]].Column = String(obj[i].feild_name);
	    			}
	    		}else if(obj[i].data_type=="60"){
	    			if(!(obj[i].data=="")&& !(String(obj[i].feild_name)=="")){
	    					Options.Variable.Diagram.Global[Options.template_modelId[i]].rule_cont =  obj[i].data;
		    				Options.Variable.Diagram.Global[Options.template_modelId[i]].Column = String(obj[i].feild_name);
	    			}
	    		}else if(obj[i].data_type=="70"){
	    			if(!(obj[i].data=="")&& !(String(obj[i].feild_name)=="")){
	    					Options.Variable.Diagram.Global[Options.template_modelId[i]].rule_cont =  obj[i].data;
		    				Options.Variable.Diagram.Global[Options.template_modelId[i]].Column = String(obj[i].feild_name);
	    				
	    			}
	    		}else if(obj[i].data_type=="80"){
	    			if(!(obj[i].data=="")&& !(String(obj[i].feild_name)=="")){
	    					Options.Variable.Diagram.Global[Options.template_modelId[i]].rule_cont =  obj[i].data;
		    				Options.Variable.Diagram.Global[Options.template_modelId[i]].Column = String(obj[i].feild_name);
	    				
	    			}
	    			
	    		}else if(obj[i].data_type=="01"){
	    			if(!(String(obj[i].data)=="")){
	    				Options.Variable.Diagram.Global[Options.template_modelId[i]].Column = String(obj[i].data);
	    			}
	    		}
			}
    	}
	}
};

Core.Diagram.SetData = function(){
	$.ajax({
	    url: '/collect/setProjectAndDataSn2.fd' 
	    ,async: false
	    ,type: 'post'
	    ,success: function(data) {
	    	if(data.workflow != ""){
		    	var obj = JSON.parse(data.workflow);
		    	
		    	if(obj.length != 0){
			    	for(var i=0; i<obj.length; i++){
			    		var beforeCheckDataOutput=[];
			    		var inputId = "";
			    		var modelId = $("g[data-index='"+obj[i].before_data_index+"']").attr("model-id");
			    		
			    		if(obj[i].before_data_type=="03"){
			    			if(!(String(obj[i].data)=="")){
			    				Options.Variable.Diagram.Global[modelId].Rdata = String(obj[i].data);
			    			}
			    		}else if(obj[i].before_data_type=="20"){
			    			if(!(obj[i].data=="")&& !(String(obj[i].before_feild_name)=="")){
			    				Options.Variable.Diagram.Global[modelId].rule_cont = obj[i].data;
			    				Options.Variable.Diagram.Global[modelId].Column = String(obj[i].before_feild_name);
			    			}
			    		}else if(obj[i].before_data_type=="30"){
			    			if(!(obj[i].data=="")&& !(String(obj[i].before_feild_name)=="")){
			    				Options.Variable.Diagram.Global[modelId].rule_cont = obj[i].data;
			    				Options.Variable.Diagram.Global[modelId].Column = String(obj[i].before_feild_name);
			    			}
			    		}else if(obj[i].before_data_type=="40"){
			    			if(!(obj[i].data=="")&& !(String(obj[i].before_feild_name)=="")){
			    				Options.Variable.Diagram.Global[modelId].rule_cont =  obj[i].data;
			    				Options.Variable.Diagram.Global[modelId].Column = String(obj[i].before_feild_name);
			    			}
			    		}else if(obj[i].before_data_type=="50"){
			    			if(!(obj[i].data=="")&& !(String(obj[i].before_feild_name)=="")){
			    				Options.Variable.Diagram.Global[modelId].rule_cont =  obj[i].data;
			    				Options.Variable.Diagram.Global[modelId].Column = String(obj[i].before_feild_name);
			    			}
			    		}else if(obj[i].before_data_type=="60"){
			    			if(!(obj[i].data=="")&& !(String(obj[i].before_feild_name)=="")){
			    				Options.Variable.Diagram.Global[modelId].rule_cont =  obj[i].data;
			    				Options.Variable.Diagram.Global[modelId].Column = String(obj[i].before_feild_name);
			    			}
			    		}else if(obj[i].before_data_type=="70"){
			    			if(!(obj[i].data=="")&& !(String(obj[i].before_feild_name)=="")){
			    				Options.Variable.Diagram.Global[modelId].rule_cont =  obj[i].data;
			    				Options.Variable.Diagram.Global[modelId].Column = String(obj[i].before_feild_name);
			    			}
			    		}else if(obj[i].before_data_type=="80"){
			    			if(!(obj[i].data=="")&& !(String(obj[i].before_feild_name)=="")){
			    				Options.Variable.Diagram.Global[modelId].rule_cont =  obj[i].data;
			    				Options.Variable.Diagram.Global[modelId].Column = String(obj[i].before_feild_name);
			    			}
			    		}
			    		else if(obj[i].before_data_type=="01"){
			    			if(!(String(obj[i].data)=="")){
			    				Options.Variable.Diagram.Global[modelId].Column = String(obj[i].data);
			    			}
			    		}
					}
		    	}
	    	}
	    }
	});
};
Core.Diagram.Contextmenu.CloseSidebar = function() {
	// @@inni@@
	var elAreaHistory	= Options.Element.Global.History.El();
	var elItemHistory	= Options.Element.Diagram.History.El();
	var elItemProperty	= Options.Element.Diagram.Property.El();
	var idxProperty		= elAreaHistory.find('.property').removeClass('on').end().find('.history').addClass('on').index();
	elAreaHistory.find('.contents').removeClass('on').eq(idxProperty).addClass('on');
};

Core.Diagram.Contextmenu.ColumnList = function( ruleType ) {
	var ruleType = parseInt(ruleType);
	var options = {
		url		: Options.Uri.Ajax.Process.ColumnList
	,	success	: function( d ,e ) {
// console.log("d",d);
// console.log("e",e);
		
			if ( 1==ruleType) {
				Core.Diagram.Contextmenu.ModalRule( d ,e );
			} else if ( 2==ruleType ) {
				Core.Diagram.Contextmenu.ModalFilter( d ,e );
			} else if ( 3==ruleType ) {
				Core.Diagram.Contextmenu.ModalRscript( d ,e );
			} else if ( 4==ruleType ) {
				Core.Diagram.Contextmenu.ModalD3( d ,e );
			} else if ( 5==ruleType ) {
				Core.Diagram.Contextmenu.ModalTimeChart( d ,e );
			} else if (20==ruleType){ // 유무
			} else if (30==ruleType){ // 범위
			} else if (40==ruleType){ // 사용자 정의
			} else if (50==ruleType){ // 사용자 정의
			} else if (60==ruleType){ // 사용자 정의
			} else if (70==ruleType){ // 사용자 정의
			} else if (80==ruleType){ // 사용자 정의
			}
			else {
				Core.Console.Write( { Type : 'Error' ,KeyCode : 'Errr1504' ,Message : '' } );
			};
		}
	};$i.Ajax(options);
};


/**
 * play btn 클릭시 동작
 */
// 결과용
var result_grid={};
var result_header={};
var result_data={};
var columnFilters = {};
var grid;
var workflow_field_ori = [];
var workflow_field = [];

Core.Diagram.run = function(type, options, callback){
	
	
	//$("#progress_img").hide();
	
	if($("#historyProjectName").text() == ""){
		alert_message(lang_return("fixa.core.title237"));
		return false;
	}else{
		console.log("options54",options);
		if(type=="workflow")
		{
			
			/**
			 * 버그인 코드 이후 수정 필요
			$.each(Object.keys(Options.Variable.slickGrid.id), function(k,v){
				 
				 if(v.match("result_")){
						// 전역변수로 지정된 배열에 문자열을 담음
					 delete Options.Variable.slickGrid.id[v];
					}
			});
			**/
			if($("image").length==1){
				alert(lang_return("fixa.core.title178"));
				return false;
			}
			var loading ;
			if(undefined===callback){
				loading = restRequestLoading;
			}else{
				loading = restRequestLoading2;
			}
			loading("/ajax/ruleList.fd", "POST", null, function(data){
				
				
				// 실행에 대한 체크등 기본적인 벨리데이션 체크를 통과해야지만 수행 이를 체크하는 flag
				var run_validation_check = true;
				var workflowJson = {};
				var workflowruleSet = [];
				var workflowRuleSetfields;
				var workflowOBj = Options.Variable.Diagram.Cells;
				$.each(workflowOBj, function(k,v){
					// DB 값을 제외한 diagrame에 해당하는 것만 추출함
					if($(this)[0].attributes.type=="devs.MyImageModel" 
							&& $(this)[0].attributes.Use.RuleType!="09"  // DB
							&& $(this)[0].attributes.Use.RuleType!="04"  // 차트보기
					)
					{
						
						
						//
						var type = Options.Variable.Diagram.Global[$(this)[0].attributes.id].Type;
						
						
						
						
						// 컬럼 선택 여부 체크
						if(Options.Variable.Diagram.Global[$(this)[0].attributes.id].Column=="" && type!="03") 
						{
							alert_message(lang_return("fixa.core.title061")); // "설정하신 룰중
																		// 커럶 선택이 안된
																		// 룰셋이있습니다.
																		// 컬럼 설정은 필수
																		// 요소입니다."
							run_validation_check = false;
							return false;
						}
						
						else if(Options.Variable.Diagram.Global[$(this)[0].attributes.id].Rdata=="" && type=="03")
						{
							console.log("attributes.id",$(this)[0].attributes.id);
							alert_message(lang_return("fixa.core.title062"));// "설정하신 룰중
																		// 커럶 선택이 안된
																		// 룰셋이있습니다.
																		// R에대한 컴럼
																		// 설정은 필수
																		// 요소입니다.");
							run_validation_check = false;
							return false;
						}
						else if(Options.Variable.Diagram.Global[$(this)[0].attributes.id].TimeChart=="" && type=="05")
						{
							alert_message(lang_return("fixa.core.title063")); // alert("설정하신
																		// 룰중 커럶 선택이
																		// 안된
																		// 룰셋이있습니다.
																		// R에대한 컴럼
																		// 설정은 필수
																		// 요소입니다.");
							run_validation_check = false;
							return false;
						}
						else
						{
							
							
							
							// 헤더 정보 추출
							if(type=="03")	
							{
								workflowRuleSetfields = Options.Variable.Diagram.Global[$(this)[0].attributes.id].Rdata.split(",");
							}
							else if(type=="05")
							{
								workflowRuleSetfields = Options.Variable.Diagram.Global[$(this)[0].attributes.id].TimeChart.split(",");
							}
							else
							{
								workflowRuleSetfields = Options.Variable.Diagram.Global[$(this)[0].attributes.id].Column.split(",");
							}
							
							
							rule_string = "";
							rule_opt = "";
							if(type=="20") // 류누 페트맇셜루
							{
								rule_string = Options.Variable.Diagram.Global[$(this)[0].attributes.id].rule_cont;
								rule_opt = $("g[model-id='"+$(this)[0].attributes.id+"']").attr("data-rule-opt");
							}
							else if(type=="30") // 류누 페트맇셜루
							{
								rule_string = Options.Variable.Diagram.Global[$(this)[0].attributes.id].rule_cont;
								rule_opt = $("g[model-id='"+$(this)[0].attributes.id+"']").attr("data-rule-opt");
							}
							else if(type=="40") // 류누 페트맇셜루
							{
								rule_string = Options.Variable.Diagram.Global[$(this)[0].attributes.id].rule_cont;
								rule_opt = $("g[model-id='"+$(this)[0].attributes.id+"']").attr("data-rule-opt");
							}
							else if(type=="50") // 류누 페트맇셜루
							{
								rule_string = Options.Variable.Diagram.Global[$(this)[0].attributes.id].rule_cont;
								rule_opt = $("g[model-id='"+$(this)[0].attributes.id+"']").attr("data-rule-opt");
							}
							else if(type=="60") // 류누 페트맇셜루
							{
								rule_string = Options.Variable.Diagram.Global[$(this)[0].attributes.id].rule_cont;
								rule_opt = $("g[model-id='"+$(this)[0].attributes.id+"']").attr("data-rule-opt");
							}
							else if(type=="70") // 류누 페트맇셜루
							{
								rule_string = Options.Variable.Diagram.Global[$(this)[0].attributes.id].rule_cont;
								rule_opt = $("g[model-id='"+$(this)[0].attributes.id+"']").attr("data-rule-opt");
							}
							else if(type=="80") // 류누 페트맇셜루
							{
								rule_string = Options.Variable.Diagram.Global[$(this)[0].attributes.id].rule_cont;
								rule_opt = $("g[model-id='"+$(this)[0].attributes.id+"']").attr("data-rule-opt");
							}
							else
							{
								
								for(i=0;i<data.list.length;i++)
								{
									if(data.list[i].rule_sn==$(this)[0].attributes.Use.Rule)
									{
										rule_string =data.list[i].rule_cont; 
									}
								}
								rule_opt = $("g[model-id='"+$(this)[0].attributes.id+"']").attr("data-rule-opt");
							}
							var temp = {};
							temp.rule_sn = $(this)[0].attributes.Use.Rule;
							temp.rule_name = $(this)[0].attributes.Use.Name;
							temp.rule_string = rule_string;
							temp.rule_opt	= rule_opt;
							temp.field =workflowRuleSetfields; 
							temp.type = type;
							workflowruleSet.push(temp);
							
						}
					}
					
				});
				if(run_validation_check==true)
				{
					var dataList = [];
					dataList = Options.Variable.slickGrid.id["prepGrid"].getData();
					// 자동 저장여부
					workflowJson.dbsave = 0;
					workflowJson.project_sn = $("#project_sn").val();
					workflowJson.project_data_sn = $("#project_data_sn").val();
					workflowJson.ruleSet = workflowruleSet;
					workflowJson.dataList = dataList;
					
					
					if(undefined!=callback)
					{
						workflowJson.callback = true;
					}else{
						workflowJson.callback = false;
					}
					
					// 실재 run 및 결과 출력
					restRequestBody("/outlier/run.fd", "POST", JSON.stringify(workflowJson), function(data){
						
						
						console.log(data);
						
						result = data;
						
						$("#OutputChartMetrix").append("ok");
						
						if(undefined===callback)
						{
							//내용 표출
							
							
							Core.Diagram.statistics(data.result);
							
							
							
						}
						else
						{
							callback(data.result);
						}
						
					});
				}
			});
				
				Core.Console.Write( { Type : 'Success' ,KeyCode : 'Succ1601' ,Message : '' } );	
				
		} 
		else if(type=="chart") // 차트 기능 출력
		{
			restRequest("/ajax/ruleList.fd", "POST", null, function(data){
				// 실행에 대한 체크등 기본적인 벨리데이션 체크를 통과해야지만 수행 이를 체크하는 flag
				var run_validation_check = true;
				var workflowJson = {};
				var workflowruleSet = [];
				var workflowRuleSetfields;
				var workflowOBj = Options.Variable.Diagram.Cells;
				
				
				// 데이터 구성
				$.each(workflowOBj, function(k,v){
					
					// DB 값을 제외한 diagrame에 해당하는 것만 추출함
					if($(this)[0].attributes.type=="devs.MyImageModel"  && $(this)[0].attributes.Use.Name!="DB"){
						
						
						// 컬럼 선택 여부 체크(차트 보기의 경우는 해당 루틴 제외됨)
						if($(this)[0].attributes.Use.RuleType!="04" && $(this)[0].attributes.Use.RuleType!="03" && $(this)[0].attributes.Use.RuleType!="05" && Options.Variable.Diagram.Global[$(this)[0].attributes.id].Column=="")
						{
	// console.log("log",$(this)[0]);
							run_validation_check = false;
							return false;
						}
						else
						{
							
	// console.log("log",$(this)[0].attributes);
							
							
								// header(columns)설정
								workflowRuleSetfields = Options.Variable.Diagram.Global[$(this)[0].attributes.id].Column.split(",");
								
								
								var local_rule_type = $(this)[0].attributes.Use.RuleType;
								
								if(local_rule_type=="20") // 류누 페트맇셜루
								{
									rule_string = Options.Variable.Diagram.Global[$(this)[0].attributes.id].rule_cont;
									
								}
								else if(local_rule_type=="30") // 류누 페트맇셜루
								{
									rule_string = Options.Variable.Diagram.Global[$(this)[0].attributes.id].rule_cont;
								}
								else if(local_rule_type=="40") // 류누 페트맇셜루
								{
									rule_string = Options.Variable.Diagram.Global[$(this)[0].attributes.id].rule_cont;
								}
								else if(local_rule_type=="50") // 류누 페트맇셜루
								{
									rule_string = Options.Variable.Diagram.Global[$(this)[0].attributes.id].rule_cont;
								}
								else if(local_rule_type=="60") // 류누 페트맇셜루
								{
									rule_string = Options.Variable.Diagram.Global[$(this)[0].attributes.id].rule_cont;
								}
								else if(local_rule_type=="70") // 류누 페트맇셜루
								{
									rule_string = Options.Variable.Diagram.Global[$(this)[0].attributes.id].rule_cont;
								}
								else if(local_rule_type=="80") // 클라우드 워드
								{
									rule_string = Options.Variable.Diagram.Global[$(this)[0].attributes.id].rule_cont;
								}
								
								
								
								
								else
								{
									for(i=0;i<data.list.length;i++)
									{
										if(data.list[i].rule_sn==$(this)[0].attributes.Use.Rule)
										{
											rule_string =data.list[i].rule_cont; 
										}
									}
								}
								
								
								var temp = {};
								
	// console.log("test",$(this)[0].attributes.Use.RuleType);
								
								temp.rule_sn 		= $(this)[0].attributes.Use.Rule;
								temp.rule_name 		= $(this)[0].attributes.Use.Name;
								temp.rule_string 	= rule_string;
								temp.rule_opt		= $(this)[0].attributes.Use.RuleOpt;
								temp.field 			= workflowRuleSetfields;
								temp.type			= local_rule_type;
								
								
								
								// 이벤트 발생하기 전까지의 데이터 기준으로 workflow를 구성함
								if($(this)[0].attributes.id==options.curId)
								{
									return false;
								}
								else
								{
									if(temp.rule_string!="")
									{
										workflowruleSet.push(temp);
									}
								}
								// bleaking
								
						}
								
					}
					
				});
				
				
				if(run_validation_check==false)
				{
					alert_message(lang_return("fixa.core.title064")); // alert("설정하신 룰중 커럶
																// 선택이 안된 룰셋이있습니다.
																// 컬럼 설정은 필수
																// 요소입니다.");
				}
				else
				{
					var dataList = [];
					dataList = Options.Variable.slickGrid.id["prepGrid"].getData();
					// 자동 저장여부
					workflowJson.dbsave = 0;
					workflowJson.project_sn = $("#project_sn").val();
					workflowJson.project_data_sn = $("#project_data_sn").val();
					workflowJson.ruleSet = workflowruleSet;
					workflowJson.dataList = dataList;
					
					 
	// console.log("json",JSON.stringify(workflowJson));
					
					
					// 실재 run 및 결과 출력
					restRequestBody("/outlier/run.fd", "POST", JSON.stringify(workflowJson), function(data){
	// console.log("/outlier/run.fd", data);
						result = data;
						
						
						
	// console.log("result",data.result);
					
						chartxcategory = [];
						chartData = [];
						/**
						 * 차트 필드 추출
						 */
						$.each(data.result, function(k1,v1)
						{
							for(j=0;j<data.result[k1].field.length;j++)
							{
								
								if(chartxcategory.indexOf(data.result[k1].field[j])<=-1 && data.result[k1].type!="04")
								{
									chartxcategory.push(data.result[k1].field[j]);
								}
							}
						});
						
						/**
						 * 차트 출력데이터 추출
						 */
						// var chartDataObject = [];
						// var sumCheckObject = {};
						var groupData = [];
						// console.log("sumCheckObject",sumCheckObject);
						
						$.each(data.result, function(k,v)
						{
							
							var chartDataObject = [];
							var sumCheckObject = {};
							for(j=0;j<chartxcategory.length;j++)
							{
								sumCheckObject[chartxcategory[j]] = 0;
							}
							
							
							if(v.rule_string!="" && v.type!="04")
							{
								chartDataObject.push(v.rule_name+"_("+k+")");
								
								
								groupData.push(v.rule_name+"_("+k+")");
								
		
	// console.log("v",v);
								
								$.each(data.result[k].result.reasonData, function(k1,v1)
								{
									
									for(j=0;j<v.field.length;j++)
									{
										if(v1[v.field[j]]>0)
										{
											sumCheckObject[v.field[j]]=sumCheckObject[v.field[j]]+1; 
										}
									}
								});
								
								
								for(j=0;j<chartxcategory.length;j++)
								{
									
									chartDataObject.push(sumCheckObject[chartxcategory[j]]);
									
								}
									
								chartData.push(chartDataObject);	
							}
						});
						
						Core.c3.groupbarchart("#barChart", chartxcategory, chartData, groupData);
						
					});
					
				}
				
			});
		}
		Prep.UpdateData();
	}
}
/**
 * uuid generator
 */
Core.uuid = function()
{
	 
function s4() {
  return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
}
return s4() + s4() + '_' + s4() + '_' + s4() + '_' + s4() + '_' + s4() +'_'+ s4() +'_'+ s4();
}



/**
 * workflow수행후 나온 데이터에 대한 통계치 측적용 함수
 */
Core.Diagram.tabview = function(key, type)
{
	
	flag = type;
	for(i=0;i<workflow_result.length;i++)
	{
		if(workflow_result[i]["key"]==key)
		{
			if(type=="eraserData")
			{
				slickGrid.setData(Options.Variable.slickGrid.id[key], workflow_result[i].result.eraserData);
			}	
			else if(type=="cleanData")
			{
				slickGrid.setData(Options.Variable.slickGrid.id[key], workflow_result[i].result.cleanData);
			}
		}
	}
	


}

/**
 * 내보내기(프로젝트)
 */
Core.exportData = function()
{
	if($("#project_sn").val()==undefined || $("#project_data_sn").val()==undefined)
	{
		alert_message("다운로드하실 프로젝트를 선택하신후 export를 수행해주시기 바랍니다.");
		return ;
		
	}
	
	project_sn = $("#project_sn").val();
	project_data_sn = $("#project_data_sn").val();

	console.log("project_sn",project_sn);
	console.log("project_data_sn",project_data_sn);
	
	var temp_map = {};
	var jsonarray = [];
	
	//다이어그램 정보 exprot수행
	var diagramInfo = new Array();
	
		for(var i=0; i<$("image").length; i++){
			if(i !=0){
				if($("image:eq("+i+")").parent().parent().attr("data-type") !="devs.MyImageModel"){
				var diagramData = new Object();
				diagramData.before_scrollerX = $(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").width();
				diagramData.before_scrollerY = $(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").height();
				diagramData.before_data_ruleId = $("image:eq("+i+")").parent().parent().attr("model-id");
				diagramData.before_data_index = $("image:eq("+i+")").parent().parent().attr("data-index");   
				diagramData.before_data_type =  $("image:eq("+i+")").parent().parent().attr("data-type");  
				var position = $("image:eq("+i+")").parent().parent().attr("transform").replace("translate","").replace("(","").replace(")","").split(",");
				diagramData.before_data_x = parseInt(position[0]);
				diagramData.before_data_y = parseInt(position[1]);
				diagramData.before_data_icon = $("image:eq("+i+")").attr("xlink:href");
				diagramData.before_data_rule = $("image:eq("+i+")").parent().parent().attr("data-rule");
				diagramData.before_data_rule_opt = $("image:eq("+i+")").parent().parent().attr("data-rule-opt");
				diagramData.before_data_name = $("image:eq("+i+")").parent().parent().attr("data-name");
// 				diagramData.before_data_columnType =Options.Variable.slickGrid.headerOption["prepGrid"];
				//R데이터
				if($("image:eq("+i+")").parent().parent().attr("data-type") == "03"){
//						diagramData.before_feild_name = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column;
					diagramData.data = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Rdata.split(",");
				//사용자 정의 및 정규식 체크박스 데이터
				}else if($("image:eq("+i+")").parent().parent().attr("data-type")== "01"){
					diagramData.data = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column.split(",");
				//차트 데이터
				}else if($("image:eq("+i+")").parent().parent().attr("data-type") == "04"){
					diagramData.data = "";
				}else if($("image:eq("+i+")").parent().parent().attr("data-type") == "20"){
					diagramData.before_feild_name = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column;
					diagramData.data = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont;
				}else if($("image:eq("+i+")").parent().parent().attr("data-type") == "30"){
					diagramData.before_feild_name = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column;
					diagramData.data = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont;
				}else if($("image:eq("+i+")").parent().parent().attr("data-type") == "40"){
					diagramData.before_feild_name = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column;
					diagramData.data = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont;
				}else if($("image:eq("+i+")").parent().parent().attr("data-type") == "50"){
					diagramData.before_feild_name = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column;
					diagramData.data = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont;
				}else if($("image:eq("+i+")").parent().parent().attr("data-type") == "60"){
					diagramData.before_feild_name = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column;
					diagramData.data = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont;
				}else if($("image:eq("+i+")").parent().parent().attr("data-type") == "70"){
					diagramData.before_feild_name = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column;
					diagramData.data = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont;
				}else{
					diagramData.before_feild_name = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column;
					diagramData.data = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].rule_cont;
				}
				diagramInfo.push(diagramData);
				}
			}
		}
	
	$("#itmHistoryGrid li a").each(function(k,v){
	    if($(v).attr("mac-address")!==undefined){
	       //console.log($(v).attr("mac-address"))
	       //console.log($(v).text())
	       
	    	temp_map = {};
	    	temp_map['mac-address'] 		= $(v).attr("mac-address");
	    	temp_map['text'] 				= $(v).text();
	    	temp_map['data-value-cloumn'] 	= $(v).attr("data-value-cloumn");
	    	temp_map['title'] 				= $(v).attr("title");
	    	temp_map['data-value-before'] 	= $(v).attr("data-value-before");
	    	temp_map['data-value-after'] 	= $(v).attr("data-value-after");
	    	temp_map['data-index-col'] 		= $(v).attr("data-index-col");
	    	temp_map['data-index'] 			= $(v).attr("data-index");
	    	temp_map['create-date'] 		= $(v).attr("create-date");
	    	
	    	
	    	
	    	
	    	jsonarray.push(temp_map)
	    }
	});
	
	
	console.log("jsonarray",JSON.stringify(jsonarray).length);
	
	var temp_frm = $('<form/>',{"target":"hiddenframe","method":"post"}).attr('action','/common/exportData.fd');
	temp_frm.append($("<input/>",{type:"hidden",name:"project_sn",value:project_sn}));
	temp_frm.append($("<input/>",{type:"hidden",name:"project_data_sn",value:project_data_sn}));
	temp_frm.append($("<input/>",{type:"hidden",name:"blockchain",value:JSON.stringify(jsonarray)}));
	temp_frm.append($("<input/>",{type:"hidden",name:"diagram_layout",value:JSON.stringify(diagramInfo)}));
	
	//url = "/common/exportData.fd?project_sn="+project_sn+"&project_data_sn="+project_data_sn+"&history="+JSON.stringify(jsonarray);
	temp_frm.appendTo( document.body );
	temp_frm.submit();
	//temp_frm.remove();
	
	
	//console.log(url);
	
	//window.open(url, "hiddenframe");
}

// Core.importData = function(){
// var objModal = Core.Modal.Background();
// var elContainer = $i('<div/>' ,{
// id : Options.Element.Project.Open.Id
// });
// var elTitle = $i('<div/>' ,{
// class : 'title'
// , text : lang_return("fixa.core.title211")//'프로젝트 열기'
// });
// var elContent = $i('<div/>' ,{
// class : 'content'
// });
// var itmList = $i('<ul/>' ,{
// class : 'list',
// id : 'collect_import_data'
// });
// var elButtonOk = $i('<a/>' ,{
// class : 'button'
// , text : lang_return("fixa.core.title212")//'프로젝트 열기'
// , href : '#'
// }).on('click' ,function() {
// // Core.Project.ImportRun(importId);
// // var elProjectList = $i('#' + Options.Element.Project.Open.Id + ' .list
// li.select a');
// //Core.Project.Open();
// // Core.Project.Open2();
// // Core.Modal.Close();
// return false;
// } );
// var elButtonCancle = $i('<a/>' ,{
// class : 'button'
// , text : lang_return("fixa.core.title036")//'취소'
// , href : '#'
// }).on('click' ,function() {
// Core.Modal.Close();
// return false;
// } );
// var elButtonBox = $i('<div/>' ,{
// class : 'itmButton'
// }).append(elButtonCancle).append(elButtonOk);
// elContent.html(itmList);
// elContainer.append(elTitle).append(elContent).append(elButtonBox);
// objModal.html(elContainer);
// Options.Element.Global.Inni.El().append(objModal);
// //Core.Project.List();
// Core.Project.ImportList();
// }
Core.Project.ImportRun = function(sn){
	Core.Project.ImportSaveShow();
	$.ajax({
	    url: '/collect/importRun.fd' 
	    ,async: false
	    ,type: 'post'
	    ,dataType: 'json'
	    ,success: function(data) {
	    	
	    }
	});
}
// 프로젝트 목록 클릭시 글씨 색 전환 및 열기 값 세팅
Core.Project.ImportClick = function(id,size){
	for(var i=0; i<size; i++){
		if((i+1)==id){
			
			$("#imp"+(i+1)+"").attr("class","active");
			$("#imp"+(i+1)+"").css("color","red");
		}else{
			$("#imp"+(i+1)+"").css("color","#888");
			$("#imp"+(i+1)+"").removeAttr("class");
		}
	}
// project_sn = sn;
}
// 프로젝트 목록 마우스 아웃시 회색계열 글씨색 변경
Core.Project.ImportMouseout = function(id){
	if($("#imp"+id+"").attr("class")=="active"){
	}else{
		$("#imp"+id+"").css("color","#888");
	}
}
// 프로젝트 목록 마우스 오버시 빨강색 글자색 변경
Core.Project.ImportMouseover = function(id){
	$("#imp"+id+"").css("color","red");
}

/**
 * pdf다운로드
 */
Core.pdfdownload = function(url)
{
	window.open(url, "hiddenframe");
}
/**
 * csv다운로드
 */
Core.csvdownload = function(url)
{
	// window.open(url, "hiddenframe");
	
	$.ajax({
	     url: url
	    ,type: 'post'
	    ,dataType: 'json'
	    ,success: function(data) {
	    	
	    	if(data.result == "success"){
	    		
	    		Core.DownFile(data.fileName);
	    		
	    	}else{
	    		
	    		alert_message("파일이 없습니다.");
	    		
	    	}
	    	
	    	
	    }
		,beforeSend : function() {
			loadingBar();
		}
		, complete: function () {
			loadingprogresshide();
	        
		}
	    
	});
}

var tbArr = new Array();
var tbJson = new Object();
Core.Diagram.statistics = function(obj)
{
	
	
	$.each(Object.keys(Options.Variable.slickGrid.id), function(k,v){
		 if(v.match("result_")){
				// 전역변수로 지정된 배열에 문자열을 담음
			 delete Options.Variable.slickGrid.id[v];
			}
	});
	
	console.log(obj);
	$("#result_tab").html("");
	$("#result_tab_content").html("");
	workflow_result = [];
	// 오류 데이터 건수의 합
	var eraserCnt = [] ;
	var origin = [];
	// 데이터 총 건수
	var total ;
	if(obj.length>0)
	{
		var frist_tab = "";
		
		console.log("obj",obj);
		origin = obj;
		testData = obj;
		temp_height = $(".output").height()-120;
		for(i=0;i<obj.length;i++)
		{
			
			var uuid = Core.uuid();
			
			console.log("uuid",uuid);
			
			var tab_unikey = "tab"+i+"_"+uuid;
			
			
			if(i==0)
			{
				frist_tab = tab_unikey;
			}
			
			is_active = "";
			
			
			
			rule_name 	= obj[i]['rule_name'];
			rule_sn		= obj[i]['rule_sn'];
			rule_field  = obj[i]['field'];
			
			title = "select field : "+rule_field;
			
			result_id = "result_"+rule_sn+"_"+uuid;
			obj[i].key=result_id;
			
			workflow_result.push(obj[i]);
			
			if(i==0)
			{
				is_active = "active";
			}
			// tabNav = "<li class='tabs' rel='"+tab_unikey+"'
			// key='"+result_id+"' title='"+title+"'
			// onClick=Core.setTabName('"+rule_name.replace(/ /g,
			// '')+"','"+result_id+"');>"+rule_name+" </li>";
			// tab 생성
			
			tabNav = $("<li/>",{"class":"tabs", "rel":tab_unikey,"key":result_id,"title":title,"text":rule_name,"data_type":obj[i]['type']}).on("click",function(e){
				
				
				 $("ul.tabs li").removeClass("active").css("color", "#333");
			        $(this).addClass("active").css("color", "darkred");
			        $(".tab_content").hide()
			        var activeTab = $(this).attr("rel");
			        var data_type = $(this).attr("data_type");
			        var key= $(this).attr("key");
			        
			        $("#" + activeTab).fadeIn();
			        setTimeout(
				        $.each(Object.keys(Options.Variable.slickGrid.id), function(k,v){
							if(v.length>9)
							{
								try{
								Options.Variable.slickGrid.id[v].resizeCanvas();
								Options.Variable.slickGrid.id[v].invalidate();
								}catch(e){}
							}
						})
			        ,100);
			        
			        
			       if(data_type=="80")
			       {
			    	   $('#cloud').jQCloud("resize")
			       }
			       else if(data_type=="04") //통계
			       {
			    	   //$("#"+activeTab).css("height",$("#consoleText").height()-26)
			       }
			       
			       console.log("data_type",data_type);
			       console.log("result_id",activeTab);
			});
			
			console.log("tabNav",tabNav);
			
			$("#result_tab").append(tabNav);
			
			// R 설정이 아닌 것만
			if("03" != obj[i]['type'] &&"04" != obj[i]['type'] && "80" !=  obj[i]['type']){
				
			
				var eraserDataHtml = "";
				
				eraserData = obj[i]['result']['eraserData'];
				cleanData = obj[i]['result']['cleanData'];
				var fieldData = obj[i]['field'];
				
				
				// 진단항목별 오류 데이터
				eraserCnt.push(obj[i]['result'].eraserData); 
				// 데이터 총 건수
				total = obj[0]['result'].eraserData.length + obj[0]['result'].cleanData.length;
				
				
				eraserDataHtml = "<div id='"+result_id+"' style='width: 100%; height: "+temp_height+"px;'/>";
				
				
				var totalCount = obj[i]['result'].eraserData.length+obj[i]['result'].cleanData.length;
				
				
				
				var tab_content = "";
				tab_content = tab_content + "<div class='tab_content rule_set' id='"+tab_unikey+"'>";
				tab_content = tab_content + "<table class=''  style='table-layout:fixed; width:100%; height: auto;'>";
				tab_content = tab_content + "<tr>";
				tab_content = tab_content + "		<td width='*' height='30px'>rule set 감지 데이터 : (<a href='#' style='color:red;'onClick=Core.Diagram.tabview('"+result_id+"','eraserData');>"+obj[i]['result'].eraserData.length+"</a>/"+totalCount+") clean data : (<a href='#' style='color:green;' onClick=Core.Diagram.tabview('"+result_id+"','cleanData');>"+obj[i]['result'].cleanData.length+"</a>/"+totalCount+")</td>";
				tab_content = tab_content + "</tr>";
				tab_content = tab_content + "<tr>";
				tab_content = tab_content + "		<td valign='top'>"+eraserDataHtml+"</td>";
				tab_content = tab_content + "</tr>";
				tab_content = tab_content + "</table>";   
				tab_content = tab_content + "</div>";
				$("#result_tab_content").append(tab_content);
				
				// workflow_field = ;
				
				// 데이터 바인딩
				
				Options.Variable.slickGrid.id[result_id] = slickGrid.init(Options.slickgrid.option['default_grid_option'], Options.Variable.slickGrid.id[result_id], result_id, workflow_field, eraserData);
				
				
				
				
				
				
				workflow_field = [];
				for(j=0;j<workflow_field_ori.length;j++)
				{
					workflow_field.push(workflow_field_ori[j]);
				}
				
				// console.log("workflow_field",columns);
				
				
				
				// 우선 prep값을 기준으로 동작하게 수정.
				// slickGrid.setColumnReadOnly(Options.Variable.slickGrid.id[result_id],
				// columns);
				slickGrid.setColumnReadOnly(Options.Variable.slickGrid.id[result_id], Options.Variable.slickGrid.header["prepGrid"]);
				slickGrid.setData(Options.Variable.slickGrid.id[result_id], eraserData);
				
				
				
				
			}else if("03" == obj[i]['type']){
				// python 셋팅
				
				console.log("test", obj[i]);
				
				if(obj[i].execuite == "ing"){
					
					clearInterval(statis_time);
					 
					fieldVal = obj[i]['fieldVal'];
					fileName = obj[i]['fileName'];
					
					$("#loading_text").show();
					
					
					statis_time = setInterval(function(){
						console.log("time.......");
						
						$("#statisc_img").attr("style","width:0%");
						var allData = { "fieldVal": fieldVal, "fileName": fileName };
						
						restRequest('/outlier/fileCheck.fd', "GET", allData, function(data){
						
							
							console.log("fileCheck",data.csv);
							
							
							if(data.result == "success"){
					    		
					    		if(fieldVal=="3"){ //타임시리즈 일
					    			start_preict_idx = 0;
					    			end_preict_idx = 0;
					    			lower_array = ['lower'];
					    			upper_array = ['upper'];
					    			mean_array = ['mean'];
					    			x_array = ['x'];
					    			$.each(data.csv,function(k,v){
					    				
					    				lower_array.push(v['lower']);
						    			upper_array.push(v['upper']);
						    			mean_array.push(v['mean']);
						    			x_array.push(v['idx']);
						    			
						    			if(v['real_predict']!='real')
						    			{
						    				if(start_preict_idx ==0)
						    				{
						    					start_preict_idx = k;
						    				}
						    				end_preict_idx = k;
						    			}
						    			
					    				
					    			});
					    			
					    			c3.generate({
										size:{
											  height:'450' 
											  
										},
								    	bindto: "#staticsview_chart2",
									    data: {
									    	x: 'x',
									        columns:[
									        	x_array,
									        	upper_array,
									        	mean_array,
									        	lower_array
									        ],
									        type: 'spline'
									    },
										point: {
											  show: false,
										}/**,
										zoom: {
									        enabled: true
									    }**/
										,regions:[
											{start:start_preict_idx, end:end_preict_idx, class:'red'}
										]
										,x: {
										    show: false
										}
										,axis: {
											  x: {
											    tick: {
											      count: 10
											    }
											  }
											}
									});
									
					    			
					    			//$("#staticsviewchart")
									$("#loading_text").hide();
									console.log("성공...타이머 중지");
									Core.Console.Write( { Type : 'Success' ,KeyCode : 'Succ4' ,Message : '' } );
									clearInterval(statis_time);
									
									
									
					    		}
					    		else if(fieldVal=="2"){
					    			$("#loading_text").hide();
									console.log("성공...타이머 중지");
									Core.Console.Write( { Type : 'Success' ,KeyCode : 'Succ4' ,Message : '' } );
									clearInterval(statis_time);
					    		}
					    		else
					    		{
									var image = new Image();
									img_src = "/outlier/imageload.fd?fieldVal="+fieldVal+"&fileNm="+fileName;
									image.src = img_src;
									
									image.onload = function(){
										$("#statisc_img").attr("src",img_src);
										$("#statisc_img").css("height",$("#arConsole>.itmPanel>.contents>.content").height()-130);
										$("#statisc_img").css("width",$("#arConsole>.itmPanel>.contents>.content").height()-130);
										
										$("#loading_text").hide();
									}
									
									console.log("성공...타이머 중지");
									Core.Console.Write( { Type : 'Success' ,KeyCode : 'Succ4' ,Message : '' } );
									clearInterval(statis_time);
					    		}
								
								
					    		
					    	}else if(data.result=="fail"){
					    		
					    		console.log("실패...타이머 중지");
					    		
					    		$("#loading_text").hide();
					    		Core.Console.Write( { Type : 'Error' ,KeyCode : 'err1' ,Message : data.contents } );	
					    		clearInterval(statis_time);
								
					    		
					    		
					    	}
						});
						
					},2000);
				}

				fileurl = "/outlier/getStatisFile.fd?fieldVal="+obj[i]['fieldVal']+"&fileNm="+obj[i]['fileName'];
				var tab_content = "";
				tab_content = tab_content + "<div class='tab_content' id='"+tab_unikey+"'>";
				tab_content = tab_content + "<table  style='table-layout:fixed; width:100%; height: calc(100% - 60px);'>";
				tab_content = tab_content + "<tr>";
				tab_content = tab_content + "		<td valign='top' height='10px'><button class='file_up' onClick=\"Core.csvdownload('"+fileurl+"')\">파일 다운로드</button></td>";
				tab_content = tab_content + "</tr>";
				
				if(fieldVal=="3" || fieldVal=="2")  //3=> time , 2=>hdbcan
				{
					tab_content = tab_content + "<tr>";
					tab_content = tab_content + "		<td valign='top' id='staticsview'>" +
														"<div id='staticsview_chart2'></div>" +
														"<img id='statisc_img' src='/fixadata-common/images/ajax-loader.gif' style='width: 0%;'/></a>" +
														"<div id='loading_text'>Processing...</div></td>";
					tab_content = tab_content + "</tr>";
				}
				else
				{
					tab_content = tab_content + "<tr>";
					tab_content = tab_content + "		<td valign='top' id='staticsview'><a data-magnify='gallery' data-caption='"+obj[i]['fileName'].split("_")[0]+"' data-group='' href='/outlier/imageload.fd?fieldVal="+obj[i]['fieldVal']+"&fileNm="+obj[i]['fileName']+"'><img id='statisc_img' src='/fixadata-common/images/ajax-loader.gif' style='width: 0%;'/></a><div id='loading_text'>Processing...</div></td>";
					tab_content = tab_content + "</tr>";
				}
				
				tab_content = tab_content + "</table>";   
				tab_content = tab_content + "</div>";
				$("#result_tab_content").append(tab_content);
			}else if("80" == obj[i]['type']){
				var tab_content = "";
				tab_content = tab_content + "<div class='tab_content' id='"+tab_unikey+"'>";
				tab_content = tab_content + "<div id='cloud'>";
				tab_content = tab_content + "</div>";
				tab_content = tab_content + "</div>";
				$("#result_tab_content").append(tab_content);
				
				cleanData = obj[i]['result']['cleanData'];
				
				
				Core.Diagram.CloudSetting(cleanData);
				
				
				
				
			}else{
				
				
				var strdHeader = obj[i]['result']['standardList'][0].strd_header;
				var strdData   = obj[i]['result']['standardList'][0].data;
				
				var jsonData = JSON.parse(strdData);
				var hArray   = [];
				// 행정표준용어 데이터
				$.each(jsonData, function(k,v){
					if(v[strdHeader] != ""){
						hArray.push(v[strdHeader]);
					}
				})
				
				columns = [];
				//
				$.map(Options.Variable.slickGrid.id["prepGrid"].getColumns(),function(k,v){
					columns.push(k.name);
				});

				
				
				var columnCnt = JSON.parse(JSON.stringify(columns));
				
				columnCnt.splice(columnCnt.indexOf("idx"),1);
				
				var colCount = [];
				// 컴럼정의 불일치
				colCount = columnCnt.filter(function(val) {
				  return hArray.indexOf(val) == -1;
				});
				
				
				
				// 값에 대한 오류율계산(eraserCnt)의 sum
				var eraserSum = 0;
				for(var k=0; k<eraserCnt.length;k++)
				{
					eraserSum = eraserSum + eraserCnt[k].length;
				}
				// 오류 데이터 건수의 합
				eraserCnt = eraserSum;
				
				
				
				colspan = columnCnt.length * 2;
				colpercent = 100/colspan; 
				
					
				var tab_content = "";
				tab_content = tab_content + "<div class='tab_content statistics' id='"+tab_unikey+"'>";
				tab_content = tab_content + "<table>";
				tab_content = tab_content + "<thead>";
				tab_content = tab_content + "<tr>";
				tab_content = tab_content + "		<th style=\"\" colSpan='"+colspan+"'>"+lang_return("fixa.core.title179")+" :(<a href='#' style='color:red;'>"+colCount.length+"</a>/"+columnCnt.length+")   "+lang_return("fixa.core.title180")+" : "+(columnCnt.length-colCount.length)+"</th>";
				tab_content = tab_content + "</tr>";
				tab_content = tab_content + "</thead>";
				
				var check = false;
				var aJsonArray = new Array();
				var aJson = new Object();
				var aJson2 = new Object();
				
				var cnt = 1;
				var cnt2 = 1;
				for (var o = 0; o < columnCnt.length; o++) {
					if ((o % 3) == 0) {
						tab_content = tab_content + "<tbody>";
						tab_content = tab_content + "<tr>";
					}
					
					tab_content = tab_content + "		<th width='"+colpercent+"%' style=\"\">"+columnCnt[o]+"</th>";
					 for (var j = 0; j < hArray.length; j++) {
				        if (columnCnt[o] == hArray[j] ) {
				        	
				        	aJson["O"] = cnt++;
				        	// aJson2[columns[o]] = 0;
				        	tbJson[columnCnt[o]] = "O";
				        	tab_content = tab_content + "		<td width='"+colpercent+"%'> O </td>";
				        	check =true;
				        }
				    }
				    if(check == false){
				    	aJson["X"] = cnt2++;
				    	// aJson2[columns[o]] = 1;
				    	tbJson[columnCnt[o]] = "X";
				    	tab_content = tab_content + "		<td width='"+colpercent+"%'> X </td>";
				    }else{
				    	check =false;
				    }
				    if ((o % 3) == 2 || o == columnCnt.length - 1) {
						tab_content = tab_content + "</tr>";
						tab_content = tab_content + "</tbody>";
					}
				}
				
				

				tbArr.push(tbJson);	
					
				aJsonArray.push(aJson);
				
				obj[i].result.eraserData = aJsonArray;
				
				tab_content = tab_content + "</table>";
				
				tab_content = tab_content + "<table id='testTable'>";
				tab_content = tab_content + "<thead>";
				tab_content = tab_content + "<tr>";
				tab_content = tab_content + "		<th style=\"\" colSpan='2'>Rule Set 감지 정보</th>";
				tab_content = tab_content + "</tr>";
				tab_content = tab_content + "</thead>";
				
				for(j=0;j<obj.length;j++){
					if("03" != obj[j]['type'] && "04" != obj[j]['type'] && "80" != obj[j]['type']){
						
						tab_content = tab_content + "<tbody>";
						tab_content = tab_content + "<tr>";
						tab_content = tab_content + "		<td valign='top'>"+obj[j]['rule_name']+"</td>";
						tab_content = tab_content + "		<td valign='top'>감지 데이터 : (<label style='color:red;'>"+obj[j]['result'].eraserData.length+"</label>/"+(obj[j]['result'].eraserData.length + obj[j]['result'].cleanData.length)+") </td>";
						tab_content = tab_content + "</tr>";
						tab_content = tab_content + "</tbody>";
					}
					else if("80" == obj[j]['type'])
					{
						
						tab_content = tab_content + "<tbody>";
						tab_content = tab_content + "<tr>";
						tab_content = tab_content + "		<td valign='top'>"+obj[j]['rule_name']+"</td>";
						tab_content = tab_content + "		<td valign='top'>검출word count : "+(obj[j]['result'].eraserData.length + obj[j]['result'].cleanData.length)+" </td>";
						tab_content = tab_content + "</tr>";
						tab_content = tab_content + "</tbody>";
					}
				}
				tab_content = tab_content + "</table>";  
				
				tab_content = tab_content + "<table>";
				tab_content = tab_content + "<thead>";
				tab_content = tab_content + "<tr>";
				tab_content = tab_content + "		<th style=\"\" colSpan='2' width='*'>오류율 정보</th>";
				tab_content = tab_content + "</tr>";
				tab_content = tab_content + "</thead>";
				tab_content = tab_content + "<tbody>";
				tab_content = tab_content + "<tr>";
				tab_content = tab_content + "		<td><span>값(정확성) 오류율(%)</span> = "+(eraserCnt/total)*100+"</td>";
				tab_content = tab_content + "		<td><span>표준(일관성) 오류율(%)</span> = "+((Number(colCount.length)*100)/columnCnt.length)+"</td>";
				tab_content = tab_content + "</tr>";
				tab_content = tab_content + "</tbody>";
				tab_content = tab_content + "</table>";  
				
				tab_content = tab_content + "<table>";
				tab_content = tab_content + "<tr>";
				
				if(origin.filter(function(e,i,a){return e.rule_sn==4;}).length>0){
					tab_content = tab_content + "		<td valign='top' colspan='2'><div id='standardChart2'></div></td>";
				}
				else
				{
					tab_content = tab_content + "		<td valign='top' colspan='2'><div id='standardChart'></div></td>";
				}
				
				tab_content = tab_content + "</tr>";
				tab_content = tab_content + "</table>";   
				tab_content = tab_content + "</div>";
				
				
				$("#result_tab_content").append(tab_content);
				
					
				  console.log("origin",origin);
				  
				  temp = origin.filter(function(e,i,a){return e.rule_sn==4 || e.rule_sn==9});
				  if(origin.filter(function(e,i,a){return e.rule_sn==4 || e.rule_sn ==9}).length>0){
					
					  
					  var chartData = [];
					  
					  
					  var search_column = Options.Variable.slickGrid.id["prepGrid"].getColumns().filter(function(e){return e.name!='idx'}).map(function(e){return e.name});
					  for(n=0;n<temp.length;n++)
					  {
						  //chartData['barchart'][n] = [];
						  chartTemp = [];
						  
						  
						  $.each(search_column,function(k,v){
							    //console.log(k);
							    //console.log(v);
							  chartTemp[k] = 0;
							   
							  
							  
						  });
						  
						  console.log("bb",temp[n].result.reasonData);
						  if(temp[n].result.reasonData!=null && temp[n].result.reasonData!=undefined){
							  for(m=0;m<temp[n].result.reasonData.length;m++)
							  {
								  
								  
								  $.each(search_column,function(k,v){
									    //console.log(k);
									    //console.log(v);
									  
									  console.log(temp[n].result.reasonData[m][v]);
									  if(temp[n].result.reasonData[m][v]!=undefined){
									
										  chartTemp[k] = chartTemp[k] + temp[n].result.reasonData[m][v]; 
									  }
									   
									  
									  
								  });
							  
							  
							  }
							    
						  }
						  chartTemp.unshift(n+"_"+temp[n].rule_name);
						  chartData.push(chartTemp);
						  
						  
					  }
					  
					  
					  
					  
					  Options.Variable.Global.pieChart = c3.generate({
							size:{
								  height:'250' 
								  ,width:$(".statistics").width()-100
							},
					    	bindto: "#standardChart2",
						    data: {
						        columns:chartData ,
						        type: 'bar'
						    },
						    bar: {
						        width: {
						            ratio: 0.5 // this makes bar width 50% of length between ticks
						        }
						    }
						    ,axis: {
						    x: {
						        type: 'category',
						        categories:search_column
						    }
						}
						});
				  }
				  else
				  {
					  Options.Variable.Global.pieChart = c3.generate({
						  size:{
							  height:250  
							  ,width:250
						  },
				    	  bindto: "#standardChart",
				    	  data: {
				    	    json: [aJsonArray[0]],
				    	    keys: {
				    	      value: Object.keys(aJsonArray[0]),
				    	    },
				    	    type: "pie",
				    	    
				    	  },
				    	}); 
				  }
				  
				  
				  
				
			}
			
			/**
			 * $(".tab_content").hide(); $(".tab_content:first").show();
			 * 
			 * $("ul.tabs li").click(function () { $("ul.tabs
			 * li").removeClass("active").css("color", "#333");
			 * $(this).addClass("active").css("color", "darkred");
			 * $(".tab_content").hide() var activeTab = $(this).attr("rel"); var
			 * key= $(this).attr("key");
			 * 
			 * $("#" + activeTab).fadeIn(); });
			 */
		    
		    
		    // 이상치검출 결과 tab 활성화
			$('#workflow_output').removeClass('on').removeClass('lock').addClass('on');
			$('#workflow_output').trigger('click');
			
		    
		    
		    	
			
		    
		}
		
		//클릭처리
		setTimeout(function(){
			$(".tab_container >.tab_content >table>tbody > tr> td").children("a").eq(0).click();
		},10);
		

		
		$("li[rel='"+frist_tab+"']").trigger('click');
	}
	
	
	
}

/**
 * 속성설정창 생성(기본속성창)
 */
Core.Diagram.Contextmenu.ColumnsCheck = function( d ,ruleId ) {
	
	//console.log("Core.Diagram.Contextmenu.ColumnsCheck.d",d);
	// console.log("Core.Diagram.Contextmenu.ColumnsCheck.ruleId",ruleId);
	
	var TABLE_HEADER_KEY	= Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).join(",").split(',');
	var TABLE_HEADER_NAME	= Options.Variable.slickGrid.id["prepGrid"].getColumns().map(function(e){return e.name}).join(",").split(',');
	
	var itmList				= $i( '<ul/>' ,{ class : 'checkColumn' , id : ruleId} );

	var input		= $i('<input/>' ,{
		id		: ('TABLE_HEADER')
	,	name	: 'TABLE_HEADERS'
	,	type	: 'checkbox'
	,	value	: ''
	}).on("click", function(){
		var chk = $(this).is(":checked") ? true : false; 
		$("#"+ruleId).parent().parent().find("input:checkbox").attr("checked", chk);
	});
	var label		= $i('<label/>' ,{
		'for'	: ('TABLE_HEADER')
	,	text	: lang_return("fixa.core.title065")// '전체선택'
	});
	var li			= $i('<li/>').append(input).append(label);
	itmList.append(li);
	
	for ( var fx=0; fx<TABLE_HEADER_KEY.length; ++fx ) {
		
		data_type = "";
		
		
		
		var headerKey	= TABLE_HEADER_KEY[fx];
		var headerName	= TABLE_HEADER_NAME[fx];
		var checked		= Core.Diagram.Contextmenu.ColumnChecked( ruleId ,headerKey );
		
		for(i=0;i<Options.Variable.slickGrid.headerOption['prepGrid'].length;i++)
		{
// console.log(Options.Variable.slickGrid.headerOption['prepGrid'][i]);
			if(Options.Variable.slickGrid.headerOption['prepGrid'][i].name==headerName && (
						Options.Variable.slickGrid.headerOption['prepGrid'][i]['data_type']=="number"
						||Options.Variable.slickGrid.headerOption['prepGrid'][i]['data_type']=="label"
						||Options.Variable.slickGrid.headerOption['prepGrid'][i]['data_type']=="date"
					))
			{
				data_type =Options.Variable.slickGrid.headerOption['prepGrid'][i]['data_type']; 
				break;
			}
		}
		
		var input		= $i('<input/>' ,{
			id		: ('TABLE_HEADER' + fx)
		,	name	: 'TABLE_HEADER'
		,	type	: 'checkbox'
		,	value	: headerKey
		,	checked	: checked
		});
		var label		= $i('<label/>' ,{
			'for'	: ('TABLE_HEADER' + fx)
		,	text	: headerName
		});
		
		if(data_type!="")
		{
			label.append($("<span/>",{"class":"datetype_setting_"+data_type}));
		}
		
		var li			= $i('<li/>').append(input).append(label);
		itmList.append(li);
	};
	return itmList;
};


/**
 * radio값 ruleId별 셋팅
 */
Core.Diagram.Contextmenu.RadioCheck = function(ruleId) {
	
		var val = $("g[model-id='"+ruleId+"']").attr("data-rule-opt");
		
		$("input:radio[name=proType_"+ruleId+"]:input[value="+val+"]").attr("checked", true);
// console.log("Core.Diagram.Contextmenu.ColumnsCheck.d",d);
// console.log("Core.Diagram.Contextmenu.ColumnsCheck.ruleId",ruleId);
	
};  





Core.Diagram.Contextmenu.Modal = function( contents ) {
	var objModal		= Core.Modal.Background();
	var txtTitle		= contents.Title;
	var elButtonOk		= contents.ElButtonOk;
	var elContent		= contents.ElContent;
	var subTitle        = contents.subTitle;
	
	var elContainer		= $i( '<div/>'	,{ id : Options.Element.Contextmenu.Details.Id } );
	var elTitle			= $i( '<div/>'	,{ class : 'title' 	 } );
	var elSubTitle		= $i( '<div/>'	,{ class : 'subTitle' 	,text : subTitle } );
	var elButtonCancle	= $i( '<a/>'	,{ class : 'button' ,text : lang_return("fixa.core.title059") ,href : '#' }).on('click' ,function() { Core.Modal.Close(); return false; } ); // 닫기
	var elButtonBox		= $i( '<div/>'	,{ class : 'itmButton' }).append(elButtonCancle).append(elButtonOk);

	elTitle.append($("<div/>",{"class":"tab_btn_left"}));
	elTitle.append($("<a/>",{"text":txtTitle}));
	elTitle.append($("<div/>",{"class":"tab_btn_right"}));
	
	
	elContainer.append(elTitle).append(Core.tabbar4()).append(elSubTitle).append(elContent).append(elButtonBox);
	objModal.html(elContainer);
	Options.Element.Global.Inni.El().append(objModal);
};




Core.Diagram.Contextmenu.Modal2 = function( contents ) {
	var objModal		= Core.Modal.Background();
	var txtTitle		= contents.Title;
	var elButtonOk		= contents.ElButtonOk;
	var elContent		= contents.ElContent;
	var subTitle        = contents.subTitle;
	
	var elContainer		= $i( '<div/>'	,{ id : Options.Element.Contextmenu.Details2.Id } );
	var elTitle			= $i( '<div/>'	,{ class : 'title' 	 } );
	var elSubTitle		= $i( '<div/>'	,{ class : 'subTitle' 	,text : subTitle } );
	var elButtonCancle	= $i( '<a/>'	,{ class : 'button' ,text : lang_return("fixa.core.title059") ,href : '#' }).on('click' ,function() { Core.Modal.Close(); return false; } ); // 닫기
	var elButtonBox		= $i( '<div/>'	,{ class : 'itmButton' }).append(elButtonCancle).append(elButtonOk);

	elTitle.append($("<div/>",{"class":"tab_btn_left"}));
	elTitle.append($("<a/>",{"text":txtTitle}));
	elTitle.append($("<div/>",{"class":"tab_btn_right"}));
	
	
	elContainer.append(elTitle).append(Core.tabbar4()).append(elSubTitle).append(elContent).append(elButtonBox);
	objModal.html(elContainer);
	Options.Element.Global.Inni.El().append(objModal);
};


Core.Diagram.Contextmenu.ModalRule = function( d ,e ) {
	var elDiagram	= Options.Element.Diagram.Diagram.El();
	var ruleId		= elDiagram.attr('data-sel-id');

	var elButtonOk	= $i( '<a/>' ,{ class : 'button' ,text : lang_return("fixa.core.title066") ,href : '#' } ).on('click' ,function() { return Core.Diagram.Contextmenu.ModalRuleOk() }); // 설정하기
	var elTabLink1		= $i( '<a/>' ,{ href : '#' ,class : 'tab1 on' ,text : lang_return("fixa.core.title065") } ).on( 'click' ,function() { // 컬럼(Column)선택
			$i(this).parent().parent().parent().find('.on').removeClass('on').end().find('.tab').removeClass('off').addClass('off').end().find('.tab1').addClass('on');
			$i('#tab1').removeClass('off');
			return false;
		} ); 
	var elTabink2		= $i( '<a/>' ,{ href : '#' ,class : 'tab2' ,text : lang_return("fixa.core.title067") } ).on( 'click' ,function() { // 사용자
																																			// 설정
			$i(this).parent().parent().parent().find('.on').removeClass('on').end().find('.tab').removeClass('off').addClass('off').end().find('.tab2').addClass('on');
			$i('#tab2').removeClass('off');
			return false;
		} );
	var elTabLink3		= $i( '<a/>' ,{ href : '#' ,class : 'tab3' ,text : lang_return("fixa.core.title068") } ).on( 'click' ,function() {
			$i(this).parent().parent().parent().find('.on').removeClass('on').end().find('.tab').removeClass('off').addClass('off').end().find('.tab3').addClass('on');
			$i('#tab3').removeClass('off');
			Core.Output.DataList( 'Core.Output.DataListResponse' );
			return false;
		} );
	var elTabLi1		= $i( '<li/>'	,{ class : 'item' } ).html(elTabLink1);
	var elTabLi2		= $i( '<li/>'	,{ class : 'item' } ).html(elTabLink2);
	var elTabLi3		= $i( '<li/>'	,{ class : 'item' } ).html(elTabLink3);
	var elTab			= $i( '<ul/>'	,{ class : 'tabs' } ).append(elTabLi1).append(elTabLi2).append(elTabLi3);

	var elColumnList	= Core.Diagram.Contextmenu.ColumnsCheck( d ,ruleId ).addClass('tab').attr('id' ,'tab1');
	var elUseDefine		= Core.Diagram.Contextmenu.UseDefine( d ,ruleId ).addClass('off').addClass('tab').attr('id' ,'tab2');
	var elDataList		= $i('<div/>' ,{ class : 'tab dataList' ,id : 'tab3' }).addClass('off').addClass('tab').attr('id' ,'tab3');
	var elContent		= $i( '<div/>' ,{ class : 'content' } ).append(elTab).append(elColumnList).append(elUseDefine).append(elDataList);

	var Contents = {
		Title		: lang_return("fixa.core.title089")// '룰 설정'
	,	ElButtonOk	: elButtonOk
	,	ElContent	: elContent
	};
	Core.Diagram.Contextmenu.Modal(Contents);
};

Core.Diagram.Contextmenu.ModalFilter = function( d ,e ) {
	var elDiagram	= Options.Element.Diagram.Diagram.El();
	var ruleId		= elDiagram.attr('data-sel-id');

	var elButtonOk	= $i( '<a/>' ,{ class : 'button' ,text : lang_return("fixa.core.title026") ,href : '#' } ).on('click' ,function() { return Core.Diagram.Contextmenu.ModalRuleOk() });// 설정하기
	var elTabLink1		= $i( '<a/>' ,{ href : '#' ,class : 'tab1 on' ,text : lang_return("fixa.core.title066") } ).on( 'click' ,function() { // 컬럼(Column)선택
			$i(this).parent().parent().parent().find('.on').removeClass('on').end().find('.tab').removeClass('off').addClass('off').end().find('.tab1').addClass('on');
			$i('#tab1').removeClass('off');
			return false;
		} );
	var elTabLink2		= $i( '<a/>' ,{ href : '#' ,class : 'tab2' ,text : lang_return("fixa.core.title067") } ).on( 'click' ,function() { // 사용자
																																			// 설정
			$i(this).parent().parent().parent().find('.on').removeClass('on').end().find('.tab').removeClass('off').addClass('off').end().find('.tab2').addClass('on');
			$i('#tab2').removeClass('off');
			return false;
		} );
	var elTabLink3		= $i( '<a/>' ,{ href : '#' ,class : 'tab3' ,text : lang_return("fixa.core.title068") } ).on( 'click' ,function() { // 데이터목록
			$i(this).parent().parent().parent().find('.on').removeClass('on').end().find('.tab').removeClass('off').addClass('off').end().find('.tab3').addClass('on');
			$i('#tab3').removeClass('off');
			Core.Output.DataList( 'Core.Output.DataListResponse' );
			return false;
		} );
	var elTabLi1		= $i( '<li/>'	,{ class : 'item' } ).html(elTabLink1);
	var elTabLi2		= $i( '<li/>'	,{ class : 'item' } ).html(elTabLink2);
	var elTabLi3		= $i( '<li/>'	,{ class : 'item' } ).html(elTabLink3);
	var elTab			= $i( '<ul/>'	,{ class : 'tabs' } ).append(elTabLi1).append(elTabLi2).append(elTabLi3);

	var elColumnList	= Core.Diagram.Contextmenu.ColumnsCheck( d ,ruleId ).addClass('tab').attr('id' ,'tab1');
	var elUseDefine		= Core.Diagram.Contextmenu.UseDefine( d ,ruleId ).addClass('off').addClass('tab').attr('id' ,'tab2');
	var elDataList		= $i('<div/>' ,{ class : 'tab dataList' ,id : 'tab3' }).addClass('off').addClass('tab').attr('id' ,'tab3');
	var elContent		= $i( '<div/>' ,{ class : 'content' } ).append(elTab).append(elColumnList).append(elUseDefine).append(elDataList);

	var Contents = {
		Title		: lang_return("fixa.core.title069") // '필터 설정'
	,	ElButtonOk	: elButtonOk
	,	ElContent	: elContent
	};
	Core.Diagram.Contextmenu.Modal(Contents);
};

Core.Diagram.Contextmenu.ModalRscript = function( d ,e ) {
	
	var elButtonOk	= $i( '<a/>' ,{ class : 'button' ,text : lang_return("fixa.core.title026") ,href : '#' } ).on('click' ,function() { return Core.Diagram.Contextmenu.ModalRscriptOk(); });// 설정하기
	var elRSetting	= Core.Diagram.Contextmenu.Rsetting(d);
	var elContent	= $i( '<div/>' ,{ class : 'content' } ).append(elRSetting);
	var subMsg ;
	var ruleInfo	= Core.Diagram.RuleInfo();
	var ruleId		= ruleInfo.RuleId
	var ruleArr		= Options.Variable.Diagram.Global[ruleId].Rdata.split(',');
	var ruleType    = ruleArr[0];
	
	// 로지스틱 회권분석
	if(1 == ruleType){
		subMsg = lang_return("fixa.core.title208") ;
	// 군집클러스터
	}else if(2 == ruleType){
		subMsg = lang_return("fixa.core.title134");
	// 시계열 차트
	}else if(3 == ruleType){
		subMsg = lang_return("fixa.core.title135");
	}
	
	var Contents = {
		Title		: lang_return("fixa.core.title053") // '통계 설정'
	,   subTitle    : subMsg
	,	ElButtonOk	: elButtonOk
	,	ElContent	: elContent
	};
	Core.Diagram.Contextmenu.Modal2(Contents);
};

Core.Diagram.Contextmenu.ModalTimeChart = function( d ,e ) {
	var elButtonOk	= $i( '<a/>' ,{ class : 'button' ,text :lang_return("fixa.core.title026") ,href : '#' } ).on('click' ,function() { return Core.Diagram.Contextmenu.ModalTimeChartOk(); }); // 설정하기
	var elSetting	= Core.Diagram.Contextmenu.TimeChart(d);
	var elContent	= $i( '<div/>' ,{ class : 'content' } ).append(elSetting);
	var Contents = {
		Title		: lang_return("fixa.core.title070")// '시계열 차트 설정'
	,	ElButtonOk	: elButtonOk
	,	ElContent	: elContent
	};
	Core.Diagram.Contextmenu.Modal(Contents);
};

Core.Diagram.Contextmenu.ModalRuleOk = function() {
	Core.Diagram.Contextmenu.Settings();
	return false;
};

Core.Diagram.Contextmenu.ModalFilterOk = function() {
	Core.Diagram.Contextmenu.Settings();
	return false;
};

Core.Diagram.Contextmenu.ModalRscriptOk = function() {
	Core.Diagram.Contextmenu.SettingR();
	return false;
};

Core.Diagram.Contextmenu.ModalTimeChartOk = function() {
	Core.Diagram.Contextmenu.SettingTimeChart();
	return false;
};

Core.Diagram.Contextmenu.Settings = function() {
	var ruleInfo	= Core.Diagram.RuleInfo();
	var ruleId		= ruleInfo.RuleId;
	var ruleSn		= ruleInfo.RuleSn;
	var ruleType	= ruleInfo.RuleType;
	var checkColumn	= [];
	var columnName	= '';
	$i('input:checkbox[name=TABLE_HEADER]').each(function(k,v){
		if( $i(this).is(':checked') ){
			checkColumn.push( { RuleGb : ruleType ,RuleSn : ruleSn ,ColumnHeader : $i(this).val() } );
			columnName += $i(this).val() + ',';
		};
	});
	columnName = columnName.substring(0 ,columnName.length-1);
	Options.Variable.Diagram.Global[ruleId].Column = columnName;
	var useDefineValue = Options.Element.Contextmenu.QueryTextarea.El().val();
	Options.Variable.Diagram.Global[ruleId].UseDefineQuery = useDefineValue;
	Core.Modal.Close();
	Core.Console.Write( { Type : 'Info' ,KeyCode : 'Mssg1501' ,Message : ' (' + columnName + ')' } );
};
Core.Diagram.Contextmenu.Settings2 = function(rulId) {
	var ruleInfo	= Core.Diagram.RuleInfo();
	var ruleId		= rulId;
	var ruleSn		= ruleInfo.RuleSn;
	var ruleType	= ruleInfo.RuleType;
	var checkColumn	= [];
	var columnName	= '';
	$i('input:checkbox[name=TABLE_HEADER]').each(function(k,v){
		if( $i(this).is(':checked') ){
			checkColumn.push( { RuleGb : ruleType ,RuleSn : ruleSn ,ColumnHeader : $i(this).val() } );
			columnName += $i(this).val() + ',';
		};
	});
	columnName = columnName.substring(0 ,columnName.length-1);
	Options.Variable.Diagram.Global[ruleId].Column = columnName;
	var useDefineValue = Options.Element.Contextmenu.QueryTextarea.El().val();
	Options.Variable.Diagram.Global[ruleId].UseDefineQuery = useDefineValue;
	Core.Modal.Close();
	Core.Console.Write( { Type : 'Info' ,KeyCode : 'Mssg1501' ,Message : ' (' + columnName + ')' } );
};



Core.Diagram.Contextmenu.TimeChart = function( d ,ruleId ) {
	var ruleInfo			= Core.Diagram.RuleInfo();
	var ruleId				= ruleInfo.RuleId
	var ruleSn				= ruleInfo.RuleSn;
	var ruleType			= ruleInfo.RuleType;
	var TABLE_HEADER		= d.TABLE_HEADER;
	var TABLE_HEADER_KEY	= d.TABLE_HEADER_KEY;
	var TABLE_HEADER_NAME	= TABLE_HEADER.split(',');
	var TABLE_HEADER_KEY	= TABLE_HEADER_KEY.split(',');
	var elUl				= $i('<div/>');

	for (let fx1=0; fx1<2; ++fx1 ) {
		var clsWidth	= 'width:calc(' + parseInt(100 / 2) + '% - 15px)';
		var elColumn	= $i( '<ul/>' 	,{ class : 'selectList selectListColumn standard' ,style : clsWidth } );
		for( var fx=0; fx<TABLE_HEADER_KEY.length; ++fx ) {
			let cls = (fx==0) ? ' select' : '';
			if (''!=Options.Variable.Diagram.Global[ruleId].TimeChart) {
				var TimeChartArr		= Options.Variable.Diagram.Global[ruleId].TimeChart.split(',');
				cls = ( TimeChartArr[fx1] == TABLE_HEADER_KEY[fx] ) ? ' select' : '';
			};
			var li = $i('<li/>');
			var ln = $i('<a/>' ,{
				class		: 'item' + cls
			,	text		: TABLE_HEADER_NAME[fx]
			,	'data-value': TABLE_HEADER_KEY[fx]
			,	href		: '#'
			}).on('click' ,function(e) {
				$i(this).parent().parent().find('.select').removeClass('select').end().end().end().addClass('select');
				return false;
			});
			li.append(ln);
			elColumn.append(li);
		};
		elUl.append(elColumn);
	};

	let result		= $i( '<div/>' ,{ class : 'timeChart' } ).append(elUl);
	return result;
};


// 숫자 체크
function numberCheck(x ){
	try{
		// ture -> 숫자가 아님
		if(isNaN(x)){
			numCheck = true;
		}else{
			// null일 경우
			
			if(x==null || x.toString() == "" || x==undefined){
				numCheck = null;
			}else{
				
				numCheck = false;
			}
		}	
		
	}catch(e){
			numCheck= true;
	}
		
	return numCheck;
	
		
}
// null 체크
function nullCheck(x){
	var dayRegExp  = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/; 
	var reRegExp = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;
	try{
		if(x==null || x == "" ){
			nullChk= null;
		}else{
			// date type
			if(!dayRegExp.test(x) && !reRegExp.test(x)){
				nullChk = true;
			}else{
				
				nullChk = false;
			}
		}
	}catch(e){
			nullChk= true;
	}
	
	return nullChk;	
	
}


Core.Diagram.Contextmenu.SettingR = function() {
	var ruleInfo	= Core.Diagram.RuleInfo();
	var elModal		= Options.Element.Contextmenu.Modal.El();
	/*
	 * var rtype = elModal.find('.rType .select').attr('data-value'); var
	 * standard = elModal.find('.standard .select').attr('data-value'); var
	 * target = elModal.find('.target .select').attr('data-value');
	 */
	var rParam = "";
	var rType = "";
	elModal.find('.selectList .select').each(function(){
		rParam += $(this).attr("data-value") + ",";
		rType += $(this).attr("headType") + ",";
	});
	rParam = rParam.substr(0,rParam.length-1);
	rType = rType.substr(0,rType.length-1);
	
	var rParamSp = rParam.split(',');
	var rTypeSp = rType.split(',');
	
	
	console.log("Core.Diagram.Contextmenu.SettingR");
	
	Options.Variable.Diagram.Global[ruleInfo.RuleId].Rdata = rParam;
	
	
	
	for(i=0;i<Options.statistics.length;i++)
	{
		 if(Options.statistics[i].param == rParamSp[0]){
			 
			 // 컬럼 선택이 x
			 if(Options.statistics[i].count != rParamSp.length-1){
				 alert_message(lang_return("fixa.core.title181"))
				 return;
			 }
			 
			
		 }
	}
	
	// R 설정하기 run
	Core.Diagram.run("workflow","",function(data){
		
		if(data.length>0)
		{
			var arr ;
			for(var i= 0 ; i < data.length; i++){
				if(undefined == data[i].result.cleanData || "" == data[i].result.cleanData){
			    	arr = data[i-1].result.cleanData;
			    	break;
				}
			}
			
			var message = [];
			var arrCnt = [];
			var arrFinal = [];
			for(var i=1 ; i<rParamSp.length ; i++){
				var count =0;
				var newArr = arr.filter(function(item){
					++count;
					
					
					
					if(rTypeSp[i] == "label"){
						
						
						
						arrCnt.push(item[rParamSp[i]]);
					
					}else if(rTypeSp[i] == "number"){
						
						 
						 if(numberCheck(item[rParamSp[i]]) == true){
							 
							 Options.Variable.Diagram.Global[ruleInfo.RuleId].Rdata="";
							 message.push(lang_return("fixa.core.title175")+" : "+rParamSp[i]+" // "+count +lang_return("fixa.core.title183"));
						 }else if(numberCheck(item[rParamSp[i]]) == null){
							 
							 Options.Variable.Diagram.Global[ruleInfo.RuleId].Rdata="";
							 message.push(lang_return("fixa.core.title175")+" : "+rParamSp[i]+" // "+count +lang_return("fixa.core.title182"));
						 }
						
					}else if(rTypeSp[i] == "date"){
						
						if(nullCheck(item[rParamSp[i]]) == null){
							 Options.Variable.Diagram.Global[ruleInfo.RuleId].Rdata="";
							 message.push(lang_return("fixa.core.title175")+" : "+rParamSp[i]+" // "+count +lang_return("fixa.core.title182"));
						}else if(nullCheck(item[rParamSp[i]]) == true){
							 Options.Variable.Diagram.Global[ruleInfo.RuleId].Rdata="";
							 message.push(lang_return("fixa.core.title175")+" : "+rParamSp[i]+" // "+count +lang_return("fixa.core.title184"));
						}
						
						arrCnt.push(item[rParamSp[i]]);
						
					}else{
						console.log("else", item[rParamSp[i]]);
					}
				
				});
			}
			
			if(arrCnt.length > 0){
				$.each(arrCnt,function(i,value){
				    if(arrFinal.indexOf(value) == -1 ) arrFinal.push(value);
				});
				
				// 시계열 차트
				if(rParamSp[0] == 3){
					
					if(arrFinal.length  <= 11)
						alert_message("DATE의 데이터가 12개 이상은 있어야 합니다. 조건을 다시 설정해 주시기 바랍니다. ");
				
				// 로지스틱
				}else{
					
					if(arrFinal.length < 2)
						alert_message("라벨의 개수가 1개 입니다. 조건을 다시 설정해 주시기 바랍니다.");
					
					
				}
				
				

				
			}
			
			if(message.length >0 ){
				alert_message(message);
			}

		}
		
	});

	Core.Console.Write( { Type : 'Info' ,KeyCode : 'Mssg1902' ,Message : '' } );
};

Core.Diagram.Contextmenu.SettingTimeChart = function() {
	var ruleInfo	= Core.Diagram.RuleInfo();
	var elModal		= Options.Element.Contextmenu.Modal.El();
	var rParam = "";
	elModal.find('.selectList .select').each(function(){
		rParam += $(this).attr("data-value") + ",";
	});
	rParam = rParam.substr(0 ,rParam.length-1);
	
	Options.Variable.Diagram.Global[ruleInfo.RuleId].TimeChart = rParam;
	Options.Variable.Global['TimeChart'] = rParam;

	Core.Modal.Close();
	Core.Console.Write( { Type : 'Info' ,KeyCode : 'Mssg1902' ,Message : '' } );
};















Core.Diagram.Contextmenu.UseDefine = function( d ,ruleId ) {
	var global				= Options.Variable.Diagram.Global[ruleId].UseDefineQuery;
	var TABLE_HEADER_NAME	= (d.TABLE_HEADER).split(',');
	var TABLE_HEADER_KEY	= (d.TABLE_HEADER_KEY).split(',');
	
// var TABLE_HEADER_KEY = columns;
// var TABLE_HEADER_NAME = columns;
	
	

	var elColumn			= $i( '<ul/>' 	,{ class : 'selectList' } );
	for( var fx=0; fx<TABLE_HEADER_KEY.length; ++fx ) {
		var li = $i('<li/>');
		var ln = $i('<a/>' ,{
			class		: 'item'
		,	text		: TABLE_HEADER_NAME[fx]
		,	'data-value': TABLE_HEADER_KEY[fx]
		,	href		: '#'
		}).on('click' ,function(e) {
			$i(this).parent().parent().find('.select').removeClass('select').end().end().end().addClass('select');
			return false;
		});
		li.append(ln);
		elColumn.append(li);
	};
	var elPrerequisite	= $i( '<ul/>' ,{ class : 'prerequisite' } );
	var prerequisite	= ['=','!=','>','>=','<','<=','like','fn'];
	for( var fx=0; fx<prerequisite.length; ++fx ) {
		var li = $i('<li/>');
		var ln = $i('<a/>' ,{
			class		: 'item'
		,	text		: prerequisite[fx]
		,	'data-value': prerequisite[fx]
		,	href		: '#'
		}).on('click' ,function(e) {
			var elThis = $i(this);
			var elText = ($i.StrBlankDel(elThis.text())).toLowerCase();
			elThis.parent().parent().find('.select').removeClass('select').end().end().end().addClass('select');
			$i('.prerequisiteTarget').removeClass('sel');
			if ( 'fn' == elText ) {
				$i('.functionList').addClass('sel');
			} else {
				$i('.useInput').addClass('sel');
			};
			return false;
		});
		li.append(ln);
		elPrerequisite.append(li);
	};
	var elInput				= $i( '<input/>'	,{ class : 'useValue' ,name : 'useValue' ,type : 'text' } );
	var elInputBx			= $i( '<div/>'		,{ class : 'prerequisiteTarget useInput sel' } ).append(elInput);
	var elFunctionLink		= $i( '<a/>'		,{ href  : '#' ,text : '5자리 숫자 형태로 치환' } );
	var elFunctionLi		= $i( '<li/>'		,{ class : 'item' } ).append(elFunctionLink);
	var elFunctionBx		= $i( '<ul/>'		,{ class : 'prerequisiteTarget functionList' } ).append(elFunctionLi);
	var elButtonReset		= $i( '<a/>'		,{ class : 'reset'	,href : '#' ,text : lang_return("fixa.core.title072") } ).on('click' ,function(){ Core.Diagram.Contextmenu.UseDefineReset(); });
	var elButtonOk			= $i( '<a/>'		,{ class : 'ok'		,href : '#' ,text : lang_return("fixa.core.title073") } ).on('click' ,function(){ Core.Diagram.Contextmenu.UseDefineOk(); });
	var elButton			= $i( '<div/>'		,{ class : 'btn' } ).append(elButtonReset).append(elButtonOk);
	var elForm				= $i( '<div/>'		,{ class : 'form' } ).append(elInputBx).append(elFunctionBx).append(elButton);
	var elQueryTextarea		= $i( '<textarea/>' ,{ id : Options.Element.Contextmenu.QueryTextarea.Id } );
	var elQueryTextareaBox	= $i( '<div/>'		,{ class : 'textareaBox' } ).append(elQueryTextarea);
	var elQueryWhere		= $i( '<div/>'		,{ class : 'lock' ,text : 'WHERE' });
	var elQuery				= $i( '<div/>'		,{ class : 'query' } ).html(elQueryWhere);

	return ( $i( '<div/>' ,{ class : 'useDefine' } ).append(elColumn).append(elPrerequisite).append(elForm).append(elQueryTextareaBox).append(elQuery) );
};

Core.Diagram.Contextmenu.UseDefineReset = function() {
	var modal = Options.Element.Contextmenu.Modal.El();
	modal.find('.select').removeClass('select');
	modal.find('input[name="useValue"]').val('');
	modal.find('#useDefineValue').val('');
	modal.find('.query .queryList').remove();
};

Core.Diagram.Contextmenu.UseDefineOk = function() {
	var modal			= Options.Element.Contextmenu.Modal.El();
	var columnSelect	= modal.find('.selectList .select');
	var column			= columnSelect.attr('data-value');
	var columnText		= columnSelect.text();
	var prerequisite	= modal.find('.prerequisite .select').attr('data-value');
	var useValue		= modal.find('input[name="useValue"]').val();
	var func			= modal.find('.functionList .select').attr('data-value');
	var tmpQuery1='' ,tmpQuery2='';
	if ( 'fn'==prerequisite.toLowerCase() ) {
		
	} else if ( 'like'==prerequisite.toLowerCase() ) {
		var value = ' like ' + '\'%' + useValue + '%\'';
		tmpQuery1 += column		+ value;
		tmpQuery2 += columnText	+ value;
	} else {
		var qt = ( 'name0'==column.toLowerCase() ) ? '' : '\'';
		tmpQuery1 += column				+ prerequisite			+ qt + useValue + qt;
		tmpQuery2 += columnText	+ ' '	+ prerequisite + ' '	+ qt + useValue + qt;
	};
	tmpQuery1 = ' AND ' + tmpQuery1;
	tmpQuery2 = 'AND &nbsp;&nbsp;' + tmpQuery2;
	var tmpMaxLength	= modal.find('.query .queryList').length;
	var tmpQueryBox		= $i( '<div/>' ,{ class : ('queryList ' + 'query' + tmpMaxLength ) ,html : tmpQuery2 } );
	modal.find('.query').append(tmpQueryBox);
	var tmpTextareaVal	= Options.Element.Contextmenu.QueryTextarea.El().val();
	Options.Element.Contextmenu.QueryTextarea.El().val(tmpTextareaVal + tmpQuery1);
};

/**
 * 통계보기 화면 구성
 */
Core.Diagram.Contextmenu.Rsetting = function( d ) {
	
	
	var ruleInfo	= Core.Diagram.RuleInfo();
	var ruleId		= ruleInfo.RuleId
	var ruleSn		= ruleInfo.RuleSn;
	var ruleType	= ruleInfo.RuleType;
	var ruleArr		= Options.Variable.Diagram.Global[ruleId].Rdata.split(',');
	var ruleType    = ruleArr[0];
	var rType;
	
	// 로지스틱 회권분석
	if(1 == ruleType){
		$(".subTitle").text(lang_return("fixa.core.title208"));
	// 군집클러스터
	}else if(2 == ruleType){
		$(".subTitle").text(lang_return("fixa.core.title134"));
	// 시계열 차트
	}else if(3 == ruleType || 4== ruleType){
		$(".subTitle").text(lang_return("fixa.core.title135"));
	}
	
	

	
	/* R Model을 DB로 관리하게 한뒤 Data를 통하여 적용 되도록 해야함. */
	const testText		= [lang_return("fixa.core.title074")
							,lang_return("fixa.core.title075")
							,lang_return("fixa.core.title055")
							/**,'time series by prophet'**/
							]// ['로지스틱
																																	// 회귀분석'
																																	// ,'군집클러스터',
																																	// '시계열차트'];
	
	console.log(testText);
	
	const testValue		= ['1' ,'2','3','4'];
	const testCountArr	= [ 3   ,3  ,2,2];
	let testCount = testCountArr[0];
	if ( ''!=Options.Variable.Diagram.Global[ruleId].Rdata ) {
		testCount = ('3' ==ruleType || '4' ==ruleType) ? 2 : 3;
	};
	let clsWidth		= 'width:calc(' + parseInt(100 / (testCount+1)) + '% - 15px)';
	let elRType			= $i( '<ul/>'	,{ class : 'selectList rType' ,style : clsWidth } );

	for ( var fx=0; fx<testText.length; ++fx ) {
		let cls = (fx==0) ? 'select' : '';
		if (''!=Options.Variable.Diagram.Global[ruleId].Rdata) {
			cls = (testValue[fx] == ruleType ) ? 'select' : '';
		};

		let elRtypeLi	= $i( '<li/>'	,{ class : 'item' } );
		var elRtypeLink	= $i( '<a/>'	,{ href : '#' ,text : testText[fx] ,class : cls ,'data-count' : testCountArr[fx] ,'data-value' : testValue[fx]} ).on('click' ,function(e) {
			let evtObj		= $(this);
			let count		= parseInt(evtObj.attr('data-count'));
			let clsWidth	= 'calc(' + parseInt(100 / (count+1)) + '% - 15px)';
			
			var rType = evtObj.attr("data-value");
			evtObj.parent().parent().parent().find('.selectListColumn').remove().end().end().css({width : clsWidth}).find('.select').removeClass('select').end().end().end().addClass('select');
			
			
			// 로지스틱 회권분석
			if("1" == rType){
				$(".subTitle").text(lang_return("fixa.core.title208"));
			// 군집클러스터
			}else if("2" == rType){
				$(".subTitle").text(lang_return("fixa.core.title134"));
			// 시계열 차트
			}else if("3" == rType || "4" == rType ){
				$(".subTitle").text(lang_return("fixa.core.title135"));
			}
			
			
			
			// 컬럼 갯수 별 데이터
			for ( let fx=0; fx<count; ++fx ) {
				var elColumn	= Core.Diagram.Contextmenu.RsettingColumn(count ,'' ,d.TABLE_HEADER ,d.TABLE_HEADER_KEY,rType, fx);
				evtObj.parent().parent().parent().append(elColumn);
			};
			return false;
		});
		elRtypeLi.append(elRtypeLink);
		elRType.append(elRtypeLi);
	};

	let result		= $i( '<div/>' ,{ class : 'rSetting' } ).append(elRType);
	for ( let fx=0; fx<testCount; ++fx ) { 
		if(ruleType == ""){
			rType = testValue[0];
		}else{
			rType = ruleType;
		}
		var rdata		= ruleArr[fx+1];
		var elColumn	= Core.Diagram.Contextmenu.RsettingColumn(testCount ,rdata ,d.TABLE_HEADER ,d.TABLE_HEADER_KEY, rType , fx);
		result.append(elColumn);
	};
	

	return result;
};

Core.Diagram.Contextmenu.RsettingColumn = function(count ,rdata ,TABLE_HEADER ,TABLE_HEADER_KEY , rType , fxCount) {
	var TABLE_HEADER_NAME	= TABLE_HEADER.split(',');
	var TABLE_HEADER_KEY	= TABLE_HEADER_KEY.split(',');
	var clsWidth			= 'width:calc(' + parseInt(100 / (count+1)) + '% - 15px)';
	var elColumn			= $i( '<ul/>' 	,{ class : 'selectList selectListColumn standard' ,style : clsWidth } );
	
	var final_data = [];
	var numCheck = false;
	var labelCheck = false;
	var dateCheck = false;
	var data = Options.Variable.slickGrid.headerOption["prepGrid"];
	
	// 데이터 타입 중복 제거
	$.each(data,function(i,value){
	    if(final_data.indexOf(value.data_type) == -1 ) final_data.push(value.data_type);
	});
	
	$.each(final_data,function(i,value){
		if("number" == value){
			numCheck = true;
		}else if("label" == value){
			labelCheck = true;
		}else if("date" == value){
			dateCheck =true;
		}
	});
	

	
	for( var fx=0; fx<TABLE_HEADER_KEY.length; ++fx ) {
		
		var dataType = Options.Variable.slickGrid.headerOption["prepGrid"][fx].data_type;
	
		// 로지스틱 회권분석
		if("1" == rType){
			if(fxCount == 0 &&  labelCheck == false){
				var li = $i('<li/>');
				var ln = $i('<a/>' ,{
					text		: lang_return("fixa.core.title185")
				,   style       : "color : red;"
				}).on('click' ,function(e) {
					alert_message(lang_return("fixa.core.title186"));
				});
				li.append(ln);
				elColumn.append(li);
				break;
			
			}else if(fxCount == 1 &&numCheck == false || fxCount == 2 &&numCheck == false){
				var li = $i('<li/>');
				var ln = $i('<a/>' ,{
					text		: lang_return("fixa.core.title185")
				,   style       : "color : red;"
				}).on('click' ,function(e) {
					alert_message(lang_return("fixa.core.title187"));
				});
				li.append(ln);
				elColumn.append(li);
				break;
				
			}else{
				
				if(fxCount == 0 && dataType == "label"){
					// 라벨인 type
						var cls = (rdata==Options.Variable.slickGrid.header["prepGrid"][fx]) ? ' select' : '';
						var li = $i('<li/>');
						var ln = $i('<a/>' ,{
							class		: 'item' + cls
						,	text		: Options.Variable.slickGrid.header["prepGrid"][fx]
						,	'data-value': Options.Variable.slickGrid.header["prepGrid"][fx]
						,	href		: '#'
						,   'rType'     : rType
						,   'headType'  : Options.Variable.slickGrid.headerOption["prepGrid"][[fx]].data_type
						}).on('click' ,function(e) {
							$i(this).parent().parent().find('.select').removeClass('select').end().end().end().addClass('select');
							return false;
						});
						li.append(ln);
						elColumn.append(li);
				
				}else if(fxCount == 1 && dataType == "number" ||fxCount == 2 && dataType == "number"){
					var cls = (rdata==Options.Variable.slickGrid.header["prepGrid"][fx]) ? ' select' : '';
					var li = $i('<li/>');
					var ln = $i('<a/>' ,{
						class		: 'item' + cls
					,	text		: Options.Variable.slickGrid.header["prepGrid"][fx]
					,	'data-value': Options.Variable.slickGrid.header["prepGrid"][fx]
					,	href		: '#'
					,   'rType'     : rType
					,   'headType'  : Options.Variable.slickGrid.headerOption["prepGrid"][[fx]].data_type
					}).on('click' ,function(e) {
						$i(this).parent().parent().find('.select').removeClass('select').end().end().end().addClass('select');
						return false;
					});
					li.append(ln);
					elColumn.append(li);
				}
				
			}
			
			
		// 군집클러스터
		}else if("2" == rType){
			if(numCheck == false){
				var li = $i('<li/>');
				var ln = $i('<a/>' ,{
					text		: lang_return("fixa.core.title185")
				,   style       : "color : red;"
				}).on('click' ,function(e) {
					alert_message(lang_return("fixa.core.title187"));
				});
				li.append(ln);
				elColumn.append(li);
				break;
				
			}else{
				if(dataType == "number"){
					var cls = (rdata==Options.Variable.slickGrid.header["prepGrid"][fx]) ? ' select' : '';
					var li = $i('<li/>');
					var ln = $i('<a/>' ,{
						class		: 'item' + cls
					,	text		: Options.Variable.slickGrid.header["prepGrid"][fx]
					,	'data-value': Options.Variable.slickGrid.header["prepGrid"][fx]
					,	href		: '#'
					,   'rType'     : rType
					,   'headType'  : Options.Variable.slickGrid.headerOption["prepGrid"][[fx]].data_type
					}).on('click' ,function(e) {
						$i(this).parent().parent().find('.select').removeClass('select').end().end().end().addClass('select');
						return false;
					});
					li.append(ln);
					elColumn.append(li);
				}
			}
		// 시계열 차트
		}else if("3" == rType || "4" == rType){
			if(fxCount == 0 &&  dateCheck == false){
				var li = $i('<li/>');
				var ln = $i('<a/>' ,{
					text		: lang_return("fixa.core.title185")
				,   style       : "color : red;"
				}).on('click' ,function(e) {
					alert_message(lang_return("fixa.core.title188"));
				});
				li.append(ln);
				elColumn.append(li);
				break;
			
			}else if(fxCount == 1 &&numCheck == false){
				var li = $i('<li/>');
				var ln = $i('<a/>' ,{
					text		: lang_return("fixa.core.title185")
				,   style       : "color : red;"
				}).on('click' ,function(e) {
					alert_message(lang_return("fixa.core.title187"));
				});
				li.append(ln);
				elColumn.append(li);
				break;
				
			}else{
				if(dataType == "date" && fxCount == 0 ){
					var cls = (rdata==Options.Variable.slickGrid.header["prepGrid"][fx]) ? ' select' : '';
					var li = $i('<li/>');
					var ln = $i('<a/>' ,{
						class		: 'item' + cls
					,	text		: Options.Variable.slickGrid.header["prepGrid"][fx]
					,	'data-value': Options.Variable.slickGrid.header["prepGrid"][fx]
					,	href		: '#'
					,   'rType'     : rType
					,   'headType'  : Options.Variable.slickGrid.headerOption["prepGrid"][[fx]].data_type
					}).on('click' ,function(e) {
						$i(this).parent().parent().find('.select').removeClass('select').end().end().end().addClass('select');
						return false;
					});
					li.append(ln);
					elColumn.append(li);
				}else if(dataType == "number" && fxCount == 1 ){
					var cls = (rdata==Options.Variable.slickGrid.header["prepGrid"][fx]) ? ' select' : '';
					var li = $i('<li/>');
					var ln = $i('<a/>' ,{
						class		: 'item' + cls
					,	text		: Options.Variable.slickGrid.header["prepGrid"][fx]
					,	'data-value': Options.Variable.slickGrid.header["prepGrid"][fx]
					,	href		: '#'
					,   'rType'     : rType
					,   'headType'  : Options.Variable.slickGrid.headerOption["prepGrid"][[fx]].data_type
					}).on('click' ,function(e) {
						$i(this).parent().parent().find('.select').removeClass('select').end().end().end().addClass('select');
						return false;
					});
					li.append(ln);
					elColumn.append(li);
					
				}
			}
			
		}
		
	};
	return elColumn;
};


Core.Diagram.Prev = function(){
	
//	var liMaxlength = $("#itmHistoryDiagram li").find('a.item.u').length;
	var liMaxlength = $("#itmHistoryDiagram li").find('a.item').length;
	// 뒤로가기 처리
	
	if(liMaxlength == 1){
		$("#itmHistoryDiagram li").find('a.item.a#'+0+'').addClass('now');
		$("#itmHistoryDiagram li").find('a.item.u#'+0+'').removeClass('now');
		$("#itmHistoryDiagram li").find('a.item.a#'+0+'').click();
	}else{
		var recent_id = $("#itmHistoryDiagram li").find('a.item.u.now').attr('id');
		if(recent_id >= 1){
			var prev_id =  parseInt($("#itmHistoryDiagram li").find('a.item.u.now').attr('id'))-1;
			// 이전아이디값으로 클래스 변경(now)선택값 변경
			$("#itmHistoryDiagram li").find('a.item.u#'+prev_id+'').addClass('now');
//			$("#itmHistoryDiagram li a.item.u #"+prev_id).addClass('now');
			// 현재 li 클래스 변경 now값 제거
			$("#itmHistoryDiagram li").find('a.item.u#'+recent_id+'').removeClass('now');
//			$("#itmHistoryDiagram li a.item.u #"+recent_id).removeClass('now');
			
			$("#itmHistoryDiagram li").find('a.item.u#'+prev_id+'').click();
		}else{
			$("#itmHistoryDiagram li").find('a.item.a#'+0+'').addClass('now');
			$("#itmHistoryDiagram li").find('a.item.u#'+0+'').removeClass('now');
			$("#itmHistoryDiagram li").find('a.item.a#'+0+'').click();
		}
	}
	Core.Diagram.Contextmenu.CloseSidebar();
	
};


Core.Diagram.Next = function(){
	var liMaxlength = $("#itmHistoryDiagram li").find('a.item.u').length;
	// 뒤로가기 처리
	
	var recent_id = $("#itmHistoryDiagram li").find('a.item.u.now').attr('id');
	if(recent_id ==undefined){
		$("#itmHistoryDiagram li").find('a.item.u#'+0+'').addClass('now');
		$("#itmHistoryDiagram li").find('a.item.a#'+0+'').removeClass('now');
		$("#itmHistoryDiagram li").find('a.item.u#'+0+'').click();
	}else{
		if(recent_id == liMaxlength-1){
			return false;
		}else{
			var prev_id =  parseInt($("#itmHistoryDiagram li").find('a.item.u.now').attr('id'))+1;
			// 이전아이디값으로 클래스 변경(now)선택값 변경
			$("#itmHistoryDiagram li").find('a.item.u#'+prev_id+'').addClass('now');
			// 현재 li 클래스 변경 now값 제거
			$("#itmHistoryDiagram li").find('a.item.u#'+recent_id+'').removeClass('now');
			
			$("#itmHistoryDiagram li").find('a.item.u#'+prev_id+'').click();
		}
	}
	Core.Diagram.Contextmenu.CloseSidebar();
};

















Core.Diagram.Contextmenu.Chart = function( d ) {
// var svg = $i( '<svg/>' ,{ id : 'rChart' } ).attr('width'
// ,'700').attr('height' ,'400');
	var con = $i( '<div/>' ,{ id : 'rChart' ,class : 'chart' } );
	return con;
};
























Core.Diagram.Contextmenu.Remove = function( cellView ,evt ,x ,y ,elTarget ) {
	Options.Element.Diagram.Contextmenu.El().remove();
};

Core.Diagram.Contextmenu.ColumnChecked = function( ruleId ,String ) {
	
	var column		= (Options.Variable.Diagram.Global[ruleId].Column).split(String);
	
	var temp = Options.Variable.Diagram.Global[ruleId].Column.split(",");
	
	result = false;
	for(i=0;i<temp.length;i++)
	{
		if(temp[i]==String)
		{
			result =  true;
			break;
		}
	}
	
	
	/**
	 * result = ( (column.length>1) ? true : false ); if(result==true) {
	 * console.log("ruleId",ruleId); console.log("String",String);
	 *  }
	 */
	

	
	return result;
};

Core.Diagram.Contextmenu.Column = function(){
	var options = {
		url		: Options.Uri.Ajax.Process.ColumnList
	,	success	: function( d ,e ) {
			Core.Diagram.Contextmenu.ColumnResponse( d ,e );
		}
	};$i.Ajax(options);
};

Core.Diagram.Contextmenu.ColumnResponse = function( d ,e ) {
	
	
	
	var elDiagram			= Options.Element.Diagram.Diagram.El();
	var ruleId				= elDiagram.attr('data-sel-id');
	var ruleSn				= elDiagram.attr('data-sel-rule');
	var ruleType			= elDiagram.attr('data-sel-type');
	var TABLE_HEADER_NAME	= (d.TABLE_HEADER).split(',');
	var TABLE_HEADER_KEY	= (d.TABLE_HEADER_KEY).split(',');
	var objModal			= Core.Modal.Background();
	var elContainer			= $i( '<div/>'	,{ id		: Options.Element.Contextmenu.Column.Id		} );
	var elTitle				= $i( '<div/>'	,{ class	: 'title' ,text : lang_return("fixa.core.title076")				} );// '규칙적용
																															// 컬럼선택'
	var elContent			= $i( '<div/>'	,{ class	: 'content'									} );
	var itmList				= $i( '<ul/>'	,{ class	: 'list'									} );
	var elButtonOk			= $i( '<a/>'	,{ class	: 'button' ,text :  lang_return("fixa.core.title077") ,href : '#'	} )// '선택
																																// 컬럼
																																// 적용'
	.on('click' ,function() {
		var checkColumn	= [];
		var columnName	= '';
		$i('input:checkbox[name=TABLE_HEADER]').each(function(k,v){
			if( $i(this).is(':checked') ){
				checkColumn.push( { RuleGb : ruleType ,RuleSn : ruleSn ,ColumnHeader : $i(this).val() } );
				columnName += $i(this).val() + ',';
			};
		});
		columnName = columnName.substring(0 ,columnName.length-1);
		Options.Variable.Diagram.Global[ruleId].Column = columnName;

		Core.Console.Write( { Type : 'Info' ,KeyCode : 'Mssg1501' ,Message : ' (' + columnName + ')' } );
		Core.Modal.Close();
	});


	var elButtonCancle	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title006")
	,	href	: '#'
	}).on('click' ,function() {
		Core.Modal.Close();
		return false;
	} );
	var elButtonBox	= $i('<div/>' ,{
		class	: 'itmButton'
	}).append(elButtonCancle).append(elButtonOk);

	for ( var fx=0; fx<TABLE_HEADER_KEY.length; ++fx ) {
		var headerKey	= TABLE_HEADER_KEY[fx];
		var headerName	= TABLE_HEADER_NAME[fx];
		var checked		= Core.Diagram.Contextmenu.ColumnChecked( ruleId ,headerKey );
		var input		= $i('<input/>' ,{
			id		: ('TABLE_HEADER' + fx)
		,	name	: 'TABLE_HEADER'
		,	type	: 'checkbox'
		,	value	: headerKey
		,	checked	: checked
		});
		var label		= $i('<label/>' ,{
			'for'	: ('TABLE_HEADER' + fx)
		,	text	: headerName
		});
		var li			= $i('<li/>').append(input).append(label);
		itmList.append(li);
	};

	elContent.html(itmList);
	elContainer.append(elTitle).append(elContent).append(elButtonBox);
	objModal.html(elContainer);
	Options.Element.Global.Inni.El().append(objModal);
};

Core.Diagram.Contextmenu.Setting = function() {
	var options = {
		url		: Options.Uri.Ajax.Process.ColumnList
	,	success	: function( d ,e ) {
			Core.Diagram.Contextmenu.SettingResponse( d ,e );
		}
	};$i.Ajax(options);
};

Core.Diagram.Contextmenu.SettingResponse = function( d ,e ) {
	var elDiagram	= Options.Element.Diagram.Diagram.El();
	var ruleId		= elDiagram.attr('data-sel-id');
	var ruleSn		= elDiagram.attr('data-sel-rule');
	var ruleType	= elDiagram.attr('data-sel-type');
	var objModal	= Core.Modal.Background();
	var elContainer	= $i( '<div/>'	,{ id		: Options.Element.Contextmenu.Setting.Id	} );
	var elTitle		= $i( '<div/>'	,{ class	: 'title' ,text : lang_return("fixa.core.title232")				} );
	var elContent	= $i( '<div/>'	,{ class	: 'content'									} );
	var elButtonOk	= $i( '<a/>'	,{ class	: 'button' ,text : lang_return("fixa.core.title079") ,href : '#'		} )
	.on('click' ,function() {
		
	});
	var elButtonCancle	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title006")
	,	href	: '#'
	}).on('click' ,function() {
		Core.Modal.Close();
		return false;
	} );
	var elButtonBox	= $i('<div/>' ,{
		class	: 'itmButton'
	}).append(elButtonCancle).append(elButtonOk);

	var elColumn		= $i( '<ul/>' 	,{ class : 'column' } );
	// Column List
	var TABLE_HEADER_NAME	= (d.TABLE_HEADER).split(',');
	var TABLE_HEADER_KEY	= (d.TABLE_HEADER_KEY).split(',');
	for( var fx=0; fx<TABLE_HEADER_KEY.length; ++fx ) {
		var li = $i('<li/>');
		var ln = $i('<a/>' ,{
			class		: 'item'
		,	text		: TABLE_HEADER_NAME[fx]
		,	'data-value': TABLE_HEADER_KEY[fx]
		,	href		: '#'
		}).on('click' ,function(e) {
			$i(this).parent().parent().find('.select').removeClass('select').end().end().end().addClass('select');
			return false;
		});
		li.append(ln);
		elColumn.append(li);
	};

	var elPrerequisite	= $i( '<ul/>'	,{ class : 'prerequisite' } );
	var prerequisite	= ['=','!=','>','>=','<','<=','like','fn'];
	for( var fx=0; fx<prerequisite.length; ++fx ) {
		var li = $i('<li/>');
		var ln = $i('<a/>' ,{
			class		: 'item'
		,	text		: prerequisite[fx]
		,	'data-value': prerequisite[fx]
		,	href		: '#'
		}).on('click' ,function(e) {
			$i(this).parent().parent().find('.select').removeClass('select').end().end().end().addClass('select');
			return false;
		});
		li.append(ln);
		elPrerequisite.append(li);
	};
	var elValues		= $i( '<ul/>'	,{ class : 'values' } );
	var elQuery			= $i( '<div/>'	,{ class : 'query' } );

	elContent.append(elColumn).append(elPrerequisite).append(elValues).append(elQuery);
	elContainer.append(elTitle).append(elContent).append(elButtonBox);
	objModal.html(elContainer);
	Options.Element.Global.Inni.El().append(objModal);
};



Core.Chatbot = {};

Core.Chatbot.Start = function() {
	var elInput	= Options.Element.Process.ChatbotInput.El();
	var value	= elInput.val();
	if ( $i.ChkBlankNot(value) ) {
		//Core.Chatbot.Write( value );
		Core.Chatbot.Play( value );
	};
};

Core.Chatbot.Write = function( message ) {
	var time	= new Date();
	var hour	= time.getHours();
	var minute	= time.getMinutes();
//	var elTime	= $i('<span/>' ,{
//		class	: 'time'
//	,	text	: $i.Right('0' + hour ,2) + ':' + $i.Right('0' + minute ,2)
//	});
//	var elMessage	= $i('<span/>' ,{
//		class	: 'message'
//	,	text	: message
//	});
//	var elLi	= $i('<li/>').append(elTime).append(elMessage);
//	Options.Element.Process.Chatbot.El().append(elLi);
	
	
	//console.log("message",message);
	
	var historyKeyData	= Options.History.History
	var historyKeyArr	= Object.keys(historyKeyData);
	
	
	Core.Console.Write( { Type : 'Info' ,KeyCode : 'Mssg1903' ,subMessage : $i.Right('0' + hour ,2) + ':' + $i.Right('0' + minute ,2), Message :  message } );
};

Core.Chatbot.Play = function( value ) {
	
	console.log("Core.Chatbot.Play7",value);
	
	
	var historyKeyData	= Options.History.History
	var historyKeyArr	= Object.keys(historyKeyData);
	var returnObject = {};
	var returnKey = ''; 
	for ( var fx=0; fx<historyKeyArr.length; ++fx ) {
		if ( value.search(historyKeyArr[fx]) != -1 ) {
			var tmpKey	= historyKeyArr[fx].toLowerCase();
			checks		= true;
			returnKey	= historyKeyData[tmpKey].message;
			returnObject = historyKeyData[tmpKey];
			break;
		};
	};
	
	var message = (returnKey) ? Options.Message.History[returnKey].Message : Options.Message.History['H1001'].Message;
	console.log("returnObject",returnObject,message);
	
	if(message.indexOf("{0}")>-1)
	{
		var $object = ''; 
		var temp = message.split("{0}");
		$object = $object + (temp[0]);
		$object = $object + (returnObject.icon);
		$object = $object + (temp[1]);
		console.log($object);
		message = $object;
	}
	
	Core.Chatbot.Write('[System] ' + message);
	Options.Element.Process.ChatbotInput.El().val('');
	var elChatbot	= Options.Element.Process.Chatbot.El();
	elChatbot.animate({scrollTop: elChatbot.prop("scrollHeight")}, 500);
	/**
	var historyKeyData	= Options.History.History
	var historyKeyArr	= Object.keys(historyKeyData);
	let returnKey ,checks	= false;
	for ( var fx=0; fx<historyKeyArr.length; ++fx ) {
		if ( value.search(historyKeyArr[fx]) != -1 ) {
			var tmpKey	= historyKeyArr[fx].toLowerCase();
			checks		= true;
			returnKey	= historyKeyData[tmpKey]();
			break;
		};
	};
	**/
	
	/**
	console.log("returnKey",returnKey);
	
	
	var message = (returnKey) ? Options.Message.History[returnKey].Message : Options.Message.History['H1001'].Message;
	Core.Chatbot.Write('[System] ' + message);
	Options.Element.Process.ChatbotInput.El().val('');
	var elChatbot	= Options.Element.Process.Chatbot.El();
	elChatbot.animate({scrollTop: elChatbot.prop("scrollHeight")}, 500);
	**/
};



Core.Output = {};

Core.Output.Play = function( responseFunction ,requestData ) {
	var optionsAjax = {
		url			: Options.Uri.Ajax.Process.Output
	,	data		: JSON.stringify(requestData)
	,	dataType	: 'json'
	,	contentType	: 'application/json'
	,	success		: function( d ,e ) { eval(responseFunction + '( d ,e )'); }
	,	beforeSend	: Core.Modal.Loading
	,	complete	: Core.Modal.LoadingClose
	};$i.Ajax(optionsAjax);
};

Core.Output.DataList = function( responseFunction ) {
	var elDiagram	= Options.Element.Diagram.Diagram.El();
	var ruleId		= elDiagram.attr('data-sel-id');
	var ruleSn		= elDiagram.attr('data-sel-rule');
	var ruleType	= elDiagram.attr('data-sel-type');

	var columnArr	= $i('input[name="TABLE_HEADER"]:checked');
	var column		= '';
	for ( var fx=0; fx<columnArr.length; ++fx ) {
		column += columnArr.eq(fx).val();
		if ( fx<columnArr.length-1 ) {
			column += ',';
		};
	};
	var global = Options.Variable.Diagram.Global
	global[ruleId].Column = column;
	global[ruleId].UseDefineQuery = $i('#useDefineValue').val();
	var requestData	= {
		Event	: { Gubun : '0' ,Type : 'datalist' ,Id : ruleId ,RuleSn : ruleSn ,RuleType : ruleType }
	,	Global	: global
	};
	Core.Output.Play( responseFunction ,requestData );
};

Core.Output.DataListResponse = function( d ,e ) {
	var dataList = d.data;

	var elTheadTr	= $i('<tr/>');
	var elTbody		= $i('<tbody/>');

	for ( var fx=0; fx<dataList.length; ++fx ) {
		var tmpRow	= dataList[fx];
		var tmpTr	= $i('<tr/>');

		$i.each(tmpRow ,function(k ,v) {
			var tmpTd = $i('<td/>' ,{
				text : v
			});
			tmpTr.append(tmpTd);
			if (fx==0) {
				var tmpTh = $i('<th/>' ,{
					text : k
				})
				elTheadTr.append(tmpTh);
			};
		});

		elTbody.append(tmpTr);
	};

	var elThead		= $i('<thead/>').append(elTheadTr);
	var elTable = $i('<table/>' ,{ id : 'dataListTable' }).append(elThead).append(elTbody);

	$i('#tab3.dataList').html(elTable);

	
};
Core.Diagram.SetCellIndex = function(){

	
	elHistory			= Options.Element.Diagram.HistoryDiagram.El();
	var lengthDiagram	= Options.Variable.History.Diagram.Rule.length;
	var indexItemMax	= elHistory.find('a.item').length - 1;
	var indexItemNow	= elHistory.find('a.now').parent().index();
	var dataGlobal		= Options.Variable.Diagram.Global;
	
	var valueId = $(".item.u.now").attr("id");
	if(valueId != undefined){
		var liindex = parseInt($(".item.u.now").attr("id"));
		
		if ( indexItemNow < indexItemMax ) {
			var length = Options.Variable.History.Diagram.Rule[liindex].length;
			var cellslength = Options.Variable.Diagram.Cells.length
			for ( var fx=0; fx<(cellslength-length)-1; fx++ ) {
				Options.Variable.Diagram.Cells.splice(length,1);
				var medelId =  Options.Variable.Diagram.Cells[length].id;
				
			};
			Options.Variable.History.Diagram.Rule[lengthDiagram] = [];
			for(var i=0; i<Options.Variable.Diagram.Cells.length; i++){
				Options.Variable.History.Diagram.Rule[lengthDiagram][i] = Options.Variable.Diagram.Cells[i];
			}
			dataGlobal = Options.Variable.Diagram.Global;
			Options.Variable.History.Diagram.Global[lengthDiagram]	= {};
			$i.each(dataGlobal ,function(key ,value) {
				Options.Variable.History.Diagram.Global[lengthDiagram][key] = value;
			});
			
			Prep.DiagramUpdateData();
			Core.Diagram.settingRecent();
// Core.Diagram.IndexSetting();
// $.ajax({
// url: '/collect/setProjectAndDataSn2.fd'
// ,async: false
// ,type: 'post'
// ,success: function(data) {
// Core.Diagram.Reset2();
// if(data.workflow != ""){
// var obj = JSON.parse(data.workflow);
// if(obj.length != 0){
// for(var i=0; i<obj.length; i++){
// Core.Diagram.Add2(obj[i].before_data_y,obj[i].before_data_x,obj[i].before_data_icon,obj[i].before_data_rule,obj[i].before_data_rule_opt,obj[i].before_data_name,obj[i].before_data_index,obj[i].before_data_type);
// }
// }
// diagramfirst = true;
// Core.Diagram.DiagramSetData(data);
// }else{
// diagramfirst = true;
// }
// }
// });
			return false;
		}
	}else{
		Prep.DiagramUpdateData();
// Core.Diagram.IndexSetting();
		Core.Diagram.settingRecent();
		return false;
	}
	
};
Core.Diagram.settingRecent = function(){
	$.ajax({
	    url: '/collect/setProjectAndDataSn2.fd' 
	    ,async: false
	    ,type: 'post'
	    ,success: function(data) {
	    	Core.Diagram.Reset2();
	    	if(data.workflow != ""){
		    	var obj = JSON.parse(data.workflow);
		    	if(obj[0].before_scrollerX !="" && obj[0].before_scrollerY !=""){
		    		if($("#itmDiagramCanvas").width() < parseInt(obj[0].before_scrollerX) || $("#itmDiagramCanvas").height() < parseInt(obj[0].before_scrollerY)){
		    			$(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").css("width",parseInt(obj[0].before_scrollerX));
		    			$(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").css("height",parseInt(obj[0].before_scrollerY));
		    		}
		    	}
		    	if(obj.length != 0){
			    	for(var i=0; i<obj.length; i++){
	    				Core.Diagram.Add2(obj[i].before_data_y,obj[i].before_data_x,obj[i].before_data_icon,obj[i].before_data_rule,obj[i].before_data_rule_opt,obj[i].before_data_name,obj[i].before_data_index,obj[i].before_data_type);
					}
		    	}
		    	diagramfirst = true;
		    	Core.Diagram.DiagramSetData(data);
		    	
	    	}else{
	    		diagramfirst = true;
	    	}
	    }
	});
	
	
};


Core.Diagram.Add2 = function(y,x,icon,rule,opt,text,index,datatype) {

	var color			= Options.Variable.Diagram.RuleColorDiagram;
// var element = $i(ui.draggable);
	var offsetTarget	= Options.Element.Diagram.Canvas.El().offset();
	var yTarget			= offsetTarget.top;
	var xTarget			= offsetTarget.left;
	var y				= parseInt(y);
	var x				= parseInt(x);
// var width = element.outerWidth();
// var height = element.outerHeight();
	var ruleIndex		= index;
	var ruleType		= datatype;
	var ruleBase		= "";
	var ruleIcon		= icon;
	var ruleOpt			= opt;
	
	
	var optionsMarkup	= '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>';
	var optionsImage		= {
			'xlink:href'	: Options.Uri.Root.Images.RuleBasic		// 기본 이미지
		,	width			: 70
		,	height			: 70
		,	ref				: 'rect'
		,	'ref-x'			: .5
		,	'ref-y'			: .5
		,	'x-alignment'	: 'middle'
		,	'y-alignment'	: 'middle'
		};
	var optionsLabel	= { width: '60px' ,fill : '#9cc4ff' ,'ref-y' : 30 ,'font-family' : '돋움,Dotum' ,'font-size' : '1em' };
	var optionsCircle	= { 'stroke-width' : 0 ,fill : '#2b2b2b' };
	var optionsRect		= { 'stroke-width' : 0 ,fill : 'transparent' ,rx : 8 };
	var optionsMyModel	= {
			markup		:	optionsMarkup
		,	defaults	:	joint.util.deepSupplement( {
				type	:	'devs.MyImageModel'
			,	size	:	{ width : 70 ,height : 70 }
			,	attrs	:	{
					rect				: optionsRect
				,	image				: optionsImage
				,	circle				: optionsCircle
				,	'.label'			: optionsLabel
				}

			} ,joint.shapes.devs.Model.prototype.defaults )
		};
	
	
	var rabelText		= (2 == parseInt(ruleBase)) ? { text : text } : null;
	
	joint.shapes.devs.MyImageModel		= joint.shapes.devs.Model.extend( optionsMyModel );
	
	
	var model			= new joint.shapes.devs.MyImageModel({
		position	: { x : x ,y : y }
	,	attrs		: {
			image		: { 'xlink:href' : ruleIcon }
		,	'.label'	: rabelText
		,	rect		: { fill : 'transparent' }	// color[parseInt(ruleType)]
													// }
		}
	,	Use			: {
			Index		: Options.Variable.Diagram.Cells.length
		,	Rule		: rule
		,	Name		: text
		,	RuleOpt		: opt
		,	RuleType	: datatype
		,   x 			: x
		,   y 			: y
		}
// , inPorts : [ 'in' ]
// , outPorts : [ 'out' ]
	});
	
	// 이전값 세팅
	
	Options.Variable.Diagram.Cells.push(model);
	Options.Variable.Diagram.Graph.addCells( Options.Variable.Diagram.Cells );

	V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el ).attr( 'data-index'		,index	);
	V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el ).attr( 'data-rule'		,rule				);
	V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el ).attr( 'data-type'		,datatype				);
	V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el ).attr( 'data-name'		,text				);
	V( Options.Variable.Diagram.Paper.findViewByModel(model.id).el ).attr( 'data-rule-opt'	,opt		);
	

	var globalKey	= Object.keys( Options.Variable.Diagram.Global );
	var globalId	= globalKey[globalKey.length-1];
	var optionsLink = Core.Diagram.OptionsLink({
		source		: { id : globalId } // ,port : 'out' }
	,	target		: { id : model.id } // ,port : 'in' }
	,	router		: { name : 'orthogonal' }
	,	Use			: {
			Index		: Options.Variable.Diagram.Cells.length
		,	Rule		: rule
		,	RuleType	: datatype
		}
	});
	var link		= new joint.shapes.devs.Link( optionsLink );
	link.vertexMarkup = '<g class="marker-vertex-group" transform="translate(<%= x %>, <%= y %>)">'
        +'</g>';
	Options.Variable.Diagram.Cells.push(link);
	Options.Variable.Diagram.Graph.addCells( link );
	Core.Diagram.GlobalAdd( model.id ,rule ,datatype );
//	Options.Variable.Diagram.Global[model.id].ChkRule = radio;
	$("g[model-id='"+model.id+"']").attr("transformX",x);
	$("g[model-id='"+model.id+"']").attr("transformY",y);
// var data = new Object();
// data.ui = "1"+element;
// data.modelId = model.id;
// data.index = index;
// data.type = datatype;
// data.x = x;
// data.y = y;
// data.icon = ruleIcon;
// data.rule = rule;
// data.opt = opt;
// data.name = text;
// data.Column = Options.Variable.Diagram.Global[model.id].Column;
// data.rule_cont = Options.Variable.Diagram.Global[model.id].rule_cont;
// if(ruleType == "20"){
// data.Column = Options.Variable.Diagram.Global[model.id].Column;
// data.rule_cont = Options.Variable.Diagram.Global[model.id].rule_cont;
// }
// else if(ruleType == "30"){
// data.Column = Options.Variable.Diagram.Global[model.id].Column;
// data.rule_cont = Options.Variable.Diagram.Global[model.id].rule_cont;
// }
// else if(ruleType == "40"){
// data.Column = Options.Variable.Diagram.Global[model.id].Column;
// data.rule_cont = Options.Variable.Diagram.Global[model.id].rule_cont;
// }
// else if(ruleType == "50"){
// data.Column = Options.Variable.Diagram.Global[model.id].Column;
// data.rule_cont = Options.Variable.Diagram.Global[model.id].rule_cont;
// }else{
// alert(Options.Variable.Diagram.Global[model.id].Column);
// data.Column = Options.Variable.Diagram.Global[model.id].Column;
// // data.rule_cont = Options.Variable.Diagram.Global[model.id].rule_cont;
// }
	
// Options.beforeUi.push(data);

	Core.History.Add({ Type : 'diagram' ,RuleId : model.id ,RuleSn : rule ,RuleName : text ,RuleType : datatype });
};
/**
 * 차트 이벤트 처리
 */
Core.Output.Chart = function( responseFunction ) {
	var elDiagram	= Options.Element.Diagram.Diagram.El();
	var ruleId		= elDiagram.attr('data-sel-id');
	var ruleSn		= elDiagram.attr('data-sel-rule');
	var ruleType	= elDiagram.attr('data-sel-type');
	
// console.log("chart=>elDiagram",elDiagram);
// console.log("chart=>ruleId",ruleId);
//	
// alert(elDiagram);
//	
	
	
// var requestData = {
// Event : { Gubun : '0' ,Type : 'chart' ,Id : ruleId ,RuleSn : ruleSn ,RuleType
// : ruleType }
// , Global : Options.Variable.Diagram.Global
// };
// Core.Output.Play( responseFunction ,requestData );
	
	// ### 프로젝트 고유값이 없을 경우 신규 저장
	var objModal	= Core.Modal.Background();
	var elContainer	= $i('<div/>' ,{
		id		: Options.Element.chart.c3chartview.Id
	});
	var elTitle		= $i('<div/>' ,{
		class	: 'title'
	
	});
	var elContent	= $i('<div/>' ,{
		class	: 'content'
	});

	var itmChartArea	= $i('<div/>' ,{
		height	: '600px'
		,id		: 'barChart'		
	});
	elContent.html(itmChartArea);
	
	
	var elButtonCancle	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title059")// '닫기'
	,	href	: '#'
	}).on('click' ,function() {
		Core.Modal.Close();
		return false;
	} );
	var elButtonBox	= $i('<div/>' ,{
		class	: 'itmButton'
	}).append(elButtonCancle);
	
	elTitle.append($("<div/>",{"class":"tab_btn_left"}));
	elTitle.append($("<a/>",{"text":'차트보기'}));
	elTitle.append($("<div/>",{"class":"tab_btn_right"}));
	
	elContainer.append(elTitle).append(Core.tabbar4()).append(elContent).append(elButtonBox);
	objModal.html(elContainer);
	Options.Element.Global.Inni.El().append(objModal);
	
	// 데이터 수행
	var options = {};
	options.curId = ruleId; 
	result = Core.Diagram.run('chart', options)
	// 차트 표출
	
	
	
	
	
	
};

/**
 * 차트 출력
 */
Core.Output.ChartResponse = function( d ,e ) {
	var check = ( $i.ChkBlank(d.data[0].result) ) ? 'true' : d.data[0].result;
	if ( 'false' == check ) {
		Core.Console.Write( { Type : 'Error' ,KeyCode : 'Errr1506' ,Message : '' } );
	} else {
		var meth = 'Core.D3Chart.' + d.data[3] + '(d)';
		eval(meth);
	};
};

Core.Output.Timer = function() {
	var elTimer			= Options.Element.Process.Timer.El();
	var nowDate			= new Date();
	var nowHour			= nowDate.getHours();
	var nowMinute		= nowDate.getMinutes();
	var toDate			= new Date(nowDate);
	var type			= Options.Element.Process.InputTimerType.El().val();
	var timer			= parseInt(Options.Element.Process.InputTimerMinutes.El().val());
	var hour			= parseInt(Options.Element.Process.InputTimerHour.El().val());
	var minute			= parseInt(Options.Element.Process.InputTimerMinute.El().val());
	toDate.setMinutes(nowDate.getMinutes() + timer);
	Options.Element.Process.TimerBox.El().parent().find('.buttonOk').remove();
	
	if ( ('timerTypeA'==type && $i.ChkBlank(timer) ) || ( 'timerTypeB'==type && ($i.ChkBlank() && $i.ChkBlank()) ) ) {
		Core.Output.Output('Core.Output.OutputResponse');
	} else if ( ('timerTypeA'==type && $i.ChkBlankNot(timer) ) || ( 'timerTypeB'==type && ($i.ChkBlankNOt() && $i.ChkBlankNot()) ) ){
		Core.Output.TimerOut(type ,timer ,nowDate ,toDate);
	} else {
		// 선택이 안되었을 경우 콘솔 안내
	};
	
};

Core.Output.TimerOut = function(type ,timer ,beforeDate ,toDate) {
	var nowDate			= new Date();
	var nowHour			= nowDate.getHours();
	var nowMinute		= nowDate.getMinutes();
	var elTimer			= Options.Element.Process.Timer.El();
	var infoText		= '';
	var formatMinute	= (1000 * 60);
	var diff			= toDate.getTime()-nowDate.getTime();
	var diffSec			= parseInt((diff%formatMinute)/1000);
	var diffHH			= parseInt(diff/formatMinute/3600);
	diff				= parseInt(diff/formatMinute/60);

	if ( 'timerTypeA'==type ) {
		infoText	+= $i.Right('0' + beforeDate.getHours() ,2) + ':' + $i.Right('0' + beforeDate.getMinutes() ,2) + '의 ' + timer + '분 뒤에 실행 합니다. (남은시간: <span class="info">' + ((diffHH>0) ? diffHH + '시간 ' : '') + diff + '분 ' + diffSec + '초</span>)';
	} else {};

	elTimer.empty().html(infoText);

	if ( nowDate>=toDate ) {
		clearTimeout(Options.Variable.Global.SetTimer);
		Core.Output.Output('Core.Output.OutputResponse');
	} else {
		Options.Variable.Global.SetTimer = setTimeout(function(){Core.Output.TimerOut(type ,timer ,nowDate ,toDate);} ,1000);
	};
};

Core.Output.Output = function( responseFunction ) {
	var elDiagram	= Options.Element.Diagram.Diagram.El();
	var ruleId		= elDiagram.attr('data-sel-id');
	var ruleSn		= elDiagram.attr('data-sel-rule');
	var ruleType	= elDiagram.attr('data-sel-type');
	var requestData	= {
		Event	: { Gubun : '1' ,Type : 'chart' ,Id : ruleId ,RuleSn : ruleSn ,RuleType : ruleType }
	,	Global	: Options.Variable.Diagram.Global
	,   Diagram : Options.Variable.History.Diagram
	};
	Core.Output.Play( responseFunction ,requestData );
};

Core.Output.OutputResponse = function( d ,e ) {
	Options.Variable.Global['SheetClickOutput'] = false;
	$i('#' + Options.Element.Process.Sheet.Id + '>.item>a').removeClass('on').eq(2).removeClass('lock').addClass('on');
	$i('#' + Options.Element.Global.Content.Id + '>form>.content').removeClass('on').eq(2).addClass('on');

	Options.Element.Diagram.HistoryDiagram.El().addClass('_none');
	Options.Element.Diagram.HistoryGrid.El().addClass('_none');
	var panel = Options.Element.Global.Pnb.El();
	panel.find('.panel .panelGroup .item.btnHistory').removeClass('unlock').addClass('lock');
	panel.find('.panel .panelGroup .item.btnPlay').removeClass('unlock').addClass('lock');
	panel.find('.panel .panelGroup .item.btnDown').removeClass('lock').addClass('unlock');
	/*
	 * var statList = d.data[0]; var trHead = $i('<tr/>'); var trBody = $i('<tr/>');
	 * $i.each(statList ,function(key ,value) { var tdHead = $i('<td/>' ,{ text :
	 * key }); var tdBody = $i('<td/>' ,{ text : value });
	 * trHead.append(tdHead); trBody.append(tdBody); });
	 * 
	 * $i('#' + Options.Element.Process.Statistic.Id + ' thead').html(trHead);
	 * $i('#' + Options.Element.Process.Statistic.Id + ' tbody').html(trBody);
	 * 
	 * Core.D3Chart.statTypeOne(d ,e ,true);
	 */


	var scriptStr		= d.data[5];
	var scriptSummary	= d.data[6];
	var scoreData 		= d.data[7];
	var typeLast		= d.data[8];
	

	Options.Element.Process.OutputScriptStr.El().html(scriptStr);
	Options.Element.Process.OutputScriptSummary.El().html(scriptSummary);
	$i("#score").html(scoreData);

	// 차트 비우기
	Options.Element.Process.OutputChartMetrix.El().empty();
	Options.Element.Process.OutputChartBoxplot.El().empty();

	var loadingCheck1 = false ,loadingCheck2 = false;
	var width	= Options.Element.Process.OutputChartMetrix.El().outerWidth();
	var height	= Options.Element.Process.OutputChartMetrix.El().outerHeight();

	if ( "05" == typeLast ) {
		Core.D3Chart.ChartTimeR(d ,width ,height);
		Core.D3Chart.ChartTime(d ,width ,height);
		
	} else {
		Core.D3Chart.Matrix(d ,width ,height );
		Core.D3Chart.BoxPlot(d ,width ,height);
	};

	Core.Console.Write( { Type : 'Success' ,KeyCode : 'Succ1601' ,Message : '' } );
};


Core.D3Chart = {};

Core.D3Chart.Modal = function( d ) {
	var elButtonOk	= '';
	var elRSetting	= Core.Diagram.Contextmenu.Chart( d );
	var elContent	= $i( '<div/>' ,{ class : 'content' } ).append(elRSetting);
	var contents = {
		Title		: lang_return("fixa.core.title060") // '차트보기'
	,	ElButtonOk	: elButtonOk
	,	ElContent	: elContent
	};
	var objModal		= Core.Modal.Background();
	var txtTitle		= contents.Title;
	var elButtonOk		= contents.ElButtonOk;
	var elContent		= contents.ElContent;
	var elContainer		= $i( '<div/>'	,{ id : Options.Element.Contextmenu.Details.Id } );
	var elTitle			= $i( '<div/>'	,{ class : 'title' 	,text : txtTitle } );
	var elButtonCancle	= $i( '<a/>'	,{ class : 'button' ,text : lang_return("fixa.core.title059") ,href : '#' }).on('click' ,function() { Core.Modal.Close(); return false; } );  // 닫기
	var elButtonBox		= $i( '<div/>'	,{ class : 'itmButton' }).append(elButtonCancle);

	elContainer.append(elTitle).append(elContent).append(elButtonBox);
	objModal.html(elContainer);
	Options.Element.Global.Inni.El().append(objModal);
};

Core.D3Chart.ChartTime = function( d ) {
	var data = d.data[4];
	var data2 =[];
	var sel_time = Options.Variable.Global.TimeChart.split(",");
	
	$(data).each(function(k,v){
		if ( k>0 ) {
			var dd = v[sel_time[0]] + '';
			var kk		= dd + ' 00:00:00';		// dd.substr(0 ,4) + '-' +
												// $i.Right('0' + dd.substr(4
												// ,2) ,2) + '-' + $i.Right('0'
												// + $i.Right(dd ,2) ,2) + '
												// 00:00:00';
			var dates	= new Date( dd );
			var ccc		= false;
			var d = {
				date	: new Date(dates.getTime() + 1000 * 60 * 60 * 24)
			,	n		: Math.floor(v[sel_time[1]])
			/* , n2 : Math.floor(v.gpa) */
			};
			data2.push(d);
		};
	});

	var chart = d3_timeseries().addSerie(data2,{x:'date' ,y:'n' ,diff:'n'},{interpolate:'monotone' ,color:'#ff2'}).width('960');
	chart('#' + Options.Element.Process.OutputChartMetrix.Id);
};

Core.D3Chart.ChartTimeR = function(d ,width ,height) {
	var data		= d.data[9].r_chart;
	var data2		=[];
	var margin		= {left:30, right:30, top: 10, bottom: 20}
	var width		= width - margin.right;
	var height		= height - margin.bottom - margin.top;
	for ( let fx=0; fx<data.length; ++fx ) {
		if ( data[fx].c !== undefined ) {
			data2.push({date : data[fx].date ,c : data[fx].c});
		};
	};

	var svg			= d3.select("#"+ Options.Element.Process.OutputChartBoxplot.Id).append("svg").attr("width" ,width).attr("height" ,height);

	width			= width - margin.left - margin.right;
	height			= height - margin.bottom - margin.top;

	var x			= d3.scaleTime().rangeRound([0 ,width]);
	var x_axis		= d3.axisBottom(x);
	var y			= d3.scaleLinear().rangeRound([height ,0]);
	var y_axis		= d3.axisBottom(y);
	var parseTime	= d3.timeParse("%Y-%m-%d");

	x.domain(d3.extent(data, function(d) { return parseTime(d.date); }));
	y.domain([0 ,d3.max(data, function(d) { return d3.max([d.b ,d.c]); })]);

	var multiline = function(category) {
		var line = d3.line().x(function(d) { return x(parseTime(d.date)); }).y(function(d) { return y(d[category]); });
		return line;
	};

	var categories = ['b' ,'c'];
	var color = d3.scaleOrdinal(d3.schemeCategory10);
	var g = svg.append("g").attr("transform" ,"translate(" + margin.left + "," + margin.top + ")");

	/*
	 * for (i in categories) { var lineFunction = multiline(categories[i]);
	 * g.append("path").datum(data).attr("class", "line").style("stroke",
	 * color(i)).attr("d" ,lineFunction); };
	 */

	g.append("path").datum(data).attr("class", "line").style("stroke", color(0)).attr("d" ,multiline(categories[0]));
	g.append("path").datum(data2).attr("class", "line").style("stroke", color(1)).attr("d" ,multiline(categories[1]));

	// Add the X Axis
	g.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));

	// Add the Y Axis
	g.append("g").call(d3.axisLeft(y));

/*
 * var legend = g.selectAll(".legend") .data(color.domain())
 * .enter().append("g") .attr("class", "legend") .attr("transform", function(d
 * ,i){ return "translate(0 ," + i * 20 + ")";});
 * 
 * legend.append("rect") .attr("x", width - 18) .attr("width", 18)
 * .attr("height", 18) .style("fill", color);
 * 
 * legend.append("text") .attr("x", width - 24) .attr("y", 9) .attr("dy",
 * ".35em") .style("text-anchor", "end") .text(function(d) {return
 * categories[d];});
 */
};

Core.D3Chart.StatTypeOne = function( d ,e ,pSvg ) {
	if ( !pSvg ) {
		Core.D3Chart.Modal(d);
	};

	const	dtState		= d.data[0];
	const	dtTotal		= parseInt(d.data[1]);
	const	color		= d3.scaleOrdinal().range(['#8ece6b' ,'#d08d3d' ,'#3d78d0' ,'#c353a7' ,'#45ae40' ,'#bdb019' ,'#19bd95']);

	let dtColumn	= [];
	let data		= [];
	$i.each( dtState ,function( key ,value ) {
		dtColumn.push(key);
		data.push( { label : key ,value : value } );
	} );

	let dimensions	= {
		gWidth			: 760
	,	gHeight			: 400
	,	gMargin			: 20
	,	gInnerWidth		: 720
	,	gInnerHeight	: 360
	,	bMargin			: 10
	};

	let xScale		= d3.scaleLinear().domain([0 ,data.length]).range([0 ,dimensions.gInnerWidth]);
	let maxValue	= d3.max(data ,function( d ) { return d.value; });
	let yScale		= d3.scaleLinear().domain([0, maxValue]).range([0, dimensions.gInnerHeight]);
	let yAxisScale	= d3.scaleLinear().domain([maxValue, 0]).range([0, dimensions.gInnerHeight]);
	let chart;
	if ( pSvg ) {
		$i('#itmChart').empty();
		chart		= d3.select('#itmChart').append('svg').attrs({ width: dimensions.gWidth ,height: dimensions.gHeight });
	} else {
		chart		= d3.select('#rChart').append('svg').attrs({ width: dimensions.gWidth ,height: dimensions.gHeight });
	};
	
	let yAxis		= d3.axisLeft( yAxisScale ).tickSizeInner( -dimensions.gInnerWidth ).tickPadding( 5 );
	chart.append('g').attrs({ class:'axis axis-y' ,transform: 'translate(' + dimensions.gMargin + ',' + dimensions.gMargin + ')' }).call( yAxis );
	let xTicks		= [];
	for ( let fx=0; fx<data.length; ++fx) { xTicks.push( fx + 0.5 ); };
	let xAxis		= d3.axisBottom( xScale ).tickValues( xTicks ).tickFormat( function( d ,ix) { return data[ix].label; });
	chart.append('g').attrs({ class:'axis axis-x' ,transform: 'translate(' + dimensions.gMargin + ', ' + ( dimensions.gMargin + dimensions.gInnerHeight ) + ')' }).call( xAxis );
	let barAttrs	= {
		class		: 'bar-line'
	,	transform	: 'translate(' + dimensions.gMargin + ', ' + dimensions.gMargin + ')' ,height: function( d ,ix ) { return yScale( d.value ); }
	,	width		: (dimensions.gInnerWidth / data.length) - (dimensions.bMargin * 2 )
	,	height		: function( d ,ix ) { return (d.value == 0) ? 2 : yScale( d.value ); }
	,	x			: function( d ,ix ) { return (dimensions.gInnerWidth / data.length) * ix + dimensions.bMargin; }
	,	y			: function( d ,ix ) { let h = dimensions.gInnerHeight - yScale( d.value ); return (h==dimensions.gInnerHeight) ? dimensions.gInnerHeight - 2 : h; }
	};

	chart.append('g')
		.selectAll('.' + barAttrs.class)
		.data( data )
		.enter()
		.append('rect')
		.attrs( barAttrs )
		.attr('fill' ,function(d) { return color(d.label) });

	/*
	 * let legendAttrs = { 'font-size' : 10 , 'text-anchor' : 'end' } let legend =
	 * chart.append('g').attrs(legendAttrs) .selectAll('g') .data(
	 * dtColumn.slice().reverse() ) .enter() .append('g').attr('transform'
	 * ,function(d ,ix) { return 'translate(0 ,' + ix * 20 + ')'; });
	 * legend.append('rect') .attr('x' ,dimensions.gInnerWidth - 20)
	 * .attr('width' ,20) .attr('height' ,20) .attr('fill' ,color);
	 * legend.append('text') .attr('x' ,dimensions.gInnerWidth - 25) .attr('y'
	 * ,9.5) .attr('dy' ,'0.32em') .text(function(d) { return d });
	 */
};

Core.D3Chart.ClusterTypeOne = function( d ) {
	Core.D3Chart.Modal(d);

	var dataConsole	= d.data[0];
	var data		= d.data[1];
	var header		= d.data[2];
	
	var series = header.split(",");
	var svg = d3.select("#rChart").append('svg').attr('width' ,'750').attr('height' ,'400');
	var	margin = {top:20, right:60, bottom:20, left:20};
	var	width  = 700 - margin.left - margin.right;
	var	height = 400 - margin.top - margin.bottom;
	
	var	g = svg.append("g").attr("transform", "translate(" + margin.left + ","+ margin.top +")");
	
	var x = d3.scaleLinear().rangeRound([0, width]);
	var y = d3.scaleLinear().rangeRound([height, 0]);
	var color = d3.scaleOrdinal(d3.schemeCategory10);
	
	var xAxis = d3.axisBottom(x);
	
	var yAxis = d3.axisLeft(y);
	
	var datas  = [];
	var rawData = [];
	
	for(var i=0;i<series.length;i++){
		var rawData = [];
		$(data).each(function(k,v){
			if(series[i] == Object.keys(v)[0]){
				rawData.push({x:v[Object.keys(v)].x, y:v[Object.keys(v)].y});
			}
		});
		datas.push({id:series[i],values:rawData});
	}

	x.domain(d3.extent(data, function(d){
		return d[Object.keys(d)].x
	})).nice();
	
	y.domain(d3.extent(data, function(d){
		return d[Object.keys(d)].y
	})).nice();
	
	g.append("g")
	   .attr("class", "x axis")
	   .attr("transform", "translate(0,"+ height +")")
	   .call(xAxis)
	 .append("text")
	   .attr("class", "label")
	   .attr("x", width)
	   .attr("y", -6)
	   .style("text-anchor", "end")
	   .text("width");
	
	g.append("g")
	   .attr("class", "y axis")
	   .call(yAxis)
	 .append("text")
	   .attr("class", "label")
	   .attr("transform", "rotate(-90)")
	   .attr("y", 6)
	   .attr("dy", ".71em")
	   .style("text-anchor", "end")
	   .text("11");
	
	g.selectAll(".dot")
		.data(data)
	   .enter().append("circle")
	    .attr("class", "dot")
	    .attr("r", 3.5)
	    .attr("cx", function(d) {
	    	return x(d[Object.keys(d)].x);
	    })
	    .attr("cy", function(d) {
	    	return  y(d[Object.keys(d)].y);
	    })
	    .style("fill", function(d){return color(Object.keys(d));})
	    
	    
	var legend = g.selectAll(".legend")
					.data(color.domain())
					.enter().append("g")
					.attr("class", "legend")
					.attr("transform", function(d ,i){ return "translate(60 ," + i * 20 + ")";});

		legend.append("rect")
			  .attr("x", width - 18)
			  .attr("width", 18)
			  .attr("height", 18)
			  .style("fill", color);

		legend.append("text")
			  .attr("x", width - 24)
			  .attr("y", 9)
			  .attr("dy", ".35em")
			  .style("text-anchor", "end")
			  .text(function(d) { return d; });
};

Core.D3Chart.LogisticTypeOne = function( d ) {
	Core.D3Chart.Modal( d );

	var dataConsole	= d.data[0];
	var data		= d.data[1];
	var header		= d.data[2];
	
	var series = header.split(",");
	var svg = d3.select("#rChart").append('svg').attr('width' ,'700').attr('height' ,'400');
	var	margin = {top:20, right:20, bottom:20, left:50};
	var	width  = 700 - margin.left - margin.right;
	var	height = 400 - margin.top - margin.bottom;
	
	var	g = svg.append("g").attr("transform", "translate(" + margin.left + ","+ margin.top +")");
	
	var x = d3.scaleLinear().rangeRound([0, width]);
	var y = d3.scaleLinear().rangeRound([height, 0]);
	var z = d3.scaleOrdinal(d3.schemeCategory10);
	
	var datas  = [];
	var rawData = [];
	
	for(var i=0;i<series.length;i++){
		var rawData = [];
		$(data).each(function(k,v){
			if(series[i] == Object.keys(v)[0]){
				rawData.push({x:v[Object.keys(v)].x, y:v[Object.keys(v)].y});
			}
		});
		datas.push({id:series[i],values:rawData});
	}
	
	var line = d3.line()
			   .curve(d3.curveBasis)
			   .x(function(d) {
					 return x(d.x);
				})
			   .y(function(d){ 
					 return y(d.y);
			    });
	
	x.domain(d3.extent(data, function(d){
		return d[Object.keys(d)].x;	
	}));
	
	y.domain([
		d3.min(datas, function(c){
			return d3.min(c.values, function(d){ return d.y;});
		}),
		d3.max(datas, function(c){
			return d3.max(c.values, function(d){ return d.y;});
		})
	]);
	
	z.domain(datas.map(function(c){
		return c.id;
	}));
	
	// y
	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0,"+ height + ")")
		.call(d3.axisBottom(x));
	
	// x
	g.append("g")
		.attr("class", "axis axis--y")
		.attr("fill" ,'#fff')
		.call(d3.axisLeft(y))
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y",6)
		.attr("dy", "0.71em")
		.attr("fill", "#000")
		.text(lang_return("fixa.core.title080"))
		// .text("기대치, F");
	
	var chartD = g.selectAll(".data")
		.data(datas)
		.enter().append("g")
		.attr("class", "data");
		
		chartD.append("path")
			.attr("class", "line")
			.attr("d", function(d){
				return line(d.values);
			})
			.style("stroke", function(d) {
				return z(d.id);
			});
		
		chartD.append("text")
			.datum(function(d) {
				return {id:d.id, value:d.values[d.values.length - 1]};
			})
			.attr("transform", function(d) {
				return "translate("+ x(d.value.x) + ","+ y(d.value.y) +")";
			})
			.attr("x", 4)
			.attr("dy", "0.35em")
			.style("font", "10px sans-serif")
			.text(function(d){
				return d.id
			});
};

Core.D3Chart.Matrix = function( d ,width ,height ) {
	var idChartBox	= Options.Element.Process.OutputChartMetrix.Id;
	var dataConsole	= d.data[0];
	var header		= d.data[2];
	var headerArr	= header.split(',');

	var datas		= d.data[4];
	var data		= [];
	var columnCheck	= [];
	
	for ( var fx=0; fx<datas.length; ++fx ) {
		var tmpData = datas[fx];
		var tmpJson	= {};
		var ex		= 0;
		$i.each(tmpData ,function(key ,value){
			if ( fx==0 ) {
				columnCheck.push(value);
			} else {
				if (columnCheck[ex]==0 || ex == Object.keys(tmpData).length-1) {
					tmpJson[key] = value;
				};
			};
			++ex;
		});
		if ( fx>0 ) {
			data.push(tmpJson);
		};
	};

	var D3Chart = d3;

	var	margin = {top:20, right:20, bottom:20, left:50};
	var domainByTrait = {},
	    traits = D3Chart.keys(data[0]).filter(function(d) { return d !== headerArr[headerArr.length-1]; }),
	    n = traits.length;

	var	width	= width - margin.left - margin.right;
	var	height	= width; // height - margin.top - margin.bottom;
	var padding	= 20;
	var sizeW	= (width / n - 6);
	var sizeH	= (height / n - 6);
	
	var x = D3Chart.scaleLinear().range([padding / 2 ,sizeW - padding / 2]);

	var y = D3Chart.scaleLinear().range([sizeH - padding / 2 ,padding / 2]);
	
	var xAxis = D3Chart.axisBottom()
	    .scale(x)
	    .ticks(6);
	
	var yAxis = D3Chart.axisLeft()
	    .scale(y)
	    .ticks(6);
	
	var color = D3Chart.scaleOrdinal(D3Chart.schemeCategory10);
	
	
	  traits.forEach(function(trait) {
	    domainByTrait[trait] = D3Chart.extent(data, function(d) { return d[trait]; });
	  });
	
	  xAxis.tickSize(sizeW * n);
	  yAxis.tickSize(-sizeH * n);
	
	var brush = D3Chart.brush()
	    .on("start", brushstart)
	    .on("brush", brushmove)
	    .on("end", brushend)
	    .extent([[0,0] ,[sizeW ,sizeH]]);

	var svg = D3Chart.select("#" + idChartBox).append("svg")
		.attr("width", sizeW * n + padding + margin.left + margin.right)
		.attr("height", sizeH * n + padding + margin.left + margin.right)
		.append("g")
		.attr("transform", "translate(" + padding + "," + padding / 2 + ")");
	
	svg.selectAll(".x.axis")
	    .data(traits)
	  .enter().append("g")
	    .attr("class", "x axis")
	    .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * sizeW + ",0)"; })
	    .each(function(d) { x.domain(domainByTrait[d]); D3Chart.select(this).call(xAxis); });
	
	svg.selectAll(".y.axis")
	    .data(traits)
	  .enter().append("g")
	    .attr("class", "y axis")
	    .attr("transform", function(d, i) { return "translate(0," + i * sizeH + ")"; })
	    .each(function(d) { y.domain(domainByTrait[d]); D3Chart.select(this).call(yAxis); });
	
	var cell = svg.selectAll(".cell")
	    .data(cross(traits, traits))
	  .enter().append("g")
	    .attr("class", "cell")
	    .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * sizeW + "," + d.j * sizeH + ")"; })
	    .each(plot);
	
	// Titles for the diagonal.
	cell.filter(function(d) { return d.i === d.j; }).append("text")
	    .attr("x", padding)
	    .attr("y", padding)
	    .attr("dy", ".71em")
	    .text(function(d) { return d.x; });
	
	cell.call(brush);
	
	function plot(p) {
	  var cell = D3Chart.select(this);
	
	  x.domain(domainByTrait[p.x]);
	  y.domain(domainByTrait[p.y]);
	
	  cell.append("rect")
	      .attr("class", "frame")
	      .attr("x", padding / 2)
	      .attr("y", padding / 2)
	      .attr("width", sizeW - padding)
	      .attr("height", sizeH - padding);
	
	  cell.selectAll("circle")
	      .data(data)
	    .enter().append("circle")
	      .attr("cx", function(d) { return x(d[p.x]); })
	      .attr("cy", function(d) { return y(d[p.y]); })
	      .attr("r", 4)
	      .style("fill", function(d) { return color( eval('d.' + headerArr[headerArr.length-1]) ); });
	  
	  // ////////////////legend///////////////////////////
	  
	  var legend = svg.selectAll(".legend")
		.data(color.domain())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d ,i){ return "translate(0 ," + i * 20 + ")";});

		legend.append("rect")
		  .attr("x", width - 24)
		  .attr("width", 18)
		  .attr("height", 18)
		  .style("fill", color);

		legend.append("text")
		  .attr("x", width - 2)
		  .attr("y", 9)
		  .attr("dy", ".35em")
		  .text(function(d) { return d; });
	}
	
	var brushCell;
	
	// Clear the previously-active brush, if any.
	function brushstart(p) {
	  if (brushCell !== this) {
	    D3Chart.select(brushCell).call(brush.move, null);
	    brushCell = this;
	  x.domain(domainByTrait[p.x]);
	  y.domain(domainByTrait[p.y]);
	  }
	}
	
	// Highlight the selected circles.
	function brushmove(p) {
	  var e = D3Chart.brushSelection(this);
	  svg.selectAll("circle").classed("hidden", function(d) {
	    return !e
	      ? false
	      : (
	        e[0][0] > x(+d[p.x]) || x(+d[p.x]) > e[1][0]
	        || e[0][1] > y(+d[p.y]) || y(+d[p.y]) > e[1][1]
	      );
	  });
	}
	
	// If the brush is empty, select all circles.
	function brushend() {
	  var e = D3Chart.brushSelection(this);
	  if (e === null) svg.selectAll(".hidden").classed("hidden", false);
	}
	
	function cross(a, b) {
	  var c = [], n = a.length, m = b.length, i, j;
	  for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
	  return c;
	}
};

Core.D3Chart.BoxPlot = function( d ,paWidth ,paHeight ) {
	var dataConsole	= d.data[0];
	// var data = d.data[1];
	var header		= d.data[2];
	var datas		= d.data[4];
	var data		= [];
	var headers		= header.split(',');
	var headerLeng	= 0;

	for ( let fx=1; fx<headers.length; ++fx ) {
		if ( datas[0][headers[fx]] == 0 ) {
			let tmpColumnKey = headers[fx];
			data[fx-1]		= [];
			data[fx-1][0]	= tmpColumnKey;
			for ( let fx2=1; fx2<datas.length; ++fx2 ) {
				if ( fx2 == 1 ) {
					data[fx-1][1] = [];
				};
				data[fx-1][1].push(datas[fx2-1][tmpColumnKey]);
			};
			++headerLeng;
		};
	};

	var D3Chart = d3;
	var	margin	= {top:20, right:20, bottom:20, left:30};
	var widthF	= ( headerLeng<5 ) ? (paWidth - 25) : (paWidth - 25) + ((headerLeng - 4) * 186);
	var heightF	= (paHeight - 32);
	var widthS	= (widthF - margin.right - margin.left);
	var heightS	= (heightF - margin.top - margin.bottom);
	var width	= (widthS / (headers.length - 1));
	var height	= (heightS);

// var width = (paWidth / (headers.length - 1)) - margin.left - margin.right -
// 40;
// var height = paHeight - margin.top - margin.bottom - 40;
// var width = paWidth - 10;//(paWidth - margin.right - margin.left);
// var height = paHeight - 10;//(paHeight - margin.top - margin.bottom);

	var min		= Infinity ,max = -Infinity;
	for(var i=0; i<data.length; i++){
		for(var j=0; j<data[i][1].length; j++){
// var s = Math.floor(data[i][1][j]);
			var s = data[i][1][j];
			if(s > max) max = s;
			if(s < min) min = s;
		};
	};
	var svg		= D3Chart.select('#' + Options.Element.Process.OutputChartBoxplot.Id).append('svg')
		.attr('width'		,widthF)
		.attr('height'		,heightF)
		.attr('class'		,'box')
		.append('g')
		.attr('width'		,widthF ) // paWidth - ((margin.right +
										// margin.left) * 2) - 20)
		.attr('height'		,heightF ) // (paHeight - ((margin.top +
										// margin.bottom) *2) - 400))
		.attr('transform'	,'translate(' + margin.left + ',7)');

	var chart		= D3Chart.box().whiskers(iqr(1.5)).height(height).domain([min ,max]);
	var x			= D3Chart.scaleBand().domain(data.map(function(d){ return d[0]; })).rangeRound([0 ,widthS]);
	var y			= D3Chart.scaleLinear().domain([min,max]).rangeRound([heightS ,0]);
	var xAxis		= D3Chart.axisBottom(x);
	var yAxis		= D3Chart.axisLeft(y);
	var xCenter		= 100;
	var bandWidth	= x.bandwidth() - xCenter;

	svg.selectAll('.box')
		.data(data)
		.enter().append('g')
		.attr('width' ,width)
		.attr('transform' ,function( d ,i ){
			return 'translate(' + (x(d[0]) + (xCenter / 2)) + ',0)';
		})
		.call(chart.width( bandWidth ));

	// draw y axis
	svg.append('g')
		.attr('class' ,'y axis')
		.call(yAxis)
		.append('text')
		.attr('transform' ,'rotate(-90)')
		.attr('y' ,6)
		.attr('dy' ,'.71em')
		.style('text-anchor' ,'end')
		.style('font-size' ,'12px');

	// draw x axis
	svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + heightS + ')')
		.call(xAxis)
		.append('text')
		.attr('x', width)
		.attr('y', 10)
		.attr('dy', '.71em')
		.style('text-anchor', 'end')
		.style('font-size', '12px');
};


Core.Blockchain = {};

Core.Blockchain.ListRow = function( data ) {
	const tempRow	= data;
	const elBlockChain	= Options.Element.Blockchain.Block.El().empty();
	elBlockChain.find('.block').removeClass('on');
	let ver		= ('000' + tempRow.BCHAIN_VERSION);
		ver		= ver.substring(ver.length-4 ,ver.length);
	let el		= $i('<a/>' ,{
		href	: '#'
	,	class	: 'block on'
	,	text	: ver
	}).on( 'click mouseover' ,function(e) {
		let elEvent = $i(this);
		elEvent.addClass('on');
		Core.Blockchain.Info(tempRow);
	}).on('mouseout' ,function() {
		let elEvent = $i(this);
		elEvent.removeClass('on');
	});
	elBlockChain.append(el);
	Core.Blockchain.Info(tempRow);
};

Core.Blockchain.List = function() {
	var optionsAjax = {
		url		: Options.Uri.Ajax.Blockchain.List
	,	data	: {}
	,	success	: function( d ,e ) { Core.Blockchain.ListResponse( d ,e ); }
	};$i.Ajax(optionsAjax);
};

Core.Blockchain.ListResponse = function( d ,e ) {
	const data = d.list;
	const elBlockChain	= Options.Element.Blockchain.Block.El().empty();
	for ( let fx=0; fx<data.length; ++fx ) {
		let tempRow	= data[fx];
		let ver		= ('000' + tempRow.BCHAIN_VERSION);
			ver		= ver.substring(ver.length-4 ,ver.length);
		let cls		= '';
		if ( fx==data.length-1 ) {
			Core.Blockchain.Info(tempRow);
			cls		= ' on';
		};
		let el		= $i('<a/>' ,{
			href	: '#'
		,	class	: 'block' + cls
		,	text	: ver
		}).on( 'click mouseover' ,function(e) {
			if ( 'click'==e.type ) { Core.Blockchain.Info(tempRow); elBlockChain.find('.block').removeClass('on'); $i(this).addClass('on'); };
		});
		elBlockChain.append(el);
	};
};

Core.Blockchain.Info = function( d ) {
	let el1		= $i('<span class="key">'+lang_return("fixa.core.title081")+'</span>');  // 프로젝트명
	let el2		= $i('<span/>' ,{
		class	: 'value'
	,	text	: d.PRJCT_NM
	});
	let el3		= $i('<span class="key">'+lang_return("fixa.core.title082")+'</span>'); // 파일명
	let el4		= $i('<span/>' ,{
		class	: 'value'
	,	text	: d.REAL_FILE_NM
	});
	let el5		= $i('<span class="key">'+lang_return("fixa.core.title083")+'</span>'); // 해시코드
	let el6		= $i('<span/>' ,{
		class	: 'value'
	,	text	: d.BCHAIN_HASHCODE
	});
	let el7		= $i('<span class="key">'+lang_return("fixa.core.title084")+'</span>'); // 생성자
	let el8		= $i('<span/>' ,{
		class	: 'value'
	,	text	: d.MEMBER_ID
	});
	let el9		= $i('<span class="key">'+lang_return("fixa.core.title085")+'</span>');
	let ver		= ('000' + d.BCHAIN_VERSION);
		ver		= ver.substring(ver.length-4 ,ver.length);
	let el10	= $i('<span/>' ,{
		class	: 'value'
	,	text	: ver
	});
	Options.Element.Blockchain.Info.El().empty().append(el1).append(el2).append(el3).append(el4).append(el5).append(el6).append(el7).append(el8).append(el9).append(el10);
};


Core.Panel = {};

Core.Panel.Minimize = function( el ) {
	
	var elParentTop	= el.parent().parent().parent();
	var elContents	= elParentTop.find('.contents');
	var check		= elContents.is('._none');
	var heightTitle	= ( check ) ? '36px' : '36';
	var cls			= ( check ) ? '' : '_none';
	elContents.removeClass('_none').addClass(cls);
	elParentTop.find('.title').css('height' ,heightTitle);
	if ( elParentTop.parent().is('#' + Options.Element.Global.Console.Id) ) {
		var height	= ( check ) ? 'calc(100% - 275px)' : 'calc(100% - 82px)';
		Options.Element.Global.Content.El().css('height' ,height);
		if ( check ) {
			el.removeClass('changeTop').addClass('changeBottom');
		} else {
			el.removeClass('changeBottom').addClass('changeTop');
		};
	} else if ( elParentTop.parent().parent().is('#' + Options.Element.Global.Sidebar.Id) ) {
		var isHistory	= elParentTop.parent().is('#' + Options.Element.Global.History.Id);
		var isHisNone	= $i('#' + Options.Element.Global.History.Id + ' .contents').is('._none');
		var isChatNone	= $i('#' + Options.Element.Global.Chatbot.Id + ' .contents').is('._none');

		if ( isHisNone && isChatNone ) {
			Options.Element.Global.Contents.El().css('width' ,'calc(100% - 51px)');
			Options.Element.Global.Sidebar.El().css('width' ,'47px');
			elParentTop.parent().parent().find('.title').addClass('_none');
		} else {
			Options.Element.Global.Contents.El().css('width' ,'calc(100% - 384px)');
			Options.Element.Global.Sidebar.El().css('width' ,'372px');
			elParentTop.parent().parent().find('.title').removeClass('_none');
		};
		
		if ( isHisNone && !isChatNone ) {
		} else if ( !isHisNone && isChatNone ) {
		} else if ( !isHisNone && !isChatNone ) {
		} else if ( isHisNone && isChatNone ) {
		};
		
	
		
/*
 * if ( check ) { if( isHistory ) { $i('#arHistory').css('height' ,'calc(100% -
 * 241px)'); } else {
 *  }; el.removeClass('changeLeft').addClass('changeRight'); } else { if(
 * isHistory ) { $i('#arHistory').css('height' ,'22px'); } else {
 * $i('#arHistory').css('height' ,'calc(100% - 32px)'); };
 * 
 * if ( elParentTop.parent().parent().find('.contents._none').length > 1 ) {
 * elParentTop.parent().parent().find('.title').addClass('_none');
 *  } else { elParentTop.parent().parent().find('.title').removeClass('_none'); };
 * 
 * el.removeClass('changeRight').addClass('changeLeft'); };
 */

	};
	try{
		$.each(Object.keys(Options.Variable.slickGrid.id),function(k,v){
			Options.Variable.slickGrid.id[v].resizeCanvas();
		});
	}catch(e)
	{
		console.log(e);
	}
};

Core.Panel.Close = function( viewtype ) {
//	var elParentTop	= el.parent().parent().parent().parent();
//	var check		= elParentTop.is('._none');
//	var cls			= ( check ) ? '' : '_none';
	
	if(Options.Variable.Global.pieChart!=null){
		Options.Variable.Global.pieChart.resize()
	}

	if(viewtype=="console")
	{
		if(Number($("#arConsole").css("left").replace("px",""))==10)
		{
			$("#arConsole").animate({left:-330});
			$("#arContent .content").animate({marginLeft:0});
			//$("#right_slide_open_btn").show();
			$("#right_slide_open_btn").fadeIn(1000);
			$("#arSheet").animate({left:-328});
			
		}
		else
		{
			$("#arConsole").animate({left:10});
			$("#arContent .content").animate({marginLeft:320});
			$("#right_slide_open_btn").hide();
			$("#arSheet").animate({left:0});
		}
	}
	else if(viewtype=="open_console"){
		$("#arConsole").animate({left:10});
		$("#arContent .content").animate({marginLeft:320});
		$("#right_slide_open_btn").hide();
		$("#arSheet").animate({left:0});
	}
	else if(viewtype=='history'){
		if(Number($("#wrSidebar").css("right").replace("px",""))==10)
		{
			$("#wrSidebar").animate({right:-330});
			$("#arContent .content").animate({marginRight:0});
			
			$("#left_slide_open_btn").fadeIn(1000);
			
		}
		else
		{
			$("#wrSidebar").animate({right:10});
			$("#arContent .content").animate({marginRight:320});
			$("#left_slide_open_btn").hide();
		}
	}
	else if(viewtype=="open_history"){
		$("#wrSidebar").animate({right:10});
		$("#arContent .content").animate({marginRight:320});
		$("#left_slide_open_btn").hide();
	}
	
	
	/**
	elParentTop.removeClass('_none').addClass(cls);
	if ( elParentTop.is('#arConsole') ) {
		var height		= ( check ) ? 'calc(100% - 275px)' : 'calc(100% - 30px)';
		Options.Element.Global.Content.El().css('height' ,height);
	} else if ( elParentTop.parent().is('#wrSidebar') ) {
		var checkSidebar = ( Options.Element.Global.History.El().is('._none') && Options.Element.Global.Chatbot.El().is('._none') ) ? true : false;
		if ( checkSidebar ) {
			Options.Element.Global.Contents.El().css('width' ,'calc(100% - 12px)');
			Options.Element.Global.Sidebar.El().css('width'	,0);
		} else {
			Options.Element.Global.Contents.El().css('width' ,'calc(100% - 384px)');
			Options.Element.Global.Sidebar.El().css('width' ,'372px');
		};
	};
	**/
};





Core.Start = function( callback ) {
	Core.Tnb.Create();
	Core.Pnb.Create();
	
	/**
	 * 버튼 기능 close 기능
	 */
	$i(document).ready( function( e ) {
		Options.Element.Global.Inni.El().on( 'click' ,function( e1,e2 ) {
			
			
			
			
			if ( 'menuItem' != $i(this).attr('item-type') ) {
				
				Core.Tnb.SubmenuClose();
			};
			try{
				className = e1.target.getAttribute("class").split(" ")[0]
			}
			catch(e){
				className = "";	
			}
			
			$(".submenu").each(function(k,v){
				  className2 = $(this).parent().attr("class");
				  if(className2!=""){
					  if(className2.split(" ")[0]!=className){
						  $(this).hide();
					  }
				  }
			});
			
			
		} );
	} );

	if ( 'function' === typeof callback ) {
		callback(true);
	};
	
};

// 이상치 검출 결과 Tab별 엑셀 다운로드
Core.jexcelDown = function(){
	
	var fileName = "";
	var gridData = {};
	var dataInfoJson = new Object();
	var dataArrayJson = new Array();
	fileName = lang_return("fixa.core.title086")// "이상치 탐지 결과.xlsx";
	
	for(i=0;i<workflow_result.length;i++)
	{
		// tabName = workflow_result[i].rule_name+"("+i+")";
		tabName = workflow_result[i].rule_name+"_";
		
		/**
		 * if(workflow_result[i].result.cleanData.length>0) {
		 * 
		 * data= workflow_result[i].result.cleanData; gridData = { sheetName :
		 * tabName+"cleanData", header : columns, dataList : data }
		 * dataArrayJson.push(gridData); }
		 */
		
		if(workflow_result[i].type != "03"){
			
			if(workflow_result[i].result.eraserData.length>0 && workflow_result[i].type != "04")
			{
				data=  workflow_result[i].result.eraserData;
				gridData = {
						sheetName : tabName+lang_return("fixa.core.title087"),
						header : columns,
						dataList : data,
						dataType : workflow_result[i].type
				}
				dataArrayJson.push(gridData);
			}else{
				var tdArr = new Array();
				var aJson = new Object();
				var tr =$("#testTable tr");
				var td = tr.children();
				td.each(function(i){aJson[i] = td.eq(i).text();})
				
				console.log("tbArr : ", tbJson);
				tdArr.push(tbJson);
				tdArr.push(aJson);
				data=  workflow_result[i].result.eraserData;
				gridData = {
						sheetName : tabName+lang_return("fixa.core.title087"),
						// header : columns,
						// dataList : data,
						tbData : tdArr,
						dataType : workflow_result[i].type
				}
				dataArrayJson.push(gridData);
				
			}
		}
	}
	
	dataInfoJson.fileName = fileName;
	dataInfoJson.data = dataArrayJson;
	var jsonData = JSON.stringify(dataInfoJson);

	
	$.ajax({
	    url: '/common/jexcelDownload.fd' 
	    ,contentType: 'application/json'
	    ,async: true
	    ,type: 'POST'
	    ,data: jsonData
	    ,dataType: 'json'
	    ,success: function(data) {
	    	
	    	
	    	Core.DownFile(fileName);
	    	
	    }
		,beforeSend : function() {
			loadingBar();
		}
		, complete: function () {
			loadingprogresshide();
	        
		}
	    
	});
	
};

// 원본데이터 & 데이터 전처리 탭 엑셀 다운로드
Core.jexcelDown_ori_prep = function(){
	
	var dataInfoJson = new Object();
	var dataArrayJson = new Array();
	
	if($("#data_ori").hasClass("on") == true || $("#data_prep").hasClass("on") == true)
	{
	
		//$('#arSheet .item a').attr('id') == "data_prep")
		
		
			
			if($("#data_ori").hasClass("on") == true){
				
				var fileName = "data_ori.xlsx";
				
				
				var gridData = {
						sheetName : $("#"+$('#arSheet .item a').attr('id')).text(),
						header : slickGrid.getHeaderName(Options.Variable.slickGrid.id["oriGrid"]),
						dataList : Options.Variable.slickGrid.id["oriGrid"].getData()
				}
				dataArrayJson.push(gridData);
			}else if($("#data_prep").hasClass("on") == true){
				
				var fileName = "data_prep.xlsx";
				var gridData = {
						sheetName : $("#"+$('#arSheet .item a').attr('id')).text(),
						header : slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"]),
						dataList : Options.Variable.slickGrid.id["prepGrid"].getData()
				}
				dataArrayJson.push(gridData);
			}
			
		
		dataInfoJson.fileName = fileName;
		dataInfoJson.data = dataArrayJson;
		
		var jsonData = JSON.stringify(dataInfoJson);
		
		$.ajax({
		    url: '/common/jexcelDownload.fd' 
		    ,contentType: 'application/json'
		    ,async: true
		    ,type: 'POST'
		    ,data: jsonData
		    ,dataType: 'json'
		    ,success: function(data) {
		    	Core.DownFile(fileName);
		    	
		    }
			,beforeSend : function() {
				loadingBar();
			}
			, complete: function () {
				loadingprogresshide();
		        
			}
		    
		});
	}
	else
	{
		alert_message("cannot be used");
	}
};
Core.setTabName = function(rulename,id){
	tabName = rulename;
	tabId = id;
	// $("#"+id).css("width",$(".tab_content").width()-300+"px");
	// resizing
	
	
	
	
};
Core.getProjectDataSn = function(){
	var next_sn = "";
	$.ajax({
	    url: '/collect/getProjectDataSn.fd' 
	    ,crossDomain: true
	    ,contentType: 'application/json'
	    ,async: false
	    ,type: 'POST'
	    ,success: function(data) {
	    	next_sn = data.resultCnt;
		  
	    }
	});
	 return next_sn;
};
Core.Prep.BlockChainHistoryClick= function(paThis){
	
	var elGrid		=$("#itmHeadendGrid2 .grid-canvas");
	var evTarget	= $i(paThis);
	var indexTarget	= evTarget.parent().index();
	var indexNow	= evTarget.parent().parent().find('a.now').parent().index();
	var li			= evTarget.parent().parent().find('li');
	var property ;
	elGrid.children().find('div').css('background-color' ,'rgba(255, 255, 255, 0)');
	evTarget.parent().parent().find('a.item').removeClass('now').end().end().end().addClass('now');
	var gridData = "";
	gridData = {
			historyId: "0"
	}
	var jsonData = JSON.stringify(gridData);
	
	$.ajax({
	   url: '/prep/readJson.fd' 
	   ,contentType: 'application/json'
	   ,async: true
	   ,type: 'POST'
	   ,data: jsonData
	   ,dataType: 'json'
	   ,success: function(data) {
			// 전처리 grid에 데이터 바인딩
		    $("#mac_address").val(data.mac_address);
			slickGrid.setColumn(Options.Variable.slickGrid.id["prepGrid"], data.result.header);
			slickGrid.setData(Options.Variable.slickGrid.id["prepGrid"], data.result.data);
			Options.Variable.slickGrid.header["prepGrid"] = data.result.header;
			if(data.result.header_option==null || data.result.header_option.length==0)
			{
// Options.oriDataType = [];
				for(i=0;i<Options.Variable.slickGrid.header["prepGrid"].length;i++)
				{
					var obj = {};
					obj.name = Options.Variable.slickGrid.header["prepGrid"][i];
					obj.data_type = "char";
					Options.oriDataType[i] = obj.data_type;
					Options.Variable.slickGrid.headerOption["prepGrid"].push(obj);
				}
			}
			else
			{
// Options.oriDataType = [];
				for(i=0;i<data.result.header_option.length;i++)
				{
// Options.oriDataType[i] = data.result.header_option[i].data_type;
					Options.Variable.slickGrid.headerOption["prepGrid"].push(data.result.header_option[i]);
				}
			}
			// 작업 대기중
			Options.Variable.slickGrid.id["prepGrid"].resizeCanvas();
			Options.Variable.slickGrid.id["prepGrid"].render();
	   }
	});
	
}



/**
 * query tool
 */
Core.queryTool = function(){
	
	
	var objModal	= Core.Modal.Background();
	var elContainer	= $i('<div/>' ,{
		id		: Options.Element.Scheduling.SaveForm.Id
		,width :'1000px'
	});
	var elTitle = $i('<div/>',{
		id	 :"title",
		class : 'title'
	});
	var elContent =$i('<div/>',{
		class : 'content'
		,id : 'content'
	});
	
	
	textarea = $("<textarea/>",{id:"query","text":"select * from ? where 1=1"});
	
	
	var div = $('<div/>');
	div.append(textarea)
		.append($("<div/>",{id:"query_result_message","style":"width:970px","text":"no search results"}))
		.append($("<div/>",{id:"query_result","style":"width:970px"}));
	elContent.html(div);

	
	
	var elButtonOk	= $i('<a/>' ,{
		class	: 'button'
	,	text	: 'run'
	,	href	: '#'
	}).on('click' ,function() {
	
		var options = {
				  enableCellNavigation: true,
				  enableColumnReorder: false,
				  asyncEditorLoading: false,
				  /** col 수정 가능 여부* */
				  editable: true,
				  forceFitColumns: false,
				  // showHeaderRow: true,
				  enableAddRow: false,
				  autoEdit: false,
				  editCommandHandler: queueAndExecuteCommand
				};
		
			var data1 = [];
			var columns = [];
			Options.Variable.slickGrid.id["query"] = slickGrid.init(options, Options.Variable.slickGrid.id["query"], "query_result", columns, data1);
			
		try{
			result = alasql($("#query").val(),[Options.Variable.slickGrid.id["prepGrid"].getData()]);
		
			if(result.length>0){
				slickGrid.setData(Options.Variable.slickGrid.id["query"],result);
				slickGrid.setSqlQueryColumn(Options.Variable.slickGrid.id["query"],Object.keys(result[0]));
				$("#query_result").show();
				$("#query_result_message").hide();
			}
			else
			{
				$("#query_result_message").text("no search results");
				$("#query_result_message").show();
				$("#query_result").hide();
			}

		}
		catch(e)
		{
			$("#query_result_message").text(""+e);
			$("#query_result_message").show();
			$("#query_result").hide();
			console.log("err"+e);
		}
		
		
	
		
		
		return false;
		
	} );

	var elButtonCancle	= $i('<a/>' ,{
		class	: 'button'
	,	text	: lang_return("fixa.core.title059")// '닫기'
	,	href	: '#'
	}).on('click' ,function() {
		Core.Modal.Close();
		return false;
	} );
	var elButtonBox	= $i('<div/>' ,{
		class	: 'itmButton'
	})
	.append(elButtonCancle).append(elButtonOk);
	
	elTitle.append($("<div/>",{"class":"tab_btn_left"}));
	elTitle.append($("<a/>",{"text":"query tool"}));
	elTitle.append($("<div/>",{"class":"tab_btn_right"}));
	
	elContainer.append(elTitle).append(Core.tabbar4()).append(elContent).append(elButtonBox);
	objModal.html(elContainer);
	Options.Element.Global.Inni.El().append(objModal);
	Options.Element.Scheduling.SaveForm.El().SetForm();
	Core.scheduling.Time();
	
}


})(inni);


