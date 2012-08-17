// Generated by CoffeeScript 1.3.3
(function() {
  var addAxis, catColumn, hideScale, move, numColumn, settings, showScale, sortVar, tp, yAxis, yScale, yZoom, _ref, _ref1, _ref2, _ref3, _ref4;

  addAxis = function(yAxis) {
    var svg;
    yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5).tickFormat(d3.format(".3p"));
    svg = d3.select("svg");
    svg.append("g").attr("class", "y axis").attr("transform", "translate(50,0)").call(yAxis);
    return yAxis;
  };

  catColumn = function(plots, rb, bb, binScale) {
    return plots.each(function(d, i) {
      var bars, cats, colScale, g, h, vals, xAxis, xScale;
      cats = d.categories;
      colScale = d3.scale.ordinal().domain(cats).range(d.palet.slice(0, cats.length + 1 || 9e9));
      xScale = d3.scale.linear().range([0, rb]);
      xAxis = d3.svg.axis().scale(xScale).ticks(5).tickFormat(d3.format("p"));
      h = 100 / d.freq.length + "%";
      g = d3.select(this);
      vals = g.selectAll("g.value").data(d.freq);
      vals.enter().append("g").classed("value", true).attr("transform", function(_, i) {
        return "translate(0, " + (binScale(i)) + ")";
      });
      vals.exit().remove();
      bars = vals.selectAll("rect.freq").data(function(d, i) {
        return d3.zip(d, offset(d));
      });
      bars.enter().append("rect").classed("freq", true).attr("fill", function(_, i) {
        return colScale(cats[i]);
      }).attr("width", function(f) {
        return xScale(f[0]);
      }).attr("x", function(f) {
        return xScale(f[1]);
      }).attr("height", h);
      g.append("g").attr("class", "x axis").call(xAxis).style("display", "none");
      g.on("mouseenter", showScale).on("mouseleave", hideScale);
    });
  };

  showScale = function() {
    var g;
    g = d3.select(this);
    return g.selectAll("g.axis").style("display", null);
  };

  hideScale = function() {
    var g;
    g = d3.select(this);
    return g.selectAll("g.axis").style("display", "none");
  };

  numColumn = function(plots, rb, bb, binScale, colScale) {
    return plots.each(function(d, i) {
      var g, ruler, rules, vals, xAxis, xScale, yrange, zero;
      xScale = d3.scale.linear().domain(d3.extent(d.mean.concat(0))).range([0, rb]);
      zero = xScale(0);
      xAxis = d3.svg.axis().scale(xScale).ticks(5);
      g = d3.select(this);
      vals = g.selectAll("g.value").data(d.mean);
      vals.enter().append("g").classed("value", true).attr("id", function(_, j) {
        return "num_" + j;
      }).append("rect").attr("title", function(d, i) {
        return "value = " + d;
      }).attr("width", function(d) {
        return xScale(d) - zero;
      }).attr("x", zero).attr("height", bb).attr("y", function(_, i) {
        return binScale(i);
      }).attr("fill", function(_, i) {
        return colScale(d.compl[i]);
      });
      ruler = g.append("g").attr("class", "ruler");
      ruler.append("g").attr("class", "x axis").call(xAxis);
      yrange = binScale.range();
      rules = ruler.selectAll("line.rule").data(xScale.ticks(5));
      rules.enter().append("line").attr("class", "rule").attr("x1", xScale).attr("x2", xScale).attr("y1", yrange[0]).attr("y2", yrange[1]).attr("stroke", "white").attr("stroke-opacity", .3);
      ruler.style("display", "none");
      g.on("mouseenter", showScale).on("mouseleave", hideScale);
    });
  };

  /*
  */


  tp = (_ref = this.tp) != null ? _ref : this.tp = {};

  settings = (_ref1 = tp.settings) != null ? _ref1 : tp.settings = {};

  this.data;

  if ((_ref2 = settings.sortCol) == null) {
    settings.sortCol = 0;
  }

  if ((_ref3 = settings.from) == null) {
    settings.from = 0;
  }

  if ((_ref4 = settings.to) == null) {
    settings.to = 100;
  }

  yScale = null;

  yAxis = null;

  yZoom = null;

  this.draw = function(data) {
    var bb, binScale, clmScale, colScale, column, columns, header, headers, height, margin, plots, rb, values, vars, vis, width;
    width = $("#plot").width();
    console.log($(document).height(), $(window).height());
    height = $(document).height() - 150;
    margin = {
      top: 0,
      bottom: 0,
      left: 60,
      right: 20
    };
    vars = d3.keys(data.vars);
    values = d3.values(data.vars);
    clmScale = d3.scale.ordinal().domain(vars).rangeBands([margin.left, width - margin.right]);
    rb = clmScale.rangeBand();
    binScale = d3.scale.linear().domain([0, data.nBins]).range([0, height]);
    yScale = d3.scale.linear().domain([settings.from / 100, settings.to / 100]).range([0, height]).clamp(true);
    bb = height / data.nBins;
    colScale = d3.scale.linear().range(["white", "steelblue"]);
    d3.select("table.tableplot").remove();
    vis = d3.select("#plot").append("table").classed("tableplot", true);
    header = vis.append("tr").classed("header", true);
    column = vis.append("tr").classed("column", true);
    headers = header.selectAll("td").data(vars);
    header.append("td");
    headers.enter().append("td").append("button").style("width", "100%").style("height", "3em").on("click", sortVar).text(function(d) {
      return d;
    }).each(function(d) {
      var option;
      option = {
        icons: {
          secondary: "ui-icon-triangle-2-n-s"
        }
      };
      if (d === settings.sortCol) {
        option.icons.secondary = settings.decreasing ? "ui-icon-triangle-1-s" : "ui-icon-triangle-1-n";
      }
      return $(this).button(option);
    });
    headers.exit().remove();
    columns = column.selectAll("td").data(vars);
    column.append("td").append("svg").attr("width", 50).attr("height", height);
    columns.enter().append("td").append("svg").attr("width", rb).attr("height", height).style("cursor", "all-scroll").each(function() {
      return d3.select(this).append("rect").attr("width", "100%").attr("height", "100%").classed("panel", true);
    }).append("g").classed("plot", true).datum(function(d, i) {
      return values[i];
    });
    plots = columns.selectAll("g.plot");
    plots.filter(function(d) {
      return d.mean != null;
    }).call(numColumn, rb, bb, binScale, colScale);
    plots.filter(function(d) {
      return !(d.mean != null);
    }).call(catColumn, rb, bb, binScale);
    yZoom = d3.behavior.zoom().y(yScale).scaleExtent([0, data.nBins]).on("zoom", move);
    plots.call(yZoom);
    return yAxis = addAxis();
  };

  this.offset = function(a) {
    var cs, i, _i, _ref5;
    cs = [0];
    for (i = _i = 1, _ref5 = a.length; 1 <= _ref5 ? _i <= _ref5 : _i >= _ref5; i = 1 <= _ref5 ? ++_i : --_i) {
      cs[i] = cs[i - 1] + a[i - 1];
    }
    return cs;
  };

  move = function() {
    var axis, fromto, svg;
    svg = d3.selectAll("g.plot");
    axis = d3.selectAll(".y.axis");
    fromto = yScale.domain();
    if (d3.event.scale === 1) {
      svg.attr("transform", "translate(0, " + d3.event.translate[1] + ")");
      axis.call(yAxis);
    }
    svg = svg.transition();
    axis = axis.transition();
    axis.call(yAxis);
    return svg.attr("transform", "translate(0, " + d3.event.translate[1] + ") scale(1," + d3.event.scale + ")").each("end", function(_, i) {
      var d;
      if (i) {
        return;
      }
      d = yScale.domain();
      tp.settings.from = d3.max([d[0] * 100, 0]);
      tp.settings.to = d3.min([d[1] * 100, 100]);
      d3.selectAll("svg").style("cursor", "progress");
      zoomUpdate(yScale.domain().map(function(d) {
        return 100 * d;
      }));
      return redraw();
    });
  };

  this.redraw = function() {
    var key, params, value;
    zoomUpdate();
    params = (function() {
      var _ref5, _results;
      _ref5 = tp.settings;
      _results = [];
      for (key in _ref5) {
        value = _ref5[key];
        _results.push("" + key + "=" + value);
      }
      return _results;
    })();
    d3.selectAll("svg").style("cursor", "progress");
    d3.json("json?" + params.join("&"), draw);
  };

  sortVar = function(e) {
    if (tp.settings.sortCol === e) {
      tp.settings.decreasing = !tp.settings.decreasing;
    }
    tp.settings.sortCol = e;
    tp.settings.from = 0;
    tp.settings.to = 100;
    return redraw();
  };

  this.params = (function(qs) {
    var p, params, sqs, _i, _len;
    qs = qs.substr(1).split("&");
    params = {};
    sqs = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = qs.length; _i < _len; _i++) {
        p = qs[_i];
        _results.push(p.split('='));
      }
      return _results;
    })();
    for (_i = 0, _len = sqs.length; _i < _len; _i++) {
      p = sqs[_i];
      params[p[0]] = decodeURIComponent(p[1]);
    }
    return params;
  })(window.location.search);

  this.zoomUpdate = function(fromto) {
    var from, to, _ref5;
    if (fromto != null) {
      tp.settings.from = fromto[0], tp.settings.to = fromto[1];
    }
    _ref5 = [tp.settings.from, tp.settings.to], from = _ref5[0], to = _ref5[1];
    from = tp.settings.from;
    to = tp.settings.to;
    $("#from").val(from);
    $("#to").val(to);
    return $("#from_to").slider("option", "values", [from, to]);
  };

  showScale = function() {
    var g;
    g = d3.select(this);
    return g.selectAll("g.ruler").style("display", null);
  };

  hideScale = function() {
    var g;
    g = d3.select(this);
    return g.selectAll("g.ruler").style("display", "none");
  };

}).call(this);
