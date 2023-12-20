window.onload = async () => {
    Wized.data.listen('v.Core_Inflation_Observations', async () => {
        let observationsInflation = await Wized.data.get('v.Core_Inflation_Observations');
        let observationsUnemployment = await Wized.data.get('v.unemployment_rate_observations');
        let dates = await Wized.data.get('v.dates');

        // Truncate leading zeros
        let y = observationsInflation.findIndex(obs => obs !== 0); // Find first non-zero observation
        if (y === -1) y = observationsInflation.length; // If all are zeros, set y to length of array
        observationsInflation = observationsInflation.slice(y); // Remove leading zeros from observations
        observationsUnemployment = observationsUnemployment.slice(y); // Remove leading zeros from observations
        dates = dates.slice(y); // Remove corresponding dates

        // Parse the dates from "YYYY-MM-DD" format and convert them to "MM/YYYY" format using Moment.js
        dates = dates.map(dateStr => moment(dateStr).format('MM/YYYY'));

        // Creating a professional and clean line chart with a dark blue background
        const lineCtx = document.getElementById('lineChart');
        const myChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Core Inflation',
                    data: observationsInflation,
                    pointRadius: 0,
                    borderWidth: 1,
                    borderColor: 'green', // Set the line color to red
                    backgroundColor: 'green', // Set the point color to red (if you're using points)
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Core Inflation',
                        color: 'White',
                        font: {
                            size: 24, // Set title font size (e.g., 24 for a larger title)
                        }
                    },
                    legend: {
                        display: false
                    },
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'x', // Enable panning only in the X direction
                        },
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true,
                            },
                            mode: 'x', // Enable zooming only in the X direction
                            limits: {
                                x: { min: 'original', max: 'original' }, // Set zoom limits if needed
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
                            autoSkip: false, // Prevent automatic label skipping
                            maxRotation: 0, // Prevent label rotation
                            minRotation: 0,
                            padding: 10,
                            callback: function (value, index, values) {
                                var x = 5; // Replace with your desired number of parts
                                var interval = Math.ceil(values.length / x); // Calculate the interval for labels

                                // Always return the first and last label,
                                // and optionally return the label if it's not too crowded
                                if (index === 0 || index === values.length - 1 || index % interval === 0) {
                                    return dates[value];
                                } else {
                                    // Implement logic here to determine if intermediate labels should be shown
                                    // For example, return every nth label to reduce crowding
                                    // Uncomment and set 'n' to the desired skip interval
                                    // return index % n === 0 ? value : null;
                                }
                            }
                        },
                        grid: {
                            color: "rgba(92, 118, 223, 0.2)" // Sets the color of the x-axis grid lines
                        }
                    },
                    y: {
                        ticks: {
                            color: "#93afc5"
                        },
                        grid: {
                            color: "rgba(92, 118, 223, 0.2)" // Sets the color of the x-axis grid lines
                        }
                    }
                }
            }
        });
    });
}
