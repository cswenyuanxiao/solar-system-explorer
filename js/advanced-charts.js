// Advanced Data Visualization with D3.js
// Enhanced interactive charts and scientific calculator

class AdvancedDataVisualization {
    constructor() {
        this.d3 = null;
        this.charts = {};
        this.calculator = null;
        this.init();
    }

    async init() {
        await this.loadD3();
        this.initCalculator();
        this.createInteractiveCharts();
        this.setupEventListeners();
    }

    async loadD3() {
        return new Promise((resolve) => {
            if (typeof d3 !== 'undefined') {
                this.d3 = d3;
                resolve();
            } else {
                const script = document.createElement('script');
                script.src = 'https://d3js.org/d3.v7.min.js';
                script.onload = () => {
                    this.d3 = d3;
                    resolve();
                };
                document.head.appendChild(script);
            }
        });
    }

    initCalculator() {
        this.calculator = new ScientificCalculator();
    }

    createInteractiveCharts() {
        this.createOrbitalVisualization();
        this.create3DScatterPlot();
        this.createInteractiveTimeline();
        this.createComparisonTool();
    }

    // 3D Orbital Visualization
    createOrbitalVisualization() {
        const container = document.getElementById('orbitalViz');
        if (!container || !this.d3) return;

        const width = container.clientWidth;
        const height = 400;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };

        const svg = this.d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Orbital data
        const orbitalData = [
            { planet: 'Mercury', distance: 57.9, period: 88, eccentricity: 0.205 },
            { planet: 'Venus', distance: 108.2, period: 225, eccentricity: 0.007 },
            { planet: 'Earth', distance: 149.6, period: 365, eccentricity: 0.017 },
            { planet: 'Mars', distance: 227.9, period: 687, eccentricity: 0.093 },
            { planet: 'Jupiter', distance: 778.5, period: 4333, eccentricity: 0.048 },
            { planet: 'Saturn', distance: 1434, period: 10759, eccentricity: 0.054 },
            { planet: 'Uranus', distance: 2871, period: 30687, eccentricity: 0.047 },
            { planet: 'Neptune', distance: 4495, period: 60190, eccentricity: 0.009 }
        ];

        // Scales
        const xScale = this.d3.scaleLinear()
            .domain([0, this.d3.max(orbitalData, d => d.distance)])
            .range([margin.left, width - margin.right]);

        const yScale = this.d3.scaleLinear()
            .domain([0, this.d3.max(orbitalData, d => d.period)])
            .range([height - margin.bottom, margin.top]);

        const radiusScale = this.d3.scaleLinear()
            .domain([0, this.d3.max(orbitalData, d => d.eccentricity)])
            .range([3, 15]);

        // Axes
        const xAxis = this.d3.axisBottom(xScale);
        const yAxis = this.d3.axisLeft(yScale);

        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(xAxis);

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(yAxis);

