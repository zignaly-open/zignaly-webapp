import React from 'react';
import './CryptoComposition.sass';
import { Box, Typography } from '@material-ui/core';
import Doughnut from '../../Graphs/Doughnut';
import {FormattedMessage} from 'react-intl';

const CryptoComposition = (props) => {
    return (
        <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start" className="cryptoComposition">
            <Typography variant="h3" className="boxTitle"><FormattedMessage id="dashboard.balance.cryptocompo" /></Typography>
            <Doughnut />
        </Box>
    )
}

export default CryptoComposition;