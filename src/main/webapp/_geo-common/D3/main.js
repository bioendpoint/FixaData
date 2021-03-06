function parseData(d){
	var keys = _.keys(d[0]);
	return _.map(d,function(d){
		var o = {};
	    _.each(keys,function(k){
	    	if(k== 'County')
	         o[k] = d[k];
	    	else 
	    	  o[k] = parseFloat(d[k]);
	    });
		return o;
	});
}

function getBounds(d,paddingFactor){
	//find main and maxes(for the acales)
	paddingFactor = typeof paddingFactor !== 'undefined' ? paddingFactor :1;
	
	var keys = _.keys(d[0]), b= {};
	_.each(keys,function(k){
		b[k] = {};
		_.each(d,function(d){
			if(isNaN(d[k]))
				return;
			if(b[k].min=== undefined||d[k]<b[k].min)
				b[k].min = d[k];
			if(b[k].max=== undefined||d[k]<b[k].max)
				b[k].max = d[k];
		});
		b[k].max>0 ? b[k].max *= paddingFactor :b[k].max /= paddingFactor;
		b[k].min>0 ? b[k].min *= paddingFactor :b[k].min /= paddingFactor;
	});
	return b;
}

function getCorrelation(xArray, yArray){
	function sum(m,v) {return m+v;}
	function sumSquares(m,v){return m+v*v;}
	function filterNaN(m,v,i){isNaN(v) ? null : m.push(i); return m;}
	
	// clean the data(because we know that some values are missing)
	var xNaN    = _.reduce(xArray,filterNaN ,[]);
	var yNaN    = _.reduce(yArray,filterNaN ,[]);
	var include = _.intersection(xNaN, yNaN);
	var fX      = _.map(incluce, function(d){return xArray[d];});
	var fY      = _.map(incluce, function(d){return yArray[d];});

	var sumX   = _.reduce(fX,sum,0);
	var sumY   = _.reduce(fY,sum,0);
	var sumX2  = _.reduce(fX,sumSuares,0);
	var sumY2  = _.reduce(fY,sumSuares,0);
	var sumXY  = _.reduce(fX,function(m,v,i){return m+v *fY[i];},0); 
	
	var n      = fX.length;
	var ntor   = ((sumXY)-(xumX*sumY/n));
	var dtorX  = sumX2 - (sumX * sumX/n);
	var dtorY  = sumY2 - (sumY * sumY/n);
	
	var r      = ntor / (Math.sqrt(dtorX*dtorY)); // pearson( http:// www.
    var m      = ntor / dtorX; // y=mx+b
    var b      = (sumY - m * sumX)/n;
    //console.log(r,m,b);
    return {r:r,m:m,b:b};
}