        // Add axis labels
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height - 5)
            .style('text-anchor', 'middle')
            .style('fill', '#fff')
            .text('Distance from Sun (million km)');

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', 15)
            .style('text-anchor', 'middle')
            .style('fill', '#fff')
            .text('Orbital Period (days)');

        // Add data points
        const points = svg.selectAll('.planet-point')
            .data(orbitalData)
            .enter()
            .append('g')
            .attr('class', 'planet-point');

        points.append('circle')
            .attr('cx', d => xScale(d.distance))
            .attr('cy', d => yScale(d.period))
            .attr('r', d => radiusScale(d.eccentricity))
            .style('fill', (d, i) => this.getPlanetColor(d.planet))
            .style('stroke', '#fff')
            .style('stroke-width', 2)
            .style('opacity', 0.8)
            .on('mouseover', this.handlePointHover)
            .on('mouseout', this.handlePointOut);

        // Add planet labels
        points.append('text')
            .attr('x', d => xScale(d.distance))
            .attr('y', d => yScale(d.period) - 20)
            .style('text-anchor', 'middle')
            .style('fill', '#fff')
            .style('font-size', '10px')
            .text(d => d.planet);

        this.charts.orbital = { svg, data: orbitalData };
    }

    // 3D Scatter Plot
    create3DScatterPlot() {
        const container = document.getElementById('scatter3D');
        if (!container || !this.d3) return;

        const width = container.clientWidth;
        const height = 400;

        const svg = this.d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // 3D data (simulated)
        const scatterData = [
            { x: 57.9, y: 0.055, z: 4879, planet: 'Mercury' },
            { x: 108.2, y: 0.815, z: 12104, planet: 'Venus' },
            { x: 149.6, y: 1, z: 12742, planet: 'Earth' },
            { x: 227.9, y: 0.107, z: 6779, planet: 'Mars' },
            { x: 778.5, y: 317.8, z: 139822, planet: 'Jupiter' },
            { x: 1434, y: 95.2, z: 116464, planet: 'Saturn' },
            { x: 2871, y: 14.5, z: 50724, planet: 'Uranus' },
            { x: 4495, y: 17.1, z: 49244, planet: 'Neptune' }
        ];

        // Scales
        const xScale = this.d3.scaleLinear()
            .domain([0, this.d3.max(scatterData, d => d.x)])
            .range([50, width - 50]);

        const yScale = this.d3.scaleLinear()
            .domain([0, this.d3.max(scatterData, d => d.y)])
            .range([height - 50, 50]);

        const radiusScale = this.d3.scaleLinear()
            .domain([0, this.d3.max(scatterData, d => d.z)])
            .range([5, 25]);

        // Add points
        svg.selectAll('.scatter-point')
            .data(scatterData)
            .enter()
            .append('circle')
            .attr('class', 'scatter-point')
            .attr('cx', d => xScale(d.x))
            .attr('cy', d => yScale(d.y))
            .attr('r', d => radiusScale(d.z))
            .style('fill', d => this.getPlanetColor(d.planet))
            .style('stroke', '#fff')
            .style('stroke-width', 2)
            .style('opacity', 0.7)
            .on('mouseover', this.handleScatterHover)
            .on('mouseout', this.handleScatterOut);

        this.charts.scatter3D = { svg, data: scatterData };
    }

    // Interactive Timeline
    createInteractiveTimeline() {
        const container = document.getElementById('timeline');
        if (!container || !this.d3) return;

        const width = container.clientWidth;
        const height = 200;

        const svg = this.d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Timeline data
        const timelineData = [
            { year: -4600000000, event: 'Solar System Formation', category: 'formation' },
            { year: -4500000000, event: 'Earth Formation', category: 'planets' },
            { year: -4000000000, event: 'First Life', category: 'life' },
            { year: -3500000000, event: 'Photosynthesis', category: 'life' },
            { year: -2500000000, event: 'Oxygen Atmosphere', category: 'atmosphere' },
            { year: -600000000, event: 'Complex Life', category: 'life' },
            { year: -200000000, event: 'Dinosaurs', category: 'life' },
            { year: -65000000, event: 'Dinosaur Extinction', category: 'extinction' },
            { year: -2000000, event: 'Early Humans', category: 'humans' },
            { year: 0, event: 'Present Day', category: 'present' }
        ];

        // Scale
        const timeScale = this.d3.scaleLinear()
            .domain([-4600000000, 0])
            .range([50, width - 50]);

        // Add timeline line
        svg.append('line')
            .attr('x1', 50)
            .attr('y1', height / 2)
            .attr('x2', width - 50)
            .attr('y2', height / 2)
            .style('stroke', '#ffd700')
            .style('stroke-width', 3);

        // Add events
        const events = svg.selectAll('.timeline-event')
            .data(timelineData)
            .enter()
            .append('g')
            .attr('class', 'timeline-event');

        events.append('circle')
            .attr('cx', d => timeScale(d.year))
            .attr('cy', height / 2)
            .attr('r', 6)
            .style('fill', d => this.getEventColor(d.category))
            .style('stroke', '#fff')
            .style('stroke-width', 2)
            .on('mouseover', this.handleTimelineHover)
            .on('mouseout', this.handleTimelineOut);

        events.append('text')
            .attr('x', d => timeScale(d.year))
            .attr('y', d => d.year < -2000000000 ? height / 2 - 20 : height / 2 + 20)
            .style('text-anchor', 'middle')
            .style('fill', '#fff')
            .style('font-size', '10px')
            .text(d => d.event);

        this.charts.timeline = { svg, data: timelineData };
    }

    // Comparison Tool
    createComparisonTool() {
        const container = document.getElementById('comparisonTool');
        if (!container) return;

        const comparisonHTML = `
            <div class="comparison-controls">
                <h3>Planet Comparison Tool</h3>
                <div class="comparison-selectors">
                    <select id="planet1" class="planet-select">
                        <option value="">Select Planet 1</option>
                        <option value="Mercury">Mercury</option>
                        <option value="Venus">Venus</option>
                        <option value="Earth">Earth</option>
                        <option value="Mars">Mars</option>
                        <option value="Jupiter">Jupiter</option>
                        <option value="Saturn">Saturn</option>
                        <option value="Uranus">Uranus</option>
                        <option value="Neptune">Neptune</option>
                    </select>
                    <select id="planet2" class="planet-select">
                        <option value="">Select Planet 2</option>
                        <option value="Mercury">Mercury</option>
                        <option value="Venus">Venus</option>
                        <option value="Earth">Earth</option>
                        <option value="Mars">Mars</option>
                        <option value="Jupiter">Jupiter</option>
                        <option value="Saturn">Saturn</option>
                        <option value="Uranus">Uranus</option>
                        <option value="Neptune">Neptune</option>
                    </select>
                </div>
                <button id="compareBtn" class="compare-btn">Compare Planets</button>
            </div>
            <div id="comparisonResults" class="comparison-results"></div>
        `;

        container.innerHTML = comparisonHTML;
        this.setupComparisonEvents();
    }

    setupComparisonEvents() {
        const compareBtn = document.getElementById('compareBtn');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => {
                this.performComparison();
            });
        }
    }

    performComparison() {
        const planet1 = document.getElementById('planet1').value;
        const planet2 = document.getElementById('planet2').value;
        const resultsDiv = document.getElementById('comparisonResults');

        if (!planet1 || !planet2) {
            resultsDiv.innerHTML = '<p class="error">Please select two planets to compare.</p>';
            return;
        }

        const comparisonData = this.getComparisonData(planet1, planet2);
        const comparisonHTML = this.generateComparisonHTML(comparisonData);
        resultsDiv.innerHTML = comparisonHTML;
    }

    getComparisonData(planet1, planet2) {
        const planetData = {
            Mercury: { diameter: 4879, mass: 0.055, distance: 57.9, moons: 0, temperature: 167 },
            Venus: { diameter: 12104, mass: 0.815, distance: 108.2, moons: 0, temperature: 462 },
            Earth: { diameter: 12742, mass: 1, distance: 149.6, moons: 1, temperature: 15 },
            Mars: { diameter: 6779, mass: 0.107, distance: 227.9, moons: 2, temperature: -63 },
            Jupiter: { diameter: 139822, mass: 317.8, distance: 778.5, moons: 95, temperature: -110 },
            Saturn: { diameter: 116464, mass: 95.2, distance: 1434, moons: 146, temperature: -140 },
            Uranus: { diameter: 50724, mass: 14.5, distance: 2871, moons: 27, temperature: -195 },
            Neptune: { diameter: 49244, mass: 17.1, distance: 4495, moons: 16, temperature: -200 }
        };

        return {
            planet1: { name: planet1, ...planetData[planet1] },
            planet2: { name: planet2, ...planetData[planet2] }
        };
    }

    generateComparisonHTML(data) {
        const { planet1, planet2 } = data;
        
        return `
            <div class="comparison-table">
                <h4>${planet1.name} vs ${planet2.name}</h4>
                <table>
                    <tr>
                        <th>Property</th>
                        <th>${planet1.name}</th>
                        <th>${planet2.name}</th>
                        <th>Ratio</th>
                    </tr>
                    <tr>
                        <td>Diameter (km)</td>
                        <td>${planet1.diameter.toLocaleString()}</td>
                        <td>${planet2.diameter.toLocaleString()}</td>
                        <td>${(planet1.diameter / planet2.diameter).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Mass (Earth masses)</td>
                        <td>${planet1.mass}</td>
                        <td>${planet2.mass}</td>
                        <td>${(planet1.mass / planet2.mass).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Distance from Sun (million km)</td>
                        <td>${planet1.distance}</td>
                        <td>${planet2.distance}</td>
                        <td>${(planet1.distance / planet2.distance).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Number of Moons</td>
                        <td>${planet1.moons}</td>
                        <td>${planet2.moons}</td>
                        <td>${planet2.moons > 0 ? (planet1.moons / planet2.moons).toFixed(2) : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Average Temperature (°C)</td>
                        <td>${planet1.temperature}</td>
                        <td>${planet2.temperature}</td>
                        <td>${(planet1.temperature / planet2.temperature).toFixed(2)}</td>
                    </tr>
                </table>
            </div>
        `;
    }

    // Event handlers
    handlePointHover(event, d) {
        this.d3.select(event.target)
            .style('opacity', 1)
            .attr('r', d => this.d3.select(event.target).attr('r') * 1.5);
    }

    handlePointOut(event, d) {
        this.d3.select(event.target)
            .style('opacity', 0.8)
            .attr('r', d => this.d3.select(event.target).attr('r') / 1.5);
    }

    handleScatterHover(event, d) {
        this.d3.select(event.target)
            .style('opacity', 1)
            .attr('r', d => this.d3.select(event.target).attr('r') * 1.2);
    }

    handleScatterOut(event, d) {
        this.d3.select(event.target)
            .style('opacity', 0.7)
            .attr('r', d => this.d3.select(event.target).attr('r') / 1.2);
    }

    handleTimelineHover(event, d) {
        this.d3.select(event.target)
            .attr('r', 8);
    }

    handleTimelineOut(event, d) {
        this.d3.select(event.target)
            .attr('r', 6);
    }

    // Utility methods
    getPlanetColor(planet) {
        const colors = {
            'Mercury': '#8C8C8C',
            'Venus': '#FFA500',
            'Earth': '#4CAF50',
            'Mars': '#FF4444',
            'Jupiter': '#FFB347',
            'Saturn': '#F4A460',
            'Uranus': '#40E0D0',
            'Neptune': '#4169E1'
        };
        return colors[planet] || '#ccc';
    }

    getEventColor(category) {
        const colors = {
            'formation': '#ffd700',
            'planets': '#4CAF50',
            'life': '#2196F3',
            'atmosphere': '#FF9800',
            'extinction': '#f44336',
            'humans': '#9C27B0',
            'present': '#E91E63'
        };
        return colors[category] || '#ccc';
    }

    setupEventListeners() {
        // Add any additional event listeners here
    }
}

