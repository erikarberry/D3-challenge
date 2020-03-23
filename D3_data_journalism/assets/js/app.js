// // Define SVG area dimensions
// var width = parseInt(d3.select("#scatter")
//     .style("width"));
// var height = width * 2/3;
// // Define the chart's margins as an object
// var margin = {
//     top: 20, 
//     right: 20, 
//     bottom: 30, 
//     left: 40,
// };

// Set up chart
var svgWidth = 960;
var svgHeight = 500;
var margin = {top: 20, right: 40, bottom: 60, left: 100};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select('.chart')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
var chartGroup = svg.append('g');

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select('#scatter')
  .append('svg')
  .attr('height', height)
  .attr('width', width)
//   .attr('height', height + margin.top + margin.bottom)
//   .attr('width', width + margin.left + margin.right)

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Append a div to the body to create tooltips, assign it a class
var tooltip = d3.select("#scatter").append("div").attr("class", "d3-tip").style("opacity", 0);

// Load data from data.csv and call the function
d3.csv("assets/data/data.csv").then(function(ACSdata) {
// Cast the poverty and physical activity values to a number for each piece of ACSdata
    ACSdata.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.income = +data.income;
        data.state = ACSdata.map(data => data.state);
    });

    var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(ACSdata, data => data.healthcare)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(ACSdata, data => data.income)])
        .range([height, 0]);

// Create two new functions passing our scales in as arguments
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

// Append two SVG group elements to the chartGroup area, and create the bottom and left axes inside of them
    // add y axis
    chartGroup.append("g").call(leftAxis);
    
    // add x axis
    chartGroup.append("g")
    // .attr("transform", "translate(0," + height + ")")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
    
// Create circles
    // var circlesGroup = 
    svg.selectAll("circle")
        .data(ACSdata)
        .enter()
        .append("circle")
        .attr("cx",data => xLinearScale(data.healthcare))
        .attr("cy",data => yLinearScale(data.income))
        .attr("r", "15")
        .attr("class", function(data) {
            return "stateCircle" + data.abbr;
        })
        .attr("fill", "pink")
        .attr("opacity", "0.5")
        .on("mouseover", function(data) {
            console.log('tooltip data', data)
            tooltip
                .transition()
                .duration(200)
                .style("opacity", .9)
                .style("position", "absolute")
                .style("left", d3.event.pageX + "px")
                .style("top", (d3.event.pageY - 28) + "px")
            tooltip.html(
                `${data.abbr} <br> "Percent of Population without Healthcare (%)" : ${data.healthcare}<br> "Median Household Income": ${data.income}`
            );
        })
        .on("mouseout", function(data) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

// Create x-axis labels
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "aText")
        .attr("text-anchor", "middle")
        .text("Percent of Population without Health Insurance");

// Create y-axis labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("text-anchor", "margintop")
        .text("Median Household Income");

// Create title
    chartGroup.append("text")
        .style("text-anchor", "center")
        .attr("class", "axisTest")
        .text("Correlation between Income and Health Insurance Coverage");
}).catch(function(error) {
        console.log(error);

});

