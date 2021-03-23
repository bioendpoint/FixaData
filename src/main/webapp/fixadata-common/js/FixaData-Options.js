

Options = {};
Options.memoryGrid = new Array();
Options.memoryGridMap = new Object();
Options.memoryGrid2 = new Array();
Options.prepOriGrid ="";
Options.slickgrid = {};
Options.slickgrid.option = {};
Options.defauleDiagramData ="";
diagramfirst = false;
//isWorkflowData = false;
Options.beforeUi = new Array();
Options.beforeUiReCollect = new Array();
Options.oriTransfromX = "";
Options.oriTransfromY = "";
Options.connectionInfo = new Array();
Options.keyVal = false;
Options.recentChangedCloumn = new Array();
Options.oriDataType = [];
Options.beforeColumns = [];
Options.mouseClick ="";
Options.recentY = 0;
Options.dragId = "";
Options.checkPointX = false;
Options.checkPointY = false;
Options.paperScrollY = 0;
Options.paperScrollX = 0;
Options.template_modelId = new Array();
Options.template_x = 0;

Options.tutorial_cur = 1;
Options.tutorial_max = 5;


Options.view = "";
Options.div = "";
Options.selectedListPath = [];
Options.selectedListField = [];
Options.jsonPathData ="";

Options.status = {};
Options.status.schedule_btn = false;
Options.project_sn = "";
Options.project_data_sn = "";
Options.eq_val = "";
Options.PrevProcess = false;
Options.NextProcess = false;
/**
 * 오퍼레이션 리스트
 */
Options.operation = [
	{
		"display":"+"
		,"operation":"+"
	},
	{
		"display":"-"
		,"operation":"-"
	},
	{
		"display":"x"
		,"operation":"*"
	}
	,
	{
		"display":"÷"
		,"operation":"/"
	}	
];



Options.statistics = [
	{
		"param" : "1"
		,"type" : "label,number,number"
		,"count": "3"
	},
	{
		"param": "2"
		,"type": "number,number,number"
		,"count": "3"
	},
	{
		"param": "3"
		,"type": "date,number"
		,"count": "2"
	}
	
];


/**
 * 오퍼레이션 리스트
 */
Options.custom_operation = [
	{
		"display":"between"
		,"operation":"between"
		,"permit":"number,date" //허용
	},
	{
		"display":">"
		,"operation":">"
		,"permit":"number" //허용
	},
	{
		"display":">="
		,"operation":">="
		,"permit":"number" //허용
	}
	,
	{
		"display":"<"
		,"operation":"<"
		,"permit":"number" //허용
	}	
	,
	{
		"display":"<="
		,"operation":"<="
		,"permit":"number" //허용
	}
	,
	{
		"display":"in"
		,"operation":"in"
		,"permit":"char" //허용
	}
	
];


//isloading = false; 
//isSetData = false;
//isFinishCheck = [];
//beforeCheckDataOutput2 = new Array();
//beforeCheckDataOutput1 = [];
/**
 * grid의 기본 옵션
 */
Options.slickgrid.option['default_grid_option']= 
{
		  enableCellNavigation: true,
		  enableColumnReorder: false,
		  asyncEditorLoading: true,
		  /**col 수정 가능 여부**/
		  editable: true,
		  forceFitColumns: false,
		  multiSelect: true,
		  multiColumnSort: true
		  
		  //showHeaderRow: true,
};

Options.Files = {};

Options.Files.Setting = {
	Count			: 1						// 파일첨부 최대 개수
,	ExtLimit		: ['xls','xlsx','csv']	// 파일첨부 가능 형태
,	SizeType		: 'kb'					// [파일정보] 표기 크기 단위
,	SizeTypeLeng	: 1						// 파일 크기 깊이
,	SizeFixed		: 2						// 파일 크기 소수점 이하 표기
,	SubmitType		: 'ajax'				// 전송방식
,   limitSize		: {}
};

var fileUploadSize = {};
fileUploadSize['xls'] 	= 1024*12;
fileUploadSize['xlsx']	= 1024*15;
fileUploadSize['csv'] 	= 1024*20;
Options.Files.Setting.limitSize = fileUploadSize;








Options.Message = {};

Options.Message.Info = {
	Mssg1001	: { Code : 'INFO-1001' ,Type : 'strong'	,Message : 'hi'								}
,	Mssg1002	: { Code : 'INFO-1002' ,Type : 'nomal'	,Message : '...'							}
,	Mssg1301	: { Code : 'INFO-1301' ,Type : 'nomal'	,Message : lang_return("fixa.core.title090")}//'데이터를 Select 하였습니다.'
,	Mssg1501	: { Code : 'INFO-1501' ,Type : 'nomal'	,Message : lang_return("fixa.core.title091")}//'선택한 컬럼 및 사용자 설정이 적용 되었습니다.'
,	Mssg1502	: { Code : 'INFO-1502' ,Type : 'nomal'	,Message : lang_return("fixa.core.title092")}//'등록한 룰(Rule)이 초기화 되었습니다.'
,	Mssg1901	: { Code : 'INFO-1901' ,Type : 'strong'	,Message : lang_return("fixa.core.title093")}//'R 명령 Script가 실행 되었습니다.'
,	Mssg1902	: { Code : 'INFO-1902' ,Type : 'nomal'	,Message : lang_return("fixa.core.title094")}//'R 속성이 설정되었습니다.'
,	Mssg1903	: { Code : 'INFO-1903' ,Type : 'nomal'	,Message : ''}//'R 속성이 설정되었습니다.'
};

