import React from 'react';
import './TotalEquity.sass';
import { Box } from '@material-ui/core';
import Chart from '../../Chart';

const TotalEquity = (props) => {
    return (
        <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start" className="totalEquity">
            <Box className="equityHeader" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
                    <span className="boxTitle">Total Equity</span>
                    <span className="bold">BTC 0.5346 <span className="smallText"> = USD 3450.6</span></span>
                </Box>
                <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center">
                    <label>Show</label>
                    <select>
                        <option>Last year</option>
                    </select>
                </Box>
            </Box>
            <Box className="equityGraph" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                <Chart />
            </Box>
        </Box>
    )
}

export default TotalEquity;