// Scientific Calculator Class
class ScientificCalculator {
    constructor() {
        this.init();
    }

    init() {
        this.createCalculator();
        this.setupCalculatorEvents();
    }

    createCalculator() {
        const container = document.getElementById('scientificCalculator');
        if (!container) return;

        const calculatorHTML = `
            <div class="calculator-container">
                <h3>Scientific Calculator</h3>
                <div class="calculator-display">
                    <input type="text" id="calcDisplay" readonly>
                </div>
                <div class="calculator-buttons">
                    <button class="calc-btn" data-action="clear">C</button>
                    <button class="calc-btn" data-action="backspace">⌫</button>
                    <button class="calc-btn" data-action="operator">÷</button>
                    <button class="calc-btn" data-action="operator">×</button>
                    
                    <button class="calc-btn" data-action="number">7</button>
                    <button class="calc-btn" data-action="number">8</button>
                    <button class="calc-btn" data-action="number">9</button>
                    <button class="calc-btn" data-action="operator">-</button>
                    
                    <button class="calc-btn" data-action="number">4</button>
                    <button class="calc-btn" data-action="number">5</button>
                    <button class="calc-btn" data-action="number">6</button>
                    <button class="calc-btn" data-action="operator">+</button>
                    
                    <button class="calc-btn" data-action="number">1</button>
                    <button class="calc-btn" data-action="number">2</button>
                    <button class="calc-btn" data-action="number">3</button>
                    <button class="calc-btn" data-action="equals">=</button>
                    
                    <button class="calc-btn" data-action="number">0</button>
                    <button class="calc-btn" data-action="decimal">.</button>
                    <button class="calc-btn" data-action="scientific">sin</button>
                    <button class="calc-btn" data-action="scientific">cos</button>
                    
                    <button class="calc-btn" data-action="scientific">tan</button>
                    <button class="calc-btn" data-action="scientific">log</button>
                    <button class="calc-btn" data-action="scientific">√</button>
                    <button class="calc-btn" data-action="scientific">x²</button>
                </div>
            </div>
        `;

        container.innerHTML = calculatorHTML;
    }