Options.Message.Error = {
	Errr1001	: { Code : 'ERRR-1001' ,Type : 'strong'	,Message : lang_return("fixa.core.title095")}//'알수없는 문제가 발생 하였습니다. 다시 시도하세요.'
,	Errr1002	: { Code : 'ERRR-1002' ,Type : 'strong'	,Message : lang_return("fixa.core.title096")}//비동기 통신에 문제가 발생 하였습니다. 새로고침 후 다시 이용해 주세요. 문제가 지속될 경우 관리자에게 문의 하세요.
,	Errr1101	: { Code : 'ERRR-1101' ,Type : 'strong'	,Message : lang_return("fixa.core.title097")}//입력한 계정 아이디는 존재하지 않습니다.
,	Errr1102	: { Code : 'ERRR-1102' ,Type : 'strong'	,Message : lang_return("fixa.core.title098")}//입력한 계정 아이디의 비밀번호가 틀렸습니다.
,	Errr1103	: { Code : 'ERRR-1103' ,Type : 'strong'	,Message : lang_return("fixa.core.title099")}//아이디는 영문 소문자, 숫자 조합 4~20글자로 입력하세요.
,	Errr1104	: { Code : 'ERRR-1104' ,Type : 'strong'	,Message : lang_return("fixa.core.title100")}//비밀번호는 영문 소문자+숫자+특수문자(!@$_) 조합 8~20글자 또는 영문 소문자+숫자 조합 10~20글자로 입력하세요.
,	Errr1301	: { Code : 'ERRR-1301' ,Type : 'strong'	,Message : lang_return("fixa.core.title101")}//프로젝트 저장에 실패 하였습니다.
,	Errr1401	: { Code : 'ERRR-1401' ,Type : 'strong'	,Message : lang_return2("fixa.core.title102",Options.Files.Setting.Count)}//
,	err1	    : { Code : 'ERRR-1501' ,Type : 'strong'	,Message : lang_return("fixa.core.title155")}
,	Errr1402	: { Code : 'ERRR-1402' ,Type : 'strong'	,Message : function() {
		var limit		= Options.Files.Setting.ExtLimit;
		var response	= '';
		for( var fx=0; fx<limit.length; ++fx ) {
			response += limit[fx];
			if(fx<limit.length-1){response+=', '};
		};
		return (lang_return("fixa.core.title222")+'<br>'+lang_return("fixa.core.title223") + response);
	}																																													
}

,	Errr1403	: { Code : 'ERRR-1403' ,Type : 'strong'	,Message : lang_return("fixa.core.title103")}//'파일업로드를 실패 하였습니다.<br>다시 시도해 주세요.'
,	Errr1501	: { Code : 'ERRR-1501' ,Type : 'strong'	,Message : lang_return("fixa.core.title104")}//'R속성 설정 뒤에는 D3 Chart 룰(Rule)이 필수로 등록되어야 합니다.'
,	Errr1502	: { Code : 'ERRR-1502' ,Type : 'strong'	,Message : lang_return("fixa.core.title105")}//'필터 뒤에는 필터 또는 룰(Rule)설정이 등록 되어야 합니다.'
,	Errr1503	: { Code : 'ERRR-1503' ,Type : 'strong'	,Message : lang_return("fixa.core.title106")}//'D3 Chart 뒤에 D3 Chart가 연속되어 등록 될 수 없습니다.'
,	Errr1504	: { Code : 'ERRR-1504' ,Type : 'strong'	,Message : lang_return("fixa.core.title107")}//'속성 및 실행 화면을 호출하는데 실패 하였습니다. 다시 시도해 주세요.'
,	Errr1505	: { Code : 'ERRR-1505' ,Type : 'strong'	,Message : lang_return("fixa.core.title108")}//'DB(초기 데이터) 뒤에는 우선 룰(Rule)이 등록 되어야 합니다.'
,	Errr1506	: { Code : 'ERRR-1506' ,Type : 'strong'	,Message : lang_return("fixa.core.title109")}//'R 실행에 부적합한 데이터가 포함되어 있거나 또는 기준 컬럼(Column) 설정이 잘못 되었습니다.'
,	Errr1507	: { Code : 'ERRR-1506' ,Type : 'strong'	,Message : lang_return("fixa.core.title110")}//'시계열 차트 뒤에는 어떠한 룰(Rule)도 등록될 수 없습니다.'
,	Errr1601	: { Code : 'ERRR-1601' ,Type : 'strong'	,Message : lang_return("fixa.core.title111")}//'이상치 검출 시 최소 1개 이상의 룰이 등록(설정) 되어야 합니다.'
,	Errr1602	: { Code : 'ERRR-1602' ,Type : 'strong'	,Message : lang_return("fixa.core.title112")}//'파일의 업로드는 {0} MB 이하일때 가능합니다.'
};

Options.Message.Success = {
	Succ1001	: { Code : 'SUCC-1001' ,Type : 'strong'	,Message : ''																													}
,	Succ1301	: { Code : 'SUCC-1301' ,Type : 'strong'	,Message : lang_return("fixa.core.title113")}//프로젝트가 저장되었습니다.
,	Succ1601	: { Code : 'SUCC-1601' ,Type : 'strong'	,Message : lang_return("fixa.core.title114")}//이상치 검출 결과가 실행 되었습니다.
,	Succ1		: { Code : lang_return("fixa.prep.title006")	   ,Type : 'strong'	,Message : lang_return("fixa.core.title115")}// 를 설정하였습니다.
,	Succ2		: { Code : lang_return("fixa.prep.title006") 	   ,Type : 'strong'	,Message : lang_return("fixa.core.title152")}// 를 설정하였습니다.
,	Succ3		: { Code : lang_return("fixa.prep.title006") 	   ,Type : 'strong'	,Message : lang_return("fixa.core.title153")}// 를 설정하였습니다.
,	Succ4		: { Code : 'SUCC-1701' ,Type : 'strong'	,Message : lang_return("fixa.core.title154")}
,	Succ5		: { Code : 'PROC-0001' ,Type : 'strong'	,Message : lang_return("fixa.core.title233")}
};

