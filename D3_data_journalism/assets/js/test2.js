// id,state,abbr,poverty,povertyMoe,age,ageMoe,
// income,incomeMoe,healthcare,healthcareLow,healthcareHigh,
// obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh


// Define SVG area dimensions
var width = parseInt(d3.select("#scatter")
    .style("width"));
var height = width * 2/3;
// Define the chart's margins as an object
var margin = {
    top: 50, 
    right: 50, 
    bottom: 50, 
    left: 50
};

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select('#scatter')
  .append('svg')
  .attr('height', height)
  .attr('width', width)

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Append a div to the body to create tooltips, assign it a class
// d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// Load data from data.csv and call the function
d3.csv("../D3_data_journalism/assets/data/data.csv").then(function(ACSdata) {
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
    chartGroup.append("g")
    .call(leftAxis);

    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

// Defining tooltip
	var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80,-60])
    .html(function(data){
        return(state + "<br> Poverty Rate (%): " + povertyRate + "<br> Health Rate (%): " + healthcare)
    });

    chartGroup.call(tooTip);

// Create circles
    chartGroup.selectAll("circle")
        .data(ACSdata)
        .enter()
        .append("circle")
        .attr("cx",data => xLinearScale(data.healthcare))
        .attr("cy",data => yLinearScale(data.income))
        .attr("r", "15")
        .attr("fill", "pink")
        .attr("opacity", "0.5")
// Create event listeners to display and hide the tooltip
        .on("click", function(data) {
            toolTip.show(data,this);
        })
        .on("mouseout", function(data, index) {
            toolTip.hid(data);
        });

// x-axis
    chartGroup.append("aText")
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

// y-axis
    chartGroup.append("aText").call(leftAxis)

// Create x-axis labels
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        // .attr("transform", "translate(" + (chartWidth/2) + ", " + (chartHeight + margin.top + 20) + ")")
        .attr("class", "axisText")
        .attr("text-anchor", "middle")
        .text("Income");

// Create y-axis labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        // .attr("x", 0 - (height))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("text-anchor", "margintop")
        .text("Percent of Population with No Health Insurance Coverage");

// Create title
    chartGroup.append("text")
        .style("text-anchor", "center")
        .attr("class", "axisTest")
        .text("Correlation between Income and Health Insurance Coverage");
}).catch(function(error) {
        console.log(error);
});

