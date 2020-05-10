import React from 'react';
import './AvailableBalance.sass';
import { Box } from '@material-ui/core';

const AvailableBalance = (props) => {
    return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" className="availableBalance">
            <Box className="dataBox" display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
                <span className="bold">Available <span className="smallText"> = USD 3450.6</span></span>
                <span className="coins">BTC 1.5646</span>
            </Box>
            <span className="operator">+</span>
            <Box className="dataBox" display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
                <span className="bold">Invested <span className="smallText"> = USD 3450.6</span></span>
                <span className="coins">BTC 1.5646</span>
            </Box>
            <span className="operator">+</span>
            <Box className="dataBox" display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
                <span className="bold">Profit <span className="smallText"> = USD 3450.6</span></span>
                <span className="coins">BTC 1.5646</span>
            </Box>
            <span className="operator">=</span>
            <Box className="dataBox" display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
                <span className="bold">Total <span className="smallText"> = USD 3450.6</span></span>
                <span className="coins">BTC 1.5646</span>
            </Box>
        </Box>
    )
}

export default AvailableBalance;