Options.Message.History = {
	H1001		: { Code : 'HSTR-1001' ,Type : 'nomal'	,Message : lang_return("fixa.core.title116")}//'실행할 수 없는 명령 입니다.'}
,	H2001		: { Code : 'HSTR-2001' ,Type : 'nomal'	,Message : lang_return("fixa.core.title117")}//'Undo가 실행 되었습니다.'}
,	H2002		: { Code : 'HSTR-2002' ,Type : 'nomal'	,Message : lang_return("fixa.core.title118")}//'Redo가 실행 되었습니다.'}
,	H3001		: { Code : 'HSTR-3001' ,Type : 'nomal'	,Message : lang_return("fixa.core.title119")}//'프로젝트 저장이 실행 되었습니다.'}
,	H3002		: { Code : 'HSTR-3002' ,Type : 'nomal'	,Message : lang_return("fixa.core.title120")}//'프로젝트 열기가 실행 되었습니다.'}
,	H4001		: { Code : 'HSTR-4001' ,Type : 'nomal'	,Message : lang_return("fixa.core.title121")}//'프로젝트 이상치 검출이 실행 되었습니다.'}
};



Options.History = {};

	/**
	 * undo function 
	 */
	Options.History.undo = {
	    'callfun':"Core.History.Undo()"
	    ,'message':'H2001'
	    , 'icon':"<img src='/fixadata-common/images/btn_preview_on.png' width='16px' style='cursor:pointer;background:#00000000 !important' height='auto' onClick=\"Core.History.Undo()\"/>"
	};

	/**
	 * redo function 
	 */
	Options.History.redo = {
	    'callfun':"Core.History.Redo()"
	    ,'message':'H2002'
	    ,'icon':"<img src='/fixadata-common/images/btn_next.png' width='16px' style='cursor:pointer;background:#00000000 !important;' height='auto' onClick=\"Core.History.Redo()\"/>"
	};


	/**
	 * save function 
	 */
	Options.History.save = {
	    'callfun':"Core.Project.SaveShow()"
	    ,'message':'H3001'
	    ,'icon':"<img src='/fixadata-common/images/btn_save.png' width='20px' style='cursor:pointer;background:#00000000 !important;' height='auto' onClick=\"Core.Project.SaveShow()\"/>"
	    
	};
	
	/**
	 * open function
	 */
	Options.History.open = {
	    'callfun':"Core.Project.OpenShow()"
	    , 'message':'H3002'
	    , 'icon':"<img src='/fixadata-common/images/sm_folder.png' width='21px' height='16px' style='cursor:pointer;background:#00000000 !important' height='auto' onClick=\"Core.Project.OpenShow()\"/>"
	};


	/**
	 * play function 
	 */
	Options.History.play = {
	    'callfun':"Core.Output.Output('Core.Output.OutputResponse')"
	    ,'message':'H4001'
	    , 'icon':"<img src='/fixadata-common/images/sm_play.png' width='16px' style='cursor:pointer;background:#00000000 !important;' height='auto' onClick=\"Core.Diagram.run('workflow')\"/>"
	    
	};


	Options.History.History = 
	{
	        'undo'				        : Options.History.undo
	    ,	'뒤로'				        : Options.History.undo
	    ,	'앞으로'				   	 	: Options.History.undo
	    ,	'이전'				        : Options.History.undo
	    ,	'이전실행'				    	: Options.History.undo
	    ,	'이전 실행'			        	: Options.History.undo
	    ,	'back'				        : Options.History.undo
	    ,	'before'			        : Options.History.undo

	    ,	'redo'				        : Options.History.redo
	    ,	'앞으로'				    	: Options.History.redo
	    ,	'이후'				        : Options.History.redo
	    ,	'after'				        : Options.History.redo
	    ,	'after this'		        : Options.History.redo

	    ,	'저장'				        : Options.History.save
	    ,	'save'				        : Options.History.save
	    ,	'열기'				        : Options.History.open
	    ,	'열어줘'				    	: Options.History.open      
	    ,	'open'				        : Options.History.open
	    ,	'오픈'				        : Options.History.open
	  
	    ,	'실행'				        : Options.History.play 
	    ,	'시작'				        : Options.History.play 
	};



Options.Element = {};

Options.Element.Global = {
	Inni				: { Id : '_inni'					,El : function(){ return $i('#_inni');					}	,Name : ''					}
,	Tnb					: { Id : 'itmTnb'					,El : function(){ return $i('#itmTnb');					}	,Name : ''					}
,	Pnb					: { Id : 'arPalyPanel'				,El : function(){ return $i('#arPalyPanel');			}	,Name : ''					}
,	ProjectName			: { Id : 'itmProjectName'			,El : function(){ return $i('#itmProjectName');			}	,Name : ''					}
,	Contents			: { Id : 'wrContents'				,El : function(){ return $i('#wrContents');				}	,Name : ''					}
,	Sidebar				: { Id : 'wrSidebar'				,El : function(){ return $i('#wrSidebar');				}	,Name : ''					}
,	Content				: { Id : 'arContent'				,El : function(){ return $i('#arContent');				}	,Name : ''					}
,	Modal				: { Id : '_wrModal'					,El : function(){ return $i('#_wrModal');				}	,Name : ''					}
,	Loading				: { Id : 'arLoading'				,El : function(){ return $i('#arLoading');				}	,Name : ''					}
,	Console				: { Id : 'arConsole'				,El : function(){ return $i('#arConsole');				}	,Name : ''					}
,	History				: { Id : 'arHistory'				,El : function(){ return $i('#arHistory');				}	,Name : ''					}
,	Chatbot				: { Id : 'arChatbot'				,El : function(){ return $i('#arChatbot');				}	,Name : ''					}
};


