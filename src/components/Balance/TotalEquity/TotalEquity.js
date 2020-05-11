import React from 'react';
import './TotalEquity.sass';
import { Box, Typography } from '@material-ui/core';
import Chart from '../../Graphs/Chart';

const TotalEquity = (props) => {
    return (
        <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start" className="totalEquity">
            <Box className="equityHeader" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
                    <Typography variant="h3" className="boxTitle">Total Equity</Typography>
                    <Box mt={1} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h4">BTC 0.5346 </Typography>
                        <Typography variant="subtitle2" className="smallText"> = USD 3450.6</Typography>
                    </Box>
                </Box>
                <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center">
                    <label>Show</label>
                    <select>
                        <option>Last year</option>
                    </select>
                </Box>
            </Box>
            <Chart type="line" id="myChart">
                <canvas id="myChart" className="chartCanvas"></canvas>
            </Chart>
        </Box>
    )
}

export default TotalEquity;