d3.csv('/data/summary.csv',function(data){
	
	var xAxis ='GDP' , yAxis ='Well-being';
	var xAxisOptions = ["GDP","Equality","Food consumption","Alcohol consumption","Energy consumption","Family","Working hours","Work income","Health spending","Military spending"]
	// var yAxixOptions =["Well-being"];
	
//	var descriptions = {
//			"GDP" : "GDP per person (US$)",
//			"Energy consumption": "Residential electricity use (kWy per year per person)" ,
//			"Equality":"Equality (based on GINI index) (0= low equality, 100=high equality",
//			"Work income":"Houry pay per person (US$)",
//			"Food consumption":"Food SUPPLY (kCal per day per person) ",
//			"Family":"Fertility (children per women)",
//			"Alcohol consumption": "Alcohol consumption(litres of pure alchohol per year per person)",
//			"Working hours":"Average working hours per week per person",
//			"Military spending":"Military spending(% of GDP)",
//			"Health spending":"Government health spending(% of government spend)"
//	};
	
	console.log(data);
 
//	var key = _.keys(data[0]);
//	var data = parseData(data);
//	var bounds = getBounds(data,1);
 
	var svg = d3.select("#chart")
	            .append("svg")
	            .attr("width",1000)
	            .attr("height",640);
	
	var xScale,yScale;
	
	svg.append('g')
	   .classed('chart',true)
	   .attr('transform','translate(80,-60)');
	
	d3.select('#x-axis-menu')
	  .selectAll('li')
	  .data(xAxisOptions)
	  .enter()
	  .append('li')
	  .text(function(d) {return d;})
	  .classed('selected',function(d){
		  return d ===xAxis;
	  })
      
	  .on('click',function(d){
		  xAxis = d;
		  updateChart();
		  updateMenus();
	  });
	
//	d3.select('svg g.chart')
//      .append('text')
//      .attr({'id':'countryLabel','x':0,'y':170})
//      .style({'font-size':'80px','font-weight':'bold','fill':'#ddd'})
//      ;
	
	
	d3.select('svg g.chart')
	  .append('line')
      .attr('id','bestfit');
	
	d3.select('svg g.chart')
      .append('text')
      .attr({'id':'xLabel','x':400,'y':670})
     // .text(descriptions[xAxis])
      ;
    
	d3.select('svg g.chart')
      .append('text')
      .attr('transform','translate(-60,330)rotate(-90)')
      .attr({'id':'yLabel','text-anchor':'middle'})
     // .text('Well-being (scale of 0-10)')
      ;

	//updateScales();
	var pointColur = d3.scale.category20b();
	/*	 
	d3.select('svg g.chart')
	  .selectAll('circle')
	  .data(data)
	  .enter()
	  .append('circle')
	  .attr('cx', function(d){
		  return isNaN(d[xAxis]) ? d3.select(this).attr('cy') : xScale(d[xAxis]);
	  })
	  .attr('fill',function(d,i){return pointColour(i);})
	  .style('cursor','pointer')
	  .on('mouseover',function(d){
		  d3.select('svg g.chart #countryLabel')
		    .text(d.Country)
		    .transition()
		    .style('opacity',1);
		    
	  })
	  
	  .on('mouseout',function(d){
		 d3.select('svg g.chart #countryLabel')
		   .transition()
		   .duration(1500)
		   .style('opacity',0);
	  });
	
	updateChart(true);
	updateMenus();
	  
	d3.select('svg g.chart')
	  .append("g")
	  .attr('transform','translate(0,630)')
	  .attr('id','xAxis')
	  .call(makeXAxis);
	 
	d3.select('svg g.chart')
	  .append("g")
	  .attr('id','yAxis')
	  .attr('transform','translate(-10,0)')
	  .call(makeYAxis);
	
	function updateChart(init){
		updateScales();
		
		d3.select('svg g.chart')
		  .selectAll('circle')
		  .transition()
		  .duration(500)
		  .ease('quad-out')
		  .attr('cx',function(d){
			  return isNaN(d[xAxis]) ? d3.select(this).attr('cx') : xScale(d[xAxis]);
		  })
		  .attr('cy',function(d){
		      return isNaN(d[yAxis]) ? d3.select(this).attr('cy') : xScale(d[yAxis]);
		  })
		  .attr('r',function(d){
			  return isNaN(d[xAxis]) || isNaN(d[yAxis]) ? 0:12;
		  });
		
		d3.select('#xAxis')
		  .transition()
		  .call(makeXAxis);
		
		d3.select('#yAxis')
		  .transition()
		  .call(makeYAxis);
		
		d3.select('#xLabel')
		  .text(descriptions[xAxis]);
		
		var xArray = _.map(data, function(d){return d[xAxis];});
		var yArray = _.map(data, function(d){return d[yAxis];});
		var c = getCorrelation(xArray,yArray);
		var x1 = xScale.domain()[0],y1 = c.m * x1+c.b;
		var x2 = xScale.domain()[1],y2 = c.m * x2+c.b;
		
		d3.select('#bestfit')
		  .style('opacity',0)
		  .transition()
		  .duration(15000)
		  .style('opacity',1);
		
	}
	
	function updateScales(){
		xScale = d3.scale.linear()
		           .domain([bounds[xAxis].min,bounds[xAxis].max])
		           .range([20,780]);
		
		xScale = d3.scale.linear()
        .domain([bounds[yAxis].min,bounds[yAxis].max])
        .range([600,100]);
	}*/
	
	function makeXAxis(s){
		s.call(d3.svg.axis()
				 .scale(xScale)
				 .orient("bottom")
		      );
	}
	
	function makeYAxis(s){
		s.call(d3.svg.axis()
				 .scale(xycale)
				 .orient("left")
		      );
	}
	
	function updateMenus(){
		d3.select('#x-axis-menu')
		  .selectAll('li')
		  .classed('selected',function(d){
			  return d === xAxis;
		  });
		
		d3.select('#y-axis-menu')
		  .selectAll('li')
		  .classed('selected',function(d){
			  return d === yAxis;
		  });
	}
	   
})


















