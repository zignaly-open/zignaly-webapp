import React from 'react';
import './CryptoComposition.sass';
import { Box } from '@material-ui/core';
import Doughnut from '../../Graphs/Doughnut';

const CryptoComposition = (props) => {
    return (
        <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start" className="cryptoComposition">
            <span className="boxTitle">Crypto Composition</span>
            <Doughnut />
        </Box>
    )
}

export default CryptoComposition;