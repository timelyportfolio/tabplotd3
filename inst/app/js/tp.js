var tp = {};

tp.settings = {};

function draw(json){
	var data = d3.range(100).map(Math.random);
	
	
	var w = $("body").width() - 40,
		h = 600,
		x = d3.scale.linear()
		   .domain([0, 1])
		   .range([0, w]),
		y = d3.scale.ordinal()
		   .domain(d3.range(data.length))
		   .rangeBands([0, h]),
		z = d3.scale.linear()
		   .domain([0, 1])
		   .range(["white", "steelblue"]);
		
		yAxis = d3.svg.axis().ticks(10).orient("left").tickFormat(d3.format("%"));
		yAxis.scale().range([0,h]);
		
    var body = d3.select("body");
	
	var names = body.select("div.vars");
	
	if (names.empty()){
	  names = body.append("div")
		 .attr("class", "vars");
	}
	
	var svg = body.select("svg");
	if (svg.empty()){
	  svg = body.append("svg")
	        .attr("width", w + 40)
	        .attr("height", h + 50)
	} else {
	   svg.text("");
	}
	
	vis = svg.append("g")
		.attr("transform", "translate(30,30)");

	vis.append("g")
		  .attr("transform", "translate(10,0)")
		  .attr("class", "y axis")
		  .call(yAxis);	

   vars = d3.keys(json.vars);
   
   sc_vars = d3.scale.ordinal()
        .domain(d3.range(vars.length))
        .rangeBands([0, w], 0.1);
   
   var labels = vis.append("svg:g")
	   .attr("class", "labels");

   labels.selectAll("text")
      .data(vars)
	  .enter().append("text")
	    .attr("class", "label")
	  .text(function(d,i) {return d;})
        .attr("x", sc_vars)
		.on("click", sortVar)
		.call(highlightText)
		;
	  	  
   for (var i = 0; i < vars.length; i++){
      v = vars[i];
	  if (json.vars[v].mean){
       numvar(json.vars[v], vis, sc_vars(i), sc_vars.rangeBand(), h, y, z);
     } else {
       cut = json.vars[v];
       catvar(json.vars[v], vis, sc_vars(i), sc_vars.rangeBand(), h, y);
     }
   }
}