// Generated by CoffeeScript 1.3.3

/*
*/


(function() {
  var catColumn, redraw, settings, sortVar, tp, yScale, zoom, _ref, _ref1, _ref2, _ref3, _ref4;

  tp = (_ref = this.tp) != null ? _ref : this.tp = {};

  settings = (_ref1 = tp.settings) != null ? _ref1 : tp.settings = {};

  if ((_ref2 = settings.sortCol) == null) {
    settings.sortCol = 0;
  }

  if ((_ref3 = settings.from) == null) {
    settings.from = 0;
  }

  if ((_ref4 = settings.to) == null) {
    settings.to = 100;
  }

  tp.tableplot = function() {
    var colScale, height, margin, tableplot, width, x, y;
    margin = {
      top: 0,
      bottom: 0,
      left: 60,
      right: 0
    };
    width = 800;
    height = 600;
    x = d3.scale.linear().domain([0, 1]);
    y = d3.scale.ordinal();
    colScale = d3.scale.linear().domain([0, 1]).range(["white", "steelblue"]);
    tableplot = function(data) {
      var cols, h, k, v, vars, vis, w, _ref5;
      w = width - (margin.left + margin.right);
      h = height - (margin.top + margin.bottom);
      x = x.range([0, w]);
      y = y.domain(d3.range(data.nBins)).rangeBands([0, h]);
      vars = d3.keys(data.vars);
      vis = d3.select("#vis");
      cols = vis.selectAll("g.column").data(data);
      cols.enter().append("g").classed("column", true).attr("transform", function(d, i) {
        return "translate(" + (y(i)) + ")";
      }).append("rect");
      cols.exit().remove();
      _ref5 = data.vars;
      for (k in _ref5) {
        v = _ref5[k];
        if (v.mean != null) {
          numColumn(v);
        } else {
          catColumn(v);
        }
      }
    };
    tableplot.width = function(w) {
      if (w != null) {
        width = w;
        return tableplot;
      } else {
        return width;
      }
    };
    tableplot.height = function(h) {
      if (h != null) {
        height = h;
        return tableplot;
      } else {
        return height;
      }
    };
    return tableplot;
  };

  yScale = null;

  this.draw = function(data) {
    var bb, binScale, clmScale, colScale, column, columns, header, headers, height, margin, plots, rb, values, vars, vis, width;
    width = 1024;
    height = 600;
    margin = {
      top: 0,
      bottom: 0,
      left: 60,
      right: 0
    };
    vars = d3.keys(data.vars);
    values = d3.values(data.vars);
    clmScale = d3.scale.ordinal().domain(vars).rangeBands([0, width]);
    rb = clmScale.rangeBand();
    binScale = d3.scale.linear().domain([0, data.nBins]).range([0, height]);
    yScale = d3.scale.linear().domain([settings.from / 100, settings.to / 100]).range([0, height]);
    bb = height / data.nBins;
    colScale = d3.scale.linear().range(["white", "steelblue"]);
    d3.select("table.tableplot").remove();
    vis = d3.select("#plot").append("table").classed("tableplot", true);
    header = vis.append("tr").classed("header", true);
    column = vis.append("tr").classed("column", true);
    headers = header.selectAll("td").data(vars);
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
    columns.enter().append("td").append("svg").attr("width", rb).attr("height", height).style("cursor", "row-resize").each(function() {
      return d3.select(this).append("rect").attr("width", "100%").attr("height", "100%").classed("panel", true);
    }).append("g").classed("plot", true).datum(function(d, i) {
      return values[i];
    });
    plots = columns.selectAll("g.plot");
    plots.filter(function(d) {
      return d.mean != null;
    }).each(function(d, i) {
      var g, vals, xScale, zero;
      xScale = d3.scale.linear().domain(d3.extent(d.mean.concat(0))).range([0, rb]);
      zero = xScale(0);
      g = d3.select(this);
      vals = g.selectAll("g.value").data(d.mean);
      vals.enter().append("g").classed("value", true).append("rect").attr("title", function(d, i) {
        return "value = " + d;
      }).attr("width", function(d) {
        return xScale(d) - zero;
      }).attr("x", zero).attr("height", bb).attr("y", function(_, i) {
        return binScale(i);
      }).attr("fill", function(_, i) {
        return colScale(d.compl[i]);
      });
    });
    plots.filter(function(d) {
      return !(d.mean != null);
    }).call(catColumn, rb, bb, binScale);
    return vis.call(d3.behavior.zoom().y(yScale).on("zoom", zoom));
  };

  this.offset = function(a) {
    var cs, i, _i, _ref5;
    cs = [0];
    for (i = _i = 1, _ref5 = a.length; 1 <= _ref5 ? _i <= _ref5 : _i >= _ref5; i = 1 <= _ref5 ? ++_i : --_i) {
      cs[i] = cs[i - 1] + a[i - 1];
    }
    return cs;
  };

  catColumn = function(plots, rb, bb, binScale) {
    return plots.each(function(d, i) {
      var bars, cats, colScale, g, vals, xScale;
      cats = d.categories;
      colScale = d3.scale.ordinal().domain(d.categories).range(d.palet);
      xScale = d3.scale.linear().range([0, rb]);
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
        return colScale(i);
      }).attr("width", function(f) {
        return xScale(f[0]);
      }).attr("x", function(f) {
        return xScale(f[1]);
      }).attr("height", bb);
    });
  };

  redraw = function() {
    var key, params, value;
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
    d3.select("table.tableplot").style("cursor", "wait");
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

  zoom = function() {
    var d;
    d = yScale.domain();
    tp.settings.from = d[0] * 100;
    tp.settings.to = d[1] * 100;
    return redraw();
  };

}).call(this);
