////servisi
var serves=[];

d3.json("serves.json")
.then(function(data) {
  serves=data;
  createCourt(serves);
  lineChart();
});

function createCourt(serves){

  const DjokovicData=[];
  const NadalData=[]

  serves.forEach(item=>{
    if(item.server==="Djokovic"){
      DjokovicData.push(item);
    } else {
      NadalData.push(item);
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

       
  svg_court
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", height_court)
    .attr("height", width_court)
    .attr("fill", "#5581A6")
    .attr("stroke", "white");
      

    svg_court
      .append("line")
      .attr("x1", height_court)
      .attr("y1", width_court / 2)
      .attr("x2", 0)
      .attr("y2", width_court / 2)
      .attr("stroke", "white");
      

    svg_court
      .append("rect")
      .attr("x", double_field)
      .attr("y", baseline_serviceline)
      .attr("width", breite_einzel)
      .attr("height", serviceline_net * 2)
      .attr("fill", "none")
      .attr("stroke", "white");
      
   
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


    const zoom = d3.zoom()
      .scaleExtent([1, 1.5])
      .on("zoom", zoomed);
    
    svg_court.call(zoom);
    
    function zoomed(event) {
      svg_court.attr("transform", event.transform);
    }

    let redBallsCount=0;
    let yellowBallsCount=0;
    let totalBallsCount=0; 
    let redBallsPercentage=0;
    let yellowBallsPercentage=0; 
    let accuracyText; 


    function update(data) {

      const tennisBalls = svg_court.selectAll(".tennis-ball")                //isrctavanje loptica
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "tennis-ball")
        .attr("cx", d => d.x*20) 
        .attr("cy", d => d.y*20) 
        .attr("r", 0) 
        .attr("fill", "yellow") 
        .attr("stroke", "black") 
        .attr("stroke-width", 1) 
        .transition()
        .duration(500) 
        .attr("r", 3)
        .attr("fill", d => {  
          if (d.x*20 >= 0 && d.x*20 <= height_court &&
              d.y*20 >= 0 && d.y*20 <= width_court &&
              d.x*20 >= double_field && d.x*20 <= (double_field + breite_einzel) &&
              d.y*20 >= baseline_serviceline && d.y*20 <= (baseline_serviceline + serviceline_net * 2)
              ){                                                                                        //uvjeti za in
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
        svg_court.append("text")
          .attr("x", height_court / 2)
          .attr("y", width_court + 20)
          .attr("text-anchor", "middle")
          .text(accuracyText);
    }


function handleButtonClick(buttonId) {
  if (buttonId === "button-djokovic") {
    svg_court.selectAll(".tennis-ball")
      .remove();
    svg_court.selectAll("text")
      .remove();
    update(DjokovicData); 
  } else if (buttonId === "button-nadal") {
    svg_court.selectAll(".tennis-ball")
      .remove();
    svg_court.selectAll("text")
      .remove();
    update(NadalData); 
  } 
  
}


document.getElementById("button-djokovic").addEventListener("click", () => handleButtonClick("button-djokovic"),);
document.getElementById("button-nadal").addEventListener("click", () => handleButtonClick("button-nadal"));



}


/////barchart
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


  const width = 300;
  const height = 200;
  const margin = { top: 40, right: 20, bottom: 30, left: 40 };


  const xScale = d3.scaleBand()      //diskretna skala
    .domain(Object.keys(playerWins))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const yScale = d3.scaleLinear()    //linearna skala
    .domain([0, d3.max(Object.values(playerWins))])
    .range([height - margin.bottom, margin.top]);

  const svg_barchart = d3.select("#barchart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg_barchart.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top /4 )
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Player Points Won");    //naslov

  const colors = d3.scaleOrdinal(["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"]);



  svg_barchart
    .selectAll("rect")
    .data(Object.entries(playerWins))
    .enter()
    .append("rect")
    .attr("x", d => xScale(d[0]))
    .attr("y", d => yScale(d[1]))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - margin.bottom - yScale(d[1]))
    .attr("fill", (d, i) => colors(i))
    .on("mouseover", (event, d) => {
      svg_barchart.append("text")
        .attr("x", xScale(d[0]) + xScale.bandwidth() / 2 ) 
        .attr("y", yScale(d[1]) - 5)
        .attr("text-anchor", "middle")
        .text(d[1]+"%")              //postotak svakog stupca
        .attr("class", "value-tooltip");
    })
    .on("mouseout", () => {
      svg_barchart.selectAll(".value-tooltip").remove();
    });


  svg_barchart.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale));

  svg_barchart.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale));


}

