
var serves=[];

d3.json("serves.json")
.then(function(data) {
  serves=data;
  
     
const DjokovicData=[];
const NadalData=[]

const Djokovic1Data=[]
const Djokovic2Data=[]
const Djokovic3Data=[]
const Nadal1Data=[]
const Nadal2Data=[]
const Nadal3Data=[]

serves.forEach(item=>{
  if(item.server==="Djokovic"){
    DjokovicData.push(item);
  } else if(item.server==="Nadal"){
    NadalData.push(item);
  }
});

DjokovicData.forEach(item=>{
   if(item.rallyid<=64 && item.rallyid>0){
    Djokovic1Data.push(item);
  }else if(item.rallyid>64 && item.rallyid<=128){
    Djokovic2Data.push(item);
  }else if(item.rallyid>=130 && item.rallyid<=206){
    Djokovic3Data.push(item);
  }
});
NadalData.forEach(item=>{
  if(item.rallyid<=64 && item.rallyid>0){
    Nadal1Data.push(item);
  }else if(item.rallyid>64 && item.rallyid<=128){
    Nadal2Data.push(item);
  }else if(item.rallyid>=130 && item.rallyid<=206){
    Nadal3Data.push(item);
  }
});


const svg_court = d3.select("#tennis-court");

const height_court =219.4;
const width_court = 118.9 * 4;
const service_box = 125;
const double_field = 27.4;
const baseline_serviceline = 110;
const breite_einzel = 164.6;
const serviceline_net = 125;

    // Court outline
svg_court
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", height_court)
    .attr("height", width_court)
    .attr("fill", "#5581A6")
    .attr("stroke", "white");
  
  // Net
  svg_court
    .append("line")
    .attr("x1", height_court)
    .attr("y1", width_court / 2)
    .attr("x2", 0)
    .attr("y2", width_court / 2)
    .attr("stroke", "white");
  
  // Serving rectangle
  svg_court
    .append("rect")
    .attr("x", double_field)
    .attr("y", baseline_serviceline)
    .attr("width", breite_einzel)
    .attr("height", serviceline_net * 2)
    .attr("fill", "none")
    .attr("stroke", "white");
  
  // Service lines
  svg_court
    .append("line")
    .attr("x1", height_court / 2)
    .attr("y1", width_court / 2 - service_box)
    .attr("x2", height_court / 2)
    .attr("y2", width_court / 2 + service_box)
    .attr("stroke", "white");

    svg_court
    .append("line")
    .attr("x1", height_court / 2)
    .attr("y1", 0)
    .attr("x2", height_court / 2)
    .attr("y2", 0 + 0.45)
    .attr("stroke", "white");

    svg_court
    .append("line")
    .attr("x1", height_court / 2)
    .attr("y1", width_court)
    .attr("x2", height_court / 2)
    .attr("y2", width_court - 0.45)
    .attr("stroke", "white");

    svg_court
    .append("line")
    .attr("x1", double_field)
    .attr("y1", 0)
    .attr("x2", double_field)
    .attr("y2", width_court)
    .attr("stroke", "white");

    svg_court
    .append("line")
    .attr("x1", height_court - double_field)
    .attr("y1", 0)
    .attr("x2", height_court - double_field)
    .attr("y2", width_court)
    .attr("stroke", "white");


let redBallsCount=0;
let yellowBallsCount=0;
let totalBallsCount=0; 
let redBallsPercentage=0;
let yellowBallsPercentage=0; 
let accuracyText; 


function update(data) {
  // Remove existing tennis balls
  svg_court.selectAll(".tennis-ball")
  .transition()
  .duration(500)
  .attr("r",0)
  .remove();
  svg_court.selectAll("text")
  .remove();

  // Draw tennis balls based on the new data
  const tennisBalls = svg_court.selectAll(".tennis-ball")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "tennis-ball")
    .attr("cx", d => d.x*20) // x-koordinata iz podataka
    .attr("cy", d => d.y*20) // y-koordinata iz podataka
    .attr("r", 0) // veličina lopte
    .attr("fill", "yellow") // boja lopte
    .attr("stroke", "black") // boja ruba lopte
    .attr("stroke-width", 1) // debljina ruba lopte
    .transition()
    .duration(1000) 
    .attr("r", 3)
    .attr("fill", d => {
      
      if (
        d.x*20 >= 0 && d.x*20 <= height_court &&
        d.y*20 >= 0 && d.y*20 <= width_court &&
        d.x*20 >= double_field && d.x*20 <= (double_field + breite_einzel) &&
        d.y*20 >= baseline_serviceline && d.y*20 <= (baseline_serviceline + serviceline_net * 2)
        ){
        yellowBallsCount++;
        totalBallsCount++;
        return "yellow";
      } else {
        redBallsCount++;
        totalBallsCount++;
        return "red";
      }
    });
    redBallsPercentage=(redBallsCount / totalBallsCount) * 100;
    yellowBallsPercentage = (yellowBallsCount / totalBallsCount) * 100;
    accuracyText=`In: ${yellowBallsPercentage.toFixed(2)}%, Out: ${redBallsPercentage.toFixed(2)}%`;
    svg_court
    .append("text")
    .attr("x", height_court / 2)
    .attr("y", width_court + 20)
    .attr("text-anchor", "middle")
    .text(accuracyText);
}

  // Button click event handlers
function handleButtonClick(buttonId) {
  if (buttonId === "button-djokovic") {
    update(DjokovicData); // Display Djokovic's data
  } else if (buttonId === "button-nadal") {
    update(NadalData); // Display Nadal's data
  }else if (buttonId === "button-djokovic1") {
    update(Djokovic1Data); // Display Nadal's data
  }
  else if (buttonId === "button-djokovic2") {
    update(Djokovic2Data); // Display Nadal's data
  }
  else if (buttonId === "button-djokovic3") {
    update(Djokovic3Data); // Display Nadal's data
  }else if (buttonId === "button-nadal1") {
    update(Nadal1Data); // Display Nadal's data
  }else if (buttonId === "button-nadal2") {
    update(Nadal2Data); // Display Nadal's data
  }else if (buttonId === "button-nadal3") {
    update(Nadal3Data); // Display Nadal's data
  }
  
}

// Add event listeners to the buttons
document.getElementById("button-djokovic").addEventListener("click", () => handleButtonClick("button-djokovic"));
document.getElementById("button-nadal").addEventListener("click", () => handleButtonClick("button-nadal"));
document.getElementById("button-djokovic1").addEventListener("click", () => handleButtonClick("button-djokovic1"));
document.getElementById("button-djokovic2").addEventListener("click", () => handleButtonClick("button-djokovic2"));
document.getElementById("button-djokovic3").addEventListener("click", () => handleButtonClick("button-djokovic3"));
document.getElementById("button-nadal1").addEventListener("click", () => handleButtonClick("button-nadal1"));
document.getElementById("button-nadal2").addEventListener("click", () => handleButtonClick("button-nadal2"));
document.getElementById("button-nadal3").addEventListener("click", () => handleButtonClick("button-nadal3"));

});




