var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top:20,
    right:40,
    bottom:80,
    left: 50
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

d3.csv("data.csv", function(err, censusRecord){
    if(err) throw err;
    censusRecord.forEach(function(record){
        record.smokes = +record.smokes;
        record.age = +record.age;
        record.poverty = +record.poverty;
        record.healthcare = +record.healthcare;
        record.obesity = +record.obesity;
    });
    
    console.log(censusRecord)
    
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusRecord, d=>d["poverty"]-1),
        d3.max(censusRecord,d=>d["poverty"])])
        .range([0,chartWidth]);

    console.log("x-axis data");
    console.log(d3.min(censusRecord, d=>d["poverty"]));
    console.log(d3.max(censusRecord, d=>d["poverty"]));
    console.log("y-axis data");
    console.log(d3.min(censusRecord, d=>d["healthcare"]));
    console.log(d3.max(censusRecord, d=>d["healthcare"]));
    
    console.log(d3.max(censusRecord, d=>d["obesity"]));
    console.log(d3.min(censusRecord, d=>d["obesity"]));

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusRecord, d=>d["healthcare"]-1),
            d3.max(censusRecord, d=>d["healthcare"])])
        .range([chartHeight,0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
    .call(leftAxis);

    var gdots =  chartGroup.selectAll("g.dot")
        .data(censusRecord)
        .enter()
        .append('g');

    gdots.append("circle")
        .attr("cx", d => xLinearScale(d["poverty"]))
        .attr("cy", d => yLinearScale(d["healthcare"]))
        .attr("r", d=>d.obesity / 2)
        .attr("fill", "steelblue")
        .attr("opacity", ".5");

    gdots.append("text").text(d=>d.abbr)
        .attr("x", d => xLinearScale(d.poverty)-4)
        .attr("y", d => yLinearScale(d.healthcare)+2)
        .style("font-size",".6em")
        .classed("fill-text", true);

    console.log(d => xLinearScale(d.poverty));
    console.log(d => yLinearScale(d.healthcare));
    // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  var censusRecordLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");
});