import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Graph.css';

const GRAPH_CONFIG = {
  width: 800,
  height: 600,
  nodeRadius: { min: 8, max: 25 },
  forces: {
    linkDistance: 120,
    chargeStrength: -400,
    collisionPadding: 2
  },
  zoom: {
    scaleExtent: [0.1, 4],
    transitions: {
      zoom: 300,
      reset: 500
    }
  },
  tooltip: {
    showDelay: 200,
    hideDelay: 500
  }
};

// TODO: Update colors based on actual communities after community detection
const CATEGORY_COLORS = {
  'Deep Learning': '#ff6b6b',
  'NLP': '#4ecdc4',
  'Computer Vision': '#45b7d1',
  'Machine Learning': '#96ceb4',
  'default': '#feca57'
};

const Graph = ({ selectedFile }) => {
  const containerRef = useRef();


  const createTooltipContent = (d) => `
    <strong>${d.title}</strong><br/>
    <strong>Authors:</strong> ${d.authors}<br/>
    <strong>Year:</strong> ${d.year}<br/>
    <strong>Citations:</strong> ${d.citations.toLocaleString()}<br/>
    <strong>Category:</strong> ${d.category}
  `;

  
  const truncateTitle = (title, maxLength = 30) => 
    title.length > maxLength ? title.substring(0, maxLength) + '...' : title;

  const createArrowMarkers = (svg) => {
    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 13)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('class', 'graph-arrow');
  };


  const createTooltip = () => {
    return d3.select('body')
      .append('div')
      .attr('class', 'graph-tooltip');
  };


  const setupNodeInteractions = (node, tooltip) => {
    node
      .on('mouseover', function(event, d) {
        d3.select(this).classed('hover', true);
        
        tooltip
          .classed('visible', true)
          .html(createTooltipContent(d))
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).classed('hover', false);
        tooltip.classed('visible', false);
      });
  };


  const setupDragBehavior = (simulation) => {
    return d3.drag()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
  };


  const createControlButtons = (container, svg, zoom) => {
    const buttonsContainer = container
      .append('div')
      .attr('class', 'controls-container');


    buttonsContainer
      .append('button')
      .attr('class', 'control-button')
      .attr('title', 'Zoom In')
      .html('<i class="fas fa-search-plus"></i>')
      .on('click', () => {
        svg.transition()
          .duration(GRAPH_CONFIG.zoom.transitions.zoom)
          .call(zoom.scaleBy, 1.5);
      });


    buttonsContainer
      .append('button')
      .attr('class', 'control-button')
      .attr('title', 'Zoom Out')
      .html('<i class="fas fa-search-minus"></i>')
      .on('click', () => {
        svg.transition()
          .duration(GRAPH_CONFIG.zoom.transitions.zoom)
          .call(zoom.scaleBy, 0.67);
      });


    buttonsContainer
      .append('button')
      .attr('class', 'control-button')
      .attr('title', 'Reset View')
      .html('<i class="fas fa-home"></i>')
      .on('click', () => {
        svg.transition()
          .duration(GRAPH_CONFIG.zoom.transitions.reset)
          .call(zoom.transform, d3.zoomIdentity);
      });
  };


  const renderGraph = async () => {
    if (!containerRef.current) return;

    try {
      const response = await fetch(`/data/${selectedFile}`);
      const data = await response.json();

      // Clean previous graph
      d3.select(containerRef.current).selectAll('*').remove();

      const container = d3.select(containerRef.current);

      // Create SVG canvas (it includes the graph)
      const svg = container
        .append('svg')
        .attr('width', GRAPH_CONFIG.width)
        .attr('height', GRAPH_CONFIG.height);


      const zoom = d3.zoom()
        .scaleExtent(GRAPH_CONFIG.zoom.scaleExtent)
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });

      svg.call(zoom);

      // Create main group for graph elements
      const g = svg.append('g');
      createArrowMarkers(svg);
      const tooltip = createTooltip();

      // Setup scales, extent returns the range of citations [min, max] in data nodes, to scale accordingly
      const citationExtent = d3.extent(data.nodes, d => d.citations);
      const radiusScale = d3.scaleLinear()
        .domain(citationExtent)
        .range([GRAPH_CONFIG.nodeRadius.min, GRAPH_CONFIG.nodeRadius.max]);

      // Create force simulation (simulates physical forces on nodes and edges)
      const simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.edges) // the actual line mapping nodes to each other based on source and target
          .id(d => d.id)
          .distance(GRAPH_CONFIG.forces.linkDistance))
        .force('charge', d3.forceManyBody()
          .strength(GRAPH_CONFIG.forces.chargeStrength))
        .force('center', d3.forceCenter(
          GRAPH_CONFIG.width / 2, 
          GRAPH_CONFIG.height / 2))
        .force('collision', d3.forceCollide()
          .radius(d => radiusScale(d.citations) + GRAPH_CONFIG.forces.collisionPadding));


      const link = g.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(data.edges)
        .enter()
        .append('line')
        .attr('class', 'graph-link')
        .attr('marker-end', 'url(#arrowhead)');

      const node = g.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(data.nodes)
        .enter()
        .append('circle')
        .attr('class', 'graph-node')
        .attr('r', d => radiusScale(d.citations))
        .attr('fill', d => CATEGORY_COLORS[d.category] || CATEGORY_COLORS.default)
        .call(setupDragBehavior(simulation));

      setupNodeInteractions(node, tooltip);

      const labels = g.append('g')
        .selectAll('text')
        .data(data.nodes)
        .enter()
        .append('text')
        .attr('class', 'graph-label')
        .text(d => truncateTitle(d.title))
        .attr('dy', d => radiusScale(d.citations) + 15);

      createControlButtons(container, svg, zoom);

      simulation.on('tick', () => {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);

        labels
          .attr('x', d => d.x)
          .attr('y', d => d.y);
      });

      return () => {
        tooltip.remove();
      };

    } catch (error) {
      console.error('Error loading graph data:', error);
    }
  };

  useEffect(() => {
    const cleanup = renderGraph();
    return () => {
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then(cleanupFn => cleanupFn && cleanupFn());
      }
    };
  }, [selectedFile]);

  return <div ref={containerRef} className="graphin-wrapper" />;
};

export default Graph;