var points=[];

d3.json("points.json")
.then(function(data) {
  points=data;
  pointsVisual();
  
});


function pointsVisual(){
  

const playerWins = {
  Djokovic: 0,
  Nadal: 0
};

points.forEach(d => {
  const winner = d.winner;
  playerWins[winner]++;
});

// Postavi veličinu i margine grafa
const width = 300;
const height = 200;
const margin = { top: 40, right: 20, bottom: 30, left: 40 };

// Stvori D3.js skalu za osi
const xScale = d3
  .scaleBand()
  .domain(Object.keys(playerWins))
  .range([margin.left, width - margin.right])
  .padding(0.1);

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(Object.values(playerWins))])
  .range([height - margin.bottom, margin.top]);

// Stvori SVG element za crtanje grafa
const svg_barchart = d3
  .select("#barchart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
 ;
 svg_barchart
  .append("text")
  .attr("x", width / 2)
  .attr("y", margin.top /4 )
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Player Points Won");

// Crtaj trake barcharta
svg_barchart
  .selectAll("rect")
  .data(Object.entries(playerWins))
  .enter()
  .append("rect")
  .attr("x", d => xScale(d[0]))
  .attr("y", d => yScale(d[1]))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - margin.bottom - yScale(d[1]))
  .attr("fill", "green")
  .on("mouseover", (event, d) => {
    // Prikazi vrijednost stupca u prozorčiću
    svg_barchart
      .append("text")
      .attr("x", xScale(d[0]) + xScale.bandwidth() / 2 ) 
      .attr("y", yScale(d[1]) - 5)
      .attr("text-anchor", "middle")
      .text(d[1]+"%")
      .attr("class", "value-tooltip");
  })
  .on("mouseout", () => {
    // Ukloni prozorčić kada miš napusti stupac
    svg_barchart.selectAll(".value-tooltip").remove();
  });

// Dodaj osi
svg_barchart
  .append("g")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(xScale));

svg_barchart
  .append("g")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(yScale));


}


var events=[];

