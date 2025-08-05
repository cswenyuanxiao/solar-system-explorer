// Chart Interactions for Solar System Data Visualization

class ChartInteractions {
    constructor() {
        this.currentChart = 'size';
        this.init();
    }

    init() {
        this.setupChartNavigation();
        this.setupChartAnimations();
        this.setupResponsiveCharts();
    }

    setupChartNavigation() {
        const navButtons = document.querySelectorAll('.chart-nav-btn');
        const chartSections = document.querySelectorAll('.chart-section');

        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const chartType = button.getAttribute('data-chart');
                this.switchChart(chartType);
            });
        });
    }

    switchChart(chartType) {
        // Update navigation buttons
        document.querySelectorAll('.chart-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-chart="${chartType}"]`).classList.add('active');

        // Update chart sections
        document.querySelectorAll('.chart-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${chartType}Section`).classList.add('active');

        // Update current chart
        this.currentChart = chartType;

        // Trigger chart resize for better rendering
        setTimeout(() => {
            if (window.solarSystemCharts && window.solarSystemCharts.charts[chartType]) {
                window.solarSystemCharts.charts[chartType].resize();
            }
        }, 300);
    }

    setupChartAnimations() {
        // Add entrance animations for chart sections
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe chart sections
        document.querySelectorAll('.chart-section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(section);
        });
    }

    setupResponsiveCharts() {
        // Handle window resize for charts
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resizeAllCharts();
            }, 250);
        });
    }

    resizeAllCharts() {
        if (window.solarSystemCharts) {
            Object.values(window.solarSystemCharts.charts).forEach(chart => {
                if (chart && typeof chart.resize === 'function') {
                    chart.resize();
                }
            });
        }
    }

    // Add interactive features
    addChartInteractivity() {
        // Add hover effects to chart elements
        const chartWrappers = document.querySelectorAll('.chart-wrapper');
        
        chartWrappers.forEach(wrapper => {
            wrapper.addEventListener('mouseenter', () => {
                wrapper.style.transform = 'scale(1.02)';
                wrapper.style.transition = 'transform 0.3s ease';
            });

            wrapper.addEventListener('mouseleave', () => {
                wrapper.style.transform = 'scale(1)';
            });
        });
    }

    // Add data highlighting
    highlightDataPoint(planetName) {
        if (window.solarSystemCharts) {
            Object.values(window.solarSystemCharts.charts).forEach(chart => {
                if (chart && chart.data && chart.data.labels) {
                    const index = chart.data.labels.indexOf(planetName);
                    if (index !== -1) {
                        // Highlight the data point
                        chart.setActiveElements([{
                            datasetIndex: 0,
                            index: index
                        }]);
                        chart.update();
                    }
                }
            });
        }
    }

    // Reset chart highlighting
    resetChartHighlighting() {
        if (window.solarSystemCharts) {
            Object.values(window.solarSystemCharts.charts).forEach(chart => {
                if (chart) {
                    chart.setActiveElements([]);
                    chart.update();
                }
            });
        }
    }

    // Add keyboard navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const navButtons = document.querySelectorAll('.chart-nav-btn');
            const currentIndex = Array.from(navButtons).findIndex(btn => 
                btn.classList.contains('active')
            );

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    const prevIndex = (currentIndex - 1 + navButtons.length) % navButtons.length;
                    navButtons[prevIndex].click();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % navButtons.length;
                    navButtons[nextIndex].click();
                    break;
                case 'Enter':
                case ' ':
                    if (document.activeElement.classList.contains('chart-nav-btn')) {
                        e.preventDefault();
                        document.activeElement.click();
                    }
                    break;
            }
        });
    }

    // Add accessibility features
    setupAccessibility() {
        // Add ARIA labels
        const navButtons = document.querySelectorAll('.chart-nav-btn');
        navButtons.forEach((button, index) => {
            button.setAttribute('aria-label', `View ${button.textContent} chart`);
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-selected', button.classList.contains('active'));
        });

        // Add focus management
        navButtons.forEach(button => {
            button.addEventListener('focus', () => {
                button.setAttribute('aria-selected', 'true');
            });
            button.addEventListener('blur', () => {
                button.setAttribute('aria-selected', 'false');
            });
        });
    }

    // Add chart export functionality
    setupChartExport() {
        const exportButton = document.createElement('button');
        exportButton.textContent = '📊 Export Charts';
        exportButton.className = 'action-button';
        exportButton.style.marginTop = '1rem';
        
        exportButton.addEventListener('click', () => {
            this.exportCharts();
        });

        // Add to header actions
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            headerActions.appendChild(exportButton);
        }
    }

    exportCharts() {
        if (window.solarSystemCharts && window.solarSystemCharts.charts[this.currentChart]) {
            const chart = window.solarSystemCharts.charts[this.currentChart];
            const canvas = chart.canvas;
            
            // Create download link
            const link = document.createElement('a');
            link.download = `${this.currentChart}-chart.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    }

    // Initialize all features
    setupAllFeatures() {
        this.addChartInteractivity();
        this.setupKeyboardNavigation();
        this.setupAccessibility();
        this.setupChartExport();
    }
}

// Initialize chart interactions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chartInteractions = new ChartInteractions();
    
    // Setup all features after charts are loaded
    setTimeout(() => {
        if (window.chartInteractions) {
            window.chartInteractions.setupAllFeatures();
        }
    }, 1000);
}); 