/**
 * 차트 관련 정의
 */

Options.Element.chart = {
	c3chartview			: { Id : 'c3chartview'				,El : function(){ return $i('#c3chartview');			}	,Name : 'c3chartview'		,Title:lang_return("fixa.core.title060")}//'차트보기'

}

Options.Element.fileupload = {
		excelList	: { Id : 'selectivefile'				,El : function(){ return $i('#selectivefile');		}	,Name : 'selectivefile'}//'selectivefile

	}

Options.Element.Project = {
	SaveForm			: { Id : 'itmProjectSave'			,El : function(){ return $i('#itmProjectSave');			}	,Name : 'form_Save'			}
,	SaveInput			: { Id : 'PROJECT_NAME'				,El : function(){ return $i('#PROJECT_NAME');			}	,Name : 'PRJCT_NM'			}
,	Open				: { Id : 'itmProjectOpen'			,El : function(){ return $i('#itmProjectOpen');			}	,Name : ''					}
};

Options.Element.Import = {
		SaveForm			: { Id : 'itmImportSave'			,El : function(){ return $i('#itmImportSave');			}	,Name : ''			}
	,	SaveInput			: { Id : 'import_name'				,El : function(){ return $i('#import_name');			}	,Name : ''			}
	,	Open				: { Id : 'itmImportOpen'			,El : function(){ return $i('#itmImportOpen');			}	,Name : ''					}
	};
Options.Element.Template = {
		SaveForm			: { Id : 'itmTemplateSave'			,El : function(){ return $i('#itmTemplateSave');			}	,Name : ''			}
	};
Options.Element.Release = {
		SaveForm			: { Id : 'itmReleaseSave'			,El : function(){ return $i('#itmReleaseSave');			}	,Name : ''			}
	,	SaveInput			: { Id : 'release_name'				,El : function(){ return $i('#Release_name');			}	,Name : ''			}
	,	Open				: { Id : 'itmReleaseOpen'			,El : function(){ return $i('#itmReleaseOpen');			}	,Name : ''					}
	};

Options.Element.Scheduling = {
		SaveForm			: { Id : 'itmSchedulingSave'			,El : function(){ return $i('#itmSchedulingSave');			}	,Name : ''			}
	,	parseForm			: { Id : 'itmSchedulingParse'			,El : function(){ return $i('#itmSchedulingParse');			}	,Name : ''			}
	,	SaveInput			: { Id : 'scheduling_name'				,El : function(){ return $i('#scheduling_name');			}	,Name : ''			}
	,	Open				: { Id : 'itmSchedulingOpen'			,El : function(){ return $i('#itmSchedulingOpen');			}	,Name : ''					}
	};

Options.Element.Console = {
	Text				: { Id : 'consoleText'				,El : function(){ return $i('#consoleText');			}	,Name : ''					}
};

Options.Element.Member = {
	LoginForm			: { Id : 'formLogin'				,El : function(){ return $i('#formLogin');				}	,Name : ''					}
,	LoginMessage		: { Id : 'itmMessage'				,El : function(){ return $i('#itmMessage');				}	,Name : ''					}
,	LoginUserId			: { Id : 'form_userId'				,El : function(){ return $i('#form_userId');			}	,Name : 'MEMBER_ID'			}
,	LoginUserPw			: { Id : 'form_userPw'				,El : function(){ return $i('#form_userPw');			}	,Name : 'MEMBER_PW'			}
};

Options.Element.Datainput = {
	ItemArea			: { Id : 'itmDataArea'				,El : function(){ return $i('#itmDataArea');			}	,Name : ''					}
,	FileInfo			: { Id : 'itmFileName'				,El : function(){ return $i('#itmFileName');			}	,Name : ''					}
,	ButtonArea			: { Id : 'itmButtonArea'			,El : function(){ return $i('#itmButtonArea');			}	,Name : ''					}
,	ButtonSubmit		: { Id : 'form_submit'				,El : function(){ return $i('#form_submit');			}	,Name : ''					}
};

Options.Element.Process = {
	GridTable			: { Id : 'itmHeadendGrid'			,El : function(){ return $i('#itmHeadendGrid'); 		}	,Name : ''					}
,	Sheet				: { Id : 'arSheet'					,El : function(){ return $i('#arSheet');				}	,Name : ''					}
,	Statistic			: { Id : 'itmStatistic'				,El : function(){ return $i('#itmStatistic');			}	,Name : ''					}
,	Chart				: { Id : 'itmChart'					,El : function(){ return $i('#itmChart');				}	,Name : ''					}
,	ChartView			: { Id : 'outputChartView'			,El : function(){ return $i('#outputChartView');		}	,Name : ''					}
,	OutputChartView		: { Id : 'outputChart'				,El : function(){ return $i('#outputChart');			}	,Name : ''					}
,	OutputChartMetrix	: { Id : 'OutputChartMetrix'		,El : function(){ return $i('#OutputChartMetrix');		}	,Name : ''					}
,	OutputChartBoxplot	: { Id : 'OutputChartBoxplot'		,El : function(){ return $i('#OutputChartBoxplot');		}	,Name : ''					}
,	OutputScriptStr		: { Id : 'OutputScriptStr'			,El : function(){ return $i('#OutputScriptStr');		}	,Name : ''					}
,	OutputScriptSummary	: { Id : 'OutputScriptSummary'		,El : function(){ return $i('#OutputScriptSummary');	}	,Name : ''					}
,	Chatbot				: { Id : 'chatBot'					,El : function(){ return $i('#chatBot');				}	,Name : ''					}
,	ChatbotButton		: { Id : 'btnChatBot' 				,El : function(){ return $i('#btnChatBot');				}	,Name : ''					}
,	ChatbotInput		: { Id : 'inputChatBot'				,El : function(){ return $i('#inputChatBot');			}	,Name : 'inputChatBot'		}
,	TimerBox			: { Id : 'itmTimer'					,El : function(){ return $i('#itmTimer');				}	,Name : ''					}
,	Timer				: { Id : 'timer'					,El : function(){ return $i('#timer');					}	,Name : ''					}
,	TimerTpA			: { Id : 'timerTypeA'				,El : function(){ return $i('#timerTypeA');				}	,Name : ''					}
,	TimerTpB			: { Id : 'timerTypeB'				,El : function(){ return $i('#timerTypeB');				}	,Name : ''					}
,	InputTimerType		: { Id : 'inputTimerType'			,El : function(){ return $i('#inputTimerType');			}	,Name : 'inputTimerType'	}
,	InputTimerHour		: { Id : 'inputTimerHour'			,El : function(){ return $i('#inputTimerHour');			}	,Name : 'inputTimerHour'	}
,	InputTimerMinute	: { Id : 'inputTimerMinute'			,El : function(){ return $i('#inputTimerMinute');		}	,Name : 'inputTimerMinute'	}
,	InputTimerMinutes	: { Id : 'inputTimerMinutes'		,El : function(){ return $i('#inputTimerMinutes');		}	,Name : 'inputTimerMinutes'	}
};




