import * as d3 from 'd3';
import { tip as d3tip } from 'd3-v6-tip';
import {legendColor} from 'd3-svg-legend';
import { useEffect } from 'react';

const Programs = ({ programs }) => {

    useEffect(() => {
        if (programs) {
            //define donut graph dimensions, arcPath, and color scheme
            const dims = { height: 300, width: 300, radius: 150 };
            const cent = { x: (dims.width / 2 + 5), y: (dims.height /2 + 5)};

            const svg = d3.select('.program-canvas')
                .append('svg')
                .attr('width', dims.width + 550)
                .attr('height', dims.height + 300);

            const graph = svg.append('g')
                .attr('transform', `translate(${cent.x}, ${cent.y})`);

            const pie = d3.pie()
                .sort(null)
                .value(d => d.percentage);

            const arcPath = d3.arc()
                .outerRadius(dims.radius)
                .innerRadius(dims.radius / 2);

            //setup legend
            const legendGroup = svg.append('g')
                .attr('transform', `translate(${dims.width + 40}, 20)`);
        
            const legend = legendColor()
                .shape('circle')
                .shapeRadius(6)
                .shapePadding(6)
                .scale(color)

            //setup tool tip
            const tip = d3tip()
                .attr('class', 'tip-div')
                .html(d => {
                    let content = `<div className="tip-name">${d.data.name}</div>`;
                    content += `<div className="tip-percentage">${d.data.percentage}%</div>`;
                    return content
                })
            
            graph.call(tip);

            //format programs object and values for d3 rendering
            const programData = [];
            Object.keys(programs).forEach(key => programData.push({name: key.replaceAll('_', ' '), percentage: (programs[key]* 100).toFixed(2)}));
            const existingPrograms = programData.filter(program => program.percentage > 0).sort((a,b) => (Object.values(a)[0] > Object.values(b)[0]) - 0.5);

            //set color scale domain
            color.domain(existingPrograms.map(d => d.name));

            //call legend
            legendGroup.call(legend)
            legendGroup.selectAll('text').attr('fill', 'black');

            //join pie data to path elements
            const paths = graph.selectAll('path')
                .data(pie(existingPrograms))

            paths.enter()
            .append('path')
                .attr('class', 'arc')
                .attr('d', arcPath)
                .attr('stroke', '#fff')
                .attr('stroke-width', 1)
                .attr('fill', d => color(d.data.name));
    
            //events
            graph.selectAll('path')
                .on('mouseover', (e, d) => {
                    tip.show(d, e.currentTarget);
                    handleMouseOver(e);
                })
                .on('mouseout', (e, d) => {
                    tip.hide();
                    handleMouseOut(e);
                })
        }
    }, [programs])

    //set color scheme for graph
    const color = d3.scaleOrdinal(d3['schemeSet3'])
    
    const handleMouseOver = (e) => {
        d3.select(e.currentTarget)
            .transition('changeSliceFill').duration(300)
                .attr('fill', '#fff')
    }

    const handleMouseOut = (e) => {
        d3.select(e.currentTarget)
            .transition('changeSliceFill').duration(300)
                .attr('fill', d => color(d.data.name))
    }

    return (   
        <div>
            {programs && <div className="program-canvas">
                <h3>Program Percentage</h3>
            </div>}
        </div>
        
     );
}
 
export default Programs;