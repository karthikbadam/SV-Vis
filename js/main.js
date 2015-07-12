var deviceWidth, deviceHeight;

var matrixRows, matrixCols;

var NUMBER_OF_VARIABLES = 6;
var NUMBER_OF_POSSIBILITIES = 2;

var weights = [5, 4, 3, 3, 2, 2, 1];

var variableNames = ["Conference-paper", "VIS-volunteer", "Poster/D.C.", "Other-volunteer", "Submission", "PhD-student", "MS-student"];

var color = d3.scale.linear()
    .domain([0, 10, 20])
    .range(["red", "white", "green"])
    .interpolate(d3.interpolateLab);

//    .range(d3.range(21).map(d3.scale.linear()
//        .domain([0, 20])
//        .range(["#f7fbff", "#08306b"])
//        .interpolate(d3.interpolateLab)));

function isEven(n) {
    return n === parseFloat(n) ? !(n % 2) : void 0;
}

function computeMatrix(n, m) {

    var possibilites = Math.pow(m, n);



    if (isEven(n)) {

        matrixRows = Math.pow(possibilites, 0.5);
        matrixCols = Math.pow(possibilites, 0.5);

    } else {

        matrixRows = Math.pow(possibilites / 2, 0.5) * 2;
        matrixCols = Math.pow(possibilites / 2, 0.5);
    }

    var matrix = new Array(matrixRows);

    for (var i = 0; i < matrixRows; i++) {

        matrix[i] = new Array(matrixCols);

    }


    for (var i = 0; i < matrixRows; i++) {

        for (var j = 0; j < matrixCols; j++) {

            var index = i * matrixCols + j;

            var sum = 0;

            var randomVector = new Array(n);

            // Check for the variables
            for (var k = 0; k < n; k++) {

                var temp = Math.floor(index / Math.pow(m, k));

                //filling in inverse way
                if (isEven(temp)) {

                    randomVector[n - k - 1] = 1;

                } else {

                    randomVector[n - k - 1] = 0;
                }

                sum += randomVector[n - k - 1] * weights[n - k - 1];
            }

            matrix[i][j] = {
                x: j,
                y: i,
                vector: randomVector,
                value: sum
            };

        }
    }

    return matrix;
}

function vectorToText(vector) {

    var text = "";

    for (var i = 0; i < NUMBER_OF_VARIABLES; i++) {

        if (vector[i] == 1) {

            if (i == NUMBER_OF_VARIABLES - 1) {

                text += variableNames[i];

            } else {

                text += variableNames[i] + " ";

            }
        }

    }

    return text;

}

$(document).ready(function () {

    var matrix = computeMatrix(NUMBER_OF_VARIABLES, NUMBER_OF_POSSIBILITIES);

    console.log(matrix);

    deviceWidth = $(document).width();
    deviceHeight = $(document).height();

    var margin = {
        left: 100,
        top: 10,
        right: 10,
        bottom: 10
    };

    var width = deviceWidth * 0.99 - margin.left - margin.right;
    var height = deviceHeight * 0.95 - margin.top - margin.bottom;

    var cellWidth = width < height ? width / matrixCols : height / matrixRows;

    var svg = d3.select("body").append("svg")
        .attr("id", "cVis")
        .attr("class", "hierarchial")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([0, height]);

    x.domain([0, matrixCols - 1]);
    y.domain([0, matrixRows - 1]);

    var row = svg.selectAll(".row")
        .data(matrix)
        .enter().append("g")
        .attr("class", "row")
        .each(row);


    function row(row) {
        var cell = d3.select(this).selectAll(".cell")
            .data(row.filter(function (d) {
                return d.value;
            }))
            .enter()
            .append("g")
            .attr("transform", function (d) {
                return "translate(" + cellWidth * d.x + "," + cellWidth * d.y + ")";
            })
            .attr("class", "cell");

        cell.append("rect")
            .attr("width", cellWidth)
            .attr("height", cellWidth)
            .style("fill-opacity", function (d) {
                return 0.8;
            })
            .style("fill", function (d) {
                return color(d.value);
            })
            .style("stroke", function (d) {
                return "white";
            })
            .style("stroke-size", function (d) {
                return "0.5px";
            });

        cell.append("text")
            .attr("width", cellWidth)
            .attr("dx", function (d) {
                return 5;
            })
            .attr("dy", function (d) {
                return 1.5;
            })
            .text(function (d) {
                return vectorToText(d.vector);
            })
            .call(wrap, cellWidth);
    }


    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 0.4, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                dx = parseFloat(text.attr("dx")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dx", dx).attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dx", dx).attr("dy", ++lineNumber * 0.025 * lineHeight + dy + "em").text(word);
                }
            }
        });
    }



    //now drawing each text
    for (var i = 0; i < NUMBER_OF_VARIABLES; i++) {
        if (isEven(i)) {

            var index = Math.floor(i);
            //add text in y

        } else {

            //add text in x


        }
    }

});