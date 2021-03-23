(function($i){
	
Prep = {};

Prep.ManifySetting = function(){
$('[data-magnify=gallery]').magnify();
$('[data-magnify=gallery]').magnify({

	  // Enable modal to drag
	  draggable: true,

	  // Enable modal to resize
	  resizable: true,

	  // Enable image to move
	  movable: true,

	  // Enable keyboard navigation
	  keyboard: true,

	  // Shows the title
	  title: true,

	  // Min width of modal
	  modalWidth: 320,

	  // Min height of modal
	  modalHeight: 320,

	  // Enable the page content fixed
	  fixedContent: true,

	  // Disable the modal size fixed
	  /* fixed<a href='https://www.jqueryscript.net/tags.php?/Modal/'>Modal</a>Size: false,  */

	  // Disable the image viewer maximized on init
	  initMaximized: false,

	  // Threshold of modal to browser window
	  gapThreshold: 0.02,

	  // Threshold of image ratio
	  ratioThreshold: 0.1,

	  // Min ratio of image when zoom out
	  minRatio: 0.05,

	  // Max ratio of image when zoom in
	  maxRatio: 16,

	  // Toolbar options in header
	  headToolbar: [
	    'maximize',
	    'close'
	  ],

	  // Toolbar options in footer
	  footToolbar: [
	    'zoomIn',
	    'zoomOut',
	    'prev',
	    'fullscreen',
	    'next',
	    'actualSize',
	    'rotateRight'
	  ],

	  // Customize button icon
	  icons: {
	    minimize: '<svg viewBox="0 0 1024 1024" class="svg-inline-icon">\
	              <path fill="currentColor" d="M1024 749.714v109.714c0 50.286\
	              -41.143 91.429-91.429 91.429h-841.143c-50.286 0-91.429-41.143\
	              -91.429-91.429v-109.714c0-50.286 41.143-91.429 91.429-91.429\
	              h841.143c50.286 0 91.429 41.143 91.429 91.429z"></path>\
	              </svg>',
	    maximize: '<svg viewBox="0 0 1024 1024" class="svg-inline-icon">\
	              <path fill="currentColor" d="M146.286 804.571h731.429v-438.857\
	              h-731.429v438.857zM1024 164.571v694.857c0 50.286-41.143 91.429\
	              -91.429 91.429h-841.143c-50.286 0-91.429-41.143-91.429-91.429v\
	              -694.857c0-50.286 41.143-91.429 91.429-91.429h841.143c50.286 0 \
	              91.429 41.143 91.429 91.429z"></path>\
	              </svg>',
	    close: '<svg viewBox="0 0 804.5714285714286 1024" class="svg-inline-icon">\
	            <path fill="currentColor" d="M741.714 755.429c0 14.286-5.714 \
	            28.571-16 38.857l-77.714 77.714c-10.286 10.286-24.571 16-38.857 16\
	            s-28.571-5.714-38.857-16l-168-168-168 168c-10.286 10.286-24.571 16\
	            -38.857 16s-28.571-5.714-38.857-16l-77.714-77.714c-10.286-10.286\
	            -16-24.571-16-38.857s5.714-28.571 16-38.857l168-168-168-168c-10.286\
	            -10.286-16-24.571-16-38.857s5.714-28.571 16-38.857l77.714-77.714\
	            c10.286-10.286 24.571-16 38.857-16s28.571 5.714 38.857 16l168 168 \
	            168-168c10.286-10.286 24.571-16 38.857-16s28.571 5.714 38.857 \
	            16l77.714 77.714c10.286 10.286 16 24.571 16 38.857s-5.714 28.571\
	            -16 38.857l-168 168 168 168c10.286 10.286 16 24.571 16 38.857z"></path>\
	            </svg>',
	    zoomIn: '<svg viewBox="0 0 950.8571428571428 1024" class="svg-inline-icon">\
	            <path fill="currentColor" d="M585.143 457.143v36.571c0 9.714-8.571 \
	            18.286-18.286 18.286h-128v128c0 9.714-8.571 18.286-18.286 18.286\
	            h-36.571c-9.714 0-18.286-8.571-18.286-18.286v-128h-128c-9.714 0\
	            -18.286-8.571-18.286-18.286v-36.571c0-9.714 8.571-18.286 18.286\
	            -18.286h128v-128c0-9.714 8.571-18.286 18.286-18.286h36.571c9.714 0 \
	            18.286 8.571 18.286 18.286v128h128c9.714 0 18.286 8.571 18.286 \
	            18.286zM658.286 475.429c0-141.143-114.857-256-256-256s-256 114.857\
	            -256 256 114.857 256 256 256 256-114.857 256-256zM950.857 950.857\
	            c0 40.571-32.571 73.143-73.143 73.143-19.429 0-38.286-8-51.429\
	            -21.714l-196-195.429c-66.857 46.286-146.857 70.857-228 70.857\
	            -222.286 0-402.286-180-402.286-402.286s180-402.286 402.286-402.286 \
	            402.286 180 402.286 402.286c0 81.143-24.571 161.143-70.857 228\
	            l196 196c13.143 13.143 21.143 32 21.143 51.429z"></path>\
	            </svg>',
	    zoomOut: '<svg viewBox="0 0 950.8571428571428 1024" class="svg-inline-icon">\
	            <path fill="currentColor" d="M585.143 457.143v36.571c0 9.714-8.571 \
	            18.286-18.286 18.286h-329.143c-9.714 0-18.286-8.571-18.286-18.286\
	            v-36.571c0-9.714 8.571-18.286 18.286-18.286h329.143c9.714 0 18.286 \
	            8.571 18.286 18.286zM658.286 475.429c0-141.143-114.857-256-256-256\
	            s-256 114.857-256 256 114.857 256 256 256 256-114.857 256-256z\
	            M950.857 950.857c0 40.571-32.571 73.143-73.143 73.143-19.429 0\
	            -38.286-8-51.429-21.714l-196-195.429c-66.857 46.286-146.857 70.857\
	            -228 70.857-222.286 0-402.286-180-402.286-402.286s180-402.286 \
	            402.286-402.286 402.286 180 402.286 402.286c0 81.143-24.571 161.143\
	            -70.857 228l196 196c13.143 13.143 21.143 32 21.143 51.429z"></path>\
	            </svg>',
	    prev: '<svg viewBox="0 0 914.2857142857142 1024" class="svg-inline-icon">\
	          <path fill="currentColor" d="M877.714 512v73.143c0 38.857-25.714 \
	          73.143-66.857 73.143h-402.286l167.429 168c13.714 13.143 21.714 32 \
	          21.714 51.429s-8 38.286-21.714 51.429l-42.857 43.429c-13.143 13.143\
	          -32 21.143-51.429 21.143s-38.286-8-52-21.143l-372-372.571c-13.143\
	          -13.143-21.143-32-21.143-51.429s8-38.286 21.143-52l372-371.429c13.714\
	          -13.714 32.571-21.714 52-21.714s37.714 8 51.429 21.714l42.857 42.286\
	          c13.714 13.714 21.714 32.571 21.714 52s-8 38.286-21.714 52l-167.429 \
	          167.429h402.286c41.143 0 66.857 34.286 66.857 73.143z"></path>\
	          </svg>',
	    next: '<svg viewBox="0 0 841.1428571428571 1024" class="svg-inline-icon">\
	          <path fill="currentColor" d="M841.143 548.571c0 19.429-7.429 38.286\
	          -21.143 52l-372 372c-13.714 13.143-32.571 21.143-52 21.143s-37.714\
	          -8-51.429-21.143l-42.857-42.857c-13.714-13.714-21.714-32.571-21.714\
	          -52s8-38.286 21.714-52l167.429-167.429h-402.286c-41.143 0-66.857\
	          -34.286-66.857-73.143v-73.143c0-38.857 25.714-73.143 66.857-73.143\
	          h402.286l-167.429-168c-13.714-13.143-21.714-32-21.714-51.429s8\
	          -38.286 21.714-51.429l42.857-42.857c13.714-13.714 32-21.714 51.429\
	          -21.714s38.286 8 52 21.714l372 372c13.714 13.143 21.143 32 21.143 \
	          51.429z"></path>\
	          </svg>',
	    fullscreen: '<svg viewBox="0 0 1097.142857142857 1024" class="svg-inline-icon">\
	                <path fill="currentColor" d="M365.714 329.143c0 60.571-49.143 \
	                109.714-109.714 109.714s-109.714-49.143-109.714-109.714 49.143\
	                -109.714 109.714-109.714 109.714 49.143 109.714 109.714z\
	                M950.857 548.571v256h-804.571v-109.714l182.857-182.857 91.429 \
	                91.429 292.571-292.571zM1005.714 146.286h-914.286c-9.714 0\
	                -18.286 8.571-18.286 18.286v694.857c0 9.714 8.571 18.286 \
	                18.286 18.286h914.286c9.714 0 18.286-8.571 18.286-18.286\
	                v-694.857c0-9.714-8.571-18.286-18.286-18.286zM1097.143 164.571\
	                v694.857c0 50.286-41.143 91.429-91.429 91.429h-914.286c-50.286 \
	                0-91.429-41.143-91.429-91.429v-694.857c0-50.286 41.143-91.429 \
	                91.429-91.429h914.286c50.286 0 91.429 41.143 91.429 91.429z"></path>\
	                </svg>',
	    actualSize: '<svg viewBox="0 0 877.7142857142857 1024" class="svg-inline-icon">\
	                <path fill="currentColor" d="M733.143 309.143l-202.857 202.857 \
	                202.857 202.857 82.286-82.286c10.286-10.857 26.286-13.714 40-8 \
	                13.143 5.714 22.286 18.857 22.286 33.714v256c0 20-16.571 36.571\
	                -36.571 36.571h-256c-14.857 0-28-9.143-33.714-22.857-5.714\
	                -13.143-2.857-29.143 8-39.429l82.286-82.286-202.857-202.857\
	                -202.857 202.857 82.286 82.286c10.857 10.286 13.714 26.286 8 \
	                39.429-5.714 13.714-18.857 22.857-33.714 22.857h-256c-20 0\
	                -36.571-16.571-36.571-36.571v-256c0-14.857 9.143-28 22.857\
	                -33.714 13.143-5.714 29.143-2.857 39.429 8l82.286 82.286 \
	                202.857-202.857-202.857-202.857-82.286 82.286c-6.857 6.857\
	                -16 10.857-25.714 10.857-4.571 0-9.714-1.143-13.714-2.857\
	                -13.714-5.714-22.857-18.857-22.857-33.714v-256c0-20 16.571\
	                -36.571 36.571-36.571h256c14.857 0 28 9.143 33.714 22.857 \
	                5.714 13.143 2.857 29.143-8 39.429l-82.286 82.286 202.857 \
	                202.857 202.857-202.857-82.286-82.286c-10.857-10.286-13.714\
	                -26.286-8-39.429 5.714-13.714 18.857-22.857 33.714-22.857h256\
	                c20 0 36.571 16.571 36.571 36.571v256c0 14.857-9.143 28-22.286 \
	                33.714-4.571 1.714-9.714 2.857-14.286 2.857-9.714 0-18.857-4\
	                -25.714-10.857z"></path>\
	                </svg>',
	    rotateLeft: '<svg viewBox="0 0 877.7142857142857 1024" class="svg-inline-icon">\
	                <path fill="currentColor" d="M877.714 512c0 241.714-197.143 \
	                438.857-438.857 438.857-130.857 0-254.286-57.714-337.714-158.286\
	                -5.714-7.429-5.143-18.286 1.143-24.571l78.286-78.857c4-3.429 \
	                9.143-5.143 14.286-5.143 5.143 0.571 10.286 2.857 13.143 6.857 \
	                56 72.571 140 113.714 230.857 113.714 161.143 0 292.571-131.429 \
	                292.571-292.571s-131.429-292.571-292.571-292.571c-74.857 0\
	                -145.714 28.571-198.857 78.286l78.286 78.857c10.857 10.286 \
	                13.714 26.286 8 39.429-5.714 13.714-18.857 22.857-33.714 22.857\
	                h-256c-20 0-36.571-16.571-36.571-36.571v-256c0-14.857 9.143-28 \
	                22.857-33.714 13.143-5.714 29.143-2.857 39.429 8l74.286 73.714\
	                c80.571-76 189.714-121.143 302.286-121.143 241.714 0 438.857 \
	                197.143 438.857 438.857z"></path>\
	                </svg>',
	    rotateRight: '<svg viewBox="0 0 877.7142857142857 1024" class="svg-inline-icon">\
	                  <path fill="currentColor" d="M877.714 146.286v256c0 20-16.571 \
	                  36.571-36.571 36.571h-256c-14.857 0-28-9.143-33.714-22.857\
	                  -5.714-13.143-2.857-29.143 8-39.429l78.857-78.857c-53.714\
	                  -49.714-124.571-78.286-199.429-78.286-161.143 0-292.571 \
	                  131.429-292.571 292.571s131.429 292.571 292.571 292.571\
	                  c90.857 0 174.857-41.143 230.857-113.714 2.857-4 8-6.286 \
	                  13.143-6.857 5.143 0 10.286 1.714 14.286 5.143l78.286 78.857\
	                  c6.857 6.286 6.857 17.143 1.143 24.571-83.429 100.571-206.857 \
	                  158.286-337.714 158.286-241.714 0-438.857-197.143-438.857\
	                  -438.857s197.143-438.857 438.857-438.857c112.571 0 221.714 \
	                  45.143 302.286 121.143l74.286-73.714c10.286-10.857 26.286\
	                  -13.714 40-8 13.143 5.714 22.286 18.857 22.286 33.714z"></path>\
	                  </svg>'
	  },

	  // Customize language of button title
	  i18n: {
	    minimize: 'minimize',
	    maximize: 'maximize',
	    close: 'close',
	    zoomIn: 'zoom-in(+)',
	    zoomOut: 'zoom-out(-)',
	    prev: 'prev(←)',
	    next: 'next(→)',
	    fullscreen: 'fullscreen',
	    actualSize: 'actual-size(Ctrl+Alt+0)',
	    rotateLeft: 'rotate-left(Ctrl+,)',
	    rotateRight: 'rotate-right(Ctrl+.)'
	  },

	  // Enable multiple instances
	  multiInstances: true,

	  // Init trigger event
	  initEvent: 'click',

	  // Enable animation
	  /* init<a href='https://www.jqueryscript.net/animation/'>Animation</a>: true, */

	  // Disable modal position fixed when change images
	  fixedModalPos: false,

	  // Modal z-index
	  zIndex: 1090,

	  // Selector of drag handler
	  dragHandle: false,

	  // Callback events
	  callbacks: {
	    beforeOpen: $.noop,
	    opened: $.noop,
	    beforeClose: $.noop,
	    closed: $.noop,
	    beforeChange: $.noop,
	    changed: $.noop
	  },

	  // Load the image progressively
	  progressiveLoading: true

	 });

	console.log("MagnifySetting :","ok");
};
Prep.EventSetting = function(){
	$(document).tooltip({
       content: function() {
        return $(this).prop('data-text');
       }
    });
	$(document).on('contextmenu', function() {
		  return false;
	});
	var eventBody = document.querySelector('body');
	var eventCanvas = document.querySelector('#itmDiagramCanvas');
	eventBody.addEventListener('keydown', function(event) {
		if(event.keyCode == 16){
			Options.keyVal = true;
		}
	});
	eventBody.addEventListener('keyup', function(event) {
		if(event.keyCode == 16){
			Options.keyVal = false;
			$("#diagram_contextMenu").css("display","none");
		}
	});
	eventCanvas.addEventListener('mousewheel', function(event){
		for(var i=0; i<$("image").length; i++){
		var modelId = "";
			if(i != 0){
				if($("image:eq("+i+")").parent().parent().attr("data-type") !="devs.MyImageModel"){
					modelId =  $("image:eq("+i+")").parent().parent().attr("model-id");
					$("#itmDiagram a.jointJS_shapes_close#"+modelId+"").css("display","none");
				}
			}
		}
	});
	
	console.log("EventSetting :","ok");
};
Prep.GridSetting = function(){
	var	columns = [];
	var	data = [];
	Options.Variable.slickGrid.id["oriGrid"] = new Object();
	Options.Variable.slickGrid.id["oriGrid"] = slickGrid.init(Options.slickgrid.option['default_grid_option'], Options.Variable.slickGrid.id["oriGrid"], "oriGrid", columns, data);
	Options.Variable.slickGrid.id["prepGrid"] = new Object();
	Options.Variable.slickGrid.id["prepGrid"] = slickGrid.init(options, Options.Variable.slickGrid.id["prepGrid"], "prepGrid", columns, data);	
	//소팅
	
	
	
//	Options.Variable.slickGrid.id["oriGrid"].onSort.subscribe(function (e, args) {
//		
//		  var cols = args.sortCols;
//
// 	     
// 	      Options.Variable.slickGrid.id["oriGrid"].getData().sort(function (dataRow1, dataRow2) {
// 	    	  
// 	    	
// 	    	  
// 	        for (var i = 0, l = cols.length; i < l; i++) {
// 	          var field = cols[i].sortCol.field;
// 	          var sign = cols[i].sortAsc ? 1 : -1;
// 	          var value1 = dataRow1[field], value2 = dataRow2[field];
// 	        
//	 	         
// 	          
//	 	         if(isDate(value1)==true && isDate(value2)==true)
//	  	         {
//	  	    		
//	  	    		value1 = new Date(value1).getTime();
//	 	         	value2 = new Date(value2).getTime();
//	  	    		 
//	  	    		var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
//	  	         }
//	 	         else if(isNumber2(value1)==true && isNumber2(value2)==true)
//	  	         {
//	  	    		
//	  	    		value1 = Number(value1);
//	 	         	value2 = Number(value2); 
//	 	         	var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
//	  	         }
//	  	    	 else
//	  	    	 {
//	  	    		
//	  	    		 var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
//	  	    	 }
//  	    	
// 	          
// 	          	
//	          
// 	          
// 	          
// 	         
// 	          if (result != 0) {
// 	            return result;
// 	          }
// 	        }
// 	        return 0;
// 	      });
// 	     Options.Variable.slickGrid.id["oriGrid"].invalidate();
// 	     Options.Variable.slickGrid.id["oriGrid"].render();
// 	});
//	
//	
//	Options.Variable.slickGrid.id["prepGrid"] = new Object();
//	Options.Variable.slickGrid.id["prepGrid"] = slickGrid.init(options, Options.Variable.slickGrid.id["prepGrid"], "prepGrid", columns, data);	
//	
//	
//	
//	
//	Options.Variable.slickGrid.id["prepGrid"].onSort.subscribe(function (e, args) {
//		
//			
//		var cols = args.sortCols;
//
//		Options.Variable.slickGrid.id["prepGrid"].getData().sort(function (dataRow1, dataRow2) {
// 	        for (var i = 0, l = cols.length; i < l; i++) {
// 	          var field = cols[i].sortCol.field;
// 	          var sign = cols[i].sortAsc ? 1 : -1;
// 	          var value1 = dataRow1[field], value2 = dataRow2[field];
// 	          //var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
// 	          
// 	          
// 	         if(isDate(value1)==true && isDate(value2)==true)
//  	         {
//  	    		
//  	    		value1 = new Date(value1).getTime();
// 	         	value2 = new Date(value2).getTime();
//  	    		 
//  	    		var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
//  	         }
// 	         else if(isNumber2(value1)==true && isNumber2(value2)==true)
//  	         {
// 	        	
//  	    		value1 = Number(value1);
// 	         	value2 = Number(value2); 
// 	         	var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
//  	         }
//  	    	 else
//  	    	 {
//  	    		
//  	    		 var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
//  	    	 }
// 	          
// 	          if (result != 0) {
// 	            return result;
// 	          }
// 	        }
// 	        return 0;
// 	      });
// 	     Options.Variable.slickGrid.id["prepGrid"].invalidate();
// 	     Options.Variable.slickGrid.id["prepGrid"].render();
// 	});
//	
};

/**
 * 블록체인 바인딩 및 tooltip 등
 */
Prep.bindBlockChain = function(list)
{
	$("#blockchain").empty();
	if(list != null){
		for(i=0;i<list.length;i++)
		{
			
			if(list[i]['mac-address']!=undefined)
			{
				mac_address				= list[i]['mac-address'];
				text					= list[i]['text'];
				data_value_column		= list[i]['data-value-cloumn'];
				title					= list[i]['title'];
				data_value_before		= list[i]['data-value-before'];
				data_value_after		= list[i]['data-value-after'];
				data_value_befType		= list[i]['data-value-befType'];
				data_value_aftType		= list[i]['data-value-aftType'];
				data_index_col			= list[i]['data-index-col'];
				data_index				= list[i]['data-index'];
				create_date 			= list[i]['create-date'];
				
				block_number = 
				
				
				
				block_size = (data_value_after.length + data_value_before.length);
				
				block_number = numberPad(i+1,8);
				block = $("<ul/>",{"class":"bc_area"});
				block.append($("<li/>",{"class":"bc_icon","data_value_column":""+data_value_column,"data_value_before":data_value_before,"data_value_after":data_value_after,"data_value_befType":data_value_befType,"data_value_aftType":data_value_aftType}));
				block.append($("<li/>")
										.append($("<p/>",{"text":"Block Number:"}).append($("<span/>",{"text":block_number,"title":block_number})))
										.append($("<p/>",{"text":"column:"}).append($("<span/>",{"text":data_value_column,"title":data_value_column})))
										.append($("<p/>",{"text":"create_time:"}).append($("<span/>",{"text":create_date})))
										.append($("<p/>",{"text":"Block-size:"}).append($("<span/>",{"text":block_size})))
										.append($("<p/>",{"text":"Block-owner:"}).append($("<span/>",{"text":mac_address})))
										
							);
				block.append($("<li/>",{"class":"bc_down"}));
			
				$("#blockchain").append(block);
			}
		}
		
	}
}

Prep.GridDataSetting = function(project_sn,project_data_sn){
	var selectedRows = [];
	//var	columns = [];
	var	data = [];
	var param = {
			
			  "project_sn"     : project_sn
			, "project_data_sn": project_data_sn
		}; 
		
		restRequest('/prep/loadData.fd', 'GET', param, function(data){
			
			
			if(data.projectName!="" && data.projectName!=null)
			{
				$("#projectNm").val(data.projectName);
				$("#historyProjectName").text(data.projectName);
				$("#projectNm").attr("readonly",true); 
				$("#mac_address").val(data.mac_address);
				$("#itmHistoryGrid li a:eq(0)").attr("mac_address",data.mac_address);

			//프로젝트 이름이 없을 경우 *데이터 이상치 검출 , 이상치 검출결과 텝 버튼 lock
			}else{
				
				$("#data_output").attr("class","lock");
				$("#data_output").on("click",function(){
					alert_message('데이터이상치 검출을 사용하기 위해서는 프로젝트를 저장하신후 사용이 가능합니다.');
				});
				
				$("#workflow_output").attr("class","lock");
				
			}
			
			
			columns = data.result.header;
			ori_data = data.result.data;
			
//			//blockchain bind
//			if(data.result.blockchain.length != 0){
//				
			Prep.bindBlockChain(data.result.blockchain);
//			}
			var list = data.result.blockchain;
			
			if(list != null){
				for(i=0;i<list.length;i++)
				{
					
					if(list[i]['mac-address']!=undefined)
					{
						mac_address				= list[i]['mac-address'];
						text					= list[i]['text'];
						data_value_column		= list[i]['data-value-cloumn'];
						title					= list[i]['title'];
						data_value_before		= list[i]['data-value-before'];
						data_value_after		= list[i]['data-value-after'];
						data_value_befType		= list[i]['data-value-befType'];
						data_value_aftType		= list[i]['data-value-aftType'];
						data_index_col			= list[i]['data-index-col'];
						data_index				= list[i]['data-index'];
						create_date 			= list[i]['create-date'];
						
						
						Core.Prep.BlockChainHistoryAdd(mac_address,text,data_value_column,title,data_value_before,data_value_after,data_index_col,data_index,create_date);
					
					}
				}
				
			}
			
			
			Options.Variable.slickGrid.header["prepGrid"] = new Object();
			Options.Variable.slickGrid.header["oriGrid"] = new Object();
			Options.Variable.slickGrid.headerOption["prepGrid"] = new Object();
			Options.Variable.slickGrid.headerOption["oriGrid"] = new Object();
			
			
			
			
			Options.Variable.slickGrid.header["prepGrid"] = Object.assign([],data.result.header);
			Options.Variable.slickGrid.header["oriGrid"] = Object.assign([],data.result.header);
			
			
			
			Options.Variable.slickGrid.headerOption["prepGrid"] = Object.assign([],"");
			Options.Variable.slickGrid.headerOption["oriGrid"] = Object.assign([],"");
		
			//Options.Variable.slickGrid.headerOption["prepGrid"]
			if(data.result.header_option==null || data.result.header_option.length==0)
			{
				Options.oriDataType = [];
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
				Options.oriDataType = [];
				for(i=0;i<data.result.header_option.length;i++)
				{
					Options.oriDataType[i] = data.result.header_option[i].data_type;
					Options.Variable.slickGrid.headerOption["prepGrid"].push(data.result.header_option[i]);
				}
			}
			
			
			
			//Options.Variable.slickGrid.headerOption["oriGrid"]
			if(data.result.header_option==null || data.result.header_option.length==0)
			{
				Options.oriDataType = [];
				for(i=0;i<Options.Variable.slickGrid.header["oriGrid"].length;i++)
				{
					var obj = {};
					obj.name = Options.Variable.slickGrid.header["oriGrid"][i];
					obj.data_type = "char";
					Options.oriDataType[i] = obj.data_type;
					Options.Variable.slickGrid.headerOption["oriGrid"].push(obj);
				}
			}
			else
			{
				Options.oriDataType = [];
				for(i=0;i<data.result.header_option.length;i++)
				{
					Options.oriDataType[i] = data.result.header_option[i].data_type;
					Options.Variable.slickGrid.headerOption["oriGrid"].push(data.result.header_option[i]);
				}
			}
			
			//prep 데이터 옵션 정보 기본 로드
			
			
			//원본grid에 데이터 바인딩
			slickGrid.setColumnReadOnly(Options.Variable.slickGrid.id["oriGrid"], data.result.header);
			slickGrid.setData(Options.Variable.slickGrid.id["oriGrid"], data.result.data);
			
				
			//전처리 grid에 데이터 바인딩
			slickGrid.setColumn(Options.Variable.slickGrid.id["prepGrid"], data.result.header);
			slickGrid.setData(Options.Variable.slickGrid.id["prepGrid"], data.result.data);
			selectActiveRow = true;
			//다중선택 
			Options.Variable.slickGrid.id["prepGrid"].setSelectionModel(new Slick.RowSelectionModel({
	            selectActiveRow: false
	        }));
			
			

			
			
			Options.Variable.slickGrid.id["prepGrid"].onClick.subscribe(function (e,args) {
		      		if(selectActiveRow)
		      		{
		               if($.inArray(args.row, selectedRows) === -1)
		               {
		                   selectedRows = [];
		                   selectedRows.push(args.row)
		               }
		               else
		               {
		                  selectedRows = []; 
		               }
		           }
		      		else
		           {
		        			($.inArray(args.row, selectedRows) === -1) ? selectedRows.push(args.row) : selectedRows.splice(selectedRows.indexOf(args.row), 1);
		                
		           }
		      	   Options.Variable.slickGrid.id["prepGrid"].setSelectedRows(selectedRows);
		          
		    });
			
			
			Options.Variable.slickGrid.id["prepGrid"]
			
			
			Options.Variable.slickGrid.id["prepGrid"].onContextMenu.subscribe(function (e) {
			      e.preventDefault();
			      
			      var cell = Options.Variable.slickGrid.id["prepGrid"].getCellFromEvent(e);
			      
			      $("#contextMenu").empty();
			      li1 = $("<li/>",{text:'add'}).on("click", function(e){
			    	  var temp= slickGrid.getData(Options.Variable.slickGrid.id["prepGrid"]);
					  var dummy = [];
			    	  var tempIdx = 0;
			    	  for(i=0;i<temp.length;i++)
			          {
			    		  if(cell.row==i){
							//최초 row값을 미리 삽입	
			    			dummy.push(temp[i]);
							//빈로우값 설정
							tmp={};
							//빈로우값중 1증가된 idx값 세팅
							tmp.idx = i+2;
							//추가된 idx값 temp저장
							tempIdx = i+2;
							//빈 row값 그리드 삽입
							dummy.push(tmp);
						  //선택된 값 외의 row값들
			    		  }else{
			    			//임시 저장된 idx값보다 1증가된값 기존의 row idx값으로 세팅
							temp[i].idx = tempIdx+1;
			    			//설정된 row값 그리드에 저장
							dummy.push(temp[i]);
			    			//현재 세팅된 idx값을 다시 temp로 저장
							tempIdx = tempIdx+1;
			    	      }
			          }
			    	  slickGrid.setData(Options.Variable.slickGrid.id["prepGrid"],dummy);
			    	  Options.Variable.slickGrid.id["prepGrid"].render();
			    	  $("#contextMenu").hide();
			    	//Row 추가 함수 호출
			    	  Core.Prep.HistoryAddRow();
			      });
			      var selectedData = [];
			      li2 = $("<li/>",{text:'delete'}).on("click",function(e){
					var temp= slickGrid.getData(Options.Variable.slickGrid.id["prepGrid"]);
					var dummy = [];
					var tempIdx = 0;
					row_selected = Options.Variable.slickGrid.id["prepGrid"].getSelectedRows();
					if(row_selected == ""){
						alert_message(lang_return("fixa.core.title238"));//삭제될 row가 선택되지 않았습니다.
						$("#contextMenu").hide();
						return false;
					}else{
						
						//row 삭제시 데이터 추출
						$.each(row_selected, function (index, value) {
						  selectedData.push(Options.Variable.slickGrid.id["prepGrid"].getData()[value]);
						});
						
						for(i=0;i<temp.length;i++){
							//선택된 row idx값 temp변수 저장
							//if(cell.row==i){
							if(row_selected.indexOf(i)>-1){
								//1증가 값으로 임시변수 저장
								tempIdx = i+1;
							//선택되지 않은 row값들 셋팅
							}else{
								//세팅시 변수값이 변동이 있다면
								if(tempIdx != 0){
									//삭제된 idx값을 기존row값에 대체
									temp[i].idx = tempIdx;
									dummy.push(temp[i]);
									//변동된 idx값 1증가후 다시 임시변수 저장(반복)
									tempIdx = tempIdx+1;
								//변수값이 변동이 없으면
								}else{
									//1부터 값 세팅
									temp[i].idx = i+1;
									dummy.push(temp[i]);
								}
							}
						}
							
						Options.Variable.slickGrid.id["prepGrid"].setSelectedRows([]);
						slickGrid.setData(Options.Variable.slickGrid.id["prepGrid"],dummy);
						
						//선택 한row값 초기화
						var dummy2 = [];
						var temp2= slickGrid.getData(Options.Variable.slickGrid.id["prepGrid"]);
						for(var i=0; i<temp2.length; i++ ){
							temp2[i].idx = i+1;
							dummy2.push(temp2[i]);
						}
						Options.Variable.slickGrid.id["prepGrid"].setSelectedRows([]);
						slickGrid.setData(Options.Variable.slickGrid.id["prepGrid"],dummy2);
						Options.Variable.slickGrid.id["prepGrid"].render();
						$("#contextMenu").hide();
						//Row 삭제 함수 호출
						Core.Prep.HistoryDelRow(selectedData);
					}
				
				});
			    
			      
			      li3 = $("<li/>",{text:'down'}).on("click",function(e){
			    	  Core.jexcelDown_ori_prep();
			    	  $("#contextMenu").hide();
			      });
			      
			      
			      li4 = $("<li/>",{text:'query'}).on("click",function(e){
			    	  Core.queryTool();
			    	  $("#contextMenu").hide();
			      });
			      
			      
			      
			      
				$("#contextMenu").append(li1).append(li2).append(li3).append(li4);
				var target = document.getElementById('prepGrid');
				var clientRect = target.getBoundingClientRect(); // DomRect 구하기 (각종 좌표값이 들어있는 객체)
				var relativeTop = clientRect.top; // Viewport의 시작지점을 기준으로한 상대좌표 Y 값.
				var scrolledTopLength = window.pageYOffset; // 스크롤된 길이
				var absoluteTop = scrolledTopLength + relativeTop; // 절대좌표
			    	var xY = e.clientX +  " * "  + (e.clientY-absoluteTop) ;
				var result = e.clientY-absoluteTop;
				var result2 = e.clientX;
				$("#contextMenu")
				    .data("row", cell.row)
				    .css("top", result)
				    .css("left", result2)
					.show();
				 //마우스 우클릭시마다 팝업 on/off toggle로 변경   
				if($("#contextMenu").is($("#contextMenu").show())){
					$("#prepGrid").mousedown(function(e){
						if(e.which == 1){
							$("#contextMenu").hide();
						}
					});
				}
			});
			
			Options.Variable.slickGrid.id["oriGrid"].resizeCanvas();
			Options.Variable.slickGrid.id["prepGrid"].resizeCanvas();
			
			//전처리 grid header 클릭 이벤트 처리
			Options.Variable.slickGrid.id["prepGrid"].onHeaderClick.subscribe(function(e, args) {
			    var columnID = args.column.id;
			   
			   	Core.Prep.ColumnProperty(args.column.id);
			   	
			    
			});
			
		});
		
		$('.panel .panelGroup .item.btnPlay').removeClass('unlock').addClass('lock');
		
		$("#data_ori").click();
		setTimeout(function(){
			$("#data_ori").click();
		},100);
		
		$("#arContent").fadeIn(500);
		
		/**
		 * block chain tooltip test
		 */
		$(".bc_area .bc_icon").tooltip({
			items: "[data_value_column]"
			,open: function( event, ui ) {
				  
				/**  
				console.log("parent1",$(this).parent().attr("data_value_before"));
				  console.log("parent1",$(this).parent().attr("data_value_after"));
				  console.log("parent2",$(this).parent().parent());
				  console.log(ui);
				  **/
				  
			}
			, content: function() {
				
				 var element = $( this );
			        if ( element.is( "[data_value_column]" ) ) 
			        {
			          var action_type ="";
			          var text = element.text();
			          if($(this).attr("data_value_column")=="delete row"){
			        	  
			        	  bigrow = false;
			        	  temp_colcnt = 0; 
			        	  parse = $.parseJSON($(this).attr("data_value_before"));
			        	  var temp_row = [];
			        	 
			        	  
			        	  if(parse.length>10){
			        		  temp_check_cnt = 0;
			        		  
			        		  bigrow = true;
			        		  more_massgae = parse.length-10;
			        		  $.each(parse, function(k,v){
			        			  
			        			  temp_row.push(v);
			        			  temp_check_cnt++;
			        			  
			        			  if(temp_check_cnt>=10)
			        			  {
			        				  return false;
			        			  }
			        		  });
			        		  
			        		  
			        		  parse = temp_row;
			        		  
			        		  
			        	  }
			        	  
			        	  
			        	  
			        	  tooltip_html = "";
			        	  tooltip_header = "";
			        	  
			        	  $.each(parse, function(k,v){
			        		  if(tooltip_header=="")
			        	      {
			        			  tooltip_header = tooltip_header  +"<tr>";
				        		  $.each(v, function(k1,v1){
				        			  
				        			  tooltip_header = tooltip_header  +"<td>"+k1+"</td>";
				        			  temp_colcnt++;
				        			  
				        		  });
				        		  tooltip_header = tooltip_header  +"<tr>";
			        	      }
			        		  
			        		  tooltip_html = tooltip_html  +"<tr>";
			        		  $.each(v, function(k1,v1){
			        			  tooltip_html = tooltip_html  +"<td>"+v1+"</td>";
			        		  });
			        		  tooltip_html = tooltip_html  +"<tr>";
			        	  });
			        	  
			        	  if(bigrow==true)
			        	  {
			        		  tooltip_html = "<table width='100%' border='1'>"+tooltip_header+tooltip_html+"<tr><td colspan='"+temp_colcnt+"' align='center'>more row "+more_massgae+"</td><tr></table>";
			        	  }
			        	  else
			              {
			        		  tooltip_html = "<table width='100%' border='1'>"+tooltip_header+tooltip_html+"</table>";
			              }
			        	  
			        	   
			        	  
			        	  return tooltip_html;//"삭제 데이터에 대해서는 근거자료를 제공하지 않습니다.";
			        	  
			          }else if($(this).attr("data_value_column") =="add row"){
			        	  return $(this).attr("data_value_column");
			          }else{
			        	  if($(this).attr("data_value_column")=="field_modfiy"){
			        		  return "field_modfiy"+":"+$(this).attr("data_value_before")+"=>"+$(this).attr("data_value_after");
			        	  }else if($(this).attr("data_value_column")=="field_delete"){
			        		  return "field_delete"+":"+$(this).attr("data_value_after");
			        	  }else if($(this).attr("data_value_column")=="type_modify"){
			        		  return "type_modify"+":"+$(this).attr("data_value_befType")+"=>"+$(this).attr("data_value_aftType");
			        	  }else{
			        		  return "column_modify"+":"+$(this).attr("data_value_before")+"=>"+$(this).attr("data_value_after");
			        	  }
			          }
			        }
			}
		});
		
};
Prep.UpdateData = function(){
	
	Options.beforeUiReCollect = [];
	var before_data_checked_value = [];
	var before_data_rule_cont_value = [];
	var diagramInfo = new Array();
		//열기를 통한 데이터 값 세팅

	for(var i=0; i<$("image").length; i++){
		if(i !=0){
			if($("image:eq("+i+")").parent().parent().attr("data-type") !="devs.MyImageModel"){
			var diagramData = new Object();
			diagramData.before_scrollerX = $(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").width();
			diagramData.before_scrollerY = $(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").height();
			diagramData.before_data_ruleId = $("image:eq("+i+")").parent().parent().attr("model-id");
			diagramData.before_data_index = $("image:eq("+i+")").parent().parent().attr("data-index");   
			diagramData.before_data_type =  $("image:eq("+i+")").parent().parent().attr("data-type");  
			diagramData.project_data_sn = Options.project_data_sn;
			diagramData.project_sn = Options.project_sn;
			var position = $("image:eq("+i+")").parent().parent().attr("transform").replace("translate","").replace("(","").replace(")","").split(",");
			diagramData.before_data_x = parseInt(position[0]);
			diagramData.before_data_y = parseInt(position[1]);
			diagramData.before_data_icon = $("image:eq("+i+")").attr("xlink:href");
			diagramData.before_data_rule = $("image:eq("+i+")").parent().parent().attr("data-rule");
			diagramData.before_data_rule_opt = $("image:eq("+i+")").parent().parent().attr("data-rule-opt");
			diagramData.before_data_name = $("image:eq("+i+")").parent().parent().attr("data-name");
			if($("image:eq("+i+")").parent().parent().attr("data-type") == "03"){
//					diagramData.before_feild_name = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column;
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
	var projectNm = ""; 	
	
	if ( !$i.ChkBlank(Options.project_sn) && !$i.ChkBlank($("#historyProjectName").text()) ) {
		
		projectNm = $("#historyProjectName").text();
	}else{
		
		projectNm = $("#PROJECT_NAME").val();
	}
	
	if(projectNm == ""){
		alert_message(lang_return("fixa.core.title239")); //프로젝트 명을 작성해 주세요.
		return;
	}
	//분기에 따른 변수 초기화
	var gridData = "";
	//다이어그램의 정보가 없을시(화면새로 고침 및 원본데이터/데이터 전처리 탭일때)
	if($("image").length == 1){
		if(Options.defauleDiagramData == ""){
			gridData = {
					  data : Options.Variable.slickGrid.id["prepGrid"].getData()
					, header : slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"])
					, project_sn:Options.project_sn
					, project_data_sn: Options.project_data_sn
				 	, project_nm : projectNm
				 	, header_option:Options.Variable.slickGrid.headerOption["prepGrid"]
					, diagram: ""
					, blockchain : JSON.stringify(Prep.getBlockChainData())
			}
		}else{
			if(diagramfirst == true){
				if($("image").length == 1){
					gridData = {
							  data : Options.Variable.slickGrid.id["prepGrid"].getData()
							, header : slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"])
							, project_sn:Options.project_sn
							, project_data_sn: Options.project_data_sn
						 	, project_nm : projectNm
						 	, header_option:Options.Variable.slickGrid.headerOption["prepGrid"]
							, diagram: ""
							, blockchain : JSON.stringify(Prep.getBlockChainData())
					}
				}
			}else{
				 gridData = {
						  data : Options.Variable.slickGrid.id["prepGrid"].getData()
						, header : slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"])
						, project_sn:Options.project_sn
						, project_data_sn: Options.project_data_sn
					 	, project_nm : projectNm
					 	, header_option:Options.Variable.slickGrid.headerOption["prepGrid"]
						, diagram: Options.defauleDiagramData
						, blockchain : JSON.stringify(Prep.getBlockChainData())
				}
			}
		}
	//다이어그램 탭을 선택함으로써 다이어그램이 그려지고 정보가 있을시 (기존 저장루트)
	}else{
		if(Options.defauleDiagramData == ""){
			gridData = {
					  data : Options.Variable.slickGrid.id["prepGrid"].getData()
					, header : slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"])
					, project_sn: Options.project_sn
					, project_data_sn: Options.project_data_sn
				 	, project_nm : projectNm
				 	, header_option:Options.Variable.slickGrid.headerOption["prepGrid"]
			 		, diagram: JSON.stringify(diagramInfo)
			 		, blockchain : JSON.stringify(Prep.getBlockChainData())
			}
		}else{
			gridData = {
					  data : Options.Variable.slickGrid.id["prepGrid"].getData()
					, header : slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"])
					, project_sn:Options.project_sn
					, project_data_sn: Options.project_data_sn
				 	, project_nm : projectNm
				 	, header_option:Options.Variable.slickGrid.headerOption["prepGrid"]
			 		, diagram: Options.defauleDiagramData
			 		, blockchain : JSON.stringify(Prep.getBlockChainData())
			}
		}
	} 
	
	var jsonData = JSON.stringify(gridData);
	
	$.ajax({
	    url: '/prep/updatePrep.fd' 
	    ,crossDomain: true
	    ,contentType: 'application/json'
	    ,async: false
	    ,type: 'POST'
	    ,data: jsonData
	    ,dataType: 'json'
	    ,success: function(data) {
			if(data.result=="success")
			{
				
			}
	    	
	    }
	    
	});
	
};
Prep.SaveData = function(){
	Options.beforeUiReCollect = [];
	var before_data_checked_value = [];
	var diagramInfo = new Array();
	var next_sn = Core.getProjectDataSn();
	
		for(var i=0; i<$("image").length; i++){
			if(i !=0){
				if($("image:eq("+i+")").parent().parent().attr("data-type") !="devs.MyImageModel"){
				var diagramData = new Object();
				diagramData.before_scrollerX = $(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").width();
				diagramData.before_scrollerY = $(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").height();
				diagramData.before_data_ruleId = $("image:eq("+i+")").parent().parent().attr("model-id");
				diagramData.before_data_index = $("image:eq("+i+")").parent().parent().attr("data-index");   
				diagramData.before_data_type =  $("image:eq("+i+")").parent().parent().attr("data-type");  
				diagramData.project_data_sn = next_sn;
				diagramData.project_sn = Options.project_sn;
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
	
	var projectNm = ""; 	
		
	if ( !$i.ChkBlank(Options.project_sn) && !$i.ChkBlank($("#historyProjectName").text()) ) {
		
		projectNm = $("#historyProjectName").text();
	}else{
		
		projectNm = $("#PROJECT_NAME").val();
	}
		
	
	if(projectNm == ""){
		alert_message(lang_return("fixa.core.title239")); //프로젝트 명을 작성해 주세요.
		return;
	}
	//분기에 따른 변수 초기화
	var gridData = "";
	//다이어그램의 정보가 없을시(화면새로 고침 및 원본데이터/데이터 전처리 탭일때)
	if($("image").length == 1){
		if(Options.defauleDiagramData == ""){
			gridData = {
					  data : Options.Variable.slickGrid.id["prepGrid"].getData()
					, header : slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"])
					, project_sn:Options.project_sn
					, project_data_sn: next_sn
				 	, project_nm : projectNm
				 	, header_option:Options.Variable.slickGrid.headerOption["prepGrid"]
					, diagram: ""
					, blockchain : JSON.stringify(Prep.getBlockChainData())
			}
		}else{
			if(diagramfirst == true){
				if($("image").length == 1){
					gridData = {
							  data : Options.Variable.slickGrid.id["prepGrid"].getData()
							, header : slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"])
							, project_sn:Options.project_sn
							, project_data_sn: next_sn
						 	, project_nm : projectNm
						 	, header_option:Options.Variable.slickGrid.headerOption["prepGrid"]
							, diagram: ""
							, blockchain : JSON.stringify(Prep.getBlockChainData())
					}
				}
			}else{
				 gridData = {
						  data : Options.Variable.slickGrid.id["prepGrid"].getData()
						, header : slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"])
						, project_sn:Options.project_sn
						, project_data_sn: next_sn
					 	, project_nm : projectNm
					 	, header_option:Options.Variable.slickGrid.headerOption["prepGrid"]
						, diagram: Options.defauleDiagramData
						, blockchain : JSON.stringify(Prep.getBlockChainData())
				}
			}
		}
	//다이어그램 탭을 선택함으로써 다이어그램이 그려지고 정보가 있을시 (기존 저장루트)
	}else{
		if(Options.defauleDiagramData == ""){
			gridData = {
					  data : Options.Variable.slickGrid.id["prepGrid"].getData()
					, header : slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"])
					, project_sn:Options.project_sn
					, project_data_sn: next_sn
				 	, project_nm : projectNm
				 	, header_option:Options.Variable.slickGrid.headerOption["prepGrid"]
			 		, diagram: JSON.stringify(diagramInfo)
			 		, blockchain : JSON.stringify(Prep.getBlockChainData())
			}
		}else{
			gridData = {
					  data : Options.Variable.slickGrid.id["prepGrid"].getData()
					, header : slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"])
					, project_sn:Options.project_sn
					, project_data_sn: next_sn
				 	, project_nm : projectNm
				 	, header_option:Options.Variable.slickGrid.headerOption["prepGrid"]
			 		, diagram: Options.defauleDiagramData
			 		, blockchain : JSON.stringify(Prep.getBlockChainData())
			}
		}
	} 
	
	var jsonData = JSON.stringify(gridData);
	
	$.ajax({
	    url: '/prep/savePrep.fd' 
	    ,crossDomain: true
	    ,contentType: 'application/json'
	    ,async: true
	    ,type: 'POST'
	    ,data: jsonData
	    ,dataType: 'json'
	    ,success: function(data) {
			if(data.result=="success")
			{
					location.href  = "/prep/prep.fd";
			}
	    }
	});
};
Prep.SaveAsData = function(){
	Options.beforeUiReCollect = [];
	var before_data_checked_value = [];
	var diagramInfo = new Array();
	var next_sn = Core.getProjectDataSn();
	
		for(var i=0; i<$("image").length; i++){
			if(i !=0){
				if($("image:eq("+i+")").parent().parent().attr("data-type") !="devs.MyImageModel"){
				var diagramData = new Object();
				diagramData.before_scrollerX = $(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").width();
				diagramData.before_scrollerY = $(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").height();
				diagramData.before_data_ruleId = $("image:eq("+i+")").parent().parent().attr("model-id");
				diagramData.before_data_index = $("image:eq("+i+")").parent().parent().attr("data-index");   
				diagramData.before_data_type =  $("image:eq("+i+")").parent().parent().attr("data-type");  
				diagramData.project_data_sn = next_sn;
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
	
	var projectNm = ""; 	
	projectNm = $("#PROJECT_NAME").val();
		
	
	if(projectNm == ""){
		alert_message(lang_return("fixa.core.title239")); //프로젝트 명을 작성해 주세요.
		return;
	}
	//분기에 따른 변수 초기화
	var gridData = "";
	//다이어그램의 정보가 없을시(화면새로 고침 및 원본데이터/데이터 전처리 탭일때)
	if($("image").length == 1){
		if(Options.defauleDiagramData == ""){
			gridData = {
					  data : Options.Variable.slickGrid.id["prepGrid"].getData()
					, header : slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"])
					, project_data_sn: next_sn
				 	, project_nm : projectNm
				 	, header_option:Options.Variable.slickGrid.headerOption["prepGrid"]
					, diagram: ""
					, blockchain : JSON.stringify(Prep.getBlockChainData())
			}
		}else{
			if(diagramfirst == true){
				if($("image").length == 1){
					gridData = {
							  data : Options.Variable.slickGrid.id["prepGrid"].getData()
							, header : slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"])
							, project_data_sn: next_sn
						 	, project_nm : projectNm
						 	, header_option:Options.Variable.slickGrid.headerOption["prepGrid"]
							, diagram: ""
							, blockchain : JSON.stringify(Prep.getBlockChainData())
					}
				}
			}else{
				 gridData = {
						  data : Options.Variable.slickGrid.id["prepGrid"].getData()
						, header : slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"])
						, project_data_sn: next_sn
					 	, project_nm : projectNm
					 	, header_option:Options.Variable.slickGrid.headerOption["prepGrid"]
						, diagram: Options.defauleDiagramData
						, blockchain : JSON.stringify(Prep.getBlockChainData())
				}
			}
		}
	//다이어그램 탭을 선택함으로써 다이어그램이 그려지고 정보가 있을시 (기존 저장루트)
	}else{
		if(Options.defauleDiagramData == ""){
			gridData = {
					  data : Options.Variable.slickGrid.id["prepGrid"].getData()
					, header : slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"])
					, project_data_sn: next_sn
				 	, project_nm : projectNm
				 	, header_option:Options.Variable.slickGrid.headerOption["prepGrid"]
			 		, diagram: JSON.stringify(diagramInfo)
			 		, blockchain : JSON.stringify(Prep.getBlockChainData())
			}
		}else{
			gridData = {
					  data : Options.Variable.slickGrid.id["prepGrid"].getData()
					, header : slickGrid.getHeaderName(Options.Variable.slickGrid.id["prepGrid"])
					, project_data_sn: next_sn
				 	, project_nm : projectNm
				 	, header_option:Options.Variable.slickGrid.headerOption["prepGrid"]
			 		, diagram: Options.defauleDiagramData
			 		, blockchain : JSON.stringify(Prep.getBlockChainData())
			}
		}
	} 
	
	var jsonData = JSON.stringify(gridData);
	
	$.ajax({
	    url: '/prep/saveAsPrep.fd' 
	    ,crossDomain: true
	    ,contentType: 'application/json'
	    ,async: true
	    ,type: 'POST'
	    ,data: jsonData
	    ,dataType: 'json'
	    ,success: function(data) {
			if(data.result=="success")
			{
					location.href  = "/prep/prep.fd";
			}
	    }
	});
};
Prep.DiagramUpdateData = function(){
	Options.beforeUiReCollect = [];
	var before_data_checked_value = [];
	var before_data_rule_cont_value = [];
	var diagramInfo = new Array();
		//열기를 통한 데이터 값 세팅

	for(var i=0; i<$("image").length; i++){
		if(i !=0){
			if($("image:eq("+i+")").parent().parent().attr("data-type") !="devs.MyImageModel"){
			var diagramData = new Object();
			diagramData.before_scrollerX = $(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").width();
			diagramData.before_scrollerY = $(".joint-paper-background,.joint-paper-grid,.joint-paper>svg").height();
			diagramData.before_data_ruleId = $("image:eq("+i+")").parent().parent().attr("model-id");
			diagramData.before_data_index = $("image:eq("+i+")").parent().parent().attr("data-index");   
			diagramData.before_data_type =  $("image:eq("+i+")").parent().parent().attr("data-type");  
			diagramData.project_data_sn = Options.project_data_sn;
			diagramData.project_sn = Options.project_sn;
			var position = $("image:eq("+i+")").parent().parent().attr("transform").replace("translate","").replace("(","").replace(")","").split(",");
			diagramData.before_data_x = parseInt(position[0]);
			diagramData.before_data_y = parseInt(position[1]);
			diagramData.before_data_icon = $("image:eq("+i+")").attr("xlink:href");
			diagramData.before_data_rule = $("image:eq("+i+")").parent().parent().attr("data-rule");
			diagramData.before_data_rule_opt = $("image:eq("+i+")").parent().parent().attr("data-rule-opt");
			diagramData.before_data_name = $("image:eq("+i+")").parent().parent().attr("data-name");
			if($("image:eq("+i+")").parent().parent().attr("data-type") == "03"){
//					diagramData.before_feild_name = Options.Variable.Diagram.Global[$("image:eq("+i+")").parent().parent().attr("model-id")].Column;
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
	
	//분기에 따른 변수 초기화
	var gridData = "";
	//다이어그램의 정보가 없을시(화면새로 고침 및 원본데이터/데이터 전처리 탭일때)
	if($("image").length == 1){
		if(Options.defauleDiagramData == ""){
			gridData = {
					 project_sn:Options.project_sn
					, project_data_sn: Options.project_data_sn
					, diagram: ""
					, blockchain : JSON.stringify(Prep.getBlockChainData())
			}
		}else{
			if(diagramfirst == true){
				if($("image").length == 1){
					gridData = {
							 project_sn:Options.project_sn
							, project_data_sn: Options.project_data_sn
							, diagram: ""
							, blockchain : JSON.stringify(Prep.getBlockChainData())
					}
				}
			}else{
				 gridData = {
						 project_sn:Options.project_sn
						, project_data_sn: Options.project_data_sn
						, diagram: Options.defauleDiagramData
						, blockchain : JSON.stringify(Prep.getBlockChainData())
				}
			}
		}
	//다이어그램 탭을 선택함으로써 다이어그램이 그려지고 정보가 있을시 (기존 저장루트)
	}else{
		if(Options.defauleDiagramData == ""){
			gridData = {
					 project_sn:Options.project_sn
					, project_data_sn: Options.project_data_sn
			 		, diagram: JSON.stringify(diagramInfo)
			 		, blockchain : JSON.stringify(Prep.getBlockChainData())
			}
		}else{
			gridData = {
					 project_sn:Options.project_sn
					, project_data_sn: Options.project_data_sn
			 		, diagram: Options.defauleDiagramData
			 		, blockchain : JSON.stringify(Prep.getBlockChainData())
			}
		}
	} 
	
	var jsonData = JSON.stringify(gridData);
	
	$.ajax({
	    url: '/prep/diagramUpdatePrep.fd' 
	    ,crossDomain: true
	    ,contentType: 'application/json'
	    ,async: false
	    ,type: 'POST'
	    ,data: jsonData
	    ,dataType: 'json'
	    ,success: function(data) {
			if(data.result=="success")
			{
				
			}
	    	
	    }
	    
	});
};
Prep.getBlockChainData = function(){
	
	var temp_map = {};
	var jsonarray = [];
		var totalLength = $("#itmHistoryGrid > li").length;
		if(totalLength > 1){
			for(var i=0; i<totalLength; i++ ){
				if(i!=0){
					temp_map = {};
					
					temp_map['mac-address'] 		= $("#itmHistoryGrid > li:eq("+i+") a").attr("mac-address");
					temp_map['text'] 				= $("#itmHistoryGrid > li:eq("+i+") a").text();
					temp_map['data-value-cloumn'] 	= $("#itmHistoryGrid > li:eq("+i+") a").attr("data-value-cloumn");
					temp_map['title'] 				= $("#itmHistoryGrid > li:eq("+i+") a").attr("title");
					temp_map['data-value-before'] 	= $("#itmHistoryGrid > li:eq("+i+") a").attr("data-value-before");
					temp_map['data-value-after'] 	= $("#itmHistoryGrid > li:eq("+i+") a").attr("data-value-after");
					temp_map['data-value-befType'] 	= $("#itmHistoryGrid > li:eq("+i+") a").attr("data-value-befType");
					temp_map['data-value-aftType'] 	= $("#itmHistoryGrid > li:eq("+i+") a").attr("data-value-aftType");
					temp_map['data-index-col'] 		= $("#itmHistoryGrid > li:eq("+i+") a").attr("data-index-col");
					temp_map['data-index'] 			= $("#itmHistoryGrid > li:eq("+i+") a").attr("data-index");
					temp_map['create-date'] 		= $("#itmHistoryGrid > li:eq("+i+") a").attr("create-date");
					
					jsonarray.push(temp_map);
				}
			}
		}
	return jsonarray;
};

Prep.tutorialShow = function(){
	
	for(i=1;i<Options.tutorial_max;i++)
	{
		$(".tutorial_0"+i).hide();
	}
	
	
	
	$("#data_workflow").click();
		setTimeout(function(){
		$(".ng_bg").show();
		Options.tutorial_cur = 1;
		$(".tutorial_0"+Options.tutorial_cur).fadeIn( 500 );
	},500);
}

Prep.tutorialNext = function(){
	$(".tutorial_0"+Options.tutorial_cur).hide();
	if(Options.tutorial_cur>Options.tutorial_max+1)
	{
		
		Options.tutorial_cur = 1;
		$(".ng_bg").hide();
	}
	else
	{
		Options.tutorial_cur = Options.tutorial_cur +1;
		
		if(Options.tutorial_cur==4){
			$(".tutorial_0"+Options.tutorial_cur).css("left",$(".play_area").offset().left+80);

		}
		
		console.log("Options.tutorial_cur",Options.tutorial_cur);
		$(".tutorial_0"+Options.tutorial_cur).fadeIn( 500 );
		
		
	}
	
	if(Options.tutorial_cur==Options.tutorial_max+1)
		{
			$(".ng_bg").fadeOut(1000);
			Options.tutorial_cur = 1;
		}
	
}

})(inni);

