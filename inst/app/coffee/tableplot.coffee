###
###

@tp ?= {}

tp = @tp

tp.settings ?= {}

tp.tableplot = () ->
	margin = top: 0, bottom: 0,	left: 60, right: 0

	width = 800
	height = 600
	
	x = d3.scale.linear()
	      .domain([0,1])
	y = d3.scale.ordinal()
	colScale = d3.scale.linear()
	           .domain([0, 1])
	           .range(["white", "steelblue"])

	tableplot = {}

	tableplot.width = (w) ->
		if w?
			width = w
			tableplot
		else
			width

	tableplot.height = (h) ->
		if h?
			height = h
			tableplot
		else
			height

	tableplot.draw = (data) ->
		w = width - (margin.left +  margin.right)
		h = height - (margin.top + margin.bottom)

		x = x.range([0, w])
		y = y.domain(d3.range(data.nBins))
		     .rangeBands([0, h])

		vars = d3.keys data.vars
		vis = d3.select("#vis")
		
		cols = vis.selectAll("g.column").data(data)

		cols.enter().append("g")
		   .classed("column", true)
		   .attr("transform", (d,i) -> "translate(#{y(i)})")
		   .append("rect")
		   
		cols.exit().remove()

		for k, v of data.vars
		  if v.mean?
		    numColumn v
		  else
		    catColumn v
		return
	return tableplot

numColumn = (data, xScale, yScale) ->
catColumn = (data, xScale, yScale) -> 

@draw = (data) ->
	width = 1024
	height = 600

	vars = d3.keys data.vars
	values = d3.values data.vars

	clmScale = d3.scale.ordinal()
		.domain(vars)
		.rangeBands([0,width])
	rb = clmScale.rangeBand()

	binScale = d3.scale.linear()
	   .domain([0, data.nBins])
	   .range([0,height])
	bb = height / data.nBins

	colScale = d3.scale.linear()
	   .range(["white", "steelblue"])

	console.log vars

	vis = d3.select("#plot").append("table").classed("tableplot", true)
	header = vis.append("tr").classed("header", true)
	column = vis.append("tr").classed("column", true)

	headers = header.selectAll("td").data(vars)
	
	headers.enter()
		.append("td")
		.append("button")
		.style("width", "100%")
		.style("height", "3em")
		.text((d) -> d)
		.each((d) -> 
			option = {icons:{secondary: "ui-icon-triangle-2-n-s"}}
			$(this).button(option)
		)
	
	headers.exit().remove()

	columns = column.selectAll("td").data(vars)

	columns.enter()
	   .append("td")
	   .append("svg")
	   .attr("width",  rb)
	   .attr("height", height)
	   .each(() -> 
	   		d3.select(this)
	   			.append("rect")
	   			.attr("width","100%")
	   			.attr("height", "100%")
	   			.classed("panel", true)
	   )
	   .append("g")
	   .classed("plot", true)
	   .datum((d,i) -> values[i])   

	plots = columns.selectAll("g.plot")

	plots.filter((d) -> d.mean?)
	     .each((d,i)->
		
		xScale = d3.scale.linear()
			.domain(d3.extent(d.mean.concat(0)))
			.range([0,rb])

		zero = xScale 0
		
		g = d3.select(this)
		vals = g.selectAll("g.value").data(d.mean)

		vals.enter().append("g")
			.classed("value", true)
			.append("rect")
			.attr("title", (d,i) -> "value = #{d}")
			.attr("width", (d) -> xScale(d) - zero)
			.attr("x", zero)
			.attr("height", bb)
			.attr("y", (_,i) -> binScale(i))
			.attr("fill", (_,i) -> colScale(d.compl[i]))
		
		return
	)
	
	plots.filter((d) -> not d.mean?)
		.each((d,i) ->
			cats = d.categories

			colScale = d3.scale.ordinal()
				.domain(d.categories)
				.range(d.palet)

			xScale = d3.scale.linear()
				.range([0,rb])

			g = d3.select(this)
			vals = g.selectAll("g.value").data(d.freq)

			vals.enter().append("g")
				.classed("value", true)
				.attr("transform", (_,i) -> "translate(0, #{binScale(i)})")
			
			vals.exit().remove()

			bars = vals.selectAll("rect.freq").data((d,i) ->
				d3.zip d, offset(d)
				)

			bars.enter().append("rect")
				.classed("freq", true)
				.attr("fill", (_,i) -> colScale i)
				.attr("width", (f) -> xScale(f[0]))
				.attr("x", (f) -> xScale(f[1]))
				.attr("height", bb)
			return
		)

@offset = (a) ->
	cs = [0]
	i = 1
	while i < a.length
		cs[i] = cs[i-1] + a[i-1]
		i += 1
	cs