Options.Element.Diagram = {
	RuleItem			: { Id : 'itmDiagramItem' 			,El : function(){ return $i('#itmDiagramItem');			}	,Name : ''					}
,	RuleItemPlus		: { Id : 'itmDiagramPlus'			,El : function(){ return $i('#itmDiagramPlus');			}	,Name : ''					}
,	RuleAdmin			: { Id : 'arRuleAdmin'				,El : function(){ return $i('#arRuleAdmin');			}	,Name : ''					}
,	Canvas				: { Id : 'itmDiagramCanvas'			,El : function(){ return $i('#itmDiagramCanvas');		}	,Name : ''					}
,	Diagram				: { Id : 'itmDiagram'				,El : function(){ return $i('#itmDiagram');				}	,Name : ''					}
,	Contextmenu			: { Id : 'itmDiagramContextmenu'	,El : function(){ return $i('#itmDiagramContextmenu');	}	,Name : ''					}
,	History				: { Id : 'itmHistory'				,El : function(){ return $i('#itmHistory');				}	,Name : ''					}
,	HistoryGrid			: { Id : 'itmHistoryGrid'			,El : function(){ return $i('#itmHistoryGrid');			}	,Name : ''					}
,	HistoryDiagram		: { Id : 'itmHistoryDiagram'		,El : function(){ return $i('#itmHistoryDiagram');		}	,Name : ''					}
,	Property			: { Id : 'itmProperty'				,El : function(){ return $i('#itmProperty');			}	,Name : ''					}
};

 
/**
 * 전처리
 */


Options.Element.prep = {
		Property			: { Id : 'itmProperty'				,El : function(){ return $i('#itmProperty');			}	,Name : ''					}
		,typeList			: ["char","number","date","label"]
	};



Options.Element.Contextmenu = {
	Column				: { Id : 'itmContextmenuColumn'		,El : function(){ return $i('#itmContextmenuColumn');	}	,Name : ''					}
,	Setting				: { Id : 'itmContextmenuSetting'	,El : function(){ return $i('#itmContentmenuSetting');	}	,Name : ''					}
,	Chart				: { Id : 'itmContextmenuChart'		,El : function(){ return $i('#itmContextmenuChart');	}	,Name : ''					}
,	Details				: { Id : 'itmContextmenuDetails'	,El : function(){ return $i('#itmContextmenuDetails');	}	,Name : ''					}
,	Details2			: { Id : 'itmContextmenuDetails2'	,El : function(){ return $i('#itmContextmenuDetails2');	}	,Name : ''					}
,	ChartView			: { Id : 'itmChartView'				,El : function(){ return $i('#itmChartView');			}	,Name : ''					}
,	Modal				: { Id : 'itmContextmenuDetails2'	,El : function(){ return $i('#itmContextmenuDetails2');	}	,Name : ''					}
,	QueryTextarea		: { Id : 'useDefineValue'			,El : function(){ return $i('#useDefineValue');			}	,Name : ''					}
};

Options.Element.RuleAdmin = {
	Form				: { Id : 'formRule'					,El : function(){ return $i('#formRule');				}	,Name : 'formRule'			}
};
Options.Element.MemberAdmin = {
		Form				: { Id : 'formMember'					,El : function(){ return $i('#formMember');				}	,Name : 'formMember'			}
	};
Options.Element.StandardVoca = {
		Form				: { Id : 'formStandard'					,El : function(){ return $i('#formStandard');				}	,Name : 'formStandard'			}
	};
Options.Element.Blockchain = {
	Block				: { Id : 'blockchain'				,El : function(){ return $i('#blockchain');				}	,Name : ''					}
,	Info				: { Id : 'blockchainInfo'			,El : function(){ return $i('#blockchainInfo');			}	,Name : ''					}
};



Options.Uri = {};

Options.Uri.Url = {
	Login				: '/fixadata/login.fd'
,	DataInput			: '/fixadata/datainput.fd'
,	Process				: '/fixadata/process.fd'
,	RuleAdmin			: '/fixadata/ruleAdmin.fd'
};

