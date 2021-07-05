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
        .domain([d3.min(censusData, d => d[chosenXAxis] * 0.8),
                d3.max(censusData, d => d[chosenXAxis]) * 1.2])
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
function updateXCircleLabels(circlesLabels, newXScale, chosenXAxis) {
    circlesLabels.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]));

    return circlesLabels;
};

// Update circle labels
function updateYCircleLabels(circlesLabels, newYScale, chosenYAxis) {
    circlesLabels.transition()
        .duration(1000)
        .attr("y", d => newYScale(d[chosenYAxis]));

    return circlesLabels;
};

// Function to update the tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    // define the label variables
    var xLabel;
    var yLabel;


    // change the x-axis labels in tooltip
    if (chosenXAxis === "healthcare") {
        xLabel = "Healthcare:";
    }
    else if (chosenXAxis === "smokes") {
        xLabel = "Smokes:";
    }
    else if (chosenXAxis === "income") {
        xLabel = "Income:";
    };

    // change the y-axis labels in tooltip
    if (chosenYAxis === "poverty") {
        yLabel = "Poverty:";
    }
    else if (chosenYAxis === "age") {
        yLabel = "Age:";
    }
    else if (chosenYAxis === "obesity") {
        yLabel = "Obesity:";
    };

    console.log(xLabel);
    console.log(yLabel);

    // Draw the tooltip
    var toolTip = d3.tip()
        // .data(censusData)
        .attr("class", "d3-tooltip")
        .offset([80, -60])
        .html(data => {
            return (`${data.state}<br>${xLabel} ${data[chosenXAxis]}<br>${yLabel} ${data[chosenYAxis]}`);
        });

    // Call the tooltip function above 
    chartGroup.call(toolTip);

    // Event Listeners
    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);})
        .on("mouseout", function(data, index) {
        toolTip.hide(data); });

    return circlesGroup;
};
        
// Import data from csv
d3.csv("./data/data.csv").then((censusData, err) => {
    if (err) throw err;

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
    var xLinearScale = xScale(censusData, chosenXAxis);
    // var xLinearScale = d3.scaleLinear()
        // .domain([3, d3.max(censusData, d => d.healthcare)])
        // .range([0, width]);

    // y scale: poverty
    var yLinearScale = yScale(censusData, chosenYAxis);
    // var yLinearScale = d3.scaleLinear()
    //     .domain([7, d3.max(censusData, d => d.poverty)])
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
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 12)
        .classed("stateCircle", true);

    // CIRCLE LABELS
    // State circle labels
    var circlesLabels = chartGroup.selectAll("text")
        .data(censusData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .classed("stateText", true);

    // TOOLTIP
    // Create tooltip
    // var toolTip = d3.tip()
    //     .attr("class", "d3-tip")
    //     .offset([80, -60])
    //     .html(data => {
    //         return (`${data.state}<br>Healthcare: ${data.healthcare}<br>Poverty: ${data.poverty}`);
    //     });

    // Call the tooltip
    // chartGroup.call(toolTip);

    // Event listeners for circles
    // circlesGroup.on("click", data => {
    //     toolTip.show(data, this); })
    //     .on("mouseout", (data, index) => {
    //     toolTip.hide(data); });
    
    // X & Y AXIS TITLES
    // Define the y-labels group
    var yTitlesGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    // Y axis title
    var povertyTitle = yTitlesGroup.append("text")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText active")
        .attr("value", "poverty")
        .text("Poverty Rate");

    // Y axis title (part 2)
    var ageTitle = yTitlesGroup.append("text")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText inactive")
        .attr("value", "age")
        .text("Age");

    // Y axis title (part 2)
    var obesityTitle = yTitlesGroup.append("text")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText inactive")
    .attr("value", "obesity")
    .text("Obesity");

    // Define the x-labels group
    var xTitlesGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`);

    // X axis title
    var healthcareTitle = xTitlesGroup.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "healthcare")
        .attr("class", "axisText active")
        .text("Healthcare Rate");

    // X axis title (part 2)
    var smokesTitle = xTitlesGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "smokes")
        .attr("class", "axisText inactive")
        .text("Smokes");

    // X axis title (part 2)
    var incomeTitle = xTitlesGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income")
        .attr("class", "axisText inactive")
        .text("Income");

    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // UPDATE GRAPH WITH NEW SELECTION
    xTitlesGroup.selectAll("text")
        .on("click", function() {
            
        // Select the value of the option selected
        var xValue = d3.select(this).attr("value");
        
        // If the value chosen is not already selected
        if (xValue !== chosenXAxis) {

            // re-set chosen x-axis
            chosenXAxis = xValue;
            console.log("New X-Axis:", chosenXAxis);

        // CHANGE GRAPH WITH NEW CHOSEN VARIABLES
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = updateXAxis(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = updateXCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // updates x-labels on circles
        circlesLabels = updateXCircleLabels(circlesLabels, xLinearScale, chosenXAxis);

      // changes classes to change bold text
        if (chosenXAxis === "healthcare") {
            healthcareTitle
            .classed("active", true)
            .classed("inactive", false);
            smokesTitle
            .classed("active", false)
            .classed("inactive", true);
            incomeTitle
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "smokes") {
            healthcareTitle
            .classed("active", false)
            .classed("inactive", true);
            smokesTitle
            .classed("active", true)
            .classed("inactive", false);
            incomeTitle
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "income") {
            healthcareTitle
            .classed("active", false)
            .classed("inactive", true);
            smokesTitle
            .classed("active", false)
            .classed("inactive", true);
            incomeTitle
            .classed("active", true)
            .classed("inactive", false);
        };
        };
    });
    
    // Y titles
    yTitlesGroup.selectAll("text")
        .on("click", function() {
            
        // Select the value of the option selected
        var yValue = d3.select(this).attr("value");

        // If the value chosen is not already selected
        if (yValue !== chosenYAxis) {

            // re-set chosen y-axis
            chosenYAxis = yValue;
            console.log("New Y-Axis:", chosenYAxis);

            // CHANGE GRAPH WITH NEW CHOSEN VARIABLES
            // updates x scale for new data
            yLinearScale = yScale(censusData, chosenYAxis);

            // updates y axis with transition
            yAxis = updateYAxis(yLinearScale, yAxis);

            // updates circles with new y values
            circlesGroup = updateYCircles(circlesGroup, yLinearScale, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // updates circle labels
            circlesLabels = updateYCircleLabels(circlesLabels, yLinearScale, chosenYAxis);

            // changes classes to change bold text
            if (chosenYAxis === "poverty") {
                povertyTitle
                .classed("active", true)
                .classed("inactive", false);
                ageTitle
                .classed("active", false)
                .classed("inactive", true);
                obesityTitle
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenYAxis === "age") {
                povertyTitle
                .classed("active", false)
                .classed("inactive", true);
                ageTitle
                .classed("active", true)
                .classed("inactive", false);
                obesityTitle
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenYAxis === "obesity") {
                povertyTitle
                .classed("active", false)
                .classed("inactive", true);
                ageTitle
                .classed("active", false)
                .classed("inactive", true);
                obesityTitle
                .classed("active", true)
                .classed("inactive",false);
            };
            };
        });
}).catch(function(error) {
    console.log(error);
});
    