////piechart
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
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .text(d => d.data.count)
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



      d3.select(this)
        .append("text")
        .attr("class", "pie-percentage")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .text(`${d.DjokovicData}`)
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


////vrijeme poena

function lineChart(){
var time=[];
d3.json("points.json")
.then(function(data) {
  time=data;
  createLinechart(time);
});


function createLinechart(time){

  const set1=[]
  const set2=[]
  const set3=[]

  time.forEach(item=>{
    if(item.rallyid>=1 && item.rallyid<=64){
      set1.push(item);
    } else if(item.rallyid>64 && item.rallyid<=128){
      set2.push(item);
    }else {
      set3.push(item);
    }
  });

  const width = 1000;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;


  const svg_linechart = d3.select("#line-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


  const chart = svg_linechart.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


  const xScale = d3.scaleBand()
    .domain(time.map(d => d.rallyid))
    .range([0, chartWidth])
    .padding(0.1);
    

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(time, d => d.totaltime)])
    .range([chartHeight, 0]);

  const line = d3.line()
    .x(d => xScale(d.rallyid) + xScale.bandwidth() / 2)
    .y(d => yScale(d.totaltime));


  function updateLinechart(time) {
      
    chart.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale).tickValues(xScale.domain().filter((d, i) => (i + 1) % 5 === 0)));



    chart.append("path")
      .datum(time)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("d", line)
      .attr("opacity", 0)
      .transition()
      .duration(500)
      .attr("opacity", 1);
    
    
    
    chart.append("g")
      .call(d3.axisLeft(yScale));
    
    
    chart.append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + margin.bottom - 5)
      .attr("text-anchor", "middle")
      .text("Point No");
    
    
    chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -chartHeight / 2)
      .attr("y", -margin.left)
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .text("Time");
    
    
    chart.append("text")
      .attr("x", chartWidth / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .text(" Duration of Points");
    
      const tooltip = d3.select("#line-chart")
      .append("div")
      .attr("class", "tooltip-window");
    
    chart.selectAll(".data-point")
      .data(time)
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
          .style("top", `${mouseCoords[1]+50}px`);
      })
      .on("mouseout", () => {
        tooltip.classed("active", false);
      });
  
    }

  function handleButtonClick2(buttonId) {
      if (buttonId === "button-1stset") {
        chart.selectAll(".line")
          .transition()
          .duration(500)
          .attr("opacity", 0)
          .remove();
        chart.selectAll(".data-point")
          .remove();
        chart.selectAll(".text")
          .remove();
        updateLinechart(set1);
      } else if (buttonId === "button-2ndset"){
        chart.selectAll(".line")
          .transition()
          .duration(500)
          .attr("opacity", 0)
          .remove();
        chart.selectAll(".data-point")
          .remove();
        chart.selectAll(".text")
          .remove();    
        updateLinechart(set2);
      } else if (buttonId === "button-3rdset"){
        chart.selectAll(".line")
          .transition()
          .duration(500)
          .attr("opacity", 0)
          .remove();
        chart.selectAll(".data-point")
          .remove();
        chart.selectAll(".text")
          .remove();
        updateLinechart(set3);
      }
      
    }
    document.getElementById("button-1stset").addEventListener("click", () => handleButtonClick2("button-1stset"),);
    document.getElementById("button-2ndset").addEventListener("click", () => handleButtonClick2("button-2ndset"));
    document.getElementById("button-3rdset").addEventListener("click", () => handleButtonClick2("button-3rdset"),);

  }
}