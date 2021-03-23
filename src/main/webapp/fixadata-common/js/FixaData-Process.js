
Process = {};
//prep최초 접속시 여부 체크
Process.prepfirst = false;


Process.Sheet = function( event ) {
	
	var elEvent		= $i(event);
	var elItems		= $i('#' + Options.Element.Process.Sheet.Id + '>.item>a');
	var evIndex		= elItems.index(event);
	var elTarget	= $i('#' + Options.Element.Global.Content.Id + '>form>.content');
	for(var i=0; i<$("#arSheet li").length; i++){
		if($("#arSheet li:eq("+i+")").css("top")=="0px"){
			Options.eq_val = i;
		}
	}
	
	if ( elEvent.is('.lock') ) {
		$("#arSheet li:eq("+Options.eq_val+")").css("top",0);
		return false;
	};

	elItems.removeClass('on');
	elTarget.removeClass('on').eq(evIndex).addClass('on');
	elEvent.addClass('on');

	var SheetClick = Options.Variable.Global.SheetClick;

	if ( SheetClick && elTarget.is('.diagram') ) {
		$i.extend( Options.Variable.Global ,{ SheetClick : false } );	// 데이터 이상치 검출 Sheet 클릭 여부 업데이트
		Core.Diagram.RuleItem( 'Process.RuleItemResponse' );			// Rule Item 목록 표출
	};

	var panel = Options.Element.Global.Pnb.El();
	
	
	if ( elTarget.eq(evIndex).is('.grid') ) {
		Options.Element.Diagram.HistoryDiagram.El().addClass('_none');
		Options.Element.Diagram.HistoryGrid.El().removeClass('_none');
		panel.find('.panel .panelGroup .item.btnHistory').removeClass('lock').addClass('unlock');
		panel.find('.panel .panelGroup .item.btnPlay').removeClass('unlock').addClass('lock');
		panel.find('.panel .panelGroup .item.btnDown').removeClass('unlock').addClass('lock');
		panel.find('.panel .panelGroup .item.btnDown.last').removeClass('lock').addClass('unlock');
		$("#ClosePropertiesSidebar").click();
		$("#_btn_prepGrid_close").click();
	
		//랜더링
		if(Process.prepfirst==false)
		{
			var id = "0";
			Options.prepOriGrid ="";
			Options.prepOriGrid = {
					  data : Options.Variable.slickGrid.id["oriGrid"].getData()
					, header : slickGrid.getHeaderName(Options.Variable.slickGrid.id["oriGrid"])
					, header_option:Options.Variable.slickGrid.headerOption["oriGrid"]
					, historyId: id 
					, mac_address : $("#mac_address").val()
					
			}
			var jsonData = JSON.stringify(Options.prepOriGrid);
			
			$.ajax({
				   url: '/prep/writeJson.fd' 
				   ,crossDomain: true
				   ,contentType: 'application/json'
				   ,async: false
				   ,type: 'POST'
				   ,data: jsonData
				   ,dataType: 'json'
				   ,success: function(data) {
					   
				   }
			});
			Options.Variable.slickGrid.id["prepGrid"].setColumns(Options.Variable.slickGrid.id["prepGrid"].getColumns());
			Process.prepfirst = true;
			
		}
		
		
	} else if (elTarget.eq(evIndex).is('.diagram')) {
		
		$("#contextMenu").hide();
		Options.Element.Diagram.HistoryDiagram.El().removeClass('_none');
		Options.Element.Diagram.HistoryGrid.El().addClass('_none');
		panel.find('.panel .panelGroup .item.btnHistory').removeClass('lock').addClass('unlock');
		panel.find('.panel .panelGroup .item.btnPlay').removeClass('lock').addClass('unlock');
		panel.find('.panel .panelGroup .item.btnDown').removeClass('unlock').addClass('lock');
		$("#_btn_prepGrid_close").click();
		
		if(diagramfirst==false)
		{
			Options.defauleDiagramData="";
			$.ajax({
			    url: '/collect/setProjectAndDataSn2.fd' 
			    ,async: false
			    ,type: 'post'
			    ,success: function(data) {
			    	Core.Diagram.Reset();
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
				    	Core.Diagram.SetData();
				    	
			    	}else{
			    		diagramfirst = true;
			    	}
			    }
			});
			
			$("#_btn_prepGrid_close").click();
			
			//$("#div_ajax_load_image").css("left",($("#itmDiagramCanvas").position().left+$("#itmDiagramCanvas").width()/2)-80);
			//$("#div_ajax_load_image").css("top",($("#itmDiagramCanvas").position().top+$("#itmDiagramCanvas").height()/2));
			Core.Console.Write( { Type : 'Success' ,KeyCode : 'Succ5' ,Message :'' } );
			
			
		}
	} else {
		
		
		Options.Element.Diagram.HistoryDiagram.El().addClass('_none');
		Options.Element.Diagram.HistoryGrid.El().addClass('_none');
		panel.find('.panel .panelGroup .item.btnHistory').removeClass('unlock').addClass('lock');
		panel.find('.panel .panelGroup .item.btnPlay').removeClass('unlock').addClass('lock');
		panel.find('.panel .panelGroup .item.btnDown').removeClass('lock').addClass('unlock');
		$("#ClosePropertiesSidebar").click();
		$("#_btn_prepGrid_close").click();
		
	
	};
	
	try{
		$.each(Object.keys(Options.Variable.slickGrid.id),function(k,v){
			Options.Variable.slickGrid.id[v].resizeCanvas();
			Options.Variable.slickGrid.id[v].invalidate();
			
		});
	}catch(e)
	{
		console.log(e);
	}
	

};

