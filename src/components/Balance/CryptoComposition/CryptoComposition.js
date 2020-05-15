import React from 'react';
import './CryptoComposition.scss';
import { Box, Typography } from '@material-ui/core';
import Doughnut from '../../Graphs/Doughnut';

const CryptoComposition = (props) => {
    return (
        <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start" className="cryptoComposition">
            <Typography variant="h3" className="boxTitle">Crypto Composition</Typography>
            <Doughnut />
        </Box>
    )
}

export default CryptoComposition;