    setupCalculatorEvents() {
        const buttons = document.querySelectorAll('.calc-btn');
        const display = document.getElementById('calcDisplay');
        let currentInput = '';
        let previousInput = '';
        let operation = null;

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                const value = button.textContent;

                switch (action) {
                    case 'number':
                        currentInput += value;
                        break;
                    case 'operator':
                        if (currentInput !== '') {
                            previousInput = currentInput;
                            currentInput = '';
                            operation = value;
                        }
                        break;
                    case 'equals':
                        if (previousInput !== '' && currentInput !== '' && operation) {
                            currentInput = this.calculate(previousInput, currentInput, operation);
                            operation = null;
                            previousInput = '';
                        }
                        break;
                    case 'clear':
                        currentInput = '';
                        previousInput = '';
                        operation = null;
                        break;
                    case 'backspace':
                        currentInput = currentInput.slice(0, -1);
                        break;
                    case 'decimal':
                        if (!currentInput.includes('.')) {
                            currentInput += '.';
                        }
                        break;
                    case 'scientific':
                        currentInput = this.scientificFunction(currentInput, value);
                        break;
                }

                display.value = currentInput || '0';
            });
        });
    }

    calculate(a, b, operation) {
        const numA = parseFloat(a);
        const numB = parseFloat(b);

        switch (operation) {
            case '+': return (numA + numB).toString();
            case '-': return (numA - numB).toString();
            case '×': return (numA * numB).toString();
            case '÷': return (numB !== 0 ? numA / numB : 'Error').toString();
            default: return b;
        }
    }

    scientificFunction(input, functionName) {
        const num = parseFloat(input);
        if (isNaN(num)) return 'Error';

        switch (functionName) {
            case 'sin': return Math.sin(num * Math.PI / 180).toString();
            case 'cos': return Math.cos(num * Math.PI / 180).toString();
            case 'tan': return Math.tan(num * Math.PI / 180).toString();
            case 'log': return Math.log10(num).toString();
            case '√': return Math.sqrt(num).toString();
            case 'x²': return (num * num).toString();
            default: return input;
        }
    }
}

// Initialize advanced visualization
document.addEventListener('DOMContentLoaded', () => {
    window.advancedViz = new AdvancedDataVisualization();
}); 