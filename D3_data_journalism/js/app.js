// Function to make whole page responsive to re-sizing
function makeResponsive(repeat_count) {

    // define the entire plot area
    var plotArea = d3.select("body").select("svg");
    // var textArea = d3.select("body").selectAll("svg2");

    // console.log(textArea);

    // Remove the plot & r-squared text each time the page is re-sized
    if (!plotArea.empty()) {
        plotArea.remove();
    };

    

    // Define current window width & height
    var currentWindowWidth = window.innerWidth;
    var currentWindowHeight = window.innerHeight;

    // When window height is reduced
    // if (currentWindowHeight >= 700) {
    //     var reduceHeight = 200;
    // }
    // else {
    //     var reduceHeight = 600;
    // };

    // When window width is reduced
    // Greater than 1200
    if (currentWindowWidth >= 1300) {
        var reduceWidth = 350;
        var reduceHeight = 150;
    }
    // Between 1100 and 1300
    else if (currentWindowWidth >= 1100 && currentWindowWidth < 1300) {
        var reduceWidth = 300;
        var reduceHeight = 200;
    }
    // Between 900 and 1100
    else if (currentWindowWidth >= 900 && currentWindowWidth < 1100) {
        var reduceWidth = 250;
        var reduceHeight = 200;
    }
    // Between 700 and 900
    else if (currentWindowWidth >= 700 && currentWindowWidth < 900) {
        var reduceWidth = 200;
        var reduceHeight = 200;
    }
    // Between 500 and 700
    else if (currentWindowWidth >= 500 && currentWindowWidth < 700) {
        var reduceWidth = 150;
        var reduceHeight = 200;
    }
    // Between 300 and 500
    else if (currentWindowWidth >= 300 && currentWindowWidth < 500) {
        var reduceWidth = 100;
        var reduceHeight = 500;
    }
    else {
        var reduceWidth = 50;
        var reduceHeight = 200;
    };

    // LAYOUT OF GRAPH
    // Define height & width of svg (whole graph)
    var svgWidth = window.innerWidth - reduceWidth;
    var svgHeight = window.innerHeight - reduceHeight;

    // console.log('Height', window.innerHeight);
    // console.log('Width', window.innerWidth);

// Define margins
var margin = {
    top: 30,
    right: 50,
    bottom: 110,
    left: 130
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

// Initialize the chosen x-axis: healthcare & y-axis: poverty (default)
var chosenXAxis = "healthcare";
var chosenYAxis = "poverty";

// FUNCTIONS FOR RESPONSIVE GRAPHS
// Re-scale x-axis for new chosen variable
function xScale(censusData, chosenXAxis) {

    // re-create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.9,
                d3.max(censusData, d => d[chosenXAxis]) * 1.1 ])
        .range([0, width]);
    
    return xLinearScale;
};

// Re-scale y-axis for new chosen variable
function yScale(censusData, chosenYAxis) {

    // re-create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.9,
                d3.max(censusData, d => d[chosenYAxis]) * 1.1 ])
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

// Resize circles when page is reduced below 770px
function resizeCircles(circlesGroup, currentWindowWidth) {
    if (currentWindowWidth <= 770) {
        circlesGroup.transition()
        .duration(5)
        .attr("r", 7);
    }
    else {
        circlesGroup.transition()
        .duration(1000)
        .attr("r", 12);
    }

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
        .attr("y", d => newYScale(d[chosenYAxis]) + 3);
            
    return circlesLabels;
};

// Function to update the tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    // define the label variables
    var xLabel;
    var yLabel;


    // change the x-axis labels in tooltip
    if (chosenXAxis === "healthcare") {
        xLabel = "Lacks Healthcare:";
    }
    else if (chosenXAxis === "smokes") {
        xLabel = "Smokes:";
    }
    else if (chosenXAxis === "obesity") {
        xLabel = "Obese:";
    };

    // change the y-axis labels in tooltip
    if (chosenYAxis === "poverty") {
        yLabel = "In Poverty:";
    }
    else if (chosenYAxis === "age") {
        yLabel = "Age:";
    }
    else if (chosenYAxis === "income") {
        yLabel = "Income:";
    };

    // console.log(xLabel);
    // console.log(yLabel);

    // Draw the tooltip
    var toolTip = d3.tip()
        // .data(censusData)
        .attr("class", "d3-tip")
        .offset([80, -75])
        .html(data => {
            if (chosenYAxis === "poverty") {
                return (`${data.state}<br>${xLabel} ${data[chosenXAxis]}%<br>${yLabel} ${data[chosenYAxis]}%`);
            }
            else {
                return (`${data.state}<br>${xLabel} ${data[chosenXAxis]}%<br>${yLabel} ${data[chosenYAxis]}`);
            };
        });

    // Call the tooltip function above 
    circlesGroup.call(toolTip);

    // Event Listeners
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);})
        .on("mouseout", function(data, index) {
        toolTip.hide(data); });

    return circlesGroup;
};

