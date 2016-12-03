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
  "Japanese": [30,100,50,0.65],
  "Sushi Bars": [30,100,50,0.65],
  "Chinese": [30,100,50,0.65],
  "Dim Sum": [30,100,50,0.65],
  "Cantonese" : [30,100,50,0.65],
  "Beijing Chinese Cuisine" : [30,100,50,0.65],
  "Thai": [30,100,50,0.65],
  "Indian": [30,100,50,0.65],
  "Vietnamese": [30,100,50,0.65],
  "Korean": [30,100,50,0.65],
  "Asian Fusion": [30,100,50,0.65],
  "Italian": [204,71,41,0.47],
  "Pizza" : [204,71,41,0.47],
  "French": [204,71,41,0.47],
  "Mediterranean": [204,71,41,0.47],
  "Greek": [204,71,41,0.47],
  "American (Traditional)": [60, 100, 80, 0.96],
  "American (New)": [60, 100, 80, 0.96],
  "Hawaiian": [60, 100, 80, 0.96],
  "Fast Food": [60, 100, 80, 0.96],
  "Burgers": [60, 100, 80, 0.96],
  "Hot Dogs": [60, 100, 80, 0.96],
  "Steakhouses": [60, 100, 80, 0.96],
  "Chicken Wings": [60, 100, 80, 0.96],
  "Barbeque" : [60, 100, 80, 0.96],
  "Middle Eastern": [201,52,77,0.78],
  "Mexican": [1,92,79,0.73],
  "New Mexican Cuisine" : [1,92,79,0.73],
  "Tex-Mex": [1,92,79,0.73],
  "British" : [359,79,50,0.49],
  "Canadian (New)" : [34, 97, 71,0.79],
  "Vegetarian": [110,96,20, 1.0],
  "Coffee & Tea": [21,63,43,0.46],
  "Cafes": [21,63,43,0.46],
  "Breakfast & Brunch": [21,63,43,0.46],
  "Anonymous" : [0,0,75,0.4],
  "Seafood" : [92,57,71,0.80]
 };

var cuisines = {
"AsianFood"  : [30,100,50,0.65],
"Mediterranean"  : [204,71,41,0.47],
"American"   : [60, 100, 80, 0.96],
"MiddleEastern": [201,52,77,0.78],
"Mexican": [1,92,79,0.73],
"British" : [359,79,50,0.49],
"Canadian" : [34, 97, 71,0.79],
"Vegetarian": [110,96,20, 1.0],
"BreakfastandCoffee" : [21,63,43,0.46],
"Anonymous" : [0,0,75,0.4],
"Seafood" : [92,57,71,0.80]
};

var cuisineCategoryMap = {
  "Japanese": "AsianFood",
  "Sushi Bars": "AsianFood",
  "Chinese": "AsianFood",
  "Dim Sum": "AsianFood",
  "Cantonese" : "AsianFood",
  "Beijing Chinese Cuisine" : "AsianFood",
  "Thai": "AsianFood",
  "Indian": "AsianFood",
  "Vietnamese": "AsianFood",
  "Korean": "AsianFood",
  "Asian Fusion": "AsianFood",
  "Italian": "Mediterranean",
  "Pizza" : "Mediterranean",
  "French": "Mediterranean",
  "Mediterranean": "Mediterranean",
  "Greek": "Mediterranean",
  "American (Traditional)": "American",
  "American (New)": "American",
  "Hawaiian": "American",
  "Fast Food": "American",
  "Steakhouses": "American",
  "Chicken Wings": "American",
  "Barbeque" : "American",
  "Middle Eastern": "MiddleEastern",
  "Mexican": "Mexican",
  "New Mexican Cuisine" : "Mexican",
  "Tex-Mex": "Mexican",
  "British" : "British",
  "Canadian (New)" : "Canadian",
  "Vegetarian": "Vegetarian",
  "Coffee & Tea": "BreakfastandCoffee",
  "Cafes": "BreakfastandCoffee",
  "Breakfast & Brunch": "BreakfastandCoffee",
  "Anonymous" : "Anonymous",
  "Seafood" : "Seafood"
}

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

function color1(c) {
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

function drawLeafLetMap(selectedCity, latitude, longitude)
{
        var map = L.map('map').setView([latitude, longitude], 12);

		// load a tile layer
		L.tileLayer( 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
			maxZoom: 30,
			minZoom: 1,
			attribution: 'Map data &copy;',
			id: 'mapbox.streets'
		  }).addTo(map);

		  // load GeoJSON from an external file
		$.getJSON("/static/data/"+selectedCity+"Restaurants.geojson",function(data){

		  var restIcon = L.icon({
			  iconUrl: '/static/img/pin_icon.png',
			  iconSize: [11,15]
			});

			L.geoJson(data,{
			  pointToLayer: function(feature,latlng){
				var marker = L.marker(latlng,{icon: restIcon});
				marker.bindPopup(feature.properties.name + '<br/>' + 'Stars: '+ feature.properties.stars+ '</br>'+feature.properties.cuisine);
				//console.log(feature.properties.name);
				return marker;
			  }
			}).addTo(map);
		  });
		console.log("executed map stuff");
        console.log(selectedCity);
}