Options.Uri.Root = {
	Images : {
		Loading			: '/fixadata-common/images/Loading.gif'
	,	RuleBasic		: '/fixadata-common/images/simbol-16x16-v1.01.png'
	,	RuleDatabase	: '/fixadata-common/images/ico-rule-db.png'
/*
	,	RuleDatabase	: '/fixadata-common/images/ico-ruleItem-db-26x23-v1.01.png'
	,	RuleRule		: '/fixadata-common/images/ico-ruleItem-rule-26x23-v1.01.png'
	,	RuleFilter		: '/fixadata-common/images/ico-ruleItem-filter-26x23-v1.01.png'
	,	RuleRscript		: '/fixadata-common/images/ico-ruleItem-filter-26x23-v1.01.png'
	,	RuleD3			: '/fixadata-common/images/ico-ruleItem-filter-26x23-v1.01.png'
*/
	}
};

Options.Uri.Ajax = {};
//ProjectSessionDell : '/fixadata/projectSessionDellAjax.fd'

Options.Uri.Ajax.Member = {
	Login				: '/ajax/loginAjax.fd'
,	Logout				: '/ajax/projectSessionDellAjax.fd'
,	List				: '/ajax/memberList.fd'
,	Save				: '/ajax/memberSave.fd'
,	MemberChk			: '/ajax/memberChk.fd'
};
Options.Uri.Ajax.StandardVoca = {
	List				: '/collect/standardList.fd'
,	Save				: '/collect/standardInsert.fd'	
};
Options.Uri.Ajax.ImportData = {
	Save				: '/common/importData.fd'	
};
Options.Uri.Ajax.CordDomain = {
	List				: '/collect/cordDomainList.fd'
,	Save				: '/collect/cordDomainInsert.fd'	
};
Options.Uri.Ajax.MemberReturn = {
	Login				: Options.Uri.Url.DataInput
};

Options.Uri.Ajax.Datainput = {
	Upload				: '/ajax/datainputUploadAjax.fd'
};

Options.Uri.Ajax.DatainputReturn = {
	Upload				: Options.Uri.Url.Process
};

Options.Uri.Ajax.Process = {
	DataList			: '/ajax/listData.fd'
,	ProjectSave			: '/ajax/projectSave.fd'
,	RuleItem			: '/ajax/ruleItemList.fd'
,	MemberItem			: '/ajax/memberItemList.fd'
,	ColumnList			: '/ajax/columnList.fd'
,	Output				: '/ajax/output.fd'
,	PlayOutput			: '/ajax/output.fd'
};

Options.Uri.Ajax.Project = {
	SessionRemove		: '/ajax/sessionRemove.fd'
,	List				: '/ajax/projectList.fd'
,	Open				: '/ajax/projectOpen.fd'
//,	New					: '/ajax/projectSessionDellAjax.fd'
,	New					: '/collect/datainput.fd'
};

Options.Uri.Ajax.Ruleadmin = {
	List				: '/ajax/ruleList.fd'
,	Save				: '/ajax/save.fd'
};

Options.Uri.Ajax.Blockchain = {
	List				: '/ajax/blockchainList.fd'
};



Options.Menu = {};

Options.Menu.Gnb = {};