// Update the title
function updateTitle(chosenXAxis, chosenYAxis) {

    // Define x & y title variables for chart title
    var xTitle;
    var yTitle;

    // change the title by x-axis
    if (chosenXAxis === "healthcare") {
        xTitle = "% Lacks Healthcare";
    }
    else if (chosenXAxis === "smokes") {
        xTitle = "% Smokes";
    }
    else if (chosenXAxis === "obesity") {
        xTitle = "% Obese";
    };

    // change the title by y-axis
    if (chosenYAxis === "poverty") {
        yTitle = "% in Poverty";
    }
    else if (chosenYAxis === "age") {
        yTitle = "Median Age";
    }
    else if (chosenYAxis === "income") {
        yTitle = "Median Household Income";
    };

    var chartTitle = chartGroup.selectAll(".chart-title")
        .text(`${xTitle} vs. ${yTitle} by State`);
    
    return chartTitle;
};

// Find r-squared value (correlation)
function findR(censusData, chosenXAxis, chosenYAxis) {
    // initialize variables
    var xSum = 0;
    var ySum = 0;
    var xySum = 0;
    var xSqSum = 0;
    var ySqSum = 0;
    var num = 0;
    var r;
    var numerator;
    var denominator;

    // loop through each data point
    censusData.forEach(d => {

        // add each value to xSum & ySum
        xSum +=d[chosenXAxis];
        ySum +=d[chosenYAxis];

        // multiply x times y & sum values
        var xTimesY = d[chosenXAxis] * d[chosenYAxis];
        xySum +=xTimesY;

        // square x & y and sum values
        var xSquared = Math.pow(d[chosenXAxis], 2);
        var ySquared = Math.pow(d[chosenYAxis], 2);
        xSqSum +=xSquared;
        ySqSum +=ySquared;

        // count how many values
        num += 1;

    });

    // CHECK NUMBERS
    // console.log("X SUM", xSum);
    // console.log("Y SUM", ySum);
    // console.log("XY Sum", xySum);
    // console.log("X SQ SUM", xSqSum);
    // console.log("Y SQ SUM", ySqSum);
    // console.log("Num", num);

    // Calculate numerator
    numerator = num * (xySum) - (xSum) * (ySum) 
    // Calculate denominator
    denominator = (Math.sqrt(((num * xSqSum) - Math.pow(xSum, 2)) * ((num * ySqSum) - Math.pow(ySum, 2))))
    
    // Calculate r
    r = numerator / denominator;
    
    // Print R-Squared value
    // console.log(`${chosenXAxis} vs. ${chosenYAxis}`)
    // console.log("R-Squared", r);

    // return r rounded to 3 decimals
    return r.toFixed(3);

};

// Update r-squared text
function updateRSquared(censusData, chosenXAxis, chosenYAxis) {
    // calculate new r-squared value
    var r_value = findR(censusData, chosenXAxis, chosenYAxis);

    if (Math.abs(r_value) > 0.7) {
        r_strength = "Strong";
    }
    else if (Math.abs(r_value) > 0.5 && Math.abs(r_value) <= 0.7) {
        r_strength = "Moderate";
    }
    else if (Math.abs(r_value) > 0.3 && Math.abs(r_value) <= 0.5) {
        r_strength = "Weak";
    }
    else {
        r_strength = "No correlation";
    }
    // Append new r-squared value
    return (`R-Squared: ${r_value}<br>Strength: ${r_strength}`);
};

