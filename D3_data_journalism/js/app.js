// Define height & width of svg (whole graph)
var svgWidth = 960;
var svgHeight = 600;

// Define margins
var margin = {
    top: 20,
    right: 50,
    bottom: 70,
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

// Initialize the chosen x axis: healthcare
var chosenXAxis = "healthcare";
var chosenYAxis = "poverty";

// Function to re-scale x-axis for new chosen variable
function xScale(censusData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
        d3.max(censusData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    
    return xLinearScale;
};

// Function to re-scale y-axis for new chosen variable
function yScale(censusData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
        d3.max(censusData, d => d[chosenYAxis]) * 1.2
        ])
        .range([height, 0]);
    
    return yLinearScale;
};

// Function to re-draw new axis
function updateAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    
        xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
        return xAxis;
    };
    
// Function to update circles
function updateCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
};

// Function to update the tooltip
function updateToolTip(chosenXAxis, circlesGroup, chosenYAxis) {

    var label;

    if (chosenXAxis === "healthcare") {
        label = "Healthcare:";
    }
    else if (chosenXAxis === "smokes") {
        label = "Smokes:";
    }
    else {
        label = "";
    };

    if (chosenYAxis === "age") {
        label = "age";
    }
    else if (chosenYAxis === "poverty") {
        label = "poverty";
    }
    else {
        label = "";
    };
};
        
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
        .domain([3, d3.max(censusData, d => d.healthcare)])
        .range([0, width]);

    // x scale: smokes (part 2)
    // var xLinearScale = d3.scaleLinear()
    //     .domain([3, d3.max(censusData, d => d.smokes)])
    //     .range([0, width]);

    // y scale: poverty
    var yLinearScale = d3.scaleLinear()
        .domain([7, d3.max(censusData, d => d.poverty)])
        .range([height, 0]);

    // y scale: age (part 2)
    // var yLinearScale = d3.scaleLinear()
    //     .domain([7, d3.max(censusData, d => d.age)])
    //     .range([height, 0]);

    // Define graph axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append group to chart group & create X axis
    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Create Y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    // Define circles group
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.healthcare))
        .attr("cy", d => yLinearScale(d.poverty))
        .attr("x", d => xLinearScale(d.healthcare))
        .attr("y", d => yLinearScale(d.poverty))
        .attr("r", "12")
        .classed("stateCircle", true);

    // Define circles group (part 2)
    // var circlesGroup = chartGroup.selectAll("circle")
    //     .data(censusData)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", d => xLinearScale(d.smokes))
    //     .attr("cy", d => yLinearScale(d.age))
    //     .attr("x", d => xLinearScale(d.smokes))
    //     .attr("y", d => yLinearScale(d.age))
    //     .attr("r", "12")
    //     .classed("stateCircle", true);

    // State circle labels
    chartGroup.selectAll("text")
        .data(censusData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.healthcare))
        .attr("y", d => yLinearScale(d.poverty))
        .classed("stateText", true)

    // State circle labels (part 2)
    // chartGroup.selectAll("text")
    //     .data(censusData)
    //     .enter()
    //     .append("text")
    //     .text(d => d.abbr)
    //     .attr("x", d => xLinearScale(d.smokes))
    //     .attr("y", d => yLinearScale(d.age))
    //     .classed("stateText", true)

    // Create tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(data => {
            return (`${data.state}<br>Healthcare: ${data.healthcare}<br>Poverty: ${data.poverty}`);
        });
    
    // Create tooltip (part 2)
    // var toolTip = d3.tip()
    //     .attr("class", "d3-tip")
    //     .offset([80, -60])
    //     .html(data => {
    //         return (`${data.state}<br>Smokes: ${data.smokes}<br>Age: ${data.age}`);
    //     });

    // Call the tooltip
    chartGroup.call(toolTip);

    // Event listeners for circles
    circlesGroup.on("click", function(data) {
        toolTip.show(data, this); })
    .on("mouseout", function(data, index) {
        toolTip.hide(data); });

    // Y axis label
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Poverty Rate");

    // Y axis label (part 2)
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Age");

    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)

    // X axis label
    var healthcareLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "healthcare")
        .attr("class", "axisText active")
        .text("Healthcare Rate");

    // X axis label (part 2)
    var smokesLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "smokes")
        .attr("class", "axisText inactive")
        .text("Smokes");


    // UPDATE GRAPH WITH NEW SELECTION
    labelsGroup.selectAll("text")
        .on("click", function() {
            
        // Select the value of the option selected
        var value = d3.select(this).attr("value");
        
        if (value !== chosenXAxis) {

            chosenXAxis = value;
            console.log(chosenXAxis)

        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = updateAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = updateCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis);

      // changes classes to change bold text
        if (chosenXAxis === "healthcare") {
            healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
            smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
            healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
            smokesLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        }
        });
});
    