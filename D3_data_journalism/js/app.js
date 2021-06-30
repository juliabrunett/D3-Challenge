// Define height & width of svg (whole graph)
var svgWidth = 960;
var svgHeight = 500;

// Define margins
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

// Define widths and heights minus margins for inside of graph
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3.select("#scatter-plot")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Define the chart group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from csv
d3.csv("./data/data.csv").then(censusData => {
    console.log(censusData);

    // Convert all strings numbers to ints
    censusData.forEach(data => {
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesLow;

        // console.log("Poverty: ", data.poverty);
    });

    // x scale: healthcare
    var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.healthcare)])
        .range([0, width]);

    // y scale: poverty
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.poverty)])
        .range([height, 0]);

    // Create Graph Axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append group to chart group & create axes
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Define circles group
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.healthcare))
        .attr("cy", d => yLinearScale(d.poverty))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".4")
        // .append("text")
        // .text(d => d.abbr)
        // .attr("x", d => xLinearScale(d.healthcare))
        // .attr("y", d => yLinearScale(d.poverty))

    chartGroup.selectAll("text")
        .data(censusData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => {
            return xLinearScale(d.healthcare)})
        .attr("y", d => {
            return yLinearScale(d.poverty)})

    // Create tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(data => {
            return (`${data.state}<br>Healthcare: ${data.healthcare}<br>Poverty: ${data.poverty}`);
        });
    chartGroup.call(toolTip);

    // Event listeners
    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
    })

    // onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    // Axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Poverty Rate");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Healthcare Rate");
    })
    