d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
).then((data) => {
  const dataset = data.data;

  // set up chart dimensions
  const margin = { top: 20, right: 20, bottom: 70, left: 70 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // create svg element
  const svg = d3
    .select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  //create x and y scale
  const xScale = d3
    .scaleTime()
    .domain([
      new Date(d3.min(dataset, (d) => d[0])),
      new Date(d3.max(dataset, (d) => d[0])),
    ])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([height, 0]);

  //create x and y axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  svg.append("g").attr("id", "y-axis").call(yAxis);

  //create bars
  svg
    .selectAll(".bar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("x", (d) => xScale(new Date(d[0])))
    .attr("y", (d) => yScale(d[1]))
    .attr("width", width / dataset.length)
    .attr("height", (d) => height - yScale(d[1]))
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);

  //create tooltip
  const tooltip = d3.select("#tooltip");

  function showTooltip(event, d) {
    tooltip
      .style("display", "block")
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 30 + "px")
      .attr("data-date", d[0])
      .html(`${d[0]}<br>${d[1]} Billion USD`);
  }

  function hideTooltip() {
    tooltip.style("display", "none");
  }
});
