<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

	<script src="/fixadata-common/plugin/slickgrid/jquery-1.7.min.js"></script>
	<script src="/fixadata-common/plugin/slickgrid/jquery.event.drag-2.2.js"></script>
	<script src="/fixadata-common/plugin/slickgrid/slick.core.js"></script>
	<script src="/fixadata-common/plugin/slickgrid/slick.grid.js"></script>
	
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
	<table width='95%'>
		<colgroup>
			<col width="200px"/>
			<col width="*"/> 
		
		</colgroup>
		<tr> 
			<td><a href='/test/test.fd'>slick Grid List sample</a></td>
			<td>샘플페이지</td>
		</tr>
		
		<tr>
			<td><a href='/collect/uploadFormFile.fd'>uploadFormFile sample</a></td>
			<td>파일 업로드 샘플페이지</td>
		</tr>
		<tr>
		
			<td><a href='/collect/dbForm.fd'> uploadFormDb sample</a></td>
			<td>데이터베이스 접속및 데이터 추출 페이지</td>
		</tr>
		<tr>
			<td><a href='/test/jsonTest.fd'> json string 변환 테스트</a></td>
			<td>list<hashmap> -> json string</td>
		</tr>
		<tr>
			<td><a href='/test/jsonTest2.fd'> json db입력 테스트</a></td>
			<td>db select -> jsonstring -> insert db -> select db 과정 테스트</td>
		</tr>
		<tr>
			<td><a href='/test/regexp.fd'> 정규식 테스트</a></td>
			<td>slick grid 의 데이터를 정규식에 서 처리하는 테스트</td>
		</tr>
		<tr>
			<td><a href='/collect/uploadFormFile2.fd'> 샘플데이터 업로드용</a></td>
			<td>샘플파일 json저장을 위한 임시</td>
		</tr>
		
	</table>
</body>
</html>