import React from 'react';
import './PositionFilters.scss';
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
                <CustomButtom onClick={onClose} className="textPurple">Clear All</CustomButtom>
                <CustomButtom onClick={onClose} className="textPurple">Hide</CustomButtom>
            </Box>
        </Box>
    )
}

export default PositionFilters;