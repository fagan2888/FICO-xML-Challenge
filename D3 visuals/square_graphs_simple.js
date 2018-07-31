
var squareOne = [
{
    name: "External Risk Estimate",
    label: "Ft.1",
    per: 0.7,
    occ: 0.05,
    inc_change: 3
    
},
{
    name: "Months Since Oldest Trade Open",
    label: "Ft.2",
    per: 0.7,
    occ: 0.05,
    inc_change: -4,

}];
    
var squareTwo = [
{
    name: "External Risk Estimate23",
    label: "Ft.1",
    per: 0.3,
    occ: 0.07,
    inc_change: 3
    
},
{
    name: "Months Since Oldest Trade Open1",
    label: "Ft.2",
    per: 0.3,
    occ: 0.07,
    inc_change: 2
}];

var squareThree = [
{
    name: "External Risk Estimate",
    label: "Ft.1",
    per: 0.3,
    occ: 10,
    inc_change: 3
    
},
{
    name: "External Risks Things",
    label: "Ft.2",
    per: 0.3,
    occ: 10,
    inc_change: -2
    
},
{
    name: "Months Since Oldest Trade Closed",
    label: "Ft.3",
    per: 0.3,
    occ: 10,
    inc_change: 1
},
{
    name: "Trades 90+",
    label: "Ft.4",
    per: 0.3,
    occ: 10,
    inc_change: 3
}];

var totalData1 = [squareOne,squareTwo,squareTwo,squareTwo,squareOne,squareTwo,squareOne,squareTwo,squareOne,squareTwo];
var totalData2 = [squareThree,squareThree,squareThree,squareThree,squareThree,squareThree,squareThree,squareThree,squareThree,squareThree];

function draw_single_graph(testData, svg, width, height){

    var good_col = "#1b9e77",
        bad_col = "#d95f02";

    var the_colour = "",
        opp_colour = "";

    var separator = 0.015

    if (testData[0].per > 0.5) {
        the_colour = bad_col;
        opp_colour = good_col;}
    else {
        the_colour = good_col;
        opp_colour = bad_col;
    }

    var padding_top = 0.1,
        padding_bottom = 0.1;

    // -- Adding scales based on canvas -- 
    var xScale = d3.scaleBand()
            .domain(testData.map(function(d){return d.name;}))
            .rangeRound([0, width])
            .paddingInner(0),
        yScale = d3.scaleLinear()
            .domain([0-padding_bottom, 1+padding_top])
            .rangeRound([height, 0]);

    // -- Drawing background rectangles -- 
    svg.append("g").selectAll("rect")
        .data(testData)
        .enter()
        .append("rect")
        .attr('x',function(d) {return xScale(d.name);})
        .attr('y',0)
        .attr("height",function(d){return yScale(0-padding_bottom)})
        .attr("width",xScale.bandwidth())
        .attr("opacity",function(d){return d.occ*3})
        .style("fill",opp_colour);
        // .style("fill","#A9A9A9");


    // -- Drawing surrounding box -- 
        svg.append("rect")
        .attr("class","border")
        .attr('x',xScale(testData[0].name))
        .attr('y',0)
        .attr("height",function(d){return yScale(0-padding_bottom)})
        .attr("width",(xScale.bandwidth()+0.1)*testData.length)
        .attr("fill","None")
        .attr("stroke","#A9A9A9")
        .attr("stroke-width",1);


    // -- Drawing Change Box -- 
    
    for (i = 0; i < testData.length; ++i){
        var d = testData[i];
        var abs_val = Math.abs(testData[i].inc_change); 
        for (n = 0; n < abs_val ; ++n) {
            var one_incr = yScale(0.9)-yScale(1)
            svg.append("g")
                .append("rect")
                .attr("x",xScale(d.name) + xScale.bandwidth()*0.25)
                .attr("width", xScale.bandwidth()*0.5)
                .attr("y",function(){
                        if (d.inc_change < 0){return yScale(0.5)+one_incr*n;}
                        else {return yScale(0.5)-one_incr*(n+1)}
                })
                .attr("height",one_incr)
                .attr("fill", the_colour)
                .attr("stroke-width",0.4)
                .attr("stroke","white");
        }
//        
    }

    // -- Drawing the initial level --
    svg.append("g")
        .selectAll("line")
        .data(testData)
        .enter()
        .append("line")
        .attr("class","line_lvl")
        .attr("x1",function(d){return xScale(d.name) + xScale.bandwidth()*0.15})
        .attr("x2",function(d){return xScale(d.name) + xScale.bandwidth()*0.85})
        .attr("y1",function(d){return yScale(0.5);})
        .attr("y2",function(d){return yScale(0.5);})
        .attr("stroke", "black")
        .attr("stroke-width",1)
        .attr("fill", "none");
}

