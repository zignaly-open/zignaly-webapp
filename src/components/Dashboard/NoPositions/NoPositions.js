import React from 'react';
import './NoPositions.sass';
import { Box, Typography } from '@material-ui/core';
import {FormattedMessage} from 'react-intl';
import CustomButton from '../../CustomButton';
import {navigate} from '@reach/router';

const NoPositions = () => {

    const redirect = () => {
        navigate("/copyTraders")
    }

    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" className="noPositions">
            <Typography variant="h3"><FormattedMessage id="dashboard.positions.nopositions" /></Typography>
            <CustomButton onClick={redirect} className="submit-btn"><FormattedMessage id="dashboard.browsetraders" /></CustomButton>
        </Box>
    )
}

export default NoPositions;