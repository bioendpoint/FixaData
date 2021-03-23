<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

	<script src="/fixadata-common/plugin/slickgrid/jquery-1.7.min.js"></script>
	<script src="/fixadata-common/plugin/slickgrid/jquery.event.drag-2.2.js"></script>
	<script src="/fixadata-common/plugin/slickgrid/slick.core.js"></script>
	<script src="/fixadata-common/plugin/slickgrid/slick.grid.js"></script>
	<script src="/fixadata-common/plugin/slickgrid/slick.dataview.js"></script>
	<script src="/fixadata-common/plugin/slickgrid/slick.formatters.js"></script>
	<script src="/fixadata-common/plugin/slickgrid/slick.editors.js"></script>
	<script src="/fixadata-common/plugin/slickgrid/slick.grid.js"></script>
	<link rel="stylesheet" href="/fixadata-common/plugin/slickgrid/slick.grid.css" type="text/css"/>
	<link rel="stylesheet" href="/fixadata-common/plugin/slickgrid/slick-default-theme.css" type="text/css"/>
  	<link rel="stylesheet" href="/fixadata-common/plugin/slickgrid/examples.css" type="text/css"/>
  	
  	 <style>
	    .slick-headerrow-column {
	      background: #87ceeb;
	      text-overflow: clip;
	      -moz-box-sizing: border-box;
	      box-sizing: border-box;
	    }
	    .slick-headerrow-column input {
	      margin: 0;
	      padding: 0;
	      width: 100%;
	      height: 100%;
	      -moz-box-sizing: border-box;
	      box-sizing: border-box;
	    }
	 </style>
	</head>
<body>

<a href='#' onClick='getData()'>전체테데이터 출력</a>
<a href='#' onClick='getColumn()'>header 출력</a>
<a href='#' onClick='regTest()'>정규식 테스트</a>

<table width='1000px' border='1'>
	<tr>
		<td>컬럼 선택</td>
		<td>정규식</td>
	</tr>
	<tr>
		<td><input type='text' id="columnfield"  name='columnfield' value='f2,f5'></select></td>
		
		<td><input type='text' name='regexp' style="width:100%" value='^[a-zA-Z0-9]*$'/></td>
	</tr>
	<tr>
		<td colspan="2" align="right"><button onClick='regexpTest()'>정규식 테스트</button></td>
	</tr>
</table>

<div id="myGrid" style="width:1000px;height:500px;"></div>
<script>
	
  var columnFilters = {};
  var grid;
  var columns = [
    {id: "title", name: "Title", field: "title",editor: Slick.Editors.Text},
    {id: "duration", name: "Duration", field: "duration",editor: Slick.Editors.Text},
    {id: "%", name: "% Complete", field: "percentComplete", editor: Slick.Editors.Text},
    {id: "start", name: "Start", field: "start",editor: Slick.Editors.Text},
    {id: "finish", name: "Finish", field: "finish" ,editor: Slick.Editors.Text},
    {id: "effort-driven", name: "Effort Driven", field: "effortDriven" ,editor: Slick.Editors.Text }
  ];

  var options = {
    enableCellNavigation: true,
    enableColumnReorder: false,
    asyncEditorLoading: false,
    editable: true,
    //showHeaderRow: true,
    
  };

  $(function () {
    var data = [];
    for (var i = 0; i < 5000000; i++) {
      data[i] = {
        title: "Task " + i,
        duration: "5 days",
        percentComplete: Math.round(Math.random() * 100),
        start: "01/01/2009",
        finish: "01/05/2009",
        effortDriven: (i % 5 == 0)
      };
    }

    grid = new Slick.Grid("#myGrid", data, columns, options);
  });

  /**
	 slickgrid set data test....
	**/
	function timer(func) {
	    var start = new Date().getTime();
	    /* 측정할 연산을 수행한다. -> 함수로 바꿉니다 */
	    func();
	    var elapsed = new Date().getTime() - start;
	    console.log(elapsed/1000)
	    return elapsed;
	}
	
	window.onload = function()
	{
		timer(loadData);
	}
	
	function loadData()
	{
		$.ajax({
		    url: '/test/slickTestList.fd' 
		    ,async: false
		    ,type: 'GET'
		    ,dataType: 'json'
		    ,success: function(data) {
		    	
		    	var ss=[];
		    	
		    	for(i=0;data.result.length;i++)
		    	{
		    		
		    		ss.push(data.result[i]);
		    	
		    		if(i>10000)
		    		{
		    			break;
		    		}
		    	}
				setColumn(grid, Object.keys(data.result[0]));
				setData(grid, ss);
		    }
		});
	}

	function setData(id, data)
	{
		id.setData(data);
		id.render();
	}
	
	/**
	컬럼 지정 테스트
	**/
	function setColumn(id, header)
	{
		var columns = new Array;
		
		$.each(header, function(k,v){
			
			var defaultField = {id: "column1", name: "title", field: "column1", sortable:false, editor: Slick.Editors.Text};
			defaultField.id=v;
			defaultField.name=v;
			defaultField.field=v;
			columns.push( defaultField );
		});
		
		console.log(columns);
		id.setColumns(columns);
		
		$("#columnfield option").remove();
		$.each(columns, function(index, item){
			
			$("#columnfield").append("<option value='"+item.name+"'>"+item.name+"</option>");
			
		}); 
	}
	
	/**
	전체 테디어터 출력
	**/
	function getData()
	{
		console.log(grid.getData());
	}
	
	function getColumn()
	{
		console.log(grid.getColumns());
	}
	
	
	/**
	정규식 테스트
	**/
	function regTest()
	{	
		alert('test');		
	}
	
	
	/**
	정규식 테스트
	**/
	function regexpTest(){
		
//		console.log(grid.getData());
		console.log(grid.getData());
		
		var dataList = grid.getData();
		var tmp = {};
		
		tmp["data"] = dataList;
		tmp['regexp'] = $("input[name='regexp']").val();
		tmp['field'] = $("#columnfield").val();

		$.ajax({
		    url: '/test/regexp.fd' 
		    ,crossDomain: true
		    ,contentType: 'application/json'
		    ,async: false
		    ,type: 'POST'
		    ,data: JSON.stringify(tmp)
		    ,dataType: 'json'
		    ,success: function(data) {
		    	console.log(data);

		    	setData(grid, data['result']['cleanData']);
		    	alert("삭제 데이터 "+JSON.stringify(data['result']['eraserData']));
		    	alert("삭제이유"+JSON.stringify(data['result']['reasonData']));
		    }
		});
	}

</script>

</body>
</html>