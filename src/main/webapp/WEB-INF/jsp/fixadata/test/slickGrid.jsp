<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

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
<div id="myGrid" style="width:900px;height:500px;"></div>
<script>
  var columnFilters = {};
  var grid;
  var options = {
    enableCellNavigation: true,
    enableColumnReorder: false,
    asyncEditorLoading: false,
    editable: true,
    //showHeaderRow: true,
  };

  $(function () {
	var columns = [];
    var data = [];
    grid = slickGrid.init(options, grid, "myGrid", columns, data)
   
  });

  
  /**
	 slickgrid set data test....
	**/
	function timer(func) {
	    var start = new Date().getTime();
	    /* 측정할 연산을 수행한다. -> 함수로 바꿉니다 */
	    func();
	    var elapsed = new Date().getTime() - start;
	    console.log("수행시간"+elapsed/1000)
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
		    	
		    	
		    	console.log(data);
		    	
		    	slickGrid.setColumn(grid, Object.keys(data.result[0]));
				slickGrid.setData(grid, data.result);
		    }
		});
	}

	
	/**
	전체 테디어터 출력
	**/
	function getData()
	{
		alert(JSON.stringify(slickGrid.getData(grid)));
		console.log(slickGrid.getData(grid));
	}
	
	function getColumn()
	{
		alert(JSON.stringify(slickGrid.getHeader(grid)));
		console.log(slickGrid.getHeader(grid));
	}
  
</script>

</body>
</html>