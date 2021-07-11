import { useEffect } from 'react';
import * as d3 from 'd3';
import { tip as d3tip } from 'd3-v6-tip';
 
const Demographics = ({ demographics }) => {

    useEffect(() => {
            //append responsive svg
            const svg = d3.select('.demographics-canvas')
                .append('div')
                .attr('class', 'svg-container demographics-container')
                .append('svg')
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr('viewBox', '0 0 600 300')
                .attr('class', 'svg-content-responsive')
                
            //svg title
            svg.append('text')
                .attr('x', 250)
                .attr('y', 25)
                .attr('class', 'graph-title')
                .text('Demographics');
            
            //set margins and dimensions
            const margin = {top: 20, right: 20, bottom: 80, left: 100};
            const graphWidth = 600 - margin.left - margin.right
            const graphHeight = 300 - margin.top - margin.bottom

            //set linear scale for x
            const x = d3.scaleLinear()
                .domain([0, 100])
                .range([0, graphWidth])

            //set band scale for y
            const y = d3.scaleBand()
                .domain(demographics.map(item => item.name))
                .range([0, graphHeight])
                .paddingInner(0.5)
                .paddingOuter(0.5);

            const graph = svg.append('g')
                .attr('width', graphWidth)
                .attr('height', graphHeight)
                .attr('transform', `translate(${margin.left}, ${margin.top})`)
            
            //setup tool tip
            const tip = d3tip()
                .attr('class', 'tip-div')
                .html(d => {
                    let content = `<div className="tip-name">${d.name}</div>`;
                    content += `<div className="tip-percentage">${(d.percentage * 100).toFixed(2)}%</div>`;
                    return content
                })
            
            graph.call(tip);

            //append axes
            const xAxisGroup = graph.append('g')
                .attr('transform', `translate(0, ${graphHeight})`)
            const yAxisGroup = graph.append('g');

            //setup bars
            graph.append('rect')
                .attr('class', 'demographics-rect')
        
            const rects = graph.selectAll('rect')
                .data(demographics)
                
            rects.attr('width', d => x(d.percentage * 100))
                .attr('height', y.bandwidth)
                .attr('fill', '#0da49f')
                .attr('y', d => y(d.name))

            //append the enter selection to the DOM
            rects.enter()
                .append('rect')
                    .attr('width', d => x(d.percentage * 100))
                    .attr('height', y.bandwidth)
                    .attr('fill', '#0da49f')
                    .attr('y', d => y(d.name))

            //create and call the axes
            const xAxis = d3.axisBottom(x)
                .tickFormat(d => d + '%')
            const yAxis = d3.axisLeft(y)

            xAxisGroup.call(xAxis);
            yAxisGroup.call(yAxis);

            //setup events
            graph.selectAll('rect')
                .on('mouseover', (e, d) => {
                    tip.show(d, e.currentTarget);
                    handleMouseOver(e);
                    console.log(d)
                })
                .on('mouseout', (e, d) => {
                    tip.hide();
                    handleMouseOut(e);
                })
    }, [])

    //handle events
    const handleMouseOver = (e) => {
        d3.select(e.currentTarget)
            .transition('changeRectFill').duration(300)
                .attr('fill', '#1f5ca5')
    }

    const handleMouseOut = (e) => {
        d3.select(e.currentTarget)
            .transition('changeRectFill').duration(300)
                .attr('fill', '#0da49f')
    }

    return ( 
        <div className="demographics-canvas">
        </div>
     );
}
 
export default Demographics;