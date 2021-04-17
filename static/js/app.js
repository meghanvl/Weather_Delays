//SVG size and padding
const svgWidth = 960;
const svgHeight = 600;
const margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 125
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper, append SVG group to hold chart, and adjust margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append SVG group that will hold chart, shift latter by left and top margins.
var chartData = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Parameters
var selectXAxis = "F_SCALE";
var selectYAxis = "DEATHS_DIRECT";

// functions for updating x-scale & y-scale var upon click on axis label
function xScale(tornData, selectXAxis) {
 
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(tornData, d => d[selectXAxis]) * 1,
      d3.max(tornData, d => d[selectXAxis] * 1.8) 
    ])
    .range([0, width]);
  return xLinearScale;
}

function yScale(tornData, selectYAxis) {
 
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(tornData, d => d[selectYAxis]) * 1,
      d3.max(tornData, d => d[selectYAxis]) * 1
    ])
    .range([height, 0]);
  return yLinearScale;
}

// function for updating xAxis & yAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale).tickPadding(15);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}

function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}

// function for updating circles group with transition to new circles
function xrenderCircles(circlesGroup, newXScale, selectXAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[selectXAxis]));
  return circlesGroup;
}

// function for updating text group with transition to new circles upon click on x axis label
function xrenderText(textGroup, newXScale, selectXAxis) {
    
  textGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[selectXAxis]));
  return textGroup;
}

// function for updating circles group with transition to new circles
function yrenderCircles(circlesGroup, newYScale, selectYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[selectYAxis]));
  return circlesGroup;
}

// function for updating text group with transition to new circles upon click on y axis label
function yrenderText(textGroup, newYScale, selectYAxis) {
    
  textGroup.transition()
    .duration(1000)
    .attr("y", d => newYScale(d[selectYAxis]));
  return textGroup;
}

// function for updating circles group with tooltip
function updateToolTip(selectXAxis, selectYAxis, textGroup) {
  var xlabel;
  var ylabel;
  if (selectXAxis === "TOR_F_SCALE") {
    xlabel = "EF-Scale:";
  }
  else if (selectXAxis === "TOR_WIDTH") {
    xlabel = "Tornado Width (feet):";
  }
  else {
    xlabel = "Tornado Length (miles):";
  }
  if (selectYAxis === "DEATHS_DIRECT") {
    ylabel = "Number of Deaths:";
  }
  else if (selectYAxis === "INJURIES_DIRECT") {
    ylabel = "Number of Injuries";
  }
  else {
    ylabel = "Property Damage Value (mil):";
  }
  var toolTip = d3.tip()
  .attr("class", "d3-tip")
  .offset([80, -60])
  .html(function(d) {
    return (`${d.STATE_ABBR}<br>${xlabel} ${d[selectXAxis]}<br>${ylabel} ${d[selectYAxis]}`);
  });
  textGroup.call(toolTip);
  textGroup.on("mouseover", function(data) { // mouseover event
    toolTip.show(data, this);
  })
 
  // mouseout event
 .on("mouseout", function(data) {
  toolTip.hide(data);
});
return textGroup;
}

// Retrieve data from CSV file and parse
d3.csv("static/data/noaa_storm_data.csv").then(function(tornData, err) {
  if (err) throw err;
  tornData.forEach(function(data) {
    data.TOR_F_SCALE = +data.TOR_F_SCALE;
    data.TOR_WIDTH = +data.TOR_WIDTH;
    data.income = +data.income;
    data.DEATHS_DIRECT = +data.DEATHS_DIRECT;
    data.INJURIES_DIRECT = +data.INJURIES_DIRECT;
    data.DAMAGE_PROPERTY_NUM = +data.DAMAGE_PROPERTY_NUM;
  });
  
  // xLinearScale function 
  var xLinearScale = xScale(tornData, selectXAxis);

  // yLinearScale function 
  var yLinearScale = yScale(tornData, selectYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

// append x axis
  var xAxis = chartData.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

// append y axis
  var yAxis = chartData.append("g")
  .call(leftAxis);

// Create Circles and state abbr inside circles
  var circlesTextGroup = chartData.selectAll("circle")
  .data(tornData)
  .enter();
  
  var circlesGroup = circlesTextGroup
  .append("circle")
  .attr("cx", d => xLinearScale(d[selectXAxis]))
  .attr("cy", d => yLinearScale(d[selectYAxis]))
  .attr("r", "12")
  .attr("class", "stateCircle");
  
  var textGroup = circlesTextGroup
  .append("text")
  .attr("x", d => xLinearScale(d[selectXAxis]))
  .attr("y", d => yLinearScale(d[selectYAxis]))
  .attr("dy", "1")
  .text(d => d.STATE_ABBR)
  .attr("class", "stateText")
  .attr("font-size", "12px");

// Create group for two x-axis labels
  var xlabelsGroup = chartData.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var TOR_F_SCALELabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "TOR_F_SCALE") // value for event listener
  .classed("active", true)
  .text("EF-Scale");

  var TOR_WIDTHLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 40)
  .attr("value", "TOR_WIDTH") // value for event listener
  .classed("inactive", true)
  .text("Width (feet)");

  var TOR_LENGTHLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "TOR_LENGTH") //value for event listener
  .classed("inactive", true)
  .text("Length (miles)");

