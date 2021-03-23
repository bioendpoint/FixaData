
/**
 * 공통 rest 요청
 * 
 * @param url
 * @param method
 * @param param
 * @param callbackSuccess
 * @returns
 */
function restRequest(url, method, param, callbackSuccess) 
{
	
	$.ajax({
		type: method
		,async: false
		,url : url
		,dataType : "json"
		,data : param
		,success : function(rtnData){
			callbackSuccess(rtnData);
		}
	});
}

var footTop=$(".foot_area").css("top");
function restRequestLoading(url, method, param, callbackSuccess) 
{
	footTop= $(".foot_area").css("top");
	console.log("top...",$(".foot_area").css("top"));
	loadingBar();
	$.ajax({
		type: method
		,async: true
		,url : url
		,dataType : "json"
		,data : param
		,success : function(rtnData){
			callbackSuccess(rtnData);
		}
		,beforeSend : function() {
			// loadingBar();
		}
		, complete: function () {
			loadingprogresshide();
            
		}

	});
}

function restRequestLoading2(url, method, param, callbackSuccess) 
{
	$.ajax({
		type: method
		,async: true
		,url : url
		,dataType : "json"
		,data : param
		,success : function(rtnData){
			callbackSuccess(rtnData);
		}
		,beforeSend : function() {
			loadingBar();
		}
		, complete: function () {
			loadingprogresshide();
			Core.Modal.Close();
            
		}

	});
}

function loadingBar(){
	
		
		
		var width = 0;
        var height = 0;
        var left = 0;
        var top = 0;

        width = 50;
        height = 50;
        
       $(".progress_bar").css("z-index","999999");
       if(window.location.href.split("datainput").length>1){
            loadingcommon();
       }
       else
       {
    	   
	        if($(".content.output.on").width()==undefined)
	        {
	        	left = ($("#itmDiagramCanvas").position().left+$("#itmDiagramCanvas").width()/2)-80;
				top = ($("#itmDiagramCanvas").position().top+$("#itmDiagramCanvas").height()/2);
	        }
	        else if($(".content.output.on").width()>=0)
	        {
	        	left = ($(".content.output.on").position().left+$(".content.output.on").width()/2)-80;
				top = ($(".content.output.on").position().top+$(".content.output.on").height()/2);
	        }
	        else
	        {
	        	top = ( $(window).height() - height ) / 2 + $(window).scrollTop();
	            left = ( $(window).width() - width ) / 2 + $(window).scrollLeft();
	        }
	        
	        loadingcommon();
	        
       } 
        // $("body #wrap").css("filter","blur(1px)");
}

function loadingcommon(){
	if($("#div_ajax_load_image").length != 0) {
   	 
   	 $("#progress_img").hide();
        $("#progress_img2").show();
        
        $("#progress_img2").css("z-index",199999);
      // $("#progress_img").attr("src","/fixadata-common/images/slider_loding.gif");
      $("#div_ajax_load_image").show();
      
      $(".foot_area").css("top",footTop);
      
   }
}

function loadingprogresshide()
{
	$(".progress_bar").css("z-index","999");
	$("#progress_img").show();
    $("#progress_img2").hide();
	$("#div_ajax_load_image").hide();	
    $("body #wrap").css("filter","");
    $("#progress_img").attr("src","/fixadata-common/images/slider_loding.png");
    $("#progress_img").css("z-index","");
    $(".foot_area").css("top","");
}

function loadingBar2(){
	
	
	
	var width = 0;
    var height = 0;
    var left = 0;
    var top = 0;

    width = 50;
    height = 50;


    top = ( $(window).height() - height ) / 2 + $(window).scrollTop();
    left = ( $(window).width() - width ) / 2 + $(window).scrollLeft();
    $("body #wrap").css("filter","blur(1px)");
    if($("#div_ajax_load_image2").length != 0) {
       $("#div_ajax_load_image2").css({
              "top": top+"px",
              "left": left+"px"
       });
       $("#div_ajax_load_image2").show();
    }

}

function loadingprogresshide2()
{
	$("#div_ajax_load_image2").hide();
    $("#div_ajax_load_image2").css({
  	  "display": "none",
    });	
    $("body #wrap").css("filter","");
}

