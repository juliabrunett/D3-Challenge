// LAYOUT OF GRAPH
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

// Initialize the chosen x-axis: healthcare & y-axis: poverty
var chosenXAxis = "healthcare";
var chosenYAxis = "poverty";

// FUNCTIONS FOR RESPONSIVE GRAPHS
// Re-scale x-axis for new chosen variable
function xScale(censusData, chosenXAxis) {

    // re-create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]),
                d3.max(censusData, d => d[chosenXAxis])])
        .range([0, width]);
    
    return xLinearScale;
};

// Re-scale y-axis for new chosen variable
function yScale(censusData, chosenYAxis) {

    // re-create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis]),
                d3.max(censusData, d => d[chosenYAxis])])
        .range([height, 0]);
    
    return yLinearScale;
};

// Re-draw new x-axis
function updateXAxis(newXScale, xAxis) {
    // draw bottom axis by new x-scale
    var bottomAxis = d3.axisBottom(newXScale);

        // cause x-axis to transition & call bottom axis function
        xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
        return xAxis;
    };

// Re-draw new y-axis
function updateYAxis(newYScale, yAxis) {
    // draw left axis by new y-scale
    var leftAxis = d3.axisLeft(newYScale);

        // cause y-axis to transition & call left axis function
        yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
        return yAxis;
    };
    
// Update circles for x-values
function updateXCircles(circlesGroup, newXScale, chosenXAxis) {

    // transition circles & add new cx attribute based on new x-scale
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
};

// Update circles for y-values
function updateYCircles(circlesGroup, newYScale, chosenYAxis) {

    // transition circles & add new cx attribute based on new y-scale
    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
};

// Update circle labels
function updateCircleLabels(circleLabels, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circleLabels.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]))
};

// Function to update the tooltip
function updateToolTip(chosenXAxis, circlesGroup, chosenYAxis) {

    // define the label variable
    var label;

    // change the x-axis labels in tooltip
    if (chosenXAxis === "healthcare") {
        label = "Healthcare:";
    }
    else if (chosenXAxis === "smokes") {
        label = "Smokes:";
    }
    else {
        label = "Income:";
    };

    // change the y-axis labels in tooltip
    if (chosenYAxis === "poverty") {
        label = "Poverty:";
    }
    else if (chosenYAxis === "age") {
        label = "Age:";
    }
    else {
        label = "Obesity:";
    };
};
        
// Import data from csv
d3.csv("./data/data.csv").then(censusData => {
    console.log(censusData);

    // Convert all strings numbers to ints
    censusData.forEach(data => {
        data.poverty = +data.poverty;
        // data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        // data.ageMoe = +data.ageMoe;
        data.income = +data.income;
        // data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        // data.healthcareLow = +data.healthcareLow;
        // data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        // data.obesityLow = +data.obesityLow;
        // data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        // data.smokesLow = +data.smokesLow;
        // data.smokesHigh = +data.smokesLow;

        // console.log("Poverty: ", data.poverty);
    });

    // x scale: healthcare
    var xLinearScale = d3.scaleLinear()
        .domain([3, d3.max(censusData, d => d.healthcare)])
        .range([0, width]);

    // y scale: poverty
    var yLinearScale = d3.scaleLinear()
        .domain([7, d3.max(censusData, d => d.poverty)])
        .range([height, 0]);

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

    // CIRCLE LABELS
    // State circle labels
    var circleLabels = chartGroup.selectAll("text")
        .data(censusData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.healthcare))
        .attr("y", d => yLinearScale(d.poverty))
        .classed("stateText", true);

    // TOOLTIP
    // Create tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(data => {
            return (`${data.state}<br>Healthcare: ${data.healthcare}<br>Poverty: ${data.poverty}`);
        });

    // Call the tooltip
    chartGroup.call(toolTip);

    // Event listeners for circles
    circlesGroup.on("click", data => {
        toolTip.show(data, this); })
        .on("mouseout", (data, index) => {
        toolTip.hide(data); });
    
    // X & Y AXIS LABELS
    // Define the y-labels group
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    // Y axis label
    var povertyLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText active")
        .text("Poverty Rate");

    // Y axis label (part 2)
    var ageLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText inactive")
        .text("Age");

    // Y axis label (part 2)
    var obesityLabel = yLabelsGroup.append("text")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText inactive")
    .text("Obesity");

    // Define the x-labels group
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`);

    // X axis label
    var healthcareLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "healthcare")
        .attr("class", "axisText active")
        .text("Healthcare Rate");

    // X axis label (part 2)
    var smokesLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "smokes")
        .attr("class", "axisText inactive")
        .text("Smokes");

    // X axis label (part 2)
    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income")
        .attr("class", "axisText inactive")
        .text("Income");


    // UPDATE GRAPH WITH NEW SELECTION
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            
        // Select the value of the option selected
        var value = d3.select(this).attr("value");
        
        if (value !== chosenXAxis) {

            chosenXAxis = value;
            console.log(chosenXAxis)

        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = updateXAxis(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = updateXCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis);

        circlesGroup = updateCircleLabels(chosenXAxis, chosenYAxis, xLinearScale, yLinearScale, circleLabels);

      // changes classes to change bold text
        if (chosenXAxis === "healthcare") {
            healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
            smokesLabel
            .classed("active", false)
            .classed("inactive", true);
            incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "smokes") {
            healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
            smokesLabel
            .classed("active", true)
            .classed("inactive", false);
            incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "smokes") {
            healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
            smokesLabel
            .classed("active", false)
            .classed("inactive", true);
            incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        };
    };
        });
    
    // Y labels
    yLabelsGroup.selectAll("text")
        .on("click", function() {
            
        // Select the value of the option selected
        var value = d3.select(this).attr("value");

        // If the value chosen is not already selected
        if (value !== chosenYAxis) {
            chosenYAxis = value;
            console.log(chosenYAxis)

            // updates x scale for new data
            yLinearScale = yScale(censusData, chosenYAxis);

            // updates y axis with transition
            yAxis = updateYAxis(yLinearScale, yAxis);

            // updates circles with new x values
            circlesGroup = updateYCircles(circlesGroup, yLinearScale, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenYAxis, circlesGroup, chosenXAxis);

            circlesGroup = updateCircleLabels(chosenXAxis, chosenYAxis, xLinearScale, yLinearScale, circleLabels)

        // changes classes to change bold text
            if (chosenYAxis === "poverty") {
                povertyLabel
                .classed("active", true)
                .classed("inactive", false);
                ageLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenYAxis === "age") {
                povertyLabel
                .classed("active", false)
                .classed("inactive", true);
                ageLabel
                .classed("active", true)
                .classed("inactive", false);
                obesityLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenYAxis === "obesity") {
                povertyLabel
                .classed("active", false)
                .classed("inactive", true);
                ageLabel
                .classed("active", false)
                .classed("inactive", true);
                obesityLabel
                .classed("active", true)
                .classed("inactive",false);

            }
            }
        });
});
    