Process.ConsoleSheet = function( event ) {
	var elEvent		= $i(event);
	var elDataId	= elEvent.attr('data-id');
	elEvent.parent().find('.title').removeClass('on').end().end().addClass('on').parent().parent().find('.contents').removeClass('on').parent().find('.contents[data-id="' + elDataId + '"]').addClass('on');
	if ( 'blockchain'==elDataId ) {
		//Core.Blockchain.List();
	};
};

Process.RuleItemResponse = function( d ,e ,flag ) {
	// Diagram Rule Item 목록 표출
	Core.Diagram.RuleItemResponse( d );

	if (!flag){
		// Diagram 세팅
		Core.Diagram.Create();
	}

	// Diagram Drag&Drop 세팅
	Core.Drag.Create();
};

Process.MemberItemResponse = function( d ,e ,flag ) {
	// Diagram Rule Item 목록 표출
	Core.Diagram.MemberItemResponse( d );

	if (!flag){
		// Diagram 세팅
		Core.Diagram.Create();
	}

	// Diagram Drag&Drop 세팅
	Core.Drag.Create();
};



Process.Contextmenu			= {};
Process.Contextmenu.Column	= function() { Core.Diagram.Contextmenu.Column();	};
Process.Contextmenu.Setting	= function() { Core.Diagram.Contextmenu.Setting();	};
Process.Contextmenu.Chart	= function() { Core.D3Chart.Modal();				};
firstlading = true;
Process.Start = function( e ) {
	Options.Menu.Level3();
	
	
	Core.Start( function( response ) {
		if ( response ) {
			$i('#' + Options.Element.Process.Sheet.Id + '>.item>a').on( 'click' ,function( e ) {
				
				click_id = $(this).attr("id");
				z_index_status = $(this).parent().attr("z_index_status");
				
				//console.log("z_index_status",z_index_status);
				
				$("#arSheet li").css("top",10);
				$("#arSheet li").parent().css("z-index",z_index_status);
				
				if(firstlading==false)
				{
					$("#arSheet li").each(function(k,v){
						if($(this).attr("child_id")==click_id)
						{
							
							if($(this).attr("child_id") == "workflow_output"){
								if($("#result_tab_content").html().length < 1000){
									//alert->alert_message
									alert_message(lang_return("fixa.core.title234"));
									return false;
								}else{
									$(this).css("top",0);
									$(this).parent().css("z-index",200);
								}
							}else{
								$(this).css("top",0);
								$(this).parent().css("z-index",200);
							}
								
						}
					});
				}
			
				
				firstlading = false;
				
				
				
				
				Process.Sheet(this);return false;
			} );
			var panel = Options.Element.Global.Pnb.El();
			panel.find('.panel .panelGroup .item.btnPlay').removeClass('unlock').addClass('lock');
			panel.find('.panel .panelGroup .item.btnDown').removeClass('unlock').addClass('lock');
			$i('#' + Options.Element.Global.Console.Id + ' .title').on( 'click' ,function( e ) {
				Process.ConsoleSheet(this);return false;
			} );
			//Core.Grid.Create();
		};
	} );
	
};


Process.DocReady = function(e){
	Process.Start( e );
	$i(document).on('keydown' ,function ( e ) {
		if ( 'input' != $i(e.target).prop('tagName').toLowerCase() ) {
			if (e.keyCode == 90 && e.ctrlKey) { Core.History.Undo( e ); };
			if (e.keyCode == 89 && e.ctrlKey) { Core.History.Redo( e ); };
		};
	});
	$i('#' + Options.Element.Process.ChatbotButton.Id + ',#' + Options.Element.Process.ChatbotInput.Id).on('click keyup' ,function( e ) {
		if ( e.keyCode == 13 || ($i(this).is('#' + Options.Element.Process.ChatbotButton.Id) && ('click'==e.type)) ) { Core.Chatbot.Start(); };
		return false;
	});
	Options.Element.Diagram.RuleItemPlus.El().on('click' ,function(){ Core.RuleUser.List(); return false; });
	$i('.minimize').on('click' ,function( e ){ Core.Panel.Minimize($i(this)); return false; });
	$i('.itmPanel .close').on('click' ,function( e ) { Core.Panel.Close($i(this)); return false; })
	
};