/**
 * requeybody호출용(restapi)
 * 
 * @param url
 * @param method
 * @param param
 * @param callbackSuccess
 * @returns
 */

function restRequestBody(url, method, param, callbackSuccess)
{
	
	if(IsJsonString(param)==true)
	{
		// param = JSON.stringify(param);
		// console.log("param",param);
	}
	
	$.ajax({
	    url: url 
	    ,crossDomain: true
	    ,contentType: 'application/json'
	    ,async: false
	    ,type: method
	    ,data: param
	    ,dataType: 'json'
	    ,success: function(rtnData) {
	    	callbackSuccess(rtnData);
	    }
	    
	});
}

function restRequestBody2(url, method, param, callbackSuccess)
{
	
	if(IsJsonString(param)==true)
	{
		// param = JSON.stringify(param);
		// console.log("param",param);
	}
	
	
	
	$.ajax({
	    url: url 
	    ,crossDomain: true
	    ,contentType: 'application/json'
	    ,async: true
	    ,type: method
	    ,data: param
	    ,dataType: 'json'
	    ,success: function(rtnData) {
	    	callbackSuccess(rtnData);
	    }
    	,beforeSend : function() {
			loadingBar();
		}
		, complete: function () {
			loadingprogresshide();
            
		}
	});
}


/**
 * json타입인지 체크 하는 합수
 * 
 * @param str
 * @returns
 */
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


var slickGrid = {};
slickGrid.datarow= {};


/**
 * slick grid 초기화
 */

slickGrid.init = function(option, grid, bindingId, columns, data){

	
	slickGrid.datarow[grid] = [];
	
 	var options = {
		    enableCellNavigation: true,
		    enableColumnReorder: false,
		    asyncEditorLoading: false,
		    editable: true,
		    rerenderOnResize:true,
		    enableAsyncPostRender: true,
		    forceFitColumns:false,
		    multiColumnSort: true

	};
 	
 	
 	dataView = new Slick.Data.DataView({ inlineFilters: true });
 	

 	
 	if(option!=null)
 	{
 		options = option;
 	}
 	
 	grid = new Slick.Grid("#"+bindingId, dataView, columns, options);
 	
 	
 	grid.onSort.subscribe(function (e, args) {
 	      var cols = args.sortCols;

 	      data.sort(function (dataRow1, dataRow2) {
 	        for (var i = 0, l = cols.length; i < l; i++) {
 	          var field = cols[i].sortCol.field;
 	          var sign = cols[i].sortAsc ? 1 : -1;
 	          var value1 = dataRow1[field], value2 = dataRow2[field];
 	          var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
 	          if (result != 0) {
 	            return result;
 	          }
 	        }
 	        return 0;
 	      });
 	
 	});
 	
 	grid.registerPlugin( new Slick.AutoColumnSize());
    grid.render();

 	grid.init();
 	grid.resizeCanvas();
 	
 	
 	
 	return grid;
}


/**
 * 데이터 추출
 */
slickGrid.getData = function(id){
	console.log(id);
	return id.getData();
}


/**
 * 헤더 데이터 추출
 */
slickGrid.getHeader = function(id){
	return id.getColumns();
}

/**
 * 헤더 데이터중 name 값만 array 로 리턴
 */
slickGrid.getHeaderName = function(id){
	var header = slickGrid.getHeader(id);
	var result  = new Array();
	for(i=0;i<header.length;i++)
	{
		result.push(header[i]['name']);
	}
	
	return result;
}



/**
 * 데이터 바인디
 */
slickGrid.setData = function(gridId, data) 
{
	
	gridId.setData(data);
	gridId.render();

}

/**
 * 컬럼 전체를 read only 처리
 */
slickGrid.setColumnReadOnly = function (gridId, header)
{
	var columns = new Array;
	
	$.each(header, function(k,v){
		var defaultField = "";
		// idx의 경우 무조건 readonly 형태로
		defaultField = {id: "column1", name: "title", field: "column1", sortable:false, editor: false, cssClass:"left-align",headerCssClass: "center-align",formatter: formatter};	
		defaultField.id=v;
		defaultField.name=v;
		defaultField.field=v;
		
		columns.push( defaultField );
	});
	gridId.setColumns(columns);
	gridId.render();
}