Options.Menu.Tnb = {
	File	: {
		Name    : 'File'
	,	Link	: '#'
	,	Class	: 'item'
	,	Onclick	: 'return false;'
	,	Lock	: 'lock'
	,	Submenu : {
			Logout			: { Type : 'menu'	,Name : 'Logout'		,Lock : 'unlock'	,Link : '#'	,Event : 'Core.Member.Logout();return false;' }
		,	Line1			: { Type : 'line' }
		,	Save			: { Type : 'menu'	,Name : 'Save'			,Lock : 'unlock'	,Link : '#'	,Event : 'Core.Project.SaveShow();return false;' }
		,	SaveAs			: { Type : 'menu'	,Name : 'Save As'		,Lock : 'unlock'	,Link : '#'	,Event : 'Core.Project.SaveAsShow();return false;' }
		,	Open			: { Type : 'menu'	,Name : 'Open'			,Lock : 'unlock'	,Link : '#'	,Event : 'Core.Project.OpenShow();return false;' }
		,	FileUpload		: { Type : 'menu'	,Name : 'File Upload'	,Lock : 'unlock'	,Link : '#'	,Event : 'window.location.href ="/collect/datainput.fd?type=file"' }
		,	DBCollect		: { Type : 'menu'	,Name : 'DB Collect'	,Lock : 'unlock'	,Link : '#'	,Event : 'window.location.href ="/collect/datainput.fd?type=db"' }
		,	OpenApi			: { Type : 'menu'	,Name : 'OpenApi'		,Lock : 'unlock'	,Link : '#'	,Event : 'window.location.href ="/collect/datainput.fd?type=OpenApi"' }
		,	SampleData		: { Type : 'menu'	,Name : 'Sample Data'	,Lock : 'unlock'	,Link : '#'	,Event : 'window.location.href ="/collect/datainput.fd?type=sample"' }
		,	exportData		: { Type : 'menu'	,Name : 'Export'		,Lock : 'unlock'	,Link : '#'	,Event : 'Core.exportData()' }
		,	importData		: { Type : 'menu'	,Name : 'Import'		,Lock : 'unlock'	,Link : '#'	,Event : 'Core.importData()' } //
		,	apprelease		: { Type : 'menu'	,Name : 'Release'		,Lock : 'unlock'	,Link : '#'	,Event : 'Core.appRelease()' }
		,	scheduling		: { Type : 'menu'	,Name : 'Scheduling'	,Lock : 'unlock'	,Link : '#'	,Event : 'window.location.href ="/collect/datainput.fd?type=scheduling"' }
		
		
		}
	}
,	Windows	: {
		Name	: 'Windows'
	,	Link	: '#'
	,	Class	: 'item'
	,	Onclick	: 'return false;'
	,	Lock	: 'lock'
	,	Submenu	: {
			CloseConsole	: { Type : 'menu'	,Name : 'View Console'	,Lock : 'unlock'	,Link : '#'	,Event : 'Core.Panel.Close("console");' }
		,	CloseHistory	: { Type : 'menu'	,Name : 'View History'	,Lock : 'unlock'	,Link : '#'	,Event : 'Core.Panel.Close("history");' }
		//,	CloseChatbot	: { Type : 'menu'	,Name : 'View Chatbot'	,Lock : 'unlock'	,Link : '#'	,Event : 'Core.Panel.Close($i(\'#' + Options.Element.Global.Chatbot.Id + ' .close\'));return false;' }
		}
	}
,	Help	: {
		Name	: 'Help'
	,	Link	: '#'
	,	Class	: 'item'
	,	Onclick	: 'return false;'
	,	Lock	: 'lock'
	,	Submenu	: {
			Manual			: { Type : 'menu'	,Name : 'Manual'		,Lock : 'unlock'	,Link : '#'	,Event : 'Core.pdfdownload("/outlier/getpdfFile.fd");' }
			,Tutorial			: { Type : 'menu'	,Name : 'Tutorial'		,Lock : 'unlock'	,Link : '#'	,Event : 'Prep.tutorialShow()' }

		}
	}
,	Admin	: {
	Name	: 'Admin'
,	Link	: '#'
,	Class	: 'item'
,	Onclick	: 'return false;'
,	Lock	: 'lock'
,	Submenu	: {
		RuleSetting		: { Type : 'menu'	,Name : 'Rule Settings'	,Lock : 'unlock'	,Link : '#'	,Event : 'Core.RuleUser.List();return false;' },
		}
	}

,	lang	: {
	Id		: 'lang'
,	Name	: 'lang'
,	Link	: '#'
,	Class	: 'item'
,	Onclick	: 'return false;'
,	Lock	: 'unlock'
,	Submenu	: 
		{
	ko		: { Type : 'menu'	,Name : 'ko'	,Lock : 'unlock'	,Link : '#'	,Event : 'if(window.location.href.split("datainput").length>1){window.location.href="/collect/datainput.fd?language=ko"}else{window.location.href="/prep/prep.fd?language=ko"}'}
	,vt		: { Type : 'menu'	,Name : 'vt'	,Lock : 'unlock'	,Link : '#'	,Event : 'if(window.location.href.split("datainput").length>1){window.location.href="/collect/datainput.fd?language=vt"}else{window.location.href="/prep/prep.fd?language=vt"}'}
	,en		: { Type : 'menu'	,Name : 'en'	,Lock : 'unlock'	,Link : '#'	,Event : 'if(window.location.href.split("datainput").length>1){window.location.href="/collect/datainput.fd?language=en"}else{window.location.href="/prep/prep.fd?language=en"}'}

		}
	}

};

//다국어 기능 처리 사용유무 기능
if(multi_language == "1")
{
	delete Options.Menu.Tnb.lang;
}

// 서버버전이면서 관리자 일때(메뉴 생성)
if(auth==0)
{
	
	Options.Menu.Tnb.Admin = {};
	Options.Menu.Tnb.Admin = {
		Name	: 'Admin'
	,	Link	: '#'
	,	Class	: 'item'
	,	Onclick	: 'return false;'
	,	Lock	: 'lock'
	,	Submenu	: {
			RuleSetting		: { Type : 'menu'	,Name : 'Rule Settings'		,Lock : 'unlock'	,Link : '#'	,Event : 'Core.RuleUser.List();return false;' }
			,memberManager	: { Type : 'menu'	,Name : 'Member Settings'	,Lock : 'unlock'	,Link : '#'	,Event : 'Core.Member.List();return false;' }
			,base_info01	: { Type : 'menu'	,Name : lang_return("fixa.core.title207")	,Lock : 'unlock'	,Link : '#'	,Event : 'Core.StandardVoca.List();return false;' }
			,base_info02	: { Type : 'menu'	,Name : lang_return("fixa.core.title206")		,Lock : 'unlock'	,Link : '#'	,Event : 'Core.CordDomain.List();return false;' }
				
			}
	};
}

Options.Menu.Level1 = function() {
	Options.Menu.Tnb.File['Lock']						= 'unlock';
	Options.Menu.Tnb.File.Submenu.Logout['Name']		= 'Log-in';
	Options.Menu.Tnb.File.Submenu.Save['Lock']			= 'lock';
	Options.Menu.Tnb.File.Submenu.Open['Lock']			= 'lock';
	Options.Menu.Tnb.File.Submenu.NewProject['Lock']	= 'lock';
	Options.Menu.Tnb.Help['Lock']						= 'unlock';
};

Options.Menu.Level2 = function() {
	Options.Menu.Tnb.File['Lock']						= 'unlock';
	Options.Menu.Tnb.File.Submenu.Save['Lock']			= 'lock';
	Options.Menu.Tnb.File.Submenu.SaveAs['Lock']		= 'lock';
	Options.Menu.Tnb.Help['Lock']						= 'unlock';
	Options.Menu.Tnb.Admin['Lock']						= 'lock';
	Options.Menu.Tnb.File.Submenu.exportData['Lock']	= 'lock';
	Options.Menu.Pnb.File.Open['Lock']					= 'unlock';
};

