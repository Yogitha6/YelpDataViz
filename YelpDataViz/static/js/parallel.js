// shim layer with setTimeout fallback
 window.requestAnimFrame = window.requestAnimationFrame       ||
                          window.webkitRequestAnimationFrame ||
                          window.mozRequestAnimationFrame    ||
                          window.oRequestAnimationFrame      ||
                          window.msRequestAnimationFrame     ||
                          function( callback ){
                            window.setTimeout(callback, 1000 / 50);
                          };

 var m = [60, 10, 10, 0],
    w = 960 - m[1] - m[3],
    h = 290 - m[0] - m[2];
 var xscale = d3.scale.ordinal().rangePoints([0, w], 1),
    yscale = {};

 var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    foreground,
    dimensions,
    brush_count = 0;

 var colors = {
  "Japanese": [240,100,25,1.0],
  "Chinese": [240,100,50,1.0],
  "Thai": [120,100,25,1.0],
  "Indian": [180,100,25,1.0],
  "Vietnamese": [180,100,50,1.0],
  "Hawaiian": [120,100,50,1.0],
  "Korean": [120,100,25,1.0],
  "Italian": [0,100,25,1.0],
  "American (Traditional)": [240,0,25,1.0],
  "American (New)": [300,100,25,1.0],
  "Mediterranean": [60,100,25,1.0],
  "French": [0,0,50,1.0],
  "Mexican": [0,0,75,1.0],
  "Tex-Mex": [0,100,50,1.0],
  "Canadian (New)" : [300, 100, 50,1.0],
  "New Mexican Cuisine" : [60, 100, 50,1.0],
  "Beijing Chinese Cuisine" : [240,100,50,1.0],
  "Cantonese" : [300,100,50,0.5],
  "Asian Fusion": [180,100,25,1.0],
  "British" : [0,100,50,0.5],
  "Greek": [120,100,50,0.5],
  "Sushi Bars": [240,100,25, 1.0],
  "Dim Sum": [240,100,50, 1.0],
  "Vegetarian": [120,100,50, 0.7],
  "Middle Eastern": [0,100,25,0.6],
  "Steakhouses": [300,100,25,1.0],
  "Coffee & Tea": [2,100,22,1],
  "Breakfast & Brunch": [60,100,50,0.6],
  "Cafes": [2,100,22,1],
  "Chicken Wings": [240,0,25,1.0],
  "Fast Food" : [240,0,25,1.0],
  "Hot Dogs" : [240,0,25,1.0],
  "Burgers" : [240,0,25,1.0],
  "Pizza" : [0,100,25,1.0],
  "Barbeque" : [240,0,25,0.7],
  "Anonymous" : [110,96,20, 1.0],
  "Seafood" : [30, 96, 52, 1]
 };

function path(d, ctx, color) {
  if (color) ctx.strokeStyle = color;
  ctx.beginPath();
  var x0 = 0,
      y0 = 0;
  dimensions.map(function(p,i) {
    var x = xscale(p),
        y = yscale[p](d[p]);
    if (i == 0) {
      ctx.moveTo(x,y);
    } else { 
      var cp1x = x - 0.85*(x-x0);
      var cp1y = y0;
      var cp2x = x - 0.15*(x-x0);
      var cp2y = y;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    }
    x0 = x;
    y0 = y;
  });
  ctx.stroke();
};

function color(d) {
  var c = colors[d];
  return ["hsla(",c[0],",",c[1],"%,",c[2],"%,",c[3],")"].join("");
};

