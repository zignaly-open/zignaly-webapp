import React from 'react';
import './AvailableBalance.sass';
import { Box, Typography } from '@material-ui/core';

const AvailableBalance = (props) => {
    return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" className="availableBalance">
            <Box className="dataBox" display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
                <Box mb={1} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">Available </Typography>
                    <Typography variant="subtitle2" className="smallText"> = USD 3450.6</Typography>
                </Box>
                <Typography variant="h5">BTC 1.5646</Typography>
            </Box>
            <span className="operator">+</span>
            <Box className="dataBox" display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
                <Box mb={1} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">Invested </Typography>
                    <Typography variant="subtitle2" className="smallText"> = USD 3450.6</Typography>
                </Box>
                <Typography variant="h5">BTC 1.5646</Typography>
            </Box>
            <span className="operator">+</span>
            <Box className="dataBox" display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
                <Box mb={1} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">Profit </Typography>
                    <Typography variant="subtitle2" className="smallText"> = USD 3450.6</Typography>
                </Box>
                <Typography variant="h5">BTC 1.5646</Typography>
            </Box>
            <span className="operator">=</span>
            <Box className="dataBox" display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
                <Box mb={1} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">Total </Typography>
                    <Typography variant="subtitle2" className="smallText"> = USD 3450.6</Typography>
                </Box>
                <Typography variant="h5">BTC 1.5646</Typography>
            </Box>
        </Box>
    )
}

export default AvailableBalance;