/**
 * sql query 용 컬럼
 */
slickGrid.setSqlQueryColumn = function (gridId, header)
{
	var columns = new Array;
	
	$.each(header, function(k,v){
		var defaultField = "";
		// idx의 경우 무조건 readonly 형태로
		defaultField = {id: "column1", name: "title", field: "column1", sortable:false, editor: false, cssClass:"left-align",headerCssClass: "center-align"};	
		defaultField.id=v;
		defaultField.name=v;
		defaultField.field=v;
		
		columns.push( defaultField );
	});
	gridId.setColumns(columns);
	gridId.render();
}

function AddComma2(dataValue) {
	  
	  var separateValue = Number(dataValue).toLocaleString('en');
	  
	  if (separateValue == 'NaN') {
	    return '';
	  }
	  return separateValue;
}

function AddComma(obj) {
    var regx = new RegExp(/(-?\d+)(\d{3})/);
    var bExists = obj.indexOf(".", 0);// 0번째부터 .을 찾는다.
    var strArr = obj.split('.');
    while (regx.test(strArr[0])) {// 문자열에 정규식 특수문자가 포함되어 있는지 체크
        // 정수 부분에만 콤마 달기
        strArr[0] = strArr[0].replace(regx, "$1,$2");// 콤마추가하기
    }
    if (bExists > -1) {
        // . 소수점 문자열이 발견되지 않을 경우 -1 반환
        obj = strArr[0] + "." + strArr[1];
    } else { // 정수만 있을경우 //소수점 문자열 존재하면 양수 반환
        obj = strArr[0];
    }
    return obj;// 문자열 반환
}


/**
 * 숫자일때 comma 추가 formatter
 * 
 * @param row
 * @param cell
 * @param value
 * @param columnDef
 * @param dataContext
 * @returns
 */
function formatter(row, cell, value, columnDef, dataContext, e) {

// console.log("1row/cell", row, cell);
// console.log(dataContext);
// console.log("e",columnDef.name);
	

		temp = value+"";
		
		if(temp.indexOf("href='")>0)
		{
			if(temp.substr(temp.indexOf("href='")+6,1)!='#')
			{
				value = temp.replace("href='","href='#");
			}
			  
		}
		else if(temp.indexOf('href="')>0)
		{
			if(temp.substr(temp.indexOf('href="')+6,1)!='#')
			{
				value = temp.replace('href="','href="#');
			}
		}

	
	if($("#data_prep").attr("class")=="on")
	{
		if($("#strdHeaderList").length>0){
			return value;
		}else{
			
			
			data_type = Options.Variable.slickGrid.headerOption["prepGrid"].filter(it=>it.name==columnDef.name)[0]["data_type"];
			// console.log(data_type);
			if(data_type=="number")
			{
				// return value;
				if(value==undefined|| value==null && value==true || value==false || value==Infinity)
				{
					return value;
				}
				
				else if(!isNaN(value)==true)
				{
					return AddComma(value+"");
				}
				
				else
				{
					return value;
				}
			}
			else if(data_type=="date")
			{
				return value;
			}
			else if(data_type=="label")
			{
				return value;
			}
			else 
			{	
				return value;
			}
		}
	}
	else
	{
		/**
		 * if(value==undefined|| value==null && value==true || value==false ||
		 * value==Infinity) { return value; } else if(!isNaN(value)==true) {
		 * return AddComma(value); } else { return value; }
		 */
		return value;
	}
	
	/**
	 * real_row = row + 1;
	 * 
	 * $("#oriGrid > div.slick-pane.slick-pane-top.slick-pane-left >
	 * div.slick-viewport.slick-viewport-top.slick-viewport-left > div >
	 * div.ui-widget-content.slick-row.odd.left-align").each(function(k,v){ row_ =
	 * (Number($(this).attr("style").substr(4,1000).split("px")[0])+25)/25;
	 * 
	 * 
	 * if(row_==row) { console.log(real_row);
	 * $(this).children("div").each(function(k1,v1){
	 * console.log("test1",$(this).text()); }); }
	 * 
	 * });
	 */
	
	
	
	// $("#prepGrid > div.slick-pane.slick-pane-top.slick-pane-left >
	// div.slick-viewport.slick-viewport-top.slick-viewport-left > div >
	// div:nth-child("+row+") >
	// div.slick-cell.l"+cell+".r"+cell+")").removeClass('right-align').addClass('left-align');
	// $("#prepGrid > div.slick-pane.slick-pane-top.slick-pane-left >
	// div.slick-viewport.slick-viewport-top.slick-viewport-left > div >
	// div:nth-child("+real_row+") >
	// div.slick-cell.l6.r6").removeClass("right-align").addClass("left-align")
	// https://stackoverflow.com/questions/2742166/how-to-add-a-class-to-a-cell-in-slickgrid/18408129
	
	
	// var cellCss = "slick-cell l" + cell + " r" + Math.min(columns.length - 1,
	// cell + colspan - 1) +(m.cssClass ? " " + m.cssClass : "");
	
}


