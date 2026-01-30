// Charts Manager - Interactive Price Charts with Time Period Toggle
// Uses Chart.js for visualization

class ChartsManager {
    constructor() {
        this.charts = {};
        this.priceData = null;
        this.currentPeriod = '1Y';
    }

    /**
     * Create interactive price trend chart with time period buttons
     */
    createPriceTrendChart(containerId, priceData) {
        const container = document.getElementById(containerId);
        if (!container) return;

        this.priceData = priceData;

        // Check if we have any price data
        if (!priceData || (!priceData.oneYear && !priceData.threeYear && !priceData.fiveYear)) {
            container.innerHTML = `
                <div class="chart-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M3 3v18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M7 16l4-4 3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p>Historical price data not available</p>
                </div>
            `;
            return;
        }

        // Create chart container with buttons
        container.innerHTML = `
            <div class="chart-header">
                <h4>Historical Price Performance</h4>
                <div class="period-buttons">
                    <button class="period-btn ${this.currentPeriod === '1Y' ? 'active' : ''}" data-period="1Y">1Y</button>
                    <button class="period-btn ${this.currentPeriod === '3Y' ? 'active' : ''}" data-period="3Y">3Y</button>
                    <button class="period-btn ${this.currentPeriod === '5Y' ? 'active' : ''}" data-period="5Y">5Y</button>
                </div>
            </div>
            <div class="chart-stats" id="chartStats"></div>
            <canvas id="priceChart"></canvas>
        `;

        // Add button event listeners
        container.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchPeriod(e.target.dataset.period, container);
            });
        });

        // Render initial chart
        this.renderChart(this.currentPeriod);
    }

    /**
     * Switch time period
     */
    switchPeriod(period, container) {
        this.currentPeriod = period;

        // Update button states
        container.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.period === period);
        });

        // Re-render chart
        this.renderChart(period);
    }

    /**
     * Render chart for specific period
     */
    renderChart(period) {
        const periodMap = {
            '1Y': 'oneYear',
            '3Y': 'threeYear',
            '5Y': 'fiveYear'
        };

        const periodData = this.priceData[periodMap[period]];

        // Update stats
        const statsEl = document.getElementById('chartStats');
        if (statsEl && periodData) {
            const changeClass = parseFloat(periodData.change) >= 0 ? 'positive' : 'negative';
            const changeIcon = parseFloat(periodData.change) >= 0 ? '↑' : '↓';
            statsEl.innerHTML = `
                <div class="stat-item">
                    <span class="stat-label">Start</span>
                    <span class="stat-value">$${periodData.startPrice}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Current</span>
                    <span class="stat-value">$${periodData.endPrice}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Change</span>
                    <span class="stat-value ${changeClass}">${changeIcon} ${periodData.change}%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Max Drawdown</span>
                    <span class="stat-value negative">${periodData.maxDrawdown}%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Volatility</span>
                    <span class="stat-value">${periodData.volatility}%</span>
                </div>
            `;
        } else if (statsEl) {
            statsEl.innerHTML = '<p class="no-data">Data not available for this period</p>';
        }

        // Generate synthetic chart data if we have period data
        if (periodData) {
            this.drawLineChart(periodData, period);
        } else {
            // Destroy existing chart if no data
            if (this.charts.priceChart) {
                this.charts.priceChart.destroy();
                this.charts.priceChart = null;
            }
        }
    }

    /**
     * Draw line chart using Chart.js
     */
    drawLineChart(periodData, period) {
        const canvas = document.getElementById('priceChart');
        if (!canvas) return;

        // Destroy existing chart
        if (this.charts.priceChart) {
            this.charts.priceChart.destroy();
        }

        // Generate synthetic data points for visualization
        const dataPoints = this.generateChartData(periodData, period);

        const ctx = canvas.getContext('2d');
        const isPositive = parseFloat(periodData.change) >= 0;
        const lineColor = isPositive ? '#03B97C' : '#FF6B6B';
        const gradientColor = isPositive ? 'rgba(3, 185, 124, 0.1)' : 'rgba(255, 107, 107, 0.1)';

        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, gradientColor);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        this.charts.priceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dataPoints.labels,
                datasets: [{
                    label: 'Price',
                    data: dataPoints.prices,
                    borderColor: lineColor,
                    backgroundColor: gradient,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: lineColor,
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(44, 62, 80, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function (context) {
                                return `$${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#95A5A6',
                            maxTicksLimit: 6
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(224, 230, 237, 0.5)'
                        },
                        ticks: {
                            color: '#95A5A6',
                            callback: function (value) {
                                return '$' + value.toFixed(0);
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Generate synthetic chart data from period summary
     */
    generateChartData(periodData, period) {
        const startPrice = parseFloat(periodData.startPrice);
        const endPrice = parseFloat(periodData.endPrice);
        const volatility = parseFloat(periodData.volatility) / 100;

        const pointsMap = { '1Y': 12, '3Y': 36, '5Y': 60 };
        const numPoints = pointsMap[period];

        const labels = [];
        const prices = [];
        const now = new Date();

        for (let i = 0; i < numPoints; i++) {
            // Calculate date label
            const monthsAgo = numPoints - i - 1;
            const date = new Date(now);
            date.setMonth(date.getMonth() - monthsAgo);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));

            // Calculate price with some realistic variance
            const progress = i / (numPoints - 1);
            const basePrice = startPrice + (endPrice - startPrice) * progress;

            // Add some randomness based on volatility
            const noise = (Math.random() - 0.5) * volatility * startPrice * 0.5;
            const price = i === 0 ? startPrice : (i === numPoints - 1 ? endPrice : basePrice + noise);
            prices.push(Math.max(price, 0.01));
        }

        return { labels, prices };
    }

    /**
     * Initialize revenue segment chart
     */
    createSegmentChart(containerId, segments) {
        const container = document.getElementById(containerId);
        if (!container || !segments || segments.length === 0) {
            if (container) {
                container.innerHTML = `
                    <div class="chart-placeholder">
                        <p>Segment data not available</p>
                    </div>
                `;
            }
            return;
        }

        // Parse segment data (assumes format like "Segment Name: XX%")
        const labels = [];
        const values = [];

        segments.forEach(segment => {
            const parts = segment.split(':');
            if (parts.length === 2) {
                labels.push(parts[0].trim());
                const value = parseFloat(parts[1].replace('%', '').trim());
                values.push(value);
            }
        });

        if (labels.length === 0) {
            container.innerHTML = `
                <div class="chart-placeholder">
                    <p>Segment breakdown not disclosed</p>
                </div>
            `;
            return;
        }

        // Create simple visual representation
        container.innerHTML = `
            <div style="padding: 1rem;">
                <h4 style="margin-bottom: 1rem; color: var(--color-text-primary);">Revenue Segments</h4>
                ${labels.map((label, i) => `
                    <div style="margin-bottom: 0.5rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                            <span style="font-size: 0.875rem; color: var(--color-text-secondary);">${label}</span>
                            <span style="font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary);">${values[i]}%</span>
                        </div>
                        <div style="height: 6px; background: var(--color-border); border-radius: 3px; overflow: hidden;">
                            <div style="height: 100%; width: ${values[i]}%; background: var(--color-primary);"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Destroy all charts
     */
    destroyAll() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.destroy) {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}
