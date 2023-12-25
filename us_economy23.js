window.onload = async () => {
    Wized.data.listen('v.Core_Inflation_Observations', async () => {

        // Fetch data from Wized.data.get() and return an object with the data
        const dataKeys = ['Core_Inflation_Observations', 'unemployment_rate_observations', 'federal_funds_rate_observations', 'dates'];

        // Function to fetch data from Wized.data.get() and return an object with the data
        async function fetchDataFromKeys(dataKeys) {
            let retrievedData = {};

            try {
                for (const key of dataKeys) {
                    retrievedData[key] = await Wized.data.get(`v.${key}`);
                }

                // Find the index of the first non-zero observation in one of the arrays
                // Assuming 'Core_Inflation_Observations' is always present and is the reference
                let startIndex = retrievedData['Core_Inflation_Observations'].findIndex(obs => obs !== 0);
                if (startIndex === -1) {
                    startIndex = retrievedData['Core_Inflation_Observations'].length;
                }

                // Truncate all arrays from the startIndex
                for (const key of dataKeys) {
                    retrievedData[key] = retrievedData[key].slice(startIndex);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                return null;
            }

            return retrievedData;
        }

        // Initialize combinedData
        let combinedData = await fetchDataFromKeys(dataKeys);
        // Initialize combinedData with the data from Wized

        // Parse the dates from "YYYY-MM-DD" format and convert them to "MM/YYYY" format using Moment.js
        combinedData['dates'] = combinedData['dates'].map(dateStr => moment(dateStr).format('MM/YYYY'));

        const lineCtx = document.getElementById('lineChart');
        const unemploymentCtx = document.getElementById('unemploymentChart');
        const fedFundsRateCtx = document.getElementById('federalFundsRateChart');

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
                            color: 'white',
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

        let line1 = createLineChart(lineCtx, combinedData['dates'], combinedData['Core_Inflation_Observations'], 'Core Inflation', '#5c76df', 'rgba(92, 118, 223, 0.2)');
        //let line2 = createLineChart(unemploymentCtx, combinedData['dates'], combinedData['unemployment_rate_observations'], 'Unemployment Rate', '#5c76df', 'rgba(92, 118, 223, 0.2)');
        let line3 = createLineChart(fedFundsRateCtx, combinedData['dates'], combinedData['federal_funds_rate_observations'], 'Federal Funds Rate', '#5c76df', 'rgba(92, 118, 223, 0.2)');
        
        noUiSlider.create(document.getElementById('zoomSlider'), {
            start: [0, 100], // Starting handles positions (in percentage)
            connect: true, // Display a colored bar between the handles
            range: {
                'min': 0,
                'max': 100
            },
            margin: 10 // This is the important part: minimum distance between the handles
        });
        const slider = document.getElementById('zoomSlider');

        slider.noUiSlider.on('update', function (values, handle) {
            updateChartZoom(line1, values[0], values[1]);
            //updateChartZoom(line2, values[0], values[1]);
            updateChartZoom(line3, values[0], values[1]);
        });

    });
}

function updateChartZoom(chart, minZoom, maxZoom) {
    const allDates = chart.data.labels;
    const totalDates = allDates.length;

    const startIndex = Math.floor(totalDates * (minZoom / 100));
    const endIndex = Math.floor(totalDates * (maxZoom / 100));

    const scale = chart.scales.x;
    scale.options.min = allDates[startIndex];
    scale.options.max = allDates[endIndex];

    chart.update();
}