// Create group for three y-axis labels
   var ylabelsGroup = chartData.append("g")
   .attr("transform", "rotate(-90)");

   var DEATHS_DIRECTLabel = ylabelsGroup.append("text")
   .attr("y", 0 - margin.left)
   .attr("x", 0 - (height / 2))
   .attr("dy", "1em")
   .attr("value", "DEATHS_DIRECT") // value for event listener
   .classed("active", true)
   .text("Num. of Deaths");
  
   var INJURIES_DIRECTLabel = ylabelsGroup.append("text")
   .attr("y", 0 - margin.left)
   .attr("x", 0 - (height / 2))
   .attr("dy", "2em")
   .attr("value", "INJURIES_DIRECT") // value for event listener
   .classed("inactive", true)
   .text("Num. of Injuries");
  
  var DAMAGE_PROPERTY_NUMLabel = ylabelsGroup.append("text")
   .attr("y", 0 - margin.left)
   .attr("x", 0 - (height / 2))
   .attr("dy", "3em")
   .attr("value", "DAMAGE_PROPERTY_NUM") // value for event listener
   .classed("inactive", true)
   .text("Value of Property Damage (mil)");

// updating ToolTip function 
  var textGroup = updateToolTip(selectXAxis, selectYAxis, textGroup);

// x axis labels event listener
  xlabelsGroup.selectAll("text")
  .on("click", function() {

// get value of selection
  var value = d3.select(this).attr("value");
  if (value !== selectXAxis) {
    // replaces selectXAxis with value
    selectXAxis = value;
    console.log(selectXAxis)

// functions here found above csv import
        // updates x scale for new data
xLinearScale = xScale(tornData, selectXAxis);

// updates x axis with transition
xAxis = renderXAxis(xLinearScale, xAxis);

// updates circles with new x values
circlesGroup = xrenderCircles(circlesGroup, xLinearScale, selectXAxis);
textGroup = xrenderText(textGroup, xLinearScale, selectXAxis)

// updates tooltips with new info
textGroup = updateToolTip(selectXAxis, selectYAxis, textGroup);
if (selectXAxis === "TOR_F_SCALE") {
  TOR_F_SCALELabel
    .classed("active", true)
    .classed("inactive", false);
  TOR_WIDTHLabel
    .classed("active", false)
    .classed("inactive", true);
  TOR_LENGTHLabel
    .classed("active", false)
    .classed("inactive", true);
}
else if (selectXAxis === "TOR_WIDTH") {
  TOR_WIDTHLabel
    .classed("active", true)
    .classed("inactive", false);
  TOR_F_SCALELabel
    .classed("active", false)
    .classed("inactive", true);
  TOR_LENGTHLabel
    .classed("active", false)
    .classed("inactive", true);
}
else {
  TOR_LENGTHLabel
    .classed("active", true)
    .classed("inactive", false);
  TOR_F_SCALELabel
    .classed("active", false)
    .classed("inactive", true);
  TOR_WIDTHLabel
    .classed("active", false)
    .classed("inactive", true);
  }
}
});

// y axis labels event listener
ylabelsGroup.selectAll("text")
.on("click", function() {

    // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== selectYAxis) {

    // replaces selectYAxis with value
    selectYAxis = value;
    console.log(selectYAxis);

    // updates y scale for new data
    yLinearScale = yScale(tornData, selectYAxis);
 
    // updates y axis with transition
    yAxis = renderYAxis(yLinearScale, yAxis);
 
    // updates circles and text with new y values
    circlesGroup = yrenderCircles(circlesGroup, yLinearScale, selectYAxis);
    textGroup = yrenderText(textGroup, yLinearScale, selectYAxis);
 
    // updates tooltips with new info
    textGroup = updateToolTip(selectXAxis, selectYAxis, textGroup);
 
    // changes classes to change bold text
    if (selectYAxis === "DEATHS_DIRECT") {
      DEATHS_DIRECTLabel
        .classed("active", true)
        .classed("inactive", false);
      INJURIES_DIRECTLabel
        .classed("active", false)
        .classed("inactive", true);
      DAMAGE_PROPERTY_NUMLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else if (selectYAxis === "INJURIES_DIRECT") {
      INJURIES_DIRECTLabel
        .classed("active", true)
        .classed("inactive", false);
      DEATHS_DIRECTLabel
        .classed("active", false)
        .classed("inactive", true);
      DAMAGE_PROPERTY_NUMLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else {
      DAMAGE_PROPERTY_NUMLabel
        .classed("active", true)
        .classed("inactive", false);
      DEATHS_DIRECTLabel
        .classed("active", false)
        .classed("inactive", true);
      INJURIES_DIRECTLabel
        .classed("active", false)
        .classed("inactive", true);
    }
  }
});

}).catch(function(error) {
  console.log(error);
});





