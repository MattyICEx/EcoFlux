window.onload = async () => {
    Wized.data.listen('v.Core_Inflation_Observations', async () => {
        let observationsInflation = await Wized.data.get('v.Core_Inflation_Observations');
        let observationsUnemployment = await Wized.data.get('v.unemployment_rate_observations');
        let observationsFedFundsRate = await Wized.data.get('v.federal_funds_rate_observations');
        let dates = await Wized.data.get('v.dates');

        // Truncate leading zeros
        let y = observationsInflation.findIndex(obs => obs !== 0);
        if (y === -1) y = observationsInflation.length;
        observationsInflation = observationsInflation.slice(y);
        observationsUnemployment = observationsUnemployment.slice(y);
        observationsFedFundsRate = observationsFedFundsRate.slice(y);
        dates = dates.slice(y); // Remove corresponding dates

        // Parse the dates from "YYYY-MM-DD" format and convert them to "MM/YYYY" format using Moment.js
        dates = dates.map(dateStr => moment(dateStr).format('MM/YYYY'));

        const lineCtx = document.getElementById('lineChart');
        const unemploymentCtx = document.getElementById('unemploymentChart');
        const fedFundsRateCtx = document.getElementById('federalFundsRateChart');

        createLineChart(lineCtx, dates, observationsInflation, 'Core Inflation', '#5c76df', 'rgba(92, 118, 223, 0.2)');
        createLineChart(unemploymentCtx, dates, observationsUnemployment, 'Unemployment Rate', '#5c76df', 'rgba(92, 118, 223, 0.2)');
        createLineChart(fedFundsRateCtx, dates, observationsFedFundsRate, 'Federal Funds Rate', '#5c76df', 'rgba(92, 118, 223, 0.2)');

        // Function to create the line chart
        function createLineChart(lineCtx, dates, observations, chartTitle, lineColor, backgroundColor) {
            const myChart = new Chart(lineCtx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: chartTitle,
                        data: observations,
                        fill: true,
                        pointRadius: 0,
                        borderWidth: 2,
                        borderColor: lineColor,
                        backgroundColor: backgroundColor,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: chartTitle,
                            color: 'White',
                            font: {
                                size: 18
                            }
                        },
                        legend: {
                            display: false
                        },
                        zoom: {
                            pan: {
                                enabled: true,
                                mode: 'x',
                            },
                            zoom: {
                                wheel: {
                                    enabled: true,
                                },
                                pinch: {
                                    enabled: true,
                                },
                                mode: 'x',
                                limits: {
                                    x: { min: 'original', max: 'original' },
                                },
                            }
                        },
                        tooltip: {
                            enabled: true,
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function (context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += context.parsed.y;
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    hover: {
                        mode: 'index',
                        intersect: false
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: "#93afc5",
                                autoSkip: false,
                                maxRotation: 0,
                                minRotation: 0,
                                padding: 10,
                                callback: function (value, index, values) {
                                    var x = 5; // Modify this to change the label interval
                                    var interval = Math.ceil(values.length / x);
                                    if (index === 0 || index === values.length - 1 || index % interval === 0) {
                                        return dates[value];
                                    }
                                }
                            },
                            grid: {
                                color: "rgba(92, 118, 223, 0.2)"
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: "#93afc5",
                                callback: function (value) {
                                    return value.toFixed(0) + '%';
                                }
                            },
                            grid: {
                                color: "rgba(92, 118, 223, 0.2)"
                            }
                        }
                    }
                }
            });

            return myChart;
        }

    });
}
