import * as d3 from 'd3';
import {legendColor} from 'd3-svg-legend';
import { useEffect } from 'react';

const Programs = ({ programs }) => {
    //define donut graph dimensions, arcPath, and color scheme
    const dims = { height: 300, width: 300, radius: 150 };
    const cent = { x: (dims.width / 2 + 5), y: (dims.height /2 + 5)};

    const svg = d3.select('.program-canvas')
        .append('svg')
        .attr('width', dims.width + 150)
        .attr('height', dims.height + 150);

    const graph = svg.append('g')
        .attr('transform', `translate(${cent.x}, ${cent.y})`);

    const pie = d3.pie()
        .sort(null)
        .value(d => d.percentage);

    const arcPath = d3.arc()
        .outerRadius(dims.radius)
        .innerRadius(dims.radius / 2);

    const color = d3.scaleOrdinal(d3['schemeSet3'])

    //setup legend
    const legendGroup = svg.append('g')
        .attr('transform', `translate(${dims.width + 40}, 10)`);
        
    const legend = legendColor()
        .shape('circle')
        .shapePadding(10)
        .scale(color)

    useEffect(() => {
        if (programs) {
            const programData = [];
            
            //format programs object for d3 rendering
            Object.keys(programs).forEach(key => programData.push({name: key, percentage: programs[key]}));
            const existingPrograms = programData.filter(program => program.percentage > 0)

            //set color scale domain
            color.domain(existingPrograms.map(d => d.name));

            //call legend
            legendGroup.call(legend)
            legendGroup.selectAll('text').attr('fill', 'blue');

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
    
            console.log(existingPrograms)
            console.log(paths.enter())
        }
    }, [programs])
    
    return (   
        <div className="program-canvas">
            <h3>Program Percentage</h3>
        </div>
     );
}
 
export default Programs;