/**
 * 컬럼 지정
 */
slickGrid.setColumn = function (gridId, header)
{
	
	var columns = new Array;
	$.each(header, function(k,v){
		var defaultField = "";
		
		
		// idx의 경우 무조건 readonly 형태로
		if(v=="idx")
		{
			defaultField = {id: "column1", name: "title", field: "column1", sortable:false, editor: false,cssClass: "left-align", headerCssClass: "center-align"};	
		}
		else
		{
			defaultField = {id: "column1", name: "title", field: "column1", sortable:false, cssClass:"left-align" ,headerCssClass: "center-align",editor: Slick.Editors.Text, formatter: formatter};
		}
		
		
		defaultField.id=v;
		defaultField.name=v;
		defaultField.field=v;
		columns.push( defaultField );
	});
	gridId.setColumns(columns);
	gridId.render();
}

/**
 * column option 변경
 */
slickGrid.setColumnOption = function(gridId, options){

}


/**
 * 정렬관련
 */
slickGrid.sort = function(){
	
}



slickGrid.isNumber = function(list, field)
{
	var result = true;
	if(list.length>0)
	{
		for(i=0;i<list.length;i++)
		{
			var v =list[i][field];
			
			if(Number(v)==NaN || v.toString()=="" || v==undefined)
			{
				result = false;
				break;
			}
		}
	}
	else
	{
		result = false;
	}
	
	return result;	
}

slickGrid.isInt = function(list, field)
{
	var result = true;
	if(list.length>0)
	{
		for(i=0;i<list.length;i++)
		{
			console.log(i,list[i][field]);
			if(Number.isInteger(Number(list[i][field]))==false )
			{
				result = false;
				break;
			}
		}
	}
	else
	{
		result = false;
	}
	
	return result;
}


slickGrid.isFloat = function(list, field)
{
	var result = true;
	if(list.length>0)
	{
		for(i=0;i<list.length;i++)
		{
			if(isFloat(Number(list[i][field]))==false)
			{
				result = false;
				break;
			}
		}
	}
	else
	{
		result = false;
	}
	
	return result;
}

/**
 * 날짜 형식인지 확인
 */
slickGrid.isDate = function(list, field)
{
	var result = true;
	if(list.length>0)
	{
		for(i=0;i<list.length;i++)
		{
			if(isDate(list[i][field])==false)
			{
				result = false;
				break;
			}
		}
	}
	else
	{
		result = false;
	}
	
	return result;
}




function isFloat(x) { 
	return !!(x % 1); 
}

/**
 * slickgrid sorting 용
 * 
 * @param value
 * @returns
 */
function isNumber2(value)
{
	var result = true;
	if(Number(value)==NaN || value.toString()=="" || value==undefined )
	 {
	 	result = false;
 	 }
	return result;
}

function isDate(value) {
	
	
	if(value=="" || value ==undefined)
	{
		return false;
	}
	else
	{
		switch (typeof value) {
			case 'string':
				if(value.length>=8)
				{
					return !isNaN(Date.parse(value));
				}
				else
				{
					return false;
				}
	        case 'object':
	            if (value instanceof Date) {
	                return !isNaN(value.getTime());
	            }
	        
	        default:
	            return false;
	    }
	}
}
function getUUID() { // UUID v4 generator in JavaScript (RFC4122 compliant)
	  return 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 3 | 8);
	    return v.toString(16);
	  });
	}


