// Chart.js Integration for Solar System Data Visualization

// Planet data for charts
const planetData = {
    sizes: {
        labels: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
        diameters: [4879, 12104, 12742, 6779, 139822, 116464, 50724, 49244], // km
        masses: [0.055, 0.815, 1, 0.107, 317.8, 95.2, 14.5, 17.1] // Earth masses
    },
    distances: {
        labels: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
        values: [57.9, 108.2, 149.6, 227.9, 778.5, 1434, 2871, 4495] // million km
    },
    temperatures: {
        labels: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
        min: [-173, 462, -88, -140, -110, -140, -195, -200], // Celsius
        max: [427, 462, 58, 20, -110, -140, -195, -200]
    },
    moons: {
        labels: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
        values: [0, 0, 1, 2, 95, 146, 27, 16]
    }
};

// Chart configuration
const chartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: '#fff',
                font: {
                    size: 12
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#ffd700',
            borderWidth: 1
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#fff',
                font: {
                    size: 10
                }
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            }
        },
        y: {
            ticks: {
                color: '#fff',
                font: {
                    size: 10
                }
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            }
        }
    }
};

class SolarSystemCharts {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        // Wait for Chart.js to be loaded
        if (typeof Chart !== 'undefined') {
            this.createCharts();
        } else {
            // Load Chart.js dynamically
            this.loadChartJS();
        }
    }

    loadChartJS() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => {
            this.createCharts();
        };
        document.head.appendChild(script);
    }

    createCharts() {
        this.createSizeComparisonChart();
        this.createDistanceChart();
        this.createTemperatureChart();
        this.createMoonsChart();
    }

    createSizeComparisonChart() {
        const ctx = document.getElementById('sizeChart');
        if (!ctx) return;

        this.charts.size = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: planetData.sizes.labels,
                datasets: [{
                    label: 'Diameter (km)',
                    data: planetData.sizes.diameters,
                    backgroundColor: [
                        '#8C8C8C', '#FFA500', '#4CAF50', '#FF4444',
                        '#FFB347', '#F4A460', '#40E0D0', '#4169E1'
                    ],
                    borderColor: '#fff',
                    borderWidth: 1
                }]
            },
            options: {
                ...chartConfig,
                plugins: {
                    ...chartConfig.plugins,
                    title: {
                        display: true,
                        text: 'Planet Diameters Comparison',
                        color: '#fff',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
    }

    createDistanceChart() {
        const ctx = document.getElementById('distanceChart');
        if (!ctx) return;

        this.charts.distance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: planetData.distances.labels,
                datasets: [{
                    label: 'Distance from Sun (million km)',
                    data: planetData.distances.values,
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                ...chartConfig,
                plugins: {
                    ...chartConfig.plugins,
                    title: {
                        display: true,
                        text: 'Distance from Sun',
                        color: '#fff',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
    }

    createTemperatureChart() {
        const ctx = document.getElementById('temperatureChart');
        if (!ctx) return;

        this.charts.temperature = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: planetData.temperatures.labels,
                datasets: [{
                    label: 'Average Temperature (°C)',
                    data: planetData.temperatures.max.map((max, i) => (max + planetData.temperatures.min[i]) / 2),
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: '#ff6b6b',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                ...chartConfig,
                plugins: {
                    ...chartConfig.plugins,
                    title: {
                        display: true,
                        text: 'Temperature Comparison',
                        color: '#fff',
                        font: {
                            size: 16
                        }
                    }
                },
                scales: {
                    r: {
                        ticks: {
                            color: '#fff',
                            font: {
                                size: 10
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: '#fff',
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }

    createMoonsChart() {
        const ctx = document.getElementById('moonsChart');
        if (!ctx) return;

        this.charts.moons = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: planetData.moons.labels,
                datasets: [{
                    data: planetData.moons.values,
                    backgroundColor: [
                        '#8C8C8C', '#FFA500', '#4CAF50', '#FF4444',
                        '#FFB347', '#F4A460', '#40E0D0', '#4169E1'
                    ],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                ...chartConfig,
                plugins: {
                    ...chartConfig.plugins,
                    title: {
                        display: true,
                        text: 'Number of Moons',
                        color: '#fff',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
    }

    // Update chart data
    updateChart(chartName, newData) {
        if (this.charts[chartName]) {
            this.charts[chartName].data.datasets[0].data = newData;
            this.charts[chartName].update();
        }
    }

    // Destroy all charts
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// Initialize charts when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.solarSystemCharts = new SolarSystemCharts();
}); 