// Fisher-Yates shuffle
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle
  while (m) {

    // Pick a random element from the remaining
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function drawCanvasParallelCoordinates(city)
{
 d3.select("#chart")
    .style("width", (w + m[1] + m[3]) + "px")
    .style("height", (h + m[0] + m[2]) + "px")

 d3.selectAll("canvas")
    .attr("width", w)
    .attr("height", h)
    .style("padding", m.join("px ") + "px");

 d3.select("#hide-ticks")
    .on("click", function() {
      d3.selectAll(".axis g").style("display", "none");
      d3.selectAll(".axis path").style("display", "none");
    });

 d3.select("#show-ticks")
    .on("click", function() {
      d3.selectAll(".axis g").style("display", "block");
      d3.selectAll(".axis path").style("display", "block");
    });

 d3.select("#dark-theme")
    .on("click", function() {
      d3.select("body").attr("class", "dark");
    });

 d3.select("#light-theme")
    .on("click", function() {
      d3.select("body").attr("class", null);
    });

 foreground = document.getElementById('foreground').getContext('2d');

 foreground.strokeStyle = "rgba(0,100,160,0.1)";
 foreground.lineWidth = 1.3;    // avoid weird subpixel effects

 foreground.fillText("Please Wait. Loading...",w/2,h/2);

 var svg = d3.select("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
  .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

 d3.csv("/static/data/"+city+"Restaurants.csv", function(data) {

  // Convert quantitative scales to floats
  data = data.map(function(d) {
    for (var k in d) {
      if (k != "Name" && k != "Cuisine" && k != "Business_id")
        d[k] = parseFloat(d[k]) || 0;
    };
    return d;
  });

  // Extract the list of dimensions and create a scale for each.
  xscale.domain(dimensions = d3.keys(data[0]).filter(function(d) {
    return d != "Name" && d != "Cuisine" && d != "Business_id" &&(yscale[d] = d3.scale.linear()
        .domain(d3.extent(data, function(p) { return +p[d]; }))
        .range([h, 0]));
  }));

  // Render full foreground
  paths(data, foreground, brush_count);

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
      .data(dimensions)
    .enter().append("svg:g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + xscale(d) + ")"; });

  // Add an axis and title.
  g.append("svg:g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(yscale[d])); })
    .append("svg:text")
      .attr("text-anchor", "left")
      .attr("y", -8)
      .attr("x", -4)
      .attr("transform", "rotate(-19)")
      .attr("class", "label")
      .text(String);

  // Add and store a brush for each axis.
  g.append("svg:g")
      .attr("class", "brush")
      .each(function(d) { d3.select(this).call(yscale[d].brush = d3.svg.brush().y(yscale[d]).on("brush", brush)); })
    .selectAll("rect")
      .attr("x", -16)
      .attr("width", 32)
      .attr("rx", 3)
      .attr("ry", 3);
	  
  // Handles a brush event, toggling the display of foreground lines.
  function brush() {
    brush_count++;
    var actives = dimensions.filter(function(p) { return !yscale[p].brush.empty(); }),
        extents = actives.map(function(p) { return yscale[p].brush.extent(); });

    // Get lines within extents
    var selected = [];
    data.map(function(d) {
      return actives.every(function(p, i) {
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
      }) ? selected.push(d) : null;
    });

    // Render selected lines
    paths(selected, foreground, brush_count);
  }

  function paths(data, ctx, count) {
    var n = data.length,
        i = 0,
        opacity = d3.min([2/Math.pow(n,0.37),1]);
    d3.select("#selected-count").text(n);
    d3.select("#opacity").text((""+opacity).slice(0,6));

    data = shuffle(data);

    // data table
    var foodText = "";
    data.slice(0,10).forEach(function(d) {
      foodText += "<span style='background:" + color(d.Cuisine) + "'></span>" + d.Name + "<br/>";
    });
    d3.select("#food-list").html(foodText);

    ctx.clearRect(0,0,w+1,h+1);
    function render() {
      var max = d3.min([i+12, n]);
      data.slice(i,max).forEach(function(d) {
        path(d, foreground, color(d.Cuisine));
      });
      i = max;
      d3.select("#rendered-count").text(i);
    };

    // render all lines until finished or a new brush event
    (function animloop(){
      if (i >= n || count < brush_count) return;
      requestAnimFrame(animloop);
      render();
    })();
  };
});
}
