let yMargin = 40;
let width = 800;
let height= 400;
let barWidth = width / 275;
let tooltip = d3.select(".visHolder")
                .append("div")
                .attr("id", "tooltip")
                .style("opacity", 0);

let overlay = d3.select(".visHolder")
                .append("div")
                .attr("class", "overlay")
                .style("opacity", 0);

const svg = d3.select(".visHolder")
              .append("svg")
              .attr("width", width + 100)
              .attr("height", height + 60);

fetch("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(res => res.json())
    .then(data => {
        svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -200)
          .attr("y", 80)
          .text("Gross Domestic Product");

        svg.append("text")       
           .attr("x", width / 2 + 120)  
           .attr("y", height + 50)
           .attr("class", "info")
           .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf");  

        let years = data.data.map(i => {
            let quarter;
            let temp =  i[0].substring(5, 7);

            if (temp === "01") quarter = "Q1";
            else if (temp === "04") quarter = "Q2";
            else if (temp === "07") quarter = "Q3";
            else if (temp === "10") quarter = "Q4";

            return i[0].substring(0, 4) + " " + quarter;
        });

        let yearsDate = data.data.map(i => new Date(i[0]));
        
        let xMax = new Date(d3.max(yearsDate));
        xMax.setMonth(xMax.getMonth() + 3);

        const xScale = d3.scaleTime()
                         .domain([d3.min(yearsDate), xMax])
                         .range([0, width]);

        const xAxis = d3.axisBottom()
                        .scale(xScale);
                        
        const xAxisGroup =  svg.append("g")
                               .attr("transform", "translate(60, 400)")        
                               .attr("id", "x-axis") 
                               .call(xAxis);       

        const GDP = data.data.map(i => i[1]);

        let scaledGDP = [];

        let gdpMin = d3.min(GDP);
        let gdpMax = d3.max(GDP);

        const linearScale = d3.scaleLinear()
                              .domain([0, gdpMax])
                              .range([0, height]);

        scaledGDP = GDP.map(i => linearScale(i));
        
        const yAxisScale = d3.scaleLinear()
                             .domain([0, gdpMax])
                             .range([height, 0]);

        const yAxis = d3.axisLeft(yAxisScale);     
        
        const yAxisGroup = svg.append("g") 
                              .attr("transform", "translate(60, 0)")
                              .attr("id", "y-axis")
                              .call(yAxis);

        d3.select("svg")
          .selectAll("rect")
          .data(scaledGDP)
          .enter()
          .append("rect")
          .attr("data-date", (d, i) => data.data[i][0]) 
          .attr("data-gdp", (d, i) => data.data[i][1]) 
          .attr("class", "bar") 
          .attr("x", (d, i) => xScale(yearsDate[i])) 
          .attr("y", d => height - d) 
          .attr("width", barWidth) 
          .attr("height", d => d)
          .attr("transform", "translate(60, 0)")
          .style("fill", "blue")
          .on("mouseover", (d, i) => {
              overlay.transition()
                     .duration(100)
                     .style("height", d + "px")
                     .style("width", barWidth + "px")
                     .style("opacity", .9)
                     .style("left", (i * barWidth) + "px")
                     .style("top", height - d + "px")
                     .style("transform", "translateX(60px)");
              tooltip.transition()       
                     .duration(200)
                     .style("opacity", .9);
                     
              tooltip.html(years[i] + "<br>" + "$" + GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") + "Billion")       
                     .attr("data-date", data.data[i][0])
                     .style("left", (i * barWidth) + 80 + "px")
                     .style("top", height - 100 + "px")
          })
          
          .on("mouseout", d => {
            tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
            overlay.transition()
                   .duration(200)
                   .style("opacity", 0);
          })


    })           



    