function draw_all_squares(totalData, limit, elemn) {

    const horizontal_limit = limit/2;
    
    var x1_shift = 0,
        x2_shift = 0,
        y1_shift = 0,
        y2_shift = 0,
        
        x_sep = 6,
        y_sep = 6;
    
    const sq_height = 35,
          sq_width = 35;

    const margin = {
            top: 0, 
            right: 0,
            bottom: 0, 
            left: 0
        };

          
    var width = 420 - margin.right - margin.left,
        height = sq_height*(Math.ceil(limit/horizontal_limit)) + 6 - margin.top - margin.bottom;

    var svg = d3.select(elemn)
        .append("svg")
        .attr("class", "middle-svg")
        .attr("width",width + margin.right + margin.left)
        .attr("height",height + margin.top + margin.bottom)
            .append("g")
                .attr("transform","translate(" + margin.left + ',' + margin.top +')');
    
    var text_shift = 0,
        text_feat = 30,
        text_space = 95;
    
    for (i = 0; i < totalData[0].length; ++i){
        var name_string = (totalData[0][i].name).toString() ;
        
        svg.append('g').append("text")
            .text(name_string)
            .attr("x",text_feat)
            .attr("y",function(){
                    if (name_string.length < 20){return 10+text_shift;}
                    else {return 10+text_shift;}
            })  
            .attr("font-family", 'sans-serif')
            .attr("font-size", '10px')
            .attr("fill","#808080")
            .attr("text-anchor",'start')
                .call(wrap, text_space);
        
//        svg.append('g').append("text")
//            .text((totalData[0][i].label).toString())
//            .attr("x",0)
//            .attr("y",17+text_shift)
//            .attr("font-family", 'sans-serif')
//            .attr("font-size", '12px')
//            .attr("fill","#808080")
//            .attr("text-anchor",'start');
                
        svg.append('g').append("text")
            .text((totalData[0][i].label).toString())
            .attr("x",0)
            .attr("y",function(){
                    if (name_string.length < 20){return 10+text_shift;}
                    else {return 10+text_shift;}
            })  
            .attr("font-family", 'sans-serif')
            .attr("font-size", '12px')
            .attr("fill","#808080")
            .attr("text-anchor",'start');
        text_shift += 25
    }
    
    svg = svg.append("g")
            .attr("transform","translate(" + (text_space+text_feat+5) + ",0)");
    
    
    
    var row1_count = 1,
        row2_count = 1;
    
    y2_shift = sq_height + y_sep;
    
    if (totalData.length <= limit) {limit = totalData.length;}

    for (indx = 0; indx < limit; ++indx){
        var single_square = totalData[indx];
        if (((single_square[0].per) >= 0.5)&&(row1_count != horizontal_limit)){
            var shifted_svg = svg.append('g')
                    .attr("transform","translate(" + x1_shift + ',' + y1_shift +')');
            draw_single_graph(single_square, shifted_svg, sq_width, sq_height);
            x1_shift += sq_width + x_sep;
            row1_count += 1;
        }
        
        else if (((single_square[0].per) < 0.5)&&(row2_count != horizontal_limit)){
            var shifted_svg = svg.append('g')
                    .attr("transform","translate(" + x2_shift + ',' + y2_shift +')');  
            draw_single_graph(single_square, shifted_svg, sq_width, sq_height);
            x2_shift += sq_width + x_sep;
            row2_count += 1;
        }

        
    }
}

function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}
//draw_all_squares(totalData1,12 ,"body");