d3.json("events.json")
.then(function(data) {
  events=data;
  const serveCounts = events.reduce((counts, d) => {
    counts[d.serve] = (counts[d.serve] || 0) + 1;
    return counts;
  }, {});

  
  const serves = Object.keys(serveCounts);
  const serveData = serves.map(serve => ({ serve, count: serveCounts[serve] }));

  const width = 400;
  const height = 300;
  const radius = Math.min(width, height) / 2;
  const colors = d3.scaleOrdinal(d3.schemeCategory10);

  const arc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(0);

  const pie = d3.pie()
    .sort(null)
    .value(d => d.count);

  const svg_pie = d3.select("#pie-chart")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  svg_pie.append("text")
  .attr("x", 0)
  .attr("y", -height / 2 + 20)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Serve Distribution");

  const slices = svg_pie.selectAll(".slice")
  .data(pie(serveData))
  .enter()
  .append("g")
  .attr("class", "slice")
  .on("mouseover", handleMouseOver)
  .on("mouseout", handleMouseOut);

  slices.append("path")
  .attr("d", arc)
  .attr("fill", (d, i) => colors(i))
  .attr("class", "pie-slice");

  slices.append("text")
    /*.attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .text(d => d.data.serve)*/
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .text(d => d.data.serve)
    .attr("class", "pie-label")
    .style("opacity", 0);

  const legend = svg_pie.selectAll(".legend")
    .data(pie(serveData))
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(100,${i * 20})`);

  legend.append("rect")
    .attr("x", width / 2 - 18)
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", (d, i) => colors(i));

  legend.append("text")
    .attr("x", width / 2 + 5)
    .attr("y", 9)
    .attr("dy", ".35em")
    .text(d => d.data.serve);

    function handleMouseOver(d) {
      d3.select(this)
        .select(".pie-slice")
        .transition()
        .duration(200)
        .attr("d", d3.arc().outerRadius(radius - 30).innerRadius(0));

      d3.select(this)
        .select(".pie-label")
        .transition()
        .duration(200)
        .style("opacity", 1);

      const percentage = ((d.data.count / serveData.reduce((sum, serve) => sum + serve.count, 0)) * 100).toFixed(2);

      d3.select(this)
        .append("text")
        .attr("class", "pie-percentage")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .text(`${percentage}%`)
        .style("font-weight", "bold")
        .style("font-size", "14px");
    }

    function handleMouseOut(d) {
      d3.select(this)
        .select(".pie-slice")
        .transition()
        .duration(200)
        .attr("d", arc);

      d3.select(this)
        .select(".pie-label")
        .transition()
        .duration(200)
        .style("opacity", 0);

      d3.select(this)
        .select(".pie-percentage")
        .remove();
    }

});



var time=[];

d3.json("points.json")
.then(function(data) {
  time=data;
  // Set up the dimensions and margins for the line chart
  const width = 1000;
const height = 400;
const margin = { top: 20, right: 20, bottom: 40, left: 40 };
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

// Create the SVG element for the line chart
const svg_linechart = d3.select("#line-chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Create a group element for the chart area
const chart = svg_linechart.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Define the scales for the x-axis and y-axis
const xScale = d3.scaleBand()
  .domain(data.map(d => d.rallyid))
  .range([0, chartWidth])
  .padding(0.1);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.totaltime)])
  .range([chartHeight, 0]);

// Define the line generator
const line = d3.line()
  .x(d => xScale(d.rallyid) + xScale.bandwidth() / 2)
  .y(d => yScale(d.totaltime));

// Append the line to the chart
chart.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("d", line);

// Add x-axis
chart.append("g")
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(d3.axisBottom(xScale));

// Add y-axis
chart.append("g")
  .call(d3.axisLeft(yScale));

// Add x-axis label
chart.append("text")
  .attr("x", chartWidth / 2)
  .attr("y", chartHeight + margin.bottom - 5)
  .attr("text-anchor", "middle")
  .text("Point No");

// Add y-axis label
chart.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -chartHeight / 2)
  .attr("y", -margin.left)
  .attr("dy", "1em")
  .attr("text-anchor", "middle")
  .text("Time");

// Add chart title
chart.append("text")
  .attr("x", chartWidth / 2)
  .attr("y", -margin.top / 2)
  .attr("text-anchor", "middle")
  .text(" Duration of Points");

  const tooltip = d3.select("#line-chart")
  .append("div")
  .attr("class", "tooltip-window");

chart.selectAll(".data-point")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "data-point")
  .attr("cx", d => xScale(d.rallyid) + xScale.bandwidth() / 2)
  .attr("cy", d => yScale(d.totaltime))
  .attr("r", 3)
  .attr("fill", "steelblue")
  .on("mouseover", (event, d) => {
    const tooltipWidth = parseInt(tooltip.style("width"), 10);
    const tooltipHeight = parseInt(tooltip.style("height"), 10);
    const mouseCoords = d3.pointer(event);
    const chartOffsetLeft = document.getElementById("line-chart").offsetLeft;
    const chartOffsetTop = document.getElementById("line-chart").offsetTop;

    tooltip.classed("active", true)
      .html(`Score: ${d.score}<br>
            Winner: ${d.winner}<br>
            Time: ${d.totaltime.toFixed(2)}s<br>
            Point No: ${d.rallyid}`)
      .style("left", `${mouseCoords[0]}px`)
      .style("top", `${mouseCoords[1]-100}px`);
  })
  .on("mouseout", () => {
    tooltip.classed("active", false);
  });
});