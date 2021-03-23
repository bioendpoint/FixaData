
  	var columnFilters = {};
  	var grid;
  	var workflow_field_ori = [];
  	var workflow_field = [];
  	//결과용 
  	var result_grid={};
  	var result_header={};
  	var result_data={};
  	
  	var options = {
  	  enableCellNavigation: true,
  	  enableColumnReorder: false,
  	  asyncEditorLoading: false,
  	  /**col 수정 가능 여부**/
  	  editable: true,
  	  //showHeaderRow: true,
  	};
  	
	
	var workflow = {};
		
		/**
			데이터 확인용
		**/
		workflow.loadData = function(project_sn, project_data_sn)
		{
			
			console.log(JSON.parse($("textarea[name='workflow_json']").val()));
			
			var param = {
				"project_sn":project_sn
				, "project_data_sn": project_data_sn
			};
			
			console.log(param);
			restRequest("/outlier/loadData.fd", "GET", param, function(data){
				
			var temp = JSON.parse($("textarea[name='workflow_json']").val());
			
			temp.project_sn = project_sn;
			temp.project_data_sn = project_data_sn;
			temp.ruleSet[0].field = [];
			workflow_field = [];
			workflow_field_ori= [];
			$('#field_select').empty();
				for(i=0;i<data.result.header.length;i++)
				{
					temp.ruleSet[0].field.push(data.result.header[i]);
					
					
					workflow_field.push(data.result.header[i]);
					workflow_field_ori.push(data.result.header[i]);
					
					if(data.result.header[i]!="idx")
					{
						$('#field_select').append("<option value='"+data.result.header[i]+"'>"+data.result.header[i]+"</option>");
					}
					
				}
				temp.ruleSet[0].rule_string = "^[a-zA-Z]*$";
				
				//select 데이터 append
				
				var textedJson = JSON.stringify(temp, undefined, 4);
				$("textarea[name='workflow_json']").val(textedJson);
				
				slickGrid.setColumn(grid, data.result.header);
				slickGrid.setData(grid, data.result.data);
				
				
			});
			
		}
		
		/**
		 workflow수행후 나온 데이터에 대한 통계치 측적용 함수
		**/
		workflow.statistics = function(obj)
		{
			$("#result_tab").html("");
			$("#result_tab_content").html("");
			if(obj.length>0)
			{
				console.log(obj);
				for(i=0;i<obj.length;i++)
				{
					var tab_unikey = "tab"+i;
					
					
					is_active = "";
					rule_name 	= obj[i]['rule_name'];
					rule_sn		= obj[i]['rule_sn'];
					if(i==0)
					{
						is_active = "active";
					}
					tabNav = "<li class='nav-item'><a class='nav-link "+is_active+"' data-toggle='tab' rule_sn='"+rule_sn+"' href=#"+tab_unikey+">"+rule_name+" </a></li>";
					//tab 생성
					$("#result_tab").append(tabNav);
					
					
					var eraserDataHtml = "";
					console.log(obj[i]['result']);
					var eraserData = obj[i]['result']['eraserData'];
					var fieldData = obj[i]['field'];
					
					result_id = "eraserData_result_"+rule_sn;
					
					eraserDataHtml = "<div id='"+result_id+"' style='width: 600px; height: 300px';>test</div>";
					
					var tab_content = "";
					tab_content = tab_content + "<div class='tab-pane fade show "+is_active+"' id='"+tab_unikey+"'>";
					tab_content = tab_content + "<table width='100%' border='1'>";
					tab_content = tab_content + "<tr>";
					tab_content = tab_content + "		<td width='50%'>"+lang_return("fixa.core.title197")+"</td>";
					tab_content = tab_content + "		<td width='50%'>"+lang_return("fixa.core.title198")+"</td>";
					tab_content = tab_content + "</tr>";
					tab_content = tab_content + "<tr>";
					tab_content = tab_content + "		<td width='50%'>"+eraserDataHtml+"</td>";
					tab_content = tab_content + "		<td width='50%'>"+lang_return("fixa.core.title198")+"</td>";
					tab_content = tab_content + "</tr>";
					tab_content = tab_content + "</table>";  
					tab_content = tab_content + "</div>";
					$("#result_tab_content").append(tab_content);

					//workflow_field = ;
					
					//데이터 바인딩
					
					result_grid[result_id] = slickGrid.init(options, result_grid['result_id'], result_id, workflow_field, eraserData);
					
					
					workflow_field = [];
					for(j=0;j<workflow_field_ori.length;j++)
					{
						workflow_field.push(workflow_field_ori[j]);
					}
					
					
					slickGrid.setColumn(result_grid[result_id], workflow_field);
					slickGrid.setData(result_grid[result_id], eraserData);
				}
			}
			
		}
		
		/**
			기동
		**/
		workflow.run = function(project_sn, project_data_sn, rule_workflow)
		{
			
			var workflowparam = $("textarea[name='workflow_json']").val();
			workflowparam = JSON.parse(workflowparam);
			
			//db저장
			if($("input:checkbox[name='dbsave']").is(":checked")==true)
			{
				workflowparam.dbsave = 1;
			}
			
			restRequestBody("/outlier/run.fd", "POST", JSON.stringify(workflowparam), function(data){
				console.log(data.result);
				workflow.statistics(data.result);
				result = data;
			});
			
			var ruleList= null;
			
		}
		

		
		/**
		필드 확인
		**/
		workflow.getSelectField = function(f)
		{

			if($("#field_select").val()==null)
			{
				alert('진행하실 필드를 선택해주세요');
				return ;
			}
			else
			{
				
				var temp = JSON.parse($("textarea[name='workflow_json']").val());
				temp.ruleSet[0].field = [];
				$.each($("#field_select").val(), function(k, v){ 

					temp.ruleSet[0].field.push(v);
							
						
				}); 
				
				var textedJson = JSON.stringify(temp, undefined, 4);
				
				
				$("textarea[name='workflow_json']").val(textedJson);

				
				
			}
		 }
		