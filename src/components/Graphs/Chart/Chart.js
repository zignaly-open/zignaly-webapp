import React, { useEffect } from 'react';
import './Chart.sass';
import { Box } from '@material-ui/core';
import {Chart} from 'chart.js';

const GenericChart = (props) => {

    useEffect(() => {
        let ctx = document.getElementById('myChart').getContext("2d");
        let background = ctx.createLinearGradient(0, 0, 0, 500);
        background.addColorStop(1, "rgba(216, 216, 216, 1)");
        background.addColorStop(0, "#a946f6");
        let border = "#770fc8";
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [
                    {
                        label: "Equity",
                        data: [100, 137, 161, 120, 200, 100, 137, 161, 120, 200, 150, 300],
                        backgroundColor: background,
                        borderColor: border,
                    }
                ]
            },
            options: {
                responsive: true,
                legend: {
                    display: false,
                },
                elements: {
                    point:{
                        radius: 0
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            display: true,
                            fontFamily: "PlexSans-Bold",
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        ticks: { display: false },
                        gridLines: {
                            display: false,
                        }
                    }]
                }
            }
        });
    }, [])

    return (
        <Box className="chart">
            <canvas id="myChart" className="chartCanvas"></canvas>
        </Box>
    )
}

export default GenericChart;