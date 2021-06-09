const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
xhr.send();
xhr.onload = () => {
    const json = JSON.parse(xhr.responseText);
    const dataset = json.data;
    //console.log(dataset);
    barChart(dataset);
}
let tooltip = d3.select('.visContainer')
       .append('div')
       .attr('id', 'tooltip')
       .style('opacity', 0);

function barChart(dataset){
    const height = 400;
    const width = 800;
    const padding = 60;
    const barWidth = (width - (padding * 2)) / dataset.length;


    const years = dataset.map((d) => {
        let date = d[0]; 
        let year = date.slice(0, 4);
        let quarter = {
            '01': 'Q1',
            '04': 'Q2',
            '07': 'Q3',
            '10': 'Q4'
        }[date.slice(5, 7)];
        return year + ' ' + quarter;
    });

    const dateYears = dataset.map((d) => {
        return new Date(d[0]);
    });

    let xMax = new Date(d3.max(dateYears));
    xMax.setMonth(xMax.getMonth() + 3);
    const xScale = d3.scaleTime()
                     .domain([d3.min(dateYears), xMax])
                     .range([padding, width - padding]);
    
    console.log(xScale('1999'));
    const xAxis = d3.axisBottom().scale(xScale);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset, (d) => d[1])])
                     .range([padding, height - padding]);
    console.log(d3.min(dataset.map(d => d[1])));
    const yAxis = d3.axisLeft(d3.scaleLinear()
                                .domain([0, d3.max(dataset, (d) => d[1])])
                                .range([height - padding, padding]));

    const svg = d3.select('.visContainer')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

    svg.selectAll('rect')
       .data(dataset)
       .enter()
       .append('rect')
       .attr('class', 'bar')
       .attr('data-date', (d) => d[0])
       .attr('data-gdp', (d) => d[1])
       .attr('x', (d, i) => xScale(dateYears[i]))
       .attr('y', (d) => height - yScale(d[1]))
       .attr('width', barWidth)
       .attr('height', (d) => yScale(d[1]) - padding)
       .on('mouseover', (d, i) => {
           console.log(d);
           console.log(i);
           tooltip.transition().duration(200).style('opacity', 0.9);
           tooltip
                .html(years[i] + '<br>' + Math.round(d[1]) + ' Billion')
                .attr('data-date', d[0])
                .style('left', i * barWidth + padding + 'px')
                .style('top', height - padding + 'px')
                .style('transform', 'translateX(60px)');
       })
       .on('mouseout', () => {
           tooltip.transition().duration(200).style('opacity', 0);
       });

    svg.append("g")
       .call(xAxis)
       .attr('id', 'x-axis')
       .attr("transform", "translate(0, " + (height - padding) + ")");
    
    svg.append("g")
       .call(yAxis)
       .attr('id', 'y-axis')
       .attr("transform", "translate(" + padding + ", 0)");
}