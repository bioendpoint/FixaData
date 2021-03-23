var f2collect = {};
	

	f2collect.type = function (type)
	{
	
	}
	
	/**
	파일 업로드
	**/
 	f2collect.uploadFile = function()
	{
 		document.uploadFileFrm.collect_flag.value = "file";
		document.uploadFileFrm.action = '/collect/collectUploadProcess.fd';
		document.uploadFileFrm.submit();
	} 
	
	/**
		db_sn : 데이터 베이스 접속 정보
		table : 데이터베이스 명
		limit : 수집 사이즈
		file_key : 해당 필드기준으로 limit 처리 함
	**/
 	f2collect.uploadDb = function(db_sn, table, limit, field_key, ord)
 	{
			
			$("input[name='db_sn']").val(db_sn);
			$("input[name='table']").val(table);
			$("input[name='limit']").val(limit);
			$("input[name='field_key']").val(field_key);
			$("input[name='ord']").val(field_key);
			
			document.uploadDbFrm.collect_flag.value = "db";
			document.uploadDbFrm.action = '/collect/collectUploadProcess.fd';
			document.uploadDbFrm.submit();
 	}
	
 	
 	f2collect.insertOpenApiCollect = function(frmData){
 		
 		param = JSON.stringify(frmData);
 		 		
 		restRequestBody2("/collect/insertCollectOpenApi.fd","POST",param, function(data1){
 			location.href  = "/prep/prep.fd";
 		});
 	}
 	
	/**
		데이터 베이스 입력 
	**/
	f2collect.insertDbConnectionInfo = function ()
	{
		if($("input[name='url']").val()=="" ||$("input[name='id']").val()=="" || $("input[name='pw']").val()=="")
		{
			alert(lang_return("fixa.datainput.title12"));
			return ;
		}
		else
		{
			
			var param = $("#dbinfo").serialize();
			
			console.log(param);
			
			//접속 테스트 실행
			restRequest("/collect/dbConnectionCheck.fd", "POST", param,function(data){
				
				console.log("data",data);
				if(data.result=="success")
				{
					
						restRequest("/collect/insertDbInfo.fd","POST",param, function(data1){
						console.log("data1",data1);
							if(data1.result=="success")
							{
								f2collect.listBinding();
							}
					});
				}
				else
				{
					alert(lang_return("fixa.core.title189"));
					return ;
				}
			});
		}
			
	}
	
	/**
	 데이터베이스의 테이블 정보 추출
	**/
	f2collect.showtables = function(db_sn){
		
		var param = "db_sn="+db_sn;
		restRequest("/collect/showTableInfo.fd","POST",param, function(data1){
			
			var html = "";
			var tableData = "";
			for(i=0;i<data1.tableList.length;i++)
			{
					
				//tableData = tableData +"<li onClick=\"f2collect.checkTable('"+data1.tableList[i]['TABLE_NAME']+"','"+db_sn+"')\">"+data1.tableList[i]['TABLE_NAME']+"</li>";
				
				html = html + f2collect.tableCardHtml(db_sn, data1.tableList[i]['TABLE_NAME']);
				
			}
			
			
			$("#tableList").html(html);
			
			  $('.layerpop').css("position", "absolute");
			    //영역 가운에데 레이어를 뛰우기 위해 위치 계산 
			    $('.layerpop').css("top",(($(window).height() - $('.layerpop').outerHeight()) / 2) + $(window).scrollTop());
			    $('.layerpop').css("left",(($(window).width() - $('.layerpop').outerWidth()) / 2) + $(window).scrollLeft());
			    $('.layerpop').draggable();
			    $('#layerbox').show();
				
		});
	}
	
	
	/**
	테이블 체크 및 field정보 추출
	**/
	f2collect.checkTable = function(table,db_sn)
	{
		
		$( '#fieldList > tbody').empty();
		
		var param = "db_sn="+db_sn+"&table="+table;
		
		console.log(param);
		
		
		restRequest("/collect/checkTable.fd","POST",param, function(data1){
			
			console.log(data1);
			if(data1.result.totalCnt>10000)
			{
				alert(lang_return2("fixa.core.title236",totalCnt));
			}
			
			var tr = "";
			
			for(i=0;i<data1.result.fieldList.length;i++)
			{
				field = data1.result.fieldList[i]['COLUMN_NAME'];
				type = data1.result.fieldList[i]['DATA_TYPE'];
				
				tr = "<tr style='cursor: pointer;' onClick=\"f2collect.dataLoad('"+db_sn+"','"+table+"','"+field+"','"+data1.result.totalCnt+"');\"><td>"+field+"</td><td>"+type+"</td></tr>";
				
				$('#fieldList > tbody:last').append(tr);
			}
			
			$('#fieldLay').show();
			
		});
		
	}
	f2collect.dataLoad = function(db_sn, table, field_key, totalCnt)
	{
		
		limitSize = 0;
		if(Number(totalCnt)>10000)
		{
			limitSize = 10000;
		}
		else
		{
			limitSize = totalCnt;
		}
		msg = ""+lang_return4("fixa.core.title190" , table , field_key , limitSize);
		
		if(confirm(msg))
		{
			f2collect.uploadDb(db_sn, table, limitSize, field_key,"desc");
		}
		else
		{
			f2collect.uploadDb(db_sn, table, limitSize, field_key,"asc");
		}
	
		
	}
	/**
	 등록된 데이터베이스 리스트 
	**/
	f2collect.listBinding = function(){
		$( '#dbList > tbody').empty();
		restRequest("/collect/selectDbList.fd","GET","", function(data2){
			for(i=0;i<data2.result.length;i++)
			{
				var tableList = "";
				tableList= tableList+ "<td>"+data2.result[i].db_sn+"</td>";
				tableList= tableList+ "<td style='text-align:left;'>"+data2.result[i].driver+"</td>";
				tableList= tableList+ "<td style='text-align:left;'>"+data2.result[i].url+"</td>";
				tableList= tableList+ "<td>"+data2.result[i].id+"</td>";
				tableList= tableList+ "<td>*****</td>";
				
				$('#dbList > tbody:last').append("<tr style='background-color:white' onClick=f2collect.showtables("+data2.result[i].db_sn+")>"+tableList+"</tr>");	
			}
		});
	}
	/**
	 * 로그인 사용자 셈플 리스트 추출
	 */
	f2collect.sampleList = function(id){
		
		var html = "";
		var param = "flag=1";
		restRequest("/collect/sampleList.fd","GET",param, function(data){
			
			console.log(data);
			
			for(i=0;i<data.result.length;i++)
			{
				
				base_data_sn = data.result[i]['base_data_sn'];
				data_name 	 = data.result[i]['data_name'];
				
				html = html + f2collect.sampleCardHtml(base_data_sn, data_name);
			}
			$("#collect_type_sample").html(html);
		});
	}
	
	
	
	/**
	로그인 사용자의 프로젝트 리스트 추출
	**/
	f2collect.projectList = function(id)
	{
		
		if($("#"+id).length==0)
		{
			
			$("body").append("<div id=\""+id+"\" title=\"프로젝트 데이터\" style='display:none;background-color:white;'></div>");
		
		}
				
		
		
			var html = "";
			var param = "flag=1";
			restRequest("/collect/projectList.fd","GET",param, function(data){
				console.log("data",data);
				var html = "";
				for(i=0;i<data.result.length;i++)
				{
					project_name 	= data.result[i]['project_name'];
					project_sn 		= data.result[i]['project_sn'];
					insert_dt 		= data.result[i]['insert_dt'];
					
//					 + "<li onClick=\"f2collect.projectDataList("+project_sn+")\">"+project_name+"</li>";
					
					 html = html + f2collect.projectCardHtml(project_sn, project_name, insert_dt);
				}
				
				$("#collect_type_project").html(html);
				
			});
	} 
	
	
	/**
	 * 카드 생성을 위한 defaultHtml
	 */
	f2collect.projectCardHtml = function(project_sn, project_name, insert_dt)
	{
		var html = "";
		
		html = html + "<div class='col-xl-3 col-md-3 mb-3' style='height:90px;cursor: hand;' onClick=f2collect.projectDataList("+project_sn+");>         ";
		html = html + "  <div class='card border-left-success shadow h-100 py-2'>                                                              ";
		html = html + "	<div class='card-body'>                                                                                                ";
		html = html + "	  <div class='row no-gutters align-items-center'>                                                                      ";
		html = html + "		<div class='col mr-2'>                                                                                             ";
		html = html + "		  <div class='text-xs font-weight-bold text-warning text-uppercase mb-1'>"+insert_dt+"</div>                        ";
		html = html + "		  <div class='h5 mb-0 font-weight-bold text-gray-800'>"+project_name+"<div id='project_data_"+project_sn+"'></div></div>                                   ";
		html = html + "		</div>                                                                                                             ";
		html = html + "		<div class='col-auto'>                                                                                             ";
		html = html + "		  <i class='fas fa-book fa-2x text-gray-300'></i>                                                                  ";
		html = html + "		</div>                                                                                                             ";
		html = html + "	  </div>                                                                                                               ";
		html = html + "	</div>                                                                                                                 ";
		html = html + "  </div>                                                                                                                ";
		html = html + "</div>                                                                                                                  ";
		
		return html;
	}
	
	/**
	 * 카드 생성을 위한 defaultHtml
	 */
	f2collect.sampleCardHtml = function(base_data_sn, data_name)
	{
		
		console.log("data_name",data_name);
		
		var html = "";
		
		html = html + "<div class='collect_list'  onClick=\"f2collect.setSampleData("+base_data_sn+")\";>  ";
		html = html + "<div class=''>"+data_name+"</div>";
		html = html + "</div>";
		
		return html;
	}
	
	f2collect.tableCardHtml = function(db_sn, table_name)
	{
		
		
		
		var html = "";
		
		html = html + "<div class='collect_list' style='cursor: pointer;' onClick=\"f2collect.checkTable('"+table_name+"',"+db_sn+")\";   '>         ";
		html = html + "		<div>"+table_name+"</div>";
		html = html + "</div>";
		
		return html;
	}
	
	
	
	/**
	 * 프로젝트 데이터 리턴
	 */
	f2collect.projectList2 = function(callback)
	{
			var param = "flag=1";
			restRequest("/collect/projectList.fd","GET",param, function(data){
				callback(data);
			});
		
	} 
	
	/**
	 * 데이터 리스트 리턴
	 */
	f2collect.projectDataList2 = function(project_sn, callback)
	{
		var param = "project_sn="+project_sn;
		restRequest("/collect/projectDataVersionList.fd","GET",param, function(data){
			callback(data);
		});
	}
	
	/**
	프로젝트 데이터 버전 추출
	**/
	f2collect.projectDataList = function(project_sn, id)
	{
	
		
		$("#modal_title").html(lang_return("fixa.core.title191"));
		$('#modal').modal('show');
		
		
		
		var html = "";
		var param = "project_sn="+project_sn;
		restRequest("/collect/projectDataVersionList.fd","GET",param, function(data){	
		$( '#projectDataTable > tbody').empty();
		
			
			for(i=0;i<data.result.length;i++)
			{
				project_data_sn 		= data.result[i]['project_data_sn'];
				project_sn 				= data.result[i]['project_sn'];
				data_version 			= data.result[i]['data_version'];
				step 					= data.result[i]['step'];
				insert_dt				= data.result[i]['insert_dt'];
				step_title = "";
				if(step=="P")
				{
					step_title = lang_return1("fixa.core.title192" , data_version);
				}
				else if(step =="C")
				{
					step_title = lang_return1("fixa.core.title193" , data_version);  
				}
				
				
				var tableList = "";
				var tr = "";
				tableList= tableList+ "<td>"+data_version+"</td>";
				tableList= tableList+ "<td>"+step_title+"</td>";
				tableList= tableList+ "<td>"+insert_dt+"</td>";
				tr = "<tr onClick=\"f2collect.setProjectData("+project_sn+","+project_data_sn+")\">"+tableList+"</tr>";
				$('#projectDataTable > tbody:last').append(tr);
			}
			
			
			
			
		});
	}
	
	
	f2collect.setProjectData = function(project_sn, project_data_sn)
	{
		
		if(confirm(lang_return("fixa.core.title194")))
		{
			
			var param = "project_sn="+project_sn+"&project_data_sn="+project_data_sn;
			restRequest("/collect/setProjectAndDataSn.fd","POST",param, function(data){	
				alert(JSON.stringify(data));
				
				if(data.result=="success")
				{
					location.href  = "/prep/prep.fd";
				}
				else
				{
					alert(lang_return("fixa.core.title195"));
					return;
				}
			});
		}
		else
		{
			return ;
		}
		
	}
	
	
	f2collect.setSampleData = function(base_data_sn,data)
	{
		
		confirmBox(lang_return("fixa.core.title196"),function(data){
			if(data==true){
				$("input[name='base_data_sn']").val(base_data_sn);
				
		 		document.sampleFrm.collect_flag.value = "sample";
				document.sampleFrm.action = '/collect/collectUploadProcess.fd';
				document.sampleFrm.submit();
			}else
			{
				return ;
			}
		});
	}
	
	
	
	/**
	 등록된 스케줄러 리스트 
	**/
	f2collect.schedulingBinding = function(){
		
		
		$( '#schedulelist > tbody').empty();

		restRequest("/collect/scheduleList.fd","GET","", function(data){
			
			console.log("data",data.list);
			
			for(i=0;i<data.list.length;i++)
			{
				var uuid = getUUID();
				
				var uuid2 = getUUID();
				var active = "";
				if(data.list[i].schedule_active == "0"){
					active = "stop";
				}else if(data.list[i].schedule_active == "1"){
					active = "start";
				}else{
					active = "delete"
				}
				
				var tableList = "";
				tableList += "<tr parent_uuid='"+uuid+"' child_uuid='' >";
				tableList += "	<td onClick=\"f2collect.schedulingToggle('"+uuid+"')\">"+data.list[i].schedule_title+"</td>";
				tableList += "	<td onClick=\"f2collect.schedulingToggle('"+uuid+"')\">"+data.list[i].schedule_term+"</td>";
				tableList += "	<td><div class='active' id="+data.list[i].schedule_sn+">"+active+"</div></td>";
				tableList += "</tr>";
				
				
					if(data.list[i].dataList!=null && data.list[i].dataList!="")
					{
						$.each(data.list[i].dataList.split(","), function(k, v){ 
							
							
							tableList += "<tr style='display:none' child_uuid='"+uuid+"' >";
							tableList += "<td colspan='3' style='text-align: left'><div class='colData'> >"+v.split("/")[1]+" <span schedule_data_sn='"+v.split("/")[0]+"' onClick=\"f2collect.schedulingLoadData('"+v.split("/")[0]+"')\">" +lang_return("fixa.scheduling.title006")+"</span> </div></td>";
							tableList += "</tr>"
							
						});	
					}
					else 
					{
						tableList += "<tr style='display:none' child_uuid='"+uuid+"' >";
						tableList += "<td colspan='3'><div class='colData'>" +lang_return("fixa.scheduling.title005")+"</div></td>";
						tableList += "</tr>"
					}
				
				$('#schedulelist > tbody:last').append(tableList);	
				
				
			}
			$('.active').on('mousedown',function(event){
				var sn = $(this).attr("id");
				
				for(var i=0; i<$("#schedule_contextMenu li").length; i++){
					if($("#schedule_contextMenu li:eq("+i+")").attr('id')== $(this).text()){
						$("#schedule_contextMenu li:eq("+i+")").css("display","none");
					}else{
						$("#schedule_contextMenu li:eq("+i+")").attr("schedule_sn",sn);
						$("#schedule_contextMenu li:eq("+i+")").css("display","");
					}
				}
				if ((event.which == 3)) {
						$("#schedule_contextMenu")
					    .css("top", event.pageY)
					    .css("left", event.pageX)
					    .css("display","");
				}else if(event.which == 1){
					$("#schedule_contextMenu").css("display","none");
				}
				 
			 });
			$('body').click(function(event){
				$("#schedule_contextMenu").css("display","none");
			 });
		});
	}
	/**
	 * 
	 */
	
	f2collect.schedulingLoadData = function(schedule_data_sn,callbackMethod){
		
		confirmBox(lang_return("fixa.scheduling.title018"),function(data){
			
			console.log(data);
			
			if(data == true){
				document.schedule_data.collect_flag.value = "schedule";
				document.schedule_data.schedule_data_sn.value = schedule_data_sn;
				
				document.schedule_data.action = '/collect/collectUploadProcess.fd';
				document.schedule_data.submit();	
			}
		});
	}
	
	
	/**
	 * 하위 리스트 출력
	 */
	f2collect.schedulingToggle= function(uuid){
		$("#schedulelist tr").each(function(k,v){
			if($(this).attr("child_uuid")==uuid){
				$(this).show();
			}
			else if($(this).attr("child_uuid")!='')
			{
				$(this).hide();
			}
		});
	}
	
	/**
	 * scheduler active 
	 */
	f2collect.schedulingActive = function(sn,id)
	{
		var param = new Object();
		param.schedule_sn = sn;
		
		if(id == "stop"){
			param.schedule_active = "0"
		}else if(id=="start"){
			param.schedule_active = "1"
		}else{
			param.schedule_active = "2"
		}
		
		restRequest("/collect/scheduleActive.fd","POST",param, function(data){
//			location.href ="/collect/datainput.fd?type=scheduling";
			$( '#schedulelist > tbody').empty();
			for(i=0;i<data.list.length;i++)
			{
				var uuid = getUUID();
				
				var uuid2 = getUUID();
				var active = "";
				if(data.list[i].schedule_active == "0"){
					active = "stop";
				}else if(data.list[i].schedule_active == "1"){
					active = "start";
				}
				
				var tableList = "";
				tableList += "<tr parent_uuid='"+uuid+"' child_uuid='' >";
				tableList += "	<td onClick=\"f2collect.schedulingToggle('"+uuid+"')\">"+data.list[i].schedule_title+"</td>";
				tableList += "	<td onClick=\"f2collect.schedulingToggle('"+uuid+"')\">"+data.list[i].schedule_term+"</td>";
				tableList += "	<td><div class='active' id="+data.list[i].schedule_sn+">"+active+"</div></td>";
				tableList += "</tr>";
				
				
					if(data.list[i].dataList!=null && data.list[i].dataList!="")
					{
						$.each(data.list[i].dataList.split(","), function(k, v){ 
							
							
							tableList += "<tr style='display:none' child_uuid='"+uuid+"' >";
							tableList += "<td colspan='3' style='text-align: left'><div class='colData'> >"+v.split("/")[1]+" <span schedule_data_sn='"+v.split("/")[0]+"' onClick=\"f2collect.schedulingLoadData('"+v.split("/")[0]+"')\">데이터 사용</span> </div></td>";
							tableList += "</tr>"
							
						});	
					}
					else 
					{
						tableList += "<tr style='display:none' child_uuid='"+uuid+"' >";
						tableList += "<td colspan='3'><div class='colData' >" +lang_return("fixa.scheduling.title005")+"</div></td>";
						tableList += "</tr>"
					}
				
				$('#schedulelist > tbody:last').append(tableList);	
				
			}
			$('.active').on('mousedown',function(event){
				var sn = $(this).attr("id");
				
				for(var i=0; i<$("#schedule_contextMenu li").length; i++){
					if($("#schedule_contextMenu li:eq("+i+")").attr('id')== $(this).text()){
						$("#schedule_contextMenu li:eq("+i+")").css("display","none");
					}else{
						$("#schedule_contextMenu li:eq("+i+")").attr("schedule_sn",sn);
						$("#schedule_contextMenu li:eq("+i+")").css("display","");
					}
				}
				if ((event.which == 3)) {
						$("#schedule_contextMenu")
					    .css("top", event.pageY)
					    .css("left", event.pageX)
					    .css("display","");
				}else if(event.which == 1){
					$("#schedule_contextMenu").css("display","none");
				}
				 
			 });
			$('body').click(function(event){
				$("#schedule_contextMenu").css("display","none");
			 });
		});
	}