function colorRSquared(censusData, chosenXAxis, chosenYAxis) {
    var r_value = findR(censusData, chosenXAxis, chosenYAxis);

    if (Math.abs(r_value) > 0.7) {
        color = "green";
    }
    else if (Math.abs(r_value) > 0.5 && Math.abs(r_value) <= 0.7) {
        color = "orange";
    }
    else if (Math.abs(r_value) > 0.3 && Math.abs(r_value) <= 0.5) {
        color = "yellow";
    }
    else {
        color = "red";
    }

    return color;
}

// Import data from csv
d3.csv("./data/data.csv").then((censusData, err) => {
    if (err) throw err;

    // console.log(censusData);

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
    var xLinearScale = xScale(censusData, chosenXAxis);

    // y scale: poverty
    var yLinearScale = yScale(censusData, chosenYAxis);

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

    // Create chart title
    var chartTitle = chartGroup.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2)) 
        .classed("chart-title", true);

    // call the update title function to initialize the chart
    chartTitle = updateTitle(chosenXAxis, chosenYAxis);

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
    var circlesLabels = chartGroup.selectAll(".circle-label")
        .data(censusData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]) + 3)
        .classed("stateText circle-label", true);
    
    // X & Y AXIS TITLES
    // Y TITLES
    var yTitlesGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    // Y axis title (1)
    var povertyTitle = yTitlesGroup.append("text")
        .attr("y", 0 - margin.left + 50)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText active")
        .attr("value", "poverty")
        .text("Poverty Rate (%)");

    // Y axis title (2)
    var ageTitle = yTitlesGroup.append("text")
        .attr("y", 0 - margin.left + 30)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText inactive")
        .attr("value", "age")
        .text("Age (Median)");

    // Y axis title (3)
    var incomeTitle = yTitlesGroup.append("text")
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText inactive")
        .attr("value", "income")
        .text("Household Income (Median)");

    // X TITLES
    var xTitlesGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`);

    // X axis title (1)
    var healthcareTitle = xTitlesGroup.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "healthcare")
        .attr("class", "axisText active")
        .text("Lacks Healthcare (%)");

    // X axis title (2)
    var smokesTitle = xTitlesGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "smokes")
        .attr("class", "axisText inactive")
        .text("Smokes (%)");

    // X axis title (3)
    var obesityTitle = xTitlesGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "obesity")
        .attr("class", "axisText inactive")
        .text("Obese (%)");

    // CREATE the tooltip on the graph (initializes)
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // Append r-squared on page
    var r_location = d3.select("#r-squared-location");
    var color = colorRSquared(censusData, chosenXAxis, chosenYAxis);

    // Initialize page with r-squared
    if (repeat_count === 0) {
        r_location.append("p").html(updateRSquared(censusData, chosenXAxis, chosenYAxis));
        
        if (color === "green") {
            r_location.classed("color-green", true);
            r_location.classed("color-orange", false);
            r_location.classed("color-yellow", false);
            r_location.classed("color-red", false);
        }
        else if (color === "orange") {
            r_location.classed("color-green", false);
            r_location.classed("color-orange", true);
            r_location.classed("color-yellow", false);
            r_location.classed("color-red", false);

        }
        else if (color === "yellow") {
            r_location.classed("color-green", false);
            r_location.classed("color-orange", false);
            r_location.classed("color-yellow", true);
            r_location.classed("color-red", false);
        } 
        else if (color === "red") {
            r_location.classed("color-green", false);
            r_location.classed("color-orange", false);
            r_location.classed("color-yellow", false);
            r_location.classed("color-red", true);
        }
        // r_location.classed(color, true);
        repeat_count +=1;
    };


    // UPDATE GRAPH WITH NEW X SELECTION
    xTitlesGroup.selectAll("text")
        .on("click", function() {
            
        // Select the value of the option selected
        var xValue = d3.select(this).attr("value");
        
        // If the value chosen is not already selected
        if (xValue !== chosenXAxis) {

            var repeat_count = 0;
            r_location.html("");

            // re-set chosen x-axis
            chosenXAxis = xValue;
            // console.log("New X-Axis:", chosenXAxis);

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

            // updates chart title
            chartTitle = updateTitle(chosenXAxis, chosenYAxis);

            // Calculate r-squared value
            if (repeat_count === 0) {
                var color = colorRSquared(censusData, chosenXAxis, chosenYAxis);

                r_location.append("p").html(updateRSquared(censusData, chosenXAxis, chosenYAxis));
                repeat_count +=1;

                if (color === "green") {
                    r_location.classed("color-green", true);
                    r_location.classed("color-orange", false);
                    r_location.classed("color-yellow", false);
                    r_location.classed("color-red", false);
                }
                else if (color === "orange") {
                    r_location.classed("color-green", false);
                    r_location.classed("color-orange", true);
                    r_location.classed("color-yellow", false);
                    r_location.classed("color-red", false);
        
                }
                else if (color === "yellow") {
                    r_location.classed("color-green", false);
                    r_location.classed("color-orange", false);
                    r_location.classed("color-yellow", true);
                    r_location.classed("color-red", false);
                } 
                else if (color === "red") {
                    r_location.classed("color-green", false);
                    r_location.classed("color-orange", false);
                    r_location.classed("color-yellow", false);
                    r_location.classed("color-red", true);
                }
            };

            // changes classes to change bold text
            if (chosenXAxis === "healthcare") {
                healthcareTitle
                .classed("active", true)
                .classed("inactive", false);
                smokesTitle
                .classed("active", false)
                .classed("inactive", true);
                obesityTitle
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
                obesityTitle
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenXAxis === "obesity") {
                healthcareTitle
                .classed("active", false)
                .classed("inactive", true);
                smokesTitle
                .classed("active", false)
                .classed("inactive", true);
                obesityTitle
                .classed("active", true)
                .classed("inactive", false);
            };
            };
    });
    
    // UPDATE GRAPH WITH NEW Y SELECTION
    yTitlesGroup.selectAll("text")
        .on("click", function() {
            
        // Select the value of the option selected
        var yValue = d3.select(this).attr("value");

        // If the value chosen is not already selected
        if (yValue !== chosenYAxis) {


            var repeat_count = 0;
            r_location.html("");

            // re-set chosen y-axis
            chosenYAxis = yValue;
            // console.log("New Y-Axis:", chosenYAxis);

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

            // updates chart title
            chartTitle = updateTitle(chosenXAxis, chosenYAxis);

            // Calculate r-squared value
            if (repeat_count === 0) {
                var color = colorRSquared(censusData, chosenXAxis, chosenYAxis);

                r_location.append("p").html(updateRSquared(censusData, chosenXAxis, chosenYAxis));
                repeat_count +=1;

                if (color === "green") {
                    r_location.classed("color-green", true);
                    r_location.classed("color-orange", false);
                    r_location.classed("color-yellow", false);
                    r_location.classed("color-red", false);
                }
                else if (color === "orange") {
                    r_location.classed("color-green", false);
                    r_location.classed("color-orange", true);
                    r_location.classed("color-yellow", false);
                    r_location.classed("color-red", false);
        
                }
                else if (color === "yellow") {
                    r_location.classed("color-green", false);
                    r_location.classed("color-orange", false);
                    r_location.classed("color-yellow", true);
                    r_location.classed("color-red", false);
                } 
                else if (color === "red") {
                    r_location.classed("color-green", false);
                    r_location.classed("color-orange", false);
                    r_location.classed("color-yellow", false);
                    r_location.classed("color-red", true);
                }
            };
            
            // changes classes to change bold text when new option is selected
            if (chosenYAxis === "poverty") {
                povertyTitle
                .classed("active", true)
                .classed("inactive", false);
                ageTitle
                .classed("active", false)
                .classed("inactive", true);
                incomeTitle
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
                incomeTitle
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenYAxis === "income") {
                povertyTitle
                .classed("active", false)
                .classed("inactive", true);
                ageTitle
                .classed("active", false)
                .classed("inactive", true);
                incomeTitle
                .classed("active", true)
                .classed("inactive",false);
            };
            };
        });

        // var currentWindowWidth = responsiveArray[3];

        resizeCircles(circlesGroup, window.innerWidth);

    // Calculate r-squared value (in console)
    findR(censusData, chosenXAxis, chosenYAxis);

}).catch(function(error) {
    console.log(error);
});
};

// Define repeat count to avoid appending duplicate r-values
var repeat_count = 0;
// call the responsive function (pass in the repeat count)
makeResponsive(repeat_count);

// Responsive window function
d3.select(window).on("resize", makeResponsive);
