import React from 'react';
import './PositionFilters.sass';
import { Box } from '@material-ui/core';
import CustomButtom from '../../CustomButton';

const PositionFilters = (props) => {
    const {onClose} = props

    return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" className="positionFilters">
            <Box className="filters" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                <span className="title">Filters</span>
            </Box>
            <Box className="actions" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                <CustomButtom onCLick={onClose} className="text-purple">Clear All</CustomButtom>
                <CustomButtom onCLick={onClose} className="text-purple">Hide</CustomButtom>
            </Box>
        </Box>
    )
}

export default PositionFilters;