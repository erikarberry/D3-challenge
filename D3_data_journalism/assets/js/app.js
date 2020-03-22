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

// // setup x 
// var xValue = function(data) {
//     return data.healthcare;
// },
// var xScale = d3.scale.linear().range([0, width]), 
// var xMap = function(data) {
//     return xScale(xValue(data));
// }, 
// var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// // setup y
// var yValue = function(data) {
//     return data.income;
// },
// var yScale = d3.scale.linear().range([height, 0]),
// var yMap = function(data) {
//     return yScale(yValue(data));
// }, 
// var yAxis = d3.svg.axis().scale(yScale).orient("left");

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select('#scatter')
  .append('svg')
  .attr('height', height)
  .attr('width', width)

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Append a div to the body to create tooltips, assign it a class
var tooltip = d3.select("#scatter").append("div").attr("class", "d3-tip").style("opacity", 0);
// d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// Load data from data.csv and call the function
d3.csv("../D3_data_journalism/assets/data/data.csv").then(function(ACSdata) {
// Cast the poverty and physical activity values to a number for each piece of ACSdata
    ACSdata.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.income = +data.income;
        data.state = ACSdata.map(data => data.state);
    });

// xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
// yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);
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
    // chartGroup.append("g")
    // .call(leftAxis);

    // chartGroup.append("g")
    // .attr("transform", `translate(0, ${height})`)
    // .call(bottomAxis);
    
    // x-axis
    chartGroup.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(bottomAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Percent of Population without Health Insurance");

    // y-axis
    chartGroup.append("g")
    .attr("class", "y axis")
    .call(leftAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Median Household Income");
    
// Create circles
    // var circlesGroup = 
    chartGroup.selectAll("circle")
        .data(ACSdata)
        .enter()
        .append("circle")
        .attr("cx",data => xLinearScale(data.healthcare))
        .attr("cy",data => yLinearScale(data.income))
        .attr("r", "15")
        .attr("fill", "pink")
        .attr("opacity", "0.5")
        //   .style("fill", function(d) { return color(cValue(d));}) 
        .on("mouseover", function(data) {
            console.log('tooltip data', data)
            tooltip
                .transition()
                .duration(200)
                .style("opacity", .9)
            // tooltip
                .style("position", "absolute")
                .style("left", d3.event.pageX + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                // .offset([80, -60])
            tooltip.html(
                `${data.abbr} <br> "Percent of Population without Healthcare (%)" : ${data.healthcare}<br> "Median Household Income": ${data.income}`
            );
            // tooltip.html(data["Cereal Name"] + "<br/> (" + xValue(d) 
            //     + ", " + yValue(d) + ")")
            //     .style("left", (d3.event.pageX + 5) + "px")
            //     .style("top", (d3.event.pageY - 28) + "px");
            // udpate the tooltip to transition to be visible and display data in html inner text. 
        })
        .on("mouseout", function(data) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

// Create tooltip in the chart
    chartGroup.call(toolTip);

// // Create event listeners to display and hide the tooltip
//     circlesGroup.on("click", function(data) {
//         toolTip.show(data,this);
//     })
//         .on("mouseout", function(data, index) {
//             toolTip.hide(data);
//         });

// x-axis
    chartGroup.append("aText")
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

// y-axis
    chartGroup.append("aText").call(leftAxis)

// Create x-axis labels
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .attr("text-anchor", "middle")
        .text("Income");

// Create y-axis labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("text-anchor", "margintop")
        .text("Percent of Population");

// Create title
    chartGroup.append("text")
        .style("text-anchor", "center")
        .attr("class", "axisTest")
        .text("Correlation between Income and Health Insurance Coverage");
}).catch(function(error) {
        console.log(error);

});