/**
 * alert 메시지 모음
 */

function alertBox(txt, callbackMethod, jsonData){
    modal({
        type: 'alert',
        title: 'alert',
        text: txt,
        callback: function(result){
            if(callbackMethod){
                callbackMethod(jsonData);
            }
        }
    });
}
 
function alertBoxFocus(txt, obj){
    modal({
        type: 'alert',
        title: 'alert',
        text: txt,
        callback: function(result){
            obj.focus();
        }
    });
}
 
    
function confirmBox(txt,callbackMethod){
    var result = true;
	modal({
        type: 'confirm',
        title: 'confirm',
        text: txt,
        autoclose: false,
        closeClick: false,
        callback: function(result) {
        	
        	console.log("result",result);
        	
        	callbackMethod(result);
            
        }
	
    });
	return result;
}

function promptBox(txt, callbackMethod, jsonData){
    modal({
        type: 'prompt',
        title: 'Prompt',
        text: txt,
        callback: function(result) {
            if(result){
                callbackMethod(jsonData);
            }
        }
    });
}
 
function successBox(txt){
    modal({
        type: 'success',
        title: 'Success',
        text: txt
    });
}
 
function warningBox(txt){
    modal({
        type: 'warning',
        title: 'Warning',
        text: txt,
        center: false
    });
}
 
function infoBox(txt){
    modal({
        type: 'info',
        title: 'Info',
        text: txt,
        autoclose: false
    });
}

function infoBox2(txt){
	console.log("text",txt);
    modal({
        type: 'info',
        title: 'alert',
        modal: true,
        text: txt,
        autoclose: false,
        closeClick: false
    });
}

 
function errorBox(txt){
    modal({
        type: 'error',
        title: 'Error',
        text: txt
    });
}
 
function invertedBox(txt){
    modal({
        type: 'inverted',
        title: 'Inverted',
        text: txt
    });
}
 
function primaryBox(txt){
    modal({
        type: 'primary',
        title: 'Primary',
        text: txt
    });
}

function alert_message(message)
{
	return infoBox2(message);
}


/**
 * 앞에 특정값 붙이기
 * 
 * @param n
 * @param width
 * @returns
 */
function numberPad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}


function sorterStringCompare(a, b) {
    var x = a[sortcol], y = b[sortcol];
    return sortdir * (x === y ? 0 : (x > y ? 1 : -1));
}
function sorterNumeric(a, b) {
    var x = (isNaN(a[sortcol]) || a[sortcol] === "" || a[sortcol] === null) ? -99e+10 : parseFloat(a[sortcol]);
    var y = (isNaN(b[sortcol]) || b[sortcol] === "" || b[sortcol] === null) ? -99e+10 : parseFloat(b[sortcol]);
    return sortdir * (x === y ? 0 : (x > y ? 1 : -1));
}
function sorterRating(a, b) {
    var xrow = a[sortcol], yrow = b[sortcol];
    var x = xrow[3], y = yrow[3];
    return sortdir * (x === y ? 0 : (x > y ? 1 : -1));
}
function sorterDateIso(a, b) {
    var regex_a = new RegExp("^((19[1-9][1-9])|([2][01][0-9]))\\d-([0]\\d|[1][0-2])-([0-2]\\d|[3][0-1])(\\s([0]\\d|[1][0-2])(\\:[0-5]\\d){1,2}(\\:[0-5]\\d){1,2})?$", "gi");
    var regex_b = new RegExp("^((19[1-9][1-9])|([2][01][0-9]))\\d-([0]\\d|[1][0-2])-([0-2]\\d|[3][0-1])(\\s([0]\\d|[1][0-2])(\\:[0-5]\\d){1,2}(\\:[0-5]\\d){1,2})?$", "gi");

    if (regex_a.test(a[sortcol]) && regex_b.test(b[sortcol])) {
        var date_a = new Date(a[sortcol]);
        var date_b = new Date(b[sortcol]);
        var diff = date_a.getTime() - date_b.getTime();
        return sortdir * (diff === 0 ? 0 : (date_a > date_b ? 1 : -1));
    }
    else {
        var x = a[sortcol], y = b[sortcol];
        return sortdir * (x === y ? 0 : (x > y ? 1 : -1));
    }
}