function drawCanvasParallelCoordinates(city)
{
//adding buttons for cuisines

 var cuisineText = "";
     Object.keys(cuisines).forEach(function(d) {
        //console.log(d);
        cuisineText += "<button id=\""+d+"\" style='background:" + color1(cuisines[d]) + "'></button>" + d + "<br/>";
        });
    d3.select("#color-encoding").html(cuisineText);

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

//reading data from the csv file
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

     d3.select("#Mexican")
    .on("click", function() {
        var dataFiltered = [];
        var j = 0;
        for(var i = 0, len = data.length; i < len; ++i)
            if(cuisineCategoryMap[data[i].Cuisine]=="Mexican")
            {
              dataFiltered[j] = data[i];
              j = j+1;
            }
        paths(dataFiltered, foreground, brush_count);
    });

 d3.select("#AsianFood")
    .on("click", function() {
        var dataFiltered = [];
        var j = 0;
        for(var i = 0, len = data.length; i < len; ++i)
            if(cuisineCategoryMap[data[i].Cuisine]=="AsianFood")
            {
              dataFiltered[j] = data[i];
              j = j+1;
            }
        paths(dataFiltered, foreground, brush_count);
    });

	 d3.select("#Mediterranean")
    .on("click", function() {
        var dataFiltered = [];
        var j = 0;
        for(var i = 0, len = data.length; i < len; ++i)
            if(cuisineCategoryMap[data[i].Cuisine]=="Mediterranean")
            {
              dataFiltered[j] = data[i];
              j = j+1;
            }
        paths(dataFiltered, foreground, brush_count);
    });

	 d3.select("#American")
    .on("click", function() {
        var dataFiltered = [];
        var j = 0;
        for(var i = 0, len = data.length; i < len; ++i)
            if(cuisineCategoryMap[data[i].Cuisine]=="American")
            {
              dataFiltered[j] = data[i];
              j = j+1;
            }
        paths(dataFiltered, foreground, brush_count);
    });

	 d3.select("#MiddleEastern")
    .on("click", function() {
        var dataFiltered = [];
        var j = 0;
        for(var i = 0, len = data.length; i < len; ++i)
            if(cuisineCategoryMap[data[i].Cuisine]=="MiddleEastern")
            {
              dataFiltered[j] = data[i];
              j = j+1;
            }
        paths(dataFiltered, foreground, brush_count);
    });

	 d3.select("#British")
    .on("click", function() {
        var dataFiltered = [];
        var j = 0;
        for(var i = 0, len = data.length; i < len; ++i)
            if(cuisineCategoryMap[data[i].Cuisine]=="British")
            {
              dataFiltered[j] = data[i];
              j = j+1;
            }
        paths(dataFiltered, foreground, brush_count);
    });

	 d3.select("#Canadian")
    .on("click", function() {
        var dataFiltered = [];
        var j = 0;
        for(var i = 0, len = data.length; i < len; ++i)
            if(cuisineCategoryMap[data[i].Cuisine]=="Canadian")
            {
              dataFiltered[j] = data[i];
              j = j+1;
            }
        paths(dataFiltered, foreground, brush_count);
    });

	 d3.select("#Vegetarian")
    .on("click", function() {
        var dataFiltered = [];
        var j = 0;
        for(var i = 0, len = data.length; i < len; ++i)
            if(cuisineCategoryMap[data[i].Cuisine]=="Vegetarian")
            {
              dataFiltered[j] = data[i];
              j = j+1;
            }
        paths(dataFiltered, foreground, brush_count);
    });

	 d3.select("#BreakfastandCoffee")
    .on("click", function() {
        var dataFiltered = [];
        var j = 0;
        for(var i = 0, len = data.length; i < len; ++i)
            if(cuisineCategoryMap[data[i].Cuisine]=="BreakfastandCoffee")
            {
              dataFiltered[j] = data[i];
              j = j+1;
            }
        paths(dataFiltered, foreground, brush_count);
    });

	 d3.select("#Anonymous")
    .on("click", function() {
        var dataFiltered = [];
        var j = 0;
        for(var i = 0, len = data.length; i < len; ++i)
            if(cuisineCategoryMap[data[i].Cuisine]=="Anonymous")
            {
              dataFiltered[j] = data[i];
              j = j+1;
            }
        paths(dataFiltered, foreground, brush_count);
    });

	 d3.select("#Seafood")
    .on("click", function() {
        var dataFiltered = [];
        var j = 0;
        for(var i = 0, len = data.length; i < len; ++i)
            if(cuisineCategoryMap[data[i].Cuisine]=="Seafood")
            {
              dataFiltered[j] = data[i];
              j = j+1;
            }
        paths(dataFiltered, foreground, brush_count);
    });
    
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
    //console.log(data[0].Cuisine)
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