Options.Menu.Level3 = function() {
	Options.Menu.Tnb.File['Lock']						= 'unlock';
	Options.Menu.Tnb.Help['Lock']						= 'unlock';
	Options.Menu.Tnb.Windows['Lock']					= 'unlock';
	Options.Menu.Tnb.Admin['Lock']						= 'unlock';
	Options.Menu.Pnb.History.Redo['Lock']				= 'unlock';
	Options.Menu.Pnb.History.Undo['Lock']				= 'unlock';
	Options.Menu.Pnb.File.Open['Lock']					= 'unlock';
	Options.Menu.Pnb.File.Save['Lock']					= 'unlock';
	Options.Menu.Pnb.Play.Play['Lock']					= 'unlock';
	Options.Menu.Pnb.Play.Reset['Lock']					= 'unlock';
//	Options.Menu.Pnb.Download.Original['Lock']			= 'unlock';
	Options.Menu.Pnb.Download.Last['Lock']				= 'unlock';
};

Options.Menu.Pnb = {
	History		: {
		Undo		: { Type : 'icon' ,Name : 'Undo'		,ItemType : 'undo'		,Class : 'item btnHistory btnUndo'	,Lock : 'lock'		,Link : '#' ,Event : 'if($i(this).is(\'.lock\')){return false;};Core.History.Undo(this);return false;'	}
	,	Redo		: { Type : 'icon' ,Name : 'Redo'		,ItemType : 'redo'		,Class : 'item btnHistory btnRedo'	,Lock : 'lock'		,Link : '#' ,Event : 'if($i(this).is(\'.lock\')){return false;};Core.History.Redo(this);return false;'	}
	}
,	File		: {
		Open		: { Type : 'icon' ,Name : 'Open'		,ItemType : 'open'		,Class : 'item btnOpen'				,Lock : 'lock'		,Link : '#' ,Event : 'if($i(this).is(\'.lock\')){return false;};Core.Project.OpenShow();return false;'	}
	,	Save		: { Type : 'icon' ,Name : 'Save'		,ItemType : 'save'		,Class : 'item btnSave'				,Lock : 'lock'		,Link : '#' ,Event : 'if($i(this).is(\'.lock\')){return false;};Core.Project.SaveShow();return false;'	}
	}
,	Play		: {

		Play		: { Type : 'icon' ,Name : 'Play'		,ItemType : 'play'		,Class : 'item btnPlay btnPlay'		,Lock : 'lock'		,Link : '#' ,Event : 'if($i(this).is(\'.lock\')){return false;};Core.Diagram.run("workflow");return false;'		}
	,	Reset		: { Type : 'icon' ,Name : 'Reset'		,ItemType : 'reset'		,Class : 'item btnPlay btnReset'	,Lock : 'lock'		,Link : '#' ,Event : 'if($i(this).is(\'.lock\')){return false;};Core.Diagram.Reset(true);return false;'		}
	}
,	Download	: {
		Last		: { Type : 'icon' ,Name : 'Last'		,ItemType : 'download'	,Class : 'item btnDown last'		,Lock : 'lock'		,Link : '#'	,Event :"if($i(this).is(\'.lock\')){return false;};if($('#arSheet .item > .on').attr('id') =='data_ori' || $('#arSheet .item > .on').attr('id')=='data_prep'){ Core.jexcelDown_ori_prep(); return false;}else if($('#arSheet .item > .on').attr('id')=='workflow_output'){ Core.jexcelDown(); return false;} " 	}

	}
};

Options.Menu.Context = [
	{ Type : 'menu' ,Name : 'Set Colomn'	,Text : lang_return("fixa.core.title219")	,Link : '#' ,Event : 'Process.Contextmenu.Column();return false;'	} //적용 필드 설정
,	{ Type : 'menu' ,Name : 'Set Rule'		,Text : lang_return("fixa.core.title220")	,Link : '#' ,Event : 'Process.Contextmenu.Setting();return false;'	} //사용자 정의 설정
,	{ Type : 'menu' ,Name : 'View Chart'	,Text : lang_return("fixa.core.title221")	,Link : '#' ,Event : 'Process.Contextmenu.Chart();return false;'	}//단위 결과 차트보기
]



Options.Variable = {};

/************************************************************
 * slick grid 관련 내용
 ************************************************************/

//slick grid 관련 정보저장
Options.Variable.slickGrid = {};

//id 에 대한 정보
Options.Variable.slickGrid.id = {
		"oriGrid" : []
,		"prepGrid" : []
};

//이상치검출결과 slick gridid
Options.Variable.slickGrid.outlierResultId = {};

//header정보
Options.Variable.slickGrid.header = {
		"oriGrid" : []
,		"prepGrid" : []
};

//header 및 옵션정보 [ type(int, char, date 등) ]  
Options.Variable.slickGrid.headerOption = {};

//데이터 리스트 정보
Options.Variable.slickGrid.dataList = {};


Options.Variable.Global = {
	PROJECT_SN			: ''
,	PROJECT_NAME		: ''
,	FILE_NAME			: ''
,	SheetClick			: true
,	SheetClickOutput	: true
,	History				: true
,	SetTimer			: null
,	TimeChart			: ''
,	pieChart			: null
};

Options.Variable.History = {
	Grid	: []
,	Diagram	: { Rule : [] ,Global : [] ,DataSel : { SelRule : '' ,SelId : '' ,SelType : '' } }
};


Options.Variable.Diagram = {
	Graph				: null
,	Paper				: null
,	Cells				: []	
,	Global				: {}
,	RuleColorList		: ['#222222' ,'#222222' ,'#222222' ,'#222222' ,'#222222']
,	RuleColorDiagram	: ['#6d6d6d' ,'#c99326' ,'#1c9082' ,'#7b8c36' ,'#58959b']
};


Options.Variable.Chart = {
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
};

Options.Variable.Temp = {
	Global	: null
,	Cells	: null
};


Options.Pattern = {
	Id					: /[a-z0-9]{4,20}/
,	Password			: /[a-z0-9!@$_]{8,20}/
,	Password2			: /[a-z0-9]{10,20}/
,	SpecialCharacter	: /[!@$_]/
};